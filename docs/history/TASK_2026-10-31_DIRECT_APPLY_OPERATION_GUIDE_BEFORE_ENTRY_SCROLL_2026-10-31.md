# TASK — UX round 2 (2026-10-31)

Status: **UX_ROUND_2_HTTPS_PASS — DEDICATED_ENDPOINTS_PARTIALLY_UNVERIFIED**

## Scope and progress

- [x] Clean repo, safe fetch/fast-forward pull same branch at f6c0ab4; read State/Task/README/frontend flow, no AGENTS.md found. First Git escalation review timed out; single retry succeeded.
- [x] Preserve completed deployment stage and all original evidence under docs/history.
- [x] Minimal shared hero/entry shell and hash/focus/history behavior.
- [x] Swap only helper and direct-apply entries.
- [x] Four application cards, blue/orange/green/purple, 2×2 desktop and 1 column mobile, shared policy records.
- [x] Verify and label one primary action per plan; record unresolved direct channels honestly.
- [x] Build/tests and local non-CX regression; implementation pushed, existing Pages automatically deployed correct SHA, actual HTTPS regression PASS. Final evidence push/canonical alignment is checked at final handoff.

## Application source work

- Ordinary: existing official income-standard form includes fields, lease upload and submit; this is a real online declaration, not the calculator.
- Social: official Taipei program page explicitly directs owners to cooperating providers; provider consultation is the correct first action, not an online tax application.
- Public/personal: user supplied official tax application/forms portal https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72 for both. Inspect portal and use truthful labels. Do not infer a dedicated combined house/land-tax online workflow.
- Personal candidate discovered by clicking official “我要申請”: https://service.taipei/online-application/BX004/step1 . It is titled general land-tax exemption, and stops at terms before form fields. No terms accepted, no data submitted; exact applicability to combined house/land-tax reduction unverified.
- Public: nprent is a recognition query; do not present it as submitting an application. Local taxes use the existing proactive roster process.

CX tests/actions remain excluded. R2 files/player/source URLs and Messenger config unchanged. No policy-value changes, main merge, PR, institutional deployment, ZIP or official video.

## History

[Previous Task and evidence](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_UX2_2026-10-31.md), [previous State](docs/history/PROJECT_STATE_BEFORE_UX2_2026-10-31.md).

## Implementation / local checks

- One shared hero/six-entry shell lifted out of the home content. Home/application/video routes keep it visible; legacy plan detail/inline/comparison lifecycle retained. Entry clicks use pushState and the existing route function, avoiding a native anchor jump before lower content is ready. Hash/history/deep links and heading focus are preserved; scroll moves only when the heading is outside the useful viewport. No new return-home button/framework/dependency.
- Swapped only helper/application DOM positions. Tablet entry grid corrected to 2 columns for legibility; desktop remains 3×2. Application cards use existing four palette variables, 2 columns above 700px, one below, natural heights, one primary action and complete existing processes.
- New `applicationAction` presentation metadata in content.json controls a single main action/note; all original policy/process/deadline/condition/reference-link fields deep-equal the f6c0ab4 baseline. Old calculator/query/FAQ links remain in plan details instead of competing primary actions.
- User supplied the tax forms portal for public/personal. Verified as the official application/forms directory; use accurate portal labels. Dedicated public recognition and personal combined-tax online form endpoints remain unverified, and are not represented as confirmed direct-online applications. Candidate personal online path was found through the official button but stops at terms; no terms accepted/data submitted.
- Build/Pages build/check PASS; complete Node suite **58/58 PASS**, performance budget PASS, diff check PASS. Exact Node package-script entrypoints used (npm absent in shell).
- Local published-output non-CX regression PASS: existing four plans/guide/comparison/tenant links, primary links, 32 public asset MIME/status checks, excluded files 404, no GA4 calls/errors. Video regression PASS: both R2 media 206/video/mp4, decode/play/fullscreen/pause/history/device defaults. UX2 regression PASS at 1440/768/390/320px: order/shared shell, keyboard/focus, columns/colors, deep links/reload/history, no overflow and no unnecessary desktop jump.
- Initial UX2 scroll assertion exposed native anchor scrolling before route; fixed by intercepting only shared-entry links. Initial generic local artifact check found preview server did not serve its public 404.html; extended preview's static filename allowlist. Neither change affects CX/R2 configuration.
- Impeccable detector ran once; existing style/border heuristics plus aggregate-parser warnings are advisory, not new measured defects. Bounded desktop/mobile/tablet screenshot review confirmed current layout; no unrelated redesign.
- Next: push implementation, let existing Pages project rebuild, run actual HTTPS tests, save final evidence and update State/Task.

