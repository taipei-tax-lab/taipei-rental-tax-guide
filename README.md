# 臺北市出租房屋租稅優惠專區｜V2 網站與維護

目標是「充分且不混淆的資訊，讓民眾快速找到需求與下一步」。網站是可重建的靜態 HTML／CSS／JavaScript，不需要自建後端、資料庫或前端套件安裝。

開發與交接先讀 [AGENTS.md](AGENTS.md)、[現行狀態](docs/PROJECT_STATE.md)、[任務](docs/NEXT_TASK.md) 與 [Workflow](docs/PROJECT_WORKFLOW.md)。舊 State/日期式 Task 及歷史文件為證據，不是新一輪指令。

## 功能概覽

- 首頁依屋主／房客分流；直接呈現四種出租情境及優惠摘要。
- 桌機四欄時，點選方案在卡片下方展開；手機／平板維持詳情畫面。共用完整條件、三大稅目、下一步與官方入口。
- 不確定者使用最多三題的閱讀導引，附建議理由，不判定正式資格。
- 完整比較在第二層，各項目對齊；手機可選兩方案並列比較。
- 房客服務依補貼、房源、租屋／設籍三類整理；實際入口以 `site/content.json` 為準。
- 主線原有屋主、房客、小幫手及所得達租金標準等入口；現行 Cloudflare 開發分支另有直接申請與操作說明，形成六入口。快速判斷位於方案卡片後方，標題旁保留快捷入口。
- 小幫手快捷入口使用官方 openChat 開啟原有右下角視窗，不送出問題或清除對話。Messenger 沿用已確認的人物素材、比例與關閉行為；CX 題庫及雲端設定另案處理。

## 開發與預覽

需要 Node.js 20 以上，不需要 npm install。

```powershell
npm run build
npm test
npm run dev
```

預覽網址：http://127.0.0.1:4173/ 。修改來源後重新 build 並重新整理；預覽服務不會自動建置。

## 維護位置

| 檔案 | 用途 |
| --- | --- |
| site/content.json | 四方案政策主資料、官方資源、來源與核對日期 |
| site/template.html | 首頁與共用版面 |
| site/messenger.html | 小幫手正式來源片段，保留機關 CX 指向 |
| site/media.json | 兩版操作影片來源（開發分支） |
| scripts/build.mjs | 零相依建置，產生 index.html 與資產內容雜湊版本 |
| scripts/icons.mjs | 主入口、四方案、房客及申請方式共用的 16 個自製 SVG |
| assets/css/guide-v2.css | V2 版面與響應式樣式，限縮於 .v2-site |
| assets/js/guide-rules.js | 最多三題的閱讀導引規則 |
| assets/js/guide-ui.js | 身分切換、hash 導覽、返回、展開與列印 |
| assets/js/operation-guide.js | 影片版本、播放及暫停規則（開發分支） |
| assets/css/site.css | 保留的既有基礎樣式及小幫手使用的色彩變數 |
| assets/css/messenger.css、assets/js/messenger-ui.js | 小幫手樣式、前端互動及 CX runtime context |
| index.html | GitHub Pages 使用的建置結果，不直接手改 |

舊 _next/ 快照與 site-enhancements.js 保留但不再由 V2 載入。舊版可由 main／對應 Git 歷史版本取得。

## 驗證

npm test 檢查建置可重現性、靜態連結、四方案資料、小幫手片段與全部導引分支。

若環境已提供 Playwright 與 Microsoft Edge，可在預覽服務運作時執行：

```powershell
node scripts/browser-check.cjs
```

這是選用的瀏覽器整合驗證；Playwright 不屬網站執行相依。結果與截圖位於被 Git 忽略的 .preview/；僅不含敏感資訊的文字驗證報告、JSON 與 log 可提交，截圖不提交 GitHub。

詳見 [V2 開發與驗收紀錄](docs/v2-development.md)。首次使用者查找時間與理解程度仍須真人測試。

## 部署

保留原 GitHub Pages 分支部署方式。建置後提交 index.html、assets/、hero-v2.png、favicon.svg 及 .nojekyll 等網站資產；原始檔與建置腳本也一併版控，供日後重建。

