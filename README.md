# 臺北市出租房屋租稅優惠專區｜GitHub Pages 靜態版

此資料夾可直接部署至 GitHub Pages，網站內容與互動功能均在瀏覽器端執行，不需要伺服器或資料庫。

## 維護結構

- `index.html`：GitHub Pages 的網站入口；載入區與 Messenger 設定已整理，主要頁面內容仍保留為建置快照。
- `assets/css/site.css`：網站主要樣式與 Dialogflow Messenger 的可讀 CSS 設定。
- `assets/js/site-enhancements.js`：房客服務收合、聯絡列移除與 Messenger 響應式尺寸調整。
- `docs/`：操作說明與文案規劃文件。
- `_next/`：原始建置工具產出的執行檔與雜湊資產；除非重新建置，請不要直接修改或改名。

### Dialogflow Messenger 靜態提示

聊天視窗的歡迎詞、服務範圍、個資提醒及建議問題，請依 `docs/messenger-static-copy.md` 的內容，在 Dialogflow CX 的 Start Page／Entry fulfillment 中設定。前端只保留 Messenger 元件的版面、輸入提示及等待文字，不直接修改元件內部訊息 DOM。

## 部署方式

1. 建立或開啟 GitHub repository。
2. 將本資料夾內的所有內容上傳到 repository 根目錄；請保留 `.nojekyll`、`_next`、`index.html`、圖片及其他檔案。
3. 到 repository 的 `Settings` → `Pages`。
4. 在 `Build and deployment` 選擇 `Deploy from a branch`。
5. 選擇要發布的 branch（通常為 `main`）及 `/ (root)`，按下 `Save`。

## 注意事項

- 不要只上傳 `index.html`；CSS、JavaScript、圖片與 `_next` 資料夾缺一不可。
- `.nojekyll` 用來確保 GitHub Pages 正常提供 `_next` 內的網站資源。
- 本靜態版的官方服務按鈕仍會連往各主管機關網站。
