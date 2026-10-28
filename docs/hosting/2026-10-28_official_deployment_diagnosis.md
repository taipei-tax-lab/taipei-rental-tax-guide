# 出租專區機關部署診斷 — 2026-10-28

本輪僅診斷。報告與去識別化證據可支持後續處理決策；**未修改正式網站、伺服器設定或任何 GCP 資源，未重新打包／部署**。

## 結論與決策

1. **已證實／高信心：機關站 CSP 阻擋 Messenger 通訊。** 桌機、手機的四個快速問題及手動問題皆有送出事件，卻在瀏覽器端被 `connect-src` 的 `default-src` fallback 攔截，沒有取得 Google HTTP 回應。這同時解釋「不能問答」與「快速問題看起來沒反應」。先由資訊室處理這一個共因，無須分別重寫四個按鈕。
2. **已證實／高信心：九個正式建置引用的 WebP URL 回傳 404。** 同名 PNG 可讀，既有交付 ZIP 也完整包含九個 WebP。它們造成首頁與人物圖顯示失敗；人物的 JS 狀態仍會改變。**尚不能證明是漏傳檔案，或伺服器 MIME／副檔名限制。** 應先查實體目錄及伺服器 404 子狀態，不直接改圖檔格式。
3. **已證實：CSP 另攔截 Google Fonts 樣式及手機 `data:` 圖片。** 圖片白名單和 WebP 404 是不同問題；手機的 1×1 GIF 是既有響應式佔位圖，不是遺失的大圖。
4. **目前沒有必須修改前端程式的證據。** 主要 HTML、三個 CSS、四個執行 JS 與可讀 PNG 均符合 main；導覽、方案切換及 Messenger 開關可操作。PNG 失敗回退可另列前端韌性改善，但不是本次優先修復。
5. **Production 設定存在且版本對應符合基準；Integration 綁定及網域授權仍待人工確認。** 使用者表示 10/28 已改 Production、已授權三網域，這不是本輪設定回讀。ADC 登入恢復後 Environment GET200、四個版本完全符合 10/13 baseline、包含 Rental v3；這不等於讀到私有 Messenger Integration。

## 範圍、時間與證據層級

- GitHub Pages：<https://taipei-tax-lab.github.io/taipei-rental-tax-guide/>
- 機關站：<https://services.arpa.tpctax.dof.gov.taipei/rentaltax/>
- 日期均為 **2026-10-28 Asia/Taipei（UTC+8）**；機器證據保留 UTC ISO 時戳。
- 約 19:07–19:30 執行同步、測試及診斷；主要 HTTP 清單完成於 19:17:54，主要瀏覽器互動 19:16:38–19:18:34，補充操作 19:20–19:21:52，ADC 後唯讀 GET 完成於約 19:23。
- Windows、Node 24.22.1、Python 3.12、Playwright + 本機 Microsoft Edge **156.0.4314.42**，headless，桌機 1440×1000、手機 390×844；補充導覽為 390×1000。TLS 驗證正常，未 bypass CSP，未偽造 Google 回覆，無壓力測試。
- 頁面採全新瀏覽器 context。每站每寬度四個快速問題及一個手動問題，依序等待回覆／錯誤；Pages 共 10 個真實問答，補充一題手動問答，共 **11 次 Pages POST**。機關站 10 次 UI 嘗試全部在 CSP 層受阻，未取得 Google 回應。無其他 authenticated detectIntent 呼叫。
- 「已證實」來自本輪公開 HTTP／真實瀏覽器／唯讀 API；「合理推論」列出替代原因；「待確認」不借用歷史 PASS。

證據入口：[evidence/2026-10-28/README.md](evidence/2026-10-28/README.md)。

## 兩 Repo 同步與正式文件

| Repo／原目錄 | 同步前 HEAD、原 origin/main | fetch + pull --ff-only 後 HEAD = origin/main |
|---|---|---|
| `taipei-rental-tax-guide`／`E:\出租房屋優惠專區Dialogflow CX` | `c7e45e59661b7309b5c69111d16da618ef1e8fa0` | `d5fad9e52acdb6c8f46495903f9f9dfbdb3c8c1e` |
| `dialogflow-cx-qa-framework`／`E:\CX_QA_Framwork\github` | `82229fb3a484585ffc6965efcc9a2dbd9b111791` | `0b70dff918eaae0fed34c3fe79cfd576168dcd89` |

