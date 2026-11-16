// Read-only: navigate only. Never enter data, submit, or change the approved URL.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const data=JSON.parse(fs.readFileSync('site/content.json','utf8'));
 const folder=process.env.EVIDENCE_DIR||'.preview/entry-redesign/external';fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch({...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{channel:'msedge'}),headless:true});
 const results=[];
 try{for(const action of [...data.incomeStandardActions,...data.directApplyActions]){
  const page=await browser.newPage({ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1',viewport:{width:1440,height:1000}});
  const item={id:action.id,requested:action.href,at:new Date().toISOString()};
  try{const response=await page.goto(action.href,{waitUntil:'domcontentloaded',timeout:25000});item.status=response?.status();await page.waitForTimeout(3000);item.finalUrl=page.url();item.title=await page.title();item.visibleText=(await page.locator('body').innerText()).slice(0,2000);item.needsManualReview=item.status>=400||/Request Rejected|Access Denied|captcha|找不到|無法存取|無法連上|系統錯誤|\b404\b/i.test(item.visibleText);await page.screenshot({timeout:10000,path:`${folder}/${action.id}.png`});}
  catch(e){item.error=e.message.split('\n')[0];item.finalUrl=page.url();item.needsManualReview=true;await page.screenshot({timeout:10000,path:`${folder}/${action.id}.png`}).catch(()=>{});}
  results.push(item);await page.close();
 }}finally{await browser.close();}
 fs.writeFileSync(`${folder}/results.json`,JSON.stringify({browser:'Chromium; read-only navigation; no form submitted',tlsVerificationBypass:process.env.BROWSER_IGNORE_HTTPS_ERRORS==='1',results},null,2));console.log(JSON.stringify(results.map(({id,status,title,needsManualReview,error})=>({id,status,title,needsManualReview,error})),null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
