import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {normalizeEol} from '../scripts/text.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => normalizeEol(fs.readFileSync(path.join(root, name), 'utf8'));
const rentalPlaybook = 'projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/7861bc8f-d2fb-43d3-8ca1-651415eb4205';
const messengerSource = read('site/messenger.html');
const messengerUi = read('assets/js/messenger-ui.js');
const generatedHtml = read('index.html');

const runtimeStart = messengerUi.indexOf('// --- Generic Runtime Context & Direct Playbook Entry Lifecycle (QA-10C) ---');
const runtimeEnd = messengerUi.indexOf('  function getViewportSize()', runtimeStart);
assert.ok(runtimeStart >= 0 && runtimeEnd > runtimeStart, 'QA-10C runtime block must remain identifiable');
const runtimeBlock = messengerUi.slice(runtimeStart, runtimeEnd);
const bindStart = messengerUi.indexOf('  function bindAssistantEvents(elements) {');
const bindEnd = messengerUi.indexOf('  function bindTopics(root)', bindStart);
assert.ok(bindStart >= 0 && bindEnd > bindStart, 'QA-10C Messenger lifecycle event bindings must remain identifiable');
const eventBindingBlock = messengerUi.slice(bindStart, bindEnd);
const createRuntime = vm.runInNewContext(`(function(window, document, Date, Intl, runtimeMessenger) {\n${runtimeBlock}\nfunction getMessengerElements() { return {messenger: runtimeMessenger}; }\nfunction beginThinking() {}\n${eventBindingBlock}\nreturn { armDirectEntry, disarmDirectEntry, updateRuntimeSectionContext, buildRuntimeParameters, bindAssistantEvents, isValidGregorianDate, getHouseTaxPeriodForDate, getMayBillHouseTaxPeriod, parseExplicitHouseTaxDate, updateOutgoingRequestContext };\n})`);

function createHarness(initialPlaybook) {
  const calls = [];
  const dateFormatCalls = [];
  const window = {location: {hash: '#owners'}};
  const main = {dataset: {page: 'home'}};
  const documentListeners = new Map();
  const document = {
    querySelector(selector) {
      return selector === 'main[data-page]' ? main : null;
    },
    addEventListener(name, listener) {
      documentListeners.set(name, listener);
    }
  };
  window.addEventListener = () => {};
  const intl = {
    DateTimeFormat: function (locale, options) {
      dateFormatCalls.push({locale, options});
      this.format = () => '2026-09-27';
    }
  };
  const messenger = {
    getAttribute(name) {
      return name === 'data-initial-playbook' ? initialPlaybook ?? null : null;
    },
    setQueryParameters(parameters) {
      calls.push(JSON.parse(JSON.stringify(parameters)));
    },
    nativeSessionCalls: [],
    startNewSession() {
      this.nativeSessionCalls.push('startNewSession');
      return 'started';
    },
    clearStorage() {
      this.nativeSessionCalls.push('clearStorage');
      return 'cleared';
    }
  };
  const runtime = createRuntime(window, document, function TestDate() {}, intl, messenger);
  return {calls, dateFormatCalls, document, documentListeners, main, messenger, runtime, window};
}

function expectedRuntimeParameters(currentDate = '2026-09-27', section = 'owners') {
  return {
    runtime_current_date: currentDate,
    runtime_entry_section: section,
    runtime_house_tax_context_version: 'v1',
    runtime_house_tax_current_period: '116年期（課稅期間：民國115年7月1日至116年6月30日）',
    runtime_house_tax_may_bill_period: '115年期（課稅期間：民國114年7月1日至115年6月30日）',
    runtime_house_tax_explicit_date_status: 'none',
    runtime_house_tax_explicit_date: null,
    runtime_house_tax_explicit_period: null
  };
}

test('Rental site explicitly configures its initial Playbook and generated output preserves it', () => {
  const tag = messengerSource.match(/<df-messenger\b[^>]*>/)?.[0];
  assert.ok(tag, 'site Messenger element must exist');
  assert.ok(tag.includes(`data-initial-playbook="${rentalPlaybook}"`));
  assert.ok(generatedHtml.includes(`data-initial-playbook="${rentalPlaybook}"`));
});

test('shared Messenger UI has no Rental Playbook resource fallback', () => {
  assert.doesNotMatch(messengerUi, /RENTAL_TAX_GUIDE_PLAYBOOK|7861bc8f-d2fb-43d3-8ca1-651415eb4205/);
});

