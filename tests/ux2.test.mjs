import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = name => fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=read('index.html');
const data=JSON.parse(read('site/content.json'));
test('one shared hero precedes all content pages and six entry DOM order matches requested keyboard order',()=>{
  const shell=html.slice(html.indexOf('data-entry-shell'),html.indexOf('<div data-page="home">'));
  assert.equal((html.match(/data-entry-shell/g)||[]).length,1);
  const labels=[...shell.matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>/g)].map(m=>m[1].replace(/<[^>]+>/g,''));
  assert.deepEqual(labels,['我是屋主','我是房客','直接申請','操作說明','直接問小幫手','出租房屋達租金標準']);
  assert.equal((shell.match(/<(?:a|button)\b/g)||[]).length,7);
  assert.equal((html.match(/id="open-helper"/g)||[]).length,1);
  assert.equal((html.match(/id="top"/g)||[]).length,1);
  for(const page of ['direct-apply','operation-guide']) assert.match(html,new RegExp(`<h2 id="${page}-title" tabindex="-1">`));
});
test('application page has three equal channel links while four policy records remain',()=>{
  const section=html.slice(html.indexOf('data-page="direct-apply"'),html.indexOf('data-page="operation-guide"'));
  const cards=[...section.matchAll(/<a class="v2-application-item"[\s\S]*?<\/a>/g)].map(m=>m[0]);
  assert.equal(cards.length,3);
  assert.deepEqual(data.directApplyActions.map(a=>a.label),['線上申請','親自申請','郵寄/傳真']);
  for(const [i,action] of data.directApplyActions.entries()) {
    assert.ok(cards[i].includes(action.href.replaceAll('&','&amp;')));
    assert.ok(cards[i].includes(action.label));assert.ok(cards[i].includes(action.note));
    assert.ok(cards[i].includes(`data-service-entry="${action.id}"`));
    assert.match(cards[i],/target="_blank" rel="noopener noreferrer"/);
    assert.match(cards[i],/另開新視窗/);
  }
  assert.equal(data.plans.length,4);
  for(const plan of data.plans) for(const step of plan.process) assert.ok(html.includes(step));
});

test('retired shared note and its empty paragraphs are absent from generated pages',()=>{
  const note='以下為公開資訊整理；實際資格、適用期間與稅額，以主管機關公告及個案核定為準。';
  assert.equal(Object.hasOwn(data.meta,'note'),false);
  assert.ok(!html.includes(note));
  const application=html.slice(html.indexOf('data-page="direct-apply"'),html.indexOf('data-page="operation-guide"'));
  const footer=html.slice(html.indexOf('<footer'),html.indexOf('</footer>'));
  assert.doesNotMatch(application+footer,/<p\b[^>]*>\s*<\/p>/);
  assert.doesNotMatch(html,/<p class="v2-notice">/);
  assert.ok(!read('site/template.html').includes('{{NOTE}}'));
  assert.doesNotMatch(read('scripts/build.mjs'),/data\.meta\.note|\bNOTE:/);
  // Independent scheme-specific notices remain in the generated content.
  for(const plan of data.plans) {
    assert.ok(plan.applicationAction.note.length>0);
    for(const caution of plan.cautions) assert.ok(html.includes(caution));
  }
});

test('approved five destinations keep every query parameter exactly',()=>{
 assert.deepEqual([...data.incomeStandardActions,...data.directApplyActions].map(a=>a.href),[
  'https://services.arpa.tpctax.dof.gov.taipei/rentStandard/index.php?content=calculator',
  'https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php',
  'https://service.taipei/case-detail/BX015',
  'https://tpctax.gov.taipei/cp.aspx?n=EE558C7C1C627F29',
  'https://tpctax.gov.taipei/News_Content.aspx?n=1CDCF9E878CCDB8F&sms=EB055A67C769EB25&s=AAD268A00665CC03'
 ]);
});
