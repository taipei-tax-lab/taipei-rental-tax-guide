import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const data = JSON.parse(read('site/content.json'));
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const link = (item, cls = '') => `<a class="${cls}" href="${esc(item.href)}" target="_blank" rel="noopener noreferrer">${esc(item.label)} <span aria-hidden="true">↗</span><span class="sr-only">（另開新視窗）</span></a>`;
const list = items => `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${name === 'person' ? '<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>' : name === 'building' ? '<path d="M4 21V3h10v18M14 9h6v12M7 7h3M7 11h3M7 15h3M17 13h1M17 17h1M9 21v-3h2v3"/>' : name === 'operator' ? '<path d="M3 21V7l9-4 9 4v17M7 10h3M14 10h3M7 14h3M14 14h3M10 21v-4h4v4"/>' : name === 'subsidy' ? '<path d="m3 10 9-7 9 7M5 9v12h14V9"/><path d="m8 15 3 3 5-6"/>' : '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>'}</svg>`;
const planIcon = id => {
  const house = '<path d="m2 9 6-6 6 5M4 10v11h4"/><path d="M7 13h2"/>';
  const symbols = {
    ordinary: '<circle cx="18" cy="13" r="3"/><path d="m15.9 15.1-5 5m2-2 1.5 1.5"/>',
    public: '<path d="M16.5 21s-5.5-3.5-5.5-6.5a2.75 2.75 0 0 1 5.5-1 2.75 2.75 0 0 1 5.5 1c0 3-5.5 6.5-5.5 6.5Z"/>',
    social: '<path d="m16.5 11 5.5 2v3c0 2.5-2.5 4.5-5.5 6-3-1.5-5.5-3.5-5.5-6v-3z"/><path d="m14 16 2 2 3-3"/>',
    personal: '<rect x="12" y="11" width="10" height="11" rx="1"/><path d="M15 14h4m-4 3h4m-4 3h2"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${house}${symbols[id]}</svg>`;
};
const keepUnits = value => esc(value).replace(/(\d[\d,.]*(?:%|‰|元|萬元|年期|戶))/g, '<span class="v2-unit">$1</span>');
const tax = (item, type = 'detail') => `<div class="v2-tax"><dt>${esc(item.label)}</dt><dd><strong>${keepUnits(item.value)}</strong><p>${keepUnits(type === 'card' ? item.summary || item.note : item.note)}</p></dd></div>`;
const plans = data.plans;
const management = {ordinary:'屋主自行招租與管理', public:'自行出租，配合房客補貼認定', social:'政府計畫合作業者協助包租或代管', personal:'自行委託合法租賃住宅服務業'};
const actions = {ordinary:['先確認租金標準','房屋稅洽稅捐處；租賃所得向國稅局申報。租金標準試算不是個人應納稅額試算。'], public:['查詢公益出租人認定','地方稅由稅捐處依認定資料主動辦理；所得稅仍須向國稅局申報。'], social:['洽詢計畫合作業者','先由合作業者確認計畫條件；地方稅由稅捐處主動辦理，所得稅向國稅局申報。'], personal:['確認業者與申請文件','地方稅須向稅捐處申請；所得稅向國稅局申報。']};
const otherTaxes = plan => plan.taxes.filter((_, i) => i !== plan.highlightTax).map(t => `<span>${esc(t.label)}：${plan.id === 'ordinary' ? esc(t.value) : t.label === '綜合所得稅' ? '另有租金免稅與費用扣除規定' : keepUnits(t.value)}${plan.id === 'personal' && t.label === '地價稅' ? '（有減徵上限）' : ''}</span>`).join('');
if (plans.length !== 4 || new Set(plans.map(p => p.id)).size !== 4) throw new Error('Four unique plans required');
for (const plan of plans) {
  if (plan.taxes.length !== 3 || !plan.source?.checked || !plan.links.length) throw new Error(`Incomplete plan: ${plan.id}`);
  for (const url of [...plan.links.map(l => l.href), plan.source.url]) if (new URL(url).protocol !== 'https:') throw new Error('HTTPS sources required');
}

const cards = plans.map((plan, i) => `<a class="v2-plan-card v2-${esc(plan.accent)}" href="#plan-${plan.id}" id="card-${plan.id}">
  <div class="v2-card-top"><span class="v2-plan-icon">${planIcon(plan.id)}</span><span class="v2-card-number">0${i + 1}</span></div>
  <h3>${esc(plan.situation)}</h3><p class="v2-plan-name">${esc(plan.eyebrow)}</p>
  <p class="v2-card-description">${esc(plan.suitable)}</p>
  <dl class="v2-card-tax">${tax(plan.taxes[plan.highlightTax], 'card')}</dl>
  <p class="v2-other-taxes">${otherTaxes(plan)}</p>
  <span class="v2-card-action">查看條件與辦理方式 <span aria-hidden="true">→</span></span>
</a>`).join('\n');

const planDetails = plans.map(plan => `<section data-page="plan-${plan.id}" id="plan-${plan.id}" class="v2-container v2-inner-page v2-${esc(plan.accent)}" aria-labelledby="title-${plan.id}">
  <a href="#plans" class="v2-back" data-return-plan="${plan.id}">← 返回出租方案</a>
  <p class="v2-kicker">${esc(plan.situation)}</p><h1 id="title-${plan.id}" tabindex="-1">${esc(plan.eyebrow)}</h1>
  <p class="v2-detail-lead">${esc(plan.summary)}</p>
  <div class="v2-answer-layout">
    <div class="v2-answer-main">
      <section class="v2-fit"><h2>適合誰？</h2><p>${esc(plan.suitable)}</p></section>
      <section class="v2-benefits"><h2>有哪些租稅優惠？</h2><dl class="v2-tax-grid">${plan.taxes.map(t => tax(t)).join('')}</dl></section>
    </div>
    <aside class="v2-next-step" aria-labelledby="next-${plan.id}"><span class="v2-kicker">下一步</span><h2 id="next-${plan.id}">${esc(actions[plan.id][0])}</h2><p>${esc(plan.firstStep)}</p>${link(plan.links[0], 'v2-button v2-primary')}<p class="v2-caption">${esc(actions[plan.id][1])}</p></aside>
  </div>
  <div class="v2-detail-more">
    <details><summary><span>完整適用條件</span><span class="v2-expand" aria-hidden="true">＋</span></summary><div class="v2-details-body"><p class="v2-full-condition">${esc(plan.condition)}</p></div></details>
    <details><summary><span>辦理順序與應備資料</span><span class="v2-expand" aria-hidden="true">＋</span></summary><div class="v2-two-columns"><section><h3>建議辦理順序</h3><ol>${plan.process.map(step => `<li>${esc(step)}</li>`).join('')}</ol></section><section><h3>可先準備的資料</h3>${list(plan.documents)}<p class="v2-caption">實際檢附項目依官方申請頁面及承辦機關要求。${plan.documentSource ? link(plan.documentSource) : ''}</p></section></div></details>
    <details><summary><span>適用期間與注意事項</span><span class="v2-expand" aria-hidden="true">＋</span></summary><div class="v2-details-body">${list(plan.cautions)}</div></details>
  </div>
  <section class="v2-source"><h2>官方資訊與申辦入口</h2><div class="v2-source-links">${link({label: plan.source.title, href: plan.source.url})}${plan.links.slice(1).map(l => link(l)).join('')}</div><p class="v2-caption">租稅來源核對：${plan.source.checked}；官方方案頁更新：${plan.source.updated}。房屋稅相當稅率依年期標示。</p></section>
  <p class="v2-notice">${esc(data.meta.note)}</p>
  <div class="v2-bottom-actions"><a href="#plans" class="v2-button" data-return-plan="${plan.id}">返回方案總覽</a><a href="#comparison" class="v2-text-link">比較其他出租方式 →</a></div>
</section>`).join('\n');

const groups = [
  {title: '我要申請租金補貼', intro: '中央租金補貼、臺北幸福租與各類身分補貼。', ids: [0,1,2,3,4], icon: 'subsidy', label: '查看補貼入口'},
  {title: '我要找包租代管房屋', intro: '查承租資格、合作業者與友善房源資訊。', ids: [5,6], icon: 'building', label: '查看房源與承租資訊'},
  {title: '我有租屋／設籍問題', intro: '設籍、租約法律諮詢與消費爭議，依問題找窗口。', ids: [7,8,9], icon: 'person', label: '查看對應服務窗口'}
];
const tenantGroups = groups.map((group, i) => `<details class="v2-tenant-card" id="tenant-group-${i}"><summary><span class="v2-plan-icon">${icon(group.icon)}</span><h3>${esc(group.title)}</h3><p>${esc(group.intro)}</p><span class="v2-card-action">${esc(group.label)} <span class="v2-expand" aria-hidden="true">＋</span></span></summary><div class="v2-tenant-links">${group.ids.map(index => {const item = data.tenants[index]; return `<div>${link({label: item.title, href: item.href})}<p>${esc(item.source)}</p></div>`;}).join('')}<p class="v2-caption">資格、期間與文件，請依各服務的最新公告確認。</p></div></details>`).join('\n');

// FAQs explain concepts and route to policy records; no separately maintained rates.
const faqs = [
  ['房客申請租金補貼，房東可以有哪些優惠？', '可先了解公益出租人。各稅目的出租人與房客條件不完全相同，仍須確認認定情形與適用期間。', {href:'#plan-public', label:'查看公益出租人的優惠與認定方式'}],
  ['「包租」與「代管」有什麼不同？', '包租由業者先向屋主承租，再轉租給房客；代管由屋主與房客簽約，業者協助管理。政府社宅計畫與一般業者委託的適用條件也不同。', {href:'#comparison', label:'比較兩種包租代管方案'}],
  ['一般出租，如何確認是否達租金標準？', '可備妥房屋評定現值、公告土地現值總額與全年租金，使用官方工具試算。租金標準與實際應納稅額不同。', {href:data.meta.calculator, label:'開啟官方租金標準試算'}],
  ['要自己申請，還是機關會主動辦理？', '公益出租人與社會住宅包租代管的地方稅由稅捐處主動辦理；個人租賃住宅包租代管須提出申請。綜合所得稅仍須向國稅局申報。', {href:'#comparison', label:'查看各方案的第一步'}]
];
const faqHtml = faqs.map(([q,a,next]) => `<details><summary><span>${esc(q)}</span><span class="v2-expand" aria-hidden="true">＋</span></summary><div class="v2-details-body"><p>${esc(a)}</p>${next.href.startsWith('#') ? `<a class="v2-text-link" href="${next.href}">${esc(next.label)} →</a>` : link(next, 'v2-text-link')}</div></details>`).join('\n');
const resources = data.resources.slice(3).map(item => `<div>${link({label:item.title,href:item.href})}<p>${esc(item.description)}</p></div>`).join('');
const comparison = plans.map(plan => `<article data-compare-plan="${plan.id}" class="v2-compare-card v2-${plan.accent}"><h2>${esc(plan.eyebrow)}</h2><p class="v2-compare-situation">${esc(plan.situation)}</p><dl><div><dt>管理方式</dt><dd>${esc(management[plan.id])}</dd></div><div><dt>主要門檻</dt><dd>${esc(plan.condition)}</dd></div>${plan.taxes.map(t => tax(t)).join('')}<div><dt>第一步</dt><dd>${esc(plan.firstStep)}</dd></div></dl><a href="#plan-${plan.id}" class="v2-button">查看優惠與辦理方式 →</a></article>`).join('\n');
const hash = name => createHash('sha256').update(read(name)).digest('hex').slice(0, 10);
const replacements = {
  BASE_VERSION: hash('assets/css/site.css'), STYLE_VERSION: hash('assets/css/guide-v2.css'),
  RULES_VERSION: hash('assets/js/guide-rules.js'), UI_VERSION: hash('assets/js/guide-ui.js'),
  HOUSE_ICON: icon('self'), PERSON_ICON: icon('person'), OFFICIAL: esc(data.meta.official),
  PLAN_CARDS: cards, PLAN_DETAILS: planDetails, TENANT_GROUPS: tenantGroups, FAQ: faqHtml,
  COMPARE_CONTROLS: `<fieldset class="v2-compare-controls" hidden><legend>選擇兩個方案並列比較</legend><div>${[0,1].map((n) => `<label>方案${n + 1}<select data-compare-select="${n}">${plans.map((p,i) => `<option value="${p.id}"${i === n ? ' selected' : ''}>${esc(p.eyebrow)}</option>`).join('')}</select></label>`).join('')}</div><p class="v2-caption" role="status" id="compare-status"></p></fieldset>`,
  RESOURCES: resources, COMPARISON: comparison, NOTE: esc(data.meta.note), CHECKED: data.meta.checked,
  MESSENGER_STYLE_VERSION: hash('assets/css/messenger.css'),
  MESSENGER: read('site/messenger.html').replace('{{MESSENGER_UI_VERSION}}', hash('assets/js/messenger-ui.js'))
};
const html = read('site/template.html').replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Missing template value ${key}`);
  return replacements[key];
});
if (process.argv.includes('--check')) {
  if (read('index.html') !== html) throw new Error('index.html is stale; run npm run build');
  console.log('Generated page matches source.');
} else {
  fs.writeFileSync(path.join(root, 'index.html'), html);
  console.log('Built index.html: home, four plan views, comparison; existing Messenger preserved.');
}
