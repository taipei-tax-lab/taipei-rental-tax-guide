(function () {
  'use strict';
  const site = document.querySelector('.v2-site');
  if (!site || !window.RentalGuideRules) return;
  const pages = Array.from(site.querySelectorAll('[data-page]'));
  const panels = Array.from(site.querySelectorAll('[data-audience-panel]'));
  const stage = document.getElementById('guide-stage');
  const guide = document.getElementById('guide');
  const baseTitle = document.title;
  let answers = [];
  let audience = 'owner';
  let currentPage = 'home';
  let homePosition = 0;
  let returningPlan = null;
  const desktop = window.matchMedia('(min-width: 1101px)');
  const planPages = pages.filter(page => page.dataset.page.startsWith('plan-'));
  const slots = new Map(planPages.map(page => {
    const marker = document.createComment(page.id);
    page.before(marker);
    return [page, marker];
  }));

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function focus(node) {
    if (!node) return;
    node.focus({preventScroll: true});
  }
  function renderGuide(moveFocus) {
    const state = window.RentalGuideRules.next(answers);
    stage.replaceChildren();
    if (state.type === 'question') {
      const fieldset = el('fieldset', 'v2-question');
      const legend = el('legend');
      legend.tabIndex = -1;
      legend.append(el('span', 'v2-question-step', `第 ${state.step} 題・最多 3 題`), document.createTextNode(state.title));
      const options = el('div', 'v2-options');
      for (const item of state.choices) {
        const button = el('button', 'v2-option', item.label);
        button.type = 'button';
        button.addEventListener('click', () => { answers.push(item.value); renderGuide(true); });
        options.append(button);
      }
      fieldset.append(legend, options);
      stage.append(fieldset);
      if (moveFocus) focus(legend);
    } else {
      const result = el('div', 'v2-guide-result');
      const heading = el('h3', '', state.title);
      heading.tabIndex = -1;
      const suggestions = el('div', 'v2-guide-result-list');
      for (const recommendation of state.recommendations) {
        const name = document.querySelector(`#card-${recommendation.id} .v2-plan-name`).textContent;
        const anchor = el('a');
        anchor.href = `#plan-${recommendation.id}`;
        anchor.append(el('strong', '', name), el('p', '', recommendation.reason), el('span', '', '查看優惠與下一步 →'));
        suggestions.append(anchor);
      }
      const compare = el('a', 'v2-text-link', '查看四方案完整比較 →');
      compare.href = '#comparison';
      result.append(heading, suggestions, el('p', 'v2-caption', '以上是閱讀建議，不代表已符合優惠資格；請繼續核對方案條件。'), compare);
      stage.append(result);
      if (moveFocus) focus(heading);
    }
    if (answers.length) {
      const nav = el('div', 'v2-guide-nav');
      const previous = el('button', 'v2-text-link', '← 上一題');
      previous.type = 'button';
      previous.addEventListener('click', () => { answers.pop(); renderGuide(true); });
      const reset = el('button', 'v2-text-link', '重新選擇');
      reset.type = 'button';
      reset.addEventListener('click', () => { answers = []; renderGuide(true); });
      nav.append(previous, reset);
      stage.append(nav);
    }
  }
  function setAudience(value) {
    audience = value;
    for (const panel of panels) panel.hidden = panel.dataset.audiencePanel !== audience;
    for (const button of site.querySelectorAll('[data-audience]')) {
      if (button.dataset.audience === audience) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
  }
  function route(initial = false) {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    // Preserve previously published anchors without reviving duplicate sections.
    const aliases = {'tenant-services':'tenants', calculator:'plan-ordinary', process:'comparison'};
    hash = aliases[hash] || hash;
    const destination = pages.find(page => page.dataset.page === hash);
    const pageName = destination ? destination.dataset.page : 'home';
    const inline = desktop.matches && pageName.startsWith('plan-');
    for (const plan of planPages) {
      const isInline = inline && plan === destination;
      if (isInline) document.getElementById('inline-plan-slot').append(plan);
      else slots.get(plan).after(plan);
      plan.classList.toggle('v2-inline-plan', isInline);
      const back = plan.querySelector('.v2-back');
      back.textContent = isInline ? '收合內容 ↑' : '← 返回出租方案';
    }
    site.classList.toggle('v2-has-inline', inline);
    for (const card of site.querySelectorAll('.v2-plan-card')) {
      const selected = inline && card.hash === '#' + pageName;
      card.classList.toggle('v2-selected', selected);
      if (desktop.matches) {
        card.setAttribute('aria-expanded', String(selected));
        card.setAttribute('aria-controls', card.hash.slice(1));
      } else { card.removeAttribute('aria-expanded'); card.removeAttribute('aria-controls'); }
    }
    if (currentPage === 'home' && pageName !== 'home') homePosition = window.scrollY;
    if (hash === 'tenants' || hash.startsWith('tenant-group-')) setAudience('tenant');
    else if (inline || ['owners', 'plans', 'guide'].includes(hash)) setAudience('owner');
    for (const page of pages) page.hidden = page.dataset.page !== pageName && !(inline && page.dataset.page === 'home');
    const previousPage = currentPage;
    currentPage = pageName;
    const visiblePage = pages.find(page => page.dataset.page === pageName);
    const title = visiblePage.querySelector('h1');
    document.title = pageName === 'home' ? baseTitle : `${title.textContent}｜出租房屋租稅優惠專區`;
    const target = document.getElementById(hash);
    if (target?.tagName === 'DETAILS') target.open = true;
    if (pageName === 'home' && target?.closest('[data-audience-panel]')) {
      setAudience(target.closest('[data-audience-panel]').dataset.audiencePanel);
    }
    requestAnimationFrame(() => {
      if (inline) {
        const grid = site.querySelector('.v2-plan-grid');
        const gridBottom = grid.getBoundingClientRect().bottom + window.scrollY;
        window.scrollTo({top: Math.max(0, gridBottom - Math.min(240, innerHeight * .3)), behavior: 'instant'});
        if (!initial) focus(title);
      } else if (pageName !== 'home') {
        window.scrollTo({top: 0, behavior: 'instant'});
        if (!initial) focus(title);
      } else if (previousPage !== 'home' && ['plans','owners'].includes(hash)) {
        window.scrollTo({top: homePosition, behavior: 'instant'});
        const card = returningPlan && document.getElementById(`card-${returningPlan}`);
        if (!initial) focus(card || document.getElementById('owner-title'));
        returningPlan = null;
      } else if (target && hash !== 'top') {
        target.scrollIntoView({block: 'start', behavior: 'instant'});
        if (!initial) focus(target.querySelector('h2, summary') || target);
      } else {
        window.scrollTo({top: 0, behavior: 'instant'});
        if (!initial) focus(document.getElementById('home-title'));
      }
    });
  }

  site.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (link.dataset.returnPlan) returningPlan = link.dataset.returnPlan;
    if (link.hash === location.hash) { event.preventDefault(); route(); }
  });
  window.addEventListener('hashchange', () => route());
  desktop.addEventListener('change', () => route());

  // The existing component owns the conversation. This shortcut only opens it.
  let messengerReady = false;
  let pendingOpen = false;
  let loadTimer;
  const helperButton = document.getElementById('open-helper');
  const helperStatus = document.getElementById('helper-status');
  function focusChatInput() {
    function findInput(root) {
      const input = root.querySelector('textarea, input:not([type="hidden"])');
      if (input) return input;
      for (const node of root.querySelectorAll('*')) {
        if (node.shadowRoot) { const found = findInput(node.shadowRoot); if (found) return found; }
      }
    }
    const messenger = document.querySelector('df-messenger');
    if (messenger) focus(findInput(messenger));
  }
  function openHelper() {
    const bubble = document.querySelector('df-messenger-chat-bubble');
    if (!messengerReady || typeof bubble?.openChat !== 'function') return false;
    bubble.openChat();
    requestAnimationFrame(focusChatInput);
    return true;
  }
  document.addEventListener('df-messenger-loaded', () => {
    messengerReady = true;
    if (pendingOpen) { pendingOpen = false; clearTimeout(loadTimer); helperStatus.hidden = true; openHelper(); }
  });
  helperButton.addEventListener('click', () => {
    if (openHelper()) { helperStatus.hidden = true; return; }
    pendingOpen = true;
    helperStatus.hidden = false;
    helperStatus.textContent = '小幫手載入中，完成後會開啟。您也可以先查看下方方案。';
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      pendingOpen = false;
      helperStatus.textContent = '小幫手暫時無法載入，請稍後重試；下方方案與官方窗口仍可使用。';
    }, 10000);
  });
  let printDetails = [];
  function preparePrint() {
    const printPage = pages.find(page => page.dataset.page === currentPage);
    printDetails = Array.from(printPage.querySelectorAll('details')).map(node => ({node, open: node.open}));
    printDetails.forEach(({node}) => { node.open = true; });
  }
  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', () => { printDetails.forEach(({node, open}) => { node.open = open; }); printDetails = []; });
  site.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
  renderGuide(false);
  setAudience(audience);
  route(true);
  site.classList.add('v2-ready');
})();
