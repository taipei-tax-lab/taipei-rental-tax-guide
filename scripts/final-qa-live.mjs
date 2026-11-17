// Normal TLS readback; run with Node --use-env-proxy when the environment requires a proxy.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base = process.env.PREVIEW_URL || 'https://rental-tax-guide-test.pages.dev/';
const output = process.env.EVIDENCE_DIR || '.preview/finalqa/live';
assert.ok(output.startsWith('.preview/'));
assert.equal(new URL(base).protocol,'https:');
assert.ok(new URL(base).hostname.endsWith('.pages.dev'));
const root = path.resolve('dist-pages-test');
const files = fs.readdirSync(root,{recursive:true}).filter(f => fs.statSync(path.join(root,f)).isFile()).sort();
assert.equal(files.length,33);
const results = [];
for (let start=0; start<files.length; start+=4) {
  await Promise.all(files.slice(start,start+4).map(async file => {
    const response = await fetch(new URL(file,base),{signal:AbortSignal.timeout(30000)});
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(response.status===200 || (file==='404.html' && response.status===404),file+' status');
    assert.deepEqual(bytes,fs.readFileSync(path.join(root,file)),file+' differs from current Pages build');
    const mime = response.headers.get('content-type');
    const expected = {'.html':'text/html','.css':'text/css','.js':'javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[path.extname(file)];
    assert.ok(mime?.includes(expected),file+' MIME '+mime);
    if (file==='index.html') assert.ok(!/googletagmanager\.com|google-analytics\.com|gtag\(/.test(bytes.toString()));
    results.push({file,status:response.status,mime,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }));
}
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'normal-tls.json'),JSON.stringify({base,testedAt:new Date().toISOString(),tls:'normal certificate validation; no TLS bypass',matched:results.length,ga4Disabled:true,results:results.sort((a,b)=>a.file.localeCompare(b.file))},null,2));
console.log('PASS normal TLS: all 33 live runtime files match current dist-pages-test bytes and MIME; GA4 disabled.');
