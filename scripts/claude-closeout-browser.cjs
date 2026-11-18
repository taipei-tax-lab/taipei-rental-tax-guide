// Test an isolated Pages build or the HTTPS test site. No questions reach CX.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const baseline = process.argv.includes('--baseline');
const base = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4175/');
const output = process.env.EVIDENCE_DIR || '.preview/claude-closeout';
const tlsDiagnostic = process.env.BROWSER_IGNORE_HTTPS_ERRORS === '1';
const sideImage = /\/assistant-(idle|welcome|thinking|guiding|responding|error)\.(webp|png)$/;
const launcher = 'df-messenger-chat-bubble .bubble';
assert.ok(output.startsWith('.preview/') && !output.split('/').includes('..'));

async function withPage(browser, viewport, run) {
  const context = await browser.newContext({viewport, hasTouch: true, ignoreHTTPSErrors: tlsDiagnostic});
  const blockedHosts = new Set();
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (route.request().method() === 'GET' && (url.origin === base.origin ||
        (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/dialogflow-console/fast/df-messenger/')))) {
      return route.continue();
    }
    blockedHosts.add(url.hostname);
    return route.abort();
  });
  const page = await context.newPage();
  try {
    await run(page, context);
    return [...blockedHosts].sort();
  } finally {
    await context.close();
  }
}

async function load(page, route, font) {
  await page.goto(new URL('#' + route, base).href);
  await page.locator('.assistant-panel').waitFor({state: 'attached'});
  await page.waitForFunction(() => document.querySelector('df-messenger-chat-bubble')?.shadowRoot
    ?.querySelector('[data-assistant-chat-bubble-icon]')?.naturalWidth > 0);
  await page.addStyleTag({content: `html{font-size:${font}% !important} html{scroll-behavior:auto !important}`});
}

