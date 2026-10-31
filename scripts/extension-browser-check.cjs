/* Optional live R2/browser regression. Requires Playwright + Edge and local preview. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const artifacts = '.preview';
fs.mkdirSync(artifacts, {recursive:true});
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const results = {viewports:[],media:[]};
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    // No live CX traffic or test analytics; allow only preview and supplied R2 media.
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      return [new URL(base).origin,'https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev'].includes(url.origin) ? route.continue() : route.abort();
    });
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base); await page.locator('.v2-ready').waitFor();
    for (const width of [1440,1100,768,390,320]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(base+'#top');
      const rects=await page.locator('.v2-audience > *').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
      assert.equal(rects.length,6);
      if(width>=1100) {
        assert.equal(rects[0].y,rects[1].y); assert.equal(rects[1].y,rects[2].y);
        assert.ok(rects[3].y>rects[0].y); assert.equal(rects[3].y,rects[4].y); assert.equal(rects[4].y,rects[5].y);
      }
      for(const hash of ['top','direct-apply','operation-guide']) {
        await page.goto(base+'#'+hash);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} #${hash} overflow`);
        if(hash==='operation-guide') {
          const r=await page.locator('#guide-video-pc').boundingBox();
          assert.ok(Math.abs(r.width/r.height-16/9)<0.01);
          assert.equal(await page.locator('video[autoplay]').count(),0);
        }
        if([1440,390].includes(width)) await page.screenshot({path:`${artifacts}/extension-${width}-${hash}.png`,fullPage:true});
      }
      results.viewports.push({width,entries:6,overflow:false});
    }
    await page.setViewportSize({width:1440,height:1000});
    for(const version of ['pc','mobile']) {
      await page.getByLabel(version==='pc'?'電腦版':'手機版',{exact:true}).check();
      const selector='#guide-video-'+version;
      assert.ok(await page.locator(selector).evaluate(v=>v.paused));
      await page.locator(selector).scrollIntoViewIfNeeded();
      // Native play button in the bottom-left of the HTML5 controls.
      const bounds=await page.locator(selector).boundingBox();
      await page.locator(selector).click({position:{x:30,y:bounds.height-30}});
      await page.waitForFunction(sel=>{const v=document.querySelector(sel);return v.currentTime>1&&v.readyState>=2&&!v.paused;},selector,{timeout:45000});
      const state=await page.locator(selector).evaluate(v=>({version:v.id,src:v.currentSrc,duration:v.duration,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error?.code||null}));
      results.media.push(state);
      // Chromium native fullscreen control (left of overflow menu).
      await page.locator(selector).click({position:{x:bounds.width-60,y:bounds.height-30}});
      await page.waitForFunction(()=>!!document.fullscreenElement,null,{timeout:5000});
      assert.equal(await page.evaluate(()=>document.fullscreenElement.tagName),'VIDEO');
      const fullscreenBounds=await page.locator(selector).boundingBox();
      await page.locator(selector).click({position:{x:fullscreenBounds.width-60,y:fullscreenBounds.height-30}});
      await page.waitForFunction(()=>!document.fullscreenElement);
      if(version==='pc') {
        await page.getByLabel('手機版',{exact:true}).check();
        assert.ok(await page.locator(selector).evaluate(v=>v.paused));
      } else {
        await page.locator('footer a[href="#direct-apply"]').click();
        assert.ok(await page.locator(selector).evaluate(v=>v.paused));
        await page.locator('footer a[href="#operation-guide"]').click();
        assert.ok(await page.getByLabel('手機版',{exact:true}).isChecked());
        assert.ok(await page.locator(selector).evaluate(v=>v.paused));
        assert.ok(await page.locator(selector).isVisible());
        await page.goBack(); await page.goForward();
        assert.ok(await page.getByLabel('手機版',{exact:true}).isChecked());
        assert.ok(await page.locator(selector).evaluate(v=>v.paused));
      }
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync(`${artifacts}/extension-results.json`,JSON.stringify(results,null,2));
    console.log('PASS: six entries, five widths, hash/history, 16:9, both live R2 playbacks, native fullscreen, switch/leave/return pause.');
    console.log(JSON.stringify(results));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
