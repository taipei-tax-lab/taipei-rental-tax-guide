import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {cardIcon, cardIcons} from '../scripts/icons.mjs';

const read = name => fs.readFileSync(new URL('../'+name, import.meta.url), 'utf8');
const html = read('index.html');

test('approved refined A is the deployed WebP, with versioned PNG fallback and OG', () => {
  const webp = fs.readFileSync(new URL('../hero-v2.webp', import.meta.url));
  assert.equal(webp.length, 135064);
  const blob = createHash('sha1').update(`blob ${webp.length}\0`).update(webp).digest('hex');
  assert.equal(blob, '81760c85cfdde844809a04f1ab6a5ba51c25d293');
  const png = fs.readFileSync(new URL('../hero-v2.png', import.meta.url));
  assert.equal(png.subarray(1,4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1672);
  assert.equal(png.readUInt32BE(20), 941);
  const css = read('assets/css/guide-v2.css');
  assert.match(css, /--hero-art: url\('\.\.\/\.\.\/hero-v2.png\?v=81760c85cf'\)/);
  assert.match(css, /image-set\(url\('\.\.\/\.\.\/hero-v2.webp\?v=81760c85cf'\) type\('image\/webp'\), url\('\.\.\/\.\.\/hero-v2.png\?v=81760c85cf'\) type\('image\/png'\)\)/);
  assert.match(html, /property="og:image"[^>]+hero-v2.png\?v=81760c85cf/);
  assert.match(read('assets/css/site.css'), /hero-v2.png\?v=81760c85cf/);
});

test('only the four approved icon definitions change from the verified 4fc7521 baseline', () => {
  const baseline = JSON.parse(read('tests/fixtures/card-icons-4fc7521.json'));
  assert.deepEqual(Object.keys(cardIcons), Object.keys(baseline));
  const changed = Object.entries(cardIcons).filter(([key, artwork]) =>
    createHash('sha256').update(artwork).digest('hex') !== baseline[key]).map(([key]) => key);
  assert.deepEqual(changed, ['owner', 'tenant', 'personal', 'subsidy']);
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


test('only personal and subsidy change from the actual 6e6d7fe artwork', () => {
 const baseline=JSON.parse(read('tests/fixtures/card-icons-6e6d7fe.json'));
 assert.deepEqual(Object.keys(cardIcons),Object.keys(baseline));
 assert.deepEqual(Object.entries(cardIcons).filter(([k,v])=>createHash('sha256').update(v).digest('hex')!==baseline[k]).map(([k])=>k),['personal','subsidy']);
});
