# TASK_2026-10-02_GA4_EVENT_TRACKING_V1

Status: **COMPLETE**

Planning owner: ChatGPT  
Implementation owner: Codex Cloud  
Review owner: ChatGPT  
Target repository: `taipei-tax-lab/taipei-rental-tax-guide`  
Target branch: create a new work branch from latest `main` (recommended: `feat/ga4-events-v1`)

## Goal

在已上線並完成 Realtime 驗證的 GA4 base tracking 上，加入第一版「網站使用 + Dialogflow CX 使用」自訂事件。

本輪目的不是把所有互動都記錄下來，而是建立可長期用於業務考核報告的穩定事件契約：

1. 網站是否被使用、主要需求落在哪裡。
2. 民眾是否真的開啟並使用 CX。
3. CX 對官方資訊的導流與前端錯誤情況。

「民眾實際問了什麼、回答品質如何、熱門問題與知識缺口」仍由 CX Conversation History 分析，不送入 GA4。

---

## Baseline

- Production branch: `main`
- GA4 base tracking release commit: `f82fb93294d0c921e42c0a0a68b1c878e45821ba`
- PR #14: `Add GA4 base tracking`
- GA4 Measurement ID: `G-S891SFSMBH`
- GitHub Pages deployment run #101 (`36970041557`) succeeded.
- GA4 Realtime has been manually verified to receive production test-page traffic.
- Existing official CX / Messenger behavior must remain unchanged.

---

## Frozen GA4 V1 event contract

Event names and enum values below are **frozen for V1**. Do not rename or add events without review.

### 1. `audience_select`

Trigger:
- user selects the owner / tenant audience control.

Parameters:
- `audience`: `owner` | `tenant`

### 2. `plan_select`

Trigger:
- user selects one of the four rental-plan cards.

Parameters:
- `plan_id`: `ordinary` | `public` | `social` | `personal`

Use the existing plan IDs already present in the site/rules; do not create a second naming system.

### 3. `guide_start`

Trigger:
- the quick guide is actually started.

Parameters:
- `audience`: currently expected to be `owner`

Do not fire repeatedly for each guide question in the same run.

### 4. `guide_complete`

Trigger:
- the quick guide reaches a result.

Parameters:
- `result_type`: `single` | `multiple`
- `result_plan`: `ordinary` | `public` | `social` | `personal` | `multiple`
- `recommendation_count`: integer

Rules:
- one recommendation → `single`, `result_plan` = its existing ID
- more than one recommendation → `multiple`, `result_plan=multiple`
- do not alter `RentalGuideRules` business logic

### 5. `cx_open`

Trigger:
- Messenger changes from closed to open, using the official Messenger event `df-chat-open-changed`.

Parameters:
- `entry_point`: `hero_button` | `floating_bubble`

Definitions:
- `hero_button`: the page's explicit “直接問小幫手” / helper entry
- `floating_bubble`: native Messenger floating launcher

Requirements:
- attribute the next actual open to the entry point that initiated it
- avoid duplicate events caused by UI initialization/re-render
- closing/reopening may create another legitimate `cx_open`

### 6. `cx_query_submit`

Trigger:
- one user query is submitted.

Parameters:
- `input_method`: `manual` | `quick_topic`
- `topic_id`: only for `quick_topic`

Frozen quick-topic mapping:
- 租金補貼 → `rent_subsidy`
- 出租房屋租稅優惠 → `tax_benefits`
- 申請流程 → `application_process`
- 房客權益 → `tenant_rights`

Rules:
- manual user input should use the existing official Messenger event `df-user-input-entered`
- the site's quick-topic buttons call `sendQuery()`; count the click/send as `quick_topic`
- do not double count one quick-topic submission as both `quick_topic` and `manual`

### 7. `cx_source_click`

Trigger:
- user clicks a Messenger citation/source, using official `df-citation-clicked` if supported by the current widget runtime.

Parameters:
- `destination_host`

Rules:
- safely derive hostname from the destination URL
- do not send the complete URL
- do not send citation title/text

If the currently deployed Messenger runtime does not expose this event as expected, preserve the event contract but report it as blocked; do not implement DOM scraping as a workaround without review.

### 8. `cx_error`

Trigger:
- official `df-messenger-error` event.

Parameters:
- `error_code`
- `error_status`

