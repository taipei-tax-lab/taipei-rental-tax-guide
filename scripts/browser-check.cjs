/* Optional integration QA. Run against `npm run dev` with Playwright available. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const artifacts = '.preview';
fs.mkdirSync(artifacts, {recursive:true});

(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  const errors = [];
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}, reducedMotion:'reduce'});
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(base, {waitUntil:'domcontentloaded'});
    await page.locator('.v2-ready').waitFor();
    await page.screenshot({path:`${artifacts}/desktop-home.png`, fullPage:true});
    assert.equal(await page.locator('[data-page]:visible').count(), 1);
    assert.equal(await page.locator('.v2-plan-card:visible').count(), 4);
    for (const id of ['ordinary','public','social','personal']) {
      await page.locator(`#card-${id}`).click();
      await page.locator(`[data-page="plan-${id}"]:visible`).waitFor();
      assert.ok(await page.locator('#inline-plan-slot > .v2-inline-plan').isVisible());
      assert.ok(await page.locator('.v2-plan-grid').isVisible());
      assert.equal(await page.locator(`#card-${id}`).getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator(`[data-page="plan-${id}"] .v2-tax`).count(), 3);
      await page.locator(`[data-page="plan-${id}"] .v2-detail-more details`).filter({hasText:'辦理順序與應備資料'}).locator('summary').click();
      assert.ok(await page.locator(`[data-page="plan-${id}"] .v2-two-columns`).isVisible());
      await page.locator(`[data-page="plan-${id}"] .v2-back`).click();
    }
    await page.locator('#card-public').click();
    await page.locator('#card-social').click();
    assert.equal(await page.locator('.v2-inline-plan:visible').count(), 1);
    await page.setViewportSize({width:390,height:844});
    await page.locator('[data-page="home"][hidden]').waitFor({state:'attached'});
    assert.ok(await page.locator('[data-page="plan-social"]').isVisible());
    assert.equal(await page.locator('.v2-inline-plan').count(), 0);
    await page.setViewportSize({width:1440,height:1000});
    await page.locator('#inline-plan-slot > .v2-inline-plan').waitFor();
    await page.locator('[data-page="plan-social"] .v2-back').click();
    await page.locator('#guide > summary').click();
    await page.getByRole('button',{name:'我自己處理',exact:true}).click();
    await page.getByRole('button',{name:'不確定房客的補貼資格',exact:true}).click();
    assert.equal(await page.locator('.v2-guide-result-list a').count(), 2);
    assert.deepEqual(await page.locator('.v2-answer-summary li').allTextContents(), ['我自己處理','不確定房客的補貼資格']);
    assert.equal(await page.locator('.v2-recommendation-primary').count(), 1);
    assert.equal(await page.locator('.v2-pending-condition').count(), 2);
    await page.getByRole('button',{name:'← 上一題',exact:true}).click();
    await page.getByRole('button',{name:'符合資格，或已取得補貼',exact:true}).click();
    assert.deepEqual(await page.locator('.v2-answer-summary li').allTextContents(), ['我自己處理','符合資格，或已取得補貼']);
    await page.locator('.v2-guide-result-list a').click();
    await page.locator('[data-page="plan-public"]:visible').waitFor();
    await page.screenshot({path:`${artifacts}/desktop-plan.png`,fullPage:true});
    await page.goBack();
    await page.locator('.v2-inline-plan').waitFor({state:'detached'});
    await page.locator('[data-page="home"]:visible').waitFor();
    assert.ok(await page.locator('.v2-guide-result').isVisible());
    await page.locator('[data-audience="tenant"]').click();
    await page.locator('[data-audience-panel="owner"][hidden]').waitFor({state:'attached'});
    assert.equal(await page.locator('.v2-plan-card:visible').count(), 0);
    for (const group of await page.locator('.v2-tenant-card').all()) {
      await group.locator('summary').click();
      assert.ok(await group.locator('.v2-tenant-links').isVisible());
    }
    assert.equal(await page.locator('.v2-tenant-links a:visible').count(), 10);
    await page.goto(base + '#plan-personal', {waitUntil:'domcontentloaded'});
    await page.locator('[data-page="plan-personal"]:visible').waitFor();
    await page.reload({waitUntil:'domcontentloaded'});
    assert.ok(await page.locator('[data-page="plan-personal"]').isVisible());
    for (const width of [1024,768,390,320]) {
      await page.setViewportSize({width,height:844});
      for (const hash of ['#owners','#plan-public','#comparison','#tenants']) {
        await page.goto(base + hash, {waitUntil:'domcontentloaded'});
        await page.locator('.v2-ready').waitFor();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, `Horizontal overflow at ${width}px ${hash}`);
      }
      if (width === 390) {
        await page.goto(base + '#owners', {waitUntil:'domcontentloaded'});
        await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`${artifacts}/mobile-home.png`,fullPage:true});
        await page.locator('#card-public').click();
        await page.screenshot({path:`${artifacts}/mobile-plan.png`,fullPage:true});
      }
    }
    await page.goto(base + '#comparison', {waitUntil:'domcontentloaded'});
    const firstSelect = page.locator('[data-compare-select="0"]');
    const secondSelect = page.locator('[data-compare-select="1"]');
    await firstSelect.selectOption('social');
    await secondSelect.selectOption('personal');
    assert.deepEqual(await page.locator('[data-compare-plan]:visible').evaluateAll(cards => cards.map(c => c.dataset.comparePlan)), ['social','personal']);
    await firstSelect.selectOption('personal');
    assert.notEqual(await firstSelect.inputValue(), await secondSelect.inputValue());
    assert.equal(await page.locator('[data-compare-plan]:visible').count(), 2);
    await page.screenshot({path:`${artifacts}/mobile-comparison.png`,fullPage:true});
    await page.setViewportSize({width:1280,height:900});
    await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-compare-plan]')).every(card => !card.hidden));
    assert.equal(await page.locator('[data-compare-plan]:visible').count(), 4);
    const aligned = await page.locator('.v2-compare-card dl').evaluateAll(lists => Array.from(lists[0].children).every((_, row) => {
      const tops = lists.map(list => list.children[row].getBoundingClientRect().top);
      return Math.max(...tops) - Math.min(...tops) < 2;
    }));
    assert.ok(aligned, 'Comparison rows align across plans');
    await page.goto(base + '#comparison', {waitUntil:'domcontentloaded'});
    await page.screenshot({path:`${artifacts}/desktop-comparison.png`,fullPage:true});
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, '200% text creates overflow');

    // Same-document routing preserves a single chat component, even while open.
    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    const chatState = await page.evaluate(() => ({loaded: !!customElements.get('df-messenger-chat-bubble')}));
    if (chatState.loaded) {
      await page.waitForFunction(() => !!document.querySelector('.assistant-panel'));
      for (const width of [1440,390,320]) {
        await page.setViewportSize({width,height:950});
        await page.goto(base, {waitUntil:'load'});
        await page.waitForFunction(() => !!document.querySelector('.assistant-panel'));
        const bubble = page.locator('df-messenger-chat-bubble .close-button');
        await page.locator('#open-helper').click();
        await page.waitForFunction(() => document.querySelector('df-messenger-chat-bubble').shadowRoot.querySelector('.close-button').getAttribute('aria-expanded') === 'true');
        await page.waitForFunction(() => {
          let active = document.activeElement;
          while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
          return active?.matches('input, textarea');
        });
        await page.keyboard.insertText('尚未送出的草稿');
        await page.evaluate(() => document.getElementById('open-helper').click());
        assert.equal(await page.locator('df-messenger').getByRole('textbox').inputValue(), '尚未送出的草稿');
        await page.locator('df-messenger').getByRole('textbox').fill('');
        const bounds = await page.locator('df-messenger-chat-bubble .chat-wrapper').first().boundingBox();
        assert.ok(bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `Chat horizontal bounds at ${width}`);
        assert.ok(bounds.y >= -1 && bounds.y + bounds.height <= 950, `Chat vertical bounds at ${width}`);
        await page.evaluate(() => { window.originalChat = document.querySelector('df-messenger'); location.hash = '#plan-public'; });
        await page.locator('[data-page="plan-public"]:visible').waitFor();
        assert.ok(await page.evaluate(() => window.originalChat === document.querySelector('df-messenger')));
        await bubble.click();
        await page.waitForFunction(() => document.querySelector('df-messenger-chat-bubble').shadowRoot.querySelector('.close-button').getAttribute('aria-expanded') === 'false');
      }
      await page.setViewportSize({width:1440,height:1000});
      await page.goto(base,{waitUntil:'load'});
      await page.waitForFunction(() => !!document.querySelector('.assistant-panel'));
      await page.screenshot({path:`${artifacts}/desktop-home-chat.png`,fullPage:true});
      await page.setViewportSize({width:390,height:844});
      await page.screenshot({path:`${artifacts}/mobile-home-chat.png`,fullPage:true});
    }

    // Main information must work even if the whole external chat service is unreachable.
    const offlineChat = await browser.newContext({viewport:{width:390,height:844}});
    await offlineChat.route('https://**/*', route => route.abort());
    const offlinePage = await offlineChat.newPage();
    await offlinePage.goto(base, {waitUntil:'domcontentloaded'});
    await offlinePage.locator('#card-public').click();
    assert.ok(await offlinePage.locator('[data-page="plan-public"] .v2-next-step').isVisible());
    await offlineChat.close();

    const nojs = await browser.newContext({javaScriptEnabled:false});
    const nojsPage = await nojs.newPage();
    await nojsPage.goto(base, {waitUntil:'domcontentloaded'});
    assert.equal(await nojsPage.locator('.v2-plan-card').count(),4);
    assert.equal(await nojsPage.locator('[data-page^="plan-"] .v2-tax').count(),12);
    await nojs.close();
    fs.writeFileSync(`${artifacts}/browser-results.json`, JSON.stringify({errors, chatLoaded:chatState.loaded, checked:['four plans and return','guidance previous and result','10 tenant resource links','direct links and reload','320–1440px overflow','200% text','chat-unavailable fallback','no-JS tax content',...(chatState.loaded ? ['chat open/close at 320/390/1440px','same chat instance across route changes'] : [])]},null,2));
    assert.deepEqual(errors, []);
    console.log('Browser integration checks passed. Screenshots in .preview/.');
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
