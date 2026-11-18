# NEXT_TASK — 2026-11-18 恢復右下角「點我問！」原比例

狀態：**APPROVED_PENDING_IMPLEMENTATION**（2026-11-18，Asia/Taipei）。
指定分支：`feat/direct-apply-operation-guide-20261031`。
開工基準：`ced60bd7c08073feb5bfaaf6c46e5d7f784728fe`，runtime `25c41223419e2c30929e3d9337f6e1b04a5b404d`。
前輪 [Task 固定 SHA](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/ced60bd7c08073feb5bfaaf6c46e5d7f784728fe/docs/NEXT_TASK.md) 及 [收斂驗收報告](evidence/2026-11-18-claude-closeout/REPORT.md) 保留。

## 1. 使用者核定需求

使用者實際檢視新版桌面截圖，認為右下角「點我問！」與角色圖示修得太小，要求恢復原有比例。只調整閉合的小幫手入口，不改圖像內容、聊天窗、網站其他版面或業務功能。

GPT 核對縮小前 `05f096d7d4ba3088bf025ddb2af07ecc70f9c091` 與 QA 修正 `80f0d46` 的實際 diff：`assets/css/messenger.css` 將桌機 `--df-messenger-chat-bubble-icon-size` 由 150px 降為 84px，560px 以下由 132px 降為 72px；`--df-messenger-chat-bubble-size`（84/72px）本身未改。另在 `installShortClose` 注入 `.bubble .icon img` 的 max-width/height 100% 限制。此縮小仍存在於目前 runtime。

## 2. 只做本項修正

- [ ] 以縮小前 `05f096d` 真實畫面、實測尺寸為參考，恢復完整原角色 PNG（含「點我問！」字樣）的視覺尺度及長寬比：桌機原 150px、手機原 132px 設計，不能只改 CSS 變數卻仍被 Shadow DOM max-width/height 限制。原圖、樣式辨識與右下角定位不重繪、不裁去文字、不以拉伸變形取代。桌面有安全空間時必須呈現原比例；手機也以原比例為正常狀態，不以全局縮小回避問題。
- [ ] 保留前輪 QA-05 的必要操作不被遮擋。不要直接回退整個 CSS/JS；區分角色圖的實際可見邊界與可點擊按鈕的 hit region（原 84/72px，可依實際行為局部調整以確保角色本身可操作）。透明容器/圖像不可攔截其他控制；以可見圖像及實際 hit-region 的幾何檢查角色、提示字樣、視窗邊緣與必要操作的交疊。必要時調整安全位置，使畫面完整且操作可達；空間確實不足沿用暫藏/恢復保底，不以全域縮圖、任意覆蓋申請按鈕或大幅改版換取通過。若無法兼顧狹窄視窗與原圖比例，具體呈報衝突情境，不自行推翻核定尺寸。
- [ ] 保留 CQA-01 隱藏側面板零圖片請求（與 launcher 圖分開）、真實 vendor 開合、短窗關閉、鍵盤焦點與前輪避擋規則；不改 CX、GA4、外部服務、正式站或 GitHub Pages。

## 3. 驗收及收尾

- [ ] 先安全同步原分支最新文件；用同一真實 vendor shell/viewport/字級比對縮小前、目前及本輪後的圖片與按鈕矩形、實際畫面及透明 hit 區。至少 1440×900、1892×873（使用者截圖相近）、320/390/414 直向、844×390 橫向、560/561 邊界，100/150/200% 字級重點情境。確認原比例確實恢復而非只設定 token；有安全空間時完整可見、角色點擊能開啟，不溢出視窗。首頁與直接申請及主要書表/導航做捲動、實際 touch、elementFromPoint、鍵盤、短窗開合與旋轉回歸；比較前輪隱藏/跳動量測，如有惡化如實回報，不能只以 mock 或無橫向溢出認定通過。不要發送真實 CX 問題／申辦。
- [ ] 保留現行 75 項測試有效斷言，更新因核定尺寸改變而需調整的測試，增加實際視覺尺寸及 hit region 守門。執行 npm run build、node scripts/build.mjs --check、npm test、performance-budget、build-pages-test、git diff --check；重跑風險相稱的 RWD、final-qa-chat、claude-closeout-browser 的 launcher/controls 與 images-only，確保窄屏隱藏側面板仍零專屬圖請求。若使用診斷 TLS 或 mock 要明確分層。保留前輪已核定全部功能。
- [ ] 依 Workflow 記錄文字/JSON/log 於 docs/evidence/2026-11-18-launcher-scale/；截圖只在 .preview/。更新 Task/State/Worklog，Commit/Push 既有功能分支，確認遠端及原 Cloudflare 測試站自動建置，正常 TLS 33 檔 bytes/MIME 與產物一致、GA4 隔離；實際 HTTPS 針對性回歸，回報未驗項。交 GPT 審查及使用者確認視覺比例。
- [ ] 不合併 main、不製作正式包、不改任何平台設定；前輪延後事項（GitHub Pages／私有化與 Cloudflare 未來遷移、CI/無障礙、機關正式交付、實機、CX、人工業務及 URL 核驗）不變。
