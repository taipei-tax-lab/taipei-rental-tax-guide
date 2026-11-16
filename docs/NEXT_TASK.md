# NEXT_TASK — 2026-11-16 四張卡片圖示、租金標準子按鈕 Hover 與背景建物修整

狀態：**IMPLEMENTED_TEST_DEPLOYED_PENDING_HUMAN_REVIEW**（2026-11-16，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
程式／證據基準：`4fc7521744bdcaecd27d4c6c159fb94eb8449a7e`；上一輪 Cloudflare check SUCCESS，68/68 單元及瀏覽器回歸已有紀錄。使用者檢視改版後反映部分 icon 語意不易理解，現要求針對該四張卡片重設圖示，並調整「出租房屋達租金標準」雙子按鈕 hover；使用者再指定維持背景 A 構圖但移除具負面觀感的建物特徵。前兩個重複輸入「我是房屋」依目前入口名稱理解為「我是屋主」「我是房客」，本輪不改標題。上一輪完整核定需求及完成紀錄見 [前輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/4fc7521744bdcaecd27d4c6c159fb94eb8449a7e/docs/NEXT_TASK.md)、[驗證報告](evidence/2026-11-16-visual-consistency/REPORT.md)。

## 1. 核定範圍與設計方向

重繪下表四個卡片 SVG，按第 2 節調整租金標準雙子按鈕 hover，並按第 3 節以修整版背景 A 替換現行背景；保留其他十二個圖示、版面、卡片順序、尺寸、原始配色、內容及其餘互動。表中「設計構想」是實作建議，具體 path 可由 Coding Agent 調整，以小尺寸即可辨認且同一套設計語言為準。

| 卡片 | icon key | 現行辨識疑點（來源觀察／推論） | 建議設計構想 |
| --- | --- | --- | --- |
| 我是屋主（主入口） | `owner` | 房屋輪廓被切斷，鑰匙較小且與房客重複 | 以完整、清楚的房屋輪廓為主，搭配簡潔人物頭肩置於屋內，表達屋主身分；不要再以小鑰匙作主要辨識線索。 |
| 我是房客（主入口） | `tenant` | 人物身體與鑰匙分離，視覺像兩個無關符號 | 以完整人物頭肩／人形為主，搭配小型、輪廓明確的行李箱，表達租住／入住；房屋不得成為主體，與屋主形成明顯區別。避免像單純旅遊標誌。 |
| 個人租賃住宅包租代管（屋主四方案） | `personal` | 小房屋與文件重疊，屋形及文件皆不完整 | 一棟清晰房屋搭配容易辨認的合約／管理文件（紙張輪廓及一至兩條文字線），表達住宅租賃與代管；主次清楚，避免繁複印章、過多細節或與社會住宅的盾牌混淆。 |
| 我要申請租金補貼（房客三卡） | `subsidy` | 抽象托手與房屋相連，沒有醒目的金錢符號 | 房屋搭配清楚的硬幣／補助款符號，例如圓形硬幣及簡潔貨幣線條；避免難懂手勢、美元專屬文字及過小符號，與租金標準卡的計算機區別。 |

## 2. 出租房屋達租金標準：雙子按鈕獨立反色

- [x] 現況 `.v2-audience > .v2-audience-button:hover:not([aria-current="true"])` 會使非互動父框整張變色，`.v2-income-standard-action:hover` 目前只使用淺色底。限定修改 `assets/css/guide-v2.css` 的第六卡 hover 規則：父框 `.v2-income-standard-entry` 在滑鼠移入其標題、icon、留白、兩按鈕間隙及子按鈕時，一律維持原閒置白底、深青字色、外框及陰影；不得變色，也不具整張點擊行為。
- [x] 僅滑鼠位於「試算」或「申請」的可點擊範圍時，該子按鈕才反色；背景採其他主卡已選狀態使用的既有 `var(--teal)` 深綠色，文字白色（`#fff`），邊框必要時沿用 `var(--teal-dark)`。另一子按鈕維持原淺色底及深色字；滑出即恢復，不製造持久選中狀態。不得修改其他主卡 hover / selected 規則的實際表現。可用精確排除 selector 或適當 specificity 覆寫，不依賴 JS。
- [x] 保留鍵盤 `:focus-visible` 清晰提示、獨立原生連結及至少 44×44px 點擊目標；不要以 hover 代替焦點或造成觸控黏滯反色。維持原本試算／申請 URL、開啟方式、GA4 與卡片尺寸，禁止將外框做成巢狀互動元件。

