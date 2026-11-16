// Pointer/touch regression for the non-interactive rent-standard group.
// Requests outside the isolated Pages build are blocked; no forms or CX queries.
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4175/';
const folder=process.env.EVIDENCE_DIR||'.preview/icon-refinement/local/interaction';
assert.ok(folder.startsWith('.preview/'),'Captures must remain in .preview/');
const data=JSON.parse(fs.readFileSync('site/content.json','utf8'));
const options={proxy:process.env.BROWSER_PROXY?{server:process.env.BROWSER_PROXY}:undefined,ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1'};
const styles=locator=>locator.evaluate(e=>{const s=getComputedStyle(e);return {background:s.backgroundColor,color:s.color,border:s.border,shadow:s.boxShadow};});
const center=b=>({x:b.x+b.width/2,y:b.y+b.height/2});
(async()=>{
 fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{channel:'msedge'}),headless:true});
 const contexts=[],errors=[],gaRequests=[],pointer=[],touch=[];
 const setup=async context=>{
  contexts.push(context);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/googletagmanager\.com|google-analytics\.com/.test(r.url()))gaRequests.push(r.url());});
  await page.goto(base);await page.locator('.v2-ready').waitFor();return page;
 };
 try {
  const page=await setup(await browser.newContext({...options,viewport:{width:1440,height:1000}}));
  assert.ok(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches));
  const group=page.locator('.v2-income-standard-entry');
  const links=group.locator('a');
  await group.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  const original={group:await styles(group),links:await Promise.all([styles(links.nth(0)),styles(links.nth(1))])};
  const frame=await group.boundingBox();const buttons=await links.evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));
  const selected=page.locator('.v2-audience [aria-current="true"]');
  const selectedStyle=await styles(selected);
  const unchanged=async label=>{
   assert.deepEqual(await styles(group),original.group,`${label}: group stays idle`);
   assert.deepEqual(await group.boundingBox(),frame,`${label}: frame does not move`);
  };
  const title=await group.locator('strong').boundingBox();const icon=await group.locator('svg').boundingBox();
  const points=[['title',center(title)],['icon',center(icon)],['blank',{x:frame.x+10,y:frame.y+5}],['gap',{x:(buttons[0].right+buttons[1].left)/2,y:buttons[0].y+buttons[0].height/2}]];
  for(const [name,point] of points) {
   await page.mouse.move(point.x,point.y);await unchanged(name);
   assert.deepEqual(await Promise.all([styles(links.nth(0)),styles(links.nth(1))]),original.links);
   pointer.push({target:name,groupUnchanged:true,buttonsUnchanged:true});
  }
  for(const i of [0,1]) {
   const point=center(buttons[i]);await page.mouse.move(point.x,point.y);await unchanged(`button ${i}`);
   const active=await styles(links.nth(i));
   assert.equal(active.background,selectedStyle.background,'same teal as the selected main card');
   assert.equal(active.color,'rgb(255, 255, 255)');
   assert.deepEqual(await styles(links.nth(1-i)),original.links[1-i],'other button stays idle');
   await group.screenshot({path:`${folder}/hover-${i}.png`});
   pointer.push({target:data.incomeStandardActions[i].id,style:active,groupUnchanged:true,peerUnchanged:true});
   await page.mouse.move(0,0);await unchanged('leave');
   assert.deepEqual(await styles(links.nth(i)),original.links[i],'leaving restores the button');
  }
  assert.equal(await group.getAttribute('href'),null);assert.equal(await group.getAttribute('role'),'group');
  const url=page.url();await group.locator('strong').click();assert.equal(page.url(),url,'group title does not navigate');
  await page.mouse.move(0,0);
  await page.locator('#open-helper').focus();await page.keyboard.press('Tab');
  for(const i of [0,1]) {
   assert.ok(await links.nth(i).evaluate(e=>e===document.activeElement));
   const focus=await links.nth(i).evaluate(e=>{const s=getComputedStyle(e);return {visible:e.matches(':focus-visible'),style:s.outlineStyle,width:s.outlineWidth};});
   assert.ok(focus.visible&&focus.style!=='none'&&parseFloat(focus.width)>=3);
   await group.screenshot({path:`${folder}/focus-${i}.png`});await page.keyboard.press('Tab');
  }
  // Existing main-card states keep their actual colors.
  const tenant=page.locator('.v2-audience [data-audience="tenant"]');
  await tenant.hover();assert.equal((await styles(tenant)).background,'rgb(233, 242, 239)');
  await selected.hover();assert.deepEqual(await styles(selected),selectedStyle);
  const symbols=new Map();
  for(const hash of ['#owners','#tenants','#direct-apply']) {
   await page.evaluate(hash=>{location.hash=hash;},hash);await page.locator(`${hash}:visible`).waitFor();
   const visible=await page.locator('[data-card-icon]:visible').evaluateAll(es=>es.map(e=>{
    const b=e.getBBox();return {key:e.dataset.cardIcon,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};
   }));
   for(const a of visible)symbols.set(a.key,a);
  }
  const artwork=[...symbols.values()];
  assert.equal(artwork.length,16);
  for(const a of artwork)assert.ok(a.x>=.9&&a.y>=.9&&a.right<=23.1&&a.bottom<=23.1,`stroke fits 24px viewBox: ${a.key}`);
  await page.evaluate(()=>{location.hash='#owners';});await page.locator('#owners:visible').waitFor();
  await page.locator('#card-personal').click();await page.locator('#plan-personal:visible').waitFor();
  assert.equal(await page.locator('#card-personal').getAttribute('aria-expanded'),'true');
  assert.ok(await page.locator('#card-personal').evaluate(e=>e.classList.contains('v2-selected')));
  await page.locator('#card-personal').screenshot({path:`${folder}/personal-selected.png`});
  await page.locator('#plan-personal .v2-back').click();await page.locator('#owners:visible').waitFor();
  for(const width of [390,320]) {
   const mobile=await setup(await browser.newContext({...options,viewport:{width,height:1000},isMobile:true,hasTouch:true}));
   assert.equal(await mobile.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches),false);
   const parent=mobile.locator('.v2-income-standard-entry'),actions=parent.locator('a');
   await parent.scrollIntoViewIfNeeded();const parentIdle=await styles(parent);
   const idle=await Promise.all([styles(actions.nth(0)),styles(actions.nth(1))]);
   await actions.evaluateAll(es=>{window.testTouchActions=[];es.forEach(e=>e.addEventListener('click',event=>{event.preventDefault();window.testTouchActions.push(e.dataset.serviceEntry);}));});
   for(const i of [0,1]) {
    const box=await actions.nth(i).boundingBox();assert.ok(box.width>=44&&box.height>=44);
    assert.equal(await actions.nth(i).getAttribute('href'),data.incomeStandardActions[i].href);
    assert.equal(await actions.nth(i).getAttribute('target'),'_blank');
    assert.equal(await actions.nth(i).getAttribute('rel'),'noopener noreferrer');
    await actions.nth(i).tap();
    assert.deepEqual(await styles(parent),parentIdle);
    assert.deepEqual(await Promise.all([styles(actions.nth(0)),styles(actions.nth(1))]),idle,'touch does not leave sticky inverse colors');
   }
   const ids=await mobile.evaluate(()=>window.testTouchActions);
   assert.deepEqual(ids,data.incomeStandardActions.map(a=>a.id));
   assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await parent.screenshot({path:`${folder}/touch-${width}.png`});touch.push({width,ids,minTarget:44,noStickyHover:true});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(gaRequests,[]);
  fs.writeFileSync(`${folder}/results.json`,JSON.stringify({base,at:new Date().toISOString(),original,pointer,touch,artwork,keyboardFocus:true,mainCardStatesPreserved:true,personalPlanSelectionAndReturn:true,errors,gaRequests,tlsVerificationBypass:options.ignoreHTTPSErrors,cx:'blocked; no real queries',externalForms:'native touch activation prevented only for test; never submitted'},null,2));
  console.log('PASS: actual pointer positions, independent teal/white hover, leave restore, unchanged group/main cards, keyboard focus, 44px native touch targets without sticky hover, 16 SVG bounds.');
 }finally{for(const context of contexts)await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
