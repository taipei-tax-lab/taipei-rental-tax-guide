# TASK 2026-10-21 — Remove Decorative External-Link Arrows

Status: **PLANNED — AWAITING CODEX IMPLEMENTATION / NOT RELEASED**

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
