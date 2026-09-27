# TASK_2026-09-27_IMPECCABLE_UX_AUDIT

Status: **STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW**

Stage 1 audit is complete; Stage 2 implementation and review evidence are recorded below.

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

## Audit / Critique Findings

### Run provenance

- **Target:** production page `https://taipei-tax-lab.github.io/taipei-rental-tax-guide/`; source target `index.html`; resolved critique slug `index-html`.
- **Branch / source baseline:** `ux/impeccable-refinement-poc`; `index.html`, `site/`, and `assets/` match `origin/main` at `9d4865963c736ce2428a8cfbd95c3d1f40022623`.
- **Approach:** followed the installed Impeccable `audit` and `critique` playbooks. Two user-approved, isolated assessments were used: Assessment A completed before Assessment B detector findings entered synthesis. Assessment B ran `impeccable.cmd detect --json index.html`, then checked each rule against generated HTML, source CSS/templates/build code, and live browser evidence. Repository docs and source were inspected; no build or test suite was run.
- **Product mode:** Read. All 10 critique heuristics apply.
- **Constraints honored:** no website source, UI, policy wording, CX, or GCP changes; no PR or merge.

### A. Audit findings

#### Audit health score

| Dimension | Score | Evidence and limit |
|---|---:|---|
| Accessibility | 3/4 | Source has a skip link, semantic landmarks/headings, visible focus, reduced-motion handling, labeled controls and guide state announcements. Six sampled foreground/background pairs exceeded WCAG AA text contrast; this was not a full contrast sweep or a keyboard/screen-reader audit. |
| Performance | 3/4 | Static page/source review found no verified blocking performance defect. Asset inventory totals about 4.54 MB across repository image variants; this is not a runtime transfer measurement. No network waterfall or device performance profile was run. |
| Responsive design | 3/4 | CSS has narrow-screen breakpoints and the live page was viewed at desktop and emulated 390×844. No physical-device, synthesized-touch, tablet, or 200% zoom validation was done. |
| Theming | 2/4 | Several shared color tokens and a consistent public-service palette exist, but token use is partial and no dark theme was evaluated. |
| Implementation integrity | 3/4 | The page has a coherent Taipei public-service identity and consistent plan/card patterns. Detector warnings were checked in source context; they do not amount to 107 verified defects. |
| **Total** | **14/20 — Good** | Evidence-based source and browser review; see the limitations above. |

**Verified technical severity:** P0 0, P1 0. This read-only pass did not verify a technical blocker or major accessibility violation. Scores are bounded by the listed inspection limits.

#### Detector results and review

The detector returned **107 JSON warnings across 6 rules**, all pointing to generated `index.html` with line number `0`, so its locations are not actionable. The process exit code was `0`, although the critique playbook says findings should normally return `2`; the JSON warning list was used as the count. Counts describe detector output, not defect totals.

| Rule / count | Review, impact, and disposition | Severity / confidence | Stage 2 |
|---|---|---|---|
| `border-accent-on-rounded` — 16 | Correctly matches 3px top accents plus rounded corners on plan/comparison/tax cards (`assets/css/guide-v2.css:138,157`). This is a stylistic rule; the accents distinguish content and match the established card language. No user harm was verified. | LOW / HIGH that the pattern exists; LOW that it is a defect | NO |
| `cramped-padding` — 5 | Partly supported. FAQ rows have 19px vertical and 4px horizontal padding (`guide-v2.css:100-105`); `.v2-source` has no horizontal padding of its own (`:152`), though it sits in a padded parent. The FAQ screenshot did not show the all-sides flush condition described by the detector. A small source-area edge-spacing concern remains, with no demonstrated task failure. | LOW / MEDIUM | NO |
| `dark-glow` — 1 | False positive in context: `site.css:14` uses `#0d393f1a` as a low-opacity shadow token on a light page, not a colored glow on a dark page. | None (not a defect) / HIGH | NO |
| `icon-tile-stack` — 3 | Correctly identifies the three tenant-category icon tiles above headings (`scripts/build.mjs:84-86`). This intentional, repeated category pattern did not obscure the labels. | None (not a defect) / HIGH | NO |
| `side-tab` — 5 | Matches a 3px left accent on the informational notice (`guide-v2.css:154`, `site/template.html:101`, `scripts/build.mjs:77-78`); it is a notice, not a side-tab control. No interaction confusion was seen. | None (not a defect) / HIGH | NO |
| `wide-tracking` — 77 | Strong likely false positive. Source sets `.v2-site` letter spacing to `.015em` (`guide-v2.css:297`); reported values 1.45em/1.61em/1.81em align with source line-height values 1.45/1.65/1.8 (`:297-302`). Screenshots did not show conspicuously wide text. This is an inference from source and warning snippets; computed browser styles were not collected. | None (likely false positive) / MEDIUM | NO |

