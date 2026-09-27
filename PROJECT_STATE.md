# PROJECT_STATE

Last updated: 2026-09-27

## Production baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production branch: `main`
- Previous production baseline before Phase 5A: `ab1cb35b53763a6e6341b2041125894defaf8b27`
- Earlier production release merge: `251884ee3d133d4f2e5723b3d25ccdfc8a1bf642` (PR #9)
- Previous production release merge before PR #11: `20c915066c87fc4308c89dc601d324803b3bc0ef` (PR #10)
- Latest production release merge: `3bac3930aee9643a35d7e41ac375a581ab0b68b9` (PR #11; Standard Merge Commit)
- Latest production application commit: `3bac3930aee9643a35d7e41ac375a581ab0b68b9`.
- PR #11 GitHub Pages release deployment: run #92, source commit `3bac393`, completed successfully: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/36307128126.
- GitHub Pages: `https://taipei-tax-lab.github.io/taipei-rental-tax-guide/`
- Production status: **RELEASED**
- Production Messenger now uses the official/public-service CX configuration.

## Phase 5A candidate (now released)

- Branch: `phase5a-official-cx`
- Candidate application baseline before the 2026-09-27 planning docs: `e1d85dfeb87a81596195220164b4e17cc0bdaf98`
- Candidate purpose: switch the website Messenger to the official/public-service CX and simplify the Messenger chrome / assistant presentation.
- Official CX target:
  - location: `asia-northeast1`
  - project-id: `serviceagent-1150909`
  - agent-id: `799426c1-ba69-49dc-85e4-5065985706e2`

## Previous production task — QA-10C Generic Runtime Context v1 (2026-09-27)

- Status: **CLOSED — REVIEWED PASS**.
- Frontend implementation: `e1d8642a88b26e42fce0f3100a4f51fc96d9fde9`; framework implementation: `8389b8b54ad7ee8e0cd6e103228aab5b7a234aff`.
- Production Pages deployment run #90 succeeded; Messenger E01–E08 8/8, targeted CX regression 4/4, frontend tests 19/19, and build check passed.
- Runtime date/timezone/entry section remain generic integration context; tax-year knowledge remains in CX knowledge and is not hard-coded in frontend JS.

## Active task

- Status: **READY_FOR_IMPLEMENTATION**
- Task: Messenger multi-site config v1
- Task file: `TASK_2026-09-27_MESSENGER_MULTISITE_CONFIG.md`
- Execution agent: local Codex Desktop
- Baseline: production `main` at `1ae269999bc3048320ac471f7e21ffccc925ae72`
- Work branch: `refactor/messenger-multisite-config`
- Purpose: refactor the existing QA-10C one-shot direct-entry so each website explicitly declares its own initial Playbook instead of shared JS hard-coding Rental Tax Guide
- Current site decision: Rental site explicitly declares Rental Tax Guide as its initial Playbook
- Initial Playbook semantics: first-turn priority only; not a permanent lock and not a replacement for CX routing
- Keep unchanged:
  - `runtime_entry_section` remains current page section (hash / `data-page`)
  - `runtime_current_date` remains frontend-provided runtime date
  - request timezone remains `Asia/Taipei`
  - frontend does not calculate/send `current_house_tax_year`
  - QA-10C first-turn arm / post-request disarm / session re-arm lifecycle
- Generic fallback: if a future site has no initial Playbook config, omit `currentPlaybook` and let the Agent default Router handle entry; never fall back to Rental
- Cross-repo coordination: read `taipei-tax-lab/dialogflow-cx-qa-framework` STATE/TASKS at start and before completion; do not modify that repo from this task
- Current QA-side expected work: QA-12A Instructions-only behavior repair; it explicitly forbids frontend/runtime transport changes
- Multi-agent rule: each agent owns one repo/scope; at milestones sessions read the other repo's STATE/TASK; if contradiction exists, authorize one agent only to mutate the affected side
- This task does not add 1999/納保 Playbooks or IDs; it only makes the current frontend ready for site-specific initial Playbook configuration
- Completion: update STATE/TASK to `IMPLEMENTED_AWAITING_REVIEW`, commit/push branch, then stop
- No PR, no merge, no Pages switch, no CX/GCP mutation

## Messenger multi-site architecture decision (2026-09-27)

### How initial Playbook is determined

The website determines it explicitly through site-specific Messenger configuration.

Do not infer it from the user's wording, current page hash, model judgment, or a hard-coded global Rental fallback.

Conceptually:

```text
出租專區 site config
  → initialPlaybook = Rental Tax Guide
  → new session first turn uses currentPlaybook
  → first request sent
  → currentPlaybook removed
  → normal CX session/routing continues
```

Future 1999 and taxpayer-rights sites will declare their own initial Playbooks in their own site config. Their resource IDs are not part of this task.

This means “from a given service section, prioritize that service's Playbook” while still allowing CX to handle later explicit cross-domain intent.

### Cross-repo working model

No additional synchronization service is needed.

- Frontend repo records frontend/runtime truth in its STATE/TASK.
- QA repo records CX/QA truth in its STATE/TASKS.
- At a milestone, either existing Web ChatGPT session may read the other repo.
- A new integration session may also read both repos and reconcile them.
- If there is a conflict, only one local agent should be instructed to make the corrective mutation.

This keeps the user's existing GitHub handoff workflow and avoids both local agents changing the same interface at the same time.

## Human visual review decision (2026-09-27)

- The user compared local baseline and candidate side by side.
- **Accepted:** moving the quick-guide shortcut under the owner-plan heading and clarifying it as a fallback/decision-support path. The visual hierarchy is improved enough to keep.
- **Rejected:** duplicating `租稅來源核對：{{CHECKED}}` directly below the four plan cards. In real visual review it felt unnecessary and added clutter; the existing footer date is sufficient.
- Therefore the production-bound change is intentionally smaller than the Stage 2 candidate: **quick-guide hierarchy only**.
- This is a UX judgment from direct side-by-side human review and supersedes the earlier Stage 2 approval of the source-check-date candidate.

## Impeccable Stage 2 decision

- Human review approved Stage 1 candidates #2 and #3 for a small implementation experiment.
- Candidate #2: clarify the hierarchy between four rental plans and the “不知道怎麼選？” guide.
- Candidate #3: show the existing source-check date closer to the tax-plan/comparison information while keeping `site/content.json -> meta.checked` as the single source of truth.
- Candidate #1 (force benefit summaries into the first desktop viewport) is deferred.
- Stage 2 remains an isolated PoC on the same branch; production `main` is unchanged.
- Human review is required again before any PR or merge.

## Stage 2 implementation result (2026-09-27)

- Status: **STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW**
- Work branch: ux/impeccable-refinement-poc
- Implementation commit: 4c65a700dc870f06c3eb1150cb32a9682f920cc0 (feat: refine owner plan guidance layout).
- Production main remains at the recorded baseline; no PR, merge, or GitHub Pages source change was made.

### Approved changes

- The quick-guide shortcut now sits under the owner-plan heading with helper wording that presents it as decision support. The four plans and their order remain unchanged; the guide disclosure and behavior remain available below the plans.
- A secondary 租稅來源核對 line now follows the four plan cards and precedes their caveat. Both the new line and existing footer use the generated meta.checked value; the footer remains.
- On screens at or below 700px, the new date line is left aligned so the label and date remain visible. At wider widths it is right aligned.
- The deferred first-viewport compression was not implemented. No policy, tax wording, figures, eligibility rules, guide logic, Messenger, or CX content changed.

### Impeccable approach and validation

- Used the installed Impeccable layout workflow and spatial-hierarchy review. Two independent layout assessments informed the direction. The layout-only detector reported 8 warnings on unrelated existing patterns (3 icon-tile-stack and 5 cramped-padding); neither approved target was flagged. No new broad audit or critique, or prohibited refinement mode, was run.
- node scripts/build.mjs: PASS.
- node scripts/build.mjs --check: PASS.
- node --test: PASS, 20 tests; 0 failures.
- node scripts/performance-budget.mjs: PASS for all three static assets and guards.
- git diff --check: PASS.

### Browser review

- Compared the production baseline with the local build in Chrome at 1440px desktop, 720px intermediate, 390×844, and 320×844 viewports.
- At 1440px, the helper remains subordinate under the heading, all four plans stay in one row, and the source-check date appears below the cards before the caveat. The separate quick-guide panel remains easy to find.
- At 720px, the plans form two columns; the source-check line remains immediately after them and right aligned.
- At 390px and 320px, plan cards stack in reading order, the helper link wraps naturally, and the source-check date is visible and left aligned. Browser measurements showed no horizontal overflow in either candidate viewport; the production baseline also showed no horizontal overflow.
- The local Playwright package is unavailable, so no repository Playwright suite ran. Targeted checks used the Codex Chrome browser viewport and read-only page inspection; no dependency was added. 200% browser zoom was not verified. Physical-device, synthesized-touch, and full keyboard/screen-reader checks were not performed.

## Stage 2 ChatGPT review (2026-09-27)

Result: **CHANGES REQUESTED — one small typography regression**

The Stage 2 structure and scope are otherwise sound:
- quick-guide hierarchy change is appropriately small and preserves behavior
- source-check date uses the existing `{{CHECKED}}` source and keeps the footer
- deferred first-viewport compression was not implemented
- no policy/tax/CX changes were mixed in
- reported build/test/performance checks are green

One correction is required before human visual review:

- Existing project typography rule in `assets/css/guide-v2.css` explicitly states: `body 18px, supporting text at least 16px`.
- Stage 2 added:
  - `.v2-guide-shortcut { font-size: .9375rem; }` → 15px at the default root size
  - `.v2-source-check { font-size: .875rem; }` → 14px
- Both newly added supporting texts therefore fall below the project's established minimum supporting-text size.

Required correction:
- keep the new hierarchy/layout and muted treatment
- remove the shortcut's smaller font override or set it to at least `1rem`
- set the source-check line to at least `1rem`
- preserve visual subordination through color, weight, spacing, alignment, and placement rather than sub-16px text
- rerun build, build --check, Node tests, performance budget, and `git diff --check`
- update STATE/TASK with the corrective commit and validation
- then return status to `STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW`

No other Stage 2 redesign or refinement is requested.

## Stage 2 typography correction (2026-09-27)

- Status: **STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW**
- Corrective implementation commit: 7adadd5a09c153202aec4a6a7b79fdce3a6ca68e.
- In assets/css/guide-v2.css, only the two reviewed font sizes changed: the quick-guide shortcut and source-check line are now 1rem (16px). Their color, weight, spacing, alignment, placement, wording, and behavior remain unchanged.
- index.html was regenerated; its only change is the stylesheet cache hash.
- Browser computed styles confirmed both texts render at 16px with a 16px root size at the default desktop viewport and a 390px viewport.
- Validation: node scripts/build.mjs PASS; node scripts/build.mjs --check PASS; node --test PASS (20/20); node scripts/performance-budget.mjs PASS; git diff --check PASS.
- No additional Impeccable refinement, other UI/UX changes, policy/tax/CX changes, PR, merge, or Pages switch was made.

## Impeccable PoC handoff

- Production `main` remains released and unchanged.
- This PoC is isolated on `ux/impeccable-refinement-poc`.
- Impeccable is already installed in Codex; do not project-local install, run `init`, or run `document`.
- Stage 1 is intentionally read-only for website source. The purpose is to test the quality of Impeccable's UX judgment before approving any refinement.
- The repository STATE/TASK remain the handoff source between agents.

## Impeccable UX audit result (Stage 1, 2026-09-27)

- Status: **AUDIT_COMPLETE_AWAITING_HUMAN_SELECTION**; next step is human selection of any Stage 2 candidate.
- Target: production page `https://taipei-tax-lab.github.io/taipei-rental-tax-guide/`, source target `index.html`, slug `index-html`.
- Technical audit health: **14/20 (Good)**. Critique: **31/40 (Good, 77.5%)**; all 10 Read-mode heuristics applied.
- The TASK file contains the evidence, detector rule-by-rule review, heuristic scores, limitations, and 3 Stage 2 candidates. The detector emitted 107 warnings across 6 rules; source review classified these as a mix of false positives, intentional patterns, and one low-impact partial padding observation—not 107 defects.
- Three medium-priority critique observations: first tax benefit summaries start below the inspected desktop first viewport; four owner plans plus the guide appear as five paths; the existing source-check date is only in the footer. One low-priority observation concerns the guide combining subsidy qualification with subsidy already received.
- Browser evidence includes desktop screenshots and a 390×844 emulated viewport. No physical-device, synthesized-touch, full keyboard/screen-reader, zoom, or network-waterfall validation was performed. Browser DOM/script mutation was unavailable, so no detector overlay was claimed.
- Only `PROJECT_STATE.md` and this TASK are intended for the Stage 1 commit. Website HTML/CSS/JS/content source was not modified. No tests/build were run. No PR was opened and no merge was performed.

## Post-release maintenance release result (2026-09-27)

- PR #10: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/10
- Merge method: Standard Merge Commit; no squash or rebase.
- Release merge commit: `20c915066c87fc4308c89dc601d324803b3bc0ef`.
- GitHub Pages main deployment: run #88, commit `20c915066c87fc4308c89dc601d324803b3bc0ef`, completed successfully: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/36290049347
- Final release-gate validation: build, build `--check`, Node tests (19/19), performance budget, syntax checks, and `git diff --check` passed; generated `index.html` remained unchanged.
- The Playwright browser suites remain unavailable in the local environment; the previously documented limited in-app browser smoke applies. No production browser/CX smoke was required for this maintenance-only release.
- Deferred audit backlog remains unimplemented and recorded in the task file.

## Post-release handoff

- Phase 5A is closed and released.
- Phase 5A task file was finalized as `RELEASED`.
- New maintenance task created: `TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md`.
- Planning commits on `main`:
  - `8a2f8f4818b3c0b6efea9743d5c3c782a50c5d17` — close Phase 5A task
  - `bb9fdc8c1aac0b5a319b95967e2a2be24d3056f0` — add post-release maintenance task
- Project rule remains: agents/conversations may be stateless; repository STATE/TASK are the handoff source.

## Phase 5A final release result (2026-09-27)

- PR #9: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/9
- Merge method: Standard Merge Commit; no squash or rebase.
- Release merge commit: `251884ee3d133d4f2e5723b3d25ccdfc8a1bf642`.
- GitHub Pages publishing source: `main` at `/`.
- Main Pages deployment: run #83, commit `251884ee3d133d4f2e5723b3d25ccdfc8a1bf642`, completed successfully: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/36286716700
- Production CX configuration verified from the deployed page: location `asia-northeast1`, project `serviceagent-1150909`, agent `799426c1-ba69-49dc-85e4-5065985706e2`.
- Production Messenger opened; one non-personal basic question about 公益出租人 was sent and received an agent response.
- Close / reopen passed.
- With Messenger open, desktop 1440×900 and mobile 390×844 both had document/body width equal to viewport width; no horizontal overflow.
- A clean-context production screenshot showed Messenger open and ready for input with no visible error. One accessibility snapshot contained `Something went wrong` in the widget's `.error` node, whose computed opacity was `0` (visually hidden); the single sent question received a response.
- No browser console errors or page errors were recorded in the isolated production smoke context.

## Audit result (2026-09-27)

Codex completed a read-only technical audit of `main` and `phase5a-official-cx`.

### Release readiness at initial audit

- `main`: remains the production baseline.
- `phase5a-official-cx`: **NOT READY** for merge before implementation.
- P0 findings: 0.
- P1 release blockers: 2.

### P1-A — Official CX is not in rebuildable source

Verified behavior:

- candidate generated `index.html` contained the official CX
- candidate `site/messenger.html` still contained the private CX
- `scripts/build.mjs` injects `site/messenger.html` into generated `index.html`
- rebuilding the candidate actually reverted generated output to the private CX

Therefore the official CX switch must be fixed at the source-of-truth level before release.

### P1-B — Windows EOL breaks the release gate

Verified behavior on Windows:

- `core.autocrlf=true`
- repo has no explicit EOL policy
- build hashing normalizes CRLF
- Messenger hash test hashes raw bytes differently
- clean checkout can fail reproducibility/hash checks despite no semantic difference
- build can leave a content-equivalent dirty `index.html`

This must be resolved so Windows and Linux builds/tests agree.

## Implementation result before review (2026-09-27)

- Status: **IMPLEMENTED_AWAITING_REVIEW**
- Implementation commit: `5a16eeb3feb6d53be791f756fcd9df7d9141a46c`
- Work branch: `phase5a-official-cx`
- PR / merge: not opened; `main` unchanged.

### Implementation files (implementation commit)

- `.gitattributes` — explicit LF policy for HTML, CSS, JS, MJS and JSON.
- `scripts/text.mjs` — shared CRLF-to-LF normalization and content hash.
- `scripts/build.mjs` — normalizes text reads and uses the shared hash.
- `tests/build.test.mjs` — LF/CRLF hash test and Messenger source/generated configuration guard.
- `site/messenger.html` — official CX source IDs and preserved Phase 5A title / placeholder.
- `index.html` — rebuilt generated output; Messenger UI cache hash refreshed.
- `docs/dialogflow-cx-operation-guide.md` — distinguishes production/private and candidate/official CX, source and build process.

### State tracking files

- `PROJECT_STATE.md` and `TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE.md` — status and verification record for review.

### Release-gate validation

- Windows: clean detached checkout at the implementation commit; pre-build status clean.
- Build: `node scripts/build.mjs` PASS; `node scripts/build.mjs --check` PASS.
- Node tests: `node --test` — 19 passed, 0 failed.
- Performance budget: `node scripts/performance-budget.mjs` PASS.
- `git diff --check` PASS.
- npm is not available on this machine, so equivalent repository scripts were invoked directly with Node v24.19.0.
- EOL: clean checkout reports `i/lf w/lf` for `index.html`, HTML source, build/hash scripts and test; after build the generated `index.html` has no dirty diff. LF and CRLF produce the same normalized content hash. Linux was not available for an OS-level run.
- CX source/generated: source and rebuilt output both use location `asia-northeast1`, project `serviceagent-1150909`, agent `799426c1-ba69-49dc-85e4-5065985706e2`. Private CX IDs are absent from generated output; regression guard passes.
- Chrome smoke: candidate page loaded with no horizontal overflow at 1440×900 and 390×844. Messenger opened, closed and reopened. No console warnings/errors were observed. The widget displayed a generic `Something went wrong` message immediately on open; no query was entered or sent. No `pageerror` event listener was available. Cloud runtime behavior remains for review; no CX/GCP setting was changed.

The original P1 findings above describe the verified pre-fix audit state. The implementation above addresses their source/build and Windows EOL causes. At this handoff point, the candidate was awaiting review and had not been released.

## Remaining audit findings / maintenance backlog

The stale tenant-count assertion/documentation and README release-state mismatch were corrected in the post-release maintenance branch. Remaining audit items are classified in `TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md`; they were not implemented in that task. General performance or accessibility refactors remain outside its scope.

## Source-of-truth rules

1. `main` is the current production baseline.
2. `phase5a-official-cx` was the Phase 5A candidate and is now merged into production `main`; retain the historical branch.
3. `site/messenger.html` is the Messenger source fragment used by the build.
4. `index.html` is generated output and must not be hand-edited as the primary fix.
5. A candidate is not release-ready unless rebuilding reproduces the intended official CX configuration.
6. GitHub repo state outranks an individual agent/conversation.
7. The active task is listed at the top of this file; post-release maintenance is historical reference.

## Post-release maintenance review (2026-09-27)

ChatGPT reviewed the implementation on GitHub.

Result: **PASS**

Verified:
- implementation commit `17a12dd5725dc17abcc92ece06fbf340fe8ec0e1`
- branch `maintenance/2026-09-27-post-release` is based on latest planning `main` and is not behind
- changed implementation files are limited to the approved A/B/C maintenance scope
- tenant count check now derives the expected count from `site/content.json`
- README no longer claims the refinement branch is unpublished
- stale Messenger regression descriptions were corrected
- remaining audit findings were classified only; no deferred architecture/performance/CX work was implemented
- reported validation: build PASS, build --check PASS, Node tests 19/19 PASS, performance budget PASS, syntax checks PASS, `git diff --check` PASS
- generated `index.html` remained unchanged

Browser limitation remains documented: Playwright is not installed in the local Codex environment, so the scripted browser suites were not executed. The limited in-app browser smoke is sufficient for this maintenance scope because no production HTML/CSS/JS output or CX configuration changed.

### Release protocol for current maintenance task

1. Sync latest refs and confirm the maintenance branch is not behind `main`.
2. Re-run build, build --check, full Node tests, performance budget, syntax checks, and `git diff --check`.
3. Open PR:
   - base: `main`
   - head: `maintenance/2026-09-27-post-release`
4. Use **Standard Merge Commit** only.
   - no squash
   - no rebase
5. Wait for GitHub Pages deployment from `main` to complete successfully.
6. Update both:
   - `PROJECT_STATE.md`
   - `TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md`
7. Record:
   - status → `RELEASED`
   - PR number / URL
   - merge commit SHA
   - Pages deployment result
   - final validation results
8. Commit and push the final state/task update to `main`.
9. Preserve historical branches.

Do not implement deferred backlog items in this release.

## Review approval and runtime smoke (2026-09-27)

### ChatGPT GitHub review

Result: **PASS**

Verified directly on GitHub:
- implementation commit `5a16eeb3feb6d53be791f756fcd9df7d9141a46c`
- state commit `f47095fb12c53ce91bf77d8241a7bc09f16383b2`
- candidate source and generated output both use the official CX configuration
- private CX IDs are absent from the candidate Messenger source/output
- source/generated CX consistency guard is present
- CRLF/LF normalization and explicit LF policy are implemented
- no unrelated P2/P3 refactor was mixed into the release-gate implementation
- branch remains based on current `main` and was not behind at review time

### GitHub Pages candidate deployment

- GitHub Pages was switched to `phase5a-official-cx`.
- Deployment of candidate HEAD `f47095fb12c53ce91bf77d8241a7bc09f16383b2` completed successfully.
- The allowed Dialogflow Messenger domain is `taipei-tax-lab.github.io`.
- The user manually verified the live GitHub Pages candidate:
  - Messenger opens normally
  - no `Something went wrong` error on the allowed domain
  - official CX interaction works
  - no blocking issue observed

The localhost-only `Something went wrong` observed during Codex smoke testing is therefore treated as expected behavior under the configured domain restriction, not a release blocker.

## Release protocol for Phase 5A

This protocol was completed on 2026-09-27; the results are recorded in **Phase 5A final release result** above.

1. Fetch latest refs and confirm `phase5a-official-cx` is not behind `main`.
2. Re-run the release-gate checks:
   - build
   - build --check
   - full Node tests
   - performance budget
   - `git diff --check`
3. Open a PR:
   - base: `main`
   - head: `phase5a-official-cx`
4. Use **Standard Merge Commit** only.
   - no squash
   - no rebase
5. After merge, switch GitHub Pages back to `main`.
6. Wait for the Pages deployment from `main` to complete.
7. Perform a final production smoke test on the live Pages site:
   - confirm official CX is still active
   - Messenger opens
   - one basic query can be sent and answered
   - close / reopen works
   - no horizontal overflow at desktop/mobile
   - no visible `Something went wrong`
8. Update `PROJECT_STATE.md` on `main`:
   - Status → `RELEASED`
   - PR number / URL
   - release merge commit SHA
   - Pages deployment result
   - production smoke test result
9. Commit and push the final state update to `main`.
10. Preserve historical branches.

Do not include deferred P2/P3 cleanup in this release.

## Impeccable final revision — pre-PR gate (2026-09-27)

- Status: **REVIEW_APPROVED_READY_FOR_PR**
- Candidate implementation commit: 7845717df16f4c78ab830a08cc122910fa1d42bb.
- The quick-guide shortcut remains under the owner-plan heading with the approved wording and 16px minimum size.
- Removed the duplicated plan-area source-check line and its desktop/mobile CSS; the existing footer remains the sole display of meta.checked.
- Regenerated index.html; revised tests/build.test.mjs to protect the helper hierarchy and footer-only source date.
- Compared with current main, the only production-visible change is the approved quick-guide hierarchy. No other UX/UI, policy, tax, eligibility, Messenger, or CX content changed.
- Validation: build PASS; build --check PASS; full Node tests 20/20 PASS; performance budget PASS; git diff --check PASS.
- Browser smoke: desktop Chrome showed the owner heading, shortcut, and four plan cards; 390×844 emulated Chrome reported documentWidth=390, bodyWidth=390, no horizontal overflow, no plan-area date, and the footer source date present.
- Impeccable layout detector ran once. It returned seven existing warnings (three icon-tile-stack, four cramped-padding); none identified the changed helper. It could not resolve the generated page's relative CSS paths from its target context, so color/custom-property checks were incomplete. No unrelated changes were made.
- Browser limits: Playwright is unavailable; no physical-device, touch, complete keyboard/screen-reader, or 200% zoom checks were run.

## Impeccable UX release result (2026-09-27)

- Status: **RELEASED**.
- PR #11: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/11 (base `main`, head `ux/impeccable-refinement-poc`).
- Merge method: **Standard Merge Commit**; no squash or rebase. Merge SHA: `3bac3930aee9643a35d7e41ac375a581ab0b68b9`.
- GitHub Pages deployment: run #92 for `main` / merge SHA `3bac3930aee9643a35d7e41ac375a581ab0b68b9`, completed successfully: https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/36307128126.
- Final validation: normal build PASS; build `--check` PASS; full Node tests 20/20 PASS; performance budget PASS; working-tree and branch `git diff --check` PASS.
- Production desktop smoke: 1440×900, document/body widths 1425, no horizontal overflow; approved helper and four plan cards present, source date only in footer.
- Production mobile smoke: 390×844, document/body widths 390, no horizontal overflow; approved helper and four plan cards present, no plan-area source date, footer source date present.
- The release preserves the historical `ux/impeccable-refinement-poc` branch. GitHub Pages remains deployed from `main`.