GitHub Pages 從 `main` 發布；Phase 5A 的 PR #9 是歷史發布，不是目前最新版本。現在以 [PROJECT_STATE](docs/PROJECT_STATE.md) 的核對基準為準。機關正式站由資訊室另行部署，不能從 Pages 成功推定已上版。

本次改版延續 `feat/direct-apply-operation-guide-20261031`，其 push 會觸發既有 Cloudflare 測試站 build，但不修改 GitHub Pages 主線或機關站。11/16 已重新生成 `index.html` 並修正 UX2 的入口順序斷言；具體驗證與限制見 [PROJECT_STATE](docs/PROJECT_STATE.md)。後續修改功能時必須重新 build、檢查並提交生成物，正式發布須另經核准。

## 專案與 CX 文件

- [專案結構](docs/project-structure.md)
- [V2 開發與驗收紀錄](docs/v2-development.md)
- [Dialogflow CX 對話體驗規劃](docs/dialogflow-cx-chat-experience-plan.md)
- [Dialogflow CX 操作與驗證](docs/dialogflow-cx-operation-guide.md)
- [Messenger 介面規格](docs/messenger-ui-spec.md)

CX 文件包含 PoC 與歷史操作紀錄，部分 Agent／Environment 敘述已過期；請先看 [操作指南頂部現況校正](docs/dialogflow-cx-operation-guide.md) 與 [後端 2026-10-13 verified baseline](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d/config/current_production_baseline.json)。網站政策資料不會自動同步到 Data Store；未獲核准不修改 CX。

## 本輪閱讀與互動改善

首頁先呈現方案摘要，再提供不確定者導引；桌機詳情緊接卡片展開。卡片分開呈現主要稅目與其他稅目提示。導引顯示已選條件、優先閱讀建議與待確認條件，上一題與重新開始會同步更新摘要。方案詳情依適用對象、優惠、具體辦理動作、完整條件／文件呈現。

手機比較可選兩個不同方案；相同選項會自動調整另一欄，並顯示目前比較名稱。放大至桌機時恢復四方案。停用 JavaScript 時仍保留全部方案資訊。

另可設定 PORT 預覽（例如 4175），瀏覽器與聊天檢查以 PREVIEW_URL 指向同一份 worktree，避免誤測其他目錄。政策原始數值及核對日期未更動；真人可用性與 iOS／Android 實機仍待驗收。

## 聊天縮放與矮視窗修正

聊天視窗依 visualViewport 的可見範圍定位，預留實際按鈕尺寸；不再以固定最小高度撐出畫面。小於400px可用高度時以標題列關閉，收合使用提醒與熱門問題，保留對話及輸入空間。人物面板在高度不足520px時隱藏。聊天 CSS／JS 使用內容雜湊版本避免舊快取。

`node scripts/chat-viewport-check.cjs` 驗證縮放等效尺寸、visual viewport 縮放、標題與輸入及關閉邊界、左右對齊、提醒展開和草稿保留；不送出真實 CX 問題。

## 功能擴充（Cloudflare 工作分支，未合併 main）

首頁六張入口沿用既有 hash 導覽，新增 `#direct-apply` 與 `#operation-guide`。直接申請頁使用 `site/content.json` 的 `directApplyActions` 三種管道；首頁租金標準使用 `incomeStandardActions` 試算／申請雙連結。原四方案政策、流程、申辦資料保留。

影片來源在 `site/media.json` 的 `operationGuide.pc.src` 與 `operationGuide.mobile.src`。目前使用指定 R2 V2 測試影片，原檔名加上 `?v=2` 以隔離舊瀏覽器快取（更版時只更新此設定）；日後可改為例如 `./assets/videos/operation-guide-pc.mp4` 與 `./assets/videos/operation-guide-mobile.mp4`，再執行 build。影片來源僅接受 HTTPS 或明確 `./` 相對路徑。MP4 不納入本輪 Git 或發行包；正式主機的檔案放置、CSP、MIME 與 Range 支援須另案確認。本機預覽器目前不提供 videos 路徑，本輪使用 R2 驗收。

