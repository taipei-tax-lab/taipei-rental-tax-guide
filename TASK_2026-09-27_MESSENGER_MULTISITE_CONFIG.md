# TASK_2026-09-27_MESSENGER_MULTISITE_CONFIG

Status: **REVIEW_APPROVED_READY_FOR_PR**

## 目標

把目前已在 production 驗證的 QA-10C Messenger one-shot direct-entry，從「共用 JS 內寫死 Rental Tax Guide Playbook」整理成「由各網站明確宣告自己的 initial Playbook」。

這一階段只做 frontend refactor / contract hardening，不修改 Dialogflow CX。

核心原則：

> 使用者從哪個專區進來，就以該專區指定的 Playbook 作為新 session 的第一優先入口；這只是起始優先順序，不是業務邊界。第一輪之後仍由 CX 的正常 session / Playbook routing 處理使用者實際意圖。

## Baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production branch: `main`
- Baseline main SHA: `1ae269999bc3048320ac471f7e21ffccc925ae72`
- Work branch: `refactor/messenger-multisite-config`
- Production Agent:
  - project: `serviceagent-1150909`
  - location: `asia-northeast1`
  - agent: `799426c1-ba69-49dc-85e4-5065985706e2`
- Current Rental Tax Guide Playbook resource:
  - `projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/7861bc8f-d2fb-43d3-8ca1-651415eb4205`

Historical Impeccable experiment branch is out of scope and must remain untouched.

## Architecture decision — how initialPlaybook is selected

Do **not** infer initial Playbook from:
- user wording
- URL heuristics
- current hash / page section
- model guess
- a global default hard-coded inside shared Messenger JS

Instead, each website explicitly declares its own initial Playbook in its site-specific Messenger markup/config.

For the current rental site, the source of truth should live in `site/messenger.html`, for example as a data attribute on the existing `df-messenger` element:

```html
<df-messenger
  ...
  data-initial-playbook="projects/.../playbooks/7861bc8f-d2fb-43d3-8ca1-651415eb4205">
```

The exact attribute naming may be adjusted if Codex finds a more robust equivalent, but the architectural rule must remain:

```text
site-specific config
        ↓
shared messenger-ui.js
        ↓
first-turn currentPlaybook
```

Future examples:

```text
出租專區 → Rental Tax Guide
1999 專區 → 1999 Playbook
納保專區 → Taxpayer Rights Playbook
```

This task implements only the rental site's config-driven version. Do not invent placeholder 1999 / 納保 resource IDs.

## Important semantics

### initialPlaybook

`initialPlaybook` means:

> New-session first-turn priority.

It does **not** mean:
- lock the session to that Playbook forever
- prevent another Playbook from handling a later explicit user intent
- replace CX routing logic

Keep the existing QA-10C one-shot lifecycle:

```text
new session
→ set currentPlaybook from site config
→ first user request is sent
→ remove currentPlaybook
→ subsequent turns keep session/runtime context without forcing the initial Playbook
```

Session reset / expiration must re-arm the same site's initial Playbook.

### runtime_entry_section

Keep the existing production meaning unchanged.

It is the current **page section**, derived from:
- `location.hash`
- fallback `main[data-page]`

Examples:
- `home`
- `owners`
- `tenants`
- `plan-public`
- `comparison`

Do **not** repurpose `runtime_entry_section` to mean rental / 1999 / 納保.

Do **not** add `runtime_site` in this task.

### runtime_current_date / house-tax year

Keep current production transport unchanged:

- frontend supplies `runtime_current_date`
- request timezone remains `Asia/Taipei`
- frontend does **not** calculate or send `current_house_tax_year`
- house-tax-year interpretation remains CX / knowledge behavior

Do not add duplicate tax-year business logic to JS.

## Cross-repo coordination rule

The related CX/QA repo is:

`taipei-tax-lab/dialogflow-cx-qa-framework`

At the start of work, read its latest:
- `STATE.md`
- `TASKS.md`

Current expected active work is QA-12A, which is Instructions-only and explicitly forbids frontend/runtime transport changes.

This frontend task may proceed in parallel if the QA repo still preserves:
- Rental Tax Guide Playbook resource ID above
- input parameters `runtime_current_date` and `runtime_entry_section`
- QA-10C one-shot direct-entry contract

If the QA repo shows that any of those interface facts changed, **STOP and report the drift**. Do not guess or independently repair CX.

Instructions-only tuning that preserves the interface does not block this task.

Do not modify the QA repo from this task.

## Simple multi-agent coordination model

Do not build a new synchronization system.

Use the existing project workflow:

