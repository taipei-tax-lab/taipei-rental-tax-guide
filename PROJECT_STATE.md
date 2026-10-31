# PROJECT_STATE

Last updated: 2026-10-31

- Phase: **NATIVE_VIDEO_CONTROLS_LOCAL_PASS — TEST_SITE_ONLY**.
- Repo/branch: taipei-tax-lab/taipei-rental-tax-guide / feat/direct-apply-operation-guide-20261031. Clean baseline e9ebddb52663b94d9e79ac83020059f3da9e5c6e safely fetched/pulled; State/Task/source/tests/README read, no AGENTS.md found.
- Test site: https://rental-tax-guide-test.pages.dev/ ; reuse existing Pages Git integration. No main merge/PR/formal release.
- Before HTTPS hit test: upper/center points of both videos hit BUTTON; bottom hit VIDEO. This reproduces DOM interception, not real iPhone LINE execution.
- Fix removes overlay button, wrapper and CSS entirely. Only tested desktop Chromium gets direct video click shortcut outside fullscreen. iOS/Android/iPad desktop-mode/LINE/WebView/unknown browsers install no custom click handler and retain native behavior. Native controls, ratios/sources/device defaults and pause rules preserved.
- Build/check, 63 tests, performance and existing local frontend/V2 regression PASS. Native controls regression PASS: 8 device/video cases, trusted native play/pause/seek/mute/volume slider/fullscreen/PiP, no overlay hits; desktop surface shortcut retained and mobile custom listeners absent. Awaiting push/deployment/HTTPS acceptance.
- Limits: no installed Playwright WebKit binary and no actual iPhone LINE device access. Actual iOS WebKit/LINE controls/fullscreen/PiP require user retest; do not claim Chromium emulation proves them.
- Frozen: site/content.json and application labels/URLs/policies, media config/R2, CX/GCP/Messenger/GA4, other layout/deployment settings.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md). Prior State/Task archived verbatim under docs/history/*BEFORE_NATIVE_VIDEO_2026-10-31.md; previous evidence retained.
