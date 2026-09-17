const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1280,height:592}});
  await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:4175/');
  await page.waitForFunction(()=>document.querySelector('df-messenger-chat-bubble')?.openChat);
  await page.locator('#open-helper').click();
  await page.locator('.rental-input-extras').waitFor();
  const results=[];
  // CSS viewport equivalents of desktop zoom levels, plus phones and keyboard height.
  for(const [width,height] of [[1600,740],[1280,592],[1024,474],[853,395],[640,296],[390,844],[320,480]]) {
   await page.setViewportSize({width,height});
   await page.waitForFunction(()=>{
    const bubble=document.querySelector('df-messenger-chat-bubble');
    const c=bubble.shadowRoot.querySelector('.chat-wrapper').getBoundingClientRect();
    const panel=document.querySelector('.assistant-panel');
    const r=panel.getBoundingClientRect();
    const top=parseFloat(document.querySelector('df-messenger').style.getPropertyValue('--rental-chat-top'));
    return Math.abs(c.top-top)<1&&c.bottom<=innerHeight&&c.right<=innerWidth&&(panel.hidden||(Math.abs(r.top-c.top)<2&&Math.abs(r.bottom-c.bottom)<2));
   });
   const geometry=await page.evaluate(()=>{
    const bubble=document.querySelector('df-messenger-chat-bubble');
    const chat=bubble.shadowRoot.querySelector('.chat-wrapper');
    const inner=chat.querySelector('df-messenger-chat');
    const rect=e=>e.getBoundingClientRect().toJSON();
    const panel=document.querySelector('.assistant-panel');
    return {chat:rect(chat),title:rect(chat.querySelector('df-messenger-titlebar')),input:rect(inner.shadowRoot.querySelector('df-messenger-user-input')),panel:panel.hidden?null:rect(panel),close:rect(inner.querySelector('.close-action')),children:[...inner.shadowRoot.children].map(e=>({tag:e.tagName,height:e.getBoundingClientRect().height}))};
   });
   assert.ok(geometry.title.top>=0&&geometry.title.bottom<=height,`title at ${width}x${height}`);
   assert.ok(geometry.input.top>=geometry.title.bottom&&geometry.input.bottom<=height,`input at ${width}x${height}`);
   assert.ok(geometry.close.top>=0&&geometry.close.bottom<=height,`close at ${width}x${height}`);
   if(geometry.panel) {assert.ok(Math.abs(geometry.panel.top-geometry.chat.top)<2);assert.ok(Math.abs(geometry.panel.bottom-geometry.chat.bottom)<2);}
   if(height<400) {
    const extras=page.locator('.rental-input-extras');
    await extras.locator('summary').click();
    assert.ok(await extras.locator('p').isVisible());
    await extras.locator('summary').click();
    assert.equal(await page.locator('df-messenger-chat-bubble .close-button').isVisible(),false);
   }
   results.push({width,height,...geometry});
   await page.screenshot({path:`.preview/chat-viewport-${width}-${height}.png`});
  }
  await page.setViewportSize({width:1280,height:592});
  const cdp=await page.context().newCDPSession(page);
  for(const scale of [1.25,1.5,2,1]) {
   await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:scale});
   await page.waitForFunction(()=>{
    const v=visualViewport;
    const r=document.querySelector('df-messenger-chat-bubble').shadowRoot.querySelector('.chat-wrapper').getBoundingClientRect();
    return r.top>=v.offsetTop&&r.left>=v.offsetLeft&&r.right<=v.offsetLeft+v.width+2&&r.bottom<=v.offsetTop+v.height+2;
   });
  }
  await page.locator('df-messenger').getByRole('textbox').fill('尚未送出的草稿');
  await page.evaluate(()=>document.querySelector('df-messenger-chat-bubble').closeChat());
  await page.evaluate(()=>document.querySelector('df-messenger-chat-bubble').openChat());
  assert.equal(await page.locator('df-messenger').getByRole('textbox').inputValue(),'尚未送出的草稿');
  fs.writeFileSync('.preview/chat-viewport-results.json',JSON.stringify(results,null,2));
  console.log('PASS: chat/title/input/close bounds, side panel alignment, zoom-sized viewports and draft preservation');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