test('configured initial Playbook is sent on the first request with unchanged runtime context', () => {
  const harness = createHarness(rentalPlaybook);
  harness.runtime.armDirectEntry(harness.messenger);
  const first = harness.calls.at(-1);

  assert.equal(first.currentPlaybook, rentalPlaybook);
  assert.equal(first.timeZone, 'Asia/Taipei');
  assert.deepEqual(first.parameters, expectedRuntimeParameters('2026-09-27', 'owners'));
  assert.deepEqual(JSON.parse(JSON.stringify(harness.dateFormatCalls[0])), {
    locale: 'en-CA',
    options: {timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'}
  });
});

test('first request disarms currentPlaybook while retaining runtime context', () => {
  const harness = createHarness(rentalPlaybook);
  harness.runtime.armDirectEntry(harness.messenger);
  harness.runtime.disarmDirectEntry(harness.messenger);
  const next = harness.calls.at(-1);

  assert.equal(Object.hasOwn(next, 'currentPlaybook'), false);
  assert.equal(next.timeZone, 'Asia/Taipei');
  assert.deepEqual(next.parameters, expectedRuntimeParameters('2026-09-27', 'owners'));
});

test('new session, session expiration/end, and storage reset re-arm the configured initial Playbook', () => {
  const harness = createHarness(rentalPlaybook);
  harness.runtime.armDirectEntry(harness.messenger);
  harness.runtime.disarmDirectEntry(harness.messenger);

  harness.runtime.bindAssistantEvents({assistantPanel: {dataset: {}}, messenger: harness.messenger});
  harness.documentListeners.get('df-session-expired')();
  assert.equal(harness.calls.at(-1).currentPlaybook, rentalPlaybook);
  harness.runtime.disarmDirectEntry(harness.messenger);
  harness.documentListeners.get('df-session-ended')();
  assert.equal(harness.calls.at(-1).currentPlaybook, rentalPlaybook);
  harness.runtime.disarmDirectEntry(harness.messenger);

  assert.equal(harness.messenger.startNewSession(), 'started');
  assert.equal(harness.calls.at(-1).currentPlaybook, rentalPlaybook);
  assert.equal(harness.messenger.clearStorage(), 'cleared');
  assert.equal(harness.calls.at(-1).currentPlaybook, rentalPlaybook);
  assert.deepEqual(harness.messenger.nativeSessionCalls, ['startNewSession', 'clearStorage']);
});

test('missing or blank site config sends runtime context without guessing a Playbook', () => {
  for (const config of [undefined, '', '   ']) {
    const harness = createHarness(config);
    assert.doesNotThrow(() => harness.runtime.armDirectEntry(harness.messenger));
    const first = harness.calls.at(-1);
    assert.equal(Object.hasOwn(first, 'currentPlaybook'), false);
    assert.equal(first.timeZone, 'Asia/Taipei');
    assert.deepEqual(first.parameters, expectedRuntimeParameters('2026-09-27', 'owners'));
  }
});

test('hash changes update page section without changing initial-Playbook policy', () => {
  const harness = createHarness(rentalPlaybook);
  harness.runtime.armDirectEntry(harness.messenger);
  harness.window.location.hash = '#tenants';
  harness.runtime.updateRuntimeSectionContext(harness.messenger);
  assert.equal(harness.calls.at(-1).currentPlaybook, rentalPlaybook);
  assert.equal(harness.calls.at(-1).parameters.runtime_entry_section, 'tenants');

  harness.runtime.disarmDirectEntry(harness.messenger);
  harness.window.location.hash = '#plan-public';
  harness.runtime.updateRuntimeSectionContext(harness.messenger);
  assert.equal(Object.hasOwn(harness.calls.at(-1), 'currentPlaybook'), false);
  assert.equal(harness.calls.at(-1).parameters.runtime_entry_section, 'plan-public');

  harness.window.location.hash = '';
  harness.main.dataset.page = 'comparison';
  harness.runtime.updateRuntimeSectionContext(harness.messenger);
  assert.equal(harness.calls.at(-1).parameters.runtime_entry_section, 'comparison');
});

test('house-tax current period follows the July boundary and Taipei runtime date injection', () => {
  const harness = createHarness(rentalPlaybook);
  const june30 = harness.runtime.buildRuntimeParameters('2026-06-30');
  const july1 = harness.runtime.buildRuntimeParameters('2026-07-01');
  const september29 = harness.runtime.buildRuntimeParameters('2026-09-29');

  assert.equal(june30.runtime_house_tax_current_period, '115年期（課稅期間：民國114年7月1日至115年6月30日）');
  assert.equal(july1.runtime_house_tax_current_period, '116年期（課稅期間：民國115年7月1日至116年6月30日）');
  assert.equal(september29.runtime_house_tax_current_period, '116年期（課稅期間：民國115年7月1日至116年6月30日）');
  assert.equal(september29.runtime_house_tax_may_bill_period, '115年期（課稅期間：民國114年7月1日至115年6月30日）');
  assert.equal(harness.runtime.getMayBillHouseTaxPeriod(2026), '115年期（課稅期間：民國114年7月1日至115年6月30日）');
});

test('explicit date parser accepts only the supported full-date forms and normalizes ROC dates', () => {
  const harness = createHarness(rentalPlaybook);
  const cases = [
    ['2026-07-01', '2026-07-01', '116年期（課稅期間：民國115年7月1日至116年6月30日）'],
    ['2026/7/1', '2026-07-01', '116年期（課稅期間：民國115年7月1日至116年6月30日）'],
    ['2026年7月1日', '2026-07-01', '116年期（課稅期間：民國115年7月1日至116年6月30日）'],
    ['民國115年7月1日', '2026-07-01', '116年期（課稅期間：民國115年7月1日至116年6月30日）'],
    ['115/7/1', '2026-07-01', '116年期（課稅期間：民國115年7月1日至116年6月30日）'],
    ['２０２６／７／１', '2026-07-01', '116年期（課稅期間：民國115年7月1日至116年6月30日）'],
    ['114/7/1', '2025-07-01', '115年期（課稅期間：民國114年7月1日至115年6月30日）'],
    ['2025-07-01', '2025-07-01', '115年期（課稅期間：民國114年7月1日至115年6月30日）']
  ];

  for (const [input, expectedDate, expectedPeriod] of cases) {
    const parsed = harness.runtime.parseExplicitHouseTaxDate(input);
    assert.equal(parsed.status, 'valid', input);
    assert.equal(parsed.date, expectedDate, input);
    assert.equal(parsed.period, expectedPeriod, input);
  }
  assert.equal(harness.runtime.parseExplicitHouseTaxDate('去年七月初').status, 'none');
});

test('explicit date parser rejects a date preceded by an embedded digit', () => {
  const harness = createHarness(rentalPlaybook);
  for (const input of ['12026-07-01', '12026/7/1', '12026年7月1日', '11115/7/1']) {
    const parsed = harness.runtime.parseExplicitHouseTaxDate(input);
    assert.equal(parsed.status, 'none', input);
    assert.equal(parsed.date, null, input);
    assert.equal(parsed.period, null, input);
  }
});

test('explicit date parser rejects a date followed by an embedded digit', () => {
  const harness = createHarness(rentalPlaybook);
  for (const input of ['2026-07-011', '2026/7/100', '2026年7月100日', '115/7/100']) {
    const parsed = harness.runtime.parseExplicitHouseTaxDate(input);
    assert.equal(parsed.status, 'none', input);
    assert.equal(parsed.date, null, input);
    assert.equal(parsed.period, null, input);
  }
});

test('calendar validity rejects impossible dates and detects multiple dates', () => {
  const harness = createHarness(rentalPlaybook);

  assert.equal(harness.runtime.isValidGregorianDate(2024, 2, 29), true);
  assert.equal(harness.runtime.isValidGregorianDate(2026, 2, 29), false);
  assert.equal(harness.runtime.parseExplicitHouseTaxDate('2026-02-29').status, 'invalid');
  assert.equal(harness.runtime.parseExplicitHouseTaxDate('2026-02-30').status, 'invalid');
  const ambiguous = harness.runtime.parseExplicitHouseTaxDate('比較 2025/7/1 和 2026/7/1');
  assert.equal(ambiguous.status, 'ambiguous');
  assert.equal(ambiguous.date, null);
  assert.equal(ambiguous.period, null);
});

test('invalid or ambiguous outgoing dates clear normalized date and period values', () => {
  const harness = createHarness(rentalPlaybook);
  for (const [text, expectedStatus] of [
    ['2026-02-30', 'invalid'],
    ['2025/7/1 or 2026/7/1', 'ambiguous']
  ]) {
    const requestBody = {
      queryInput: {text: {text}},
      queryParams: {
        parameters: {
          runtime_house_tax_explicit_date: 'stale-date',
          runtime_house_tax_explicit_period: 'stale-period'
        }
      }
    };
    const updated = harness.runtime.updateOutgoingRequestContext({detail: {data: {requestBody}}});
    assert.equal(updated, true);
    assert.equal(requestBody.queryParams.parameters.runtime_house_tax_explicit_date_status, expectedStatus);
    assert.equal(requestBody.queryParams.parameters.runtime_house_tax_explicit_date, null);
    assert.equal(requestBody.queryParams.parameters.runtime_house_tax_explicit_period, null);
  }
});
test('each outgoing Messenger request refreshes context and clears stale explicit dates', () => {
  const harness = createHarness(rentalPlaybook);
  harness.runtime.armDirectEntry(harness.messenger);
  harness.runtime.bindAssistantEvents({assistantPanel: {dataset: {}}, messenger: harness.messenger});
  const onRequestSent = harness.documentListeners.get('df-request-sent');

  function send(text, previousParameters = {}) {
    const requestBody = {
      queryInput: {text: {text}},
      queryParams: {
        currentPlaybook: rentalPlaybook,
        timeZone: 'Asia/Taipei',
        parameters: {
          ...previousParameters,
          runtime_house_tax_explicit_date: 'stale-date',
          runtime_house_tax_explicit_period: 'stale-period'
        }
      }
    };
    onRequestSent({detail: {data: {requestBody}}});
    return requestBody;
  }

  const first = send('民國114年7月1日是哪一期？');
  assert.equal(first.queryParams.currentPlaybook, rentalPlaybook);
  assert.equal(first.queryParams.timeZone, 'Asia/Taipei');
  assert.equal(first.queryParams.parameters.runtime_house_tax_explicit_date_status, 'valid');
  assert.equal(first.queryParams.parameters.runtime_house_tax_explicit_date, '2025-07-01');
  assert.equal(first.queryParams.parameters.runtime_house_tax_explicit_period, '115年期（課稅期間：民國114年7月1日至115年6月30日）');

  const second = send('改成民國115年7月1日', first.queryParams.parameters);
  assert.equal(second.queryParams.parameters.runtime_house_tax_explicit_date_status, 'valid');
  assert.equal(second.queryParams.parameters.runtime_house_tax_explicit_date, '2026-07-01');
  assert.equal(second.queryParams.parameters.runtime_house_tax_explicit_period, '116年期（課稅期間：民國115年7月1日至116年6月30日）');

  const third = send('那公益出租人的所得稅呢？', second.queryParams.parameters);
  assert.equal(third.queryParams.parameters.runtime_house_tax_explicit_date_status, 'none');
  assert.equal(third.queryParams.parameters.runtime_house_tax_explicit_date, null);
  assert.equal(third.queryParams.parameters.runtime_house_tax_explicit_period, null);
  assert.equal(third.queryParams.parameters.runtime_current_date, '2026-09-27');
  assert.equal(third.queryParams.parameters.runtime_house_tax_current_period, '116年期（課稅期間：民國115年7月1日至116年6月30日）');
});
test('Messenger title, placeholder, assistant copy, and rental hot topics remain present', () => {
  assert.match(messengerSource, /chat-title="租稅小幫手"/);
  assert.match(messengerSource, /chat-subtitle="臺北市稅捐稽徵處"/);
  assert.match(messengerSource, /placeholder-text="請輸入您的問題"/);
  for (const [query, label] of [
    ['我想查租金補貼的申請資格', '租金補貼'],
    ['我想了解出租房屋租稅優惠', '出租房屋租稅優惠'],
    ['我想查出租房屋的申請流程', '申請流程'],
    ['我是房客，想了解租屋服務與權益', '房客權益']
  ]) {
    assert.ok(messengerSource.includes(`data-messenger-query="${query}">${label}</button>`));
  }
  assert.match(messengerUi, /title: "租稅小幫手"/);
  assert.match(messengerUi, /description: "有出租房屋租稅、出租方案或申請流程問題，都可以直接問我。"/);
});