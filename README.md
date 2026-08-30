# 臺北市出租房屋租稅優惠專區｜GitHub Pages 靜態版

此資料夾可直接部署至 GitHub Pages，網站內容與互動功能均在瀏覽器端執行，不需要伺服器或資料庫。

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
