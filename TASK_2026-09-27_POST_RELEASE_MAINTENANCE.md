# TASK_2026-09-27_POST_RELEASE_MAINTENANCE

Status: **READY_FOR_IMPLEMENTATION**

## Goal

在 Phase 5A 正式發布完成後，進行一輪小範圍、低風險的 post-release maintenance，修正已知「文件／測試與現況不一致」項目，並把其餘技術債整理成可追蹤 backlog。

本輪不是 UI 重設計，也不是全面重構。

## Production baseline

- Application release merge: `251884ee3d133d4f2e5723b3d25ccdfc8a1bf642` (PR #9)
- Production state commit before this maintenance planning: `d5b5bff00e235edd93c6e84a37e500853bb2591d`
- Production Messenger: official/public-service CX
- GitHub Pages source: `main`

## Required work

### A. 修正 stale tenant count 驗證與文件

目前 `site/content.json` 已有 13 個 tenant/service items，但部分舊測試／文件仍寫 10 個。

請：
- 找出所有仍假設 10 個 tenant 的測試與文件
- 修正為不易再次過期的驗證方式；若可合理由 source 實際數量推導，就不要再硬編 magic number
- 更新相關文件文字，使其與現況一致

### B. 更新 README 的過期 release 說明

README 仍含舊 refinement branch「尚未提交／發布」等歷史性敘述。

請：
- 更新成目前 production 已由 PR #9 發布的現況
- 保留有用的架構／維護說明
- 不把 README 改成完整 changelog

### C. 清理 regression script 的過期說明

檢查現有 browser / Messenger regression scripts 的註解或說明，移除／修正仍指向已移除 floating shortcut / launcher 的過期敘述。

只改文件、註解或 stale assertion；不要藉此重寫測試架構。

### D. 整理剩餘技術債 backlog

重新核對以下 audit findings 是否仍存在，並在本 TASK 的 Completion Record 中逐項標記：

- tenant grouping by array index
- FAQ hard-coded in `scripts/build.mjs`
- `resources.slice(3)` maintenance fragility
- assistant idle image initial request
- Messenger titlebar / shadow-root workaround robustness
- `site/content.json` version / checked metadata semantics
- SEO / canonical / CSP / URL validation 等可選 hardening

每項只需標記：
- `KEEP`：值得後續另開 task
- `DEFER`：目前沒有足夠收益，不必處理
- `NO_LONGER_APPLIES`：已不存在

並附一行理由。

本輪 **不要實作 D 類項目**。

## Explicitly out of scope

- 不修改 Dialogflow CX / GCP
- 不更換 CX project / agent / domain restriction
- 不重設 Messenger UI
- 不重構 tenant grouping / FAQ architecture
- 不做圖片 lazy-load optimization
- 不碰 shadow DOM workaround
- 不新增 SEO / CSP
- 不修改稅務政策內容
- 不修改已核定的頁面文案
- 不開 PR / 不 merge main

## Git workflow

1. 先同步最新 `main`。
2. 閱讀：
   - `PROJECT_STATE.md`
   - 本 TASK
   - 相關 source/tests/docs
3. 建立 branch：
   - `maintenance/2026-09-27-post-release`
4. 只執行 A / B / C。
5. 執行 build、build --check、完整 Node tests、performance budget、`git diff --check`。
6. 如可用，做最小 browser smoke；不可用時記錄限制即可。
7. 更新：
   - `PROJECT_STATE.md`
   - 本 TASK
8. 在兩份文件中記錄：
   - status → `IMPLEMENTED_AWAITING_REVIEW`
   - implementation commit SHA
   - changed files
   - tests / build results
   - D 類 backlog 的 KEEP / DEFER / NO_LONGER_APPLIES 結論
   - any limitation / ambiguity
9. commit 並 push branch。
10. 停止，交回 ChatGPT review。

**不要開 PR。**
**不要 merge main。**
**不要刪除歷史 branch。**

## Completion criteria

本輪完成時應滿足：

- tenant count 的 stale assertion / docs 已與 source 一致
- README 不再描述已過期的「尚未發布」狀態
- regression script 的過期說明已清理
- build / tests / performance / diff-check 全綠
- 技術債 backlog 已逐項分類
- `PROJECT_STATE.md` 與本 TASK 已記錄完成情形
- branch 已 push
- no PR / no merge
