# PROJECT_STATE

Last updated: 2026-10-31

- Phase: **ACTION_LINK_AND_PLAY_TOGGLE_ACCEPTED — TEST_SITE_ONLY**.
- Repo/branch: taipei-tax-lab/taipei-rental-tax-guide / feat/direct-apply-operation-guide-20261031; clean synchronized baseline dbf5721e4d3023f7ac70d5a514232fb37882dd75.
- Existing test site: https://rental-tax-guide-test.pages.dev/ ; same Pages Git integration; no main merge/PR/formal release.
- Ordinary/social applicationAction only: forms, 前往申辦與書表下載, official tax forms hub. Notes distinguish general hub from dedicated online application. Every other content field matches baseline.
- Videos: transparent accessible button above the video surface excludes bottom 80px native controls; one click handler toggles play/pause, native ended replay retained. Native fullscreen keeps the browser controls (overlay not included). No changes to V2 R2 sources, proportions, device defaults or pause rules.
- Build/check, 58 tests, performance, actual HTTPS targeted desktop/iPhone/Android Chromium-emulated interaction and existing frontend regression PASS. Runtime 9055a2d71506225d2632714c1b878d443888b131; Pages b66316e4-252d-4fe2-9355-2e5cdcf5fd9d SUCCESS, GitHub check exact SHA; main HTTPS bytes match immutable deployment/build. Final evidence commit deploys the same runtime; final handoff verifies exact final check/byte parity.
- Evidence: docs/evidence/2026-10-31-action-toggle/ . New page/console errors absent in HTTPS regression; no GA4 requests.
- Frozen: R2/CX/GCP/Messenger/GA4/formal settings, all other policy/reference/entry data. Live CX excluded; physical mobile fullscreen/touch behavior remains manual.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md). Prior State/Task archived verbatim in docs/history/*BEFORE_ACTION_PLAY_TOGGLE_2026-10-31.md; previous evidence preserved.
