# PROJECT_STATE

Last updated: 2026-10-31

- Phase: **UX_ROUND_2_HTTPS_PASS — DEDICATED_APPLICATION_ENDPOINTS_PARTIALLY_UNVERIFIED**.
- Branch: `feat/direct-apply-operation-guide-20261031`; clean synchronized baseline `f6c0ab4fd38a5bed5a9734a02830b6bc1337effc`.
- Existing Pages project: `rental-tax-guide-test`, https://rental-tax-guide-test.pages.dev/ . Reuse Git integration; no project recreation.
- Scope: shared hero/six entries for home/application/video routes; swap helper/application cards; four colored application cards; verified primary actions from shared content.json.
- User supplied https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72 for public-landlord and personal-rental application channels; verify its role and label accurately as official forms/processing, not an invented dedicated online form.
- Frozen: policy values/conditions/deadlines, CX/GCP/Messenger configuration, video source/player behavior, GA4 semantics. Pages test GA4 remains disabled. No main merge/PR/institutional deployment.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md).
- History/evidence: [prior State](docs/history/PROJECT_STATE_BEFORE_UX2_2026-10-31.md), [prior Task](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_UX2_2026-10-31.md); older records retained.

- Implementation ready for test-site deployment: shared entries/order/four application cards and one accurate action each complete. Public/personal use the user-provided official forms portal, not unverified dedicated online forms.
- Local gates PASS: build/check, **58/58** tests, performance/diff, existing non-CX regressions, UX2 keyboard/focus/history/layout at four widths and full R2 video lifecycle. No original policy fields or player/Messenger source changed.

## HTTPS result and application boundary

- Existing Pages automatic deployment `b9f71aba-f753-4483-bdd8-f878bb3348d6` SUCCESS, source implementation `16f078f3d33b9bcd67815e8a72afd710ecc5aab7` on the correct feature branch. All regression scripts then targeted actual https://rental-tax-guide-test.pages.dev/ . Final evidence-only push is rechecked against canonical deployment source at handoff.
- Requirements 1–3 PASS: common hero/entries and lower-content switching; swapped DOM/keyboard order; four blue/orange/green/purple action cards, desktop/tablet 2 columns and mobile 1, natural heights.
- Requirement 4: verified one accurate action per plan. Ordinary = actual online form; social = official program provider consultation. Public/personal = user-confirmed official tax application/forms directory. **Dedicated public-recognition and combined personal house/land-tax online submission URLs remain unverified; no all-endpoints-pass claim.** User-confirmed fallback is implemented with honest visible notes.
- Actual HTTPS UX2 and original non-CX regressions PASS: keyboard focus/hash/deep link/reload/history, viewport/no-jump/card checks, original plans/guide/comparison/tenant services, R2 playback/fullscreen/pause/device/version behavior, 32 asset statuses/MIME, GA4 silence and 11 non-public paths 404. No uncaught/unexpected page console error. All three distinct primary destination URLs HTTP 200.
- Evidence: [source review / pending endpoint details](docs/evidence/2026-10-31-ux2/application-source-review.md), [UX report](docs/evidence/2026-10-31-ux2/https-ux2.json), [regression](docs/evidence/2026-10-31-ux2/https-regression.json), [video](docs/evidence/2026-10-31-ux2/https-video.json); desktop/tablet/mobile screenshots in the same folder.
- Status is UX/test-site readiness with declared source limits, not an institutional production release. Physical mobile/accessibility/manual editorial acceptance and CX remain excluded/unverified. Existing project reused, no R2 mutation, PR or main merge.
