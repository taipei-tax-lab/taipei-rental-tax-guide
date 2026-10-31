/* Optional live R2/browser regression. Requires Playwright + Edge and local preview. */
const {chromium, devices} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const artifacts = '.preview';
fs.mkdirSync(artifacts, {recursive:true});
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const results = {base,testedAt:new Date().toISOString(),viewports:[],media:[],mediaResponses:[],deviceDefaults:[],r2:[]};
  try {
    for(const [version,size] of [['pc',19659311],['mobile',35123380]]) {
      const src=JSON.parse(fs.readFileSync('site/media.json','utf8')).operationGuide[version].src;
      for(const url of [src.split('?')[0],src]) {
        const head=await fetch(url,{method:'HEAD'});
        assert.equal(head.status,200);assert.equal(Number(head.headers.get('content-length')),size);
        assert.match(head.headers.get('content-type'),/video\/mp4/);
        const ranges=[];
        for(const range of ['bytes=0-1023',`bytes=${size-1024}-${size-1}`]) {
          const response=await fetch(url,{headers:{Range:range}});
          assert.equal(response.status,206);assert.equal((await response.arrayBuffer()).byteLength,1024);
          assert.equal(response.headers.get('content-range'),range.replace('=',' ')+`/${size}`);
          ranges.push({range,status:response.status,contentRange:response.headers.get('content-range')});
        }
        results.r2.push({url,size,mime:head.headers.get('content-type'),etag:head.headers.get('etag'),lastModified:head.headers.get('last-modified'),ranges});
      }
    }
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    // No live CX traffic or test analytics; allow only preview and supplied R2 media.
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      return [new URL(base).origin,'https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev'].includes(url.origin) ? route.continue() : route.abort();
    });
    page.on('response',r=>{if(r.url().startsWith('https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev/'))results.mediaResponses.push({url:r.url(),status:r.status(),mime:r.headers()['content-type']});});
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
          assert.ok(await page.getByLabel('電腦版',{exact:true}).isChecked(), 'desktop remains PC even at phone-sized viewport');
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
      assert.ok(state.src.endsWith('?v=2'));
      assert.ok(Math.abs(state.duration-(version==='pc'?144.133333:150.933333))<.1,'V2 duration');
      assert.equal(state.width,version==='pc'?1920:1080);assert.equal(state.height,version==='pc'?1080:1920);
      assert.ok(Math.abs(bounds.width/bounds.height-(version==='pc'?16/9:9/16))<.01);
      if(version==='mobile')assert.ok(bounds.width<=360);
      assert.equal(await page.locator(selector).evaluate(v=>getComputedStyle(v).objectFit),'contain');
      state.display={width:bounds.width,height:bounds.height,objectFit:'contain'};
      await page.locator(selector).evaluate(v=>{v.volume=.4;});
      assert.equal(await page.locator(selector).evaluate(v=>v.volume),.4);
      await page.locator(selector).evaluate(v=>{v.volume=1;});
      // Exercise the native scrubber by dragging, then verify a decoded frame and resumed playback.
      await page.locator(selector).hover({position:{x:20,y:bounds.height-20}});
      const seekBox=await page.locator(selector).boundingBox();
      await page.mouse.move(seekBox.x+seekBox.width*.25,seekBox.y+seekBox.height-14);
      await page.mouse.down();await page.mouse.move(seekBox.x+seekBox.width*.65,seekBox.y+seekBox.height-14,{steps:8});await page.mouse.up();
      await page.waitForFunction(sel=>document.querySelector(sel).currentTime>20,selector,{timeout:5000});
      state.nativeSeekTime=await page.locator(selector).evaluate(v=>v.currentTime);
      await page.locator(selector).evaluate(async v=>{v.pause();v.currentTime=60;await v.play();});
      await page.waitForFunction(sel=>{const v=document.querySelector(sel);return !v.paused&&v.currentTime>60.5&&v.readyState>=2;},selector);
      await page.locator(selector).evaluate(v=>v.pause());
      await page.locator(selector).screenshot({path:`${artifacts}/v2-frame-desktop-${version}.png`});
      await page.locator(selector).evaluate(v=>v.play());
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
    // Real phone emulation exercises the User-Agent fallback (e.g. Safari without UA-CH).
    const phone = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,
      userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'});
    await phone.addInitScript(() => Object.defineProperty(navigator,'userAgentData',{value:undefined,configurable:true}));
    await phone.route('**/*', route => new URL(route.request().url()).origin===new URL(base).origin ? route.continue() : route.abort());
    phone.on('pageerror',e=>errors.push(e.message));
    await phone.goto(base+'#operation-guide'); await phone.locator('.v2-ready').waitFor();
    assert.ok(await phone.getByLabel('手機版',{exact:true}).isChecked());
    assert.ok(await phone.locator('#guide-video-mobile').isVisible());
    assert.ok(await phone.locator('video').evaluateAll(videos=>videos.every(v=>v.paused)));
    await phone.getByLabel('電腦版',{exact:true}).check();
    await phone.locator('footer a[href="#direct-apply"]').click();
    await phone.locator('footer a[href="#operation-guide"]').click();
    assert.ok(await phone.getByLabel('電腦版',{exact:true}).isChecked());
    await phone.setViewportSize({width:844,height:390});
    assert.ok(await phone.getByLabel('電腦版',{exact:true}).isChecked());
    assert.ok(await phone.locator('#guide-video-pc').isVisible());
    assert.ok(await phone.locator('video').evaluateAll(videos=>videos.every(v=>v.paused)));
    await phone.goBack(); await phone.goForward();
    assert.ok(await phone.getByLabel('電腦版',{exact:true}).isChecked());
    await phone.reload(); await phone.locator('.v2-ready').waitFor();
    assert.ok(await phone.getByLabel('手機版',{exact:true}).isChecked(), 'phone reload initializes by device even in landscape');
    results.deviceDefault = {desktop:'pc',phone:'mobile',manualChoiceRetained:true,landscapeRetained:true};
    await phone.close();
    for(const [name,device,expected] of [
      ['iPhone Chromium emulation',devices['iPhone 13'],'mobile'],
      ['Android phone',devices['Pixel 7'],'mobile'],
      ['iPad',devices['iPad (gen 7)'],'pc'],
      ['Android tablet',{viewport:{width:800,height:1280},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 15; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'},'pc']
    ]) {
      const p=await browser.newPage(device);
      await p.addInitScript(()=>Object.defineProperty(navigator,'userAgentData',{value:undefined,configurable:true}));
      await p.route('**/*',r=>[new URL(base).origin,'https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev'].includes(new URL(r.request().url()).origin)?r.continue():r.abort());
      await p.goto(base+'#operation-guide');await p.locator('.v2-ready').waitFor();
      assert.ok(await p.getByLabel(expected==='pc'?'電腦版':'手機版',{exact:true}).isChecked(),name);
      assert.deepEqual(await p.locator('[name="guide-version"]').evaluateAll(es=>es.map(e=>e.value)),['pc','mobile']);
      if(expected==='mobile') {
        const v=p.locator('#guide-video-mobile');await v.scrollIntoViewIfNeeded();
        await v.evaluate(async v=>{await v.play();v.currentTime=60;});
        await p.waitForFunction(()=>{const v=document.getElementById('guide-video-mobile');return v.currentTime>60.5&&v.readyState>=2;});
        await v.evaluate(v=>v.pause());
        const r=await v.boundingBox();assert.ok(Math.abs(r.width/r.height-9/16)<.01);
        await v.screenshot({path:`${artifacts}/v2-frame-${name.split(' ')[0]}.png`});
        await v.click({position:{x:r.width-60,y:r.height-30}});
        await p.waitForFunction(()=>!!document.fullscreenElement,null,{timeout:5000});
        assert.equal(await p.evaluate(()=>document.fullscreenElement.tagName),'VIDEO');
        await p.evaluate(()=>document.exitFullscreen());
      }
      const other=expected==='pc'?'mobile':'pc';
      await p.getByLabel(other==='pc'?'電腦版':'手機版',{exact:true}).check();
      await p.setViewportSize({width:1000,height:500});
      assert.ok(await p.getByLabel(other==='pc'?'電腦版':'手機版',{exact:true}).isChecked());
      results.deviceDefaults.push({name,expected,manualSelectionRetained:true,fullscreen:expected==='mobile'?'Chromium emulated phone native control PASS':'covered desktop native control'});
      await p.close();
    }
    assert.ok(results.mediaResponses.length>=2);
    assert.ok(results.mediaResponses.every(r=>[200,206].includes(r.status)&&r.mime?.includes('video/mp4')), 'R2 media status/MIME');
    assert.deepEqual(errors,[]);
    fs.writeFileSync(`${artifacts}/extension-results.json`,JSON.stringify(results,null,2));
    console.log('PASS: V2 metadata/Range/native scrubber/playback/fullscreen, 16:9 + 9:16, phone/tablet defaults, choice/pause/history, five widths.');
    console.log(JSON.stringify(results));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
