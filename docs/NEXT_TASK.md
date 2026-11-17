# NEXT_TASK — 2026-11-17 書表區緊湊化、租金標準名稱與全站 RWD 複檢

狀態：**PLANNED**（2026-11-17，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
開工基準：`5ca8b42651555512548e195f6b5f46b7371712f0`。前輪房客獨立展收與六份書表已實作、測試站驗證；[前輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/5ca8b42651555512548e195f6b5f46b7371712f0/docs/NEXT_TASK.md)／[前輪報告](evidence/2026-11-17-forms/REPORT.md)。GPT 核對差異並獨立重跑 73/73、build --check、效能、Pages 33 檔與 diff check 成功。使用者檢視前輪畫面後核定以下三項修改及全站響應式複檢；本輪只交接需求，尚未實作。

## 1. 書表下載區視覺微調（直接申請）

- [ ] 依使用者提供畫面，維持現有兩組「書表下載」「填寫範例」、各兩列、六個按鈕，仍置於原三張申請管道卡片下方，不重排功能或新增卡片。
- [ ] 適度縮短兩組及各列垂直高度；來源 `assets/css/guide-v2.css` 現行 .v2-form-group padding 22px 0，li padding 12px 0，.v2-forms margin-top 32px。優先調整 group padding 至約 14–16px、li padding 至約 6–8px（數值為實作起點非硬性定值），必要時稍縮 section 上方空隙；保留細分隔線、留白、現有文字大小及可閱讀性。不得透過固定高度、裁切或將按鈕縮小到難以操作達成。以相同 viewport／字級量測前後實際區塊高度，桌機目標約減少 10–20%（因內容換行而合理調整）；手機不要求同一比例，不犧牲可及性。
- [ ] ODT/PDF 按鈕仿照首頁所得達租金標準卡的「試算」「申請」：現行 .v2-income-standard-action 背景 #edf5ef、邊框 #92b2ae、文字 #103844、圓角 6px、滑鼠 fine pointer hover 深綠 var(--teal) 白字、邊框 var(--teal-dark)。優先以共用樣式／token 或 scoped selector 共用顏色、邊框、hover 設定，保留兩類按鈕各自尺寸配置；不得改原試算／申請行為、外框、事件或 link。書表按鈕維持至少 44×44 CSS px、明確鍵盤焦點，ODT/PDF 可讀且不黏滯反色，手機 touch 正常，不新增圖示／裝飾。
- [ ] 書名與格式按鈕依長度自然換行／堆疊（既有 700px breakpoint 可按結果調整）；ODT/PDF 可並排，極窄或放大時允許按鈕群換行，不能覆蓋書名或跑出卡框；桌機維持書名旁緊鄰格式按鈕設計。保留兩組語意、六 href、可及名稱、焦點次序與原生下載／新視窗，無新增 GA4 事件。保持 .v2-tenant-grid獨立展收及直接申請三卡等高、外層透明；禁止下載原檔入 Git／Pages。

## 2. 首頁第六卡名稱

- [ ] 將「出租房屋達租金標準」精確更名為「出租房屋所得達租金標準」。現行 `site/template.html` 的 #income-standard-title 由兩 span 構成；從來源改，可採「出租房屋所得」／「達租金標準」自然換行，但極窄／放大時避免 inline-block 整段無法斷行或遮住左側 SVG。維持六卡統一外框、字級、圖示、DOM 順序與「試算」「申請」兩獨立連結、role=group／aria-labelledby、現有 hover。不要修改其他政策敘述或資料；已核定 exact title 的測試（tests/build.test.mjs、tests/ux2.test.mjs、scripts/ux2-browser-check.cjs 等）按新名稱更新，其他原斷言保留；重建 index.html。

## 3. 全站響應式設計複檢及針對性修正

使用者要求本輪一併檢查手機版等 RWD 並修正實際發現問題。不是重新設計全站或更改業務內容。以核定現行桌面設計為基準，測量真實 browser layout，不只縮放截圖。

- [ ] 覆蓋至少 320、375/390、414、768、1024、1440px（含 380/381、700/701、1099/1100 等斷點邊界抽樣）及直向手機／平板橫向；標準 100% 與 200% 字級，並以瀏覽器 zoom／視窗 CSS viewport 變化模擬使用者放大（明確區分 emulation 與實機）。必要時用真實手機 viewport height（例如 667、844）確認可操作。避免只測 1440/390/320 三尺寸，特別檢查中間寬度；可採風險相稱矩陣，全面路由 6 個代表寬度×100/200%，斷點與橫向針對重點頁。
- [ ] 逐路由／互動清單：首頁六入口（第六卡長名稱、兩連結、等框；窄時自然降欄）、屋主四方案及快速導引、房客三卡展收與連結、直接申請及書表列表、操作說明兩版本播放器／控制切換、四方案細節及比較（含並列比較控制）、FAQ／資源、頁首／頁尾／字級控制、浮動小幫手入口及現有開合／輸入框位置（以 mock／隔離第三方驗證，不送真實 CX 問題）。各頁檢查水平溢出、文字切斷或重疊、卡片／按鈕列與長書名、可點擊區、focus、返回／深連結／頁內切換是否合理；不能藉全域 overflow-x:hidden 掩飾溢出。
- [ ] 若發現確切 RWD 缺陷，在同輪以局部 CSS／必要語意模板或前端布局修正；記錄問題的路由、寬度／字級／成因及修正前後量測。避免全域樣式重置或改既有桌機設計、縮減本文字級、禁用縮放、任意更動導航邏輯、CX／GA4、影片內容／R2、稅務規則；超出本輪的獨立重大功能或業務變更列待確認。保留六入口原樣式、獨立展收、白卡透明頁背景、核定 icon／背景圖、兩影片相對路徑方案與書表來源單一配置。
- [ ] 自動驗證增加有針對性斷言（含六按鈕標準／hover computed style 比對試算與申請、focus-visible、touch 非黏滯、書表前後高度量測、新標題完整可見、所有代表寬度無 horizontal overflow/裁切、原六連結仍在）。既有 forms-browser-check、visual-consistency-browser-check、ux2-browser-check 等適用腳本更新必要預期，原 73 項功能與安全守門不得放寬。RWD 測試截圖僅留 .preview/，提交文字／JSON；不把 emulation 當 iOS/Safari/LINE/Android 實機驗證。

## 4. 收尾與驗收

- [ ] 依 AGENTS／Workflow 核對環境／指定分支／HEAD，安全同步。只在授權分支開發。保留前輪六書表（`site/media.json` applicationForms、forms bucket root URL）、原影片、服務連結、既有六項事件與 GA4 測試隔離、背景及正式資料；純 Repo 工作不掃描 Drive。使用已核准 public R2，不修改 object、metadata、bucket 或 Cloudflare 設定。
- [ ] npm run build、node scripts/build.mjs --check、npm test、node scripts/performance-budget.mjs、node scripts/build-pages-test.mjs、git diff --check；實際 browser 複驗第 3 節矩陣、六連結原生操作／公開正常 TLS 200、直接申請／房客行為正常、原入口／GA4／影片控制回歸。正常 TLS 與診斷模式分開，證據不足不宣稱通過。
- [ ] Commit/Push、確認遠端 SHA、既有 Cloudflare 自動建置及測試站實際效果；更新 Task／State／Worklog，回報問題清單以及驗證與未解限制，交 GPT／使用者審查。不合併 main、不製作機關正式包或部署、不提交任何驗證截圖／書表原檔。BX015、實際手機／輔助科技、業務與機關驗收等既有人工項目保留。
