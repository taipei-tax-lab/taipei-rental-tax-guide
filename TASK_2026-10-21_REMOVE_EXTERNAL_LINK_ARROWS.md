# TASK 2026-10-21 — Remove Decorative External-Link Arrows

Status: **IMPLEMENTED_AWAITING_REVIEW — NOT RELEASED**

Planning owner: ChatGPT  
Implementation owner: Codex Cloud  
Review/release owner: ChatGPT  
Target repo: `taipei-tax-lab/taipei-rental-tax-guide`  
Implementation: new branch from latest `main` (suggested `fix/remove-external-link-arrows`). Do not implement on this documentation branch.

## Goal

Remove the small northeast-pointing **↗** decoration after external hyperlinks throughout the Rental Tax Guide site. Keep recognizable, readable underlined hyperlinks and unchanged destinations. This is a tiny visual cleanup, not an interaction or information-architecture redesign.

## Confirmed source

- `scripts/build.mjs` common `link(item, cls)` renderer currently appends `<span aria-hidden="true">↗</span>`.
- Generated `index.html` includes these decorations in the resources section, plan-related official links, tenant links, and other generated external links.
- `index.html` is generated output: change the actual source and rebuild; **never manually patch generated HTML as the sole fix**.
- Audit other **rendered site-owned** external-link `↗` decorations outside this helper as needed; avoid sweeping replacements that modify unrelated directional indicators or user-facing tax content.

## Frozen implementation scope

1. Remove decorative northeast arrow `↗` after **external hyperlinks** across the site, including all affected generated links.
2. Preserve link labels, URLs, targets, `rel="noopener noreferrer"`, hover and focus states, underline, palette, and responsive layout.
3. Preserve the screen-reader-only `（另開新視窗）` notice for links opening in a new tab; do not remove accessible context just because the visual icon is removed.
4. Preserve meaningful navigation `→` arrows, plus/expand/collapse icons, Messenger indicators, and other non-external-link functional icons.
5. Do not change `site/content.json` business information, eligibility, tax/legal numbers, source dates, CX/GCP configuration, GA4 event contracts, performance strategy, or site navigation.
6. No replacement icon, animation, tooltip, hover-only arrow or new CSS design. Make the smallest effective source edit.
7. Update targeted deterministic tests to assert the new output (external-link decorations absent, sr-only new-window label preserved) and retain existing regressions. Generated `index.html` should be committed as required by Pages.

## Validation gates

- Search source **and generated rendered markup** for external-link arrows; distinguish decorative `↗` from intentional `→` navigation.
- `npm run build`
- `node scripts/build.mjs --check` (or repo's equivalent build check)
- `npm test`
- Existing performance budget check if not included in `npm test`
- `git diff --check`
- Prefer visual spot-check for desktop + mobile of the pictured "官方申辦與聯絡方式" and at least one plan/tenant link group, where browser support exists. Report any unavailable checks honestly.

## Codex handoff

1. Read `README.md`, `PROJECT_STATE.md`, this TASK and applicable repo instructions.
2. Sync latest `main`; create implementation work branch.
3. Implement only this task, test, build, commit, and push work branch.
4. Update `PROJECT_STATE.md` and this TASK on the implementation branch to reflect **implemented, awaiting review**, including exact results; **do not mark released**.
5. **Do not open a PR, merge to main, or deploy**; stop for ChatGPT review.
6. Report branch, SHA, changed files, key markup proof, test results and any limitations.

## Acceptance criteria

A new build contains no decorative northeast-arrow suffix on website external hyperlinks. Labels, links, accessibility notices, internal navigation, Messenger, tracking and site functions remain unchanged. Formal release requires separate review, approval and successful Pages deployment.

## Implementation handoff (2026-10-21)

- Work branch: `fix/remove-external-link-arrows`, created from latest `main` at `912059fc72ec03518f4c452b79897c955158837a` (confirmed through GitHub and subsequent Git fetch).
- Carried this TASK and the pending-task section of `PROJECT_STATE.md` from `docs/remove-external-link-arrows-20261021` into the implementation branch; historical state records remain intact.
- Minimal source change: remove only the decorative span and its preceding space from the common `link(item, cls)` renderer in `scripts/build.mjs`; regenerate `index.html`.
- Exact output comparison against the baseline confirms that removing the 42 occurrences of ` <span aria-hidden="true">↗</span>` reproduces the entire new HTML byte for byte. All 42 sr-only new-window notices remain. Rendered HTML contains zero `↗` glyphs. Labels, URLs, attributes, functional icons and all other markup are unchanged; no CSS, content data, tracking or Messenger source changed.
- Added a deterministic external-anchor regression in `tests/build.test.mjs`: no literal/entity northeast arrows, preserved `_blank`, `noopener noreferrer`, sr-only/aria-label new-window notices, and retained navigation/expand glyphs. Confirmed it fails on the old generated output and passes after rebuilding.
- Validation: `npm run build` PASS; `node scripts/build.mjs --check` PASS; `npm test` **45/45 PASS** (including the existing performance-budget test); standalone `node scripts/performance-budget.mjs` PASS; `git diff --check` PASS.
- Environment: the initial sandboxed test attempt hit Node subprocess `EPERM`; the unchanged npm test command passed under the approved execution mode. Git fetch likewise succeeded in that mode after the sandboxed proxy connection failed.
- Chromium desktop 1440×900 and mobile 390×900: visually inspected screenshots of “官方申辦與聯絡方式”, the public-landlord official source links, and the expanded tenant subsidy group. All six checks confirmed no decorative arrows, underlined links, visible keyboard focus, preserved targets/rel/sr-only notices, and no horizontal overflow.
- Browser check used local preview and blocked third-party requests; no external destination, live CX response, physical device or screen-reader session was tested.
- Handoff scope: commit and push this work branch only. No PR, merge or deployment; awaiting review, not released.
