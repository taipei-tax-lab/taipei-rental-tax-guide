# TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE

## Goal

修正 `phase5a-official-cx` 目前兩個 P1 release blockers，使「公務 CX 候選版」可被可靠重建、可在 Windows / Linux 通過一致的 release gate，之後再交由 ChatGPT Review。

本輪是 **Phase 5A release-gate 修復**，不是 UI 重構，也不是全面技術債清理。

---

## 1. Baseline

### Production
- Branch: `main`
- Current main baseline at audit time: `ab1cb35b53763a6e6341b2041125894defaf8b27`
- Production release merge: `76c164b2585545c455bf5e66a06fb8f4d66c746c` (PR #8)

### Candidate
- Branch: `phase5a-official-cx`
- Candidate application baseline before this planning task: `e1d85dfeb87a81596195220164b4e17cc0bdaf98`
- At audit time: ahead of main by 4 commits, behind by 0.

### Official CX target
- location: `asia-northeast1`
- project-id: `serviceagent-1150909`
- agent-id: `799426c1-ba69-49dc-85e4-5065985706e2`

### Current production/private CX
- project-id: `aerial-day-496714-v6`
- agent-id: `9fb1cac6-62cd-40e6-8b13-eecf651f1f72`

---

## 2. Audit findings to fix

### P1-A — Official CX exists only in generated output

Current candidate behavior was verified by Codex:

- `phase5a-official-cx/index.html` before rebuild contains the official CX IDs.
- `phase5a-official-cx/site/messenger.html` still contains the private CX IDs.
- `scripts/build.mjs` injects `site/messenger.html` into generated `index.html`.
- Rebuilding the candidate actually changes generated output back to the private CX.

This is a release blocker.

### P1-B — Windows EOL causes false build/test failure

Verified audit behavior:

- Windows has `core.autocrlf=true`.
- Repository currently has no explicit EOL policy.
- Build hashing normalizes CRLF before hashing.
- `tests/build.test.mjs` hashes Messenger-related source bytes differently.
- A clean Windows checkout can fail `--check` / hash assertions even when semantic content is unchanged.
- Build can also mark generated `index.html` dirty only because of line-ending conversion.

This is a cross-platform release-gate defect.

---

## 3. Required implementation

### 3.1 Put official CX in the real source of truth

Update the source that actually drives builds:

`site/messenger.html`

The rebuilt output must use:

```text
location = asia-northeast1
project-id = serviceagent-1150909
agent-id = 799426c1-ba69-49dc-85e4-5065985706e2
```

Preserve the deliberate Phase 5A Messenger UI choices already present on the candidate unless a source/build consistency fix requires a minimal related change.

Do **not** modify Dialogflow CX / GCP itself.

### 3.2 Rebuild generated output

After source correction:

- run the normal build
- regenerate `index.html`
- verify generated `index.html` still contains the official CX IDs
- verify private CX IDs are absent from the candidate generated Messenger block

Do not hand-edit `index.html` as the primary fix.

### 3.3 Add a source/generated CX consistency guard

Add a test or equivalent deterministic assertion that fails if:

- Messenger source points to one CX project/agent
- generated `index.html` points to another

Prefer testing the actual source/build relationship rather than duplicating fragile magic strings in multiple places.

The guard must specifically prevent recurrence of the Phase 5A failure mode.

### 3.4 Fix cross-platform EOL behavior

Implement a minimal, explicit cross-platform solution so Windows and Linux clean checkouts agree.

The result must address both:

1. generated-output reproducibility / `--check`
2. Messenger-related content hash test

Preferred characteristics:

- repository EOL policy is explicit where appropriate
- build and tests use the same normalization semantics
- no semantic content changes caused only by EOL
- do not hide real generated-output differences

Do not solve this by weakening/removing meaningful tests.

### 3.5 Update only CX operational documentation that is now wrong

The audit found:

`docs/dialogflow-cx-operation-guide.md`

still documents only the private CX while this candidate is intentionally switching to the official CX.

Update it enough to clearly distinguish:

- current production/main baseline
- Phase 5A candidate / intended official CX
- source-of-truth location for Messenger configuration
- build requirement before release

Do not rewrite unrelated CX planning documents.

---

## 4. Explicitly out of scope

Do **not** fix these P2/P3 items in this task:

- tenant count stale assertion / documentation
- tenant grouping by array index
- FAQ hard-coding in `build.mjs`
- `resources.slice(3)` architecture
- assistant idle image initial load
- titlebar / shadow-root workaround redesign
- README general modernization
- `site/content.json` version / checked metadata
- SEO additions
- CSP / hosting hardening
- URL validation expansion
- general performance optimization
- general accessibility refactor
- Messenger visual redesign
- Dialogflow CX / GCP configuration changes

You may mention them in the final report, but do not implement them.

---

## 5. Validation

### 5.1 Source / generated consistency

After implementation, verify on the candidate:

- `site/messenger.html` contains official CX
- built `index.html` contains official CX
- rebuilding does not switch back to private CX
- source/generated consistency test passes

### 5.2 Build and tests

Run at minimum:

```text
build
build --check / equivalent reproducibility check
all Node tests
performance budget
git diff --check
```

Use the repository's available command runner. Do not commit a new package lock merely to run scripts.

### 5.3 Windows-specific release gate

On this Windows machine verify:

- clean checkout / clean candidate state before build
- build succeeds
- reproducibility check succeeds
- all tests pass
- no hash failure caused by CRLF
- build does not leave a content-equivalent dirty `index.html`

If line endings still produce dirty state, task is not complete.

### 5.4 Browser regression

If existing Playwright tooling is available without adding unnecessary repo dependencies, run the existing browser regression suite.

If Playwright is not available:

- do not install large/unnecessary dependencies just to satisfy this task
- perform targeted Chrome smoke checks using available tooling
- clearly report the limitation

At minimum verify:

- Messenger opens
- close / reopen works
- no horizontal overflow at 1440×900 and 390×844
- no page-level console error / pageerror if observable
- candidate generated page still points to official CX

Do not send repeated/live test prompts to the official CX.

---

## 6. Git workflow

Continue on the existing branch:

`phase5a-official-cx`

Do not create another feature branch unless the branch is unexpectedly unsafe or divergent; if so, stop and report first.

Before editing:

1. `git fetch origin`
2. confirm working tree is clean
3. sync local candidate to `origin/phase5a-official-cx`
4. confirm candidate is not behind `main`

After implementation:

1. update `PROJECT_STATE.md`
2. set task status to `IMPLEMENTED_AWAITING_REVIEW`
3. record:
   - implementation commit SHA(s)
   - changed files
   - build/test results
   - Windows EOL verification
   - CX source/generated verification
   - browser verification / limitation
4. commit
5. push `phase5a-official-cx`
6. stop

**Do not open PR.**
**Do not merge main.**
**Do not delete branches.**

---

## 7. Completion criteria

This task is complete only if all of the following are true:

- official CX configuration lives in rebuildable source
- rebuilt `index.html` remains official CX
- a regression guard prevents source/generated CX divergence
- Windows clean checkout/build/test release gate is green
- no EOL-only dirty generated output remains
- operational CX documentation no longer points maintainers only to the private CX
- no unrelated P2/P3 refactor is mixed in
- branch is pushed and state is updated to `IMPLEMENTED_AWAITING_REVIEW`
- no PR / merge has occurred
