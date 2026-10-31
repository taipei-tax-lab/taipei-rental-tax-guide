# TASK — Two action links and video surface toggle (2026-10-31)

Status: **LOCAL_PASS — AWAITING_HTTPS**

- [x] Clean specified branch safely fetched/pulled at dbf5721e4d3023f7ac70d5a514232fb37882dd75. Read State/current Task/README/source; no AGENTS.md found. Prior State/Task archived verbatim before replacement.
- [x] Change only ordinary/social applicationAction kind/label/href/note. Target https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72, label 前往申辦與書表下載, kind forms. Clearly marks general forms hub, not dedicated scheme application. Social note retains cooperation-provider and automatic local-tax process. Exact baseline object comparison proves all other policy/links/entries/other schemes unchanged.
- [x] Add transparent semantic button inside minimal video wrapper. Only click toggles (no touchend/pointer duplicate handlers); bottom 80px excluded, all native controls remain directly clickable. Accessible label follows play/pause/ended; rejected play promise caught for retry. Native fullscreen uses video itself, without overlay. No JS leaves button hidden and native player usable.
- [x] Build/check, 58 tests, performance PASS. Targeted real Edge/Playwright tests pass desktop + iPhone/Android Chromium emulation, both videos: screen start/pause/resume, native play/pause exactly once, native scrubber seek preserves paused state, native mute preserves paused state, volume property, fullscreen enter/exit, ended then screen replay, version switch pause. Both official links open real new tabs at correct URL. No page errors.
- [ ] Existing complete frontend regressions; commit/push, exact Pages source check, actual HTTPS interaction/regression acceptance, final docs/evidence push and deployment parity.

Files: site/content.json, assets/js/operation-guide.js, minimal wrapper HTML in scripts/build.mjs, assets/css/guide-v2.css, generated index.html; tests/operation-guide.test.mjs fixture supports optional overlay, scripts/action-toggle-browser-check.cjs added, extension hover targets native control strip now (center is intentionally intercepted). README/current State/Task/history updated. No media source, poster, aspect, layout, routing, CX/GCP/GA4/R2 modifications.

Testing-only issue: original browser hover used the video center, now covered by the intentional button. Updated hover position to the native control strip, no forced click or bypass. Targeted suite then passed all six device/video combinations.

Limits: emulated phones run Chromium, not physical Safari/Android hardware. Actual phone native controls/fullscreen/rotation remain manual. Bottom control strip uses native behavior, including browser-specific fullscreen surface gestures; custom screen toggle applies only above that strip outside native video fullscreen. Live CX remains excluded per existing test-domain authorization; no configuration changes.
