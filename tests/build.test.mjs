import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {contentHash, normalizeEol} from '../scripts/text.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => normalizeEol(fs.readFileSync(path.join(root, name), 'utf8'));
const html = read('index.html');
const data = JSON.parse(read('site/content.json'));

const cxConfig = markup => {
  const tag = markup.match(/<df-messenger\b[^>]*>/)?.[0];
  assert.ok(tag, 'Messenger element must exist');
  return Object.fromEntries(['location', 'project-id', 'agent-id'].map(name => {
    const value = tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
    assert.ok(value, `Messenger ${name} must be configured`);
    return [name, value];
  }));
};

test('text hashing treats CRLF and LF as the same source content', () => {
  assert.equal(normalizeEol('first\r\nsecond'), 'first\nsecond');
  assert.equal(contentHash('first\r\nsecond'), contentHash('first\nsecond'));
});

test('checked-in GitHub Pages output is reproducible', () => {
  execFileSync(process.execPath, ['scripts/build.mjs','--check'], {cwd: root});
});
test('free-design owner flow presents optional guide before the scenario list and keeps the source-check date in the footer', () => {
  const template = read('site/template.html');
  const owner = template.slice(template.indexOf('<section id="owners"'), template.indexOf('<section id="tenants"'));
  const ownerTitle = owner.indexOf('id="owner-title"');
  const guide = owner.indexOf('class="v2-guide"');
  const plans = owner.indexOf('class="v2-plan-grid"');
  const caution = owner.indexOf('v2-plan-note');
  assert.ok(ownerTitle >= 0 && guide > ownerTitle && guide < plans, 'quick guide follows the owner heading and precedes plan scenarios');
  assert.ok(caution >= 0 && caution < plans, 'shared condition caution appears before the plan scenarios');
  assert.match(owner, /不確定適用方案？/);
  assert.doesNotMatch(owner, /v2-source-check|租稅來源核對：/);
  assert.equal((template.match(/租稅來源核對：\{\{CHECKED\}\}/g) || []).length, 1, 'the template keeps one source-check placeholder');
  const footerStart = template.indexOf('<footer class="v2-footer">');
  const footerEnd = template.indexOf('</footer>', footerStart);
  assert.ok(footerStart >= 0 && footerEnd > footerStart, 'footer must exist');
  assert.match(template.slice(footerStart, footerEnd), /<small>租稅來源核對：\{\{CHECKED\}\}/);
  assert.doesNotMatch(html, /v2-source-check/);
  assert.equal(html.split('租稅來源核對：' + data.meta.checked).length - 1, 1, 'generated output keeps the footer date only');
  const css = read('assets/css/guide-v2.css');
  assert.match(css, /\.v2-plan-card:focus-visible\s*\{/);
  assert.match(css, /\.v2-guide\s*>\s*summary:focus-visible\s*,/);
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
test('generated Messenger preserves its source fragment and CX configuration', () => {
  const messengerSource = read('site/messenger.html');
  const fragment = messengerSource.replace('{{MESSENGER_UI_VERSION}}', contentHash(read('assets/js/messenger-ui.js')));
  assert.ok(html.includes(fragment));
  assert.equal((html.match(/<df-messenger\s/g) || []).length, 1);
  assert.deepEqual(cxConfig(html), cxConfig(messengerSource));
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

test('income-standard-launcher floating shortcut is completely removed', () => {
  const messengerHtml = fs.readFileSync(path.join(root, 'site/messenger.html'), 'utf8');
  const assetPath = path.join(root, 'assets/images/income-standard-launcher.png');
  assert.ok(!fs.existsSync(assetPath), 'income-standard-launcher.png asset must not exist');

  // site/messenger.html checks
  assert.doesNotMatch(messengerHtml, /class="income-standard-launcher"/);
  assert.doesNotMatch(messengerHtml, /src="\.\/assets\/images\/income-standard-launcher\.png"/);

  // generated index.html checks
  assert.doesNotMatch(html, /class="income-standard-launcher"/);
  assert.doesNotMatch(html, /src="\.\/assets\/images\/income-standard-launcher\.png"/);
});

test('home prioritizes the two audience routes and preserves secondary service entry points', () => {
  const template = read('site/template.html');
  const freshHtml = read('index.html');
  for (const markup of [template, freshHtml]) {
    assert.equal((markup.match(/class="v2-audience-button"/g) || []).length, 2, 'only owner and tenant are primary routes');
    assert.match(markup, /href="#owners" data-audience="owner"/);
    assert.match(markup, /href="#tenants" data-audience="tenant"/);
    assert.match(markup, /class="v2-service-link v2-chat-entry" id="open-helper"/);
    assert.match(markup, /href="https:\/\/services\.arpa\.tpctax\.dof\.gov\.taipei\/incomeReachStandard\/form\.php"/);
    assert.match(markup, /target="_blank"/);
    assert.match(markup, /rel="noopener noreferrer"/);
    assert.match(markup, /aria-label="所得達租金標準申報優惠稅率專區（另開新視窗）"/);
    assert.doesNotMatch(markup, /v2-income-standard-fallback|v2-income-standard-card-image/);
  }
  const css = read('assets/css/guide-v2.css');
  assert.match(css, /\.v2-service-tools\s*\{/);
  assert.match(css, /@media\(max-width:700px\)/);
});