async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function assistantImages(browser) {
  const rows = [];
  const scenarios = [
    [320, 640, 100], [390, 844, 100], [390, 844, 200], [844, 390, 100],
    [899, 900, 100], [900, 519, 100], [900, 520, 100], [900, 900, 100], [1440, 900, 100],
  ];
  for (const [width, height, font] of scenarios) {
    const requests = new Map();
    const phases = [];
    const wide = width >= 900 && height >= 520;
    let phase, topicCalls = 0;
    const blockedHosts = await withPage(browser, {width, height}, async (page, context) => {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
      cdp.on('Network.requestWillBeSent', event => {
        if (!sideImage.test(new URL(event.request.url).pathname)) return;
        requests.set(event.requestId, {phase, url: event.request.url, initiator: event.initiator.type});
      });
      cdp.on('Network.responseReceived', event => {
        const request = requests.get(event.requestId);
        if (request) request.status = event.response.status;
      });
      cdp.on('Network.loadingFinished', event => {
        const request = requests.get(event.requestId);
        if (request) request.transferBytes = event.encodedDataLength;
      });
      cdp.on('Network.loadingFailed', event => {
        const request = requests.get(event.requestId);
        if (request) request.failure = event.errorText;
      });
      const panel = page.locator('.assistant-panel');
      const bubble = page.locator(launcher);
      const open = () => page.locator('#open-helper').click();
      const close = async () => {
        const shortClose = page.locator('.rental-chat-close:visible');
        await (await shortClose.count() ? shortClose : bubble).tap();
        await page.waitForFunction(() => document.querySelector('df-messenger-chat-bubble').shadowRoot
          .querySelector('.bubble').getAttribute('aria-expanded') === 'false');
      };
      const emit = name => page.evaluate(name => document.dispatchEvent(new CustomEvent(name)), name);

      let lastImageAttributes = [null, null];
      async function step(name, visible, act, expectedState, delay = 225) {
        phase = name;
        await act();
        await page.waitForTimeout(delay);
        if (visible && !baseline) {
          await page.waitForFunction(state => {
            const panel = document.querySelector('.assistant-panel');
            const image = panel.querySelector('img');
            const chat = document.querySelector('df-messenger-chat-bubble').shadowRoot.querySelector('.chat-wrapper');
            const panelRect = panel.getBoundingClientRect();
            const chatRect = chat.getBoundingClientRect();
            // Allow the vendor's opening transition and geometry observer to settle.
            return panel.dataset.state === state && image.complete && image.naturalWidth > 0 &&
              image.currentSrc.endsWith('/assistant-' + state + '.webp') &&
              Math.abs(chatRect.left - panelRect.right + 1) <= 1 && Math.abs(chatRect.top - panelRect.top) <= 1;
          }, expectedState, {timeout: 1000});
        }
        const observed = await panel.evaluate(element => {
          const picture = element.querySelector('img');
          const chat = document.querySelector('df-messenger-chat-bubble').shadowRoot.querySelector('.chat-wrapper');
          const panelRect = element.getBoundingClientRect();
          const chatRect = chat.getBoundingClientRect();
          return {
            gap: element.hidden ? null : chatRect.left - panelRect.right,
            topDifference: element.hidden ? null : chatRect.top - panelRect.top,
            visible: !element.hidden && getComputedStyle(element).visibility === 'visible',
            state: element.dataset.state, image: picture.currentSrc || null,
            imageAttributes: [picture.getAttribute('src'), element.querySelector('source').getAttribute('srcset')],
            ready: picture.complete && picture.naturalWidth > 0
          };
        });
        assert.equal(observed.visible, visible, `${width}×${height} ${name} visibility`);
        if (visible && !baseline) {
          assert.equal(observed.state, expectedState, name);
          assert.ok(Math.abs(observed.gap + 1) <= 1 && Math.abs(observed.topDifference) <= 1,
            `${name} panel alignment: ${JSON.stringify(observed)}`);
          assert.ok(observed.ready && observed.image.endsWith(`assistant-${expectedState}.webp`),
            `${name} rendered state: ${JSON.stringify(observed)}`);
        }
        if (!visible && !baseline) assert.deepEqual(observed.imageAttributes, lastImageAttributes, name);
        lastImageAttributes = observed.imageAttributes;
        phases.push({name, ...observed});
      }

      await step('initial', false, () => load(page, 'top', font));
      await step('open', wide, open, 'welcome');
      if (wide) {
        await page.evaluate(() => {
          const messenger = document.querySelector('df-messenger');
          window.testTopicCalls = 0;
          messenger.sendQuery = () => { window.testTopicCalls++; return Promise.resolve(); };
        });
        await step('popular-topic', true, () => panel.locator('.messenger-topic').first().click(), 'guiding');
        topicCalls = await page.evaluate(() => window.testTopicCalls);
        assert.equal(topicCalls, 1);
      }
      await step('thinking', wide, () => emit('df-request-sent'), 'thinking', 850);
      await step('responding', wide, () => emit('df-response-received'), 'responding');
      await step('error', wide, () => emit('df-messenger-error'), 'error');
      if (width === 390 && font === 200) {
        await step('resize-wide', true, () => page.setViewportSize({width: 900, height: 900}), 'error');
        await step('resize-narrow-during-swap', false, async () => {
          await page.evaluate(() => {
            document.dispatchEvent(new CustomEvent('df-response-received'));
            document.dispatchEvent(new CustomEvent('df-request-sent'));
          });
          await page.setViewportSize({width, height});
        });
        await step('resize-wide-latest', true, () => page.setViewportSize({width: 900, height: 900}), 'thinking');
        await step('resize-short', false, () => page.setViewportSize({width: 1000, height: 519}));
        await step('rotate-narrow', false, () => page.setViewportSize({width: 844, height: 390}));
        await step('resize-original', false, () => page.setViewportSize({width, height}));
      }
      await step('idle-after-timeout', wide, () => emit('df-messenger-error'), 'idle', 2150);
      await step('close', false, close);
      await step('reopen', wide, open, 'welcome');
      await step('close-again', false, close);
    });
    const network = [...requests.values()];
    if (!baseline) {
      const hiddenPhases = new Set(phases.filter(entry => !entry.visible).map(entry => entry.name));
      assert.deepEqual(network.filter(request => hiddenPhases.has(request.phase)), [],
        `${width}×${height} ${font}% hidden panel made image requests`);
      assert.ok(network.every(request => request.status === 200), JSON.stringify(network));
      if (wide) assert.equal(network.filter(request => request.phase === 'open').length, 1);
    }
    rows.push({width, height, font, phases, requests: network, topicCalls, blockedHosts});
  }
  return rows;
}