兩者開始均為乾淨 main，remote 確認為指定 GitHub Repo。一般 sandbox fetch 曾出現 SChannel／FETCH_HEAD 權限限制；授權權限重試成功。未 reset、stash、強制切換或覆蓋修改。原 main 保持乾淨；交付在獨立 worktree `E:\CX_QA_Framwork\hosting-diagnosis-20261028`、分支 `diagnostics/official-rentaltax-hosting-20261028`。

已讀前端 README、PROJECT_STATE、Messenger fragment／JS、build、index、操作指南、相關測試及原部署 workflow；CX README、STATE、TASKS、current_production_baseline、現行架構、frontend_cx_integration_contract。PROJECT_STATE 部分歷史段落仍寫「未發布」或舊 release SHA；本輪以 Git ref、線上 bytes 及當日觀測為準。10/13 CX baseline 是當時快照，本輪只重驗明列的兩個資源 GET，未重跑其全部歷史驗收。

### Google Drive：BLOCKED，未宣稱同步完成

QA README 指定的專案 Drive 根目錄及 `runs` 以連接器成功列出，對應本機 `E:\CX_QA_Framwork\google_drive`，只放非 Git 產物。雲端根列出 `runs/references/approved_suites`，本機另有 `source`。既有文件是逐產物下載／上傳、checksum 回讀流程；在兩 Repo 的說明、工具及既有工作區中，未找到可確認的專案全量 status／dry-run／衝突基準程式，不能從資料夾名稱判定差異該往哪邊覆蓋。

已完成唯讀目錄盤點；**全量差異、衝突及本機／雲端內容相等尚未驗證**，無 Drive 檔案寫入、覆蓋、刪除或新建資料夾。前端獨立 Drive 對應亦未確認；資料夾名稱搜尋沒有建立可靠對應。依本次任務允許的障礙處理條款，記錄後繼續診斷。未將 Git Repo、NEXUS 或其他資料當鏡像。既有部署 ZIP 從 GitHub Actions 取得，不來自 Drive；本次指定的去識別化診斷歸檔前端 Git，未產生新的 QA raw corpus／執行包需要上傳 Drive。

## 建置與部署完整性

| 檢查 | 當日結果 |
|---|---|
| 原 build、build --check | **PASS**，產生的 index 無 Git 差異 |
| 前端 Node 單元測試 | **PASS 45/45** |
| 原靜態效能預算 | **PASS** |
| CX runtime_finalization 離線測試 | **PASS 5/5** |
| CX 全套 pytest／Windows 預設編碼 | **FAIL：148 passed、38 failed、30 errors** |
| CX 全套 pytest／UTF-8 重跑 | **FAIL：192 passed、24 failed**；15 個依賴歷史 D 槽產物，9 個 reviewed/frozen bytes hash guards 不符 |
| 既有 ZIP CRC、根階層、逐檔內容 | **PASS 30/30** |

全套 CX 失敗未修復，不能聲稱 QA 全過。UTF-8 重跑只更換執行編碼；未改測試、fixture 或歷史 hash。這些離線依賴／凍結產物檢查與機關 CSP 故障沒有因果證據。完整 traceback 留在 Git 外，Git 僅含去識別化失敗測試名與統計。

### 原交付 ZIP

唯讀下載既有 [Actions run 39565683012](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/39565683012)，未觸發 workflow。workflow HEAD `72f6f18fe2b7f584c03052f030d8090fa8b2083f` 固定打包 main `d5fad9e52acdb6c8f46495903f9f9dfbdb3c8c1e`。

- 原檔 `taipei-rental-tax-guide-deploy.zip`：6,822,027 bytes，30 files。
- SHA-256：`baa620efeeeaff3626f8fa305fbed06785a4ef85e94b1d92fda7f38d6200e2d4`。
- ZIP CRC 正常，根目錄直接有 index.html、assets；沒有多包一層資料夾。
- 30 檔全部符合現行 main；文字先正規化 CRLF/LF 再比，二進位原 bytes 比。每檔 ZIP 原 SHA 在比較證據內。
- ZIP 未包含 repo、node_modules、credential、測試、文件或多餘舊 JS。`.nojekyll` 為 Pages 標記，機關服務不需要。
- 原交付原本不含 `favicon.svg`、assistant manifest JSON、舊 `site-enhancements.js`，且現行頁面不引用它們。這三個 404 **不是本次部署漏檔證據**；現行 favicon 是可正常取得的 `assets/images/tpctax-mark.png`。

