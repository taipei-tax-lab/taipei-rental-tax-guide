// Repeatable visual checks. All captures stay in the ignored .preview tree.
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4175/';
const folder=process.env.EVIDENCE_DIR||'.preview/visual-consistency/layout';
assert.ok(folder.startsWith('.preview/'),'Screenshots must remain in .preview/');
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<1,`${label}: ${a} / ${b}`);
(async()=>{
 fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{channel:'msedge'}),headless:true});
 const page=await browser.newPage({proxy:process.env.BROWSER_PROXY?{server:process.env.BROWSER_PROXY}:undefined,ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1',reducedMotion:'reduce'});
 const errors=[],gaRequests=[],rows=[];
 await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(/googletagmanager\.com|google-analytics\.com/.test(r.url()))gaRequests.push(r.url());});
 const navigate=async hash=>{await page.goto(base+hash);await page.locator('.v2-ready').waitFor();await page.evaluate(()=>document.fonts.ready);};
 const boxes=selector=>page.locator(selector).evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};}));
 const noOverflow=async label=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label);
 try {
  for(const width of [1440,1100,768,390,320]) for(const fontPercent of [100,200]) {
   await page.setViewportSize({width,height:1000});
   await navigate('');
   if(fontPercent===200)await page.addStyleTag({content:'html { font-size: 200% !important; }'});
   const frames=await boxes('.v2-audience > *');
   assert.equal(frames.length,6);
   const styles=await page.locator('.v2-audience > *').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return {border:s.border,radius:s.borderRadius,background:s.backgroundColor,shadow:s.boxShadow,padding:s.padding,color:s.color,font:getComputedStyle(e.querySelector('strong')).fontSize};}));
   for(const [i,frame] of frames.entries()) {
    near(frame.width,frames[0].width,'six widths');near(frame.height,frames[0].height,'six heights');
    if(i>1)assert.deepEqual(styles[i],styles[1],'five idle cards share every frame/title style');
   }
   const icons=await boxes('.v2-audience > * > svg');assert.equal(icons.length,6);
   for(let i=0;i<6;i++) {
    near(icons[i].width,icons[0].width,'icon width');near(icons[i].height,icons[0].height,'icon height');
    near(icons[i].x-frames[i].x,icons[0].x-frames[0].x,'icon left inset');
    near(icons[i].y+icons[i].height/2,frames[i].y+frames[i].height/2,'icon centered in frame');
   }
   const mainCols=width>=1100?3:(width>380&&!(width<=700&&fontPercent===200))?2:1;
   for(let i=0;i<mainCols;i++)near(frames[i].y,frames[0].y,'main row');
   if(mainCols<6)assert.ok(frames[mainCols].y>frames[0].y);
   const actions=await boxes('.v2-income-standard-actions a');
   assert.equal(actions.length,2);near(actions[0].width,actions[1].width,'peer actions');near(actions[0].y,actions[1].y,'peer row');
   for(const action of actions)assert.ok(action.width>=44&&action.height>=44);
   assert.ok(actions[1].x+actions[1].width<=frames[5].x+frames[5].width,'actions stay inside frame');
   await noOverflow(`home ${width}/${fontPercent}`);
   await page.screenshot({path:`${folder}/home-${width}-${fontPercent}.png`,fullPage:true});
   // Use native hash navigation without losing the text-size override on this document.
   const go=async hash=>{await page.evaluate(hash=>{location.hash=hash;},hash);await page.locator(`${hash}:visible`).waitFor();};
   await go('#tenants');
   const tenant=await boxes('.v2-tenant-grid > *');
   const tenantGrid=await page.locator('.v2-tenant-grid').evaluate(e=>({columns:getComputedStyle(e).gridTemplateColumns,gap:getComputedStyle(e).gap}));
   for(let i=0;i<3;i++){await page.locator(`#tenant-group-${i} > summary`).click();assert.ok(await page.locator(`#tenant-group-${i}`).getAttribute('open')!==null);await page.locator(`#tenant-group-${i} > summary`).click();}
   await noOverflow(`tenants ${width}/${fontPercent}`);
   await page.screenshot({path:`${folder}/tenants-${width}-${fontPercent}.png`,fullPage:true});
   await go('#direct-apply');
   const apply=await boxes('.v2-application-list > *');
   const applyGrid=await page.locator('.v2-application-list').evaluate(e=>({columns:getComputedStyle(e).gridTemplateColumns,gap:getComputedStyle(e).gap}));
   assert.deepEqual(applyGrid,tenantGrid,'application uses the tenant grid');
   for(let i=0;i<3;i++) {near(apply[i].width,tenant[i].width,'tenant/apply widths');near(apply[i].height,apply[0].height,'apply heights');if(width>700)near(apply[i].y,apply[0].y,'three columns');else if(i)assert.ok(apply[i].y>apply[i-1].y);}
   assert.deepEqual(await page.locator('.v2-application-item h3').allTextContents(),['線上申請','親自申請','郵寄/傳真']);
   await noOverflow(`apply ${width}/${fontPercent}`);
   await page.screenshot({path:`${folder}/apply-${width}-${fontPercent}.png`,fullPage:true});
   await go('#comparison');await noOverflow(`comparison ${width}/${fontPercent}`);
   await page.screenshot({path:`${folder}/comparison-${width}-${fontPercent}.png`,fullPage:true});
   await go('#operation-guide');await noOverflow(`tutorial ${width}/${fontPercent}`);
   await page.screenshot({path:`${folder}/tutorial-${width}-${fontPercent}.png`,fullPage:true});
   rows.push({width,fontPercent,frames,mainCols,icons,actions,apply,tenant,applyGrid,noOverflow:true});
  }
  await navigate('');
  await page.evaluate(()=>{
   window.helperMockCalls=0;
   document.querySelector('df-messenger-chat-bubble').openChat=()=>window.helperMockCalls++;
   document.dispatchEvent(new Event('df-messenger-loaded'));
  });
  const helper=page.locator('#open-helper');
  await helper.click();await helper.focus();await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>window.helperMockCalls),2,'native button retains openChat for click and keyboard');
  assert.equal(new URL(page.url()).hash,'','helper stays on the current page');
  const heroRequests=[];page.on('request',r=>{if(/hero-v2/.test(r.url()))heroRequests.push(r.url());});
  await page.reload();await page.locator('.v2-ready').waitFor();
  assert.ok(heroRequests.some(url=>url.includes('hero-v2.webp?v=81760c85cf')),'WebP selected');
  await page.addStyleTag({content:'body.v2-body { --hero-art: url("./hero-v2.png?v=81760c85cf"); }'});
  await page.waitForFunction(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('hero-v2.png?v=81760c85cf')));
  const pixelEquality=await page.evaluate(async()=>{
   const decode=async ext=>{const img=new Image();img.src=`./hero-v2.${ext}?v=81760c85cf`;await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d');x.drawImage(img,0,0);return {width:c.width,height:c.height,pixels:x.getImageData(0,0,c.width,c.height).data};};
   const w=await decode('webp'),p=await decode('png');return {width:w.width,height:w.height,equal:w.width===p.width&&w.height===p.height&&w.pixels.every((v,i)=>v===p.pixels[i])};
  });
  assert.deepEqual(pixelEquality,{width:1672,height:941,equal:true});
  const assets=[];
  for(const [ext,mime] of [['webp','image/webp'],['png','image/png']]){const response=await page.request.get(base+`hero-v2.${ext}?v=81760c85cf`);assert.equal(response.status(),200);assert.ok(response.headers()['content-type'].includes(mime));assets.push({ext,status:response.status(),mime:response.headers()['content-type']});}
  assert.deepEqual(errors,[]);assert.deepEqual(gaRequests,[]);
  fs.writeFileSync(`${folder}/results.json`,JSON.stringify({base,at:new Date().toISOString(),browser:'Chromium; emulated viewports and root font scaling, not physical devices',rows,pixelEquality,assets,heroRequests,errors,gaRequests,tlsVerificationBypass:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1',cx:'third-party blocked; no real queries'},null,2));
  console.log('PASS: five widths × 100/200% root font; common frames/icons, 44px controls, tenant/apply grid, five views, exact A fallback pixels/MIME, no overflow/GA4/CX.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
