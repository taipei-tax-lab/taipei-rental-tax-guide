# PROJECT_STATE

Last updated: 2026-10-31

- Current phase: **PAGES_TEST_DEPLOYED — NON_CX_FRONTEND_ACCEPTANCE_PASS**.
- Repo/branch: `taipei-tax-lab/taipei-rental-tax-guide` / `feat/direct-apply-operation-guide-20261031`; clean synchronized baseline `f9096fa44cf134bd85e672c356cc76aa56bca2dc`.
- Target: Pages `rental-tax-guide-test`, same GitHub feature production branch; build `node scripts/build-pages-test.mjs`, output `dist-pages-test`, root blank, framework None, NODE_VERSION=22 / SKIP_DEPENDENCY_INSTALL=1.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md).
- CX is excluded entirely from this phase: no opening Messenger, questions, examples or CX API. Test-only isolation blocks CX third-party requests; no product/Messenger/GCP configuration changes.
- Frozen: GA4 in existing environments, policy, R2 files/URLs, player copy. No PR/main merge/institutional deployment/ZIP/official video.
- History: [prior State](docs/history/PROJECT_STATE_BEFORE_PAGES_DEPLOY_2026-10-31.md), [prior Task and artifact evidence](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_PAGES_DEPLOY_2026-10-31.md).

## Test site and acceptance

- Live HTTPS: https://rental-tax-guide-test.pages.dev/ . This is a test site, not an institutional production release.
- Created via existing Cloudflare connection and GitHub authorization; settings verified. Initial accepted deployment `9dc325f4-40ec-435e-9aa6-602626cd89d0`, source `f9096fa44cf134bd85e672c356cc76aa56bca2dc`, all build/deploy stages success; no Functions.
- Actual HTTPS tests PASS: six entries; owner/tenant/all four plans/guide/comparison; four application sections; device/video/history/fullscreen; 32 public assets and MIME; 11 excluded paths 404; no GA4 requests, page errors, unexpected console errors or overflow. R2 videos return 206/video/mp4 and decode at 1920×1080. No R2 mutation.
- Build/check/full unit suite **56/56**/performance budget PASS. Product files unchanged this phase; only test harness fixes/new non-CX acceptance and documentation/evidence added.
- External service.taipei/case-detail/BX004 returns an HTTP 404 shell but loads the correct official application/forms through JavaScript; original URL verified in a browser and retained. Ten other application destinations return HTTP 200. No application data submitted.
- Evidence: [HTTPS report](docs/evidence/2026-10-31-pages/https-acceptance.json), [video report](docs/evidence/2026-10-31-pages/https-video-acceptance.json), [deployment](docs/evidence/2026-10-31-pages/deployment.json); screenshots in the same directory.
- After the final test/evidence commit is pushed, its GitHub/Pages deployment source is checked against remote feature HEAD and supplied in the final handoff. The published website artifact is unchanged by these test/documentation files.
- Goal reached: **non-CX frontend accepted and available for user manual testing**. CX is excluded, physical iOS/Android and full accessibility/audio review remain unverified. No main merge, PR, institutional deployment, ZIP or official-video replacement.