async function launcherPositions(browser) {
  const runs = [];
  for (const [width, height] of [[320,640], [390,844], [414,896], [844,390], [1440,900]]) {
    for (const font of [100,150,200]) {
      for (const route of ['top', 'direct-apply']) {
        let samples;
        const blockedHosts = await withPage(browser, {width,height}, async page => {
          await load(page, route, font);
          await page.evaluate(() => document.fonts.ready);
          samples = await page.evaluate(async () => {
            const root = document.querySelector('df-messenger-chat-bubble').shadowRoot;
            const button = root.querySelector('.bubble');
            const art = root.querySelector('[data-assistant-art-hit]');
            const actions = [...document.querySelectorAll('.v2-site a,.v2-site button,.v2-site summary')];
            const max = document.documentElement.scrollHeight - innerHeight;
            const offsets = [...Array.from({length: Math.ceil(max / 32)}, (_, i) => i * 32), max];
            const rows = [];
            for (const [direction, points] of [['down', offsets], ['up', offsets.slice().reverse()]]) {
              for (const offset of points) {
                scrollTo(0,offset);
                // Sample after this frame's actual scroll listeners and animation callbacks.
                await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve,0)));
                const r = button.getBoundingClientRect();
                const a = art?.getBoundingClientRect();
                const regions = a ? [r,a] : [r];
                const visible = getComputedStyle(button).visibility === 'visible';
                const overlap = visible && actions.some(action => {
                  const t = action.getBoundingClientRect();
                  return t.width > 0 && t.height > 0 && regions.some(region =>
                    t.left < region.right && t.right > region.left && t.top < region.bottom && t.bottom > region.top);
                });
                const hitsButton = (x,y) => root.elementFromPoint(x,y)?.closest('button') === button;
                const hit = hitsButton(r.x+r.width/2,r.y+r.height/2);
                const artHit = a ? hitsButton(a.x+a.width/2,a.top+3) : null;
                const fits = regions.every(region =>
                  region.left >= -0.01 && region.top >= -0.01 &&
                  region.right <= innerWidth+0.01 && region.bottom <= innerHeight+0.01);
                rows.push([direction,scrollY,r.x,r.y,r.width,r.height,visible,Boolean(overlap),hit,
                  a ? [a.x,a.y,a.width,a.height] : null,artHit,fits]);
              }
            }
            return rows;
          });
        });
        const hidden = samples.filter(sample => !sample[6]).length;
        let maxJump = 0, moves = 0, hiddenRun = 0, maxHiddenSpan = 0, recoveries = 0;
        let hiddenStart;
        for (const [index, current] of samples.entries()) {
          const previous = samples[index - 1];
          if (!current[6]) {
            if (!hiddenRun) hiddenStart = current[1];
            hiddenRun++;
            maxHiddenSpan = Math.max(maxHiddenSpan, Math.abs(current[1] - hiddenStart));
          } else {
            if (hiddenRun) recoveries++;
            hiddenRun = 0;
          }
          if (previous?.[6] && current[6]) {
            const jump = Math.hypot(current[2] - previous[2], current[3] - previous[3]);
            maxJump = Math.max(maxJump, jump);
            if (jump) moves++;
          }
          assert.ok(!current[7] && current[6] === current[8] &&
            (!current[9] || (current[6] === current[10] && (!current[6] || current[11]))),
            `Launcher hit mismatch: ${width}×${height} ${font}% ${route} ${JSON.stringify(current)}`);
        }
        assert.ok(samples.at(-1)[6], 'Launcher must recover at the starting position');
        runs.push({width,height,font,route,hidden,total:samples.length,maxJump,moves,
          maxHiddenSpan,recoveries,samples,blockedHosts});
      }
    }
  }
  return runs;
}