Rules:
- only send stable scalar code/status fields when available
- do not send error message
- do not serialize or send the full error object
- analytics failure must never interfere with Messenger error handling

### 9. `service_entry_click`

Trigger:
- user clicks the real service entry for the income-standard service.

Parameters:
- `service_id`: `income_standard`
- `destination_host`

Current V1 service scope:
- 所得達租金標準申報優惠稅率專區 only

Do not automatically track every outbound link in this task.

---

## Privacy contract — release blocker if violated

GA4 must never receive:

- user query text
- `event.detail.input`
- name / phone / address / ID or other user-entered free text
- Dialogflow request body / query payload
- Dialogflow response text / response payload
- full citation URL
- citation title/text
- full error object
- error message / stack

CX Conversation History remains the system for conversation-content analysis.

The frontend warning asking users not to enter personal data does **not** relax this rule.

---

## Implementation constraints

1. Add a small centralized analytics helper/module; avoid scattering raw `gtag()` calls throughout feature code.
2. Preserve the existing GA loader/config exactly once.
3. Do not use GTM.
4. Do not add third-party analytics libraries.
5. If `window.gtag` is unavailable, tracking must fail safely and never break site/CX behavior.
6. Do not alter:
   - CX Agent/Playbook/Tool/GCP configuration
   - Messenger UX or response flow
   - tax/legal/eligibility logic
   - `RentalGuideRules` decision logic
7. `index.html` remains generated output; make source changes in the real source/template/assets and rebuild.

---

## Test / regression gate

The previous base-tracking test intentionally prohibited custom analytics events. Update that guard deliberately; do not simply delete it.

Required deterministic coverage:

- GA loader exists once
- GA config exists once
- no GTM container
- only the nine approved V1 custom event names are emitted
- approved enum values/mappings are stable
- quick topic does not double count as manual
- no query/input text is passed to analytics
- no Dialogflow request/response payload is passed to analytics
- no complete URL or citation text is passed for source click
- no full error/message is passed for error event
- analytics helper is safe when `gtag` is missing
- build source and generated output remain consistent
- existing Messenger and guide regressions remain green

Run the repository's existing:
- normal build
- build `--check`
- full Node test suite
- performance budget if part of the current release gate
- `git diff --check`

---

## Deliverable / handoff

Codex must:

1. sync latest `main`
2. create a new work branch
3. implement only this task
4. run the full gate
5. commit
6. push the branch to GitHub
7. **do not create PR**
8. **do not merge main**

Final report must include:
- branch
- commit SHA
- changed files
- event implementation map
- privacy safeguards
- test results
- `git status`
- push result
- any runtime/API limitation found

Then stop for ChatGPT code/privacy/double-count review.

## Done definition

This task is complete only after:

1. ChatGPT review PASS
2. approved branch merged to `main`
3. GitHub Pages deployment succeeds
4. selected V1 events are manually validated in GA4 Realtime/DebugView
5. `PROJECT_STATE.md` records the released result

No additional analytics event expansion is part of V1.


---

## ChatGPT review — 2026-10-02

Reviewed branch: `feat/ga4-events-v1`  
Reviewed commit: `bb0e7f1e9db43c032bb84bf7a550b4bcd47e0748`  
Branch relation at review: ahead of `main` by 1, behind by 0.

### Review result

**REVISION REQUIRED — do not open PR / do not merge yet.**

The overall architecture is sound:

- centralized `assets/js/analytics.js`
- frozen event allowlist and enum validation
- unknown/free-text parameters are dropped before `gtag`
- no GTM / no third-party analytics library
- GA loader/config remain single-instance
- guide, audience, plan, service-entry and CX event wiring are scoped to the approved V1 contract
- citation tracking reduces URLs to hostname
- error tracking avoids message/object serialization
- generated output remains source-driven

Two correctness issues must be fixed before release.

### R1 — quick-topic suppression can hide a legitimate manual query

Current implementation uses:

- a global `suppressManualInputCount`
- a blind 2-second timeout

after a quick-topic `sendQuery()`.

This assumes the programmatic `sendQuery()` will generate a matching `df-user-input-entered` event within that window. That timing/behavior is not part of the frozen contract and the current test only checks source text with a regex.

Failure mode:
- if the programmatic query does not emit that event, or emits outside the assumed timing, the next genuine user input inside the suppression window can be incorrectly discarded from GA4.

