import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Fixed target: never accept a caller-supplied recursive-delete destination.
const output = path.join(root, 'dist-pages-test');
if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw new Error('Output must not be a symlink');
execFileSync(process.execPath, [path.join(root, 'scripts/build.mjs')], {cwd: root, stdio: 'inherit'});
const original = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ga4 = /  <!-- Google tag \(gtag\.js\) -->\r?\n  <script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-S891SFSMBH"><\/script>\r?\n  <script>[\s\S]*?  <\/script>\r?\n/;
if (!ga4.test(original)) throw new Error('Expected GA4 block missing; review test-build isolation');
const html = original.replace(ga4, '  <!-- Cloudflare Pages test: GA4 disabled at build time. -->\n');
if (/googletagmanager\.com|google-analytics\.com|gtag\(/.test(html)) throw new Error('Tracking remains in test HTML');

// Explicit runtime allowlist, including every dynamic assistant state and fallback.
const files = [
  'hero-v2.png', 'hero-v2.webp',
  ...['site','guide-v2','messenger'].map(name => `assets/css/${name}.css`),
  ...['analytics','guide-rules','guide-ui','operation-guide','messenger-ui'].map(name => `assets/js/${name}.js`),
  ...['tpctax-logo.png','tpctax-mark.png','income-standard-card.png','income-standard-card.webp',
    'income-standard-illustration.png','income-standard-illustration.webp','operation-guide-poster.svg'].map(name => `assets/images/${name}`),
  'assets/images/assistant/assistant-chat-bubble.png',
  ...['idle','welcome','thinking','responding','guiding','error'].flatMap(state =>
    ['png','webp'].map(ext => `assets/images/assistant/assistant-${state}.${ext}`))
];
for (const file of files) {
  const stat = fs.lstatSync(path.join(root, file));
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Non-regular runtime asset: ${file}`);
}
fs.rmSync(output, {recursive: true, force: true});
fs.mkdirSync(output);
fs.writeFileSync(path.join(output, 'index.html'), html);
// A top-level 404 prevents Pages' implicit SPA fallback from returning index for private paths.
fs.writeFileSync(path.join(output, '404.html'), '<!doctype html><html lang="zh-Hant-TW"><meta charset="utf-8"><title>找不到頁面</title><h1>找不到頁面</h1><p>此網址沒有可公開的網頁。</p></html>\n');
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Pages test: ${files.length + 2} static files in dist-pages-test; GA4 disabled; no repository documents or MP4.`);
