# PROJECT_STATE

Last updated: 2026-10-31

- Phase: **ENTRY_HEADING_POSITION_ACCEPTED — CLOUDFLARE_TEST_SITE_ONLY**.
- Repo/branch: taipei-tax-lab/taipei-rental-tax-guide / `feat/direct-apply-operation-guide-20261031`; no main merge or PR.
- Test site: https://rental-tax-guide-test.pages.dev/ ; existing project rental-tax-guide-test and automatic Git integration retained.
- Runtime accepted: `f129bef1786a2efc69442bdd4ca29d4b3a867b5c`, deployment `5f58487e-1dd6-445b-9923-0df2a9eb7880` SUCCESS. Final evidence/docs commit triggers identical-runtime deployment; final handoff verifies its source SHA separately.
- Four entry headings align to ~28 CSS px from actual DOM positions after reflow/load, within document scroll limits. Repeats/resize preserve reading position; hash/deep links/history/focus retained. Shared hero/cards remain in DOM and visible above content.
- Build/check, 58 tests, performance guards, 36 responsive/zoom-equivalent and 12 native Edge page-zoom cases PASS. All existing non-CX browser suites PASS on actual HTTPS, including unchanged R2 playback, history and player choice.
- Frozen/unchanged: CSS layout, application cards/policy/URLs, CX/GCP/Messenger, GA4 semantics, R2 media/player/config. Test GA4 stays disabled; no formal site/video/ZIP.
- Limits: real iOS/Android devices, dynamic address-bar/pinch behavior and native Chrome UI zoom remain manual checks. Isolated Edge native engine page zoom 100/125/150% was verified separately. A short document cannot place its heading at 28px when max scroll is zero.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md). Evidence: [scroll and non-CX HTTPS results](docs/evidence/2026-10-31-entry-scroll/after-https-final.json).
- History preserved: [prior State](docs/history/PROJECT_STATE_BEFORE_ENTRY_SCROLL_2026-10-31.md), [prior Task/evidence](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_ENTRY_SCROLL_2026-10-31.md). Prior application-entry review limitations remain unchanged.