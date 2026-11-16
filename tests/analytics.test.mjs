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

test('entry redesign events accept only the six mappings and preserve historical service id',()=>{
 const calls=[];const analytics=load((...args)=>calls.push(args));
 analytics.track('direct_apply_open',{url:'private',input:'private'});
 assert.deepEqual(JSON.parse(JSON.stringify(calls.shift())),['event','direct_apply_open',{}]);
 for(const service_id of ['income_standard','income_standard_calculate','income_standard_apply','direct_apply_online','direct_apply_in_person','direct_apply_mail_fax']) {
  assert.equal(analytics.track('service_entry_click',{service_id,destination_host:'tpctax.gov.taipei',url:'private',query:'private'}),true);
  assert.deepEqual(JSON.parse(JSON.stringify(calls.pop())),['event','service_entry_click',{service_id,destination_host:'tpctax.gov.taipei'}]);
 }
 assert.equal(analytics.track('service_entry_click',{service_id:'unknown',destination_host:'tpctax.gov.taipei'}),false);
 assert.equal(analytics.track('service_entry_click',{service_id:'direct_apply_online',destination_host:'https://service.taipei/?private'}),false);
 assert.equal(analytics.track('direct_apply_open'),true);
 assert.equal(load(undefined).track('direct_apply_open'),false);
});
