# 2026-11-16 申請入口改版驗證

時間：2026-11-16（Asia/Taipei）。分支：`feat/direct-apply-operation-guide-20261031`；開始基準 `b55060aa536c2b8702e41daae25410b4bc8ed57a`，clone 後 `git pull --ff-only` 已同步且工作樹乾淨。

## 實作與界線

- 六入口順序不變；第六卡為真實 HTML group，兩個對等、至少 44px 高的獨立安全外連。新舊四寬度的全部六卡 x/y/width/height 比對差異 <1 CSS px；桌機另以內層 panel 保留原插圖可見外框 92%×82% 的內縮、18px 圓角與相鄰卡片對齊，沒有以隱藏溢出達成尺寸。窄卡標題以完整語詞分行，18px 字級。
- 直接申請頁以三個整卡原生 anchor 取代四方案入口，沿用深青／淺青綠框／淺背景、圖示、圓角與陰影。原四方案內容、流程、房客、比較、導引、CX 片段與影片 URL 未改。
- 新連結資料集中 `site/content.json`，模板／build 生成 `index.html`；測試獨立斷言五個核定 URL 的完整 query。
- GA4 六項映射只在啟用送一次，歷史 `income_standard` 白名單保留。既有 loader／Measurement ID 未改，測試產物仍移除 loader/config。使用本地 mock，不對正式 GA4 發事件；不修改管理端。
- 申請頁縮短後暴露原生 history 還原被前一短頁夾至頁底的問題；以既有 entry history state 保存捲動座標，目的頁 reflow 後補還原。原生連結／hash、返回、deep link、resize 和焦點繼續保留。

## 本地命令與結果

Node 24.22.1；Playwright 為環境既有工具，未增加網站相依。瀏覽器選 `/usr/bin/chromium`，非 Edge／實體 iPhone。

| 驗證 | 結果 |
| --- | --- |
| `npm run build`、`node scripts/build.mjs --check` | PASS，修正原生成物失同步 |
| `npm test` | PASS 65/65，無跳過；[log](unit-tests.txt) |
| `node scripts/performance-budget.mjs` | PASS，保留原圖片資產預算並改為檢查文字卡不請求圖片 |
| `npm run build:pages:test` | PASS，33 白名單靜態檔、無 GA4 loader/config |
| `scripts/entry-redesign-browser-check.cjs` | PASS；1440/768/390/320，六卡尺寸比對、七個鍵盤操作與可見焦點、五 URL、滑鼠/Enter/觸控事件、一次啟用一次、history/deep link/reload 不重送、無 gtag 原生新分頁；[結果](results.json) |
| `scripts/ux2-browser-check.cjs` | PASS；三管道、響應式、標題焦點、history／影片選擇保留；[結果](ux2-local.json) |
| `scripts/entry-scroll-check.cjs` | PASS；36 組響應式/縮放等效、12 組原生 page zoom、5 組 navigation；[結果](scroll-local.json) |
| `scripts/pages-test-browser-check.cjs` | PASS；33 runtime／GA4 無請求／私有路徑 404 |
| `ALLOW_LOCAL_PREVIEW=1 ... scripts/pages-live-acceptance.cjs` | PASS 本地非 CX 前端、四方案／比較／房客／導引／200% 字／320–1440 溢出／33 檔 MIME 與私有路徑；[結果](acceptance-local.json) |
| `node --use-env-proxy scripts/extension-browser-check.cjs` | PASS 本地與 f3d5063 HTTPS；HEAD／首尾 Range、雙版真實播放／拖曳／全螢幕／切換／history／裝置預設；[本地結果](extension-local.json)、[HTTPS 結果](live/extension.json) |
| `git diff --check` | PASS |

瀏覽器共用命令前綴：`NODE_PATH=/opt/codex/cua_node/lib/node_modules BROWSER_EXECUTABLE=/usr/bin/chromium PREVIEW_URL=http://127.0.0.1:4175/`。本地以 `PORT=4175 node scripts/serve.mjs --pages-test` 服務隔離產物。入口尺寸測試另設 `BASELINE_JSON=.preview/entry-redesign/baseline.json`，改版前資料從現行 Cloudflare UI 讀回。

CX 第三方請求隔離、不開啟 Messenger／不送真實問題；未改 `site/messenger.html` 或後端配置。R2 真實影片檢查例外允許現有 R2 網域。

