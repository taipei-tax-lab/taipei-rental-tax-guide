# Final QA — QA-01～06

日期：2026-11-17（Asia/Taipei）。指定分支 `feat/direct-apply-operation-guide-20261031`。安全同步至任務文件 `40fcd91f83939e648a8d5c18396a5db3c2ece738` 後實作；未切分支、合併 main、製作正式包或修改 CX／GA4／R2／Cloudflare 設定。本報告為開發與測試證據，交 GPT 差異審查及使用者核定。

## 方法與前後對照

舊版以 `git archive 40fcd91` 放入忽略目錄 `.preview/finalqa/baseline`，獨立 build Pages 及本機 4176；新版由本工作樹 build Pages、4175 提供。Chromium 自動化操作實際 DOM／Shadow DOM，不把 mock 或「無橫溢出」視為可讀、可點擊的證明。所有截圖、暫存 profile、書表原檔只留 `.preview/`。

| 項目 | 修正前實測 | 修正與修正後驗證 |
| --- | --- | --- |
| QA-01 短視窗 | 真實 vendor shell 在 844×390、667×375、844×399，launcher 雖有 84×84 rect，但 hit-test=false；titlebar 隱藏，實際無可用關閉控制。 | 只在 height<400 的聊天視窗頂部加入本站原生「關閉小幫手」button；正常高度保留原 launcher。短窗控制約 105.3×44，hit-test=true；真實 touch／鍵盤 Enter 關閉、aria-expanded=false、launcher 恢復且焦點返回。含 399/400/401 邊界、390 直向、1440 桌機，以及開啟中 390×844→844×390 旋轉後觸控關閉、轉回。 |
| QA-02 面板背景 | computed background `rgba(0, 0, 0, 0)`。 | 使用已定義 `--paper`，computed `rgb(243, 240, 233)` 不透明；桌機面板實際可見，保留內容／外框。 |
| QA-03 字級 | 根字級 200% 時內文 18→36px，但首頁／申請標題仍 28px。 | 僅調整 V2 標題及關鍵 UI 的固定 font-size，使用相同預設值的 rem。100/150/200% 標題為 28/42/56px、書名內文為 18/27/36px。另以獨立 Chromium profile 原生 page zoom 100/125/150/200%，驗證 DPR、導覽定位與歷史；另列等效 CSS viewport，兩種測試不混用。 |
| QA-04 狹欄 | 701px／200%：首書名欄寬 111.67px、書表高 1857.72px；頁尾文字欄寬 36.55px、頁尾高 1358.5px，當時 overflow 仍為 0。 | 書表依容器 em 寬度堆疊、格式按鈕維持既有淺綠；頁尾中間寬度單欄。相同條件首書名欄 401.95px／書表高 1214.16px；頁尾欄 645px／高 573.77px。首書名文字行數 4→1；長書名另存逐項寬度／行數。1440／100% 的書表高 358.5625px、書名欄 200.96875px、頁尾高 238.984375px 均與舊版相同。 |
| QA-05 浮動遮擋 | 390px 真實 vendor 的角色圖 132×132 超出 72×72 容器，圖像右緣 406px 超出 viewport。該次選取的「申請」中心 hit-test=true，**沒有宣稱重現每一個 AGY 點擊失敗**。 | 保留同張角色圖，限制在 84／72px launcher 內；host 不攔截透明範圍，只有實際按鈕／聊天視窗接受 pointer。閉合 launcher 隨捲動／resize 避開可見連結、button、summary，右緣找不到安全位置時暫藏，下一次捲動／resize 有空間即恢復；首頁快捷開啟入口保留。五寬度×兩字級×首頁／書表，逐個必要入口在底端壓力位置做 elementFromPoint 與真實 tap，攔截導航，不送件。正常開合、角色提示保留。 |
| QA-06 一致性 | 未定義 `--v2-ink`；空 textarea 仍沿用 vendor overflow。FAQ 名稱不一致。 | 條件列表使用 `--ink`；空 textarea overflow-y=hidden，有多行草稿時 auto，保留原文字及輸入事件。只改 FAQ 名稱為「出租房屋所得達租金標準」；政策來源、期限與 2026-09-08 實際核對日期保留，由來源重建 HTML。 |

上述尺寸是本環境實測，不冒用 AGY 的另一組字型／環境量測值。修正前讀回見 [before-chat.json](before-chat.json)、[before-layout.json](before-layout.json)；新版見 after 與 live 檔案。可視對照 `.preview/finalqa/{before,after}-short.png`、`{before,after}-701.png` 不納入 Git。

## 測試與重現

