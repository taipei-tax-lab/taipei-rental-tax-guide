# TASK_2026-09-27_IMPECCABLE_UX_AUDIT

Status: **READY_FOR_AUDIT**

## Goal

用已安裝於 Codex 的 Impeccable，對目前正式網站做一輪 **read-only UX audit + critique**，判斷它是否能找出真正值得改善的使用者體驗問題。

本輪只產生分析與候選改善清單，**不修改網站 UI / CSS / JS / HTML source，不做 redesign，不開 PR、不 merge**。

## Baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production branch: `main`
- Baseline SHA: `9d4865963c736ce2428a8cfbd95c3d1f40022623`
- Latest release: PR #10 / release merge `20c915066c87fc4308c89dc601d324803b3bc0ef`
- Production Messenger: official/public-service CX
- PoC branch: `ux/impeccable-refinement-poc`

## Product constraints

Treat these as hard constraints:

> Government public-service information site.  
> Preserve existing Taipei Tax visual identity.  
> Optimize for trust, comprehension, accessibility and task completion.  
> No visual redesign unless explicitly requested.  
> Policy content, legal meaning, tax figures, eligibility rules and approved wording must not be altered without human review.  
> Preserve existing functional behavior unless a change is explicitly approved.

The quality order for this site is:

**可信 → 清楚 → 找得到 → 看得懂 → 做得到 → 最後才是漂亮**

Do not optimize for novelty, visual boldness, animation, personality, or design-award aesthetics.

## Required work — Stage 1 only

Use Impeccable primarily for:

- `audit`
- `critique`

Do **not** use implementation-oriented commands in this stage, including:

- `layout`
- `clarify`
- `adapt`
- `polish`
- `bolder`
- `overdrive`
- `delight`
- `animate`
- `colorize`
- `craft`

Do not run Impeccable `init` or `document` for this PoC. The skill is already installed in Codex; do not project-local install it.

If Impeccable creates temporary local critique/snapshot files automatically, do not commit them. Extract the useful findings into this TASK and clean up temporary artifacts before finishing.

## What to inspect

Review the current production experience across:

- first-screen information hierarchy
- owner / tenant / assistant / rent-standard entry relationship
- four-plan card hierarchy and information density
- plan detail progressive disclosure
- comparison page
- quick guidance flow
- tenant service grouping
- wording consistency and first-time-user comprehension
- repeated notices/disclaimers
- desktop / tablet / mobile reading flow
- touch targets, keyboard/focus behavior, zoom and long-text resilience
- Messenger entry and surrounding UI
- task completion clarity: “我下一步要做什麼？”

Pay special attention to, but do not assume there is a problem with:

1. whether the rent-standard entry competes too strongly with the three primary audience/task entries
2. whether four-plan completeness creates avoidable first-view density
3. whether labels/help text use consistent citizen-facing language
4. whether repeated caution/disclaimer text creates unnecessary cognitive load
5. whether mobile/touch adaptation has friction that breakpoint-only testing may miss

## Output requirements

Record findings in this TASK under a new **Audit / Critique Findings** section.

Separate:

### A. Audit findings
More objective implementation/accessibility/responsive/usability issues.

### B. Critique findings
More interpretive UX / hierarchy / cognitive-load observations.

For each finding include:

- location / component
- observed issue
- user impact
- evidence or reason
- severity: `HIGH` / `MEDIUM` / `LOW`
- confidence: `HIGH` / `MEDIUM` / `LOW`
- smallest plausible improvement direction
- risk / trade-off
- whether it should be considered for Stage 2: `YES` / `MAYBE` / `NO`

Avoid generic design advice. A useful finding must be tied to this site and explain how a real taxpayer could hesitate, misunderstand, miss an entry, or take longer to complete a task.

## Stage 2 shortlist

At the end, propose **at most 3** candidate improvements for human review.

The shortlist must favor:
- low implementation risk
- clear user benefit
- preservation of existing visual identity and behavior
- measurable before/after comparison

Do not implement them.

For each shortlisted item, suggest which Impeccable refinement command would be appropriate later:
- `layout`
- `clarify`
- `adapt`
- `polish`

## Validation / evidence

Use the current source and existing project documentation. Start the site locally if useful.

Reuse existing checks where available, but do not add dependencies just for this audit.

If browser tooling is unavailable, record the limitation instead of installing large dependencies.

## Git workflow

1. Sync and work only on `ux/impeccable-refinement-poc`.
2. Read `PROJECT_STATE.md`, this TASK, README, V2 development docs, and relevant source.
3. Perform Impeccable audit + critique.
4. Do not modify production website source files.
5. Update:
   - `PROJECT_STATE.md`
   - this TASK
6. Record:
   - status → `AUDIT_COMPLETE_AWAITING_HUMAN_SELECTION`
   - commands / approach used
   - findings
   - Stage 2 shortlist (max 3)
   - browser/tool limitations
   - confirmation that website source was not modified
7. Commit and push the branch.
8. Stop.

**Do not open PR.**  
**Do not merge main.**  
**Do not implement Stage 2 changes.**

## Completion criteria

- Impeccable audit + critique completed
- findings are site-specific and evidence-based
- audit vs critique are clearly separated
- no more than 3 Stage 2 candidates proposed
- website source remains unchanged
- only STATE / TASK (and no temporary Impeccable artifacts) are committed for this stage
- branch pushed
- status is `AUDIT_COMPLETE_AWAITING_HUMAN_SELECTION`
