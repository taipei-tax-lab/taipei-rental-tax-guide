// Final QA: readable columns and font scaling, independent of horizontal overflow.
const {chromium} = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const baseline = process.argv.includes('--baseline');
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4175/';
  const dir = process.env.EVIDENCE_DIR || '.preview/finalqa';
  assert.ok(dir.startsWith('.preview/'));
  fs.mkdirSync(dir, {recursive:true});
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true});
  const page = await browser.newPage({ignoreHTTPSErrors:process.env.BROWSER_IGNORE_HTTPS_ERRORS === '1'});
  await page.route('**/*', r => new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort());
  const rows = [];
  try {
    for (const width of [320,390,700,701,720,768,900,1024,1440]) for (const font of [100,150,200]) {
      await page.setViewportSize({width,height:844});
      await page.goto(base + '#direct-apply');
      await page.locator('.v2-ready').waitFor();
      await page.addStyleTag({content:`html{font-size:${font}% !important}`});
      const row = await page.evaluate(() => {
        const rect = selector => document.querySelector(selector).getBoundingClientRect();
        const size = selector => parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
        const name = document.querySelector('.v2-form-group li > span');
        const range = document.createRange(); range.selectNodeContents(name);
        const lines = [...new Set([...range.getClientRects()].map(r => r.top))].length;
        const bookNames = [...document.querySelectorAll('.v2-form-group li > span')].map(e => {
          const text = document.createRange(); text.selectNodeContents(e);
          return {text:e.textContent.trim(),width:e.getBoundingClientRect().width,lines:new Set([...text.getClientRects()].map(r=>r.top)).size};
        });
        return {
          book:rect('.v2-form-group li > span').width, footer:rect('.v2-footer > div').width,
          formsHeight:rect('.v2-forms').height, footerHeight:rect('.v2-footer').height,
          h1:size('#home-title'), h2:size('#direct-apply-title'), body:size('.v2-form-group li > span'),
          bookLines:lines, bookNames, overflow:document.documentElement.scrollWidth-innerWidth
        };
      });
      rows.push({width,font,...row});
      if (!baseline) {
        assert.ok(row.book >= Math.min(width-90,120), 'readable book width ' + JSON.stringify(rows.at(-1)));
        assert.ok(row.footer >= 120, 'readable footer');
        assert.ok(row.bookNames.every(n=>n.width>=Math.min(width-90,120)),'all long book names have readable columns');
        assert.ok(row.overflow <= 0);
        assert.equal(row.h1,28*font/100); assert.equal(row.h2,28*font/100);
        assert.equal(row.body,18*font/100);
      }
      if (width === 701 && font === 200) await page.screenshot({path:dir+`/${baseline?'before':'after'}-701.png`,fullPage:true});
    }
    fs.writeFileSync(dir+`/${baseline?'before':'after'}-layout.json`,JSON.stringify(rows,null,2));
    console.log('PASS layout, readable columns and measured 100/150/200 font ratios',rows.length);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
