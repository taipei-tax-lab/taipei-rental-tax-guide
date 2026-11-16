# PROJECT_WORKFLOW — 網站開發、驗證與交接

## 1. 開工與環境

同一份任務提示適用本機及雲端 Coding Agent。先讀 AGENTS、State、Task；辨識實際環境及工具，檢查 Repo、Remote、Branch、HEAD、工作樹。本機先 `git fetch`，確認可 fast-forward 才 `git pull --ff-only`；雲端確認 checkout 與授權遠端分支一致。有分歧或未提交內容時保留並回報，不 reset、強制覆寫、擅自切換分支。正常工作沿用 State 指定的開發分支。

Node.js 20 以上即可使用內建模組建置及單元測試；不要求 npm install。瀏覽器測試使用環境已有的 Playwright／Edge 或其他可用工具，依實際能力回報，不將模擬裝置當實機。`PORT`／`PREVIEW_URL` 指向同份 worktree／指定測試 URL，避免測到錯誤版本。

## 2. 修改與來源

- 編輯 `site/`、`assets/`、`scripts/` 等真正來源；網站程式或內容變動後，重新產生 `index.html`，檢查 output 與來源一致，提交應交付的建置結果。
- 只在已確認 Task 範圍實作，保持 GA4 事件／隱私規則、CX 設定及現行已驗收行為；不把歷史 PoC 當正式設定。
- 法規與業務內容修改須確認核定稿／官方來源、適用年度和例外；日期是實際核對日期，不是建置日期。靜態網站資料更新不會自動同步 CX。若要改影片、GA4、CX 或正式部署設定，先確認授權、驗證與回復方式。
- 目前前端不依賴 Google Drive 來源；不作例行 Drive 同步。日後若新增 Drive 正式來源，需先明定位置、授權、版本/衝突規則及增量同步能力，再按需讀寫及讀回驗證；不可搬運本機 Token 供雲端使用。

## 3. 分層驗證

程式改動原則執行 `npm run build`、`node scripts/build.mjs --check`、`npm test`、`node scripts/performance-budget.mjs`、`git diff --check`；依風險執行適用的 `scripts/*-check.cjs` 及 HTTPS 回歸。可直接使用 `node` 對應指令。純文件修改檢查連結、狀態、diff、實際核對的證據即可，不為文件改動觸發昂貴完整回歸；既有失敗不得隱瞞。

驗收需區分：已實作、單元/建置測試、指定環境實際驗證、實機／人工／業務驗收。不能從 Cloudflare 部署成功推論所有功能通過，更不能把 10/31 的測試結果套用至 11/4 的新來源。測試站非 CX scripts 隔離第三方 CX 與 GA4 請求；不得以此宣稱真實 CX 問答通過。只獲授權的少量、不含個資的 CX 真實問題可另測。原生影片控制需實機覆核，不能以 Chromium iPhone UA 仿真代替。

## 4. 發布及交付

| 環境 | 來源與行為 |
| --- | --- |
| 本機 | `npm run dev`／`node scripts/serve.mjs`，重新 build 後預覽；不改線上。 |
| Cloudflare 測試站 | `feat/direct-apply-operation-guide-20261031`，現有 Git 整合，`node scripts/build-pages-test.mjs` → `dist-pages-test`。Push 會自動建置（包括文件提交，除非日後獲准改設定）。只進白名單 runtime，測試產物移除 GA4；不得誤稱是主線正式發布。 |
| GitHub Pages | `main` 已版控的 `index.html` 及資產，合併前必須重建、驗證、取得核准。 |
| 稅捐處機關正式站 | 由資訊室部署獨立靜態交付包；核對正確版本、必要檔案、CSP、MIME、影片來源與 Range、正式 GA4、CX 網域及真實問答。不能使用隔離 GA4 的測試產物代替正式交付。 |

Cloudflare 現有設定見 README。合併 main、正式部署、改雲端設定或刪除歷史分支皆須另行核准。分支 push 的既有測試站自動建置屬正常工作流程，不另建立資源。發布時核對精確 commit／部署結果／可回復版本；機關站以部署後實測為準。

## 5. 每輪收尾

更新必要的 NEXT_TASK、PROJECT_STATE、WORKLOG；檢查狀態一致、無衝突及敏感資料或暫存產物。於授權分支 Commit／Push，確認遠端 HEAD；沒有修改不製造空 commit。回報 branch、commit、diff、測試證據、實際同步、未知事項與人工待辦。完整 CI 原則於合併前/PR 或手動執行，平時風險相稱。下一輪需求未定時停在文件交接，不開始實作。
