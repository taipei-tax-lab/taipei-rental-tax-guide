# TASK_2026-09-27_IMPECCABLE_FREE_DESIGN_EXPERIMENT

Status: **EXPERIMENT_COMPLETE_AWAITING_HUMAN_REVIEW**

## Goal

在不改變租稅政策事實、核心功能與官方 CX 設定的前提下，讓已安裝於 Codex 的 Impeccable 更自由地重新整理這個網站的 UX / UI，測試這套 skill 的「上限」。

這是一個純實驗 branch，不是 production candidate。

## Baseline

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`
- Production branch: `main`
- Baseline main SHA: `1ae269999bc3048320ac471f7e21ffccc925ae72`
- Latest production release merge: `3bac3930aee9643a35d7e41ac375a581ab0b68b9` (PR #11)
- Experiment branch: `experiment/impeccable-free-design`

## Experiment question

> 如果不把 Impeccable 限制在「只做最後 10% 小修」，而是讓它在安全底線內自由重整資訊層級、版面與互動，它能把目前已成熟的政府服務網站帶到什麼程度？

這一輪的目標不是 merge，而是產出一個足以讓人肉眼比較的「自由設計版」。

## Hard constraints

這些底線不得突破：

1. **政策與法規內容不能被改寫成不同意思**
   - 稅率
   - 金額
   - 適用條件
   - 期限
   - 資格
   - 主管機關
   - 官方申辦流程
   - 既有核定文字的法律／租稅意義

2. **核心功能不能壞**
   - 屋主 / 房客分流
   - 四方案內容可完整取得
   - 快速判斷
   - 四方案比較
   - FAQ / 官方資源
   - Messenger 開啟入口
   - 官方外部連結
   - JS 失效時主要資訊仍可取得

3. **不要碰 GCP / Dialogflow CX / domain restriction / cloud configuration**
   - 保留目前 production Messenger config
   - 不發送測試 query 除非真的需要驗證 UI integration
   - 不更換 agent/project/location

4. **Accessibility 不得明顯退步**
   - 保留 skip link
   - keyboard focus
   - semantic headings / landmarks
   - aria state / labels
   - touch target
   - reduced motion
   - supporting text 不低於既有 16px 基準
   - 不以純顏色傳達必要資訊

5. **Production main 不動**
   - 不開 PR
   - 不 merge
   - 不切換 GitHub Pages source
   - 不覆寫 production branch

## What Impeccable may change freely in this experiment

可以大膽調整：

- first-screen hierarchy
- hero composition
- owner / tenant / assistant / rent-standard entry hierarchy
- section order
- spacing / density
- card layout
- visual grouping
- progressive disclosure
- comparison presentation
- quick-guide presentation
- tenant-service presentation
- information architecture
- responsive layout
- typography hierarchy
- color hierarchy within a trustworthy government-service tone
- microcopy for navigation / helper labels / CTA（前提是不改政策事實與核定內容）
- interaction affordances
- subtle transitions / animation where useful
- visual identity refinement using existing Taipei Tax assets

可以使用 Impeccable 的：
- `critique`
- `layout`
- `clarify`
- `adapt`
- `polish`
- `distill`
- `colorize`
- `bolder`
- `delight`
- `animate`

也可以使用其他 Impeccable refinement commands，只要符合 hard constraints。

不要為了「炫技」而強迫使用每一個 command。讓 Impeccable 自己選擇最有價值的方向。

## Design freedom

這一輪可以明顯不同於 production。

不需要刻意維持「看起來幾乎沒改」。

允許：
- 更明確的視覺層級
- 更強的 landing-page 結構
- 卡片重排
- 更清楚的主次入口
- 更有設計感但仍可信的政府服務介面
- mobile-first rethink
- 重新安排哪些資訊應該第一眼看見

但仍應符合：

**可信 → 清楚 → 找得到 → 看得懂 → 做得到 → 最後才是漂亮**

即使是自由實驗，也不要變成設計獎網站、品牌展示頁或行銷 landing page。

## Required process

### Phase A — Re-evaluate

先用 Impeccable 自由重新審視 production baseline。

不要把前一輪 shortlist 當成限制，也不要只修前一輪指出的三件事。

請回答：
- 如果從 UX / IA / layout 重新看一次，目前最大改善機會是什麼？
- 哪些 production choices 值得保留？
- 哪些是因為過去逐步疊代而留下的局部最優，而不是整體最優？

把設計方向寫入本 TASK。

### Phase B — Implement the free-design candidate

在同一 experiment branch 直接實作。

可修改合理範圍內的：
- `site/template.html`
- `assets/css/*.css`
- `assets/js/*.js`
- `scripts/build.mjs`
- `site/content.json`（僅限 presentation metadata / UI labels；禁止改政策事實）
- tests
- generated `index.html`
- existing image presentation / usage

若新增本地 asset，記錄原因與來源；不要抓不必要的第三方依賴。

### Phase C — Validate

至少執行：
- build
- build --check
- full Node tests
- performance budget
- git diff --check

Browser review 至少：
- 1440px desktop
- ~768px intermediate/tablet
- 390×844 mobile
- 320px narrow mobile
- horizontal overflow
- major focus / keyboard path where practical
- 200% zoom/text if tooling permits

如果工具做不到，記錄 limitation，不要為此安裝大型依賴。

## Comparison output

完成後，讓使用者可以直接肉眼比較 production vs experiment。

最好在本機以不同 port 同時啟動：
- baseline main
- experiment candidate

在 TASK 記錄：
- baseline URL
- experiment URL
- most visible changes
- why Impeccable made them
- what it deliberately preserved
- what may be controversial / subjective

## Completion protocol

完成實驗後：

1. 更新本 TASK 與 `PROJECT_STATE.md`
2. Status → `EXPERIMENT_COMPLETE_AWAITING_HUMAN_REVIEW`
3. 記錄：
   - implementation commit(s)
   - changed files
   - Impeccable commands used
   - major design decisions
   - validation results
   - browser limitations
   - baseline / experiment local URLs if available
4. commit + push `experiment/impeccable-free-design`
5. **停止**

Do not:
- open PR
- merge main
- switch Pages
- claim the experiment is production-ready

這一輪的成功標準不是「改得越多越好」，而是：

> 讓使用者清楚看見：Impeccable 在安全底線內有充分自由時，是否能提出並實作一個明顯優於 production 的 UX / UI 方向。

## Experiment result (2026-09-27)

Status: **EXPERIMENT_COMPLETE_AWAITING_HUMAN_REVIEW**

### Phase A — Re-evaluate production main

The baseline review was performed against main at 1ae269999bc3048320ac471f7e21ffccc925ae72. The design critique was Read mode with aggregate 28/40. Independent design/layout reviews found that the service already has recognizable Taipei Revenue Service identity, owner/tenant routes, scenario-first plan names, complete plan details, and a useful guide with progress/back/reset and a non-eligibility disclaimer.

The broadest opportunities were:

1. Plan benefit figures draw attention before their shared caution and conditions.
2. Four schemes and a guide can read as five peer choices.
3. The top entry area groups audience routes with an assistant and an unrelated filing service.
4. Four equal-width summaries compress the tax information.
5. A fixed residential illustration continues behind long-form reading.

The detector was treated as a pattern finder, not as a defect count. The baseline full run returned 107 warnings at index.html:0, including 77 wide-tracking signals on short labels/IDs. The separate layout pass returned 8 warnings (5 cramped-padding, 3 icon-tile-stack). Source review classified these as a mixture of old/overridden patterns, intentional signposting, and some real spacing observations. No issue in the earlier Stage 2 shortlist constrained this experiment.

### Phase B — Implemented direction

The opening now uses a new service heading and presents owner and tenant as the only primary routes. “直接問小幫手” and the official income-standard filing service remain available as secondary tools. Existing helper status behavior, external filing target, and Messenger setup remain unchanged.

The owner path uses a clearer heading and places the quick guide first as optional decision support. Four schemes now form one scenario row each: rental situation and summary on the left, tax benefit information alongside, and a visible detail action at the right. The full details remain the source for complete conditions. The shared caution stays before the list. The four plan names, order, tax text, and values were not changed.

The residential illustration appears only in the hero; reading sections use a plain background. Tenant groups are plain disclosure rows, and FAQ/official resources receive more spacing. The comparison uses two columns on desktop/tablet and one column on mobile. At 320px, a body minimum-width rule caused a 15px emulation overflow; the experiment removes that floor for the narrow breakpoint and the final viewport check passes.

No new asset or third-party dependency was added. No JavaScript, site/content.json, policy/tax facts, CX/GCP settings, or Messenger configuration changed.

### Impeccable and critique record

- Impeccable context was run before implementation.
- The baseline was inspected by two separate design/layout review passes before detector results were synthesized.
- Commands used: context; detect --json index.html; critique-storage slug/write/trend for index-html.
- Critique aggregate: 28/40, Read mode. No individual heuristic scores were inferred beyond the scores preserved in the review handoff.
- Critique archive: .impeccable/critique/2026-09-27T11-04-00Z__index-html.md; target fingerprint is the read-only main baseline index.html. Trend reports this as the first stored run.
- Final full detector: 109 findings — wide-tracking 80, border-accent-on-rounded 16, side-tab 5, cramped-padding 4, icon-tile-stack 3, dark-glow 1. Most findings carry index.html:0 rather than actionable line numbers. Several categories reflect existing/detail CSS and scanner limitations; they are not 109 confirmed defects. The final pass identified no blocking issue in the candidate's primary role/plan structure.

### Validation

- node scripts/build.mjs — PASS.
- node scripts/build.mjs --check — PASS; generated output matches source.
- node --test — PASS, 20/20 tests.
- node scripts/performance-budget.mjs — PASS; all declared static asset budgets passed.
- git diff --check — PASS.
- Implementation commit: 27dea81d62f51904ce1ea487e2fd40bc09c2667a.
- Changed files: site/template.html; assets/css/guide-v2.css; generated index.html; tests/build.test.mjs; tests/performance.test.mjs; scripts/performance-budget.mjs; critique snapshot above; this TASK; PROJECT_STATE.md.
- Build/test guard changes now assert the two primary audience routes, preserved assistant/official filing routes, quick-guide-before-plans hierarchy, footer-only source-check date, and rebuild output.

### Browser review and comparison previews

- Main baseline: http://127.0.0.1:4183/
- Experiment candidate: http://127.0.0.1:4184/
- Both preview servers returned HTTP 200 and remain running. Desktop main and candidate views are open at the owner section. Additional main/candidate mobile views are open at 390px.
- Candidate viewport checks at 1440×900, 768×900, 390×844, and 320×844 found no horizontal overflow. The baseline showed no overflow at 1440 and 390. At the 390px Chrome emulation, visualViewport is approximately 375px because the desktop browser reserves scrollbar space; document width equals the available client width.
- Keyboard first-stop smoke reached the “跳到主要內容” skip link with a visible outline. The quick guide expanded and rendered its first question, plan ordinary opened its full detail route, comparison rendered four plans, and tenant services exposed 3 groups/13 official links. Candidate page console error list was empty. No Messenger query was sent.
- 200% zoom, physical-device/synthesized-touch behavior, full keyboard traversal, and screen-reader behavior were not verified. The CUA viewport tool provided responsive widths but no zoom control.

### What remains subjective for human review

The scenario list makes each plan much wider and easier to compare but increases vertical scanning, especially on mobile. The new hero art treatment, shorter primary route list, and secondary service placement are design choices, not a claim of production superiority. Human review should compare both local previews and decide whether to keep, revise, or reject the direction.

### Completion boundary

The implementation was committed and pushed on experiment/impeccable-free-design. Status remains EXPERIMENT_COMPLETE_AWAITING_HUMAN_REVIEW. No PR was opened, main was not merged, GitHub Pages was not switched, and the candidate is not declared production-ready.