**Only partial audit observation:** the detector's padding concern is limited to a source-information area and does not justify a Stage 2 change by itself. The warnings for the other five rules were either intentional styling or false positives after contextual review.

#### Positive technical evidence

- `site/template.html` provides `lang="zh-Hant-TW"`, viewport metadata, a skip link, main landmark, labeled sections, and footer source-check date.
- The design supports visible keyboard focus and reduced-motion preferences; guide controls expose selected/expanded state and live updates.
- CSS changes route, plan, and comparison layouts at narrow breakpoints. Sampled text color pairs passed 4.5:1; no full-page accessibility conformance claim is made.

### B. Critique findings

#### Design specificity

The experience reads as a Taipei rental-tax public-service guide rather than a generic tax landing page: the official Taipei Tax identity, four rental situations, three tax categories, and links to official services anchor the composition. The residential illustration and helper mascot are more generic, but support the subject without displacing the service identity. Preserve this restrained visual language.

#### Heuristic scores

| # | Heuristic | Score | Site-specific evidence |
|---:|---|---:|---|
| 1 | Visibility of system status | 3/4 | Audience routes, expanded cards, guide progress/answers, and helper loading/unavailable states are visible. |
| 2 | Match with real world | 3/4 | Cards start with familiar situations; “相當稅率” and “116年期” still require tax context. |
| 3 | User control and freedom | 4/4 | Guide has back/reset; plan details collapse; comparison, deep links, and return routes are available. |
| 4 | Consistency and standards | 3/4 | Plan and tenant cards share patterns; a direct rent-standard filing service is grouped beside audience routes despite being a different destination type. |
| 5 | Error prevention | 3/4 | Guide cautions that it does not determine eligibility; one question combines subsidy qualification and already receiving a subsidy. |
| 6 | Recognition rather than recall | 3/4 | Plan/tax categories are labeled and guide results repeat answers; core benefit summaries fall below the inspected desktop first viewport. |
| 7 | Flexibility and efficiency | 3/4 | Visitors can select a plan, use the guide, compare, or deep-link. |
| 8 | Aesthetic and minimalist design | 3/4 | Official colors and restrained cards work; the top route row groups several kinds of destination. |
| 9 | Error recognition and recovery | 3/4 | Guide answers can be revised/reset; helper failure has a fallback. External service outcomes are outside this page's control. |
| 10 | Help and documentation | 3/4 | Guide, FAQs, details, and official links help; some technical terms lack nearby explanation. |
| **Total** |  | **31/40 — Good (77.5%)** | All 10 Read-mode heuristics scored; none marked n/a. |

#### Cognitive load and emotional journey

**Cognitive load: moderate; 2 of 8 checklist failures.** At the inspected 1519×719 desktop viewport, the owner decision has five visible paths (four plans plus the “不知道怎麼選？” guide). The top “選擇查詢方式” row also groups owner, tenant, helper, and a direct rent-standard service, though this is an interpretive consistency concern rather than a confirmed obstacle. No top-route or guide question showed more than four choices. Guide questions are grouped in threes, tenant categories and FAQs in small groups, and plan details progressively disclose conditions.

The page opens calmly with official identity, restrained colors, and recognizable owner/tenant choices. The guide provides reassurance with progress, back/reset controls, and a clear qualification disclaimer. The main emotional valley is reaching the plan section before seeing its tax benefit summaries, which makes visitors scroll for the information central to the page's promise.

