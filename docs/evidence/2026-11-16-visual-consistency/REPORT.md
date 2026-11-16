# 2026-11-16 視覺一致性改版驗證

開工遠端及本機：`bea4edb4f0d4063a0761e17511db8c94262f893f`，乾淨指定分支 `feat/direct-apply-operation-guide-20261031`；fetch / fast-forward 核對一致。前輪 65/65 單元測試先重跑 PASS，開工畫面及 bounding box 留在 `.preview/visual-consistency/baseline/`，不版控。

## 已實作

- 核定 A 的 WebP 原始 bytes 直接成為 `hero-v2.webp`（1672×941、177706 bytes、Git blob `3f847526afdbff2722da5fa03f996af1ce5f5784`）；PNG 是該圖解碼後的無損 fallback（1377431 bytes）。瀏覽器 canvas 全像素比對一致。WebP / PNG / OG / 基礎 CSS 均加 A 的快取版本；沿用兩個既有部署檔名及 33 檔精確白名單，因此不增加 runtime 檔數或第三方圖片。確認部署產物可讀及 MIME 正確後移除重複的交接檔 `assets/images/hero-taipei-a.webp`，Git 歷史仍保留核定來源。
- 原圖比例與淡色左側留白維持，右側建築以較寬背景尺寸及較輕遮罩呈現；手機保留可讀的漸層遮罩。未重繪原圖。
- 六主入口共用可見外框、padding、白底、2px 外框、8px 圓角及陰影。第六卡本身就是外框，內部 group 無第二層框；左側圖示、右側標題與兩個至少 44×44px 的對等子連結。小幫手仍是開啟原視窗的 button。選中狀態保留深青反白。
- 桌機三欄兩列、平板兩欄、390px 兩欄、320px 一欄。以自然等高格線取代固定高度與百分比內縮高度；200% 字級時 390px 自動改一欄，文字及按鈕完整換行。六圖示在所有寬度均可見，同尺寸、同左側 inset、垂直置中。
- 直接申請使用房客的三欄格線、白底、外框、圓角、間距、圖示容器及標題／說明層級；700px 以下單欄。三張維持整卡原生外部連結，順序與原五個服務 href/query、事件 id、target/rel、新視窗提示皆保留。房客仍為 details。
- `scripts/icons.mjs` 集中 16 個自製、不同語意 SVG：24×24、1.8px 線寬、round cap/join、currentColor、aria-hidden、focusable=false。四方案保留藍／橘／綠／紫，分別使用鑰匙、愛心、管理保障與合約；不增加套件／字型／CDN。
- 四方案裝飾 01–04 從 build 來源移除；移除原數字／右上角圖示留白，保留選中外框與 aria。精確片語改為「四種方案完整比較」，hash、資料及其他核定文字不變。
- 200% 字級驗證發現 FAQ 的加號固定 24px 使 320px 頁面多出 1px 捲動；改以 em 隨文字寬度伸縮，沒有更換其操作圖示或互動。

## 本地證據

環境：Node 24.22.1、Playwright 1.62.1、Chromium 156.0.8078.79，Linux headless。這些是瀏覽器與文字縮放模擬，不是實體 iOS / Android。

| 檢查 | 結果／證據 |
| --- | --- |
| `npm run build`、`node scripts/build.mjs --check` | PASS；生成 index 與來源一致 |
| `npm test` | **68/68 PASS**，保留原 65 項，新增 A/圖示/標號文案驗證；[log](local/unit-tests.txt) |
| `node scripts/performance-budget.mjs` | PASS，A WebP 177706 / 700000 bytes；[log](local/performance-budget.txt) |
| `node scripts/build-pages-test.mjs` | PASS，33 檔，GA4 loader/config 移除、無 docs / screenshots / MP4；[log](local/pages-build.txt) |
| `visual-consistency-browser-check.cjs` | PASS；1440、1100、768、390、320px × 100/200% 根字級，首頁／四方案、房客、直接申請、比較、教學皆無水平溢出；同框／圖示 inset 與中心／44px 子連結／三欄對齊與房客格線一致／A 格式選用、fallback 像素與 MIME。另以 mock openChat 驗證滑鼠及 Enter 各開啟一次，無換頁及真實 CX 問答；[JSON](local/layout.json) |
| `entry-redesign-browser-check.cjs` | PASS；7 控制項原生鍵盤順序與焦點、五個精確網址、六個 mock 事件、單次啟動、無 gtag 正常導航及歷史重整；[JSON](local/entry-redesign.json) |
| `ux2-browser-check.cjs` | PASS；原導覽／選中／影片暫停與返回，更新核定三欄斷言；[JSON](local/ux2.json) |
| `entry-scroll-check.cjs` | PASS；36 組 viewport/zoom-equivalent、12 組 Chromium 原生縮放及深層連結／重新整理／重複進入／resize／歷史閱讀位置；[JSON](local/scroll.json) |
| `pages-test-browser-check.cjs` | PASS；無 GA4、資源正常、私有路徑 404、hash 與影片狀態；[JSON](local/pages-test.json) |
| `pages-live-acceptance.cjs` 本地模式 | 前端非 CX PASS，33 runtime MIME / 11 私有路徑；[JSON](local/non-cx.json)。外站直連遭網路拒絕，沒有算成外站驗收 PASS |
| `extension-browser-check.cjs` | 標準 Chromium TLS **BLOCKED**：R2 `ERR_CERT_AUTHORITY_INVALID`；明確加 `BROWSER_IGNORE_HTTPS_ERRORS=1` 診斷後播放／seek／fullscreen／返回暫停／裝置預設／原 URL Range 206 PASS；[診斷 JSON](local/extension-diagnostic.json) |
| `git diff --check` | PASS |

原前輪「可見框內縮／18px 圓角」及直接申請兩欄測試已依本輪核定規格改成共通可見框及三欄驗證；其餘事件、導航、功能斷言保留。選填 BASELINE_JSON 僅供同版量測比較，不拿上一輪已核定要改的框高當不變條件。

可重現：先 `node scripts/build-pages-test.mjs`，以 `PORT=4175 node scripts/serve.mjs --pages-test` 啟動同 checkout；瀏覽器腳本設 `BROWSER_EXECUTABLE=/usr/bin/chromium PREVIEW_URL=http://127.0.0.1:4175/`。本地非 CX 加 `ALLOW_LOCAL_PREVIEW=1`。影片命令使用 `node --use-env-proxy scripts/extension-browser-check.cjs`。所有截圖保持在 `.preview/`；這份 evidence 只複製 JSON / log / 文字。

## 測試站部署與人工事項

本地完成，待此程式 commit 推送後記錄 Cloudflare 精確 SHA、部署及 HTTPS 回歸。Cloudflare connector 僅做 GET，不更改專案設定。

標準 Chromium 對 Pages 也回報 `ERR_CERT_AUTHORITY_INVALID`；HTTPS 瀏覽器測試需明確區分診斷模式與正式 TLS 驗收。BX015 維持前輪「HTTP 404 但有申辦內容」待人工確認，網址未改、未填表或送件。實體 iPhone Safari / LINE、Android、真人及輔助科技／業務驗收仍待人工覆核。

本輪不變更 `site/content.json`、原 URL、政策／導引規則、analytics / UI / Messenger JS、media / R2、CX／GA4 管理端／網域／Cloudflare 設定。不另開分支、不合併 main、不更新機關站或 GitHub Pages 正式主線。
