// Non-CX verification; optional BASELINE_JSON records the pre-change live grid.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4175/';
const folder=process.env.EVIDENCE_DIR||'.preview/entry-redesign';
const data=JSON.parse(fs.readFileSync('site/content.json','utf8'));
const actions=[...data.incomeStandardActions,...data.directApplyActions];
(async()=>{
 fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{channel:'msedge'}),headless:true});
 const context=await browser.newContext({ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1',hasTouch:true});
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Navigation test</title>'}));
 const page=await context.newPage();const events=[],requests=[],errors=[],widths=[];
 await page.exposeFunction('recordEvent',(...args)=>events.push(args));
 await page.addInitScript(()=>{window.gtag=(...args)=>window.recordEvent(...args);});
 await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 page.on('request',r=>{if(/google-analytics\.com|googletagmanager\.com/.test(r.url()))requests.push(r.url());});
 page.on('pageerror',e=>errors.push(e.message));
 try {
  const baseline=process.env.BASELINE_JSON?JSON.parse(fs.readFileSync(process.env.BASELINE_JSON,'utf8')):null;
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base);await page.locator('.v2-ready').waitFor();await page.evaluate(()=>document.fonts.ready);
   const boxes=await page.locator('.v2-audience > *').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));
   assert.equal(boxes.length,6);
   for (const box of boxes) {
    assert.ok(Math.abs(box.width-boxes[0].width)<1 && Math.abs(box.height-boxes[0].height)<1, 'six common visible frames');
   }
   const innerBorder=await page.locator('.v2-income-standard-panel').evaluate(e=>getComputedStyle(e).borderTopWidth);
   assert.equal(innerBorder,'0px','sixth card has no nested visible frame');

   if(baseline)for(let i=0;i<6;i++)for(const key of ['x','y','width','height'])assert.ok(Math.abs(boxes[i][key]-baseline[width][i][key])<1,`${width} card ${i}: ${key}`);
   const controls=page.locator('.v2-audience a, .v2-audience button');assert.equal(await controls.count(),7);
   // Native tab order, including the two peer links; no positive tabindex.
   await controls.first().focus();for(let i=0;i<7;i++){
    assert.ok(await controls.nth(i).evaluate(e=>e===document.activeElement));
    assert.ok(await controls.nth(i).evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
    await page.keyboard.press('Tab');
   }
   const buttons=await page.locator('.v2-income-standard-actions a').evaluateAll(es=>es.map(e=>({width:e.offsetWidth,height:e.offsetHeight})));
   assert.equal(buttons[0].width,buttons[1].width);assert.ok(buttons.every(b=>b.height>=44));
   assert.equal(await page.locator('.v2-income-standard-entry').getAttribute('href'),null);
   await page.screenshot({path:`${folder}/after-home-${width}.png`,fullPage:true});
   const prior=events.filter(e=>e[1]==='direct_apply_open').length;
   const entry=page.locator('.v2-audience [data-entry-page="direct-apply"]');
   if(width===390)await entry.tap();else if(width===768){await entry.focus();await page.keyboard.press('Enter');}else await entry.click();
   await page.locator('#direct-apply:visible').waitFor();await page.waitForFunction(()=>document.activeElement.id==='direct-apply-title');
   await page.waitForTimeout(100);assert.equal(events.filter(e=>e[1]==='direct_apply_open').length,prior+1);
   assert.deepEqual(await page.locator('a.v2-application-item').evaluateAll(es=>es.map(e=>e.href)),data.directApplyActions.map(a=>a.href));
   await page.screenshot({path:`${folder}/after-apply-${width}.png`,fullPage:true});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('.v2-audience [data-entry-page="operation-guide"]').click();await page.goBack();await page.locator('#direct-apply:visible').waitFor();
   await page.goForward();await page.locator('#operation-guide:visible').waitFor();await page.goto(base+'#direct-apply');await page.reload();await page.locator('#direct-apply:visible').waitFor();
   assert.equal(events.filter(e=>e[1]==='direct_apply_open').length,prior+1);
   for(const [i,action] of actions.entries()){
    const link=page.locator(`[data-service-entry="${action.id}"]`);
    assert.equal(await link.getAttribute('href'),action.href);
    const before=events.filter(e=>e[1]==='service_entry_click').length;
    // Prevent opening an official form in analytics verification only; keep native click propagation.
    await link.evaluate(e=>e.addEventListener('click',event=>event.preventDefault(),{once:true}));
    if(i%3===0)await link.click();else if(i%3===1){await link.focus();await page.keyboard.press('Enter');}else await link.tap();
    await page.waitForTimeout(50);
    const emitted=events.filter(e=>e[1]==='service_entry_click');assert.equal(emitted.length,before+1);
    assert.deepEqual(emitted.at(-1),['event','service_entry_click',{service_id:action.id,destination_host:new URL(action.href).hostname}]);
   }
   // With no gtag, real native activation still opens the exact destination.
   await page.evaluate(()=>delete window.gtag);
   const popupWait=page.waitForEvent('popup');await page.locator('[data-service-entry="direct_apply_online"]').click();const popup=await popupWait;
   await popup.waitForURL(data.directApplyActions[0].href,{waitUntil:'domcontentloaded'});assert.equal(popup.url(),data.directApplyActions[0].href);await popup.close();
   widths.push({width,boxes,baselineMatch:!!baseline,sevenKeyboardControls:true,focusVisible:true,noOverflow:true,historyAndReload:true,exactLinks:true,mockMappings:true,noGtagNavigation:true});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[],'Use the GA4-isolated test build');
  assert.ok(events.filter(e=>e[1]==='direct_apply_open').every(e=>JSON.stringify(e[2])==='{}'));
  fs.writeFileSync(`${folder}/results.json`,JSON.stringify({base,at:new Date().toISOString(),browser:'Chromium emulation; not physical devices',widths,events,gaRequests:requests,errors,cx:'third-party requests blocked; no real queries'},null,2));
  console.log('PASS: common card geometry, seven keyboard controls, exact links, six event mappings, single activation, history/reload, no gtag navigation, GA4 isolation.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
