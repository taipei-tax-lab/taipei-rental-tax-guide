# 2026-11-16 四圖示、雙子按鈕 hover、修整版背景

從乾淨指定分支 `feat/direct-apply-operation-guide-20261031` 安全 fetch / fast-forward 到 `4c6ae97`，開工 68/68 單元 PASS。原／新圖示均以實際卡片尺寸在 1440、390、320px 比較；畫面只存 `.preview/icon-refinement/`。

## 實作與界線

| key | 實際圖形 |
| --- | --- |
| owner | 完整屋頂與外牆，屋內人物頭肩；移除小鑰匙 |
| tenant | 站立人物與有提把、腳輪的入住行李箱；移除分離鑰匙 |
| personal | 左側完整住宅、右側完整折角合約與兩條文字線；兩形體不再重疊 |
| subsidy | 住宅旁圓形硬幣，以路徑畫面額 1；無托手、美元文字或計算機 |

僅這四組 path 改變。新增以 `4fc7521` 為基準的 16 組 SHA-256 fixture，單元驗證其餘 12 組保持原樣；cardIcon helper、key、24×24 / 1.8 stroke / round / currentColor / 無填色 / 裝飾 aria 規則全部保留。辨識度是人工審查事項，不由機器測試代替核定。

租金標準非互動父框從兩條既有主卡 hover selector 精確排除。僅精細指標且支援 hover 的裝置，子連結滑入時使用既有 `var(--teal)`、白字及 `var(--teal-dark)` 邊框；移開還原。未更動 padding、尺寸、配色預設、其他主卡 hover / selected、連結、事件或 JS。觸控裝置不套用 hover 反色，保留獨立原生連結與焦點提示。

修整版背景直接使用交接 WebP 原 bytes，**沒有重新生成或進一步編修**：

- runtime `hero-v2.webp`：1672×941、135064 bytes、Git blob `81760c85cfdde844809a04f1ab6a5ba51c25d293`。
- runtime `hero-v2.png`：同一 WebP 解碼的無損 PNG、1245328 bytes，瀏覽器 canvas 全像素比對相同。
- CSS / OG / fallback 更新版本 `81760c85cf`；保留原背景右側定位、漸層、尺寸及所有版面規則。WebP 優先、PNG fallback，無新外部圖片請求。
- NEXT_TASK 曾將 runtime 路徑寫為 `assets/images/hero-v2.*`；實際 Git、CSS、serve、OG 與既有 33 檔白名單都是根目錄 `hero-v2.*`。依任務「保留現行檔名／不改白名單」沿用根目錄，並校正該筆文件路徑。部署白名單與 build script 不變。
- 本地部署產物 WebP / PNG 的像素及 MIME 驗證後，移除重複交接名 `assets/images/hero-taipei-a-refined.webp`；Git 歷史保留原素材。
- 目視原始修整素材，右側第二棟已為普通窗戶、整齊陽台與平整屋頂，未見先前突出的窗籠、臨時棚架／雨棚；水彩、左側留白、樹木、遠景 101 與山景保留。此為插畫觀感檢視，不判定現實建物是否合法；最終觀感由使用者確認。

## 本地驗證

| 檢查 | 結果／文字證據 |
| --- | --- |
| `npm run build`、`node scripts/build.mjs --check`、`git diff --check` | PASS；index 從來源重建 |
| `npm test` | **69/69 PASS**，原 68 項保留並更新新背景基準，新增只改四 key 的驗證；[log](local/unit-tests.txt) |
| `node scripts/performance-budget.mjs` | PASS；WebP 135064 / 700000 bytes；[log](local/performance-budget.txt) |
| `node scripts/build-pages-test.mjs` | PASS；仍 33 檔、GA4 loader/config 隔離、無 docs / screenshots / MP4；[log](local/pages-build.txt) |
| `visual-consistency-browser-check.cjs` | PASS；1440、1100、768、390、320px × 100/200% 根字級，主卡／四方案／房客／直接申請／比較／教學，六卡同框、圖示 alignment、44px 子連結、原格線及無溢出，修整版 WebP 選用／PNG fallback 同像素與 MIME；[JSON](local/layout.json) |
| 開工／完成六主卡 bounding box | 10 組 viewport/font 下 x / y / width / height **最大差異 0px**；[JSON](local/geometry-compare.json) |
| `icon-refinement-browser-check.cjs` | PASS；實際 mouse.move 對標題、圖示、留白、間隙、各按鈕及移開量測 computed styles；父框與同輩不變、各自深青白字、主卡原 hover / selected 不變、原生 Tab / focus-visible、390/320px 兩子連結各自 tap 且無黏滯反色、44px 目標、16 SVG 於實際可見頁面檢查 viewBox 內留白，個人方案選中／返回；[JSON](local/interaction.json) |
| `entry-redesign-browser-check.cjs` | PASS；七個控制項的鍵盤順序／焦點、五個原 href/query、六個 mock GA4 訊號、無 gtag 導覽、hash / history / reload；[JSON](local/entry.json) |
| `pages-test-browser-check.cjs` | PASS；GA4 隔離、公開資產、私有路徑 404、hash／影片狀態；[JSON](local/pages-test.json) |

