# 資訊室處理清單 — 出租專區 2026-10-28

診斷已完成；**本輪沒有修改網站／伺服器／GCP，以下尚未執行**。完整依據見 [技術報告](2026-10-28_official_deployment_diagnosis.md)。

## 優先處理

- [ ] **P0／CSP 通訊**：機關頁面允許載入 Messenger，但 CSP 未允許 `https://dialogflow.cloud.google.com` 通訊。四個快速問題及手動送出都在瀏覽器被攔截；按鈕本身有呼叫 sendQuery。於 `/rentaltax/` 有效 policy 增加精確 connect-src 來源，保留該頁既有必要來源及其餘安全防護。不要停用整站 CSP，也不要靠新增另一份寬鬆 header 試圖覆蓋既有 policy。
- [ ] **P0／九個 WebP 404**：先確認 `/rentaltax/` 實體目錄有原檔，再查 404 子狀態／副檔名／request filtering。若是 IIS 404.3 且檔案存在，才處理 `.webp → image/webp` 的必要 MIME 映射；若漏傳，僅補原交付檔案。本輪沒有取得實體目錄，不能直接斷定漏檔或 MIME。
- [ ] **P1／樣式與手機圖片**：實際 CSP 同時擋住 `https://fonts.googleapis.com` CSS 及現有 `data:` GIF 佔位圖。依需要設定 style-src／style-src-elem 和 img-src；保留既有 self、gstatic、inline 樣式需求。字型若續被攔，再依實際 URL 評估 font-src `https://fonts.gstatic.com`，不要以萬用字元開放。
- [ ] **P1／CX 管理者唯讀確認**：核對 Messenger Integration 的 Environment 是否確為 Production，三個授權域是否正確保存：`taipei-tax-lab.github.io`、`services.arpa.tpctax.dof.gov.taipei`、`tpctax.gov.taipei`。10/28 使用者已回報更新，但本輪未讀到私有 Integration。Production 本身與 Rental 已 GET200、版本對應符合基準。先處理 CSP，再以實際回應確認是否另有403/CORS問題。

## 檔案核對基準

既有交付 ZIP（未重新打包）：[Actions run 39565683012](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/39565683012)，main `d5fad9e52acdb6c8f46495903f9f9dfbdb3c8c1e`，30 檔，6,822,027 bytes。

SHA-256：`baa620efeeeaff3626f8fa305fbed06785a4ef85e94b1d92fda7f38d6200e2d4`。

機關 URL base：`https://services.arpa.tpctax.dof.gov.taipei/rentaltax/`。

| 必須取得的相對路徑 | 目前 | 修後要求 |
|---|---|---|
| `hero-v2.webp` | 404 | 200，image/webp，內容符合 manifest |
| `assets/images/income-standard-card.webp` | 404 | 同上 |
| `assets/images/income-standard-illustration.webp` | 404 | 同上 |
| `assets/images/assistant/assistant-idle.webp` | 404 | 同上 |
| `assets/images/assistant/assistant-welcome.webp` | 404 | 同上 |
| `assets/images/assistant/assistant-thinking.webp` | 404 | 同上 |
| `assets/images/assistant/assistant-responding.webp` | 404 | 同上 |
| `assets/images/assistant/assistant-guiding.webp` | 404 | 同上 |
| `assets/images/assistant/assistant-error.webp` | 404 | 同上 |

相對路徑已正常保留 `/rentaltax/`。對應 PNG、LOGO、現行 favicon、CSS/JS 可正常取得，無須整包改路徑。`favicon.svg`、assistant manifest JSON、舊 site-enhancements.js 未被現行頁面引用，也不在原交付 ZIP；不要因這三個探測404就要求補傳。`.nojekyll` 為 Pages 專用標記。

逐檔大小與 SHA：[deployment-manifest.json](evidence/2026-10-28/deployment-manifest.json)、[原 ZIP 比較](evidence/2026-10-28/original-zip-comparison.json)。伺服器檔案清單／IIS 日誌請私下保存，對外只提供去識別化結論。

## 複測標準（資訊室與前端／CX 管理者共同執行）

- [ ] 記錄調整時間、有效 response headers、設定範圍；全新瀏覽器 context 或停用快取載入。HTML 現為七天快取，避免沿用舊 header；不要只在既有分頁按一次重新整理就驗收。
- [ ] 桌機 1440px／手機 390px：LOGO、首頁適用圖、人物及浮鈕正常；手機側欄原本隱藏，不要求顯示桌機人物。
- [ ] 九個 WebP GET200、正確 Content-Type、非 HTML 錯誤頁、大小／SHA 符合基準。
- [ ] 屋主／房客切換、四方案及返回、比較、官方窗口、快速判斷可操作，無橫向溢出。
- [ ] 開啟、關閉、重開小幫手，對話與按鈕可用，沒有多份輸入附加區。
- [ ] 逐一點「租金補貼／出租房屋租稅優惠／申請流程／房客權益」，再手動送出「公益出租人的房屋稅優惠是什麼？」。每題等結果再送下一題；無個資、少量即可。
- [ ] 每題 `df-request-sent` → 真實 Google POST HTTP200 → `df-response-received` → 非空文字實際呈現；不能只看 DOM 或送出事件就判通過。
- [ ] 不再出現已知 dialogflow.cloud.google.com connect-src、Google Fonts style 或手機 data image CSP violation。若仍失敗，提供目標 origin、status／blocked reason；不要提交 Cookie、session 或完整 HAR。
- [ ] 桌機人物 idle／welcome／guiding／thinking／responding 隨正常操作切換；錯誤處理用受控本機測試另驗，不以改正式 CX 製造錯誤。
- [ ] 首題 currentPlaybook 正確，後續題移除，runtime/timeZone 符合既有 contract。Session 自然到期另驗證，不沿用本輪「未測」作 PASS。
- [ ] 若解除 CSP 後才出現 Google403、CORS或錯誤環境證據，再交 CX 管理者判定；不改本站 ACAO 代替 Google 端回應、不放寬成 `*`。

## 尚待補充

伺服器檔案清單、404 子狀態／request filtering、Integration 私有設定、機關內網代理差異、實體手機及其他瀏覽器均未取得完整證據。另有 Drive 全量同步程序未確認、CX 離線全套 192 PASS／24 FAIL，屬專案維護事項，不能當成目前網站根因。
