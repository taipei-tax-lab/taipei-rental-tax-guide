# NEXT_TASK — 2026-11-18 上線前收斂修正（Claude 複審）

狀態：**PLANNED_APPROVED_PENDING_IMPLEMENTATION**（2026-11-18，Asia/Taipei）。
指定工作分支：`feat/direct-apply-operation-guide-20261031`。
審查基準：`2f353736c6307db4a634d3a3af2219c9f14806db`（runtime `80f0d4697f35ca3506a2a288d2fa1f255ef7b19a`）。
前輪完整任務見 [固定 SHA](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/2f353736c6307db4a634d3a3af2219c9f14806db/docs/NEXT_TASK.md)；已有 [Final QA 報告](evidence/2026-11-17-final-qa/REPORT.md)。

## 1. 目標與已核定界線

AGY、Codex、GPT 及 Claude 交叉審查後，現行版本未發現 P0/P1 上線阻擋問題。使用者授權沿用功能分支做小幅收尾，不重新設計網站。Claude 以同 SHA 本地 Chromium 獨立重建、75/75 單元與 RWD/字級/鍵盤等測試通過；其 vendor 為 mock，線上站及真實 CX/實機未驗證。GPT 核對程式與前輪證據，確認下述載入問題；浮動策略則是前輪已揭露的避擋取捨。Claude 隱藏比例與分母不符（21/48、11/30），不可直接採用其百分比。

使用者明確決定本輪**不改 GitHub Pages 設定**；日後計畫將 Repo 私有化並將網站託管交 Cloudflare，屆時另行核定切換與驗收。目前維持現有 main／機關站／Cloudflare 測試站及發布界線。不能據此自行變更 Repo visibility、Pages、Cloudflare、DNS 或其他平台設定；也不以網站公開範圍取代 Repo 存取權限管理。現有 GitHub Pages 文件公開風險暫接受，敏感資料仍禁止提交。

## 2. 本輪實作與驗收

- [ ] **CQA-01：僅在角色側面板實際可顯示時請求其圖片（Claude P2-2，必修）。** `assets/js/messenger-ui.js` 的 `preloadAssistantStates` 於 chat open 無條件載入圖片；`setAssistantState`、`resetAssistantState` 及初始面板模板亦可觸發隱藏面板的圖片請求。沿用 `canShowAssistantPanel` 及實際 geometry/visibility 這個單一判斷，避免另造相互矛盾的 viewport 條件。隱藏時只維護必要狀態，不設定會請求角色大圖的 src/srcset（包含初始 idle、預載、狀態切換／reset 的延遲 callback）；顯示時依當前狀態正常載入且不重複預載。不得影響浮動 launcher 自身圖像、聊天開關、熱門問題、焦點、文字／狀態、GA4 或 CX；開啟中跨越面板顯示斷點／旋轉後須恢復正確圖像與狀態，不留舊狀態、破圖、競態或重複請求。可採等效的最小實作，不重構整個 Messenger。
  - 先記錄原版與修正版在乾淨瀏覽器 context 的實際 request URL、狀態、傳輸大小（可得時）與原因。使用 320×640、390×844（含大字級）、844×390 橫向、面板門檻前後及 1440×900 桌機；包含初載、開關／重開、模擬狀態轉換、窄→寬→窄／開啟中 resize。面板不可見時不得發出側面板專屬 idle/welcome/thinking/responding/guiding/error 大圖的任何新請求（不含小幫手入口本身資產）；已有快取不能當作未請求證據。寬屏首次顯示時圖片確實成功載入、熱門問題及角色狀態正常。以相同環境比較基準，不僅加字串測試，不送真實 CX 問題。