本輪 manifest 列 33 個本機候選檔，其中 29 個被 HTML/CSS/JS／動態狀態引用；另記是否在原 30 檔 ZIP。線上記錄共 87 個去重 URL（兩站各 45 個，三個外部 Google 資源共用），含帶版本 query 及無 query 的對照。候選非引用檔也測，但不混入執行時故障數。

## HTTP 與路徑對照

| 資源 | Pages | 機關站 | 判讀 |
|---|---|---|---|
| HTML、3 CSS、4 執行 JS | 200、正確類型 | 200、正確類型，文字與 main 相符 | **PASS**，未發現 JS/CSS 被改成 HTML |
| LOGO、現行 favicon、人物 PNG、浮鈕 PNG | 200 | 200，binary SHA 相符 | **PASS** |
| 9 個引用 WebP | 全部 200 | 全部 404 | **FAIL** |
| 官方 Messenger JS／theme CSS | 200 | 瀏覽器 200 | **PASS**，並非 Messenger loader 缺失 |
| Google Fonts 樣式 | 頁面未出現 CSP 阻擋 | `fonts.googleapis.com` 被 CSP 阻擋 | **FAIL** |
| 手機 1×1 `data:image/gif` 佔位圖 | width=1、可讀 | width=0；Console 明列 CSP 阻擋 | **FAIL**，不要誤認要補傳 GIF 檔 |

九個已證實 404 的 URL 均為下列機關站 base 加相對路徑：

`https://services.arpa.tpctax.dof.gov.taipei/rentaltax/`

| 相對路徑 | HTTP | 原 ZIP |
|---|---|---|
| `hero-v2.webp` | 404 | 有 |
| `assets/images/income-standard-card.webp` | 404 | 有 |
| `assets/images/income-standard-illustration.webp` | 404 | 有 |
| `assets/images/assistant/assistant-idle.webp` | 404 | 有 |
| `assets/images/assistant/assistant-welcome.webp` | 404 | 有 |
| `assets/images/assistant/assistant-thinking.webp` | 404 | 有 |
| `assets/images/assistant/assistant-responding.webp` | 404 | 有 |
| `assets/images/assistant/assistant-guiding.webp` | 404 | 有 |
| `assets/images/assistant/assistant-error.webp` | 404 | 有 |

各筆 URL、大小、decoded SHA、Content-Type、redirect chain、快取／安全 header 見 [http-resources.json](evidence/2026-10-28/http-resources.json)。九個失敗不涉及 redirect；主要成功資源在 `/rentaltax/` 下正常解析，相對路徑無漏掉子路徑。未發現大小寫差異或整包多一層的證據。`og:image` 仍是 GitHub Pages 的完整絕對 URL，是分享預覽設定，不是目前畫面破圖根因。伺服器實體部署清單未取得。

## 真實瀏覽器互動結果

下表除明列者外，桌機／手機都測；四個問題名稱依序為租金補貼、出租房屋租稅優惠、申請流程、房客權益。

| 行為 | Pages | 機關站 |
|---|---|---|
| 初始載入及 JS 互動初始化 | **PASS** | **PASS**，但有圖片／CSP 子項故障 |
| LOGO、浮動按鈕圖片 | **PASS** | **PASS** |
| 首頁 WebP／人物 WebP | **PASS** | **FAIL**，404、naturalWidth=0 |
| 四方案切換、返回、三稅目內容 | **PASS** | **PASS** |
| 比較頁、官方窗口、屋主／房客切換、快速判斷結果 | **PASS** | **PASS** |
| Messenger 開／關／再開 | **PASS** | **PASS** |
| 四個預設按鈕，每個寬度逐一點擊 | **PASS：4/4** | **FAIL：4/4**，每個均呼叫原 sendQuery，再被 CSP 攔截 |
| 手動輸入送出 | **PASS** | **FAIL**，同 CSP 共因 |
| idle/welcome/guiding/thinking 狀態事件 | **PASS** | **PASS 邏輯切換／FAIL 人物顯示** |
| responding 自然狀態及回覆 | **PASS** | **NOT TESTED**，通訊已被阻擋而未進入此路徑 |
| error 自然狀態 | **NOT TESTED**，正常問答未製造錯誤 | **PASS 進入錯誤狀態／FAIL 人物圖顯示** |
| session expired 自然事件／到期後重問 | **NOT TESTED** | **NOT TESTED**，未等待到期或合成事件 |
| 橫向溢出／再開造成 extras 重複 | **PASS**，無溢出、extras=1 | **PASS**，無溢出、extras=1 |

