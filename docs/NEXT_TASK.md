# NEXT_TASK — 2026-11-17 房客卡片獨立展收與直接申請書表下載

狀態：**PLANNED / R2_OBJECTS_VERIFIED / PUBLIC_DOWNLOAD_PENDING**（2026-11-17，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
開工基準：`36b223204f43a5ce1d522e2b07ddfdb27009750d`。前輪 70/70 單元、建置／效能及測試站技術驗證完成；[前輪 Task（固定 SHA）](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/36b223204f43a5ce1d522e2b07ddfdb27009750d/docs/NEXT_TASK.md)、[證據](evidence/2026-11-16-handshake/REPORT.md) 保留。GPT 獨立重跑 70/70、build --check、budget、Pages build（33 檔）成功；獨立 Chromium 重跑因執行環境 socket 權限未能完成。本輪係使用者實際查看後的新需求，不推定全部人工驗收完成。

## 1. 房客卡片獨立展開與收合

- [ ] 已確認原因：`assets/css/guide-v2.css` 前段 `.v2-tenant-grid` 設定 align-items:start，但後段 `.v2-tenant-grid, .v2-application-list` 共用 align-items:stretch 覆蓋它。僅修房客 grid 的對齊規則，使同列三張卡片各自依內容展收；直接申請三卡仍維持等高、三欄／手機單欄。
- [ ] 保留原生 details/summary，允許同時開展任意多張，點擊自己才變更自己的 open 狀態。另一張卡片展開或收合時，其餘卡片高度和內容區不得被拉長／壓縮；桌機頂端對齊，手機正常文流下方卡片可隨內容位移。維持現有外框／文字／圖示／連結／鍵盤操作；不可用固定高度造成放大字級裁切，也不導入新 JS 或套件。
- [ ] 增加瀏覽器斷言：量測初始各卡 bounding box，依序展開 A、B、收合 A、展開 C、收合其餘，核對非操作卡高度與 open 狀態保持、無不必要空白拉伸、原連結可用；桌機 1440px、手機 390/320px、100/200% 字級，無水平溢出；直接申請仍三卡等高（桌面）。

## 2. 書表下載與填寫範例

使用者核定：在 `#direct-apply` 的現行三張申請管道卡片（線上申請、親自申請、郵寄/傳真）之下，新增獨立、精簡的書表區塊，參考台北服務通的雙組書表列表，而非新增第四卡或改成複雜流程。用途是方便民眾親自申請、郵寄及傳真前下載／填寫。

- [ ] 區塊分兩組「書表下載」「填寫範例」，每組二列，順序一致：房屋使用情形變更申報書；臺北市個人租賃住宅委託包租代管減徵地價稅及房屋稅申請書（含終止或委託）。範例列加「－範例」或由分組明確標示，避免誤選；每份申請書有 ODT、PDF 兩個操作，範例只提供 PDF。總計六個連結。
- [ ] 桌面採左側組別標題及右側書名＋緊鄰格式按鈕的行列表（可適應長書名換行）；手機窄幅自然堆疊，格式按鈕不被裁切／擠到螢幕外，不需水平捲動。使用本站原有深綠配色、白／淺色容器、細分隔、適當留白與 44px 操作區；不照抄他站外觀，不另製大型卡片。保留目前直接申請頁透明外層及三卡白底、順序、原申辦說明、網址、GA4 service entry 映射。
- [ ] 真實語意分組及標題；每個按鈕具書名＋格式的可及名稱、清楚焦點、鍵盤可操作；避免在原本整卡 anchor 內嵌另一 anchor。可使用直接 HTTPS anchor（PDF 可另開以閱讀／儲存；ODT 可由瀏覽器下載），標明另開視窗（若適用）及格式。跨網域 download 屬性不保證強制下載；不要以 JS 跨域抓 blob 或新增 CORS／Worker 來規避。不自動修改 R2 metadata；實測瀏覽器行為並準確回報。填寫範例不得含真實個資，使用者提供的是正式公開書表，內容及適用性仍須業務確認，不自行修改原檔或額外推測適用條件。

### 2.1 已核對的 R2 檔案（資料來源及預定連結）

使用者手動建立獨立 bucket `forms`，六物件皆位於 bucket 根目錄（不是影片 bucket 的 forms/ 前綴）。Cloudflare API 已唯讀列出及取得全部六個物件，大小相符，PDF 四份有 %PDF 簽章、ODT 二份有 ZIP 簽章；尚非完整格式或業務內容驗收。管理網域為 `https://pub-76044a38a6644fc4b5c9d71e06f58b81.r2.dev/`，**目前 managed public access enabled=false，且無 custom domains。以下為啟用後預定的連結，不是已公開可下載證據。** 不得自行啟用公開存取、更新 metadata 或上傳／刪除物件；須由使用者另行核准或手動啟用，並確認書表皆可公開。先前從執行環境直接請求逾時，不據此推論物件不存在。

