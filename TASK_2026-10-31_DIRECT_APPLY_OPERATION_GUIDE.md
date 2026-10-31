# TASK 2026-10-31 — Direct application and operation guide

Status: **IMPLEMENTED_AWAITING_CHATGPT_REVIEW — NOT RELEASED**

## Authorized scope and acceptance

- Frontend repo only; branch `feat/direct-apply-operation-guide-20261031` from latest main `28fd76a`.
- Keep four existing entries; add 直接申請 / 已了解方案？前往申辦 and 操作說明 / 觀看 2 分鐘使用教學. Desktop: two rows, three columns.
- Reuse the visual system and hash routing; no new return-home button or broad refactor.
- Four-plan application instructions reuse `site/content.json`; distinguish self application, proactive local-tax processing and housing-authority/provider processes. Preserve policy values.
- PC/mobile HTML5 video, 16:9, local poster, native controls/fullscreen, no autoplay; pause on switching or leaving route, retain selected version on return.
- Configurable R2 URLs; relative paths supported for later deployment. No MP4 or release ZIP in Git.
- Do not change CX/GCP/Messenger, GA4 event semantics, CSP, MIME or formal deployment.
- Run build, reproducibility check, full tests, performance gate, browser and responsive regression; commit and push only. No PR/merge/deployment. ChatGPT owns review.

## Progress and evidence

- [x] Confirmed correct repo and clean worktree; fetched and fast-forwarded main from d5fad9e to 28fd76a; created requested branch.
- [x] Read README, prior State/Task, frontend source/build/tests; no repository/ancestor AGENTS.md found.
- [x] Preserved prior State verbatim in docs/history; all old Task files retained.
- [x] Implementation and official-source checks (restricted destinations noted below).
- [x] Automated and browser validation.
- [x] State/Task handoff prepared; commit/push this reviewed worktree to the named feature branch only.

## Implementation

- Six home entry cards: desktop two rows × three columns; existing owner/tenant/helper/income-standard entry behavior preserved. New hash routes: `#direct-apply`, `#operation-guide`; footer navigation also exposes them. No return-home button added.
- Direct-apply page renders all four plans from the existing `process`, `nextStepCaption` and `links` fields, plus presentation-only `applicationMode`. Ordinary rental has an `applicationLink` reusing the existing income-standard official form URL.
- Policy equality check against base HEAD: removing only the newly added `applicationMode`/`applicationLink` fields yields byte-independent deep equality with the original JSON. No existing policy values, source dates or URLs changed.
- `site/media.json` configures PC/mobile R2 sources. Build supports explicit `./` relative sources (tested in a temporary build fixture), rejects HTTP remote sources, and escapes output. Future relative MP4 hosting is not activated by this task.
- Two HTML5 players: local SVG cover, 16:9, native controls/fullscreen, playsinline, preload none, no autoplay. Small dedicated `operation-guide.js` pauses players on version changes, page visibility changes and pagehide; the existing hash router adds one pause call when leaving the operation-guide route. Same-document navigation retains selection and progress; reload defaults to PC. No-JS fallback shows both manual players.
- Prior PROJECT_STATE preserved in full in `docs/history/PROJECT_STATE_BEFORE_2026-10-31.md` (normalized EOL equality checked). Old TASK files retained unchanged; current State now points to the current task and historical snapshot.

## Verification — 2026-10-31

- `node scripts/build.mjs` PASS (same build entrypoint as `npm run build`).
- `node scripts/build.mjs --check` PASS.
- `node --test tests/*.test.mjs` **51/51 PASS** (same full suite as `npm test`; npm executable is absent in this shell, so the package scripts were executed directly).
- `node scripts/performance-budget.mjs` PASS; `git diff --check` PASS.
- `node scripts/browser-check.cjs` PASS: existing plan expansion/detail, reading guide, comparison, tenant links and responsive integration.
- `node scripts/chat-viewport-check.cjs` PASS: title/input/close bounds, side-panel alignment, zoom-equivalent viewports, draft preservation. No live CX questions sent.
- `node scripts/extension-browser-check.cjs` PASS: 1440/1100/768/390/320px; six entries, two × three at desktop, no horizontal overflow on home/direct-apply/operation-guide, 16:9 video boxes, actual R2 playback, native fullscreen entry/exit for both players, switching/route-leave pause, return/version retention, browser back/forward. New script blocks CX and analytics traffic; no console page errors.
- Local Chrome interactive smoke also confirmed actual playback and pause states. Both R2 videos decoded at 1920×1080 with readyState 4 and advancing currentTime; PC 268.187696 seconds, mobile 135.649333 seconds; no media error.
- Native fullscreen first entered successfully, but the first headless harness timed out exiting via Escape; the harness was corrected to use the native fullscreen control for exit, and the complete rerun passed. No product workaround was needed.
- Local ignored evidence: `.preview/extension-results.json`, `.preview/extension-{1440,390}-{top,direct-apply,operation-guide}.png`, and existing browser/chat screenshots. Visual inspection of desktop/mobile captures found no new layout issue.
- Impeccable detector ran once: six warnings concern existing accent borders; the heading-size warning is incomplete because the detector resolves template stylesheets relative to `site/`. No unrelated visual redesign was made.
- Frozen source check: Messenger HTML/CSS/JS, analytics.js, rules.js unchanged. No MP4, release ZIP, CSP/MIME change, cloud mutation, PR, merge or deployment.

## Official-source review

Checked read-only on 2026-10-31; no applications were submitted:

- [Income-standard official form](https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php): form and required-document instructions present.
- [Personal rental local-tax application/forms](https://service.taipei/case-detail/BX004): includes the personal rental house/land-tax reduction application form.
- [Taipei social housing plan providers](https://leasing-and-management.udd.gov.taipei/news/70): published provider contact route present.
- [Taipei tax public-landlord page](https://tpctax.gov.taipei/cp.aspx?n=3A978B4E3ADD88F2&s=0F6CC22A30839EA4): distinguishes housing recognition and proactive house/land-tax processing, with income-tax filing separately.
- Existing `nprent.nlma.gov.tw/nprent/` and `pip.moi.gov.tw/Publicize/Info/B4050` returned Request Rejected to automated retrieval; `resim.moi.gov.tw/Home/RentIndex` timed out. Original official links retained, not replaced with guessed destinations. Human browser review required.

## Human review / deferred work

- ChatGPT: review diff, shared policy rendering, official link labels/roles, playback lifecycle and State/Task handoff before authorizing release.
- Requested card copy says “2 分鐘”; actual PC video is ~4m28s and mobile ~2m16s. Requested wording retained pending human decision on copy or replacement videos.
- Human review of complete video content/audio, captions/accessibility and physical iOS/Android playback remains pending. Desktop Chromium emulation does not prove native mobile behavior.
- Confirm restricted official destinations manually. Existing policy data was reused, not re-audited for all future tax periods.
- Formal hosting/CSP/MIME/Range, production-domain playback and relative MP4 hosting remain a separate deployment task. No formal ZIP prepared.
- Commit SHA and remote branch are supplied in the final handoff; no PR is to be created.