主腳本以錯誤的 `[data-page="resources"]` selector 記錄了 nav-resources=false；官方窗口實際是首頁的 `#resources` section，補充腳本已用正確目標操作、四組全 PASS，不能據此誤報導覽故障。主腳本的 initial.ready 檢查 body 而非 `.v2-site`，亦不作初始化失敗證據；以上以實際操作結果為準。

Pages 第一個快速問題的截圖可見完整回覆與官方連結；補充手動問題取得 HTTP200、`application/json; charset=utf-8`、非空文字回覆及實際畫面。測試只證明可傳送、接收及呈現，不是稅務內容法律正確性驗收。主 response.json listener 未成功擷取 body，已標為 `NOT_CAPTURED_BY_PRIMARY_LISTENER`；不得解讀為 Google 回傳無效 JSON，補充 response event 證據已補足。

人物狀態 observer 是先記 `data-state`，圖源在 90ms 後才換；同筆 observer 裡的舊 src 不代表狀態用錯圖。圖片成功與否另依 URL 取得、naturalWidth 和截圖判斷。手機 <900px 人物側欄本來就隱藏，不能把隱藏當成顯示故障；手機保留狀態及資源檢查。

## CX 傳輸逐層追蹤

| 層級 | Pages | 機關站 |
|---|---|---|
| `df-messenger-loaded` | 有 | 有 |
| 快速問題 → `sendQuery()` | 原函式委派 wrapper 記錄 4 次／context | 同樣記錄 4 次／context |
| `df-user-input-entered` | 手動輸入有 | 手動輸入有 |
| `df-request-sent` | 每題有 | 每題有；**不等於封包已離開瀏覽器** |
| Network Google webhook POST | 每題 HTTP200 | 沒有可取得的 HTTP status；Console CSP 拒絕連線 |
| `df-response-received` | 每題有 | 無 |
| `df-messenger-error` | 未自然發生 | 每題有，`Failed to fetch` |
| 接收後 UI 呈現 | 文字及截圖確認 | 前置傳輸失敗，無法測接收後呈現 |

實際目標（session 已移除）：

```text
https://dialogflow.cloud.google.com/v1/cx/locations/asia-northeast1/integrations/messenger/webhook/projects/serviceagent-1150909/agents/799426c1-ba69-49dc-85e4-5065985706e2/sessions/[REDACTED]
```

機關 Console 明列 `connect-src` 未指定，沿用 `default-src`，此 URL 違反政策；並有 `Fetch API cannot load ... Refused to connect because it violates the document's Content Security Policy`。因此沒有 Google 403／CORS 回應可供判斷，更不能把這次錯誤歸咎於 Domain allowlist 或 Production。

Pages 的實際首題 request 有 Rental `currentPlaybook`；後四題移除。`timeZone=Asia/Taipei`、八個 runtime 欄位（日期、入口、v1、current/may/explicit context）存在，明確日期空值為 null；符合兩 Repo contract。兩站嵌入 project／location／agent／初始 Playbook 與執行 JS 一致。官方 HTML 沒有 environment attribute，不能從這點斷言是 Draft；Environment 是 Integration 端設定。[Google 官方設置文件](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger)也將 Environment 及 domain restriction 放在 Integration 配置流程。

ADC 首次 RefreshError；經使用者明確同意並自行完成官方登入後，唯讀確認 Production 四個完整版本對應等於 10/13 baseline，Rental resource 存在。未讀到私有 Integration 的現行 Environment／三網域 allowlist；**待 CX 管理者在 Console 唯讀核對並提供去識別化紀錄**。不為了判定 binding 而修改 Draft、插入 marker 或更動版本。