## 3. 背景 A 局部修整（新增）

- [x] 使用 GPT 依現行背景 A 原圖局部編修後提供的實際素材 `assets/images/hero-taipei-a-refined.webp`（1672×941、135064 bytes，Git blob `81760c85cfdde844809a04f1ab6a5ba51c25d293`）。不要另行生成、重新設計背景、任意選圖或改用舊 A。維持原有清淡水彩、左側長留白、右側街廓、樹木、遠景臺北 101、山景及色彩；僅整修建築外觀。
- [x] 使用者特別指出右數第二棟有疑似鐵窗、頂樓加蓋等具負面觀感的建物特徵；修整版已將該棟突出鐵窗／外推籠、臨時雨棚與屋頂棚架改為普通窗戶、正常陽台與整齊屋頂，也避免其他街廓出現類似違建意象、破敗或雜亂建物。視覺上呈現整潔、友善、正面的住宅街景，不以插畫認定任何現實建物是否合法；不得增添具有相同負面觀感的元素。普通欄杆、整齊既有住宅可保留，不需全數改成豪宅。
- [x] 將提供的 WebP 原 bytes 接入現行 runtime `hero-v2.webp`，並由同一 WebP 解碼產生同像素 PNG fallback `hero-v2.png`，保留既有尺寸 1672×941、CSS 右側構圖、漸層、版面及現行檔名；同步現行 OG image、內容雜湊版本、建置及必要的資產驗證。確認實際正式資產、WebP/PNG 同像素且均為新圖、MIME 正確後移除暫時交接名（Git 歷史仍留存），避免重複正式資產。不得修改部署白名單範圍或帶入舊背景作為 fallback。
- [x] 既有 WebP 700KB budget、Pages 33 檔白名單、無額外外部圖片請求維持。若既有測試固定前輪 A 的 hash、bytes 或圖像版本，僅更新為本輪新圖的可驗證基準，不刪減 fallback、像素一致性、快取版本或 MIME 驗收。

## 4. 實作界線

- [x] 依 AGENTS／Workflow 檢查 Repo、Remote、Branch、HEAD 及工作樹，安全同步指定遠端分支；如有衝突保留現況回報。
- [x] 只在 `scripts/icons.mjs` 的 `owner`、`tenant`、`personal`、`subsidy` 重新設計圖形；沿用 `cardIcon()`、所有原 key 及 `data-card-icon` 識別。其餘 12 組 SVG path 不變。不引入外部 icon 庫、字型、emoji、額外圖片或 CDN。
- [x] 沿用既有 24×24 viewBox、1.8 stroke、round cap/join、currentColor、無填色、aria-hidden / focusable=false；線條粗細、留白、光學重心和顯示尺寸與既有圖示一致。以一個主要形體和最多一個簡明輔助符號辨識概念，避免裁切、過密、交疊造成的歧義。保留既有不同方案 accent、主入口選中狀態及真實 HTML 文字標籤。
- [x] 先在實際卡片尺寸繪製並比較原／新圖示；不要只在放大 icon 預覽中判斷。先對照屋主與房客兩張、個人／社會住宅方案以及租金補貼／租金標準的相似語意，再確認與同組其他圖示一致。允許 Agent 迭代構圖，但不以全站重繪或新增說明文字掩蓋辨識問題。
- [x] 從來源重新生成 `index.html`；CSS 僅允許第 2 節的限定 hover／焦點相容修正及第 3 節背景引用／快取版本的必要調整；模板或 build 只允許背景引用／OG 版本的必要調整。若有必要只調整相關測試或新增針對性測試，不改卡片配色、尺寸、文案、排列、外部連結、政策、互動、GA4、Messenger、CX、R2 或部署設定。任何超出四圖示、雙子按鈕 hover 與背景替換的 UI 變更先回報。