1. Each local agent works only in its assigned repo/scope.
2. Each repo records current truth in STATE/TASK.
3. At a milestone, the other session can read the other repo's STATE/TASK.
4. If needed, open a new Web ChatGPT integration session that reads both repos and reconciles them.
5. If a contradiction is found, authorize **one agent only** to perform the corrective mutation.

The user should not have to manually shuttle detailed implementation reports between agents.

## Implementation scope

Primary expected files:

- `site/messenger.html`
- `assets/js/messenger-ui.js`
- relevant frontend tests
- generated `index.html`
- `PROJECT_STATE.md`
- this TASK

Minimal documentation adjustments are allowed if required.

Do not broaden this task into:
- extracting all rental-specific assistant copy
- extracting hot-topic button copy
- creating a shared package across multiple repos
- adding 1999 or taxpayer-rights pages
- changing visual design
- changing CX instructions/resources
- changing Router / Tool / Data Store / GCS
- changing house-tax-year logic

Those can be later stages.

## Required behavior

### A. Rental config present

For the current rental site:

1. `site/messenger.html` explicitly provides Rental Tax Guide as initial Playbook.
2. Shared `messenger-ui.js` reads that config.
3. New session first request uses that value as `currentPlaybook`.
4. After the first request, `currentPlaybook` is removed.
5. `runtime_current_date`, `runtime_entry_section`, and `timeZone` remain available as before.
6. Session reset / expiration re-arms direct entry.

### B. No initial Playbook configured

Implement a safe generic fallback.

If the site does not declare an initial Playbook:

- do not inject a Rental fallback
- do not inject any guessed Playbook
- do not send `currentPlaybook`
- still send the generic runtime parameters/timezone where applicable
- allow the Agent's normal default entry / Router behavior to take over

This is required so a future new site cannot accidentally be routed to Rental merely because configuration was omitted.

### C. Page-section updates

Hash/page-section changes must continue updating `runtime_entry_section`.

Changing page section must not:
- select a different initial Playbook
- re-arm `currentPlaybook` after the first request
- change the meaning of `runtime_entry_section`

## Regression protection

Add/update tests to prove at least:

1. Rental initial Playbook is declared in site-specific source.
2. Shared `messenger-ui.js` no longer contains a hard-coded `RENTAL_TAX_GUIDE_PLAYBOOK` constant/resource.
3. First-turn query parameters include configured `currentPlaybook`.
4. After first request, subsequent query parameters omit `currentPlaybook`.
5. New session / session reset re-arms configured initial Playbook.
6. Missing initial-Playbook config never falls back to Rental and does not throw.
7. `runtime_current_date`, `runtime_entry_section`, and `Asia/Taipei` behavior remain intact.
8. Hash change updates page section without changing site initial Playbook policy.
9. Source/generated output remain reproducible.
10. Production-visible Messenger UI and existing rental hot topics/copy remain unchanged.

Prefer behavior/contract tests over brittle source-string tests where practical.

## Validation

Run:

- normal build
- build `--check`
- full Node tests
- performance budget
- `git diff --check`

Perform an available browser smoke without adding large dependencies:

- Messenger opens/closes/reopens
- desktop no horizontal overflow
- mobile/narrow no horizontal overflow where practical
- current rental UI/copy unchanged
- no visible new error

A live CX query is not required solely for this refactor if automated/wire-level checks demonstrate that the produced QueryParameters contract is unchanged. If Codex does run a live query, keep it minimal and do not mutate CX.

## Before completion — cross-repo checkpoint

Re-read the latest `dialogflow-cx-qa-framework/STATE.md` and `TASKS.md`.

Record in this TASK:

- QA repo state observed
- whether Rental Playbook resource ID changed
- whether input parameter names changed
- whether runtime contract changed
- whether any QA-side change requires follow-up integration review

Do not modify the QA repo.

## Completion protocol

When implementation is complete:

1. Update `PROJECT_STATE.md` and this TASK.
2. Set status to:
   - `IMPLEMENTED_AWAITING_REVIEW`
3. Record:
   - implementation commit SHA
   - exact config mechanism
   - changed files
   - regression tests added/changed
   - validation results
   - browser limitations
   - cross-repo checkpoint result
4. Commit and push `refactor/messenger-multisite-config`.
5. Stop and hand back to Web ChatGPT/user.

Do not:
- open PR
- merge main
- switch GitHub Pages
- modify the CX/QA repo

Release will happen only after cross-repo and Web ChatGPT review.

## Implementation result (2026-09-27)

