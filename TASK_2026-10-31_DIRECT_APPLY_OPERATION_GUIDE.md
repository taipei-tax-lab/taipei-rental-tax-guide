# TASK — Pages deployment and non-CX HTTPS acceptance (2026-10-31)

Status: **PAGES_TEST_DEPLOYED — NON_CX_FRONTEND_ACCEPTANCE_PASS**

## Scope and progress

- [x] Correct frontend repo, clean worktree; fetched/pulled same feature branch at `f9096fa44cf134bd85e672c356cc76aa56bca2dc`.
- [x] Read latest State/Task/README/build and Cloudflare skill; no AGENTS.md found.
- [x] Preserve prior State/Task in docs/history before starting this phase.
- [x] Create/reuse `rental-tax-guide-test` with GitHub feature production branch and requested build/output/env settings.
- [x] HTTPS non-CX acceptance: six cards, owner/tenant/plans/guide/comparison, four-plan application links, videos/device selection/history/fullscreen, assets/MIME/errors/overflow, GA4 silence, excluded files 404.
- [x] Record results; commit/push this evidence on the same branch, then verify final Pages source against remote HEAD for final handoff.

CX operations/API are fully excluded, including opening the helper, sending queries and predefined topics. Browser automation isolates third-party CX requests only; website/Messenger/CX/GCP configuration remains unchanged. External application destinations receive GET only, never data submission. R2 videos remain read-only and use existing URLs. No PR/main merge/institutional deployment/ZIP/official media.

## History

- [Previous preparation phase and evidence](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_PAGES_DEPLOY_2026-10-31.md).
- [Previous State](docs/history/PROJECT_STATE_BEFORE_PAGES_DEPLOY_2026-10-31.md).

## Deployment

- Existing account had zero Pages projects. Created only `rental-tax-guide-test` via the Cloudflare connector using existing GitHub authorization; repo and feature production branch verified. Preview branches disabled, PR comments disabled, no Functions or other service.
- Build `node scripts/build-pages-test.mjs`, root blank, output `dist-pages-test`, NODE_VERSION=22 and SKIP_DEPENDENCY_INSTALL=1 in production/preview. Account source GitHub repo IDs and branch verified through API. No new keys or authorization expansion.
- Explicit Git deployment started after project creation (creation itself did not start a build). Deployment `9dc325f4-40ec-435e-9aa6-602626cd89d0`, source `f9096fa44cf134bd85e672c356cc76aa56bca2dc` from the correct feature branch; queue/initialize/clone/build/deploy all SUCCESS. Public alias https://rental-tax-guide-test.pages.dev/ and deployment URL https://9dc325f4.rental-tax-guide-test.pages.dev . Canonical deployment verified via API.
- Final test/docs push triggers Git deployment; the last canonical deployment is checked after push to ensure its source equals final remote branch HEAD. Final Deployment ID/SHA are reported in the handoff (self-referential commit IDs are not embedded in their own commit).

## Actual HTTPS acceptance and evidence

All browser suites below targeted **https://rental-tax-guide-test.pages.dev/**, not localhost, using installed Playwright + Edge. CX scripts/API/third-party requests were isolated by test routing; Messenger was never opened or queried. The CX-related hero button was inspected for presence only. No chat/browser-check or chat viewport suite that opens Messenger was run in this phase.

- Build and isolated Pages build PASS; canonical build check PASS; complete unit suite **56/56 PASS**; standalone performance budget and diff checks PASS. Unit tests containing deterministic Messenger mocks are not live CX acceptance.
- `scripts/pages-live-acceptance.cjs`: PASS. All four desktop inline plans, mobile detail and responsive transition; guide previous/result/history; tenant groups/all resource links; mobile two-plan comparison, duplicate selection guard, desktop four aligned columns; 320/390/768/1024/1440px checks and 200% text. New application page renders all four shared records/modes/processes/links. Three non-CX home links clicked through the suites; income-standard destination checked read-only; helper intentionally not clicked.
- `scripts/extension-browser-check.cjs`: PASS. Six-entry 3×2 desktop layout; 1440/1100/768/390/320px home/application/video no overflow. Phone defaults mobile, desktop defaults PC even when narrow; manual override survives resize/landscape/routes/history, reload initializes by device. Both posters/16:9/no autoplay/native controls remain present. Actual R2 playback, native fullscreen entry/exit, switch/leave pause and return retention/no autoplay all PASS. R2 responses 206, Content-Type video/mp4, 1920×1080 decoded, currentTime advances, no media error. No R2 file upload/update/delete or URL changes.
- `scripts/pages-test-browser-check.cjs`: PASS. gtag absent, analytics helper cannot emit, no GA4 request during interactions, four application items and retained video choice, expected private-path 404s.
- All **32** allowlisted files HTTP 200 with correct HTML/CSS/JS/PNG/WebP/SVG MIME; all **11** sampled non-published paths HTTP 404 (State, Task, README, package.json, source, tests, Git config, history, manifest). Published output remains the same 32-file allowlist; docs/evidence never included.
- Zero uncaught page errors/unexpected console errors in the non-CX suite; deliberately blocked third-party resource messages excluded. No site-owned asset 404, wrong MIME or unnecessary horizontal overflow observed.
- Eleven unique application destinations checked GET only: ten HTTP 200; service.taipei/case-detail/BX004 returned HTTP 404 at document transport. Browser verification of that exact original URL completed JavaScript loading and showed “申請地價稅減免” plus the personal rental house/land-tax application forms. Retained original link; did not invent a replacement or submit data. Screenshot and report preserve this external-server caveat.

Tracked evidence under [docs/evidence/2026-10-31-pages](docs/evidence/2026-10-31-pages): deployment.json, https-acceptance.json, https-video-acceptance.json, https-ga4-isolation.json; home-desktop.png, application-tablet.png, video-mobile.png and official-service-content.png. Additional detailed screenshots remain in ignored .preview/pages-live/ and .preview/extension-*.png.

## Failures and actual corrections

- Test harness: the old artifact smoke aborted all HTTPS requests, including its own site. Fixed routing to allow the tested origin while isolating third parties.
- Test harness: first remote smoke counted application items before hashchange rendering completed (0 vs 4). Added explicit visible-panel waits; rerun PASS.
- External transport 404 described above is not a frontend regression; correct browser content verified, no policy/URL/product change made.
- No site implementation fix required. Player/CSS/template/policy/analytics/Messenger/media/config remain unchanged from the approved artifact. Added reproducible non-CX HTTPS suite only; no external dependency.

## Limits and completion

- **非 CX 前端功能驗收完成，可供使用者人工操作測試。** No formal whole-project launch claim.
- CX opening/messages/topics/API explicitly excluded; no CX/GCP/Messenger change. Physical iOS/Android, screen-reader/full accessibility and complete audio/video editorial review remain untested.
- service.taipei HTTP status caveat remains external; its browser content is reachable. No failed frontend acceptance item remains in tested scope.
- Final push/Pages alignment and HTTPS smoke must be confirmed before final response. No main merge/PR/institutional site/ZIP/official video actions.