#### Site-specific issues

1. **[P2 / MEDIUM] Benefit figures begin below the first desktop viewport.**
   - **Location:** owner plan section in `site/template.html:62-77`; live page at 1519×719.
   - **Observation / impact:** header, hero, routes, and plan heading occupy the initial view; plan cards begin near its bottom and their tax summaries require scrolling. A visitor seeking the benefit figures cannot compare them immediately.
   - **Evidence / confidence:** visible in the desktop capture and consistent with source section order. HIGH.
   - **Smallest direction:** reduce only excess vertical space above the plan summaries enough to expose an initial benefit line; keep all policy text and identity intact.
   - **Risk / trade-off:** less open spacing above the cards.
   - **Stage 2:** YES — `layout`.

2. **[P2 / MEDIUM] Four owner plans plus the guide look like five peer paths.**
   - **Location:** owner plan cards and “不知道怎麼選？” guide link, `site/template.html:62-77`.
   - **Observation / impact:** a first-time owner may hesitate or scan the fallback guide as a fifth scheme choice.
   - **Evidence / confidence:** all five appear together at the owner decision point in the desktop inspection. HIGH.
   - **Smallest direction:** preserve the guide and distinguish it visually as help for visitors who are unsure, without hiding it.
   - **Risk / trade-off:** a subtler guide could be missed by people who need help.
   - **Stage 2:** YES — `layout`.

3. **[P2 / MEDIUM] Source-check date is only in the footer.**
   - **Location:** footer in `site/template.html:104-108`; date supplied by `site/content.json` (`2026-09-08`).
   - **Observation / impact:** users see time-sensitive tax figures before seeing when the sources were checked, which may leave freshness unclear.
   - **Evidence / confidence:** date is in the footer; plan summaries occur earlier. HIGH.
   - **Smallest direction:** show the existing date near plan summaries or comparison; retain its exact value and wording pending review.
   - **Risk / trade-off:** more content around the plan cards.
   - **Stage 2:** YES — `layout`.

4. **[P3 / LOW] Guide question combines subsidy qualification and receipt.**
   - **Location:** quick guide choice in `assets/js/guide-rules.js:22-25,32-35`.
   - **Observation / impact:** “符合資格，或已取得補貼” combines two states while plan details distinguish tax-specific conditions; a renter's landlord may not know which answer fits.
   - **Evidence / confidence:** source wording and plan conditions; the guide also offers “不確定” and says the result is not an eligibility review. MEDIUM.
   - **Smallest direction:** if selected later, make the existing tax-by-tax distinction easier to consult at the result step without changing approved wording or eligibility logic.
   - **Risk / trade-off:** extra detail could lengthen a short guide and could be mistaken for new policy guidance.
   - **Stage 2:** MAYBE — not in the current shortlist.

#### What works well

- Owner cards lead with recognizable situations such as “我自己出租、自己管理” before program names.
- Plan details follow a useful sequence: fit, conditions, three tax types, next action, and official links. The 公益出租人 details distinguish local-tax handling from income-tax filing.
- The three-question guide shows progress, repeats prior answers, provides back/reset, and states it does not determine eligibility.
- Core categories pair color with text and numbers; focus styling and semantic/ARIA state support are visible in source.

#### Persona red flags and observations

- **Jordan, first-time owner:** scenario-first labels help; “相當稅率” and the subsidy question can still cause hesitation. “不確定” and the disclaimer mitigate it.
- **Sam, accessibility-dependent user:** source includes skip link, visible focus, headings, expanded state, live guide updates, and labeled controls. No complete keyboard, screen-reader, zoom, or full contrast audit was conducted.
- **Casey, mobile user:** Assessment B captured 390×844 emulated layout with two-column top routes and continuing plan content. The short guide's answers live in page memory and reset on reload. No physical device or synthesized touch interaction was tested. Assessment A could not independently inspect mobile appearance.
- **Rent-standard entry:** grouped with the three audience/helper routes, but it was not proven to visually overpower them. Treat this as a MEDIUM-confidence question for first-click validation, not a confirmed defect or redesign mandate. It is not in the Stage 2 shortlist.

