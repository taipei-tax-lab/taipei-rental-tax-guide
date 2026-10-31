# PROJECT_STATE

Last updated: 2026-10-31

- Phase: **UX_ROUND_2_IN_PROGRESS — TEST_SITE_ONLY**.
- Branch: `feat/direct-apply-operation-guide-20261031`; clean synchronized baseline `f6c0ab4fd38a5bed5a9734a02830b6bc1337effc`.
- Existing Pages project: `rental-tax-guide-test`, https://rental-tax-guide-test.pages.dev/ . Reuse Git integration; no project recreation.
- Scope: shared hero/six entries for home/application/video routes; swap helper/application cards; four colored application cards; verified primary actions from shared content.json.
- User supplied https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72 for public-landlord and personal-rental application channels; verify its role and label accurately as official forms/processing, not an invented dedicated online form.
- Frozen: policy values/conditions/deadlines, CX/GCP/Messenger configuration, video source/player behavior, GA4 semantics. Pages test GA4 remains disabled. No main merge/PR/institutional deployment.
- Task: [current Task](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md).
- History/evidence: [prior State](docs/history/PROJECT_STATE_BEFORE_UX2_2026-10-31.md), [prior Task](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_UX2_2026-10-31.md); older records retained.

- Implementation ready for test-site deployment: shared entries/order/four application cards and one accurate action each complete. Public/personal use the user-provided official forms portal, not unverified dedicated online forms.
- Local gates PASS: build/check, **58/58** tests, performance/diff, existing non-CX regressions, UX2 keyboard/focus/history/layout at four widths and full R2 video lifecycle. No original policy fields or player/Messenger source changed.
