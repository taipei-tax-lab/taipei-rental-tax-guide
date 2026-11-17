import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=n=>fs.readFileSync(new URL('../'+n,import.meta.url),'utf8');
test('FAQ uses approved name without changing policy date or period rules',()=>{const html=read('index.html');assert.ok(html.includes('出租房屋所得達租金標準及個人租賃住宅包租代管'));assert.ok(html.includes('2026-09-08'));assert.ok(html.includes('房屋稅 3/22 前、地價稅 9/22 前'));});
test('local messenger close has native semantics and defined panel color',()=>{const js=read('assets/js/messenger-ui.js');assert.match(js,/button type="button" class="rental-chat-close" aria-label="關閉小幫手"/);assert.ok(!js.includes('var(--cream)'));assert.ok(!read('assets/css/guide-v2.css').includes('var(--v2-ink)'));});
