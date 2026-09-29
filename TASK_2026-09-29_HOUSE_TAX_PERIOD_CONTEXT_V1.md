# TASK — House-tax period runtime context v1

**Status:** IMPLEMENTED_AWAITING_WEB_CHATGPT_REVIEW<br>
**Date:** 2026-09-29  
**Scope:** frontend only  
**Cross-repo contract change:** YES

## Purpose

Extend the existing Messenger runtime-context pipeline so the browser supplies deterministic house-tax-period context to Dialogflow CX.

This task does **not** modify Dialogflow CX / GCP.

The canonical cross-repo design lives in:

`taipei-tax-lab/dialogflow-cx-qa-framework/docs/house_tax_period_frontend_context_plan_2026-09-29.md`

and:

`taipei-tax-lab/dialogflow-cx-qa-framework/docs/frontend_cx_integration_contract.md`

Read both before implementation.

## Product intent

Keep the current Production Rental Playbook as the knowledge-answering core.

Move only fixed calendar/date-to-house-tax-period conversion into frontend JavaScript so CX receives finished period context and does not need to perform generative calendar arithmetic.

Do not move rental eligibility, tax rates, reductions, caps, filing deadlines, benefit-combination decisions, subsidy status, or other tax/legal business logic into the frontend.

## Existing runtime behavior that must remain intact

Current Messenger behavior is released and protected:

- site-specific `data-initial-playbook`;
- first request includes configured `currentPlaybook`;
- after first `df-request-sent`, direct entry is disarmed;
- new/expired/cleared session re-arms direct entry;
- `timeZone = Asia/Taipei`;
- `runtime_current_date` is refreshed from Taipei runtime;
- `runtime_entry_section` follows page/hash;
- missing initial Playbook config falls back to normal Agent routing;
- Messenger UI/assistant behavior remains unchanged.

Do not redesign any of these behaviors.

## New runtime fields

Add:

```text
runtime_house_tax_context_version
runtime_house_tax_current_period
runtime_house_tax_may_bill_period
runtime_house_tax_explicit_date_status
runtime_house_tax_explicit_date
runtime_house_tax_explicit_period
```

Expected examples for Taipei browser date 2026-09-29:

```text
runtime_house_tax_context_version = "v1"

runtime_house_tax_current_period =
"116年期（課稅期間：民國115年7月1日至116年6月30日）"

runtime_house_tax_may_bill_period =
"115年期（課稅期間：民國114年7月1日至115年6月30日）"
```

Explicit-date status values:

- `none`
- `valid`
- `invalid`
- `ambiguous`

When status is not `valid`, explicit date/period values must be sent as `null` so stale session values are removed.

## Deterministic helpers

Implement small pure functions for:

1. Taipei current date generation / injection-friendly test seam.
2. Gregorian calendar date validation.
3. ROC ↔ Gregorian normalization for supported inputs.
4. Gregorian date → house-tax period.
5. Gregorian calendar year → May-bill house-tax period.
6. formatted period label.
7. current-turn explicit full-date extraction.

Avoid coupling these helpers to DOM/Messenger where possible so they can be unit-tested directly.

## Supported explicit full-date forms

v1 required forms:

- `2026-07-01`
- `2026/7/1`
- `2026年7月1日`
- `民國115年7月1日`
- `115/7/1`
- full-width Arabic digits / separators after normalization

Do not add broad natural-language date interpretation.

Not required in v1:

- 去年七月初
- 明年五月
- 農曆
- incomplete year/month-only inputs
- fuzzy relative-date inference

If more than one recognized full date exists in one user turn, status is `ambiguous`.

## Messenger request lifecycle

Keep `buildRuntimeParameters()` as the generic always-refreshed context source for:

- current date
- entry section
- context version
- current period
- May-bill period

For current-turn explicit-date context, inspect the outgoing user request and inject/clear the explicit-date parameters before the request reaches CX.

Use the existing Messenger request/event path; do not introduce a parallel network request.

The implementation must coexist with the current `df-request-sent` direct-entry disarm logic.

A safe design is:

```text
outgoing request
  → derive current-turn explicit date context
  → ensure requestBody.queryParams.parameters contains refreshed runtime context
  → set explicit date/period OR null
  → preserve currentPlaybook/timeZone
  → allow request to proceed
  → disarm direct entry for following requests
```

