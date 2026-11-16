# NEXT_TASK — 2026-11-16 四張卡片圖示辨識優化

狀態：**READY_FOR_IMPLEMENTATION**（2026-11-16，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
程式／證據基準：`4fc7521744bdcaecd27d4c6c159fb94eb8449a7e`；上一輪 Cloudflare check SUCCESS，68/68 單元及瀏覽器回歸已有紀錄。使用者檢視改版後反映部分 icon 語意不易理解，現要求針對該四張卡片重設圖示。前兩個重複輸入「我是房屋」依目前入口名稱理解為「我是屋主」「我是房客」，本輪不改標題。上一輪完整核定需求及完成紀錄見 [前輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/4fc7521744bdcaecd27d4c6c159fb94eb8449a7e/docs/NEXT_TASK.md)、[驗證報告](evidence/2026-11-16-visual-consistency/REPORT.md)。

## 1. 核定範圍與設計方向

只重繪下表四個卡片 SVG，保留其他十二個圖示、版面、背景 A、卡片順序、尺寸、配色、內容及互動。表中「設計構想」是實作建議，具體 path 可由 Coding Agent 調整，以小尺寸即可辨認且同一套設計語言為準。

| 卡片 | icon key | 現行辨識疑點（來源觀察／推論） | 建議設計構想 |
| --- | --- | --- | --- |
| 我是屋主（主入口） | `owner` | 房屋輪廓被切斷，鑰匙較小且與房客重複 | 以完整、清楚的房屋輪廓為主，搭配簡潔人物頭肩置於屋內，表達屋主身分；不要再以小鑰匙作主要辨識線索。 |
| 我是房客（主入口） | `tenant` | 人物身體與鑰匙分離，視覺像兩個無關符號 | 以完整人物頭肩／人形為主，搭配小型、輪廓明確的行李箱，表達租住／入住；房屋不得成為主體，與屋主形成明顯區別。避免像單純旅遊標誌。 |
| 個人租賃住宅包租代管（屋主四方案） | `personal` | 小房屋與文件重疊，屋形及文件皆不完整 | 一棟清晰房屋搭配容易辨認的合約／管理文件（紙張輪廓及一至兩條文字線），表達住宅租賃與代管；主次清楚，避免繁複印章、過多細節或與社會住宅的盾牌混淆。 |
| 我要申請租金補貼（房客三卡） | `subsidy` | 抽象托手與房屋相連，沒有醒目的金錢符號 | 房屋搭配清楚的硬幣／補助款符號，例如圓形硬幣及簡潔貨幣線條；避免難懂手勢、美元專屬文字及過小符號，與租金標準卡的計算機區別。 |

## 2. 實作界線

- [ ] 依 AGENTS／Workflow 檢查 Repo、Remote、Branch、HEAD 及工作樹，安全同步指定遠端分支；如有衝突保留現況回報。
- [ ] 只在 `scripts/icons.mjs` 的 `owner`、`tenant`、`personal`、`subsidy` 重新設計圖形；沿用 `cardIcon()`、所有原 key 及 `data-card-icon` 識別。其餘 12 組 SVG path 不變。不引入外部 icon 庫、字型、emoji、額外圖片或 CDN。
- [ ] 沿用既有 24×24 viewBox、1.8 stroke、round cap/join、currentColor、無填色、aria-hidden / focusable=false；線條粗細、留白、光學重心和顯示尺寸與既有圖示一致。以一個主要形體和最多一個簡明輔助符號辨識概念，避免裁切、過密、交疊造成的歧義。保留既有不同方案 accent、主入口選中狀態及真實 HTML 文字標籤。
- [ ] 先在實際卡片尺寸繪製並比較原／新圖示；不要只在放大 icon 預覽中判斷。先對照屋主與房客兩張、個人／社會住宅方案以及租金補貼／租金標準的相似語意，再確認與同組其他圖示一致。允許 Agent 迭代構圖，但不以全站重繪或新增說明文字掩蓋辨識問題。
- [ ] 從來源重新生成 `index.html`；若有必要只調整相關測試或新增針對性測試，不改模板、CSS、既有背景、卡片配色、尺寸、文案、排列、外部連結、政策、互動、GA4、Messenger、CX、R2 或部署設定。任何超出四圖示的 UI 變更先回報。

## 3. 驗收與交付

- [ ] `npm run build`、`node scripts/build.mjs --check`、`npm test`（基準 68 項）、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`、`git diff --check` 通過。測試確認 16 個 SVG 正常渲染、四 key 仍各自不同且只四個定義改變、其他十二個保持原樣、建置輸出同步及 Pages 33 檔、GA4 隔離不變。
- [ ] 以現有 `scripts/visual-consistency-browser-check.cjs` 或等效的針對性瀏覽器檢查，至少核對 1440、390、320px 與 200% 字級；首頁屋主／房客主卡、屋主四方案、房客三卡的實際畫面及選中狀態，確認辨識、對齊、無裁切、無重疊與無溢出，並確認原卡片／外部連結／鍵盤及既有導航功能未受影響。可用既有五寬度測試。不得向真實 CX 送題或污染 GA4。
- [ ] 機器測試僅能驗證技術與視覺結構；辨識度須由使用者看實際網站確認，不能以測試通過替代人工核定。截圖可存在 Git 忽略的 `.preview/` 供當輪檢視，絕對不提交 GitHub；僅提交必要文字／JSON 測試證據，供後續在 Cloudflare 測試站人工確認。
- [ ] 更新本 Task checklist、State、Worklog；commit/push 原指定分支，核對遠端 SHA、既有 Cloudflare 自動建置與實際線上版本（若無法讀回／實測，明列 BLOCKED，不冒稱完成）。回報四個圖示實際設計、變更檔案、commit、測試與測試網址，保留既有實機／業務驗收待辦。未獲授權不 merge main、不正式部署、不改雲端或管理端設定。純 Repo 任務不掃描 Drive。
