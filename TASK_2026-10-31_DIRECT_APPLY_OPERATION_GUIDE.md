# TASK — Unblock native video controls (2026-10-31)

Status: **LOCAL_PASS — AWAITING_HTTPS**

- [x] Clean specified feature branch fetched/pulled at e9ebddb52663b94d9e79ac83020059f3da9e5c6e; read State/Task/README/player/CSS/build/tests. No AGENTS.md found. Prior completed State/Task archived verbatim under docs/history/*BEFORE_NATIVE_VIDEO_2026-10-31.md.
- [x] Before modification, actual HTTPS DOM hit test for both PC/mobile videos: upper and center -> BUTTON; lower -> VIDEO. This proves transparent-overlay interception mechanism without claiming actual iPhone LINE reproduction.
- [x] Remove overlay button/wrapper/CSS entirely (no replacement transparent hit layer or expanded reserved strip). Keep video controls/playsinline and original ratios, poster, V2 R2 source.
- [x] Desktop Chromium-only video click listener (single click, no pointer/touch duplicate listeners), guarded against default-handled/descendant/fullscreen events. iOS, Android, iPad desktop mode, LINE, embedded WebView, Safari/unknown engines use native-only interaction. Existing version/device/pause rules unchanged.
- [x] Build/check, 63 unit/build tests, performance and existing local Pages/UX/V2 regressions PASS.
- [ ] Complete native control pointer/touch/PiP regression; commit/push; exact Pages SHA/deployment check; actual HTTPS acceptance; final evidence/docs push/parity.

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
