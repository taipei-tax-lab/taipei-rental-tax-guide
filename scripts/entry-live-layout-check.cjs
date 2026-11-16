// Real Pages UI only: no gtag mock, no CX, no official form activation.
const {chromium}=require('playwright');const fs=require('fs');const assert=require('assert/strict');
const base=process.env.PREVIEW_URL||'https://rental-tax-guide-test.pages.dev/';
const folder=process.env.EVIDENCE_DIR||'.preview/entry-live';
(async()=>{
 assert.ok(new URL(base).hostname.endsWith('.pages.dev'));fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{channel:'msedge'}),headless:true});
 const page=await browser.newPage({ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1'});const gaRequests=[],errors=[],widths=[];
 await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 page.on('request',r=>{if(/googletagmanager\.com|google-analytics\.com/.test(r.url()))gaRequests.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 const baseline=process.env.BASELINE_JSON?JSON.parse(fs.readFileSync(process.env.BASELINE_JSON,'utf8')):null;
 const data=JSON.parse(fs.readFileSync('site/content.json','utf8'));
 try{for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto(base);await page.locator('.v2-ready').waitFor();
  assert.equal(await page.evaluate(()=>typeof window.gtag),'undefined');
  const boxes=await page.locator('.v2-audience > *').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));assert.equal(boxes.length,6);
   for (const box of boxes) {
    assert.ok(Math.abs(box.width-boxes[0].width)<1 && Math.abs(box.height-boxes[0].height)<1, 'six common visible frames');
   }
   const innerBorder=await page.locator('.v2-income-standard-panel').evaluate(e=>getComputedStyle(e).borderTopWidth);
   assert.equal(innerBorder,'0px','sixth card has no nested visible frame');

  if(baseline)for(let i=0;i<6;i++)for(const k of ['x','y','width','height'])assert.ok(Math.abs(boxes[i][k]-baseline[width][i][k])<1,`${width}: card ${i} ${k}`);
  assert.equal(await page.locator('.v2-audience a,.v2-audience button').count(),7);
  assert.deepEqual(await page.locator('.v2-income-standard-actions a').evaluateAll(es=>es.map(e=>e.href)),data.incomeStandardActions.map(a=>a.href));
  await page.screenshot({path:`${folder}/home-${width}.png`,fullPage:true});
  await page.locator('.v2-audience [data-entry-page="direct-apply"]').click();await page.locator('#direct-apply:visible').waitFor();await page.waitForFunction(()=>document.activeElement.id==='direct-apply-title');
  assert.deepEqual(await page.locator('a.v2-application-item').evaluateAll(es=>es.map(e=>e.href)),data.directApplyActions.map(a=>a.href));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`${folder}/apply-${width}.png`,fullPage:true});
  widths.push({width,boxes,baselineMatch:!!baseline,exactLinks:true,focus:true,noOverflow:true});
 }assert.deepEqual(gaRequests,[]);assert.deepEqual(errors,[]);
 fs.writeFileSync(`${folder}/results.json`,JSON.stringify({base,at:new Date().toISOString(),widths,gaRequests,errors,mockGtag:false,cx:'isolated',tlsVerificationBypass:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1'},null,2));console.log('PASS: actual Pages UI, exact common card geometry/five hrefs, four widths, no gtag mock or GA4 requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
