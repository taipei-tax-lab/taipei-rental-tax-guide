# 臺北市出租房屋租稅優惠專區｜GitHub Pages 靜態版

此資料夾可直接部署至 GitHub Pages，網站內容與互動功能均在瀏覽器端執行，不需要伺服器或資料庫。

## 維護結構

- `index.html`：GitHub Pages 的網站入口；載入區與 Messenger 設定已整理，主要頁面內容仍保留為建置快照。
- `assets/css/site.css`：網站主要樣式；房客服務收合樣式也集中於此。
- `assets/css/messenger.css`：Dialogflow Messenger 的視覺主題、響應式設定與空白狀態提示卡樣式。
- `assets/js/site-enhancements.js`：房客服務收合與聯絡列移除。
- `assets/js/messenger-ui.js`：Messenger 尺寸調整、空白狀態、快捷查詢，以及 Assistant Panel 的顯示、六狀態與角色動畫控制。
- `docs/`：Dialogflow CX 操作、對話體驗規劃與其他專案說明文件。
- `_next/`：原始建置工具產出的執行檔與雜湊資產；除非重新建置，請不要直接修改或改名。

## 專案文件

目前主要 Dialogflow CX 文件如下：

- [`docs/dialogflow-cx-chat-experience-plan.md`](docs/dialogflow-cx-chat-experience-plan.md)：對話框體驗提升、前端與 Google Cloud 分工、後續改善方向與開發優先順序。
- [`docs/dialogflow-cx-operation-guide.md`](docs/dialogflow-cx-operation-guide.md)：Dialogflow CX 的操作、維護、安全邊界與修改後驗證原則。

進行新的 Dialogflow CX、Messenger 或 RAG 調整前，建議先閱讀上述文件，再確認目前 `main` 與實際 GitHub Pages 狀態，避免重複修改或破壞既有可運作版本。

### Dialogflow Messenger 介面提示

聊天視窗開啟且尚未開始對話時，前端會顯示空白狀態提示卡與 Assistant Panel；使用者自行輸入或點選主題後，介面會依對話狀態更新並把主要空間留給正式對話。

Messenger 的主要前端行為由 `assets/css/messenger.css` 與 `assets/js/messenger-ui.js` 維護；Dialogflow CX 的回答內容、Playbook、Tool、Data Store 與流程設定則由 Google Cloud 管理。

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
