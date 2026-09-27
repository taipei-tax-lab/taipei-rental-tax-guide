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
const createRuntime = vm.runInNewContext(`(function(window, document, Date, Intl, runtimeMessenger) {\n${runtimeBlock}\nfunction getMessengerElements() { return {messenger: runtimeMessenger}; }\nfunction beginThinking() {}\n${eventBindingBlock}\nreturn { armDirectEntry, disarmDirectEntry, updateRuntimeSectionContext, buildRuntimeParameters, bindAssistantEvents };\n})`);

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
  assert.deepEqual(first.parameters, {runtime_current_date: '2026-09-27', runtime_entry_section: 'owners'});
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
  assert.deepEqual(next.parameters, {runtime_current_date: '2026-09-27', runtime_entry_section: 'owners'});
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
    assert.deepEqual(first.parameters, {runtime_current_date: '2026-09-27', runtime_entry_section: 'owners'});
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