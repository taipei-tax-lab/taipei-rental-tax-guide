/* Optional integration QA. Run against `npm run dev` with Playwright available. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const artifacts = '.preview/pages-live';
if (!process.env.ALLOW_LOCAL_PREVIEW) {
  assert.equal(new URL(base).protocol,'https:','Live acceptance requires actual HTTPS');
  assert.ok(new URL(base).hostname.endsWith('.pages.dev'),'Expected Pages HTTPS host');
}
const tenantItems = JSON.parse(fs.readFileSync(path.join(__dirname, '../site/content.json'), 'utf8')).tenants;
assert.ok(Array.isArray(tenantItems) && tenantItems.length > 0, 'site/content.json must define tenant/service items');
fs.mkdirSync(artifacts, {recursive:true});

(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  const errors = [];
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}, reducedMotion:'reduce'});
    const gaRequests=[],consoleErrors=[];
    page.on('console',msg=>{if(msg.type()==='error'&&!/net::ERR_FAILED|net::ERR_BLOCKED_BY_CLIENT/.test(msg.text()))consoleErrors.push(msg.text());});
    page.on('request',req=>{if(/googletagmanager\.com|google-analytics\.com/.test(req.url()))gaRequests.push(req.url());});
    await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin ? route.continue() : route.abort());
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(base, {waitUntil:'domcontentloaded'});
    await page.locator('.v2-ready').waitFor();
    await page.screenshot({path:`${artifacts}/desktop-home.png`, fullPage:true});
    assert.equal(await page.locator('.v2-audience > .v2-audience-button').count(),6);
    assert.ok(await page.locator('#open-helper').isVisible()); // Presence only; CX opening is excluded.
    assert.equal(await page.locator('.v2-income-standard-entry').getAttribute('href'),'https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php');
    for(const hash of ['direct-apply','operation-guide']) {
      await page.locator(`.v2-audience a[href="#${hash}"]`).click();
      await page.locator(`[data-page="${hash}"]:visible`).waitFor();
      await page.locator('.v2-brand').click();
      await page.locator('[data-page="home"]:visible').waitFor();
    }
    assert.equal(await page.locator('[data-page]:visible').count(), 1);
    assert.equal(await page.locator('.v2-plan-card:visible').count(), 4);
    const unitDisplays = await page.locator('.v2-other-taxes .v2-unit').evaluateAll(els => els.map(el => getComputedStyle(el).display));
    assert.ok(unitDisplays.length > 0 && unitDisplays.every(d => d === 'inline'), 'All .v2-other-taxes .v2-unit must be display: inline');
    const planNameWraps = await page.locator('.v2-plan-name').evaluateAll(els => els.map(el => getComputedStyle(el).textWrap));
    assert.ok(planNameWraps.every(w => w !== 'balance'), '.v2-plan-name must not have text-wrap: balance');

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
    assert.equal(await page.locator('.v2-tenant-links a:visible').count(), tenantItems.length);
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

    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    await page.goto(base+'#direct-apply');
    assert.equal(await page.locator('.v2-application-item:visible').count(),4);
    const data=JSON.parse(fs.readFileSync('site/content.json','utf8'));
    for(const plan of data.plans) {
      const article=page.locator(`article[aria-labelledby="apply-${plan.id}"]`);
      assert.ok((await article.innerText()).includes(plan.applicationMode));
      for(const step of plan.process) assert.ok((await article.innerText()).includes(step));
      assert.ok(await article.locator(`a[href="#plan-${plan.id}"]`).isVisible());
    }
    const applicationLinks=await page.locator('.v2-application-item a[href^="https:"]').evaluateAll(links=>links.map(a=>({href:a.href,label:a.textContent,target:a.target,rel:a.rel})));
    assert.ok(applicationLinks.every(a=>a.target==='_blank'&&a.rel.includes('noopener')));
    // Reachability is recorded separately; anti-bot rejection/timeout is not policy validation.
    const external=[];
    for(const href of [...new Set(applicationLinks.map(a=>a.href))]) {
      try {const r=await page.request.get(href,{timeout:15000});const body=(await r.body()).toString('utf8');external.push({href,status:r.status(),url:r.url(),contentType:r.headers()['content-type'],rejected:/Request Rejected|Access Denied|captcha/i.test(body)});}
      catch(e){external.push({href,error:e.message.split('\n')[0]});}
    }
    const serviceLink=external.find(item=>item.href==='https://service.taipei/case-detail/BX004');
    if(serviceLink?.status===404) {
      const official=await browser.newPage();
      await official.goto(serviceLink.href,{waitUntil:'domcontentloaded'});
      await official.getByRole('heading',{name:'申請地價稅減免',exact:true}).waitFor({state:'visible',timeout:20000});
      assert.ok((await official.locator('body').innerText()).includes('臺北市個人租賃住宅委託包租代管減徵地價稅及房屋稅申請書'));
      serviceLink.browserContent='PASS: original URL hydrates correct official application and form content despite HTTP 404 shell';
      await official.screenshot({path:`${artifacts}/official-service-content.png`});await official.close();
    }
    const published=fs.readdirSync('dist-pages-test',{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>path.relative('dist-pages-test',path.join(e.parentPath||e.path,e.name)).replaceAll('\\','/'));
    const assets=[];
    for(const file of published) {
      const r=await page.request.get(new URL(file,base).href);
      assert.equal(r.status(),200,file);
      const type=r.headers()['content-type']||'';
      const expected={'.html':'text/html','.css':'text/css','.js':'javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'}[path.extname(file)];
      assert.ok(type.includes(expected),`${file}: ${type}`);
      assets.push({file,status:r.status(),mime:type});
    }
    for(const route of ['PROJECT_STATE.md','TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md','README.md','package.json','site/content.json','site/template.html','scripts/build.mjs','tests/build.test.mjs','.git/config','docs/history/PROJECT_STATE_BEFORE_2026-10-31.md','assets/images/assistant/assistant-assets-manifest.json']) {
      const r=await page.request.get(new URL(route,base).href);assert.equal(r.status(),404,route);
    }
    assert.equal(await page.evaluate(()=>typeof window.gtag),'undefined');
    assert.deepEqual(gaRequests,[]);assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
    await page.goto(base+'#top');await page.screenshot({path:`${artifacts}/home-desktop.png`});
    await page.setViewportSize({width:768,height:1024});await page.goto(base+'#direct-apply');await page.screenshot({path:`${artifacts}/application-tablet.png`});
    await page.setViewportSize({width:390,height:844});await page.goto(base+'#operation-guide');await page.getByLabel('手機版',{exact:true}).check();await page.screenshot({path:`${artifacts}/video-mobile.png`});
    fs.writeFileSync(`${artifacts}/acceptance.json`,JSON.stringify({base,testedAt:new Date().toISOString(),cx:'excluded; third-party requests isolated; never opened or queried',errors,consoleErrors,gaRequests,assets,external,checks:['six home entries','all four desktop inline/detail views and responsive transition','guide previous/result/history','tenant groups and all links','two/four comparison and duplicate-selection guard','320-1440px overflow and 200% text','four application contents/links','33 public asset MIME/status checks','11 excluded paths 404']},null,2));
    console.log(`PASS: ${new URL(base).protocol==='https:'?'LIVE Pages HTTPS':'LOCAL preview'} non-CX frontend acceptance, 33 assets/MIME, excluded paths 404, zero GA4 requests.`);
    console.log(JSON.stringify({external}));
  } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
