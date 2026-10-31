const {chromium,devices,webkit}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4175/';
const origin=new URL(base).origin;
const baseline='e9ebddb52663b94d9e79ac83020059f3da9e5c6e';
const attrs=n=>Object.fromEntries((n.attributes||[]).reduce((a,v,i,all)=>i%2?a:[...a,[v,all[i+1]]],[]));
function descendants(node){return [node,...[...(node.children||[]),...(node.shadowRoots||[])].flatMap(descendants)];}
(async()=>{
 assert.deepEqual(JSON.parse(fs.readFileSync('site/content.json')),JSON.parse(execFileSync('git',['show',baseline+':site/content.json'],{encoding:'utf8'})),'all policy/actions unchanged');
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results={base,testedAt:new Date().toISOString(),engine:'Microsoft Edge Chromium',webkitInstalled:fs.existsSync(webkit.executablePath()),realIOSLINE:'NOT TESTED',cases:[],errors:[]};
 try{
  const phoneUA=devices['iPhone 13'].userAgent;
  for(const [name,options,custom] of [
   ['desktop Chromium',{viewport:{width:1440,height:1000}},true],
   ['Android Chromium touch emulation',devices['Pixel 7'],false],
   ['iPhone LINE UA fallback in Chromium',{...devices['iPhone 13'],userAgent:phoneUA+' Line/15.0.0'},false],
   ['iPhone Safari UA fallback in Chromium',devices['iPhone 13'],false]
  ]){
   const p=await browser.newPage(options);
   await p.addInitScript(()=>{window.videoClickListeners=0;const add=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(type,listener,opts){if(this instanceof HTMLVideoElement&&type==='click')window.videoClickListeners++;return add.call(this,type,listener,opts);};});
   await p.route('**/*',r=>[origin,'https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev'].includes(new URL(r.request().url()).origin)?r.continue():r.abort());
   p.on('pageerror',e=>results.errors.push(e.message));
   await p.goto(base+'#operation-guide');await p.locator('.v2-ready').waitFor();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   assert.equal(await p.locator('[data-video-toggle], .v2-video-surface').count(),0);
   assert.equal(await p.evaluate(()=>videoClickListeners),custom?2:0,name);
   const cdp=await p.context().newCDPSession(p);
   for(const version of ['pc','mobile']){
    console.log('CHECK:',name,version);await p.getByLabel(version==='pc'?'電腦版':'手機版',{exact:true}).check();
    const id='guide-video-'+version;const video=p.locator('#'+id);
    await video.scrollIntoViewIfNeeded();
    const hits=await video.evaluate(v=>{const r=v.getBoundingClientRect();return [.1,.5,.9].map(x=>[.05,.5,.95].map(y=>document.elementFromPoint(r.x+r.width*x,r.y+r.height*y)?.tagName));});
    assert.ok(hits.flat().every(x=>x==='VIDEO'),JSON.stringify({name,version,hits}));
    const center=async()=>{await video.scrollIntoViewIfNeeded();const r=await video.boundingBox();if(options.hasTouch)await video.tap({position:{x:r.width/2,y:r.height/2}});else await video.click({position:{x:r.width/2,y:r.height/2}});};
    const nativeBox=async predicate=>{
     const {root}=await cdp.send('DOM.getDocument',{depth:-1,pierce:true});
     const node=descendants(root).find(n=>n.nodeName==='VIDEO'&&attrs(n).id===id);
     for(const n of descendants(node).filter(n=>predicate(attrs(n)))){
      try{const {model}=await cdp.send('DOM.getBoxModel',{nodeId:n.nodeId});const q=model.border;const x=Math.min(q[0],q[2],q[4],q[6]),y=Math.min(q[1],q[3],q[5],q[7]);const w=Math.max(q[0],q[2],q[4],q[6])-x,h=Math.max(q[1],q[3],q[5],q[7])-y;if(w>1&&h>1)return {x,y,w,h};}catch{}
     }throw Error('Native control not rendered: '+id);
    };
    const byPseudo=pseudo=>nativeBox(a=>a.pseudo===pseudo);
    const show=async()=>{const r=await video.boundingBox();await p.mouse.move(r.x+r.width/2,r.y+r.height-12);};
    const press=async pseudo=>{await show();const r=await byPseudo(pseudo);if(options.hasTouch)await p.touchscreen.tap(r.x+r.w/2,r.y+r.h/2);else await p.mouse.click(r.x+r.w/2,r.y+r.h/2);};
    if(custom){await center();await p.waitForFunction(id=>{const v=document.getElementById(id);return !v.paused&&v.currentTime>.3},id);await center();assert.ok(await video.evaluate(v=>v.paused));await center();assert.equal(await video.evaluate(v=>v.paused),false);await center();assert.ok(await video.evaluate(v=>v.paused));}
    else{await video.evaluate(v=>{v.preload='metadata';v.load();});await p.waitForFunction(id=>document.getElementById(id).readyState>=1,id);}
    // Trusted pointer/touch clicks on actual UA shadow control boxes; no hidden-node dispatch.
    await press('-webkit-media-controls-play-button');await p.waitForFunction(id=>{const v=document.getElementById(id);return !v.paused&&v.readyState>=2},id);
    await press('-webkit-media-controls-play-button');assert.ok(await video.evaluate(v=>v.paused),'native pause not toggled twice');
    await show();const timeline=await byPseudo('-webkit-media-controls-timeline');await p.mouse.move(timeline.x+timeline.w*.2,timeline.y+timeline.h/2);await p.mouse.down();await p.mouse.move(timeline.x+timeline.w*.6,timeline.y+timeline.h/2,{steps:8});await p.mouse.up();await p.waitForFunction(id=>document.getElementById(id).currentTime>20,id);assert.ok(await video.evaluate(v=>v.paused),'seek does not change paused state');
    const muted=await video.evaluate(v=>v.muted);await press('-webkit-media-controls-mute-button');assert.notEqual(await video.evaluate(v=>v.muted),muted);assert.ok(await video.evaluate(v=>v.paused));
    let volume='native slider';await show();const mute=await byPseudo('-webkit-media-controls-mute-button');await p.mouse.move(mute.x+mute.w/2,mute.y+mute.h/2);await p.waitForTimeout(400);
    const slider=await byPseudo('-webkit-media-controls-volume-slider');await p.mouse.click(slider.x+slider.w*.3,slider.y+slider.h/2);assert.ok((await video.evaluate(v=>v.volume))<.9);assert.ok(await video.evaluate(v=>v.paused));
    for(const playing of [false,true]){
     if(playing)await video.evaluate(v=>v.play());
     await press('-webkit-media-controls-fullscreen-button');await p.waitForFunction(()=>!!document.fullscreenElement);
     assert.equal(await video.evaluate(v=>v.paused),!playing);
     await press('-webkit-media-controls-fullscreen-button');await p.waitForFunction(()=>!document.fullscreenElement);
     assert.equal(await video.evaluate(v=>v.paused),!playing,'exit fullscreen retains state');
     await video.evaluate(v=>v.pause());
    }
    let pip='not exposed by browser';
    if(await p.evaluate(()=>document.pictureInPictureEnabled)){
     await press('-internal-media-controls-overflow-button');
     const r=await nativeBox(a=>a.pseudo==='-internal-media-controls-overflow-menu-list-item'&&/子母|picture.in.picture/i.test(a['aria-label']||''));
     if(options.hasTouch)await p.touchscreen.tap(r.x+r.w/2,r.y+r.h/2);else await p.mouse.click(r.x+r.w/2,r.y+r.h/2);
     await p.waitForFunction(()=>!!document.pictureInPictureElement);assert.ok(await video.evaluate(v=>v.paused));await p.evaluate(()=>document.exitPictureInPicture());pip='native overflow PiP entry + API exit PASS';
    }
    if(custom){await video.evaluate(async v=>{v.currentTime=v.duration-.1;await v.play();});await p.waitForFunction(id=>document.getElementById(id).ended,id);await center();await p.waitForFunction(id=>{const v=document.getElementById(id);return !v.paused&&v.currentTime<10},id);}
    else await video.evaluate(v=>v.play());
    await p.getByLabel(version==='pc'?'手機版':'電腦版',{exact:true}).check();assert.ok(await video.evaluate(v=>v.paused));
    results.cases.push({name,version,customSurfaceToggle:custom?'PASS':'native-only; no custom listener',hits,nativePlayPause:true,nativeSeek:true,nativeMute:true,volume,fullscreenPausedAndPlaying:true,pip,switchPause:true});
   }
   await p.close();
  }
  assert.deepEqual(results.errors,[]);fs.mkdirSync('.preview/native-controls',{recursive:true});fs.writeFileSync('.preview/native-controls/results.json',JSON.stringify(results,null,2));console.log('PASS: no overlays; native play/pause/seek/mute/volume/fullscreen/PiP; Chromium surface toggle and iOS/LINE fallback; 8 video/device cases.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