環境沿用 Linux Node 24 / Playwright / Chromium；文字放大與手機為 emulation，不是實體裝置。所有瀏覽器檢查隔離 CX / GA4，不填表送件。此輪不另重播真實影片／送 CX 問題；相關原 JS、media / R2 URL 與設定沒有變更。

重現：`node scripts/build-pages-test.mjs`，`PORT=4175 node scripts/serve.mjs --pages-test`；設定 `BROWSER_EXECUTABLE=/usr/bin/chromium PREVIEW_URL=http://127.0.0.1:4175/` 再執行上述腳本。瀏覽器截圖僅可放 `.preview/`。HTTPS API request 可設 `BROWSER_PROXY` 沿用環境代理（不輸出值）；本環境標準 Chromium 對 Pages 再次出現 `ERR_CERT_AUTHORITY_INVALID`，使用 `BROWSER_IGNORE_HTTPS_ERRORS=1` 的瀏覽器結果須標為診斷模式，不能當正式 TLS 驗收。

## 部署與人工確認

實作 **`2b9d2f1cc8c86ea3c5dfc03319c24df79c40c0b3`** 已推送至原指定分支，工作樹乾淨。Cloudflare GitHub check completed / success；API 核對同 SHA、同分支、deploy stage success，部署 `eefe33b8-5bff-45c9-9e43-3a8caedf637a`。[部署紀錄](deployment.json)、[GitHub check](live/github-check.json)。實際測試主網址：https://rental-tax-guide-test.pages.dev/ ，不改雲端或管理端設定。

- [HTTPS pointer / hover / touch / focus / 16 SVG / 個人方案選中返回](live/interaction.json) PASS；與本地同樣實際 mouse.move / tap / computed style，沒有僅靠 CSS 字串判斷。
- [HTTPS 五寬度×兩字級／WebP 與 PNG 全像素／MIME](live/layout.json) PASS；CSS 使用新版本 WebP，明確改選 PNG fallback 後確認像素完全相同。線上首頁及房客卡片截圖已目視核對新圖示、修整街廓與留白／可讀性；沒有調整原定位或構圖。
- [HTTPS 非 CX 回歸](live/non-cx.json) PASS；原四方案、房客 details、快速判斷、比較、申請連結、hash／歷史、33 assets MIME、私有路徑 404、零 GA4 請求。外部唯讀 BX015 404、其餘兩分處資訊 200，保留原待辦，不送件。
- 以上瀏覽器使用明確 `BROWSER_IGNORE_HTTPS_ERRORS=1`，屬雲端憑證信任限制下的**診斷模式**，不聲稱正式 TLS 或實機驗收。
- [正常 TLS 線上產物核對](live/runtime-match.json)：Node 使用原有 CA、未跳過 TLS，HTML、兩份 CSS、修整 WebP / PNG、原 analytics / guide-ui / operation-guide JS 均與本地 Pages build bytes 一致；WebP blob 精確為核定 `81760c85cfdde844809a04f1ab6a5ba51c25d293`。

主要變更檔案：`scripts/icons.mjs`、`assets/css/guide-v2.css`（僅 hover / 背景版本）、`assets/css/site.css`（背景版本）、`hero-v2.webp/png`、`site/template.html`（OG 版本）及生成 `index.html`；針對性 browser checker、圖示 baseline fixture、既有資產驗證基準，以及 README / Task / State / Worklog / 文字證據。`scripts/build.mjs`、Pages 白名單、policy / UI / analytics / Messenger / media 來源與雲端設定無變更。修整交接名已移除，歷史素材可追溯。

收尾提交只補本節及部署證據文件，runtime 不變；最後遠端 HEAD 與自動部署另於交付時核對。

保留四圖示辨識度、背景街景觀感、實體 iOS / Android / LINE、真人／輔助科技及業務驗收待辦；BX015 的既有 HTTP 404 但可見申辦內容仍待人工確認，核定 URL 不變。