async function launcherControls(browser) {
  const results = [];
  for (const [width,height,font] of [[320,640,200], [390,844,150], [414,896,100], [844,390,200], [1440,900,100]]) {
    await withPage(browser, {width,height}, async page => {
      const actions = [
        ['top', '.v2-income-standard-actions a, #open-helper, .v2-audience > a'],
        ['direct-apply', '.v2-application-item, .v2-forms a, footer a[href="#operation-guide"]']
      ];
      for (const [route, selector] of actions) {
        await load(page, route, font);
        const bubble = page.locator(launcher);
        const focusTrace = [];
        await page.evaluate(() => scrollTo(0,0));
        await settle(page);
        await bubble.focus();
        const focusAtStart = await bubble.evaluate(e => e.getRootNode().activeElement === e);
        assert.ok(focusAtStart);
        const links = [];
        for (const link of await page.locator(selector).all()) {
          await link.scrollIntoViewIfNeeded();
          await link.evaluate(element => {
            const r = element.getBoundingClientRect();
            scrollBy(0, r.y + Math.min(r.height / 2, 40) - (innerHeight - 40));
          });
          await settle(page);
          focusTrace.push(await bubble.evaluate(e => ({
            scrollY, visible: getComputedStyle(e).visibility === 'visible',
            focused: e.getRootNode().activeElement === e
          })));
          links.push(link);
        }
        await page.evaluate(() => scrollTo(0,0));
        await settle(page);
        assert.ok(await bubble.isVisible());
        const focusAfterScroll = await bubble.evaluate(e => e.getRootNode().activeElement === e);
        let taps = 0, enters = 0;
        for (const link of links) {
          await link.scrollIntoViewIfNeeded();
          await link.evaluate(element => {
            const r = element.getBoundingClientRect();
            scrollBy(0, r.y + Math.min(r.height / 2, 40) - (innerHeight - 40));
            window.testActionEvents = 0;
            element.addEventListener('click', function suppress(event) {
              event.preventDefault();
              event.stopImmediatePropagation();
              window.testActionEvents++;
              if (window.testActionEvents === 2) element.removeEventListener('click', suppress, true);
            }, true);
          });
          await settle(page);
          const position = await link.evaluate(element => {
            const r = element.getBoundingClientRect();
            const x = (Math.max(0,r.left) + Math.min(innerWidth,r.right)) / 2;
            const y = (Math.max(0,r.top) + Math.min(innerHeight,r.bottom)) / 2;
            const hit = document.elementFromPoint(x,y);
            return {x:x-r.left,y:y-r.top,hit:element.contains(hit)};
          });
          assert.ok(position.hit, `${width}×${height} ${route} ${await link.textContent()}`);
          await link.tap({position:{x:position.x,y:position.y}});
          assert.equal(await page.evaluate(() => window.testActionEvents), 1);
          taps++;
          await link.focus();
          await page.keyboard.press('Enter');
          assert.equal(await page.evaluate(() => window.testActionEvents), 2);
          enters++;
        }
        results.push({width,height,font,route,taps,enters,focusAtStart,focusAfterScroll,focusTrace});
      }
    });
  }
  return results;
}

