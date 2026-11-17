# NEXT_TASK — 2026-11-17 上線前最終品質修正（Final QA）

狀態：**APPROVED_PENDING_IMPLEMENTATION**（2026-11-17，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
審查基準：`05f096d7d4ba3088bf025ddb2af07ecc70f9c091`（runtime `b9b3e19e3f765b42d0691f8c7e27ce9c7197c751`）。[第六輪完整 Task 與驗收（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/05f096d7d4ba3088bf025ddb2af07ecc70f9c091/docs/NEXT_TASK.md)、[證據](evidence/2026-11-17-rwd6/REPORT.md)。

## 1. 目的與證據

AGY 獨立唯讀審查後，使用者核定本輪計畫文件交 Coding Agent 實作。這是既有改版的最後針對性品質修正，不是重新設計、正式交付包或正式發布。以現有已核定視覺、功能、資料及前輪 73 項單元／212 組 RWD 測試為基準；原先無橫溢出不代表可讀、可操作。AGY 報告以 Chromium 診斷與正常 TLS 讀回分層記錄，GPT 另核對現行程式原因；未宣稱真實 iOS／LINE／CX 問答或人工驗收。

## 2. 本輪必修

- [ ] **QA-01 短視窗小幫手可關閉（AGY P1-3）**：`assets/js/messenger-ui.js` 的 shortViewport（height < 400）會隱藏展開時的 launcher，而 hideChatTitlebar 隱藏 vendor titlebar；AGY 在 844×390 觀察到兩者皆不可用。提供實際可見、可觸控、鍵盤可達、有明確可及名稱及焦點的關閉控制。可選適當的本站控制或確實可用的原生控制，避免重複控制、遮擋輸入或回覆；保留正常直向／桌面開合、縮放與 resize、鍵盤返回焦點、聊天狀態與既有 session 行為，不新增對話或發問。既有 chat-viewport-check 不能只比對零尺寸元素的座標，rwd6-chat-check 不得以直接呼叫 closeChat 代替使用者操作：新增真正 pointer/touch/鍵盤關閉、正尺寸、可見、hit-test 及閉合後 launcher 恢復斷言。覆蓋 844×390、667×375、390px 直向、399/400/401 高度邊界、desktop，開合後 resize／旋轉，避免只測 mock 的內部函式。
- [ ] **QA-02 小幫手背景（P1-4）**：`messenger-ui.js` 的 .assistant-panel 使用未定義的 --cream，造成可能透明及下層文字重疊；改用現行確實定義且符合既有風格的不透明色彩 token（例如 --paper，依實際 computed style 確認），保留原外框、內容與功能。驗證面板展開時 computed background 不透明且文字不與頁面重疊，不能只檢查 CSS 字串。
- [ ] **QA-03 文字放大（P1-5）**：核對實際標題與關鍵 UI 的 font-size，修正須隨本站字級調整的固定 px 規則（如 h1/h2），以相等預設字體尺寸的 rem 或現有字級 token 實作。保持預設排版層級、可讀性及操作，不全域機械改單位、不縮小本文或禁用縮放。分別測試本站字級控制/根字級 100–200%（含中間等級）與瀏覽器 200% zoom／等效 CSS viewport（明示實際或模擬），不能把兩者混為同一項。量測標題及內文實際字級的比例、裁切與換行。
- [ ] **QA-04 中間寬度與大字級排版（P1-6）**：AGY 於 701px × 200% 字級發現 .v2-form-group 的書名可用欄寬約 74.8px、書表區異常高度約 1166px；頁尾文字欄寬約 36.5px、高度約 1094px，中文被擠成近單字一行。定位書表 grid/flex、固定欄與頁尾 grid，使用內容可讀性導向的彈性換欄／堆疊，不硬保留兩欄，不以 overflow hidden 或縮字遮掩。桌機 100% 維持第六輪核定的緊湊書表與淺綠按鈕設計；留存前後量測及截圖（僅 .preview/）。測 320、390、700、701、720、768、900、1024、1440px × 100/200%，重點頁加中間字級；驗證長書名、頁尾、按鈕群實際可用寬度／行數及閱讀順序，無非必要逐字換行、遮擋或異常拉長。斷言須能捕捉原始失敗，不僅是 scrollWidth。
- [ ] **QA-05 浮動小幫手遮擋（P2-1）**：AGY 在 390px 發現 launcher 圖像實際框約 132px、容器約 72px，與首頁「申請」按鈕區重疊。核對實際視覺框、點擊框與 pointer-events，保留既有角色、提示及辨識度，局部調整尺寸／位置／安全留白與 hit region。至少在 320、375/390、414px、手機橫向及大字級時確認首頁「試算」「申請」、其他卡片與書表可達；使用 elementFromPoint 及真實點擊/觸控驗證，攔截外部導航以免送件，不能只比對元件框或要求民眾額外繞操作。允許浮動元件在捲動過程與純內容視覺重疊，但不得阻斷必要操作；不重新設計角色。
- [ ] **QA-06 低風險一致性（P2-3／P2-4）**：`guide-v2.css` .v2-conditions li 使用未定義 --v2-ink，改用實際定義等效 token；核對小幫手空 textarea 不應有不必要的捲動/溢出（若可局部修正，亦保留多行內容、鍵盤、輸入可讀性與原功能）。`scripts/build.mjs` 指定 FAQ 的「出租達租金標準」統一成「出租房屋所得達租金標準」，與已核定首頁名稱一致；只改名稱，不改申請規則、期限、政策來源或 2026-09-08 實際業務核對日期。由來源重建 index.html，保留其餘已核定內容。