## Actual Pages HTTPS acceptance

- Implementation pushed on existing branch at `16f078f3d33b9bcd67815e8a72afd710ecc5aab7`; automatic Pages deployment `b9f71aba-f753-4483-bdd8-f878bb3348d6` SUCCESS, correct repo/branch/source SHA verified by API. Existing project reused with unchanged build/output/env settings.
- All following suites targeted **https://rental-tax-guide-test.pages.dev/** after deployment, with CX third-party requests isolated only by tests:
  - `scripts/ux2-browser-check.cjs` PASS at 1440/768/390/320px: exact DOM/keyboard order; common header/hero/entries visible across owner/tenant/application/video; one selected entry; keyboard Enter and heading focus; no unnecessary desktop scroll; 2-column desktop/tablet / 1-column phone application cards with four distinct accents; one primary action/card; deep reload/back/forward and video selection retention/paused return.
  - `scripts/pages-live-acceptance.cjs` PASS: all original plans/inline/mobile transitions, guide previous/results/history, tenant groups, comparison duplicate-selection guard/columns, 200% text and responsive overflow; four shared application records/processes/modes, official links; 32 assets HTTP 200/correct MIME; 11 non-public paths 404; zero GA4 requests/uncaught or unexpected console errors. Three distinct primary action destinations HTTP 200, GET only.
  - `scripts/pages-test-browser-check.cjs` PASS: gtag absent/no events, lower-content actions and retained video choice, no runtime asset failure/private file access.
  - `scripts/extension-browser-check.cjs` PASS at 1440/1100/768/390/320px: live R2 PC/mobile video HTTP 206/video/mp4, decode 1920×1080/currentTime advances/no error; posters/native fullscreen/controls, switch/leave pause, no autoplay, phone/desktop defaults, resize/manual override/history/return.
- Bounded screenshot verification covered desktop/tablet/mobile; tablet's inherited 4-column entry layout was narrowed to 2 columns to avoid cramped labels. No further visual redesign.
- No policy, deadline, tax, condition or original reference-link value changed (deep equality check after stripping only new action metadata). No changes to operation-guide.js, media.json, analytics.js, Messenger HTML/CSS/JS or CX/GCP. Root GA4 contract remains intact; test artifact still removes only loader/config.

## Four application actions and unresolved direct endpoints

| Scheme | Current primary action / URL | Verified scope | Unverified scope |
| --- | --- | --- | --- |
| Ordinary | [Online official declaration](https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php) | Real fields/upload/submit form; distinct from calculator | No application submitted |
| Public landlord | [User-confirmed tax application/forms portal](https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72) | Proactive roster-based local taxes; portal supports official filing/forms discovery | Dedicated housing-recognition submission endpoint not confirmed; nprent query not promoted |
| Social housing | [Consult official program providers](https://leasing-and-management.udd.gov.taipei/news/70) | Official instructions direct owners to cooperating providers | Not presented as online local-tax application |
| Personal rental | [User-confirmed tax application/forms portal](https://tpctax.gov.taipei/cp.aspx?n=F1C8047E644BDA72) | Official forms/filing channel directory; specific combined-tax form visible in service details | Candidate https://service.taipei/online-application/BX004/step1 is generic land-tax exemption; combined house/land-tax applicability unconfirmed |

User explicitly supplied the same portal for public/personal in this conversation; implemented it with transparent labels/notes. There is no need to block the other UX work. **This does not verify that all four schemes have dedicated direct-online application forms.** If dedicated public-recognition or personal combined-tax submission is desired, user/authority must provide or confirm those exact specialized URLs and their applicability. No candidate was guessed or falsely promoted.

## Evidence and handoff

Full new evidence in `docs/evidence/2026-10-31-ux2/`: application-source-review.md, deployment.json, https-ux2.json, https-regression.json, https-video.json, https-isolation.json and apply-1440/768/390.png. Earlier evidence and State/Task snapshots remain intact.

The final evidence/test-only commit does not change the accepted runtime artifact. After its push, verify that the existing Pages canonical deployment source equals final remote branch HEAD, then rerun HTTPS UX/isolation smoke for handoff. Report that final SHA/Deployment ID externally rather than embedding a self-referential SHA in its own commit. No main merge/PR/formal deployment/ZIP/official video. CX remains excluded and physical-device/full accessibility validation remains pending.
