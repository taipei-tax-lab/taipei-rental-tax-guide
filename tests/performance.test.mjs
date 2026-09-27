import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('critical assets stay within the static performance budget', () => {
  execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/performance-budget.mjs', import.meta.url))]);
});

test('role-first home navigation keeps helper and official income-standard routes available', () => {
  for (const file of ['site/template.html', 'index.html']) {
    const html = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
    assert.equal((html.match(/class="v2-audience-button"/g) || []).length, 2);
    assert.match(html, /id="open-helper"/);
    assert.match(html, /href="https:\/\/services\.arpa\.tpctax\.dof\.gov\.taipei\/incomeReachStandard\/form\.php"/);
    assert.doesNotMatch(html, /<picture class="v2-income-standard-fallback-icon">/);
  }
});
