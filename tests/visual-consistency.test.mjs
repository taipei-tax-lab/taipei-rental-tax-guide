import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {cardIcon, cardIcons} from '../scripts/icons.mjs';

const read = name => fs.readFileSync(new URL('../'+name, import.meta.url), 'utf8');
const html = read('index.html');

test('approved A is the deployed WebP, with versioned PNG fallback and OG', () => {
  const webp = fs.readFileSync(new URL('../hero-v2.webp', import.meta.url));
  const blob = createHash('sha1').update(`blob ${webp.length}\0`).update(webp).digest('hex');
  assert.equal(blob, '3f847526afdbff2722da5fa03f996af1ce5f5784');
  const png = fs.readFileSync(new URL('../hero-v2.png', import.meta.url));
  assert.equal(png.subarray(1,4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1672);
  assert.equal(png.readUInt32BE(20), 941);
  const css = read('assets/css/guide-v2.css');
  assert.match(css, /--hero-art: url\('\.\.\/\.\.\/hero-v2.png\?v=3f847526af'\)/);
  assert.match(css, /image-set\(url\('\.\.\/\.\.\/hero-v2.webp\?v=3f847526af'\) type\('image\/webp'\), url\('\.\.\/\.\.\/hero-v2.png\?v=3f847526af'\) type\('image\/png'\)\)/);
  assert.match(html, /property="og:image"[^>]+hero-v2.png\?v=3f847526af/);
  assert.match(read('assets/css/site.css'), /hero-v2.png\?v=3f847526af/);
});

test('all 16 distinct card semantics use one accessible original SVG library', () => {
  const names = ['owner','tenant','apply','tutorial','helper','standard','ordinary','public','social','personal','subsidy','search','questions','online','building','mail'];
  assert.deepEqual(Object.keys(cardIcons), names);
  assert.equal(new Set(Object.values(cardIcons)).size, 16);
  const rendered = [...html.matchAll(/<svg data-card-icon="([^"]+)"[^>]*>[\s\S]*?<\/svg>/g)];
  assert.deepEqual(rendered.map(m=>m[1]), names);
  for (const [svg, name] of rendered) {
    assert.equal(svg, cardIcon(name));
    for (const attr of ['viewBox="0 0 24 24"', 'stroke="currentColor"', 'stroke-width="1.8"', 'stroke-linecap="round"', 'stroke-linejoin="round"', 'aria-hidden="true"', 'focusable="false"']) assert.ok(svg.includes(attr));
    assert.doesNotMatch(svg, /<image|<text|href=|tabindex/);
  }
  assert.throws(()=>cardIcon('missing'), /Unknown card icon/);
  assert.doesNotMatch(read('site/template.html'), /<svg/);
});

test('numbering is removed at source while selected-plan emphasis and comparison routing remain', () => {
  for (const name of ['scripts/build.mjs','assets/css/guide-v2.css','index.html']) assert.doesNotMatch(read(name), /v2-card-number/);
  assert.match(read('assets/css/guide-v2.css'), /\.v2-selected \{ outline: 3px solid/);
  for (const name of ['site/template.html','scripts/build.mjs','index.html']) assert.ok(!read(name).includes('四方案完整比較'));
  assert.match(html, /id="comparison"/);
  assert.match(html, /四種方案完整比較/);
  assert.match(html, /比較四種出租方案/);
});
