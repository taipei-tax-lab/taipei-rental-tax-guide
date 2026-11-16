// Local asset budgets only: file bytes are NOT measured network transfer bytes.
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = new URL('../', import.meta.url);
const budgets = [
  ['hero-v2.webp', 700_000],
  ['assets/images/income-standard-card.webp', 500_000],
  ['assets/images/income-standard-illustration.webp', 200_000],
];
for (const [name, limit] of budgets) {
  const size = statSync(new URL(name, root)).size;
  assert.ok(size > 0 && size < limit, `${name}: ${size} bytes exceeds budget ${limit}`);
  console.log(`${name}: ${size.toLocaleString('en-US')} / ${limit.toLocaleString('en-US')} bytes PASS`);
}

const read = name => readFileSync(new URL(name, root), 'utf8');
const markup = read('site/template.html');
const entry = markup.match(/<div class="v2-audience-button v2-income-standard-entry"[\s\S]*?\n              <\/div>/)[0];
assert.doesNotMatch(entry, /<img|<picture|<source/, 'Text service controls require no artwork request');
assert.match(entry, /INCOME_STANDARD_ACTIONS/);
const js = read('assets/js/messenger-ui.js');
const initialize = js.slice(js.indexOf('function initialize()'), js.indexOf('function initializeAfterHydration()'));
assert.doesNotMatch(initialize, /preloadAssistantStates\(/, 'Do not eagerly preload assistant states at initialization');
console.log(`Static performance guards PASS (${fileURLToPath(root)})`);