電腦影片為 16:9，維持最大 960px；手機影片為 9:16，寬度不超過容器及 360px，全螢幕解除最大寬度並以 contain 保留完整畫面。兩版各有同比例本機 SVG 封面。播放器使用原生 controls / fullscreen、`playsinline`、`preload="none"`，不自動播放。切換版本、離開頁籤或將瀏覽器移至背景時會暫停；同一頁面工作階段返回時保留所選版本與播放位置，不自動播放。首次載入或重新載入時依裝置預設：手機為手機版、電腦與平板為電腦版；優先採用瀏覽器行動裝置資訊，無此資訊時辨識手機 User-Agent。視窗寬度改變不會重設選擇。無 JavaScript 時兩版皆可手動播放。

額外的瀏覽器驗收（需要環境已有 Playwright 與 Edge）：

```powershell
node scripts/extension-browser-check.cjs
```

它會阻擋 CX 與分析請求，驗證五種寬度、R2 真實播放、原生全螢幕、切換／離開／返回及瀏覽器歷史。`PREVIEW_URL` 可指定預覽網址；截圖與結果儲存在忽略版控的 `.preview/`。已完成及待驗證範圍見 [PROJECT_STATE](docs/PROJECT_STATE.md)，歷史證據見 [WORKLOG](docs/WORKLOG.md)。

## Cloudflare Pages 測試發布

沿用同一功能分支；不影響原有 GitHub Pages／機關正式部署。Pages 使用 Git 整合，自動從指定功能分支建置；不需要 API key、Workers、Functions 或 R2 binding。

| 設定 | 值 |
| --- | --- |
| Project name | `rental-tax-guide-test` |
| Repository | `taipei-tax-lab/taipei-rental-tax-guide` |
| Production branch | `feat/direct-apply-operation-guide-20261031` |
| Framework preset | None |
| Root directory | Repo 根目錄（留空） |
| Build command | `node scripts/build-pages-test.mjs`（等同 `npm run build:pages:test`） |
| Build output directory | `dist-pages-test` |
| Build env（Production / Preview） | `NODE_VERSION=22`、`SKIP_DEPENDENCY_INSTALL=1` |
| Preview branch deployments | None（本輪只測指定分支） |

此處 Pages 的 Production 指測試專案主網址，不代表機關正式發布。推送指定分支後將觸發該測試專案的自動建置。

`build-pages-test.mjs` 先執行既有建置，再依明確白名單輸出 33 個靜態檔案（包含新增直式影片封面）：index、404、hero 圖片、必要 CSS／JS、既有入口圖片與小幫手動態圖片。不整批複製 Repo 或 assets，不包含 State／Task、README、docs、site、scripts、tests、Git metadata、素材清單或 MP4。輸出目錄已忽略版控，每次建置清除舊檔。

僅測試版 HTML 移除 GA4 loader/config；原有 index.html、analytics.js 與事件契約保持原樣。小幫手設定未改動；本輪不擴充 CX 允許網域，因此 Pages 網域的真實問答仍需另案確認。兩支 R2 影片維持現有 URL，不上傳替換。頂層 404.html 讓 Pages 對不存在路徑回傳 404，避免隱含 SPA fallback。

本機驗證發布產物：

```powershell
node scripts/build-pages-test.mjs
node scripts/serve.mjs --pages-test
# 另一終端機，Playwright 與 Edge 已可用時：
node scripts/pages-test-browser-check.cjs
node scripts/browser-check.cjs
node scripts/extension-browser-check.cjs
```

預覽仍使用 4173，或以 PORT / PREVIEW_URL 指向同一服務。上述 Pages 專用檢查驗證 GA4 無請求、相對資源、私有路徑 404 與頁籤狀態；extension 檢查會實播既有 R2 影片。

現有 Pages 專案已建立且 Git 整合正常；本輪沿用，不重新建立或擴大授權。部署證據請見 [PROJECT_STATE](docs/PROJECT_STATE.md)。

