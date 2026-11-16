# NEXT_TASK — 2026-11-16 兩個服務圖示再優化與兩入口頁背景一致性

狀態：**IMPLEMENTED_TEST_DEPLOYED_PENDING_HUMAN_REVIEW**（2026-11-16，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
開工基準：`6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943`（本次核對 Cloudflare Pages check SUCCESS）。前輪實作 `2b9d2f1`，69/69 單元及技術驗證已有紀錄；使用者檢視後明確反映「個人租賃住宅包租代管」和「我要申請租金補貼」兩個 icon 仍不夠直覺易懂，要求再設計。使用者已確認本輪兩張圖示構想 OK，並追加「直接申請」「操作說明」外層背景與屋主／房客頁一致。兩項合併執行，尚未實作。本輪不是重做前輪；[前輪完整 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943/docs/NEXT_TASK.md)、[前輪 report](evidence/2026-11-16-icon-refinement/REPORT.md) 保留。

## 1. 核定目標／設計方向

改換視覺隱喻，非微調現有房屋＋文件／硬幣構圖。前輪 `personal` 與 `subsidy` 的房屋 path 完全相同，後者用寫有 1 的小圓圈，文字線條在小尺寸易被誤認；前者小房屋與折角文書未直接表達委託管理。此為程式圖形觀察與設計推論；使用者核定的目標是更直覺、易懂。兩圖主體必須明顯不同，毋須每張圖都加入房屋。

| 卡片 | key | 本輪建議構圖及辨識重點 |
| --- | --- | --- |
| 個人租賃住宅包租代管 | `personal` | **握手／合作委託**。以兩人握手為單一主體、兩端袖口與中央交握輪廓清楚，傳達屋主與專業代管方的委託合作。避免把手畫成不明多邊形或繁複手指；不再使用房屋＋文件、不加鑰匙或盾牌等小裝飾。以通用握手 pictogram 概念自繪符合現行線條風格。 |
| 我要申請租金補貼 | `subsidy` | **領取補助款**。以大而完整的矩形鈔票（中央簡潔貨幣符號或圓形票面、少量票面記號）和明確的向下領取箭頭／接收構圖表達收到款項，而非支付、計算或退費。兩元素清楚且無密集線條；優先採清楚的鈔票＋向下箭頭，不再用小房屋＋寫 1 的硬幣或難辨識的托手。不要呈現實際金額或暗示已核定／保證獲補助。 |

以上握手及鈔票＋向下箭頭的構圖方向已獲使用者確認（概念示意，不是已部署的 SVG 驗收）；細部 path 由 Agent 依示意在實際尺寸適度調整，不另換其他隱喻，不將另一張卡片意義混入。必要時以簡短文字說明設計取捨。圖示是輔助導覽，不能單獨承載精確業務資格；沿用卡片標題。

## 2. 直接申請／操作說明頁外層背景一致性（追加）

- [x] 使用者提供實際畫面：點「直接申請」「操作說明」後，頁面內容區出現近乎白色遮罩，與點「我是屋主」「我是房客」後能透視住宅背景圖的效果不一致。已核對來源：`site/template.html` 兩入口 section `#direct-apply`、`#operation-guide` 都有 `v2-inner-page v2-entry-content`，而 `assets/css/guide-v2.css` 的通用 `.v2-inner-page { background:#fffefbf5; }`（alpha 約 96%）遮蔽全站 `body.v2-body::before` 的背景層。屋主／房客區不套用該底色。
- [x] **只取消這兩個入口頁的外層 section 底色**（例如在通用規則後增加對 `.v2-inner-page.v2-entry-content` 的精確 `background: transparent` 規則；確認該 class 僅兩頁使用，或以兩頁 ID／data-page 限定）。使內容區標題、說明、卡片間距、影片周圍露出原有固定背景，與屋主／房客相同的可見程度。不要使用整容器 opacity、另疊圖、重建背景或調整背景圖片、漸層、定位、快取版本與其他頁的遮罩。
- [x] 保持直接申請三卡白底、框線、文字及 hover，操作說明的版本切換器、影片封面／播放器底色、控制列、對比、尺寸及全螢幕不變；不變更標題、間距、格線、入口選中、捲動定位、原導航、可及焦點、申辦連結或影片來源。原房客／屋主、方案詳細頁與比較頁原有背景保持不變，不修改通用 `.v2-inner-page` 使所有頁透明。列印仍不顯示背景圖。
- [x] 實際瀏覽器驗證四入口切換、直接深連結、返回／重新整理，桌機及手機（至少 1440、390、320px，100/200% 字級）對照屋主／房客。以 computed style 驗證僅兩入口外層背景透明、body 原背景層不變、申請三卡白色、影片及切換器原底色不變、比較及詳情原背景不變；目視確認右側背景圖可辨識、沒有整塊白遮罩或新色差、文字可讀且無溢出。檢查影片切換及播放控制未受 CSS 影響（不必重新上傳或耗時重播全部影片）；截圖僅存 `.preview/`。在既有 Cloudflare 測試站驗證實際部署效果。

