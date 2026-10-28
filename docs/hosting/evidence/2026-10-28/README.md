# 診斷證據索引

全部為 2026-10-28 當日結果；UTC 時間換算臺北需 +8 小時。此目錄只收去識別化證據，沒有 OAuth、ADC、Cookie、token、session、完整 HAR、私有 Integration 配置或完整 Google 回應。上一層 `.gitattributes` 限定本日期證據不作文字行尾轉換，讓 Git blob、重新 checkout 與 evidence-sha256.json 的原 bytes 一致。

| 檔案 | 用途／限制 |
|---|---|
| `sync-status.json` | 兩 Repo SHA、同步方式、Drive BLOCKED 範圍、ADC 恢復摘要 |
| `deployment-manifest.json` | 33 個候選檔之相對路徑、大小、原 bytes SHA、類型、引用及原 ZIP 包含狀態；29 個引用檔 |
| `original-zip-comparison.json` | 既有 Actions 交付 ZIP hash、CRC、30 檔內容／階層對照；未重打包 |
| `http-resources.json` | 87 個公開 URL 的 GET status、Content-Type、redirect、decoded bytes/hash、白名單 response headers；沒有 body/cookie |
| `resource-summary.json` | 真正引用的九個 WebP404與非引用候選404分開 |
| `browser-results.json` | 桌機／手機、兩站各四快捷＋手動一題，事件、委派 sendQuery、狀態、Console、去 session 的 network；capture_notes 列已知取證限制 |
| `browser-supplement.json` | 正確 #resources／audience／guide 操作、launcher image、Google 回覆 content-type/CORS及一題非空文字摘錄 |
| `cx-readonly-summary.json` | 使用者完成 ADC 登入後，兩個資源 GET200、Production 四版本與基準 exact；不含私有設定 |
| `build.log`、`unit-tests.log`、`performance.log` | 正式前端 build、--check、45/45及既有效能門檻 |
| `cx-offline-tests-summary.json` | targeted 5 PASS；全套原編碼及 UTF8結果與失敗測試名；完整 traceback留 Git 外 |
| `*-initial.png`、`*-query.png` | 兩站、1440／390px，初載與首快捷實際畫面 |
| `pages-manual-answer.png` | 補充手動問題之真實答案畫面；不構成法律正確性驗收 |
| `http-audit.py`、`browser-audit.cjs`、`browser-supplement.cjs` | 可審查重現工具；僅診斷，瀏覽器工具會依序發送少量公開問題，重跑前注意當日 scope |
| `evidence-sha256.json` | 交付證據檔案大小與 SHA；不含自身，避免自我雜湊循環 |

HTTP manifest 同時測原建置檔及 HTML 帶 cache query 的版本；三個 Google 外部 JS/CSS 跨站去重。PNG 是可用 fallback 檔，但現行 WebP 選取失敗不會在本輪 Edge 自動回退，不能把 PNG200 當成畫面已通過。

主要瀏覽器捕捉曾無法由 response.json() 取得 body，並不表示服務回傳無效 JSON。補充以 `df-response-received` 的實際文字及截圖驗證。主腳本 `nav-resources` 的 data-page selector 不適用該 section；正確補測目標為 `#resources`，四組均 PASS。`initial.ready` 是 body 類別檢查，不是完整網站初始化判準；狀態 observer 的 src 可能早於90ms圖源切換。

圖片內容均為公開網站及本輪人工指定的無個資問題，無其他使用者對話。Google 稅務回答僅留有限文字摘錄供傳輸／呈現判斷，沒有完整 payload 或診斷 session ID。Drive 只保留 scope/status摘要，未收錄雲端其他案件資料夾名稱。

重現（需 requests／Playwright／Edge，NODE_PATH 由本機 runtime 提供）：

```powershell
python docs/hosting/evidence/2026-10-28/http-audit.py
node docs/hosting/evidence/2026-10-28/browser-audit.cjs
node docs/hosting/evidence/2026-10-28/browser-supplement.cjs
```

重跑會產生新的時間與結果，應另日歸檔，不覆蓋已交付證據。CSP／檔案修復後應另做驗收，不把這份診斷當修後 PASS。
