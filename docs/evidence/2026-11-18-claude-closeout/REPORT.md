# 2026-11-18 Claude 複審後收斂驗收

工作分支為 `feat/direct-apply-operation-guide-20261031`，以遠端乾淨的 `de600f52d17c9b07105938ac41abc002b008a31c` 為基準。實作提交為 [25c4122](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/commit/25c41223419e2c30929e3d9337f6e1b04a5b404d)。

## CQA-01 角色側面板圖片

預先建立的面板沒有圖片 URL。聊天實際展開且面板具備可見幾何位置後，才對當前狀態寫入 WebP 來源和 PNG 備援。移除一次載入六個狀態的預載。狀態事件與 reset 仍更新文案與狀態，延遲換圖也經過同一份面板可見判斷。跨回可見尺寸時，畫面同步當前狀態。重複定位不重寫相同狀態的 URL。

每組使用新的 Chromium context，停用 HTTP 快取。CDP 記錄角色圖 URL、觸發階段、initiator、HTTP 狀態和 transfer bytes。原版在 320×640、390×844（100/200%）、844×390、899×900、900×519 的初載與開啟階段，各發出 6 個 WebP 請求，共 1,498,656 bytes。修正版在上述各情境的隱藏階段為 **0 請求、0 bytes**。900×520、900×900、1440×900 開啟後面板可見，首次開啟只請求 welcome 圖片。後續使用熱門問題、合成事件及計時器覆蓋 guiding、thinking、responding、error、idle，並在開關／重開時核對當前狀態。390×844 200% 開啟中往返 900×900，以及縮短與橫向旋轉，只有恢復可見時載入當下狀態。每組確認浮動入口本身圖片載入。

- [原版請求與階段](before-images.json)
- [修正版請求與階段](after-images.json)
- [測試站請求及面板幾何](live-images.json)

## CQA-02 浮動入口

使用 Google 靜態 Messenger 元件。每 32 CSS px 捲動抽樣，分別往下及往上，覆蓋首頁與直接申請、320/390/414 三種直向手機、844×390 橫向及 1440×900 桌機，各為 100/150/200% 字級。每一筆記錄捲動位置、按鈕矩形、可見性、必要控制矩形相交與實際命中。最大跳動是相鄰兩筆皆可見時的位移。隱藏跨度以連續抽樣首末的捲動差計算，與使用者停留時間無直接對應。

| 量測 | 原版 | 修正版 |
| --- | ---: | ---: |
| 隱藏樣本 | 2,748 / 8,702 | 2,748 / 8,702 |
| 相鄰可見點最大跳動 | 756 px | 756 px |
| 最長連續隱藏捲動跨度 | 6,240 px | 6,240 px |
| 隱藏後恢復次數 | 98 | 98 |
| 相鄰可見點有移動的次數 | 2,776 | 2,776 |

30 組本機前後及測試站樣本逐筆相同。最大跳動出現在 414×896、150% 的直接申請頁，最長隱藏段出現在 320×640、200% 的首頁（460 / 874 筆隱藏）。所有樣本的可見按鈕均可命中，且無相交。隱藏時同一位置無 launcher 命中，回到安全位置可再次操作。刻意將鍵盤焦點留在 launcher 再捲過無安全位置時，Chromium 會移除焦點，按鈕回復可見時不自動搶回焦點。各環境的過程記錄見 controls JSON。

以隔離副本試驗保留上一個可用位置。僅在首選位置已向上避讓、前一位置相差不超過 36px 且仍無控制重疊時保留。八組試驗涵蓋 320×640、844×390（200%）及 390×844、414×896（150%），各有首頁與直接申請。移動次數從 1,048 降為 821，但相鄰可見點位移達 60px 的次數從 64 增至 286。最大跳動仍是 756px，最長隱藏跨度仍是 6,240px，隱藏樣本逐組相同。
此次保留原避擋與無安全位置暫藏策略。探測有無安全位置時優先保留試算、申請、申辦管道、書表與導覽的操作區。若要縮短大字級首頁整段暫藏，仍需使用者決定操作入口放置方式。

額外壓力測試重複 85 次實際輕觸與 85 次 Enter，涵蓋首頁直接問入口、試算／申請、三個申辦管道、六個書表及導覽。以 elementFromPoint 核對可見點，再觸發事件並攔下導覽，避免送出申辦或發問。短窗關閉及關閉後返回焦點由 [真實元件關閉回歸](live-chat.json) 試驗。

