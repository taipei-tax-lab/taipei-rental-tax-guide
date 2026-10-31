const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173/';
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const tracking=[],failedAssets=[];
    page.on('request',req=>{if(/googletagmanager\.com|google-analytics\.com/.test(req.url()))tracking.push(req.url());});
    page.on('response',res=>{if(res.url().startsWith(new URL(base).origin)&&res.status()>=400)failedAssets.push(res.url());});
    await page.route('https://**/*',route=>route.abort());
    await page.goto(base); await page.locator('.v2-ready').waitFor();
    assert.equal(await page.evaluate(()=>typeof window.gtag),'undefined');
    assert.equal(await page.evaluate(()=>window.RentalAnalytics.track('audience_select',{audience:'owner'})),false);
    await page.locator('.v2-audience a[href="#tenants"]').click();
    await page.locator('.v2-audience a[href="#owners"]').click();
    await page.locator('#card-public').click();
    await page.locator('footer a[href="#direct-apply"]').click();
    assert.equal(await page.locator('.v2-application-item:visible').count(),4);
    await page.locator('footer a[href="#operation-guide"]').click();
    await page.getByLabel('手機版',{exact:true}).check();
    await page.locator('footer a[href="#direct-apply"]').click();
    await page.locator('footer a[href="#operation-guide"]').click();
    assert.ok(await page.getByLabel('手機版',{exact:true}).isChecked());
    assert.equal(await page.locator('video').evaluateAll(videos=>videos.every(v=>v.paused)),true);
    assert.deepEqual(tracking,[]); assert.deepEqual(failedAssets,[]);
    for(const path of ['PROJECT_STATE.md','TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md','README.md','site/content.json','scripts/build.mjs','.git/config','docs/history/PROJECT_STATE_BEFORE_2026-10-31.md']) {
      const response=await page.request.get(new URL(path,base).href); assert.equal(response.status(),404,path);
    }
    fs.mkdirSync('.preview',{recursive:true});
    fs.writeFileSync('.preview/pages-test-results.json',JSON.stringify({trackingRequests:tracking,failedRuntimeAssets:failedAssets,privatePaths404:true,hashNavigation:true},null,2));
    console.log('PASS: test artifact runtime assets, GA4 absent/no tracking requests under interaction, hash/video state, private paths 404.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