- [ ] **CQA-02：重核手機 launcher 穩定性（Claude P2-1，證據導向修正）。** 前輪 QA-05 的避讓與無安全位置暫藏不得退化。先用真實 vendor shell（攔截 CX 發問；若外部封鎖則明示 mock 限制），在首頁及非首頁必要操作密集區，以連續捲動／正反向、字級 100/150/200% 及 320/390/414、橫向、桌機量測每個樣本位置的 launcher rect、可見狀態、確切分子分母、最大位移／跳動及恢復。判斷是否有實際大幅跳動、長時間消失、焦點丟失或操作入口不可達；不得以 Claude 矛盾百分比擅自判定。
  - 若重現有實際 UX 問題且能局部降低跳動／提高穩定性，採最小安全修正（如保留安全位置的有限位移／穩定位置及必要留白）；優先維持可直接按到所有申請、試算、書表、導航等既有操作，仍保留無安全位置的暫藏保底、可恢復／現有首頁直接問入口。不以取消避擋、強制覆蓋其他按鈕、增加整頁固定留白、全面改版或永久隱藏換取穩定性。隱藏時不可留不可見的 hit region／焦點陷阱；短窗關閉與正常開合、焦點返回不退化。比較 before/after 位移與隱藏、實際 elementFromPoint／touch／keyboard；如不能同時改善且維持必要操作，保留原策略並回報具體取捨供使用者決定，不自行擴大範圍。未重現則保留原程式並據實回報。

## 3. 明確延後項目

- P2-3 全面 CI/瀏覽器測試整合留後續維護；本輪須新增可重現行為測試，但不為此重建 CI。P2-4 獨立文字連結尺寸屬後續無障礙改善，P3 重複資產、vendor 結構依賴及歷史檔案整理一律不順手處理。
- P2-5 GitHub Pages 發布設定不改；GPT 已確認既有主線網站根目錄 PROJECT_STATE.md、README.md、package.json 為 200，AGENTS.md 與 docs/PROJECT_STATE.md 為 404。未來私有化與 Cloudflare 承接需另案核定並驗證連線、網域、環境隔離、回復與舊 Pages 退場；不在此輪實作。
- 原機關正式交付仍另案：六書表與兩影片改同站相對路徑、正式 GA4/OG、CSP/MIME/MP4 206 Range/快取、正式 CX 網域及真實問答；BX015、BX004、內政部租金資訊人工瀏覽確認；真實 iOS/Android/LINE、輔助科技、人員業務驗收待辦保留。此次不製作正式包、不改業務內容、不改 R2／CX／GA4／部署設定，不合併 main。

## 4. 通過條件及收尾

- [ ] 依 AGENTS/Workflow 安全同步最新指定遠端分支（本輪文件提交包含在內），確認乾淨狀態；純 Repo 作業不掃 Drive。只改必要來源、對應測試與文件，保留前輪已核定視覺、政策、六書表、兩影片、導航和 GA4 隔離。需要 build 時從來源生成，不直接手改產物。
- [ ] 執行 npm run build、node scripts/build.mjs --check、npm test（保留全部既有 75 項有效斷言）、node scripts/performance-budget.mjs、node scripts/build-pages-test.mjs、git diff --check。追加 CQA-01 request 行為與 CQA-02 實際操作驗證，必要時重跑既有 final-qa-chat/viewport/短窗/鍵盤/避擋、主要 RWD 及非 CX 回歸。若 layout 或 launcher 變更，涵蓋前輪相關 212 組矩陣與實際必要操作；無需重跑與純文件無關的全套測試。不能刪除既有有效守門、以全過單元替代瀏覽器、以 mock/仿真替代真實 vendor 或實機。
- [ ] 將 before/after、可重現命令、測試結果與限制保存在 `docs/evidence/2026-11-18-claude-closeout/` 文字/JSON/log；所有截圖、錄屏及下載原件僅在 .preview/，不提交。更新 Task/State/Worklog。
- [ ] 於原工作分支 Commit/Push，核對遠端 SHA、原 Cloudflare 自動測試站建置；正常 TLS 讀回白名單 33 檔 bytes/MIME 與產物一致，實際 HTTPS 有關瀏覽器回歸（受限則逐項如實列出），維持測試站零 GA4、不送真實 CX 問題。診斷模式與正常 TLS 分開。
- [ ] 回報兩項結果、實作／測試／線上／實機分層、branch/commit/diff、before/after 與未完成事項，交 GPT 審查及使用者核定合併。無可安全改進時不製造無關修改；不得自行合併、正式發布、私有化或調整平台設定。
