# TASK — UX round 2 (2026-10-31)

Status: **IN_PROGRESS**

## Scope and progress

- [x] Clean repo, safe fetch/fast-forward pull same branch at f6c0ab4; read State/Task/README/frontend flow, no AGENTS.md found. First Git escalation review timed out; single retry succeeded.
- [x] Preserve completed deployment stage and all original evidence under docs/history.
- [x] Minimal shared hero/entry shell and hash/focus/history behavior.
- [x] Swap only helper and direct-apply entries.
- [x] Four application cards, blue/orange/green/purple, 2×2 desktop and 1 column mobile, shared policy records.
- [x] Verify and label one primary action per plan; record unresolved direct channels honestly.
- [ ] Build/tests, desktop/tablet/mobile non-CX regression; push same branch, align existing Pages latest deployment and run real HTTPS regression.

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
