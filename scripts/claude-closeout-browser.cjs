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
            return panel.dataset.state === state && image.complete && image.naturalWidth > 0 &&
              image.currentSrc.endsWith('/assistant-' + state + '.webp');
          }, expectedState, {timeout: 1000});
        }
        const observed = await panel.evaluate(element => {
          const picture = element.querySelector('img');
          return {
            visible: !element.hidden && getComputedStyle(element).visibility === 'visible',
            state: element.dataset.state, image: picture.currentSrc || null,
            imageAttributes: [picture.getAttribute('src'), element.querySelector('source').getAttribute('srcset')],
            ready: picture.complete && picture.naturalWidth > 0
          };
        });
        assert.equal(observed.visible, visible, `${width}×${height} ${name} visibility`);
        if (visible && !baseline) {
          assert.equal(observed.state, expectedState, name);
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
        const samples = [];
        const blockedHosts = await withPage(browser, {width,height}, async page => {
          await load(page, route, font);
          await page.evaluate(() => document.fonts.ready);
          // Use the same absolute scroll offsets in both directions and both builds.
          const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
          const offsets = [...Array.from({length: Math.ceil(max / 32)}, (_, i) => i * 32), max];
          for (const [direction, points] of [['down', offsets], ['up', offsets.slice().reverse()]]) {
            for (const offset of points) {
              await page.evaluate(y => scrollTo(0,y), offset);
              await settle(page);
              samples.push(await page.evaluate(direction => {
                const root = document.querySelector('df-messenger-chat-bubble').shadowRoot;
                const button = root.querySelector('.bubble');
                const r = button.getBoundingClientRect();
                const visible = getComputedStyle(button).visibility === 'visible';
                const overlap = visible && [...document.querySelectorAll('.v2-site a,.v2-site button,.v2-site summary')]
                  .some(action => {
                    const a = action.getBoundingClientRect();
                    return a.width > 0 && a.height > 0 && a.left < r.right && a.right > r.left &&
                      a.top < r.bottom && a.bottom > r.top;
                  });
                const hit = root.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button') === button;
                return [direction,scrollY,r.x,r.y,r.width,r.height,visible,Boolean(overlap),hit];
              }, direction));
            }
          }
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
          assert.ok(!current[7] && current[6] === current[8],
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

async function main() {
  fs.mkdirSync(output, {recursive: true});
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium',
    ...(process.env.BROWSER_PROXY ? {proxy: {server: process.env.BROWSER_PROXY}} : {})
  });
  try {
    const scope = {base: base.origin, baseline, tlsDiagnostic, vendor: 'Google static shell; CX API blocked'};
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
      const sampleFields = ['direction','scrollY','x','y','width','height','visible','actionOverlap','launcherHit'];
      fs.writeFileSync(path.join(output, 'launcher.json'), JSON.stringify({...scope,sampleFields,runs}));
      console.log(`CQA-02 PASS: ${runs.length} scroll runs, ${runs.reduce((n,r) => n+r.total,0)} samples`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
