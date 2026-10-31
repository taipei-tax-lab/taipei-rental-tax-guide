const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.PREVIEW_URL||'https://rental-tax-guide-test.pages.dev/';
const baseline=process.argv.includes('--baseline');
const navigationOnly=process.argv.includes('--navigation-only');
const folder='.preview/entry-scroll';fs.mkdirSync(folder,{recursive:true});
const entries=[['owners','owner-title'],['tenants','tenant-title'],['direct-apply','direct-apply-title'],['operation-guide','operation-guide-title']];
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const rows=[];
try{
 if(!navigationOnly)for(const [device,width,height] of [['desktop',1440,900],['tablet',768,1024],['phone',390,844]])for(const zoom of [1,1.25,1.5]){
  const page=await browser.newPage({viewport:{width:Math.round(width/zoom),height:Math.round(height/zoom)},deviceScaleFactor:zoom});
  await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  for(const [hash,id] of entries){
   await page.goto(base);await page.locator('.v2-ready').waitFor();await page.locator(`.v2-audience a[href="#${hash}"]`).click();
   await page.waitForFunction(id=>document.activeElement?.id===id,id);
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const m=await page.locator('#'+id).evaluate(h=>{const d=document.documentElement;return {top:h.getBoundingClientRect().top,y:scrollY,maxY:d.scrollHeight-d.clientHeight,world:h.getBoundingClientRect().top+scrollY,innerWidth,innerHeight,visualOffset:visualViewport?.offsetTop||0,shellHidden:document.querySelector('[data-entry-shell]').hidden};});
   rows.push({device,nominalWidth:width,nominalHeight:height,zoomPercent:zoom*100,zoomModel:'layout viewport equivalent; native browser zoom measured separately',entry:hash,...m});
   if(!baseline){assert.equal(m.shellHidden,false);const expected=Math.max(0,Math.min(m.world-28-m.visualOffset,m.maxY));assert.ok(Math.abs(m.y-expected)<=2,JSON.stringify(rows.at(-1)));}
   if(!baseline&&zoom===1)await page.screenshot({path:`${folder}/${device}-${hash}.png`});
  }await page.close();
 }
 const navigation=[];const nativeZoom=[];
 if(!baseline){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  for(const [hash,id] of entries){
   await page.goto(base+'?entry-scroll-check='+hash+'#'+hash);await page.locator('.v2-ready').waitFor();await settle();await page.waitForTimeout(500);
   await page.waitForFunction(id=>Math.abs(document.getElementById(id).getBoundingClientRect().top-28)<=2,id,{timeout:3000}).catch(async()=>{throw Error(`Deep ${hash}: ${JSON.stringify(await page.locator('#'+id).evaluate(h=>({top:h.getBoundingClientRect().top,y:scrollY,state:history.state})))}`);});
   const deepTop=await page.locator('#'+id).evaluate(h=>h.getBoundingClientRect().top);assert.ok(Math.abs(deepTop-28)<=2,`deep ${hash}: ${deepTop}`);
   await page.reload();await page.locator('.v2-ready').waitFor();await settle();await page.waitForTimeout(500);
   await page.waitForFunction(id=>Math.abs(document.getElementById(id).getBoundingClientRect().top-28)<=2,id);
   const reloadTop=await page.locator('#'+id).evaluate(h=>h.getBoundingClientRect().top);assert.ok(Math.abs(reloadTop-28)<=2,`reload ${hash}: ${reloadTop}`);
   // Dispatch while reading below the heading: a repeated entry must preserve that position.
   await page.evaluate(()=>scrollBy({top:100,behavior:"instant"}));const reading=await page.evaluate(()=>scrollY);
   await page.locator(`.v2-audience a[href="#${hash}"]`).dispatchEvent('click');await settle();
   assert.ok(Math.abs(await page.evaluate(()=>scrollY)-reading)<=1);
   await page.setViewportSize({width:1000,height:900});await settle();
   assert.ok(Math.abs(await page.evaluate(()=>scrollY)-reading)<=1,'breakpoint change preserves reading position');
   await page.setViewportSize({width:1440,height:900});
   const readingBeforeLeave=await page.evaluate(()=>scrollY);
   const other=hash==='direct-apply'?'owners':'direct-apply';
   await page.locator(`.v2-audience a[href="#${other}"]`).dispatchEvent('click');await page.waitForFunction(other=>location.hash==='#'+other,other);await settle();
   await page.goBack();await page.waitForFunction(y=>Math.abs(scrollY-y)<=2,readingBeforeLeave);
   navigation.push({entry:hash,deepLink:true,reload:true,repeatPreservesPosition:true,resizePreservesPosition:true});
  }
  await page.goto(base);await page.locator('.v2-ready').waitFor();
  for(const [hash,id] of entries){await page.locator(`.v2-audience a[href="#${hash}"]`).focus();await page.keyboard.press('Enter');await page.waitForFunction(id=>document.activeElement.id===id,id);await settle();}
  // Separate restoration from keyboard focus scrolling the offscreen entry controls into view.
  await page.goto(base+'?history-scroll');await page.locator('.v2-ready').waitFor();
  for(const hash of ['direct-apply','operation-guide']){await page.locator(`.v2-audience a[href="#${hash}"]`).dispatchEvent('click');await page.waitForFunction(hash=>document.activeElement.id===hash+'-title',hash);await settle();}
  await page.evaluate(()=>scrollBy({top:70,behavior:"instant"}));await settle();const videoY=await page.evaluate(()=>scrollY);
  await page.goBack();await page.locator('#direct-apply:visible').waitFor();await settle();await page.waitForTimeout(250);
  await page.goForward();await page.locator('#operation-guide:visible').waitFor();
  await page.waitForFunction(y=>Math.abs(scrollY-y)<=2,videoY,{timeout:5000}).catch(async()=>{throw Error(`History expected ${videoY}, actual ${await page.evaluate(()=>scrollY)}`);});assert.ok(Math.abs(await page.evaluate(()=>scrollY)-videoY)<=2,'history restores reading position');
  await page.setViewportSize({width:1440,height:2200});await page.goto(base+'#operation-guide');await page.locator('.v2-ready').waitFor();await settle();
  const bottom=await page.locator('#operation-guide-title').evaluate(h=>({top:h.getBoundingClientRect().top,y:scrollY,maxY:document.documentElement.scrollHeight-innerHeight}));
  assert.ok(bottom.top>32);assert.ok(Math.abs(bottom.y-bottom.maxY)<=1,'short content clamps at page bottom');
  navigation.push({keyboard:true,historyRestoresReadingPosition:true,bottomClamp:bottom});await page.close();
  // Chromium native page-zoom preference in disposable, isolated profiles; no user browser/profile input.
  if(!navigationOnly)for(const factor of [1,1.25,1.5]){
   const profile=fs.mkdtempSync(path.resolve(folder,'native-profile-'));fs.mkdirSync(path.join(profile,'Default'));
   fs.writeFileSync(path.join(profile,'Default/Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(factor)/Math.log(1.2)}}}));
   const context=await chromium.launchPersistentContext(profile,{channel:'msedge',headless:true,viewport:null,args:['--window-size=1440,900']});
   try{const p=context.pages()[0];await p.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
    for(const [hash,id] of entries){await p.goto(base);await p.locator('.v2-ready').waitFor();await p.locator(`.v2-audience a[href="#${hash}"]`).click();await p.waitForFunction(id=>document.activeElement.id===id,id);
     const m=await p.locator('#'+id).evaluate(h=>({top:h.getBoundingClientRect().top,innerWidth,innerHeight,dpr:devicePixelRatio,outerWidth}));
     assert.ok(Math.abs(m.dpr-factor)<.01,'native zoom changes DPR');assert.ok(Math.abs(m.top-28)<=2,JSON.stringify(m));nativeZoom.push({zoomPercent:factor*100,entry:hash,...m});
    }
   }finally{await context.close();}
  }
 }
 fs.writeFileSync(`${folder}/${baseline?'before':navigationOnly?'navigation':'after'}.json`,JSON.stringify({base,testedAt:new Date().toISOString(),baseline,rows,navigation,nativeZoom},null,2));console.log(JSON.stringify(rows.filter(r=>r.zoomPercent===100)));console.log(`${baseline?'BASELINE':'PASS'}: ${rows.length} responsive/zoom-equivalent measurements; ${nativeZoom.length} native page-zoom measurements; navigation ${navigation.length}.`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
