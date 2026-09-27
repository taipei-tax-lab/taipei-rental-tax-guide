# PROJECT_STATE

Last updated: 2026-09-27

## Production baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production branch: `main`
- Previous production baseline before Phase 5A: `ab1cb35b53763a6e6341b2041125894defaf8b27`
- Previous production release merge: `251884ee3d133d4f2e5723b3d25ccdfc8a1bf642` (PR #9)
- Latest production release merge: `20c915066c87fc4308c89dc601d324803b3bc0ef` (PR #10)
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

## Active task

- Status: **READY_FOR_AUDIT**
- Task: Impeccable UX refinement PoC — Stage 1 read-only audit + critique
- Task file: `TASK_2026-09-27_IMPECCABLE_UX_AUDIT.md`
- Execution agent: local Codex Desktop with Impeccable already installed
- Baseline: production `main` at `9d4865963c736ce2428a8cfbd95c3d1f40022623`
- Work branch: `ux/impeccable-refinement-poc`
- Objective: evaluate whether Impeccable can identify small, evidence-based UX improvements without redesigning the site
- Allowed in Stage 1: Impeccable `audit` + `critique`, repository/source inspection, local preview if useful, STATE/TASK documentation updates
- Not allowed in Stage 1: website source changes, UI redesign, policy wording changes, CX/GCP changes, PR, merge
- Completion: update STATE and TASK to `AUDIT_COMPLETE_AWAITING_HUMAN_SELECTION`, record findings and at most 3 Stage 2 candidates, commit/push branch, then stop

## Impeccable PoC handoff

- Production `main` remains released and unchanged.
- This PoC is isolated on `ux/impeccable-refinement-poc`.
- Impeccable is already installed in Codex; do not project-local install, run `init`, or run `document`.
- Stage 1 is intentionally read-only for website source. The purpose is to test the quality of Impeccable's UX judgment before approving any refinement.
- The repository STATE/TASK remain the handoff source between agents.

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
7. For the active task, follow `TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md`.

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
