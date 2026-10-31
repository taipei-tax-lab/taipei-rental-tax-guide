import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = name => fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=read('index.html');
const data=JSON.parse(read('site/content.json'));
test('one shared hero precedes all content pages and six entry DOM order matches requested keyboard order',()=>{
  const shell=html.slice(html.indexOf('data-entry-shell'),html.indexOf('<div data-page="home">'));
  assert.equal((html.match(/data-entry-shell/g)||[]).length,1);
  const controls=[...shell.matchAll(/<(?:a|button)\b[^>]*class="v2-audience-button[^>]*>[\s\S]*?<\/(?:a|button)>/g)].map(m=>m[0]);
  assert.equal(controls.length,6);
  for(const [i,text] of ['我是屋主','我是房客','直接申請','所得達租金標準','直接問小幫手','操作說明'].entries()) assert.ok(controls[i].includes(text));
  assert.equal((html.match(/id="open-helper"/g)||[]).length,1);
  assert.equal((html.match(/id="top"/g)||[]).length,1);
  for(const page of ['direct-apply','operation-guide']) assert.match(html,new RegExp(`<h2 id="${page}-title" tabindex="-1">`));
});
test('application cards use four existing palette accents and exactly one truthful primary action per plan',()=>{
  const section=html.slice(html.indexOf('data-page="direct-apply"'),html.indexOf('data-page="operation-guide"'));
  const cards=[...section.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m=>m[0]);
  assert.equal(cards.length,4);
  for(const [i,plan] of data.plans.entries()){
    assert.equal(plan.applicationAction.label,'前往申辦與書表下載');
    assert.equal(plan.applicationAction.href,'https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72');
    const card=cards[i];assert.ok(card.includes('v2-'+plan.accent));
    assert.equal((card.match(/class="v2-button v2-primary"/g)||[]).length,1);
    assert.ok(card.includes(plan.applicationAction.label));
    assert.ok(card.includes(plan.applicationAction.note));
    assert.doesNotMatch(card,/開啟租金標準試算|查看認定方式與常見問題|查看中央租金補貼/);
    for(const step of plan.process)assert.ok(card.includes(step));
  }
  for(const id of ['public','personal']){
    const action=data.plans.find(p=>p.id===id).applicationAction;
    assert.equal(action.href,'https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72');
    assert.doesNotMatch(action.label,/線上申請|線上認定/);
  }
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
    assert.ok(html.includes(plan.applicationAction.note));
    for(const caution of plan.cautions) assert.ok(html.includes(caution));
  }
});
