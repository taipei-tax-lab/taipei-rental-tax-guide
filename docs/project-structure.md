# 專案結構與維護說明

## V2 架構

GitHub Pages 靜態 HTML／CSS／JavaScript，以 Node.js 內建模組從 site/ 來源產生 index.html，不需要前端框架或後端。

```text
site/content.json ── 方案與資源 ─┐
site/template.html ── 版面 ─────┼─ scripts/build.mjs → index.html
site/messenger.html ─ 小幫手 ──┘

assets/css/guide-v2.css ─ V2 版面
assets/js/guide-rules.js ─ 閱讀導引規則
assets/js/guide-ui.js ─ 分流與頁面切換

assets/css/site.css ─ 既有共用樣式及色彩變數
assets/css/messenger.css ─ 原有聊天樣式（未改）
assets/js/messenger-ui.js ─ 原有聊天與角色行為（未改）
```

## 舊快照與 V2 的關係

原 repository 沒有 React／Next 原始專案及重建設定，只有 index.html 和 _next/ 的耦合部署快照。V2 是使用者授權的新分支改版，因此建立可維護的靜態來源，完整替換入口渲染流程；沒有手改壓縮 chunk，也沒有在 React hydration 後改 DOM。

_next/ 與 site-enhancements.js 保留供歷史查考，但不再載入。site.css 保留，維持小幫手共用的色彩、字型及基礎樣式。V2 使用獨立命名，不套用到小幫手。

## 導覽與漸進增強

- 首頁 #owners、#tenants 切換情境。
- #plan-ordinary、#plan-public、#plan-social、#plan-personal 可直接分享、重新整理與返回。
- #comparison 為第二層比較；#resources 直接展開官方窗口。
- 舊 #tenant-services、#calculator、#process 分別導到房客、一般出租、比較。
- 切換方案不重新載入頁面，維持同一個 Messenger 實例。
- 所有核心資訊在建置時寫入 HTML。無 JavaScript 仍可閱讀各方案、展開文件與前往官方入口，僅無動態身分切換與三題導引。
- 導引只保留當次頁面記憶體，不收集個資，不使用追蹤或跨工作階段儲存。

## 資料維護

各方案 taxes 欄位是卡片、詳情與比較的共同資料。FAQ 解釋概念並導回對應方案，不另抄稅率。

更新數字或條件時，核對官方來源、年度與例外，同步修改 source.checked 和 source.updated，再執行 npm run build 與 npm test。不要把建置日期當成業務核對日期。

site/messenger.html 是保留的前端片段。CX Agent、Playbook、Tool、Data Store 及知識文件仍由 Google Cloud 另案管理，本次沒有修改或同步。

## 本機與發布

npm run dev 只綁定 127.0.0.1:4173，只提供公開頁面資產，不提供 .git 或 site/ 原始資料。瀏覽器驗證結果位於 .preview/，不進版控。

開發前確認分支與工作目錄；修改後建置、測試及檢查差異。提交、推送、合併與發布依使用者指示，不因文件內範例自動執行。
