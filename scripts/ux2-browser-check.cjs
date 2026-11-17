const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4175/';
const folder='.preview/ux2';fs.mkdirSync(folder,{recursive:true});
(async()=>{
 const browser=await chromium.launch({...(process.env.BROWSER_EXECUTABLE ? {executablePath:process.env.BROWSER_EXECUTABLE} : {channel:'msedge'}),headless:true});const results={base,widths:[],checks:[]};
 try{
  const page=await browser.newPage({ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1',viewport:{width:1440,height:1000}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'#top');await page.locator('.v2-ready').waitFor();
   const labels=await page.locator('.v2-audience > * strong').allTextContents();
   assert.deepEqual(labels,['我是屋主','我是房客','直接申請','操作說明','直接問小幫手','出租房屋所得達租金標準']);
   const positions=await page.locator('.v2-audience > *').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));
   if(width>=1100){assert.equal(positions[0].y,positions[2].y);assert.ok(Math.abs(positions[3].y-positions[5].y)<12);assert.ok(positions[3].y>positions[0].y);}
   await page.locator('.v2-audience a[href="#direct-apply"]').focus();await page.keyboard.press('Enter');
   await page.locator('#direct-apply:visible').waitFor();
   await page.waitForFunction(()=>document.activeElement?.id==='direct-apply-title');
   assert.ok(await page.locator('[data-entry-shell]').isVisible());assert.ok(await page.locator('.v2-header').isVisible());
   assert.equal(await page.locator('.v2-audience a[href="#direct-apply"]').getAttribute('aria-current'),'true');
   assert.equal(await page.locator('.v2-audience [data-audience][aria-current]').count(),0);
   const cards=await page.locator('.v2-application-item').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),css=getComputedStyle(e);return {x:r.x,y:r.y,width:r.width,height:r.height,color:css.getPropertyValue('--v2-accent').trim()};}));
   assert.equal(cards.length,3);assert.equal(new Set(cards.map(c=>c.color)).size,1);
   if(width>700){assert.equal(cards[0].y,cards[1].y);assert.equal(cards[0].y,cards[2].y);assert.ok(cards[0].x<cards[1].x&&cards[1].x<cards[2].x);assert.ok(cards.every(c=>Math.abs(c.height-cards[0].height)<1));}else assert.ok(cards.every(c=>c.x===cards[0].x));
   assert.equal(await page.locator('a.v2-application-item').count(),3);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(width!==320)await page.screenshot({path:`${folder}/apply-${width}.png`,fullPage:true});
   if(width===1440)await page.screenshot({path:`${folder}/shared-entry-desktop.png`});
   const before=await page.evaluate(()=>scrollY);
   await page.locator('.v2-audience a[href="#operation-guide"]').click();await page.locator('#operation-guide:visible').waitFor();
   await page.waitForFunction(()=>document.activeElement?.id==='operation-guide-title');
   assert.ok(await page.locator('[data-entry-shell]').isVisible());
   // Each destination scrolls to its heading or clamps at the new page bottom.
   assert.ok(await page.locator('#operation-guide-title').evaluate(h=>{const top=h.getBoundingClientRect().top;return Math.abs(top-28)<=2||Math.abs(scrollY-(document.documentElement.scrollHeight-innerHeight))<=2;}));
   await page.getByLabel('手機版',{exact:true}).check();
   await page.goBack();await page.locator('#direct-apply:visible').waitFor();
   await page.goForward();await page.locator('#operation-guide:visible').waitFor();
   assert.ok(await page.getByLabel('手機版',{exact:true}).isChecked());assert.ok(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused)));
   await page.reload();await page.locator('#operation-guide:visible').waitFor();assert.ok(await page.locator('[data-entry-shell]').isVisible());
   await page.locator('.v2-audience [data-audience="owner"]').click();await page.locator('#owners:visible').waitFor();
   await page.locator('.v2-audience [data-audience="tenant"]').click();await page.locator('#tenants:visible').waitFor();
   assert.ok(await page.locator('[data-entry-shell]').isVisible());
   results.widths.push({width,sharedEntries:true,focus:true,applicationColumns:width>700?3:1,history:true,deepReload:true,noOverflow:true});
  }
  assert.deepEqual(errors,[]);results.errors=errors;
  results.checks=['six DOM/keyboard order','shared hero/entry visibility across entry contents','one selected entry','heading focus after keyboard entry','desktop no unnecessary scroll','three peer channel cards','one link per channel','history/deep-link/reload','video selection retention and paused return'];
  fs.writeFileSync(`${folder}/results.json`,JSON.stringify(results,null,2));console.log('PASS: UX2 shared entries, order, card layout, keyboard/focus, history and video state.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