| 分組 | 書表 | R2 object key（相對上述網域根目錄） | bytes | R2 contentType |
| --- | --- | --- | ---: | --- |
| 書表下載 | 房屋使用情形變更申報書 | house-use-change.odt | 37559 | application/octet-stream |
| 書表下載 | 房屋使用情形變更申報書 | house-use-change.pdf | 157541 | application/pdf |
| 書表下載 | 個人租賃住宅委託包租代管減徵地價稅及房屋稅申請書（含終止或委託） | rental-tax-reduction.odt | 45917 | application/octet-stream |
| 書表下載 | 同上 | rental-tax-reduction.pdf | 234755 | application/pdf |
| 填寫範例 | 房屋使用情形變更申報書 | house-use-change-example.pdf | 171460 | application/pdf |
| 填寫範例 | 個人租賃住宅委託包租代管申請書 | rental-tax-reduction-example.pdf | 189913 | application/pdf |

- [ ] 開工重新核對公開 HTTPS 六 URL（正常 TLS、無登入、HTTP 200、實際 bytes／PDF 簽章或 ODT ZIP 中 mimetype／內容，不能是 HTML 錯誤頁）。如尚未啟用或連線受限，列明 BLOCKED，不把 API 私有讀取當成公共下載 PASS；在公開下載可用以前不得推送含失效下載入口的 runtime（該分支 Push 會自動發布測試站）。可先完成可安全執行的本地實作及靜態驗證，等公開存取確認後再正常收尾。不得以測試環境禁用 TLS 的結果替代正式 TLS 檢查。

## 3. 來源與交付策略

- [ ] 書表名稱／兩組六連結的單一正式設定來源（建議擴充 `site/media.json` 新增 applicationForms，沿用 operationGuide 不變；如選獨立設定檔則同步說明 AGENTS/README 且不得重複配置）。使用 build 產生 `index.html`，不手改生成結果。建置驗證兩組、兩份表及格式數量、非空書名、明確 HTTPS 或安全的 `./assets/forms/<filename>` 相對路徑（禁止 traversal、外部非 HTTPS、javascript/data）；測試 URL 採上述 root object 路徑，勿誤用原影片 bucket 或多加 forms/。
- [ ] 如同影片，測試站只連 R2，不將六份 binary／MP4／截圖提交 GitHub，不在 Pages 測試產物放入文件，既有白名單及 GA4 隔離仍維持。README 記錄單一設定來源、測試與正式路徑切換方式；正式交付另案：在 staging 副本中把書表 URL 改成 `./assets/forms/<filename>`，將 6 份原始書表檔及影片放進機關靜態包、重新 build，驗證相對 URL／MIME（ODT 正式建議 application/vnd.oasis.opendocument.text）、資料完整及機關 CSP。不要把本輪測試站的 R2 連結切成不存在的相對檔案、實際製作正式交付包、修改正式站或上傳新物件；僅證明配置相對路徑可生成。

## 4. 驗收與交接 Checklist

- [ ] 開工依 AGENTS／Workflow 安全同步指定分支、不另開分支／覆寫；確認最近的圖示／背景／三卡核定成果。只改必要 CSS、書表設定、模板/build、生成 HTML、受影響測試與文件；不更動政策、資格、既有服務連結或事件、CX/Messenger、影片 URL、背景／圖示、部署設定。純 Repo 工作不掃描 Drive。
- [ ] 加入生成產物及設定的正／負測試（兩組標題、四個表格格式鍵＋二個範例、六個唯一 href、精確書名／路徑、相對路徑可建置且非法路徑失敗）；保留現行 70 個回歸驗證，原三個服務 anchor 計數／原連結與六項事件的斷言不應被新書表混入。
- [ ] `npm run build`、`node scripts/build.mjs --check`、`npm test`、`node scripts/performance-budget.mjs`、`node scripts/build-pages-test.mjs`、`git diff --check`；針對房客展收及書表區做桌機／手機與 200% 字級真實瀏覽器測試，確認六連結及實際下載／PDF 開啟可用、無水平溢出、鍵盤順序、原三卡等高與外層透明、切換其他入口未回歸。保留現有測試站非 CX／GA4 隔離，不提交截圖（只留 .preview/）。
- [ ] 公開下載及實作驗證完成後，在指定分支 commit/push、確認遠端 SHA、Cloudflare 自動建置及實際測試站六 URL 與版面；更新 Task/State/Worklog 及必要文字/JSON 量測證據。驗證受限如實區分，不能將私有 API 讀取得到物件等同公開下載。原 BX015、實機／輔助科技、業務／正式站驗收待辦保留；不 merge main，不正式部署。