## 3. 不納入實作／後續交付

- AGY P1-1 正式機關部署與測試站差異，非本輪 rwd runtime 缺陷。後續另案製作正式靜態包：六份書表（四正式格式、兩 PDF 範例）及兩支影片使用同站相對路徑、納入必要資產與白名單，保留正式 GA4、正確正式 OG、CX domain；資訊室驗收正確 MIME（ODT/PDF/MP4/WebP）、MP4 206 Range、必要 CSP（Google Fonts/CX/必要資料圖示，最小權限，不放寬至任意來源）、HTML 更新快取、真實正式站問答。AGY 於舊機關站確認九 WebP 已由 404 改為 200，但仍是舊 main，不能以此視為本輪部署完成。這些事項保留在 State；本輪不改正式包、R2 URL／object／metadata 或 Cloudflare、GA4、CX 設定。
- AGY P1-2：BX015、BX004 HTTP 404 可能為臺北服務通 SPA 行為；內政部租金資訊逾時。保留現行已核定網址，待臺灣一般瀏覽器實際查閱頁面標題和申辦內容，不填表／送件；未確認前不改網址，不以 HTTP status 單獨判斷失效。
- P2-2 radio 已有 label 點擊區等，不全面改所有 inline 連結大小；P2-5 非必要的視覺／裝置辨識微調、P2-6 CI 與 GitHub Pages 文件公開範圍評估、P3 歷史 CSS／結構清理留後續核定；不順手重構。若重點修正帶來其他實際回歸可在範圍內排除，其他新問題列證據與待確認。

## 4. 驗收與收尾

- [ ] 依 AGENTS / Workflow 辨識環境，確認遠端分支最新 SHA、工作樹清潔及安全同步；純 Repo 工作不掃 Drive。保持主卡、三申請管道、房客獨立展收、六書表連結、兩影片、既有 GA4 事件及測試隔離、CX／政策不變（QA-06 指定文句除外）。程式之外不修改雲端設定。
- [ ] 先重現可重現的 AGY 問題（在舊基準或獨立暫存），記錄 before/after、route、viewport／字級／操作與精確測試結果。補強既有測試且不刪減前輪有效守門。實作、單元與瀏覽器檢測、真實測試站及實機/人工/業務驗收分層；mock 只證明本站行為。有能力可讀取真實 vendor shell 不送真實 CX 問題；外部 CA/連網限制記錄為待驗，不偽造通過。
- [ ] npm run build、node scripts/build.mjs --check、npm test、node scripts/performance-budget.mjs、node scripts/build-pages-test.mjs、git diff --check；保留 73 項及新增斷言，Pages runtime 白名單與 GA4 隔離。重跑第六輪全站 212 組或涵蓋相同範圍的增強矩陣，再加 QA-01～QA-06 上述針對性場景。地方／HTTPS 回歸含首頁與導覽/歷史/鍵盤、房客獨立、書表六連結與公開 GET（正常 TLS）/實際原生啟動、影片控制/切換/離頁、非 CX 33 資產、GA4 mock 及測試站零 GA4。實際瀏覽器量測、點擊及可讀性檢查，不以單元全過替代。
- [ ] 更新 Task/State/Worklog，文字及不含敏感資料的 JSON/log 放 docs/evidence/，截圖／錄屏／下載原檔僅留 .preview/ 不提交。Commit/Push 既有授權分支，確認遠端 SHA、既有 Cloudflare 自動建置及實際測試站以精確 runtime 比對，正常 TLS 與診斷模式分開。未能執行真實設備或第三方功能須逐項列出限制；不以 Chromium 模擬證明真實 iOS/Android/LINE，不作完整無障礙認證。
- [ ] 回報每項 QA-01～06 的修正、測試原失敗與修正後證據、未解問題、branch／commit／部署驗證，交 GPT 差異審查及使用者核定。禁止自行合併 main、製作正式交付包、正式部署或擴大功能；本輪完成後才決定是否進入下一階段。