- Status: **IMPLEMENTED_AWAITING_REVIEW**.
- Implementation commit: `df23991e52258c8e14ae2b26fe5f02158f2f544c`.
- Config mechanism: the rental site's existing `df-messenger` element now declares `data-initial-playbook` with `projects/serviceagent-1150909/locations/asia-northeast1/agents/799426c1-ba69-49dc-85e4-5065985706e2/playbooks/7861bc8f-d2fb-43d3-8ca1-651415eb4205`. Shared JS reads the attribute; it has no Rental Playbook fallback. Missing or blank config omits `currentPlaybook` and retains `timeZone` and runtime `parameters`.
- First-turn semantics: configured `currentPlaybook` is armed for the initial request only, removed after `df-request-sent`, and re-armed on new session, session expiration/end, or storage reset. Hash changes continue updating only the current page section; after first request they do not re-arm `currentPlaybook`.
- Runtime contract preserved: `runtime_entry_section` remains hash / `main[data-page]`; `runtime_current_date` remains unchanged; timezone remains `Asia/Taipei`; no `runtime_site` or `current_house_tax_year` was introduced.
- Changed files: `site/messenger.html`, `assets/js/messenger-ui.js`, `tests/messenger-runtime.test.mjs`, generated `index.html`, this task, and `PROJECT_STATE.md`.
- Regression tests: 8 new behavior/config tests cover site config and generated output, no shared Rental fallback, first-turn and post-request behavior, session re-arm lifecycle, missing config, runtime date/timezone/section semantics, page hash updates, and preserved Messenger UI/copy.
- Validation: normal build PASS; `node scripts/build.mjs --check` PASS; `node --test` PASS (28/28); `node scripts/performance-budget.mjs` PASS; `git diff --check` PASS.
- Browser smoke: Chrome open/close/reopen passed without sending a query. No horizontal overflow at 1536px, 390px, or 320px. Captured screenshots showed no visible error text. The accessibility tree exposed the generic `Something went wrong` string on both localhost and the existing production page; no CX response was tested, so live-answer behavior remains unverified.
- Cross-repo checkpoint: latest read was QA framework `main` / `origin/main` at `6af5e207e3283cc5f49415cbb879ef31cad2de30`; clean working tree. Active QA-12B is READY TO EXECUTE and modifies only Example 2 while freezing Instructions and frontend/runtime transport. Rental Playbook resource ID, input names `runtime_current_date` / `runtime_entry_section`, and QA-10C contract are unchanged. No frontend change or CX mutation is needed for this task. Include QA-12B's eventual result in integration review before any release. QA repo remained untouched.
- No PR was opened, no merge was made, and GitHub Pages configuration was not changed.


## Web ChatGPT review (2026-09-27)

Status: **REVIEW_APPROVED_READY_FOR_PR**

### Review result

**PASS.**

Verified directly from the branch:

- implementation commit: `df23991e52258c8e14ae2b26fe5f02158f2f544c`
- `site/messenger.html` owns the Rental `data-initial-playbook`
- shared `assets/js/messenger-ui.js` contains neither `RENTAL_TAX_GUIDE_PLAYBOOK` nor the Rental Playbook resource ID
- missing/blank site config omits `currentPlaybook` instead of guessing Rental
- one-shot first-turn arm / request disarm / reset re-arm behavior is preserved
- `runtime_current_date`, `runtime_entry_section`, and `Asia/Taipei` remain unchanged
- no `runtime_site` or `current_house_tax_year` was added
- generated output preserves the site config
- runtime regression tests cover the intended contract
- implementation scope contains no CX/GCP/Router/Tool/Data Store mutation

Reported gates are green: build, build --check, Node 28/28, performance budget, and `git diff --check`.

### Cross-repo integration review

Latest QA repo state was re-read after implementation:

- QA-12B is completed and awaiting Web ChatGPT review.
- Its attempted Example 2 change was rejected and fully restored.
- Live Rental Tax Guide remains at the authoritative baseline.
- Rental Playbook resource ID is unchanged.
- Input parameter names `runtime_current_date` / `runtime_entry_section` are unchanged.
- QA-10C runtime contract is unchanged.

**No frontend/CX contract drift exists.**

### Authorized release

Proceed with:

1. Sync latest refs and confirm branch not behind `main`.
2. Re-run release gates.
3. Open PR from `refactor/messenger-multisite-config` to `main`.
4. Standard Merge Commit only; no squash/rebase.
5. Wait for Pages success.
6. Run focused production Messenger smoke on the allowed Pages origin, including one basic rental query.
7. Update STATE/TASK on `main` to `RELEASED` with PR URL/number, merge SHA, Pages run, and smoke results.
8. Preserve branch history.

No further design or CX change is authorized in this release.
