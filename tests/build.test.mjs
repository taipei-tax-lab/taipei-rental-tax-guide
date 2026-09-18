import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'site/content.json'), 'utf8'));
test('checked-in GitHub Pages output is reproducible', () => {
  execFileSync(process.execPath, ['scripts/build.mjs','--check'], {cwd: root});
});
test('static anchors are unique and every internal link resolves', () => {
  const allIds = Array.from(html.matchAll(/\bid="([^"]+)"/g), m => m[1]);
  assert.equal(new Set(allIds).size, allIds.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(allIds.includes(id), `Missing #${id}`);
});
test('all plans expose complete tax information and official next steps without client-side rendering', () => {
  for (const plan of data.plans) {
    assert.ok(html.includes(`data-page="plan-${plan.id}"`));
    assert.ok(html.includes(plan.firstStep));
    assert.equal(plan.taxes.length, 3);
    assert.match(plan.source.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(html.includes(plan.source.url.replaceAll('&','&amp;')));
  }
  assert.doesNotMatch(html, /_next\/|vinext\.navigationRuntime|site-enhancements\.js/);
});
test('embedded Messenger is the preserved fragment with the original agent settings', () => {
  const fragment = fs.readFileSync(path.join(root, 'site/messenger.html'), 'utf8').replace('{{MESSENGER_UI_VERSION}}', createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/js/messenger-ui.js'))).digest('hex').slice(0,10));
  assert.ok(html.includes(fragment));
  assert.equal((html.match(/<df-messenger\s/g) || []).length, 1);
  assert.match(fragment, /agent-id="9fb1cac6-62cd-40e6-8b13-eecf651f1f72"/);
  assert.match(fragment, /src="\.\/assets\/js\/messenger-ui\.js\?v=[a-f0-9]{10}"/);
});
test('all plans provide a full condition hook for the guide UI', () => {
  for (const plan of data.plans) {
    const planSection = html.slice(html.indexOf(`id="plan-${plan.id}"`), html.indexOf(`id="plan-${plan.id}"`) + 3500);
    assert.match(planSection, /<li\s+class="v2-full-condition">/);
  }
});
test('typography rules prevent forced line breaks and keep tokens inline', () => {
  const css = fs.readFileSync(path.join(root, 'assets/css/guide-v2.css'), 'utf8');
  assert.match(css, /\.v2-other-taxes\s*>\s*span\s*\{\s*display:\s*block;\s*\}/);
  assert.doesNotMatch(css, /\.v2-other-taxes\s+span\s*\{/);
  assert.match(css, /\.v2-unit\s*\{[^}]*display:\s*inline;/);
  assert.doesNotMatch(css, /\.v2-plan-name\b[^}]*text-wrap:\s*balance/);
});

test('public landlord includes official flow PDF with https www-ws.gov.taipei source link', () => {
  const publicPlan = data.plans.find(p => p.id === 'public');
  const flowPdfLink = publicPlan.sourceLinks?.find(l => l.title === '認定公益出租人流程圖（PDF）');
  assert.ok(flowPdfLink, 'Missing 認定公益出租人流程圖（PDF） source link');
  assert.ok(flowPdfLink.url.startsWith('https://'));
  assert.equal(new URL(flowPdfLink.url).host, 'www-ws.gov.taipei');
  assert.ok(!flowPdfLink.url.includes('chrome-extension://'));
  assert.ok(flowPdfLink.url.includes('&'), 'content.json must store unescaped &');
  assert.ok(!flowPdfLink.url.includes('&amp;'), 'content.json must not store manually escaped &amp;');
  assert.ok(html.includes(flowPdfLink.url.replaceAll('&', '&amp;')));
  assert.doesNotMatch(html, /chrome-extension:\/\//);
});

test('build script validates all plan sourceLinks require HTTPS', () => {
  const script = fs.readFileSync(path.join(root, 'scripts/build.mjs'), 'utf8');
  assert.match(script, /plan\.sourceLinks/);
  assert.match(script, /new URL\(url\)\.protocol !== 'https:'/);
});

test('favicon uses official Taipei Revenue Service mark and preserves header logo', () => {
  const template = fs.readFileSync(path.join(root, 'site/template.html'), 'utf8');
  assert.doesNotMatch(template, /favicon\.svg/, 'template.html must not reference old generic favicon');
  assert.match(template, /<link rel="icon" href="\.\/assets\/images\/tpctax-mark\.png" type="image\/png">/);
  assert.ok(fs.existsSync(path.join(root, 'assets/images/tpctax-mark.png')), 'Official mark asset must exist');
  assert.match(html, /<link rel="icon" href="\.\/assets\/images\/tpctax-mark\.png" type="image\/png">/);
  assert.match(html, /src="\.\/assets\/images\/tpctax-logo\.png"/, 'Header brand logo must be preserved');
});

test('messenger ui rules ensure notice is never moved into details and panel aligns gapless', () => {
  const messengerUi = fs.readFileSync(path.join(root, 'assets/js/messenger-ui.js'), 'utf8');
  assert.match(messengerUi, /\.rental-input-extras\{flex:none;/);
  assert.doesNotMatch(messengerUi, /max-height:\s*35%/);
  assert.doesNotMatch(messengerUi, /details\.querySelector\('summary'\)\.after\(notice\)/, 'Notice must never be moved into details');
  assert.match(messengerUi, /box-sizing:border-box/, 'assistant panel must declare box-sizing: border-box');
  assert.match(messengerUi, /elements\.assistantPanel\.style\.left\s*=\s*\(rect\.left - panelWidth/, 'assistant panel must align with chat left');
});

test('income-standard-launcher floating shortcut is declared and built correctly', () => {
  const messengerHtml = fs.readFileSync(path.join(root, 'site/messenger.html'), 'utf8');
  const assetPath = path.join(root, 'assets/images/income-standard-launcher.png');
  assert.ok(fs.existsSync(assetPath), 'income-standard-launcher.png asset must exist');

  // site/messenger.html checks
  assert.match(messengerHtml, /class="income-standard-launcher"/);
  assert.match(messengerHtml, /href="https:\/\/services\.arpa\.tpctax\.dof\.gov\.taipei\/incomeReachStandard\/form\.php"/);
  assert.match(messengerHtml, /target="_blank"/);
  assert.match(messengerHtml, /rel="noopener noreferrer"/);
  assert.match(messengerHtml, /src="\.\/assets\/images\/income-standard-launcher\.png"/);
  assert.match(messengerHtml, /alt="所得達租金標準申報優惠稅率專區"/);

  // generated index.html checks
  assert.match(html, /class="income-standard-launcher"/);
  assert.match(html, /href="https:\/\/services\.arpa\.tpctax\.dof\.gov\.taipei\/incomeReachStandard\/form\.php"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /src="\.\/assets\/images\/income-standard-launcher\.png"/);
  assert.match(html, /alt="所得達租金標準申報優惠稅率專區"/);
});

