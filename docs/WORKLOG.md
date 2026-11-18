# WORKLOG — 重要歷史與證據索引

此文件只記錄發生過的變更、決策與有日期的證據。現況以 [PROJECT_STATE](PROJECT_STATE.md) 為準；執行指令以 [NEXT_TASK](NEXT_TASK.md) 為準。過去 Task 中的「待審查／未發布／下一步」等是當時的階段，不代表現在仍可執行。既有詳細文件保留。

| 日期 | 歷程／證據 |
| --- | --- |
| 09/08–09/17 | V2 改版由原 Next 靜態快照轉成零相依可重建網站，保留四方案及服務；PR #2、#3 等見 [V2 紀錄](v2-development.md)、[9/17 handoff](handoff/2026-09-17_出租房屋租稅優惠專區_HANDOFF.md)。 |
| 09/24 | 財產稅科核定文字／資源修正，PR [#8](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/8) 合併；[原 Task](../TASK_2026-09-24_PROPERTY_TAX_REVIEW.md)。 |
| 09/27 | 正式 CX Phase 5A、發布維護、快速導引層級及 Messenger 多站配置；PR #9–#12 已合併。[Phase 5A](../TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE.md)、[維護](../TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md)、[UX](../TASK_2026-09-27_IMPECCABLE_UX_AUDIT.md)、[多站](../TASK_2026-09-27_MESSENGER_MULTISITE_CONFIG.md)。`experiment/impeccable-free-design` 是獨立設計實驗，非待合併功能。 |
| 09/29 | 房屋稅年期 runtime context v1，PR #13 已發布。[任務與驗收](../TASK_2026-09-29_HOUSE_TAX_PERIOD_CONTEXT_V1.md)。 |
| 10/02 | GA4 基礎與事件 v1，PR #14、#15 已發布，配置 Realtime 代表事件與 custom definitions；中文 Explore 報表延後。[原 Task](../TASK_2026-10-02_GA4_EVENT_TRACKING_V1.md)。 |
| 10/10–10/13 | CX 正式基準文件校正 PR #16；後端 10/13 四服務 runtime gate 4/4，另見 [後端現況](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d/docs/CX_CURRENT_PRODUCTION_ARCHITECTURE.md)。 |
| 10/21 | 外部箭頭去除 PR [#17](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/17)，main `d5fad9e`，Pages [成功](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/39564340362)。[原 Task](../TASK_2026-10-21_REMOVE_EXTERNAL_LINK_ARROWS.md)。一次性部署 ZIP [run](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/39565683012) 固定此 SHA，非最新功能交付包。 |
| 10/28 | [機關部署診斷](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/diagnostics/official-rentaltax-hosting-20261028/docs/hosting/2026-10-28_official_deployment_diagnosis.md) 及[資訊室處理清單](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/diagnostics/official-rentaltax-hosting-20261028/docs/hosting/2026-10-28_it_remediation_checklist.md) 保留於診斷分支（未合併），CSP／WebP 404 為當日證據，未驗證修復。 |
| 10/31 | 隱藏 Messenger 捲動按鈕，PR [#18](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/18)，main `28fd76a`、Pages 成功。功能擴充分支新增直接申請、操作影片、Cloudflare 測試 build 隔離 GA4、六入口與導覽、影片原生控制。`ea05b3e` 為最後已完整記錄 HTTPS 影片回歸的程式 SHA；63/63 tests、非 CX HTTPS 驗收與 33 assets 證據；實體 iPhone LINE 待驗收。見 [10/31 Task](../TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md)、[HTTPS evidence](evidence/2026-10-31-native-video-controls/native-controls-https.json) 及 [history/](history/)。 |
| 11/04 | feature `c6d9cee` → `51161da`，七次首頁排版修整。五張卡與插圖卡視覺尺寸匹配、desktop 六入口兩列、compact／左對齊、操作說明與所得達租金標準交換；最終 Cloudflare check success。僅來源 CSS/template 更新，原有 `index.html` 沒有同步。尚未取得新的完整驗收證據。 |
| 11/16 | 使用者指定延續現有 Cloudflare branch，先整理矛盾文件，不開始此次改版實作。校正既有發布狀態、測試證據邊界、PoC 與正式環境、11/4 最新來源與生成物差異；新增統一 Agent 入口與現行文件，保留原始紀錄。 |

| 11/16（需求核定） | 使用者確認沿用既有 Cloudflare feature；要求租金標準卡維持尺寸並改文字／雙子按鈕、直接申請改三種管道、現行視覺一致及前端 GA4。任務規格與六個點擊訊號寫入 NEXT_TASK；沿用既有 GA4 維度及測試站隔離。前次文件校正 commit `d18ae1d`；本次僅更新正式作業文件，尚未實作。 |

## 已記錄的非阻擋維護 backlog

9/27 [維護 Task](../TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md) 曾列出索引式房客服務分類、build 中 FAQ 硬編碼、`resources.slice(3)` 依賴順序、小幫手初始圖片請求、Messenger shadow DOM workaround、政策版本／核對日期語義等。尚未重新排定；依業務效益與改版範圍決定，不順手重構。SEO／CSP 等廣泛 hardening 亦未核定；機關實際 CSP 故障另依 10/28 診斷處理。

## 2026-11-16 申請入口實作

由指定分支乾淨 `b55060a` 同步，完成首頁文字／試算／申請、直接申請三管道、GA4 六項映射、生成物同步與測試順序修正。短申請頁導致原生 history 捲動還原被夾至頁底，已補 reflow 後還原並通過回歸。本地 65/65 tests、四寬度六卡尺寸比對、鍵盤／mock／隔離 GA4／非 CX 回歸及 36+12 組捲動縮放量測通過；五外站實際瀏覽器讀回，BX015 HTTP 404 但可讀內容仍列人工確認。R2 於 11/8 的外部更新使原大小／時長快照失效，本輪唯讀核對並更新測試，未改物件。詳見 [本輪 report](evidence/2026-11-16-entry-redesign/REPORT.md)；程式 `f3d5063` 推送後，視覺複核補保留桌機原插圖可見框內縮與 18px 圓角，形成 `f2d04d3`；兩次 Cloudflare check SUCCESS。`f2d04d3` 的實際 HTTPS 四寬度入口／UX2／非 CX／GA4 隔離與 R2 播放回歸通過，結果及截圖同步 report；最後只補證據文件。


## 2026-11-16 GPT 審查與截圖清理

獨立核對 `101f1a3` 的差異、桌機與手機畫面、Cloudflare check SUCCESS，重跑 build --check、65/65 tests、performance budget 與 33 檔 Pages test build 均 PASS。依使用者要求自現行工作分支移除 `docs/evidence/` 內全部 49 張測試截圖（11/16 29 張、10/31 20 張），保留 JSON／log／文字報告、所有實際網站圖片與原始 Git 歷史。歷史文件提及的截圖是當時的證據，現行樹不再保存；後續截圖僅存 `.preview/`，不提交 GitHub。未改 runtime、未合併 main 或正式部署。

## 2026-11-16 第二輪視覺一致性需求核定

使用者選定 GPT 生成的候選 A「臺北住宅街廓」背景，提出十項視覺改版：沿用房客三欄配置直接申請、六主卡一致外框配色與圖示、屋主四方案圖示與取消數字、房客三卡圖示、比較片語調整，以及主／子卡整體圖示語言一致。基準為 `7866755`；本輪先提交核定任務文件及選定 A 的 WebP 網站素材（非截圖），不變更 runtime、政策、連結、GA4/CX 或正式部署。實作及驗收見 [該輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/4fc7521744bdcaecd27d4c6c159fb94eb8449a7e/docs/NEXT_TASK.md)。


## 2026-11-16 視覺一致性實作與本地驗證

由遠端 `bea4edb` 乾淨同步，在原指定分支實作核定十項需求：A 圖 WebP / PNG 與快取版本、六主卡共用外框及可見圖示、16 個集中自製 SVG、直接申請與房客三欄語言、四方案移除裝飾標號及精確比較片語修正。保留所有政策／服務資料、事件與 Messenger / media 行為；未修改雲端設定。原 65 項加 3 項單元共 68 PASS；五寬度×100/200% 字級、同框／圖示／44px 子連結、原鍵盤／事件／歷史與 36+12 捲動縮放回歸通過。R2 原 URL metadata / Range 與影片播放回歸採明確 TLS 診斷模式，環境憑證錯誤保留限制。截圖僅在 `.preview/`；文字與 JSON 見 [report](evidence/2026-11-16-visual-consistency/REPORT.md)。完整來源 `346d24d` 已推送，Cloudflare check / API deploy SUCCESS（部署 `8a04701f-9b6b-4ca5-96e8-e528e5cf1733`）。首筆 `f584ed3` 漏入模板，已在 `346d24d` 補齊並檢查建置一致，不以中間版作驗收。HTTPS 五寬度×兩字級／入口／UX2／六個 mock 事件／非 CX／GA4 隔離及 R2 影片回歸皆通過（Chromium TLS 診斷模式）；正常 TLS 的 Node 讀回確認線上 HTML / CSS / A pair / 主要 JS 與本地產物逐 bytes 相同。收尾補測試代理相容與證據文件，runtime 不變；待人工視覺與實機覆核。


## 2026-11-16 第三輪圖示辨識需求

使用者檢視視覺改版後提出四個圖示難辨識，需單獨優化屋主／房客、個人租賃住宅包租代管及租金補貼。核對遠端 `4fc7521744bdcaecd27d4c6c159fb94eb8449a7e`（Cloudflare check SUCCESS）及 `scripts/icons.mjs` 現行十六個圖示，保留原設計系統，僅指定四個 key；前輪任務與驗收保存於 [固定 SHA](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/4fc7521744bdcaecd27d4c6c159fb94eb8449a7e/docs/NEXT_TASK.md)。本次提交現行任務、狀態與決策，不改 runtime、不宣稱已實作或新驗收；該輪規格及執行見 [前輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943/docs/NEXT_TASK.md)。

使用者補充：出租房屋達租金標準的非互動外框不應觸發反色；試算／申請各自 hover 才使用其他主卡同款深綠底白字。已併入同一 NEXT_TASK，限定第六卡 CSS 狀態與對應測試，尚未實作。

使用者再次補充：現行背景 A 右數第二棟有疑似鐵窗、頂樓加蓋等不佳建物意象，要求修整且不得呈現較負面的建物。以現行 A 為圖像編修來源，保留構圖、色系與留白；GPT 生成局部修整版並轉為 WebP `assets/images/hero-taipei-a-refined.webp`（1672×941／135064 bytes），整理交接規格與預期驗收，與先前 icon／hover 納入同一任務。本次僅交接素材及文件，尚未替換 runtime 或新增功能測試結果。


## 2026-11-16 第三輪實作與本地回歸

從指定分支最新 `4c6ae97` 乾淨同步；owner 改完整屋內人物、tenant 改人物與入住箱、personal 改獨立住宅與折角合約、subsidy 改住宅與面額硬幣，其餘 12 SVG 定義不變。租金標準父框 hover 精確排除、雙子連結各自深青／白字，觸控不黏滯且焦點／原連結保留。直接接入已提供修整素材，沒有重生圖片；WebP / PNG 都是新圖、全像素相同，135064 / 1245328 bytes，CSS / OG 版本同步，33 檔白名單不變。發現 Task 的 runtime 路徑多寫 assets/images，依實際 Git / CSS / whitelist 保留根目錄並校正文件。69 項單元及必要建置、五寬度×兩字級、實際 pointer／鍵盤／touch／原導航與事件回歸 PASS，六主卡位置尺寸差異 0px。文字／JSON 見 [report](evidence/2026-11-16-icon-refinement/REPORT.md)，所有畫面只留 `.preview/`。實作 `2b9d2f1` 推送後，Cloudflare check / API deploy SUCCESS（`eefe33b8-5bff-45c9-9e43-3a8caedf637a`），實際 HTTPS 五寬度×兩字級／16 SVG／hover 與 touch／焦點／個人方案選中返回／修整背景 fallback 像素與 MIME／33 assets 非 CX 回歸 PASS。Chromium 使用明確憑證診斷模式；Node 正常 TLS 逐 bytes 核對線上 HTML / CSS / 新 A 雙格式 / 核心 JS 一致。收尾只補證據文件，runtime 不變；待使用者視覺辨識／實機確認，沒有改正式或雲端設定。


## 2026-11-16 第四輪圖示再設計需求

使用者檢視既有測試站後反映個人租賃住宅包租代管、我要申請租金補貼兩張 icon 仍不直覺。以 `6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943` 為開工基準（Cloudflare check SUCCESS），核對前輪 SVG 使用相同小屋＋文件／寫 1 的硬幣，建議本輪改採握手和鈔票／領取箭頭，僅改 personal/subsidy，其餘 14 圖、背景、hover 和原功能維持。前輪實作規格與結果見 [固定 SHA](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/6e6d7fe280b1e9d7cf4f2e8e5636cbbcc0504943/docs/NEXT_TASK.md) 與 [report](evidence/2026-11-16-icon-refinement/REPORT.md)。已更新 [NEXT_TASK](NEXT_TASK.md) 及現行 State，不修改 runtime，不聲稱新驗收。

使用者確認握手與鈔票＋領取箭頭兩個圖示概念 OK，追加直接申請／操作說明頁外層背景應與屋主／房客頁相同。核對 template 共用 `v2-inner-page v2-entry-content` 及 CSS `.v2-inner-page { background:#fffefbf5; }`，核定只取消兩入口外框底色，原固定住宅背景、三申請卡白底、影片播放器及其他詳情／比較頁原樣。與兩 icon 納入同一任務，僅提交文件、未改程式，待驗收。


## 第四輪執行紀錄

由乾淨遠端 d2cf8d5 同步；personal 改握手合作、subsidy 改鈔票與向下領取箭頭。只對 #direct-apply / #operation-guide.v2-entry-content 設透明背景，其他底色、背景資產、模板、JS 與業務資料保留。從 6e6d7fe 真實來源產生 SHA-256 fixture，確認僅兩圖改變、其他 14 圖不變；舊 fixture 及四圖差異守門仍保留。70/70 單元、建置一致性、budget、Pages 33 檔、五寬度×兩字級與 hover/touch 回歸通過。截圖僅 .preview/；待推送與 HTTPS 複驗，辨識度及實機人工確認仍保留。證據見 [報告](evidence/2026-11-16-handshake/REPORT.md)。


第四輪部署完成：bcb857dd1930bba814a5a5e2cc43ad2fdc59baa8，Cloudflare deploy 3edcb6fb-4d5b-44c8-bcc0-d979613d711d SUCCESS。HTTPS computed style、1440/390/320×兩字級、原生影片控制／切換與導航回歸 PASS；兩入口透明 rgba(0,0,0,0)，詳情／比較維持 rgba(255,254,251,0.96)，卡片白底及播放器 rgb(16,56,68) 保留。實際畫面已檢視。瀏覽器為憑證診斷模式；Node 正常 TLS 逐 bytes 核對線上 HTML/CSS/背景與本地一致。其他14圖、背景資產、模板、JS、政策及雲端設定不變。收尾只補文件，runtime不變；辨識度及實機等原有人工待辦仍保留。

## 2026-11-17 第五輪房客展收與書表下載需求

使用者核定房客卡片個別展收、直接申請三卡下方依台北服務通形式提供兩份雙格式書表及兩個 PDF 填寫範例。原因核對：後段 CSS 共用 stretch 覆蓋房客原 start。基準 `36b2232`；前輪 70/70 與建置／效能／Pages 33 檔獨立複驗通過，Chromium 權限受限未重跑。使用者已手動建立獨立 `forms` bucket；API 唯讀核對六根目錄物件、GET bytes、PDF／ZIP 檔頭；其 managed r2.dev domain 尚未啟用且無 custom domain。未修改 R2、公用存取須另行核准或由使用者操作；公開下載未驗收。更新 [NEXT_TASK](NEXT_TASK.md) 規定現有測試 R2 連結、未來機關相對路徑、發布門檻與驗收，未開始功能開發；無新 runtime／正式部署／合併。歷史 [前輪 Task](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/36b223204f43a5ce1d522e2b07ddfdb27009750d/docs/NEXT_TASK.md) 保存。

2026-11-17 追加：使用者授權開啟 R2 forms bucket 公開存取；GPT 先核對只有指定六物件，僅啟用該 bucket 的 managed r2.dev domain 並讀回 enabled=true。未改影片 bucket、metadata、物件及網站部署。六個公開 URL 無登入 HTTPS GET 全數 HTTP 200、正常 TLS、大小與基本檔頭相符；實作後瀏覽器下載及正式業務／格式驗收仍待確認。任務文件解除公開存取阻礙，未開始功能開發。


## 11/17 實作回報

4745bd7乾淨同步；房客獨立展收、直接申請書表兩組六連結已實作。73/73與建置、效能、33檔Pages、路徑正負驗證及瀏覽器回歸通過。六公開R2網址正常TLS無登入GET為200，bytes／PDF簽章／ODT內部mimetype與content.xml通過。書表原檔及所有截圖只存.preview，未提交；R2 metadata／物件與原影片未改。待本輪推送／測試站複驗、GPT審查；原業務與實機人工待辦保留。詳見 [報告](evidence/2026-11-17-forms/REPORT.md)。


第五輪部署：36afac160d85bb2db4ecc0ed4591ea426a3e08db，Cloudflare deployment 4b059506-b5e7-4fa3-a3c8-188bde401ea5 SUCCESS。實際測試站六個公開書表連結原生啟動通過，兩ODT完成下載（failure=null），四PDF新視窗HTTP200；桌機／手機100及200%字級、房客獨立高度／open狀態、焦點、直接申請等高透明通過。HTTPS非CX全站回歸／33資產MIME／私有路徑404／零GA4通過；BX015仍404待人工確認。正常TLS線上HTML/CSS逐bytes等同本地。瀏覽器使用明確CA診斷模式，不作正式TLS／實機背書。`node --use-env-proxy scripts/forms-public-check.mjs` 可重現正常TLS匿名六下載、精確大小／簽章與ODT內部結構檢查，只保存JSON；不存原檔。收尾僅補測試工具與文字證據，網站runtime不變，交GPT審查。

## 11/17 第五輪審查及第六輪規劃

GPT 審查 `5ca8b42`（runtime `36afac1`），獨立 73/73、build --check、效能、Pages 33 檔、diff check 通過；正常 TLS 測試站 HTML/CSS HTTP 200 且與本地基準逐 bytes 相同。瀏覽器結果引用前輪 [報告](evidence/2026-11-17-forms/REPORT.md)，不冒稱獨立實機驗收。使用者核定書表下載區垂直緊湊化、格式按鈕淺綠底仿試算／申請、標題更名「出租房屋所得達租金標準」，及全站 RWD 複檢、缺陷修正（含 320px、200% 字級與斷點）。已更新 NEXT_TASK／State，僅文件交接，未更改 runtime／R2、未合併或正式部署；既有人工／業務待辦保留。


## 第六輪執行

843534d乾淨同步，書表padding緊湊化（1440高度414.5625→358.5625，減13.51%）、格式按鈕共用既有service-action色彩／fine-hover、精確卡名更正及局部換行上限已實作。73/73與完整建置檢查通過；212組路由／寬度／字級及斷點橫向量測無橫溢出／可見容器裁切；原版未發現其他全站溢出缺陷，沒有擴大改版。原導航／事件／房客獨立／六R2公開與原生連結驗證PASS。小幫手只以vendor mock驗證本站geometry，不替真實CX／實機背書。待推送／測試站確認，詳 [第六輪報告](evidence/2026-11-17-rwd6/REPORT.md)；原業務、BX015、實機及輔助科技待辦保留。


第六輪實作 b9b3e19e3f765b42d0691f8c7e27ce9c7197c751 已推送，Cloudflare部署 e633fc69-c45e-4321-bf75-5ef692178c99 與GitHub check成功。HTTPS再次212組RWD及六按鈕／觸控、非CX全站33資產／GA4隔離回歸PASS；影片play/seek/fullscreen/離頁暫停及phone/tablet defaults PASS。影片測試原先在click後立即斷言、目的section尚未完成切換時失敗，已補等待目的頁visible再保留全部原斷言，網站導航／影片JS未改。正常TLS線上HTML/CSS逐bytes同本地；瀏覽器外部CA診斷模式與mock小幫手不代替實機／真實CX驗收。收尾只補驗證工具與文件，runtime不變；截圖與原檔不入Git，交GPT／使用者審查。

## 2026-11-17 AGY 獨立唯讀審查及 Final QA 規劃

AGY 審查指定分支 `05f096d7d4ba3088bf025ddb2af07ecc70f9c091`，獨立通過 73/73、build/check/budget、正常 TLS 的 33 項測試站 runtime 比對，另用 Chromium 診斷發現短視窗關閉控制不可用、未定義背景 token、字級放大與 701px 大字級分欄可讀性、小幫手浮動遮擋等缺陷。GPT 核對來源和測試斷言，確認先前幾何檢查未確認真正可見／可點擊，無橫溢出也不足以捕捉逐字狹欄。使用者核定針對性收尾修正；在 NEXT_TASK 建立 QA-01～06 及具體 before/after、實際操作、分層驗收條件。第六輪 [Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/05f096d7d4ba3088bf025ddb2af07ecc70f9c091/docs/NEXT_TASK.md) 與既有報告保留。機關正式交付及外部連結人工查閱另列待辦：AGY 已確認舊機關站九 WebP 200，並非新 feature 已部署。此次僅更新 Task/State/Worklog，未修改 runtime、不聲稱新測試成功、不合併 main、不製作正式包或改雲端設定；使用者核定本輪開發範圍，不等於合併或正式部署授權。


## 2026-11-17 Final QA 實作

安全同步指定分支至40fcd91後，獨立archive重現短窗關閉hit-test=false、透明面板、200%標題不變及701px狹欄。QA-01～06局部修正完成；原角色圖縮至實際hit region，閉合launcher動態避開必要操作，無安全位置暫藏／捲動恢復。75/75、建置、Pages33、212組RWD與新增實際vendor觸控／鍵盤／旋轉、27組可讀性、48組等效viewport及16組原生zoom、書表／影片／GA4 mock／非CX回歸通過。新增等待目的頁visible排除測試競態，原斷言保留。正常TLS／CA診斷分層；無真實CX發問。詳 [Final QA報告](evidence/2026-11-17-final-qa/REPORT.md)。待推送與部署核對；截圖／原檔不入Git，不改main／雲端設定／業務規則，原實機與正式交付待辦保留。


Final QA 部署及收尾：runtime 80f0d4697f35ca3506a2a288d2fa1f255ef7b19a 已推送，Cloudflare 4fafc31a-1913-46ba-8c48-547ad66f1935／GitHub check SUCCESS。HTTPS重跑212組RWD、27組可讀性、真實vendor 29組／160次觸控、鍵盤循序關閉／焦點返回、書表／事件／影片與非CX33資產／零GA4全部PASS；正常TLS33檔bytes／MIME與build完全一致。影片初次Node連網未帶代理選項，補 --use-env-proxy 後通過；高於視窗的整張卡片改在可見交集區做hit-test與同點tap，保留原壓力場景。診斷瀏覽器畫面已檢視，截圖／原檔只在.preview。收尾僅測試強化／證據／文件，runtime不變，交GPT／使用者審查；原實機、CX、業務及正式交付限制保留。

## 2026-11-18 Claude 獨立唯讀複審與收斂規劃

Claude 以 `2f353736c6307db4a634d3a3af2219c9f14806db` 審查，未發現 P0/P1；本地重建、75/75、11 視窗×6路由×3字級、版面/鍵盤/導覽等通過。其環境封鎖真實 vendor／測試站，故小幫手行為為 mock，不代表實機。五項 P2：浮動 launcher 跳動與暫藏（報告百分比與數量不符，待量測）、隱藏側面板預載約 1.2 MB、行為測試未納入 npm test、獨立文字連結觸控尺寸、GitHub Pages 可能公開內部文件；另有 P3 維護項。GPT 核對程式、前輪證據及主站 GET，確認根目錄 PROJECT_STATE.md/README.md/package.json 回 200；未證實全部內部檔公開或有機密洩漏。

使用者決定暫不改 GitHub Pages，未來 Repo 私有化、Cloudflare 託管另案核定；維持現有公開站，禁止敏感資料提交。其餘授權交 Coding Agent 針對性收尾：CQA-01 必修隱藏角色面板不必要的圖片請求（包含非預載路徑），CQA-02 實測 launcher 穩定性，有安全局部改進才修，保留必要操作可達。CI、無障礙與其他 P3 延後。以 [前輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/2f353736c6307db4a634d3a3af2219c9f14806db/docs/NEXT_TASK.md) 保留完整歷史，現行規格見 NEXT_TASK。此次僅更新規劃文件，未開始開發、未改主線、未調整平台或正式部署；正式交付及原實機業務待辦保留。


## 2026-11-18 收斂實作及測試站驗收

遠端 `de600f5` 乾淨同步。CQA-01 移除隱藏側面板的初始 URL 與整批預載，狀態換圖和 resize 改走共用可見幾何判斷。以原版與修正版比較，六種隱藏情境各六個請求、1,498,656 bytes 降至零，涵蓋門檻、開關重開、熱門問題與狀態。CQA-02 30 組本機雙向捲動 8,702 個樣本完全一致，2,748 個隱藏、最大移動 756px。有限位移試驗減少移動次數，但至少 60px 的跳動由 64 次增至 286 次，保留原策略。必要操作實際觸控／Enter 與短窗正常開合、關閉焦點返回通過。

實作 `25c4122` 的 Cloudflare 自動建置 `29f3d1d9-e241-456a-b063-1a083c7b8737` 成功。75/75、建置與預算、正常 TLS 33 檔逐 bytes／MIME、測試站瀏覽器及零 GA4 通過。本輪以 Google 靜態 vendor 元件與合成狀態測試，沒有真實 CX 發問。待 GPT 審查，機關交付、URL、實機及業務待辦保留。[報告與量測](evidence/2026-11-18-claude-closeout/REPORT.md)
