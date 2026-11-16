# NEXT_TASK — 2026-11-16 兩個服務圖示直覺辨識再優化

狀態：**READY_FOR_IMPLEMENTATION**（2026-11-16，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
開工基準：`6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943`（本次核對 Cloudflare Pages check SUCCESS）。前輪實作 `2b9d2f1`，69/69 單元及技術驗證已有紀錄；使用者檢視後明確反映「個人租賃住宅包租代管」和「我要申請租金補貼」兩個 icon 仍不夠直覺易懂，要求再設計。本輪不是重做前輪；[前輪完整 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943/docs/NEXT_TASK.md)、[前輪 report](evidence/2026-11-16-icon-refinement/REPORT.md) 保留。

## 1. 核定目標／設計方向

改換視覺隱喻，非微調現有房屋＋文件／硬幣構圖。前輪 `personal` 與 `subsidy` 的房屋 path 完全相同，後者用寫有 1 的小圓圈，文字線條在小尺寸易被誤認；前者小房屋與折角文書未直接表達委託管理。此為程式圖形觀察與設計推論；使用者核定的目標是更直覺、易懂。兩圖主體必須明顯不同，毋須每張圖都加入房屋。

| 卡片 | key | 本輪建議構圖及辨識重點 |
| --- | --- | --- |
| 個人租賃住宅包租代管 | `personal` | **握手／合作委託**。以兩人握手為單一主體、兩端袖口與中央交握輪廓清楚，傳達屋主與專業代管方的委託合作。避免把手畫成不明多邊形或繁複手指；不再使用房屋＋文件、不加鑰匙或盾牌等小裝飾。以通用握手 pictogram 概念自繪符合現行線條風格。 |
| 我要申請租金補貼 | `subsidy` | **領取補助款**。以大而完整的矩形鈔票（中央簡潔貨幣符號或圓形票面、少量票面記號）和明確的向下領取箭頭／接收構圖表達收到款項，而非支付、計算或退費。兩元素清楚且無密集線條；優先採清楚的鈔票＋向下箭頭，不再用小房屋＋寫 1 的硬幣或難辨識的托手。不要呈現實際金額或暗示已核定／保證獲補助。 |

以上為 GPT 建議的構圖方向；實作可在同一語意下比較少量圖形草案，選擇實際尺寸最清楚者，不將另一張卡片意義混入。必要時以簡短文字說明設計取捨。圖示是輔助導覽，不能單獨承載精確業務資格；沿用卡片標題。

## 2. Checklist／限制

- [ ] 依 AGENTS／Workflow 核對 Repo、Remote、Branch、HEAD、工作樹，安全同步；不另開分支、不覆寫其他變更。
- [ ] 只修改 `scripts/icons.mjs` 內 `personal` 與 `subsidy` 的 SVG artwork；維持 16 個 key、`cardIcon()`、24×24 viewBox、1.8 stroke、round cap/join、currentColor、無填色、aria-hidden / focusable=false、原有尺寸與 accent。採原生 SVG，不載入新套件、字型、圖檔、CDN。無小字、無裝飾性微小細節；留白、光學重心與對比與其他圖示一致。
- [ ] 在實際卡片顯示尺寸（非僅放大預覽）設計與比較候選，檢查握手與其他三個屋主方案、補助款與其他兩個房客服務及租金標準計算機的區別；灰階及現行 accent 也能辨識。必要時迭代手形／票面／箭頭輪廓，避免兩形體重疊或裁切。截圖與草案只存在 Git 忽略的 `.preview/`（不入 Git）。
- [ ] 其他 14 個 artwork 必須 byte-for-byte 不變（包含上輪屋主／房客）；背景 WebP/PNG、OG/快取、第六卡獨立 hover、CSS、模板、卡片尺寸／配色／排列／文案、連結、導航、政策、GA4、Messenger、CX、R2、部署設定全部保留。從來源生成 `index.html`，只容許必要的圖示變更及相關測試、文件；不得手改產物。
- [ ] 保留 `tests/fixtures/card-icons-4fc7521.json` 及原四圖示差異守門測試；新增開工基準 `6e6d7fe` 的 16 artwork SHA-256 fixture／對應斷言（從該 SHA 的實際來源生成，不從完工圖示反推），確認本輪變更恰為 `personal`、`subsidy`；其他 14 個完全一致。保留原 SVG library 結構、背景 bytes/版本、四方案編號、GA4 與功能測試，不放寬舊斷言。
- [ ] 執行 `npm run build`、`node scripts/build.mjs --check`、`npm test`（前輪 69 項）、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`、`git diff --check`；以現有 `scripts/visual-consistency-browser-check.cjs`、`scripts/icon-refinement-browser-check.cjs` 或等效的針對性檢查，至少確認桌機 1440、手機 390/320px 以及 200% 字級下實際屋主方案／房客服務圖示與選中狀態無裁切、重疊、溢出；原導航、focus、獨立 hover 無回歸。不得向真實 CX 送題或污染 GA4，不替實機背書。
- [ ] Commit/Push 原指定分支，確認遠端 SHA、現有 Cloudflare 自動建置及測試站實際 HTML 中兩個新 SVG 與本地吻合（環境受限明列 BLOCKED／TLS 診斷模式）。回報具體圖示取捨、改動範圍、測試、部署及 [測試網址](https://rental-tax-guide-test.pages.dev/)，更新 State／Task／Worklog 及必要文字／JSON 證據，不提交截圖。
- [ ] 完成狀態最後區分技術通過與使用者辨識度確認；自動測試不能證明民眾一定看懂，人工驗收仍待使用者檢視實際測試站。其他既有 BX015、實機／輔助科技、業務驗收待辦維持；不 merge main、不正式部署或改雲端設定，純 Repo 任務不掃描 Drive。