## 伺服器安全 header 與最小調整建議

機關 HTML 的主要觀測如下，完整公開 header 在 HTTP evidence：

```text
Cache-Control: max-age=604800
Content-Type: text/html
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Access-Control-Allow-Origin: https://www.services.tpctax.gov.taipei
Content-Security-Policy:
  frame-ancestors 'self' www-mgr.gov.taipei tpctax.gov.taipei;
  default-src 'self' 'unsafe-inline' services.arpa.tpctax.dof.gov.taipei
  www.google.com www.gstatic.com www.youtube.com
  jitsi.arpa.tpctax.dof.gov.taipei meet.jit.si https://id.taipei
  https://schema.gov.tw/ https://generativelanguage.googleapis.com/
  https://www.google-analytics.com https://oauth2.googleapis.com
  https://www.googletagmanager.com
```

未明定 `script-src/style-src/img-src/connect-src/frame-src/font-src`，故受 default-src fallback。`frame-ancestors` 控制誰可以嵌入本站，不是 Messenger fetch 通訊許可。本站 ACAO 不匹配本站 origin 的表面現象，也不能解釋本站向 Google 發送 fetch；跨域回應必須由目標服務授權。Pages 補充回覆的 Google ACAO 為 `https://taipei-tax-lab.github.io`；機關 origin 的 Google CORS 因前置 CSP 阻擋尚未驗證。

資訊室可在 **`/rentaltax/` 有效設定範圍**，評估修改現有有效 policy：

| directive | 最小目標 | 證據與限制 |
|---|---|---|
| `connect-src` | 新增 `https://dialogflow.cloud.google.com`；保留本站已需要的既有來源 | **已證實必要**，真正目標不是 regional authenticated API host |
| `style-src`（若有 style-src-elem 亦核對） | 保留目前 inline／self／gstatic 需求，新增 `https://fonts.googleapis.com` | **已證實被擋**：Material Icons、Google Sans CSS |
| `img-src` | 保留 self，允許本頁已使用的 `data:` | **已證實必要**：手機既有 GIF 佔位圖；不要在其他 directive 加 data: |
| `font-src` | 若放行 CSS 後仍被擋，按實際字型 URL 評估 `https://fonts.gstatic.com` | **條件需求、待複測**，本輪未更改 policy 取得第二階段實際字型請求 |
| `script-src`／`frame-src` | 不因本次故障額外擴張 | 官方 Messenger JS 已可執行，未觀測必要外框被擋 |

此表是精準修正需求，不是可直接覆蓋整站的完整 header。新增 directive 時，先盤點其目前繼承而確實使用的來源；不可誤將新 directive 當「只加一個來源」而移除其他有效需求。若有多層 CSP header／meta policy，需修正真正限制來源的那份；另加一份寬鬆 CSP 無法抵銷既有嚴格 policy。保留 HSTS、nosniff、frame-ancestors 等防護，不建議 `*`、停用 CSP／CORS 或開全域 proxy 例外。[connect-src 規則說明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src)。

HTTP 404 沒有公開提供子狀態。若機關服務為 IIS，應查 W3C `sc-status/sc-substatus/sc-win32-status`：`404.3` 可能代表 MIME mapping，`404.0` 則先查檔案位置等。[Microsoft 官方說明](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/site-behavior-performance/troubleshoot-404-file-not-found-error)。不能只憑 WebP 全失敗就宣稱已證實 IIS MIME 問題。若檔案存在且確為 mapping，僅對必要範圍設定 `.webp → image/webp`；無需為目前未引用的 SVG／JSON 擴張規則。

HTML 快取七天是已觀測設定，**目前沒有新舊混用證據**：fresh context 的主要 HTML/JS/CSS 與 main 相符。修正後以全新 context／停用快取／重新驗證檢查；資訊室可評估 HTML revalidation，保留有版本 query 資產的合理快取，不清整站或改所有 cache 規則。

## 根因分類、責任與重現