#### Questions for later validation

- At the owner decision point, do first-time users understand the guide as an optional fallback for uncertainty rather than a fifth plan?
- When a landlord selects “符合資格，或已取得補貼,” do they understand the result is reading guidance and that conditions differ by tax type?

#### Stage 2 shortlist — human selection only

| Candidate | Smallest reviewable change | Later command | Before/after measure | Main trade-off |
|---|---|---|---|---|
| Bring the first plan benefit summary into the desktop initial view | Adjust spacing above plan cards only; preserve text and identity | `layout` | Same viewport screenshot: whether first benefit summary is visible without scrolling | Less vertical breathing room |
| Make the guide read as a fallback for unsure owners | Keep the link, visually clarify its helper role | `layout` | First-time-user choice rate/time and screenshot hierarchy at the owner decision | Help path could become less noticeable |
| Surface the existing source-check date near figures | Reuse `2026-09-08` near plans/comparison without changing claim | `layout` | Screenshot and user check of whether source freshness is noticed | Adds content near cards |

These are candidates, not approved implementation work. No Stage 2 change was made.

### Run notes and limitations

- Target slug resolved to `index-html`; `.impeccable/critique/ignore.md` was absent.
- Assessment A and B were separate, user-approved agents. A completed before detector output entered parent synthesis.
- Detector JSON: 107 warnings / 6 rules; exit code 0 despite findings; all warning locations use line 0.
- Browser: fresh Chrome tabs, desktop captures around 1519–1520px wide, FAQ/official-information view, and a 390×844 emulated viewport. The mobile viewport was reset after capture.
- Browser page evaluation was read-only; no injected detector, user-visible overlay, or Impeccable console report is claimed. Following the critique playbook fallback, no local server was started.
- No test/build was run. The only repository changes for this stage are this file and `PROJECT_STATE.md`; website HTML/CSS/JS/content source remains unchanged.
- Critique snapshot write succeeded at `.impeccable/critique/2026-09-27T03-59-45Z__index-html.md`; trend read succeeded and contained only this first run at 31/40. The body temp file and this snapshot were then removed per this task's cleanup requirement; no Impeccable artifacts remain.

Questions skipped: this task requires stopping at `AUDIT_COMPLETE_AWAITING_HUMAN_SELECTION`; no follow-up questions were asked.


---

## Stage 2 — Human-approved implementation

Status: **STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW**

Human review selected **2 of the 3** Stage 1 candidates for implementation on the existing branch.

### Approved candidate A — Make the quick guide clearly read as help, not a fifth plan

**Decision:** IMPLEMENT

Use Impeccable `layout` as a refinement aid.

Goal:
- keep the four rental plans as the primary choices
- keep the quick guide easy to discover
- make it visually clear that the guide is a fallback/help path for people who are unsure, rather than another rental plan

Constraints:
- preserve the four plan cards and their order
- preserve the existing guide logic and behavior
- do not change eligibility logic, tax content, figures, legal meaning, or CX
- avoid adding visual decoration for its own sake
- do not hide the guide or make it materially harder to find
- prefer the smallest layout/hierarchy change that solves the distinction
- citizen-facing helper wording may be minimally adjusted only if needed to clarify its role; do not alter policy wording

Target outcome:
> 四個方案 = primary choices  
> quick guide = clearly secondary decision support

### Approved candidate B — Surface the existing source-check date near tax figures

**Decision:** IMPLEMENT

Use Impeccable `layout` as a refinement aid.

Goal:
- let users see the existing source freshness information close to the owner plan / comparison information, instead of only in the footer
- reuse the existing `meta.checked` value; do not introduce a second manually maintained date

Constraints:
- source of truth remains `site/content.json -> meta.checked`
- keep the existing footer date
- do not duplicate the literal date in source code
- use a visually secondary treatment
- do not place the date inside every plan card
- do not imply that the date is a legal effective date or tax-year date
- preserve the existing meaning of the source-check label

### Deferred candidate — Bring benefit figures into the first desktop viewport

**Decision:** DEFER

