# 專案結構與維護說明

## V2 架構

靜態 HTML／CSS／JavaScript，以 Node.js 內建模組從 site/ 來源產生 index.html，不需要前端框架或自建後端。此處以目前 Cloudflare 開發分支為準；主線尚未包含直接申請及操作影片。

```text
site/content.json ── 方案與資源 ─┐
site/template.html ── 版面 ──────┤
site/messenger.html ─ 小幫手 ────┼─ scripts/build.mjs → index.html
site/media.json ───── 影片來源 ──┘

assets/css/guide-v2.css ─ V2 版面
assets/js/guide-rules.js ─ 閱讀導引規則
assets/js/guide-ui.js ─ 分流與頁面切換
assets/js/operation-guide.js ─ 操作影片互動
assets/js/analytics.js ─ GA4 事件封裝

assets/css/site.css ─ 既有共用樣式及色彩變數
assets/css/messenger.css ─ 聊天樣式
assets/js/messenger-ui.js ─ 聊天、角色及 runtime context

scripts/build-pages-test.mjs → dist-pages-test/（33 個白名單靜態檔案；隔離 GA4）
```

## 舊快照與 V2 的關係

原 repository 沒有 React／Next 原始專案及重建設定，只有 index.html 和 _next/ 的耦合部署快照。V2 是使用者授權的新分支改版，因此建立可維護的靜態來源，完整替換入口渲染流程；沒有手改壓縮 chunk，也沒有在 React hydration 後改 DOM。

_next/ 與 site-enhancements.js 保留供歷史查考，但不再載入。site.css 保留，維持小幫手共用的色彩、字型及基礎樣式。V2 使用獨立命名，不套用到小幫手。

## 導覽與漸進增強

- 首頁 #owners、#tenants 切換情境。
- #plan-ordinary、#plan-public、#plan-social、#plan-personal 可直接分享、重新整理與返回。
- #comparison 為第二層比較；#resources 直接展開官方窗口。
- 開發分支的 #direct-apply、#operation-guide 共用首頁主視覺與六入口；不在 main 的既有發布內容內。
- 舊 #tenant-services、#calculator、#process 分別導到房客、一般出租、比較。
- 切換方案不重新載入頁面，維持同一個 Messenger 實例。
- 所有核心資訊在建置時寫入 HTML。無 JavaScript 仍可閱讀各方案、展開文件與前往官方入口，僅無動態身分切換與三題導引。
- 導引答案及頁面狀態只保留當次頁面記憶體，網站 GA4 v1 僅追蹤核定的行為事件，不傳送使用者自由文字、CX payload 或個資。Cloudflare 測試產物停用 GA4。

## 資料維護

各方案 taxes 欄位是卡片、詳情與比較的共同資料。FAQ 解釋概念並導回對應方案，不另抄稅率。

更新數字或條件時，核對官方來源、年度與例外，同步修改 source.checked 和 source.updated，再執行 npm run build 與 npm test。不要把建置日期當成業務核對日期。

site/messenger.html 是機關 CX 前端片段。CX Agent、Playbook、Tool、Data Store 及知識文件由後端 Repo／Google Cloud 另案管理，網站不自動同步。

## 本機與發布

npm run dev 只綁定 127.0.0.1:4173，只提供公開頁面資產，不提供 .git 或 site/ 原始資料。瀏覽器驗證結果位於 .preview/，不進版控。

開發前確認分支與工作目錄；修改後建置、測試及檢查差異。GitHub Pages、Cloudflare 測試站及機關站的來源與正式交付界線詳見 [PROJECT_WORKFLOW](PROJECT_WORKFLOW.md)。實際版本與生成物差異見 [PROJECT_STATE](PROJECT_STATE.md)。
