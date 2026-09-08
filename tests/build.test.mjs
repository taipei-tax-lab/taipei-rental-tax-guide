import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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
  const fragment = fs.readFileSync(path.join(root, 'site/messenger.html'), 'utf8');
  assert.ok(html.includes(fragment));
  assert.equal((html.match(/<df-messenger\s/g) || []).length, 1);
  assert.match(fragment, /agent-id="9fb1cac6-62cd-40e6-8b13-eecf651f1f72"/);
  assert.match(fragment, /src="\.\/assets\/js\/messenger-ui\.js"/);
});