Required correction:
- replace blind counter/time-window suppression with deterministic matching to the pending quick-topic submission.
- It is acceptable to inspect `event.detail.input` locally only for equality against the known predefined quick-topic string, but that text must never be forwarded to analytics.
- Clear the pending marker after the matching event or a short safety expiry.
- A real manual query that is not the pending predefined quick-topic text must always produce `cx_query_submit {input_method: manual}`.

Add a deterministic regression test for:
1. quick-topic submission emits exactly one quick-topic analytics event;
2. a matching programmatic input event is suppressed;
3. an unrelated manual input immediately afterward is still counted;
4. no input text reaches `RentalAnalytics.track`.

### R2 — hero entry-point marker can become stale when chat is already open

Current `guide-ui.js` sets `window.RentalAnalyticsCxEntryPoint` before calling `openChat()`.

The Messenger API specifies that `openChat()` does nothing if the chat is already open. In that case no closed→open transition occurs, but the hero marker remains valid for 15 seconds. If the user closes and reopens via the native bubble within that interval, the later native open can be incorrectly recorded as `hero_button`.

Required correction:
- arm the hero entry marker only immediately before a real programmatic open attempt, not simply on every helper-button click.
- ensure a marker that is not consumed by the corresponding closed→open event is cleared promptly.
- preserve delayed opening when Messenger is still loading.
- add a deterministic regression test proving:
  - helper-triggered closed→open = `hero_button`
  - native reopen after an already-open helper click = `floating_bubble`
  - no duplicate `cx_open` is emitted for the same open transition.

### Non-blocking runtime item

`cx_error` may legitimately emit with no code/status if the runtime error object does not expose stable scalar fields. The V1 contract allows this; no change is required unless runtime verification later shows a better stable shape.

### Revision gate

After R1/R2 corrections:

- keep all nine V1 event names and enum values unchanged
- rerun normal build
- rerun build `--check`
- rerun full Node tests
- rerun performance budget if present
- run `git diff --check`
- commit and push to the same `feat/ga4-events-v1` branch
- do not create PR
- do not merge `main`
- stop for ChatGPT re-review


---

## ChatGPT re-review — 2026-10-02

Reviewed branch: `feat/ga4-events-v1`  
Reviewed fix commit: `72554872c0be1a194b905f958d52dc5e8451375f`

### Result

**PASS — approved for PR / merge.**

R1 and R2 are corrected:

- quick-topic de-duplication now compares only against the pending predefined quick-topic input and does not suppress unrelated manual input;
- no user query text is forwarded to GA4;
- helper-button attribution is armed only for an actual closed-state programmatic open attempt;
- an already-open helper click no longer leaves stale hero attribution;
- closed→open transitions are emitted once and classified as `hero_button` or `floating_bubble`;
- deterministic regression coverage was added for both cases.

Official Dialogflow CX Messenger documentation confirms:
- `df-user-input-entered` exposes `event.detail.input`;
- `df-chat-open-changed` exposes `event.detail.isOpen`;
- `openChat()` does nothing when the chat is already open.

No additional V1 event expansion is approved in this review.


---

## Release — 2026-10-02

- PR: #15 `Add GA4 event tracking v1`
- Merge method: squash
- Production merge commit: `986b292a4bb7a300292f3a270f6d6da5925912bd`
- GitHub Pages deployment run: #106 (`36974580801`)
- Deployment result: **SUCCESS**

Remaining done-definition item:
- manually validate representative V1 events in GA4 Realtime / DebugView before closing this task.


---

## Runtime validation / closeout — 2026-10-02

Representative production validation in GA4 Realtime confirmed live custom-event ingestion from the GitHub Pages site.

Observed events included:
- `plan_select`
- `audience_select`
- `cx_open`
- `page_view`

This satisfies the V1 representative runtime-validation gate. Full exhaustive event-by-event QA is not required for Phase 6 closeout and can be revisited during operational reporting.

GA4 custom definitions were configured for:
- `destination_host`
- `entry_point`
- `input_method`
- `error_code`
- `error_status`
- `audience`
- `result_plan`
- `service_id`
- `plan_id`
- `topic_id`

GA4 custom metric configured:
- `recommendation_count`

Deferred, non-blocking follow-up:
- build the Chinese-language Explore / management-report views after enough production data has accumulated.

Phase 6D implementation is complete.