## 3. Checklist／限制

- [x] 依 AGENTS／Workflow 核對 Repo、Remote、Branch、HEAD、工作樹，安全同步；不另開分支、不覆寫其他變更。
- [x] 圖示部分只修改 `scripts/icons.mjs` 內 `personal` 與 `subsidy` 的 SVG artwork；維持 16 個 key、`cardIcon()`、24×24 viewBox、1.8 stroke、round cap/join、currentColor、無填色、aria-hidden / focusable=false、原有尺寸與 accent。採原生 SVG，不載入新套件、字型、圖檔、CDN。無小字、無裝飾性微小細節；留白、光學重心與對比與其他圖示一致。
- [x] 在實際卡片顯示尺寸（非僅放大預覽）設計與比較候選，檢查握手與其他三個屋主方案、補助款與其他兩個房客服務及租金標準計算機的區別；灰階及現行 accent 也能辨識。必要時迭代手形／票面／箭頭輪廓，避免兩形體重疊或裁切。截圖與草案只存在 Git 忽略的 `.preview/`（不入 Git）。
- [x] 其他 14 個 artwork 必須 byte-for-byte 不變（包含上輪屋主／房客）；背景 WebP/PNG、OG/快取、第六卡獨立 hover、模板、卡片尺寸／配色／排列／文案、連結、導航、政策、GA4、Messenger、CX、R2、部署設定全部保留。CSS 僅容許第 2 節的限定外層背景透明修正。從來源生成 `index.html`，只容許必要的圖示及兩入口背景變更、相關測試、文件；不得手改產物。
- [x] 保留 `tests/fixtures/card-icons-4fc7521.json` 及原四圖示差異守門測試；新增開工基準 `6e6d7fe` 的 16 artwork SHA-256 fixture／對應斷言（從該 SHA 的實際來源生成，不從完工圖示反推），確認本輪變更恰為 `personal`、`subsidy`；其他 14 個完全一致。保留原 SVG library 結構、背景 bytes/版本、四方案編號、GA4 與功能測試，不放寬舊斷言。
- [x] 執行 `npm run build`、`node scripts/build.mjs --check`、`npm test`（前輪 69 項）、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`、`git diff --check`；以現有 `scripts/visual-consistency-browser-check.cjs`、`scripts/icon-refinement-browser-check.cjs` 或等效的針對性檢查，至少確認桌機 1440、手機 390/320px 以及 200% 字級下實際屋主方案／房客服務圖示與選中狀態無裁切、重疊、溢出；原導航、focus、獨立 hover 無回歸，並執行第 2 節兩入口背景及影片控制檢查。不得向真實 CX 送題或污染 GA4，不替實機背書。
- [x] Commit/Push 原指定分支，確認遠端 SHA、現有 Cloudflare 自動建置及測試站實際 HTML 中兩個新 SVG 及 CSS 背景規則與本地吻合（環境受限明列 BLOCKED／TLS 診斷模式）。回報具體圖示、兩入口背景 computed style／目視驗證、改動範圍、測試、部署及 [測試網址](https://rental-tax-guide-test.pages.dev/)，更新 State／Task／Worklog 及必要文字／JSON 證據，不提交截圖。
- [x] 完成狀態最後區分技術通過與使用者辨識度確認；自動測試不能證明民眾一定看懂，人工驗收仍待使用者檢視實際測試站。其他既有 BX015、實機／輔助科技、業務驗收待辦維持；不 merge main、不正式部署或改雲端設定，純 Repo 任務不掃描 Drive。


## 第四輪執行紀錄

由乾淨遠端 d2cf8d5 同步；personal 改握手合作、subsidy 改鈔票與向下領取箭頭。只對 #direct-apply / #operation-guide.v2-entry-content 設透明背景，其他底色、背景資產、模板、JS 與業務資料保留。從 6e6d7fe 真實來源產生 SHA-256 fixture，確認僅兩圖改變、其他 14 圖不變；舊 fixture 及四圖差異守門仍保留。70/70 單元、建置一致性、budget、Pages 33 檔、五寬度×兩字級與 hover/touch 回歸通過。截圖僅 .preview/；待推送與 HTTPS 複驗，辨識度及實機人工確認仍保留。證據見 [報告](evidence/2026-11-16-handshake/REPORT.md)。


第四輪部署完成：bcb857dd1930bba814a5a5e2cc43ad2fdc59baa8，Cloudflare deploy 3edcb6fb-4d5b-44c8-bcc0-d979613d711d SUCCESS。HTTPS computed style、1440/390/320×兩字級、原生影片控制／切換與導航回歸 PASS；兩入口透明 rgba(0,0,0,0)，詳情／比較維持 rgba(255,254,251,0.96)，卡片白底及播放器 rgb(16,56,68) 保留。實際畫面已檢視。瀏覽器為憑證診斷模式；Node 正常 TLS 逐 bytes 核對線上 HTML/CSS/背景與本地一致。其他14圖、背景資產、模板、JS、政策及雲端設定不變。收尾只補文件，runtime不變；辨識度及實機等原有人工待辦仍保留。