## 外部官方入口唯讀檢查

[瀏覽器完整結果](external/results.json)，五個網址皆保留指定 href，最終 URL 相同，未填表／送件。

| 入口 | HTTP／實際畫面 | 判讀 |
| --- | --- | --- |
| 試算 | 200，出租房屋租金標準試算專區 | 畫面可讀 |
| 租金標準申請 | 200，所得達租金標準申報優惠稅率專區 | 空白申請表可讀 |
| BX015 線上申請 | 404，但 hydration 後 title「申報房屋使用情形變更」、書表及線上申辦入口可見 | **仍待人工確認** HTTP 404、業務用途及實際後續流程；不換址、不宣稱正式申辦驗收 PASS |
| 親自申請 | 200，各分處鄰近捷運站示意圖 | 畫面可讀 |
| 郵寄/傳真 | 200，總處／各分處等服務地址電話及聯絡信箱 | 畫面可讀 |

雲端代理 CA 導致 Chromium 預設 `ERR_CERT_AUTHORITY_INVALID`；上述外站／HTTPS 視覺診斷明示使用 `BROWSER_IGNORE_HTTPS_ERRORS=1`，不代表原站 TLS 有問題或正式 TLS 驗收。Node／curl 沿用環境 CA。舊 pages-live 腳本的 API request client 未沿用代理，外部 GET ECONNREFUSED 已如實保留；獨立實際瀏覽器檢查提供上述結果。

## R2 現況

唯讀 HEAD（`node --use-env-proxy`，TLS 驗證開啟）確認既有 query／無 query URL 都回 200 `video/mp4`：

| 版本 | bytes | duration（瀏覽器 metadata） | resolution | Last-Modified／ETag |
| --- | --- | --- | --- | --- |
| pc | 18678158 | 103.933333 秒 | 1920×1080 | 2026-11-08 13:07:11 GMT／01aa096afe776468e0e2a8611a0eac5e |
| mobile | 23785340 | 102.066667 秒 | 1080×1920 | 2026-11-08 13:07:12 GMT／9d8b84ff14aa8aff5e7ccab1ab74635d |

原測試仍預期 10/31 的 19659311／35123380 bytes 與 144.13／150.93 秒，已與現有 R2 不符。只更新測試快照；未上傳、替換物件、修改 `site/media.json` 或 R2 配置。

## 畫面與人工待辦

- 首頁：[桌機新版](after-home-1440.png)／[桌機舊版](before-home-1440.png)、[手機新版](after-home-390.png)／[手機舊版](before-home-390.png)。768 與 320 同目錄，完整 [原框座標](baseline.json) 與新版座標見 results。
- 直接申請：[桌機](after-apply-1440.png)、[768](after-apply-768.png)、[手機](after-apply-390.png)、[320](after-apply-320.png)。
- 五外站畫面在 `external/`，其中 [BX015](external/direct_apply_online.png) 保留 HTTP 與可見內容差異證據。
- 實體 iPhone LINE／Safari、Android、完整輔助科技／真人易用性、正式機關部署 CSP/MIME/Range、真實 CX 問答與正式 GA4 報表均未在本輪驗收，不以模擬或隔離測試代替。
- 本輪不合併 main、不更改正式部署、CX/GCP、GA4 管理端、Cloudflare 設定、R2 或網域。分支 push 僅觸發既有測試站 Git 整合。

## 推送與 Cloudflare

- 功能提交 `f3d50632ce27343fce8b1feaad23105270927755` 已推送並經 `git ls-remote` 核對。其 Cloudflare Pages check completed/success，deployment `19bc8a42-42c0-4a14-ab37-aa52f386aca1`；[check](live/cloudflare-check.json)。
- 該版本 HTTPS 實測已通過 `entry-live-layout-check`、UX2、pages-test、pages-live acceptance、extension。GA4 網路請求為零，僅本地做 mock；[layout](live/results.json)、[acceptance](live/acceptance.json)、[pages-test](live/pages-test.json)、[影片](live/extension.json)。
- 最後畫面複核另外修正桌機可見框內縮；本文件提交後再確認其自動建置與新版 HTTPS 截圖，收尾補記。
- HTTPS 腳本的 API request client 需明設 `BROWSER_PROXY` 沿用環境代理，已以該模式重跑 PASS；初次 direct API 的 ECONNREFUSED 不當作官方站故障。
