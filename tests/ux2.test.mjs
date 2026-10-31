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