- [原版逐筆位置](before-launcher.json) · [修正版逐筆位置](after-launcher.json) · [測試站逐筆位置](live-launcher.json)
- [原版操作與焦點](before-controls.json) · [修正版操作與焦點](after-controls.json) · [測試站操作與焦點](live-controls.json)
- [有限位移試驗 200%](trial-launcher.json) · [有限位移試驗 150%](trial-wide-launcher.json)

## 本機與測試站回歸

本機依序通過 `npm run build`、`node scripts/build.mjs --check`、`npm test`（75/75）、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`、`git diff --check`。面板定位的文字守門隨計算位置調整，保留左緣幾何約束，另以實際瀏覽器查驗面板緊貼聊天框及頂緣對齊。第一次執行的舊文字守門仍比對舊賦值寫法，調整後完整重跑 75 項通過。[本機建置與測試紀錄](local-build.log)

Cloudflare 自動建置在實作提交 `25c4122` 回報成功，deployment `29f3d1d9-e241-456a-b063-1a083c7b8737`。以正常 TLS 逐一讀回測試站 33 個白名單檔案，bytes 與 MIME 全數符合本地建置，包含停用 GA4 的 HTML。[實作提交 Cloudflare 檢查](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/commit/25c41223419e2c30929e3d9337f6e1b04a5b404d/checks) · [正常 TLS 結果](live-normal-tls.json)

測試站瀏覽器通過 212 組 [RWD](live-rwd212.json)、27 組 [字級與可讀性](live-layout.json)、29 組 [Messenger 控制與 160 次觸控](live-chat.json)、[六書表原生啟動](live-forms.json)、[導覽及六個模擬事件](live-events.json)、[歷史／鍵盤／焦點](live-ux2.json)、[兩影片播放／拖曳／全螢幕／Range](live-video.json) 及 [非 CX 全站回歸](live-noncx.json)。[測試站隔離檢查](live-pages-test.json) 記錄零 GA4 請求及私有路徑 404。該檢查首次未帶 HTTP 代理，Playwright API 讀取 404 路徑失敗；沿用環境代理後重跑通過。BX015 唯讀請求回 404，另兩項抽測外部稅務連結為 200。

## 重現

本輪以 Chromium 156.0.8078.79 執行。Playwright 為瀏覽器驗證依賴，網站本身以 Node 20+ 建置。分別以 `git archive de600f5` 展開的原版和目前工作樹執行 `npm run build:pages:test`，再以不同 `PORT` 執行 `node scripts/serve.mjs --pages-test`。

```sh
PREVIEW_URL=http://127.0.0.1:4176/ EVIDENCE_DIR=.preview/closeout/before \
  node scripts/claude-closeout-browser.cjs --baseline
PREVIEW_URL=http://127.0.0.1:4175/ EVIDENCE_DIR=.preview/closeout/after \
  node scripts/claude-closeout-browser.cjs
PREVIEW_URL=https://rental-tax-guide-test.pages.dev/ EVIDENCE_DIR=.preview/closeout/live \
  node scripts/claude-closeout-browser.cjs
node --use-env-proxy scripts/final-qa-live.mjs
```

可加 `--images-only` 或 `--launcher-only` 重跑單一量測。額外的操作與焦點驗證在三個環境各以相同指令加 `--controls-only` 執行。雲端 Chromium 以 `BROWSER_IGNORE_HTTPS_ERRORS=1` 開啟瀏覽器憑證診斷，正常 TLS 的 33 檔比對獨立執行。瀏覽器只允許本站 GET 和 Google 靜態 Messenger 資產。狀態事件是合成事件，熱門問題以測試替身接住，沒有實際 CX 發問。觸控、橫向及文字放大均為 Chromium 自動化。截圖及原件只保存於 Git 忽略的 `.preview/`。

既有 iOS／Android／LINE、輔助科技、真人業務與真實 CX 驗收，以及 BX015、BX004、內政部租金資訊人工確認，均留待另案。機關交付的相對路徑書表與影片、GA4／OG、CSP／MIME／Range／快取與正式 CX 環境另行核定。