參考：[Pages GitHub 整合](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)、[建置環境與略過套件安裝](https://developers.cloudflare.com/pages/configuration/build-image/)。

## 已部署的 Pages 測試站與非 CX 驗收

測試網址：https://rental-tax-guide-test.pages.dev/ 。此為測試站，不是機關正式發布。部署／驗收文字紀錄見 [PROJECT_STATE](docs/PROJECT_STATE.md) 及 [WORKLOG](docs/WORKLOG.md)；10/31 的完整非 CX HTTPS 驗收不代表 11/4 新版已完整回歸。

10/31 非 CX HTTPS 驗收明確排除 Messenger 開啟、訊息、預設問題及 CX API。針對實際 HTTPS 網址重跑非 CX 驗收（Playwright / Edge 已可用時）：

```powershell
$env:PREVIEW_URL='https://rental-tax-guide-test.pages.dev/'
node scripts/pages-live-acceptance.cjs
node scripts/pages-test-browser-check.cjs
node scripts/extension-browser-check.cjs
```

這三支腳本在測試環境隔離 CX 第三方請求；不要以會開啟 Messenger 的舊 browser-check / chat-viewport-check 作為本輪非 CX 驗收。網站程式和 CX 設定沒有為此改動。外部申辦頁只做唯讀可達性確認。

## 入口導覽與申辦 UX

首頁、直接申請及操作說明共用同一份主視覺與六入口，下方切換內容；獨立方案詳情／比較仍維持原有導航。11/4 最新來源順序為屋主、房客、直接申請、操作說明、小幫手、所得達租金標準；桌機採較緊湊、左對齊的入口卡片列。10/31 的導覽定位行為保留：入口使用原生連結與 hash，程式在同頁入口切換時透過 history.pushState 避免原生錨點先捲動，內容完成 reflow 後依實際標題位置捲至視窗上緣約 28px（受頁底上限約束）並管理焦點；相同入口重複操作與斷點改變保留閱讀位置，上一頁／下一頁還原閱讀位置，深層連結與重新整理會校正標題位置。

直接申請頁改為「線上申請、親自申請、郵寄/傳真」三張同層級管道卡片，本輪視覺更新後，桌機／平板沿用房客三欄格線、手機單欄。首頁第六卡使用共通可見外框、左側圖示及對等試算／申請按鈕，六張主卡同列等高。四方案詳情、比較與政策資料維持原樣。申請頁變短時沿用頁底定位上限；前後導覽在目的頁 reflow 後補還原閱讀位置。

[GA4 現行事件](docs/GA4_EVENTS.md) 記錄六項本輪入口映射；僅前端意圖訊號，測試站不載入 GA4。
新增 `node scripts/ux2-browser-check.cjs` 驗證共用入口、DOM／鍵盤順序、焦點、響應式申辦卡片及歷史。預設本機4175；正式驗收請以 PREVIEW_URL 指向現有 Pages 測試站。影片及 CX／Messenger 配置維持原樣，非 CX 驗收繼續隔離第三方請求。

影片不使用覆蓋層。已驗證的桌機 Chromium 瀏覽器在非全螢幕時以 video click 提供畫面播放／暫停／結束後重播；原生控制鍵自行處理事件。iOS／Android／LINE、內嵌 WebView 及未確認引擎不加自訂點擊事件，保留原生控制；全螢幕也維持原生互動。真實 iPhone LINE、Safari 的控制鍵與子母畫面仍須實機複驗，不以 Chromium iPhone 模擬代替。


## 11/16 申請入口改版驗證

`node scripts/entry-redesign-browser-check.cjs` 針對 GA4 隔離產物驗證四種寬度、七個主要操作、焦點／鍵盤、五個精確網址、六個 mock 事件及無 gtag 導覽；可設 `BASELINE_JSON` 比對改版前卡片尺寸。`node scripts/entry-external-read-check.cjs` 僅唯讀瀏覽外部入口，不填表或送件。證據見 [11/16 report](docs/evidence/2026-11-16-entry-redesign/REPORT.md)。

瀏覽器腳本預設 Edge，雲端可設 `BROWSER_EXECUTABLE=/usr/bin/chromium`；Playwright 仍為驗證工具，不是網站相依。HTTPS 腳本中的 API request 可設 `BROWSER_PROXY` 沿用環境代理（不輸出代理值）。`node scripts/entry-live-layout-check.cjs` 可在不裝 mock gtag 的情況複驗真實 Pages 四寬度與六卡共通可見框。Node 24 雲端需 `node --use-env-proxy scripts/extension-browser-check.cjs` 才沿用環境代理存取 R2。R2 影片已由外部在 11/8 更新，本輪只讀回 metadata 並校正過期測試快照，未上傳或改 URL。TLS 代理造成 Chromium 信任錯誤時，診斷性 `BROWSER_IGNORE_HTTPS_ERRORS=1` 的結果須明確標示，不能當正式 TLS 驗收。


## 11/16 視覺一致性改版

核定 A 背景已接入 `hero-v2.webp` 及同畫面的 `hero-v2.png` fallback，CSS / OG 加上素材版本；交接檔舊名稱不重複保留。現有 Pages 白名單仍為 33 檔，WebP 177706 bytes，符合原 700KB budget。六主卡共用外框、圖示位置與閒置色彩；桌機三欄兩列、平板兩欄、手機依寬度兩欄／一欄，放大字級時自然增高。16 個卡片圖示由 `scripts/icons.mjs` 集中輸出，四方案保留色彩、取消裝飾數字；直接申請與房客共用三欄／窄版單欄格線。政策、服務網址與 GA4 / CX / Messenger 行為保留。

`node scripts/visual-consistency-browser-check.cjs` 驗證五種寬度、100/200% 字級、六卡同框與圖示、申請／房客格線、44px 子連結及 A 的格式選用、fallback 像素與 MIME。68/68 單元、本地及測試站 HTTPS 回歸通過，完整來源 `346d24d` 的 Cloudflare check / deploy SUCCESS；Cloud Chromium 的外部 TLS 信任限制及部署紀錄見 [視覺改版報告](docs/evidence/2026-11-16-visual-consistency/REPORT.md)。截圖只保留 `.preview/`，不提交 GitHub。人工及實體裝置驗收仍需另行確認。


## 11/16 圖示辨識、租金標準 hover 與背景修整

本輪只優化屋主／房客、個人代管及租金補貼四個 SVG，其餘 12 個保留；租金標準父框不隨滑鼠變色，試算／申請各自 hover 深青底白字，觸控避免黏滯反色。GPT 已提供的修整版背景直接接入既有根目錄 `hero-v2.webp/png`，不重生圖片；WebP 135064 bytes，兩格式像素一致、版面與 33 檔白名單保留。`node scripts/icon-refinement-browser-check.cjs` 實測滑鼠位置／computed style、鍵盤焦點及手機 tap；69/69、本地及測試站 HTTPS 回歸通過，實作 `2b9d2f1` 的 Cloudflare check / deploy 成功；證據、憑證診斷模式及人工限制見 [本輪報告](docs/evidence/2026-11-16-icon-refinement/REPORT.md)。圖示辨識與背景觀感仍由使用者看測試站確認，截圖僅存 `.preview/`。


## 11/17 房客展收與書表

房客 details 各自依內容高度展收，可同時開啟多張；直接申請三卡等高保留。三卡下新增「書表下載」「填寫範例」，六連結單一來源為 `site/media.json` 的 `applicationForms`，由 build 產生，影片 operationGuide 不變。R2 僅為測試用途，不將書表原檔放進 Repo 或 Pages 33 檔產物。

機關正式交付另案：在 staging 副本將六 URL 改成 `./assets/forms/<filename>`，將原書表及影片納入機關靜態包，重新建置並驗證 MIME、檔案與 CSP；ODT 建議 application/vnd.oasis.opendocument.text。本輪只在暫存副本證明相對路徑可生成，不製作正式包、不改 R2 metadata。現在 ODT 公開回應為 application/octet-stream，瀏覽器下載；PDF 可另開閱讀或儲存，跨域 download 屬性不保證強制儲存，因此使用原生 HTTPS 連結。


第六輪書表區桌機高度減少13.5%，格式按鈕共用試算／申請色彩與fine-pointer hover，首頁更名「出租房屋所得達租金標準」。212組RWD量測及局部換行容納措施、mock小幫手界線見 [第六輪報告](docs/evidence/2026-11-17-rwd6/REPORT.md)。原書表設定／原檔管理方式不變。
