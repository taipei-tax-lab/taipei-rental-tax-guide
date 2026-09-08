import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../assets/js/guide-rules.js';

const {next} = globalThis.RentalGuideRules;
const data = JSON.parse(fs.readFileSync(new URL('../site/content.json', import.meta.url), 'utf8'));
const ids = new Set(data.plans.map(p => p.id));

test('every guidance path terminates within three questions and refers to existing plans', () => {
  let paths = 0;
  function walk(answers) {
    const state = next(answers);
    if (state.type === 'question') {
      assert.ok(answers.length < 3);
      assert.ok(state.choices.some(c => c.value === 'unsure'));
      for (const option of state.choices) walk([...answers, option.value]);
    } else {
      paths++;
      assert.ok(state.recommendations.length > 0);
      for (const item of state.recommendations) {
        assert.ok(ids.has(item.id));
        assert.ok(item.reason.length > 15, 'Every suggestion explains its reason');
        assert.doesNotMatch(item.reason, /您已符合|一定適用|保證核准/);
      }
    }
  }
  walk([]);
  assert.equal(paths, 15);
});

test('known subsidy leads to public landlord; uncertainty retains alternatives', () => {
  assert.deepEqual(next(['self','yes']).recommendations.map(x => x.id), ['public']);
  assert.deepEqual(next(['self','unsure']).recommendations.map(x => x.id), ['public','ordinary']);
});

test('private service does not recommend the personal-owner benefit after owner condition is denied', () => {
  const state = next(['service','private','no']);
  assert.ok(!state.recommendations.some(x => x.id === 'personal'));
  assert.match(state.title, /確認出租人身分/);
});

test('previous answer can be changed without retaining an obsolete branch', () => {
  assert.equal(next(['service','private']).type, 'question');
  assert.deepEqual(next(['service','government']).recommendations.map(x => x.id), ['social']);
  assert.equal(next([]).step, 1);
  assert.throws(() => next(['invalid']));
  assert.throws(() => next(['self','yes','extra']));
});
