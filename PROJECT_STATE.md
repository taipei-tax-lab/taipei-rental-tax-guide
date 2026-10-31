# PROJECT_STATE

Last updated: 2026-10-31

## Current task — direct application and operation guide

- Status: **IMPLEMENTED_AWAITING_CHATGPT_REVIEW — NOT RELEASED**.
- Repository: `taipei-tax-lab/taipei-rental-tax-guide` (frontend only).
- Branch: `feat/direct-apply-operation-guide-20261031`.
- Base: latest `origin/main`, `28fd76a` (clean working tree; fetch and fast-forward pull completed).
- Canonical task: [TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md).
- Scope: six home entries; four-plan direct application guidance; PC/mobile native video players with configurable R2 sources.
- Frozen: policy values, GA4 event semantics, Messenger/CX/GCP configuration. No ZIP, MP4 in Git, PR, merge or deployment.
- Previous State snapshots and evidence: [State before this task](docs/history/PROJECT_STATE_BEFORE_2026-10-31.md); existing dated TASK files remain in place. Historical release claims retain their original dates and are not current release assertions.

## Current validation and review limits

- Build and reproducibility check PASS; complete Node suite **53/53 PASS**; performance budget and diff whitespace check PASS. Package scripts executed through their exact Node entrypoints because npm is absent in this shell.
- Existing browser integration and chat viewport regression PASS. New browser regression PASS at 1440/1100/768/390/320px, including real R2 playback, native fullscreen, pause/version/history lifecycle and no horizontal overflow. Evidence and commands are recorded in the current Task.
- Existing policy records remain identical after excluding new presentation metadata; Messenger/CX and GA4 source unchanged. Original State archived in full; old Task evidence retained.
- R2 media duration: PC ~4m28s, mobile ~2m16s. Requested “2 分鐘” entry wording retained for human review. Restricted official-link destinations, full video/audio accessibility review and physical-device acceptance remain pending.
- Delivery: feature branch only, commit and push for ChatGPT review. No PR, main merge, formal ZIP or deployment. Formal hosting/CSP/MIME and relative-path MP4 activation remain deferred.

## Review correction — device-specific initial video (2026-10-31)

- ChatGPT first review: main functionality and State/Task management PASS; one requested correction: initialize video version by device.
- Status: **IMPLEMENTED_AWAITING_CHATGPT_REVIEW — NOT RELEASED**; same feature branch, synced clean from origin at `e0b1719a3fb032cb1121acc804edbeb7172dd680`.
- Minimal initialization-only change: prefer navigator.userAgentData.mobile, fall back to phone User-Agent detection. Device choice runs once; manual selection survives hash navigation and viewport changes. Pause/no-autoplay lifecycle unchanged.
- “觀看 2 分鐘使用教學” retained as instructed; supplied videos are test materials. No new branch, dependency, player refactor, PR, merge or deployment.

- Correction validation: build / build --check PASS, full suite **53/53 PASS**, performance budget / diff check PASS. Existing browser integration and chat viewport checks PASS; extension browser regression PASS including phone device defaults, desktop narrow viewport, manual override retention, landscape/history/reload, both live R2 playbacks and native fullscreen.
- No new issue found in automated/emulated regression. Physical iOS/Android acceptance remains a pre-existing limitation. Implementation adds only three initialization lines to the player; generated HTML changes only its script content hash.
