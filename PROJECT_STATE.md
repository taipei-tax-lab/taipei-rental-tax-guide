# PROJECT_STATE

Last updated: 2026-09-24

## Current production baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production application release baseline: `76c164b2585545c455bf5e66a06fb8f4d66c746c` (PR #8 merge)
- GitHub Pages: `https://taipei-tax-lab.github.io/taipei-rental-tax-guide/`
- Production deployment: Active and verified via automated Playwright smoke tests.

## Active task

- Status: **RELEASED**
- Task: 財產稅科 2026-09-22 最新 PDF 修正稿內容更新
- Source review date: 2026-09-24
- Release date: 2026-09-24
- PR: [#8](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/8) (`fix/2026-09-24-property-tax-content` → `main`)
- Merge method: Standard Merge Commit (`76c164b2585545c455bf5e66a06fb8f4d66c746c`)
- Implementation commit SHA: `24c08736a13057df5b04b7f5c8490f7e366a88d5`
- GitHub Pages build status: `built` (Run 35949816007 completed successfully)
- Production smoke test: **PASS** (Chrome headless Playwright on live GitHub Pages: 1440x900 and 390x844 viewports verified, all approved text present, removed 114租金標準 link absent, 臺北市住都中心 link verified, overflow = 0, pageerror = 0, console.error = 0)
- Changed files:
  - `site/content.json` (方案文字、適用條件、連結文字與租稅摘要更新；新增臺北市住都中心資源)
  - `scripts/build.mjs` (更新常見問題與房客服務窗口文字、比較表稅目備註取用邏輯、分組索引)
  - `index.html` (依 source 自動建置之產出)
- Historical branches: Preserved (`fix/2026-09-24-property-tax-content` preserved)
- Unresolved ambiguity: None

## Source-of-truth rules

1. The approved change list in `TASK_2026-09-24_PROPERTY_TAX_REVIEW.md` is authoritative for this round.
2. The list is based on the uploaded PDF `督導網頁-新1150922.pdf` plus two explicit user corrections made after reviewing the PDF:
   - Page 2 FAQ 「包租與代管，有什麼不同？」：`房東簽訂包租約後` 刪除「包」→ `房東簽訂租約後`。
   - Page 8 「適合誰？」：`並能簽訂一年以上住宅使用租約` 刪除「能」→ `並簽訂一年以上住宅使用租約`。
3. Do **not** silently reconcile or normalize wording that the task does not ask to change.
4. Preserve deliberate page/context differences called out in the task file.
5. Do not use external policy research to rewrite the approved wording in this round.

## Repository / implementation rules

- Content source of truth is primarily `site/content.json`; inspect the repository for any FAQ/resource text that lives elsewhere.
- `index.html` is generated. Do **not** hand-edit it as the source of truth. Update source files, then rebuild.
- Do not modify Dialogflow CX / cloud configuration.
- Do not redesign UI, responsive layout, images, favicon, Messenger, WebP/performance behavior, or CSS unless an unavoidable rendering regression is caused by the approved text changes.
- Keep scope to the approved text/link updates and required tests.

## Completion protocol for AntiGravity 2.0

1. Fetch/pull latest `main`.
2. Read this file and `TASK_2026-09-24_PROPERTY_TAX_REVIEW.md` before editing.
3. Create/use branch `fix/2026-09-24-property-tax-content`.
4. Implement every approved item and no unrelated content changes.
5. Run build/tests and targeted browser/content checks.
6. Update this file on the working branch:
   - status → `IMPLEMENTED_AWAITING_REVIEW`
   - implementation branch and final commit SHA
   - changed files
   - test results
   - any unresolved ambiguity (expected: none)
7. Commit and push the branch.
8. **Do not open a PR and do not merge to main.** Stop and return the result to ChatGPT for review.


## Release protocol

This branch has passed implementation review and is approved to proceed to release.

1. Confirm branch `fix/2026-09-24-property-tax-content` is still based on the latest `main` and is not behind.
2. Re-run the existing build/tests before release.
3. Open a PR:
   - Base: `main`
   - Head: `fix/2026-09-24-property-tax-content`
   - Use a concise title describing the 財產稅科 latest content corrections.
4. Merge with **Standard Merge Commit** only.
   - Do not squash.
   - Do not rebase.
5. Wait for GitHub Pages deployment to complete.
6. Perform a production smoke test on the live Pages site:
   - Verify the approved wording changes are visible in the correct sections.
   - Verify the removed 114年度租金標準 link is gone.
   - Verify the new 臺北市住宅及都市更新中心 link exists and opens the correct URL.
   - Verify Desktop 1440 and Mobile 390 have no text clipping or horizontal overflow.
   - Confirm `pageerror = 0` and `console.error = 0`.
7. Update `PROJECT_STATE.md` on `main` after release:
   - Status → `RELEASED`
   - PR number / URL
   - Release merge commit SHA
   - GitHub Pages build status
   - Production smoke test result
8. Do not delete historical branches.