Reason:
- the Stage 1 evidence came mainly from one desktop viewport
- scrolling before seeing benefit figures is not by itself a demonstrated usability defect
- compressing hero / route / section spacing merely to satisfy “above the fold” could reduce clarity and breathing room

Do **not** implement this candidate in Stage 2.

Do not intentionally compress the page to force tax figures into the first viewport.

## Stage 2 implementation scope

Allowed:
- `site/template.html`
- `assets/css/guide-v2.css`
- generated `index.html` via the normal build
- a minimal test update only if needed to protect the new source-date rendering or hierarchy from regression
- STATE / TASK documentation

Avoid touching other source files unless there is a concrete implementation need. If another file is needed, explain it in the completion record.

Use only the Impeccable refinement capability needed for these two approved items. Start with `layout`.

Do **not** run:
- `polish`
- `bolder`
- `overdrive`
- `delight`
- `animate`
- `colorize`
- `craft`
- a new broad `audit` / `critique`

This is not a redesign pass.

## Before / after review target

Compare the Stage 2 branch against production `main` / the recorded baseline.

At minimum inspect:
- desktop around 1440–1520px width
- tablet / intermediate layout if available
- mobile 390×844
- 320px width
- 200% text / zoom behavior if existing tooling makes this practical

Review specifically:
1. Does the quick guide now look like decision support rather than a fifth plan?
2. Is it still easy to find?
3. Is the source-check date visible near relevant figures without adding clutter?
4. Does the source-check label remain clearly different from tax-year / effective-date information?
5. Are mobile wrapping, touch targets, focus behavior and reading order still sound?
6. Did any change make the page feel denser or more decorative?

## Required validation

Run:
- normal build
- build `--check`
- full Node tests
- performance budget
- `git diff --check`

Run available browser checks without adding large dependencies.

If Playwright is unavailable, perform a targeted browser smoke and record the limitation.

No live CX query is required unless the implementation unexpectedly affects Messenger behavior.

## Stage 2 implementation result (2026-09-27)

### Status and commits

- Status: **STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW**
- Branch: ux/impeccable-refinement-poc
- Implementation commit: 4c65a700dc870f06c3eb1150cb32a9682f920cc0 (feat: refine owner plan guidance layout).
- State tracking was updated in PROJECT_STATE.md in the follow-up documentation commit.
- No PR was opened, no merge was made, and GitHub Pages publishing source was not changed.

### Files changed

- site/template.html — moved and clarified the quick-guide helper; added a plan-area source-check line using the CHECKED placeholder.
- assets/css/guide-v2.css — added secondary helper/date styles and mobile left alignment for the date.
- index.html — regenerated using node scripts/build.mjs.
- tests/build.test.mjs — added a regression guard for helper hierarchy, date position/source, footer reuse, and narrow-screen date alignment.
- PROJECT_STATE.md and this TASK — recorded the implementation and evidence.

### Exact refinement

- The four rental plans remain the primary choices, with their content and order intact. The quick-guide shortcut now sits directly under the owner-plan title and reads 不確定適用方案？使用快速判斷找方向 →; the full-width guide panel remains below the plan caveat and unchanged.
- The new source-check line, 租稅來源核對：{{CHECKED}}, appears after the plan grid and before the caveat. It uses the same site/content.json meta.checked placeholder as the footer, keeps the footer line, and uses muted secondary text. It is right aligned above 700px and left aligned at or below 700px.
- The first-viewport spacing candidate remains deferred. No tax/policy wording, figures, eligibility logic, guide behavior, Messenger, or CX configuration was changed.

### Impeccable method

- Used the installed Impeccable layout workflow and spatial-hierarchy direction. Two independent layout assessments were synthesized before implementation. A layout-only detector run produced 8 warnings on unrelated existing patterns (3 icon-tile-stack, 5 cramped-padding); neither approved target was flagged. No new broad audit or critique, polish, bolder, overdrive, delight, animate, colorize, or craft mode was run.

### Validation