Do not rely on prior conversation history when deriving explicit-date fields.

## Required tests

At minimum add deterministic coverage for:

### Current-period boundaries

- 2026-06-30 → 115年期
- 2026-07-01 → 116年期
- 2026-09-29 → 116年期

### May bill

- calendar year 2026 → 115年期
- range = 民國114年7月1日至115年6月30日

### Explicit dates

- ROC 114/7/1 → Gregorian 2025-07-01 → 115年期
- ROC 115/7/1 → Gregorian 2026-07-01 → 116年期
- Gregorian 2025-07-01 → 115年期
- Gregorian 2026-07-01 → 116年期
- Chinese-unit forms
- full-width normalized form

### Calendar validity

- 2024-02-29 valid
- 2026-02-29 invalid
- 2026-02-30 invalid

### Turn lifecycle

- no recognized date → status none + explicit values null
- invalid date → status invalid + explicit values null
- multiple recognized full dates → ambiguous + explicit values null
- Turn 1 ROC114/7/1 → 115
- Turn 2 ROC115/7/1 → 116
- Turn 3 no date → prior explicit values are cleared

### Existing Messenger regression

Preserve and rerun all existing runtime tests for:

- configured first-turn currentPlaybook;
- second-turn disarm;
- session reset/re-arm;
- missing config fallback;
- runtime entry section;
- Taipei date/timezone.

## Validation

Before handoff:

- normal build PASS;
- build `--check` PASS;
- full Node tests PASS;
- performance budget PASS;
- `git diff --check` PASS;
- generated `index.html` reproducible;
- no unrelated UX/content/CSS change.

If a browser smoke is practical, confirm Messenger still opens/closes and no visible layout/error regression. Do not require a CX semantic answer in this frontend-only task.

## Files expected to change

Likely:

- `assets/js/messenger-ui.js`
- `tests/messenger-runtime.test.mjs`
- generated `index.html`
- this task / `PROJECT_STATE.md`

Only change additional files if clearly necessary.

## Hard boundaries

Do not:

- change Production Agent/Playbook IDs;
- change `data-initial-playbook`;
- call or mutate GCP/CX;
- create a backend service;
- add Cloud Run;
- add tax policy data;
- add new UI;
- alter quick-topic wording;
- resume E05 prompt tuning;
- create a second runtime transport path.

## Frontend implementation result (2026-09-29)

- Status: **IMPLEMENTED_AWAITING_WEB_CHATGPT_REVIEW**.
- Branch: codex/house-tax-period-context-v1, based on the post-pull main commit 77f8bee5bcb8ccf3b20d2ca0366fbb27ea3350ac.
- buildRuntimeParameters() now supplies v1 context version, the current Taipei-date house-tax period, the current calendar year's May-bill period, and explicit-date defaults (none plus null values). The date argument is injectable for deterministic tests.
- Pure helpers validate Gregorian calendar dates, normalize ROC/Gregorian supported forms, calculate formatted period labels, and classify current-turn input as none, valid, invalid, or ambiguous.
- The existing df-request-sent hook refreshes runtime date/section/period fields and sets or clears explicit-date fields on requestBody.queryParams.parameters before the request proceeds. It preserves existing queryParams, including the configured first-turn Playbook and Asia/Taipei.
- Changed files: assets/js/messenger-ui.js, tests/messenger-runtime.test.mjs, generated index.html, PROJECT_STATE.md, and this task file.
- Validation: node scripts/build.mjs PASS; node scripts/build.mjs --check PASS; node --test tests/*.test.mjs PASS (33/33); node scripts/performance-budget.mjs PASS; git diff --check PASS.
- Local browser smoke: the preview page and Messenger opened/closed. No query was submitted; the captured Messenger view had no visible error text. The accessibility tree retained the widget's generic fallback string. No CX response behavior was tested.
- No production Agent/Playbook ID, site configuration, quick-topic copy, UI, CX/GCP resource, or backend service changed. No PR, merge, or Pages release was made.
- Next step: Web ChatGPT review, followed by the later CX implementation and semantic gates described in the canonical cross-repo plan.

## Completion state

When implementation and local validation are complete:

`IMPLEMENTED_AWAITING_WEB_CHATGPT_REVIEW`

Update this task and `PROJECT_STATE.md`, commit/push the implementation branch, and STOP.

Do not open/merge a PR unless separately authorized after review.
