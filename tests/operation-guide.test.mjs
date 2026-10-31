import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const html = read('index.html');
const data = JSON.parse(read('site/content.json'));

test('six entries preserve existing destinations and expose both new hash pages', () => {
  const entries = html.slice(html.indexOf('class="v2-audience"'), html.indexOf('id="helper-status"'));
  assert.equal((entries.match(/class="v2-audience-button/g) || []).length, 6);
  for (const hash of ['owners','tenants','direct-apply','operation-guide']) assert.ok(entries.includes(`href="#${hash}"`));
  assert.ok(entries.includes('id="open-helper"'));
  assert.ok(entries.includes('data-service-entry="income_standard"'));
  assert.ok(entries.includes('觀看 2 分鐘使用教學'));
  assert.doesNotMatch(html, /返回首頁/);
});

test('application page shares complete process and official links for each plan', () => {
  const section = html.slice(html.indexOf('data-page="direct-apply"'), html.indexOf('data-page="operation-guide"'));
  assert.equal((section.match(/class="v2-application-item /g) || []).length, 4);
  const esc = s => s.replaceAll('&','&amp;');
  for (const plan of data.plans) {
    assert.ok(section.includes(plan.applicationMode));
    for (const step of plan.process) assert.ok(section.includes(step));
    assert.ok(section.includes(esc(plan.applicationAction.href)));
    assert.ok(section.includes(plan.applicationAction.label));
  }
  assert.match(section, /地方稅主動辦理/);
  assert.match(section, /自行申請地方稅/);
});

test('both video sources come from switchable config and retain native player affordances', () => {
  const media = JSON.parse(read('site/media.json')).operationGuide;
  const players = [...html.matchAll(/<video\b[^>]*>[\s\S]*?<\/video>/g)];
  assert.equal(players.length, 2);
  for (const [i, version] of ['pc','mobile'].entries()) {
    assert.ok(players[i][0].includes(media[version].src));
    assert.match(players[i][0], /controls playsinline preload="none"/);
    assert.ok(players[i][0].includes(`poster="./assets/images/operation-guide-poster${version === 'mobile' ? '-mobile' : ''}.svg"`));
    assert.ok(players[i][0].includes(version === 'mobile' ? 'width="1080" height="1920"' : 'width="1920" height="1080"'));
    assert.doesNotMatch(players[i][0], /autoplay|loop|controlslist="nofullscreen"/i);
  }
  assert.match(read('assets/css/guide-v2.css'), /aspect-ratio: 16 \/ 9/);
  assert.match(read('assets/css/guide-v2.css'), /\[data-video-version="mobile"\] video \{ max-width: 360px; aspect-ratio: 9 \/ 16/);
});

function playerFixture(navigator = {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}) {
  const events = {};
  const controls = ['pc','mobile'].map((value, i) => ({value, checked:i===0, addEventListener(type, fn) { this[type] = fn; }}));
  const videos = controls.map(() => ({paused:false, currentTime:12, pause() {this.paused=true;}, play() {throw new Error('must never autoplay');}}));
  const panels = controls.map((c,i) => ({dataset:{videoVersion:c.value}, hidden:false, querySelector(selector) {return selector === 'video' ? videos[i] : null;}}));
  const document = {hidden:false, querySelectorAll(selector) {return selector === '[data-video-version]' ? panels : controls;}, addEventListener(type,fn) {events[type]=fn;}};
  const window = {addEventListener(type,fn) {events[type]=fn;}};
  vm.runInNewContext(read('assets/js/operation-guide.js'), {document,window,navigator});
  return {controls,videos,panels,document,window,events};
}

test('initial version follows browser mobile device hint, with phone UA fallback', () => {
  for (const [navigator, expected] of [
    [{userAgentData:{mobile:true},userAgent:'reduced'}, 'mobile'],
    [{userAgentData:{mobile:false},userAgent:'iPhone'}, 'pc'],
    [{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile'}, 'mobile'],
    [{userAgent:'Mozilla/5.0 (Linux; Android 15) Chrome/130 Mobile Safari/537.36'}, 'mobile'],
    [{userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}, 'pc'],
    [{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}, 'pc'],
    [{userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1'}, 'pc'],
    [{userAgent:'Mozilla/5.0 (Linux; Android 15; SM-X710) AppleWebKit/537.36 Chrome/130 Safari/537.36'}, 'pc']
  ]) {
    const f = playerFixture(navigator);
    assert.equal(f.controls.find(c=>c.checked).value,expected);
    assert.equal(f.panels.find(p=>!p.hidden).dataset.videoVersion,expected);
    assert.ok(f.videos.every(v=>v.paused));
  }
});

test('phone manual PC selection survives route pauses without autoplay or progress loss', () => {
  const f = playerFixture({userAgentData:{mobile:true},userAgent:'reduced'});
  f.controls[0].checked=true; f.controls[1].checked=false; f.controls[0].change();
  f.videos[0].paused=false;
  f.window.RentalOperationGuide.pause();
  f.window.RentalOperationGuide.pause();
  assert.equal(f.controls.find(c=>c.checked).value,'pc');
  assert.deepEqual(f.panels.map(p=>p.hidden),[false,true]);
  assert.ok(f.videos.every(v=>v.paused));
  assert.deepEqual(f.videos.map(v=>v.currentTime),[12,12]);
});

test('switching and navigation pause both players without resetting selection or progress', () => {
  const f = playerFixture();
  assert.deepEqual(f.panels.map(p=>p.hidden),[false,true]);
  assert.ok(f.videos.every(v=>v.paused));
  f.videos[0].paused=false;
  f.controls[0].checked=false; f.controls[1].checked=true; f.controls[1].change();
  assert.deepEqual(f.panels.map(p=>p.hidden),[true,false]);
  assert.ok(f.videos.every(v=>v.paused));
  f.videos[1].paused=false; f.window.RentalOperationGuide.pause();
  assert.ok(f.videos.every(v=>v.paused));
  assert.equal(f.controls[1].checked,true);
  assert.deepEqual(f.videos.map(v=>v.currentTime),[12,12]);
  assert.match(read('assets/js/guide-ui.js'), /if \(pageName !== 'operation-guide'\) window.RentalOperationGuide\?\.pause\(\)/);
});

test('backgrounding the browser or leaving the document pauses playback', () => {
  const f = playerFixture();
  f.videos[0].paused=false; f.document.hidden=true; f.events.visibilitychange();
  assert.ok(f.videos.every(v=>v.paused));
  f.videos[1].paused=false; f.events.pagehide();
  assert.ok(f.videos.every(v=>v.paused));
});

test('build accepts future relative video paths and rejects non-HTTPS remote sources', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rental-guide-media-'));
  try {
    for (const dir of ['site','scripts','assets/css','assets/js']) {
      fs.cpSync(new URL('../' + dir, import.meta.url), path.join(fixture,dir), {recursive:true});
    }
    const media = {operationGuide:{pc:{src:'./assets/videos/pc.mp4'},mobile:{src:'./assets/videos/mobile.mp4'}}};
    const config = path.join(fixture,'site/media.json');
    fs.writeFileSync(config,JSON.stringify(media));
    execFileSync(process.execPath,['scripts/build.mjs'],{cwd:fixture});
    const output=fs.readFileSync(path.join(fixture,'index.html'),'utf8');
    assert.ok(output.includes('src="./assets/videos/pc.mp4"'));
    assert.ok(output.includes('src="./assets/videos/mobile.mp4"'));
    media.operationGuide.pc.src='http://example.com/pc.mp4';
    fs.writeFileSync(config,JSON.stringify(media));
    assert.throws(()=>execFileSync(process.execPath,['scripts/build.mjs'],{cwd:fixture,stdio:'pipe'}),/Command failed/);
  } finally { fs.rmSync(fixture,{recursive:true,force:true}); }
});