- node scripts/build.mjs — PASS.
- node scripts/build.mjs --check — PASS (Generated page matches source.).
- node --test — PASS (20 passed, 0 failed).
- node scripts/performance-budget.mjs — PASS (three static assets and guards).
- git diff --check — PASS.

### Browser evidence and limits

- Production baseline and local build were inspected in Chrome at 1440px desktop, 720px intermediate, 390×844 mobile, and 320×844 narrow mobile viewports.
- At 1440px, the helper link is grouped with the owner heading as a smaller secondary action; four cards remain in one row. The source-check line is legible under the cards and before the caveat. The separate green guide panel remains visually distinct and discoverable.
- At 720px, the four plans use a two-column layout; the source-check line remains below the plans and before the caveat.
- At 390px and 320px, the plans stack one per row, link text wraps without changing reading order, and the source-check line stays fully visible. Read-only browser metrics showed candidate document width equal to its viewport width at both sizes. Production baseline checks likewise showed no horizontal overflow.
- The local Playwright package is unavailable. Targeted Chrome browser checks used the Codex browser viewport capability and read-only page evaluation; no large dependency was added. A 200% browser zoom result was not verified. Physical-device/touch, complete keyboard, screen-reader, and full accessibility audits were not performed.
- No live CX query was needed because Messenger behavior was untouched.

## Stage 2 completion protocol

When implementation is complete:

1. Update this TASK and `PROJECT_STATE.md`.
2. Set status to:
   - `STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW`
3. Record:
   - implementation commit SHA
   - changed files
   - exact design/layout changes
   - Impeccable command/approach used
   - build/test/performance results
   - desktop/mobile before-vs-after observations
   - browser/tool limitations
   - confirmation that the deferred first-viewport candidate was not implemented
   - confirmation that policy/tax/CX content was not altered
4. Commit and push `ux/impeccable-refinement-poc`.
5. Stop and hand back to ChatGPT / user for visual review.

**Do not open PR.**  
**Do not merge main.**  
**Do not switch GitHub Pages away from main.**


---

## Stage 2 review — typography correction

Status: **STAGE2_CHANGES_REQUESTED**

ChatGPT reviewed implementation commit `4c65a700dc870f06c3eb1150cb32a9682f920cc0`.

The two approved UX changes are accepted in structure and scope, but one small regression must be corrected before human visual review.

### Required fix

The repository's established typography rule in `assets/css/guide-v2.css` says:

> Reading hierarchy: body 18px, supporting text at least 16px.

Stage 2 added:
- `.v2-guide-shortcut { font-size: .9375rem; }` — 15px at the default root size
- `.v2-source-check { font-size: .875rem; }` — 14px

These are below the project's supporting-text minimum.

Please:
1. keep the new hierarchy, wording, placement, and behavior
2. remove the smaller shortcut font override or use at least `1rem`
3. set the source-check line to at least `1rem`
4. keep secondary hierarchy through muted color, weight, spacing, alignment, and placement—not smaller-than-16px text
5. rerun build, build --check, full Node tests, performance budget, and `git diff --check`
6. update this TASK and `PROJECT_STATE.md` with the corrective commit and results
7. restore status to `STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW`
8. commit/push the same branch and stop

Do not change anything else. No PR, merge, Pages switch, policy/tax/CX change, or additional Impeccable refinement pass.

### Correction result (2026-09-27)

- Current status: **STAGE2_IMPLEMENTED_AWAITING_HUMAN_REVIEW**.
- Corrective implementation commit: 7adadd5a09c153202aec4a6a7b79fdce3a6ca68e.
- The only source correction was to set .v2-guide-shortcut and .v2-source-check font-size to 1rem (16px), meeting the established supporting-text minimum. Other properties and content were preserved.
- index.html was regenerated and only its CSS cache hash changed.
- Browser computed styles: root 16px; shortcut 16px and source-check 16px at desktop and 390px mobile viewport.
- Validation: node scripts/build.mjs PASS; node scripts/build.mjs --check PASS; node --test PASS (20 passed, 0 failed); node scripts/performance-budget.mjs PASS; git diff --check PASS.
- No additional Impeccable pass or other UX/UI, policy, tax, Messenger, or CX change was made.
