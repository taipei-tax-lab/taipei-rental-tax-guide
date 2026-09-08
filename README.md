# 臺北市出租房屋租稅優惠專區｜V2 開發版

目標是「充分且不混淆的資訊，讓民眾快速找到需求與下一步」。仍為 GitHub Pages 靜態網站，不需要後端、資料庫或前端套件安裝。

## 本次範圍

- 首頁依屋主／房客分流；直接呈現四種出租情境及優惠摘要。
- 桌機四欄時，點選方案在卡片下方展開；手機／平板維持詳情畫面。共用完整條件、三大稅目、下一步與官方入口。
- 不確定者使用最多三題的閱讀導引，附建議理由，不判定正式資格。
- 完整比較在第二層，手機直向閱讀。
- 十項既有房客服務保留，整理為補貼、房源、租屋／設籍三類。
- 首頁提供屋主、房客、直接問小幫手三個明顯入口；快速判斷移到方案卡片前方。
- 小幫手快捷入口使用官方 openChat 開啟原有右下角視窗，不送出問題或清除對話。Messenger、角色面板、設定與素材沿用 main；CX 題庫及雲端設定另案處理。

## 開發與預覽

需要 Node.js 20 以上，不需要 npm install。

```powershell
npm run build
npm test
npm run dev
```

預覽網址：http://127.0.0.1:4173/ 。修改來源後重新 build 並重新整理；預覽服務不會自動建置。

## 維護位置

| 檔案 | 用途 |
| --- | --- |
| site/content.json | 四方案政策主資料、官方資源、來源與核對日期 |
| site/template.html | 首頁與共用版面 |
| site/messenger.html | 從 main 保留的小幫手片段 |
| scripts/build.mjs | 零相依建置，產生 index.html 與資產內容雜湊版本 |
| assets/css/guide-v2.css | V2 版面與響應式樣式，限縮於 .v2-site |
| assets/js/guide-rules.js | 最多三題的閱讀導引規則 |
| assets/js/guide-ui.js | 身分切換、hash 導覽、返回、展開與列印 |
| assets/css/site.css | 保留的既有基礎樣式及小幫手使用的色彩變數 |
| assets/css/messenger.css、assets/js/messenger-ui.js | 原有小幫手樣式及行為，本次未改 |
| index.html | GitHub Pages 使用的建置結果，不直接手改 |

舊 _next/ 快照與 site-enhancements.js 保留但不再由 V2 載入。舊版可由 main／對應 Git 歷史版本取得。

## 驗證

npm test 檢查建置可重現性、靜態連結、四方案資料、小幫手片段與全部導引分支。

若環境已提供 Playwright 與 Microsoft Edge，可在預覽服務運作時執行：

```powershell
node scripts/browser-check.cjs
```

這是選用的瀏覽器整合驗證；Playwright 不屬網站執行相依。結果與截圖位於被 Git 忽略的 .preview/。

詳見 [V2 開發與驗收紀錄](docs/v2-development.md)。首次使用者查找時間與理解程度仍須真人測試。

## 部署

保留原 GitHub Pages 分支部署方式。建置後提交 index.html、assets/、hero-v2.png、favicon.svg 及 .nojekyll 等網站資產；原始檔與建置腳本也一併版控，供日後重建。

本次在 codex/rental-guide-v2 開發，分支尚未合併或部署。本機建置與開發分支推送不會改變 main 的正式頁面。

## 專案與 CX 文件

- [專案結構](docs/project-structure.md)
- [V2 開發與驗收紀錄](docs/v2-development.md)
- [Dialogflow CX 對話體驗規劃](docs/dialogflow-cx-chat-experience-plan.md)
- [Dialogflow CX 操作與驗證](docs/dialogflow-cx-operation-guide.md)
- [Messenger 介面規格](docs/messenger-ui-spec.md)

CX 文件是既有規劃或操作紀錄，不表示所列功能均已實作。網站政策資料不會自動同步到 Data Store；新題庫、知識版本與設定留待下一階段。