建置：`npm run build`、`node scripts/build.mjs --check`、`npm test`（原 73 項保留，新增 2 項，共 75/75）、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`（33 檔／GA4 關閉）、`git diff --check`。對應本目錄 build/check/tests/budget/pages 文字輸出。

本機瀏覽器：

- `node scripts/final-qa-layout.cjs`：320/390/700/701/720/768/900/1024/1440 × 100/150/200%，27 組標題與內文比例、書名／頁尾可讀欄寬、書表實際高度、長書名行數。原始窄欄能被新增欄寬斷言捕捉。
- `node scripts/final-qa-chat.cjs`：載入真實 Google 靜態 vendor shell，只有本站與 www.gstatic.com 可讀，**全部 CX/API 請求封鎖**；不發問、不新增真實對話。不以直接 closeChat 取代新版使用者操作。7 組尺寸＋1 組旋轉＋20 組入口壓力情境；空輸入／多行草稿、opaque computed style、正尺寸與實際命中／tap／keyboard／焦點均有斷言。舊版僅為退出不可關閉的 baseline，才直接呼叫 closeChat。
- `node scripts/rwd6-check.cjs`：前輪完整 212 組 route／viewport／100/200% 守門保留；另有上述可讀與操作測試，不只量 scrollWidth。`node scripts/rwd6-chat-check.cjs` 補真正 close button click，mock 只證明本站 geometry adapter，不代表 CX。
- `BROWSER_EXECUTABLE=/usr/bin/chromium PREVIEW_URL=http://127.0.0.1:4175/ node scripts/entry-scroll-check.cjs`：48 組 viewport 等效縮放、16 組 Chromium 原生 page zoom（含 200%）、5 組鍵盤／返回前進／閱讀位置驗證。
- `scripts/forms-browser-check.cjs`：三寬度×兩字級、房客獨立展收、申請等高／背景／焦點；六入口原生啟動，兩 ODT 下載完成、四 PDF 新視窗 HTTP 200。`node --use-env-proxy scripts/forms-public-check.mjs` 正常 TLS 六檔匿名 GET、精確大小與 PDF／ODT 格式通過，未提交原檔。
- `scripts/entry-redesign-browser-check.cjs`：四寬度入口／導航／歷史與既有 GA4 mock 事件通過。補等待目的頁可見後再歷史／reload，保留原斷言，避免測試先於 render 的競態。
- `scripts/extension-browser-check.cjs`：五寬度、兩支真實 R2 影片 Range 206／metadata／play／seek／原生 fullscreen／切換離頁暫停／phone-tablet 預設及歷史通過；設備名稱僅 Chromium 模擬。
- `scripts/pages-live-acceptance.cjs`：本機與部署後 HTTPS 非 CX 全站／鍵盤／導航／書表入口／33 資產 MIME／私有路徑 404／零 GA4 回歸。第三方官方網址連網結果獨立列出，不由網站回歸 PASS 推論可申辦。

執行需環境既有 Playwright／Chromium；指定 `PREVIEW_URL`、`BROWSER_IGNORE_HTTPS_ERRORS=1`，舊工具另需 `BROWSER_EXECUTABLE=/usr/bin/chromium`。`EVIDENCE_DIR=.preview/...` 可分離新版專項結果。真實 vendor shell 與外部媒體瀏覽器測試使用明示 CA 診斷模式（ignoreHTTPSErrors）；**不作正常 TLS 驗收證據**。正常 TLS 的六檔 GET 及部署後 33 檔逐 bytes／MIME 核對獨立保存，未關閉 Node 憑證驗證。

## 部署核對

本機通過後沿用既有分支 push，自動觸發現有 Cloudflare Pages 整合。精確 runtime SHA、deployment／GitHub check、HTTPS 重跑與正常 TLS 結果於收尾補入；不更動部署設定。

## 剩餘限制與後續

- iOS／Android／LINE 真實硬體、虛擬鍵盤、真實 CX 問答、輔助科技與真人業務驗收未執行，不宣稱完整無障礙認證。短窗及浮動策略依目前 vendor Shadow DOM；日後 Google 更改內部結構需再跑本輪專項測試。
- 高字級滿屏皆為操作區而右緣沒有安全空位時，浮動 launcher 暫藏以保留必要操作；捲動後自動恢復，首頁快捷入口仍在。這是本輪避擋策略，請 GPT／使用者檢視體驗。
- BX015／BX004 SPA、內政部租金資訊及其他官方連網／申辦內容仍待臺灣一般瀏覽器人工查閱；保留核定 URL，不憑單一 404／逾時更改、不填表或送件。
- 正式交付包（同站六書表／兩影片、CSP／MIME／Range／快取／GA4／OG／CX 網域）及機關正式上線另案處理；本輪未執行。
