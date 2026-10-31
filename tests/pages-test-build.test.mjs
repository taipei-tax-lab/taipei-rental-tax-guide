import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root = new URL('../', import.meta.url);
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rental-pages-test-'));
const read = name => fs.readFileSync(path.join(fixture,name),'utf8');
const files = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]);
before(() => {
  for(const name of ['scripts','site','assets','hero-v2.png','hero-v2.webp','index.html']) fs.cpSync(new URL(name,root),path.join(fixture,name),{recursive:true});
  fs.writeFileSync(path.join(fixture,'PROJECT_STATE.md'),'private test sentinel');
  fs.writeFileSync(path.join(fixture,'assets/images/not-runtime.txt'),'private test sentinel');
  execFileSync(process.execPath,['scripts/build-pages-test.mjs'],{cwd:fixture,stdio:'pipe'});
});
after(() => fs.rmSync(fixture,{recursive:true,force:true}));

test('Pages test artifact disables GA4 without changing normal generated HTML or analytics helper', () => {
  const normal=read('index.html'), html=read('dist-pages-test/index.html');
  assert.match(normal,/googletagmanager\.com\/gtag\/js\?id=G-S891SFSMBH/);
  assert.doesNotMatch(html,/googletagmanager\.com|google-analytics\.com|gtag\(/);
  const restored=html.replace('  <!-- Cloudflare Pages test: GA4 disabled at build time. -->\n',normal.match(/  <!-- Google tag \(gtag\.js\) -->[\s\S]*?  <\/script>\n/)[0]);
  assert.equal(restored,normal,'only test tracking block changes');
  assert.equal(read('dist-pages-test/assets/js/analytics.js'),read('assets/js/analytics.js'));
});

test('publication excludes repo metadata, source documents, snapshots, arbitrary assets and MP4; removes stale output', () => {
  const output=path.join(fixture,'dist-pages-test');
  const published=files(output).map(p=>path.relative(output,p).replaceAll('\\','/'));
  assert.equal(published.length,33);
  for(const name of published) assert.match(name,/^(?:index\.html|404\.html|hero-v2\.(?:png|webp)|assets\/(?:css|js|images)\/.+\.(?:css|js|png|webp|svg))$/);
  assert.ok(published.every(p=>!p.endsWith('.mp4')));
  fs.writeFileSync(path.join(output,'STALE_TASK.md'),'must disappear');
  execFileSync(process.execPath,['scripts/build-pages-test.mjs'],{cwd:fixture,stdio:'pipe'});
  assert.ok(!fs.existsSync(path.join(output,'STALE_TASK.md')));
  assert.ok(fs.existsSync(path.join(output,'404.html')));
});

test('all relative HTML/CSS runtime assets resolve inside published output and R2 sources stay unchanged', () => {
  const output=path.join(fixture,'dist-pages-test');
  const html=read('dist-pages-test/index.html');
  const exists=(value,base) => {
    const url=new URL(value,'https://test.invalid/'+base);
    if(url.origin!=='https://test.invalid') return;
    assert.ok(fs.statSync(path.join(output,decodeURIComponent(url.pathname))).isFile(),value);
  };
  for(const [,value] of html.matchAll(/(?:src|href|poster|srcset)="(\.\/[^" ]+)"/g)) exists(value,'index.html');
  for(const name of ['site','guide-v2','messenger']) {
    const file=`assets/css/${name}.css`;
    for(const [,value] of read('dist-pages-test/'+file).matchAll(/url\(['"]?(\.\.\/[^'"\)]+)['"]?\)/g)) exists(value,file);
  }
  for(const state of ['idle','welcome','thinking','responding','guiding','error']) for(const ext of ['png','webp']) exists(`./assets/images/assistant/assistant-${state}.${ext}`,'index.html');
  for(const {src} of Object.values(JSON.parse(read('site/media.json')).operationGuide)) assert.ok(html.includes(src));
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(id));
});
