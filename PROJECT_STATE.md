# PROJECT_STATE

Last updated: 2026-09-27

## Production baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production branch: `main`
- Current production main baseline at audit time: `ab1cb35b53763a6e6341b2041125894defaf8b27`
- Production release merge: `76c164b2585545c455bf5e66a06fb8f4d66c746c` (PR #8)
- GitHub Pages: `https://taipei-tax-lab.github.io/taipei-rental-tax-guide/`
- Production status: **RELEASED**
- Production Messenger currently uses the older private CX configuration.

## Current candidate

- Branch: `phase5a-official-cx`
- Candidate application baseline before the 2026-09-27 planning docs: `e1d85dfeb87a81596195220164b4e17cc0bdaf98`
- Candidate purpose: switch the website Messenger to the official/public-service CX and simplify the Messenger chrome / assistant presentation.
- Official CX target:
  - location: `asia-northeast1`
  - project-id: `serviceagent-1150909`
  - agent-id: `799426c1-ba69-49dc-85e4-5065985706e2`

## Active task

- Status: **READY_FOR_IMPLEMENTATION**
- Task: Phase 5A 公務 CX source 一致性與跨平台 release gate
- Task file: `TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE.md`
- Execution agent: local Codex Desktop
- Work branch: `phase5a-official-cx`
- Review gate: ChatGPT review after implementation
- PR / merge: **not allowed yet**

## Audit result (2026-09-27)

Codex completed a read-only technical audit of `main` and `phase5a-official-cx`.

### Release readiness

- `main`: remains the production baseline.
- `phase5a-official-cx`: **NOT READY** for merge.
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

## Known audit findings intentionally deferred

These are real findings, but are **out of scope for the active Phase 5A release-gate task**:

- stale tenant-count assertion/documentation
- tenant grouping by array index
- FAQ hard-coded in `scripts/build.mjs`
- `resources.slice(3)` maintenance fragility
- assistant idle image initial request
- Messenger titlebar/shadow-root workaround robustness
- README general release-state modernization
- content metadata date/version cleanup
- broader SEO/CSP/URL-validation improvements
- general performance or accessibility refactors

Do not mix these into the current fix unless explicitly approved later.

## Source-of-truth rules

1. `main` is the current production baseline.
2. `phase5a-official-cx` is the next candidate, not production.
3. `site/messenger.html` is the Messenger source fragment used by the build.
4. `index.html` is generated output and must not be hand-edited as the primary fix.
5. A candidate is not release-ready unless rebuilding reproduces the intended official CX configuration.
6. GitHub repo state outranks an individual agent/conversation.
7. For the active task, follow `TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE.md`.

## Implementation constraints

- Do not modify Dialogflow CX / GCP cloud configuration.
- Do not redesign the Messenger UI.
- Do not refactor unrelated P2/P3 findings.
- Do not open a PR or merge `main` during implementation.
- Preserve historical branches.
- Keep changes minimal and directly tied to the two P1 blockers plus the required CX operational documentation.

## Completion protocol

Codex should:

1. fetch latest refs and sync local `phase5a-official-cx`
2. read this file and `TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE.md`
3. implement only the approved scope
4. run cross-platform-oriented build/test validation on Windows
5. verify rebuilt output stays on the official CX
6. update this file:
   - Status → `IMPLEMENTED_AWAITING_REVIEW`
   - implementation commit SHA(s)
   - changed files
   - all test/build results
   - EOL verification
   - CX source/generated verification
   - browser verification or limitation
7. commit and push `phase5a-official-cx`
8. stop and return the result for ChatGPT review

Do not open PR. Do not merge main.
