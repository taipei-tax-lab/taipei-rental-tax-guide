# PROJECT_STATE

Last updated: 2026-10-31

- Phase: **NATIVE_VIDEO_CONTROLS_AUTOMATED_PASS — REAL_IPHONE_LINE_PENDING — TEST_SITE_ONLY**.
- Repo/branch: taipei-tax-lab/taipei-rental-tax-guide / feat/direct-apply-operation-guide-20261031. Clean baseline e9ebddb52663b94d9e79ac83020059f3da9e5c6e safely fetched/pulled; State/Task/source/tests/README read, no AGENTS.md found.
- Test site: https://rental-tax-guide-test.pages.dev/ ; reuse existing Pages Git integration. No main merge/PR/formal release.
- Before HTTPS hit test: upper/center points of both videos hit BUTTON; bottom hit VIDEO. This reproduces DOM interception, not real iPhone LINE execution.
- Fix removes overlay button, wrapper and CSS entirely. Only tested desktop Chromium gets direct video click shortcut outside fullscreen. iOS/Android/iPad desktop-mode/LINE/WebView/unknown browsers install no custom click handler and retain native behavior. Native controls, ratios/sources/device defaults and pause rules preserved.
- Build/check, 63 tests, performance and existing local frontend/V2 regression PASS. Native controls regression PASS: 8 device/video cases, trusted native play/pause/seek/mute/volume slider/fullscreen/PiP, no overlay hits; desktop surface shortcut retained and mobile custom listeners absent. Actual HTTPS acceptance PASS: runtime ea05b3eef46d813b83ae3543f6038b9b2e1b9045, Pages 9ca501f4-2114-4380-bf92-a927c364c376 SUCCESS with exact source SHA via GitHub check. Main HTTPS HTML/player JS/CSS equals immutable deployment/build.
- Limits: no installed Playwright WebKit binary and no actual iPhone LINE device access. Actual iOS WebKit/LINE controls/fullscreen/PiP require user retest; do not claim Chromium emulation proves them.
- Frozen: site/content.json and application labels/URLs/policies, media config/R2, CX/GCP/Messenger/GA4, other layout/deployment settings.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md). Prior State/Task archived verbatim under docs/history/*BEFORE_NATIVE_VIDEO_2026-10-31.md; previous evidence retained.

- Evidence: [native controls HTTPS](docs/evidence/2026-10-31-native-video-controls/native-controls-https.json). Eight Chromium video/device cases PASS, 33 public assets MIME/status PASS, no GA4 requests or console/page errors; existing V2/UX regression PASS. Final evidence-only commit triggers identical-runtime Pages build; final handoff verifies final source SHA, all public bytes and live smoke.
- Human acceptance still required on the actual iPhone LINE WebView: both versions, upper fullscreen/mute/PiP (if exposed), timeline and exit-state behavior. Automated iPhone/LINE cases verify native-only policy in Chromium, not real iOS functionality.
