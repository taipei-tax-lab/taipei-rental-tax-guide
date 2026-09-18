import test from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('critical assets stay within the static performance budget', () => {
  execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/performance-budget.mjs', import.meta.url))]);
});

test('income picture has no external mobile image and preserves tablet/desktop choices', () => {
  for (const file of ['site/template.html', 'index.html']) {
    const html = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
    const picture = html.match(/<picture class="v2-income-standard-fallback-icon">([\s\S]*?)<\/picture>/)[1];
    const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
    const sources = [...picture.matchAll(/<source\b[^>]*>/g)].map(m => m[0]);
    const fallback = attr(picture.match(/<img\b[^>]*>/)[0], 'src');
    assert.ok(fallback.startsWith('data:image/'), 'Fallback must not request an external image');
    for (const source of sources) {
      assert.match(attr(source, 'media'), /^\(min-width: (701|1100)px\)$/);
    }
    // Evaluate the declared source order for WebP-capable and PNG-only browsers.
    for (const webp of [true, false]) {
      for (const width of [320, 360, 390, 700, 701, 768, 1099, 1100, 1280, 1440]) {
        const source = sources.find(s => width >= Number(attr(s, 'media').match(/\d+/)[0]) &&
          (webp || attr(s, 'type') !== 'image/webp'));
        const selected = source ? attr(source, 'srcset') : fallback;
        if (width <= 700) assert.equal(selected, fallback);
        else assert.equal(selected, `./assets/images/income-standard-${width >= 1100 ? 'card' : 'illustration'}.${webp ? 'webp' : 'png'}`);
      }
    }
  }
  const css = readFileSync(new URL('../assets/css/guide-v2.css', import.meta.url), 'utf8');
  const mobile = css.slice(css.lastIndexOf('@media(max-width:700px)'), css.lastIndexOf('@media (max-width: 380px)'));
  assert.match(mobile, /\.v2-income-standard-fallback-icon\s*\{\s*display:\s*none;/);
});
