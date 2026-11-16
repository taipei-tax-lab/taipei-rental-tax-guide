import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('critical assets stay within the static performance budget', () => {
  execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/performance-budget.mjs', import.meta.url))]);
});

test('income standard text controls request no artwork at any viewport',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const entry=html.match(/<div class="v2-audience-button v2-income-standard-entry"[\s\S]*?\n              <\/div>/)[0];
 assert.doesNotMatch(entry,/<img|<picture|<source|src=/);
});
