# 專案結構與維護說明

## 目前架構

本專案是 GitHub Pages 靜態網站。網站入口是根目錄的 `index.html`，頁面互動由 `_next/static/chunks/` 中的建置產物、`assets/js/site-enhancements.js` 及 `assets/js/messenger-ui.js` 在瀏覽器端執行；不需要本機後端、資料庫或 API 伺服器。

## 檔案分工

| 路徑 | 用途 | 維護方式 |
| --- | --- | --- |
| `index.html` | GitHub Pages 入口與頁面內容快照 | 優先修改載入區與 Messenger 設定；主要快照不可任意插入縮排 |
| `assets/css/site.css` | 可維護的網站 CSS 與房客服務收合樣式 | 優先在此修改一般頁面樣式 |
| `assets/css/messenger.css` | Messenger 主題、響應式設定與空白狀態提示卡 | 優先在此修改聊天視窗樣式 |
| `assets/js/site-enhancements.js` | 房客服務收合與聯絡列移除 | 優先在此修改一般頁面輔助行為 |
| `assets/js/messenger-ui.js` | Messenger 尺寸、開關狀態、提示卡及快捷查詢 | 優先在此修改聊天視窗互動 |
| `assets/` | 網站自有 CSS、JavaScript 與圖片資產 | 新增自有檔案時依類型歸檔 |
| `docs/` | 操作、架構與文案文件 | 不放執行程式碼 |
| `_next/` | 既有建置產物與相依執行檔 | 不手動改名；重新建置時可能被覆蓋 |

## 修改原則

1. 修改前先執行 `git pull --ff-only origin main` 及 `git status`。
2. 先修改 `assets/` 的可讀檔案，再同步必要的入口引用與 `index.html` 語意結構。
3. 不直接把 Dialogflow CX Agent、Data Store 或知識庫設定寫入前端。
4. 不把身分證字號、地址、電話等個資放入測試訊息或文件範例。
5. 變更後至少測試桌面寬度、手機寬度、Messenger 開關及主要頁面連結。

## 為什麼沒有重排整個 HTML

`index.html` 的主要內容是 React／RSC 建置後的頁面快照。直接在主要節點之間加入換行與縮排，會新增空白文字節點，導致瀏覽器 hydration 警告或頁面互動不穩定。因此本次只整理不影響 DOM 結構的載入區、Messenger 區塊與外部可維護資產；`main` 內的長行視為不可直接編輯的產出物。Messenger 的空白狀態提示卡是刻意保留的語意 HTML，與第三方元件並列，避免依賴 Messenger 內部 shadow DOM。

## 產出物限制

目前 repository 沒有原始 React／Next 建置專案、`package.json` 或可重建的 `src/`。因此 `_next/` 和 HTML 快照只能視為部署產物；若日後要重新建置整個網站，應另行保存原始專案與建置指令，避免手動整理內容在重新建置時遺失。