| ID／分類 | 現象、重現與直接證據 | Pages 對照／原因與信心 | 建議負責方、處理與複測 |
|---|---|---|---|
| H1／C，D 為表面結果 | 開小幫手，點任一四問題或手動送出；request-sent 後 error，Console CSP 拒絕 dialogflow.cloud.google.com，無 Google HTTP response | Pages 全正常；**已證實高信心**為 CSP 通訊限制，按鈕不是沒綁定 | **資訊室**修 /rentaltax/ connect policy；四問題＋手動均須 HTTP200、非空答案、response event、畫面呈現 |
| H2／A 或 B，細分 G | 開桌機／小幫手，首頁與人物破圖；九個 WebP GET404、對應 PNG200、原 ZIP 有檔 | Pages WebP200。**已證實 URL 無法取得；中信心**為副檔名/MIME限制或漏傳，二者尚未區分 | **資訊室**查實體目錄＋log 子狀態；缺檔只補原檔、若 mapping 只改必要映射；九檔200/image-webp/大小hash匹配、人物實際顯示 |
| H3／C | Console 阻擋兩種 fonts.googleapis.com stylesheet；手機 data GIF 被 img-src fallback 擋 | Pages 無相同 CSP 阻擋；**已證實高信心** | **資訊室**按表限縮調整 style/img，font 依複測；Console 不再出現相應 violation、手機佔位不破圖 |
| H4／E，G | 使用者 10/28 自述已切 Production／授權三網域；本輪 Environment/Rental GET200、版本基準相符，私有 Integration 未取得 | Pages 正常不能證明機關 origin 已授權；**待確認**，非本輪已證故障根因 | **CX 管理者**Console 唯讀核對；先解除 H1，再視實際403/CORS/錯環境證據另案處理，不先改 CX |
| H5／F（韌性候選） | `picture` 選中 WebP 後 HTTP404，img PNG 雖存在仍破圖；JS 源碼無下載失敗切換 source 的 handler | 正常 Pages 無故障；**已證實現況，中信心為可改善韌性**，不是必須修前端的主根因 | **前端 Codex**僅於另案授權後評估 image error fallback；本輪不實作，先讓原 WebP 正常服務 |
| H6／G，診斷環境限制 | Drive 未有可確認的全量 safe-sync；CX 全套離線24失敗 | 與網頁根因無已證因果 | **專案維護者**另核定同步程序／歷史測試產物基準；不以重建歷史fixture或修GCP替代取證 |

`setAssistantState()` 會把 `data-state` 更新，90ms 後才換 WebP/source 與 PNG/img。官方實際可走 idle/welcome/guiding/thinking/error；responding 因 H1 走不到。這不是「人物動畫程式完全不執行」。圖片是六個姿態靜態素材的切換，不是已確認遺失 GIF 動畫。相關位置：`assets/js/messenger-ui.js` 的 `ASSISTANT_STATES`、`preloadAssistantStates`、`setAssistantState`、`bindAssistantEvents`、`bindTopics`。

## 建議處理順序與驗收界線

1. **P0 資訊室：CSP connect-src**。一次解除問答／四快捷共因。若仍有錯再依新的 status 區分 Integration 或 CORS，不同時改多層以免失去歸因。
2. **P0 資訊室：九個 WebP 的實體檔案及 404 子狀態**。原 ZIP 可作正確內容基準；依實際漏檔／mapping 判斷處理，不重新生成網站。
3. **P1 資訊室：Google Fonts style 與手機 data image 政策**，必要時再允許明確 font origin；新鮮瀏覽器完整重測人物、導覽、手機。
4. **P1 CX 管理者：唯讀核對 Integration 現行設定**；本輪無變更授權，不將之混入資訊室伺服器修正。
5. **P2 專案維護：Drive 同步程序、QA 歷史路徑／凍結 hash、可選圖片 fallback**，另案處理。

修後應依 [資訊室清單](2026-10-28_it_remediation_checklist.md)完成驗收並附時間／實際 header／九檔結果／每題事件與畫面。機關內網、其他瀏覽器／實體手機、session 自然到期、修後實測、伺服器檔案清單與日誌目前均 **BLOCKED 或 NOT TESTED**。本輪完成的是診斷取證與 Git 交付，不是修復驗收；Drive 全量同步也仍是明列障礙。
