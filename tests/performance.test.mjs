import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

test('critical assets stay within the static performance budget', () => {
  execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/performance-budget.mjs', import.meta.url))]);
});