async function launcherScale(browser) {
  const rows = [];
  const original = process.argv.includes('--original');
  for (const [width,height,font] of [
    [1440,900,100],[1892,873,100],[320,640,100],[320,640,200],[390,844,150],
    [414,896,200],[844,390,100],[844,390,200],[560,800,100],[561,800,100]
  ]) {
    await withPage(browser, {width,height}, async page => {
      await load(page, 'top', font);
      await page.evaluate(() => scrollTo(0,0));
      await settle(page);
      const row = await page.evaluate(() => {
        const root = document.querySelector('df-messenger-chat-bubble').shadowRoot;
        const button = root.querySelector('.bubble');
        const image = root.querySelector('[data-assistant-chat-bubble-icon]');
        const art = root.querySelector('[data-assistant-art-hit]');
        const b = button.getBoundingClientRect();
        const r = image.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image,0,0);
        const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
        const left = canvas.width, top = canvas.height;
        const alpha = [left,top,0,0];
        let prompt, character;
        const hitsButton = (x,y) => root.elementFromPoint(x,y)?.closest('button') === button;
        for (let y=0; y<canvas.height; y++) {
          for (let x=0; x<canvas.width; x++) {
            const opacity = data[(y*canvas.width+x)*4+3];
            if (!opacity) continue;
            alpha[0] = Math.min(alpha[0],x);
            alpha[1] = Math.min(alpha[1],y);
            alpha[2] = Math.max(alpha[2],x+1);
            alpha[3] = Math.max(alpha[3],y+1);
            if (opacity < 250) continue;
            const px = r.left + (x+0.5)*r.width/canvas.width;
            const py = r.top + (y+0.5)*r.height/canvas.height;
            if (px < 0 || px >= innerWidth || py < 0 || py >= innerHeight) continue;
            if (!prompt && py < b.top-4 && y>24) prompt = [px,py,hitsButton(px,py)];
            if (!character && py > b.bottom+4 && y>315) character = [px,py,hitsButton(px,py)];
          }
        }
        const artwork = [r.left+alpha[0]*r.width/canvas.width,r.top+alpha[1]*r.height/canvas.height,
          r.left+alpha[2]*r.width/canvas.width,r.top+alpha[3]*r.height/canvas.height];
        const transparentX = r.left+r.width*0.94;
        const transparentY = r.top+7;
        return {button:b.toJSON(),image:r.toJSON(),alpha,artwork,artHit:art?.getBoundingClientRect().toJSON(),
          visible:getComputedStyle(button).visibility === 'visible',character,prompt,
          transparentHit:hitsButton(transparentX,transparentY),
          transparentInViewport:transparentX < innerWidth && transparentY >= 0 && transparentY < innerHeight};
      });
      const size = width <= 560 ? 72 : 84;
      const scale = width <= 560 ? 132 : 150;
      const expected = baseline ? size : scale;
      assert.deepEqual([row.button.width,row.button.height],[size,size]);
      assert.deepEqual([row.image.width,row.image.height],[expected,expected]);
      if (!baseline && !original) {
        assert.ok(row.visible, `${width}×${height} ${font}% top should leave room for the launcher`);
        assert.deepEqual(row.alpha,[4,0,322,360]);
        assert.ok(row.artwork[0]>=0 && row.artwork[1]>=0 && row.artwork[2]<=width && row.artwork[3]<=height);
        const hit = row.artHit;
        for (const [actual,wanted] of [[hit.left,row.artwork[0]],[hit.top,row.artwork[1]],
          [hit.right,row.artwork[2]],[hit.bottom,row.artwork[3]]]) assert.ok(Math.abs(actual-wanted)<0.03);
        assert.ok(row.transparentInViewport && !row.transparentHit);
        assert.ok(row.character?.[2] && row.prompt?.[2]);
      }
      await page.screenshot({path:path.join(output,`scale-${width}x${height}-${font}.png`)});
      if (!baseline && !original) {
        const bubble = page.locator(launcher);
        const point = width <= 560 ? row.character : row.prompt;
        await page.touchscreen.tap(point[0],point[1]);
        await page.waitForFunction(() => document.querySelector('df-messenger-chat-bubble').shadowRoot
          .querySelector('.bubble').getAttribute('aria-expanded') === 'true');
        const close = height < 400 ? page.locator('.rental-chat-close:visible') : bubble;
        await close.focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.querySelector('df-messenger-chat-bubble').shadowRoot
          .querySelector('.bubble').getAttribute('aria-expanded') === 'false');
        await settle(page);
        assert.ok(await bubble.evaluate(e => e.getRootNode().activeElement === e));
        row.touchOpened = row.keyboardClosedWithFocus = true;
      }
      rows.push({width,height,font,...row});
    });
  }
  return rows;
}

async function main() {
  fs.mkdirSync(output, {recursive: true});
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium',
    ...(process.env.BROWSER_PROXY ? {proxy: {server: process.env.BROWSER_PROXY}} : {})
  });
  try {
    const scope = {base: base.origin, baseline, tlsDiagnostic, vendor: 'Google static shell; CX API blocked'};
    if (process.argv.includes('--scale-only')) {
      const rows = await launcherScale(browser);
      fs.writeFileSync(path.join(output, 'scale.json'), JSON.stringify({...scope, rows},null,2));
      console.log(`Launcher scale: ${rows.length} viewport and font combinations checked`);
      return;
    }
    if (process.argv.includes('--controls-only')) {
      const controls = await launcherControls(browser);
      fs.writeFileSync(path.join(output, 'controls.json'), JSON.stringify({...scope, controls}, null, 2));
      console.log(`CQA-02 PASS: ${controls.reduce((n,r) => n+r.taps,0)} taps and Enter activations each`);
      return;
    }
    if (!process.argv.includes('--launcher-only')) {
      const rows = await assistantImages(browser);
      fs.writeFileSync(path.join(output, 'images.json'), JSON.stringify({...scope, rows}, null, 2));
      console.log(`CQA-01 ${baseline ? 'baseline measured' : 'PASS'}: ${rows.length} fresh contexts`);
    }
    if (!process.argv.includes('--images-only')) {
      const runs = await launcherPositions(browser);
      const sampleFields = ['direction','scrollY','x','y','width','height','visible','actionOverlap','launcherHit','artRect','artHit','regionsFitViewport'];
      fs.writeFileSync(path.join(output, 'launcher.json'), JSON.stringify({...scope,sampleFields,runs}));
      console.log(`CQA-02 PASS: ${runs.length} scroll runs, ${runs.reduce((n,r) => n+r.total,0)} samples`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
