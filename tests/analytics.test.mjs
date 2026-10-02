import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../assets/js/analytics.js', import.meta.url), 'utf8');
const load = gtag => {
  const window = {location: {href: 'https://taipei-tax-lab.github.io/taipei-rental-tax-guide/'}, gtag};
  vm.runInNewContext(source, {window, URL});
  return window.RentalAnalytics;
};

test('analytics helper fails safely without gtag and rejects unknown events/enums', () => {
  const analytics = load(undefined);
  assert.equal(analytics.track('audience_select', {audience: 'owner'}), false);
  const calls = [];
  const active = load((...args) => calls.push(args));
  assert.equal(active.track('unknown_event', {}), false);
  assert.equal(active.track('audience_select', {audience: 'visitor'}), false);
  assert.equal(calls.length, 0);
});

test('analytics helper emits only schema-approved parameters and never free text', () => {
  const calls = [];
  const analytics = load((...args) => calls.push(args));
  assert.equal(analytics.track('cx_query_submit', {input_method: 'manual', input: 'private query', topic_id: 'rent_subsidy'}), true);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), ['event', 'cx_query_submit', {input_method: 'manual'}]);
  assert.equal(analytics.track('cx_query_submit', {input_method: 'quick_topic', topic_id: 'unknown', input: 'private'}), false);
  assert.equal(calls.length, 1);
});

test('source tracking reduces valid URLs to hostname and error tracking drops messages/objects', () => {
  const calls = [];
  const analytics = load((...args) => calls.push(args));
  const host = analytics.destinationHost('https://Example.GOV.tw/path?private=value');
  assert.equal(host, 'example.gov.tw');
  analytics.track('cx_source_click', {destination_host: host, url: 'https://Example.GOV.tw/path'});
  analytics.track('cx_error', {error_code: 'NETWORK', error_status: 503, message: 'private', error: {stack: 'private'}});
  analytics.track('cx_error', {message: 'private'});
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ['event', 'cx_source_click', {destination_host: 'example.gov.tw'}],
    ['event', 'cx_error', {error_code: 'NETWORK', error_status: 503}],
    ['event', 'cx_error', {}]
  ]);
});

test('gtag exceptions are contained', () => {
  const analytics = load(() => { throw new Error('blocked'); });
  assert.equal(analytics.track('plan_select', {plan_id: 'ordinary'}), false);
});
