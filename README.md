# 臺北市出租房屋租稅優惠專區｜GitHub Pages 靜態版

此資料夾可直接部署至 GitHub Pages，網站內容與互動功能均在瀏覽器端執行，不需要伺服器或資料庫。

## 維護結構

- `index.html`：GitHub Pages 的網站入口；載入區與 Messenger 設定已整理，主要頁面內容仍保留為建置快照。
- `assets/css/site.css`：網站主要樣式；房客服務收合樣式也集中於此。
- `assets/css/messenger.css`：Dialogflow Messenger 的視覺主題、響應式設定與空白狀態提示卡樣式。
- `assets/js/site-enhancements.js`：房客服務收合與聯絡列移除。
- `assets/js/messenger-ui.js`：Messenger 尺寸調整、開關狀態、空白狀態提示卡及快捷查詢。
- `docs/`：操作說明與文案規劃文件。
- `_next/`：原始建置工具產出的執行檔與雜湊資產；除非重新建置，請不要直接修改或改名。

### Dialogflow Messenger 介面提示

聊天視窗開啟且尚未開始對話時，前端會顯示 `index.html` 中的空白狀態提示卡，提供常見主題、服務邊界與個資提醒；這不是 Dialogflow CX 的第一則訊息。使用者自行輸入或點選主題後，提示卡會隱藏並把空間留給正式對話。

Messenger 的版面及空白狀態規格請見 `docs/messenger-ui-spec.md`。若日後要規劃 CX 的開場訊息，`docs/messenger-static-copy.md` 僅作為可選文案參考，不是網站正常運作的必要設定。

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
