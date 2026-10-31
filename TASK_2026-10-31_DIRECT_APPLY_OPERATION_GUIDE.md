# TASK — Unblock native video controls (2026-10-31)

Status: **AUTOMATED_HTTPS_PASS — REAL_IPHONE_LINE_RETEST_REQUIRED**

- [x] Clean specified feature branch fetched/pulled at e9ebddb52663b94d9e79ac83020059f3da9e5c6e; read State/Task/README/player/CSS/build/tests. No AGENTS.md found. Prior completed State/Task archived verbatim under docs/history/*BEFORE_NATIVE_VIDEO_2026-10-31.md.
- [x] Before modification, actual HTTPS DOM hit test for both PC/mobile videos: upper and center -> BUTTON; lower -> VIDEO. This proves transparent-overlay interception mechanism without claiming actual iPhone LINE reproduction.
- [x] Remove overlay button/wrapper/CSS entirely (no replacement transparent hit layer or expanded reserved strip). Keep video controls/playsinline and original ratios, poster, V2 R2 source.
- [x] Desktop Chromium-only video click listener (single click, no pointer/touch duplicate listeners), guarded against default-handled/descendant/fullscreen events. iOS, Android, iPad desktop mode, LINE, embedded WebView, Safari/unknown engines use native-only interaction. Existing version/device/pause rules unchanged.
- [x] Build/check, 63 unit/build tests, performance and existing local Pages/UX/V2 regressions PASS.
- [x] Native control pointer/touch/PiP regression; runtime commit/push; exact Pages SHA/deployment check and actual HTTPS acceptance. Final evidence/docs commit source and public-file parity checked in final handoff.
- [ ] User actual iPhone LINE retest (not available to this environment; not represented as completed).

## Investigation / design

Current overlay upper hit intercepts fullscreen/PiP/mute locations reported by the user. Moving reserved pixel bands cannot handle browser-specific layouts. Removing the layer allows native controls anywhere on the video to receive input. No app CSS or script accesses/modifies native shadow controls in production.

An isolated Chromium experiment without overlay showed surface clicks reaching video while native play/mute actions did not emit video click. Chromium source was consulted as context (not a cross-browser guarantee): https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/modules/media_controls/elements/media_control_input_element.cc . WebKit inline playback reference: https://webkit.org/blog/6784/new-video-policies-for-ios/ . Cross-engine event behavior is not inferred from Chromium; conservative native-only fallback avoids custom double toggles on iOS/LINE. Fullscreen remains native-only everywhere. Physical iPhone LINE retest remains necessary.

## Implementation / tests

Production changes: assets/js/operation-guide.js, removal-only overlay CSS in assets/css/guide-v2.css, removal-only wrapper/button in scripts/build.mjs, generated index.html. README reflects policy. site/content.json, media config, player sizes/ratio rules, CX/GA4/Messenger and deployment settings unchanged.

Unit regression verifies absence of overlay markup/styles, no custom listener on iOS/LINE/iPad/WebView/unknown engines, one Chromium click toggle, default-handled/descendant/fullscreen exclusions and rejected play containment, plus existing device defaults/route/background pause. 63/63 PASS.

Reworked action-toggle-browser-check.cjs uses trusted browser mouse/touch on actual native control box models from Chromium's UA shadow DOM via CDP (test-only). This avoids hardcoded control-position assumptions and tests real native play/pause, seek, mute, volume slider, fullscreen and PiP menu entry. iPhone/LINE UA cases only verify fallback policy in Chromium, not actual iOS/LINE. No WebKit binary installed; no third-party dependency added.

Exploratory testing notes: a raw mouse surface probe raced initial hash-route scrolling; stable locator clicks and two layout frames fix the test setup. An early native-fullscreen probe before stable loaded controls timed out; final regression waits for media readiness and native control boxes instead of relying on pre-metadata positions. No production workaround added for these test issues.

Additional finding: Android Chromium touch surface taps were consumed by native gestures and did not reliably reach the video click listener. Therefore all Android browsers also use native-only interaction. Desktop Chromium alone retains the tested shortcut. This is an intentional native-controls-first fallback, not a claim that mobile tap-to-toggle is retained.

Final local native control regression PASS for 8 video/device cases: desktop Chromium, Android Chromium touch emulation, iPhone LINE UA and Safari UA fallback in Chromium; PC/mobile each. Tests click actual native shadow-control boxes for play/pause, seek, mute, volume slider, fullscreen (paused and playing, exit state preserved) and native overflow PiP entry (API exit). All upper/center/lower points hit VIDEO, no app layer. Only desktop gets custom surface toggle; mobile gets no custom listener. Real iOS/LINE remains explicitly untested. Existing Pages/non-CX/UX2/V2 media regression PASS; 63 tests and build/check/performance PASS. No source changes to content/media/CX/GA4.

## Actual HTTPS acceptance and handoff

Accepted runtime ea05b3eef46d813b83ae3543f6038b9b2e1b9045 on feat/direct-apply-operation-guide-20261031. Pages deployment 9ca501f4-2114-4380-bf92-a927c364c376 SUCCESS, exact head SHA confirmed via existing GitHub Cloudflare check. Before tests, main URL https://rental-tax-guide-test.pages.dev/ HTML/player JS/CSS byte-matched immutable deployment https://9ca501f4.rental-tax-guide-test.pages.dev/ (local text build matched after Git EOL normalization). No stale old site used.

Resume note: previous live regression commands were not executed because automatic approval review failed due workspace credits, not a finding of unsafe action. Work resumed at user request after tool approval became available; normal approval flow used, no bypass. Branch re-synchronized cleanly at runtime SHA and source rechecked before tests.

Actual HTTPS action-toggle-browser-check.cjs PASS for eight video/device cases: PC/mobile each on desktop Edge Chromium, Android touch emulation, iPhone LINE UA fallback in Chromium, iPhone Safari UA fallback in Chromium. Test instruments listener registration: desktop has 2 video click listeners; mobile/iPhone/LINE has 0. No overlay markup or CSS, all 9 upper/center/lower hit samples per video resolve VIDEO. Trusted input clicks actual UA-shadow native-control box locations discovered via test-only CDP, not injected control events or fixed pixel bands. Native play/pause, timeline drag without changing paused state, native mute, actual native volume slider, fullscreen entry/exit while paused and playing (exit state preserved), native overflow PiP entry and API exit PASS. Desktop surface toggle and end/replay PASS; all version switches pause the old video. No page errors.

Other actual HTTPS suites PASS: pages-live-acceptance.cjs, pages-test-browser-check.cjs, ux2-browser-check.cjs, extension-browser-check.cjs. Existing home/six entries/owner/tenant/4 plans/quick guide/comparison/application/hash/history/focus pass. 33 public files MIME/status pass, private documents 404, zero GA4 requests, no console/page errors. V2 metadata/ranges/playback/fullscreen/phone+tablet defaults and selection/pause/history/five widths PASS: PC 144.133333s at 1920×1080 (960×540 displayed), mobile 150.933333s at 1080×1920 (360×640 displayed). No changes to R2 URLs or objects, source data/actions/policy, CX/GCP/GA4/Messenger or formal deployment settings.

Build/check, 63/63 tests and performance guards PASS again after resume. Evidence in docs/evidence/2026-10-31-native-video-controls/ includes pre-fix hit test, native-control cases, runtime deployment and frontend/V2 regression reports. Final evidence/docs commit changes no public runtime, final handoff verifies its Pages check/head SHA and all 33 public-file byte parity against accepted immutable runtime plus fresh live smoke. No main merge/PR/formal release.

### Remaining manual acceptance (explicitly not passed)

No installed Playwright WebKit binary and no physical iPhone or LINE WebView access. Chromium iPhone UA/touch emulation does not implement iOS media controls. User must retest both versions inside actual iPhone LINE: native upper fullscreen, native mute/audio control, PiP where LINE exposes it, seek, exit fullscreen playing/paused, version-switch pause. Safari and Android hardware behavior also remain manual. The site no longer overlays any input layer or installs a custom click handler on those environments, but that structural fix is not proof of real-device acceptance. Native-only fallback intentionally prioritizes controls over guaranteed tap-to-toggle on mobile.