## 5. 驗收與交付

- [x] `npm run build`、`node scripts/build.mjs --check`、`npm test`（基準 68 項）、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`、`git diff --check` 通過。測試確認 16 個 SVG 正常渲染、四 key 仍各自不同且只四個定義改變、其他十二個保持原樣、建置輸出同步及 Pages 33 檔、GA4 隔離不變。
- [x] 以現有 `scripts/visual-consistency-browser-check.cjs` 或等效的針對性瀏覽器檢查，至少核對 1440、390、320px 與 200% 字級；首頁屋主／房客主卡、屋主四方案、房客三卡的實際畫面及選中狀態，確認辨識、對齊、無裁切、無重疊與無溢出，並確認原卡片／外部連結／鍵盤及既有導航功能未受影響。可用既有五寬度測試。不得向真實 CX 送題或污染 GA4。
- [x] 新增可重現瀏覽器 hover 驗收（實際滑鼠移動／computed style）：父框標題、icon、留白、按鈕間隙均維持閒置顏色；hover 試算及申請各自只該按鈕為 `var(--teal)`、白字，另一顆與父框不變；移開還原。核對顏色與其他主卡已選狀態相同、鍵盤焦點可見、手機按鈕仍可獨立操作及無重疊。不得只檢查 CSS 文字而跳過實際瀏覽器效果；若環境阻擋明列 BLOCKED。
- [x] 核對背景修整版實際顯示於本機與 Cloudflare 測試站（WebP、PNG fallback、OG、MIME、精確 bytes／hash、快取版本），桌機／手機的留白、裁切、文字可讀性無退化；確認右側第二棟及其他街廓已無明顯鐵窗籠、臨時頂樓棚架、突出雨棚等負面建物意象，且無新增負面建物。視覺問題由使用者最後確認；機器量測不可替代人工審查。
- [x] 機器測試僅能驗證技術與視覺結構；辨識度須由使用者看實際網站確認，不能以測試通過替代人工核定。截圖可存在 Git 忽略的 `.preview/` 供當輪檢視，絕對不提交 GitHub；僅提交必要文字／JSON 測試證據，供後續在 Cloudflare 測試站人工確認。
- [x] 更新本 Task checklist、State、Worklog；commit/push 原指定分支，核對遠端 SHA、既有 Cloudflare 自動建置與實際線上版本（若無法讀回／實測，明列 BLOCKED，不冒稱完成）。回報四個圖示實際設計、雙按鈕 hover 實測、修整版背景資產及驗證、變更檔案、commit、測試與測試網址，保留既有實機／業務驗收待辦。未獲授權不 merge main、不正式部署、不改雲端或管理端設定。純 Repo 任務不掃描 Drive。


## 本輪執行狀態

已完成四 key 重繪、雙按鈕獨立 hover 與修整版背景接入。本地 build / --check / 69 項單元 / performance / Pages 33 檔 / diff、五寬度×兩字級及針對性 hover／觸控／導航驗證通過；六主卡位置尺寸相對開工 10 組量測差異皆 0px。實際 runtime 位於根目錄 `hero-v2.*`，已依現況校正第 3 節路徑，不變更白名單。交接名於實際資產像素／MIME 驗證後移除，Git 歷史保留。

實作 `2b9d2f1cc8c86ea3c5dfc03319c24df79c40c0b3` 已推送，Cloudflare check / deploy SUCCESS；真實測試站 hover / touch、五寬度×兩字級、WebP / PNG fallback / OG / MIME / 正常 TLS bytes 核對及非 CX 回歸通過。收尾只補部署與驗證文件，runtime 不變。上方勾選指實作與實際執行的技術檢查，不能取代圖示辨識度／背景觀感及實機人工核定。完整命令、證據與限制見 [REPORT](evidence/2026-11-16-icon-refinement/REPORT.md)。
