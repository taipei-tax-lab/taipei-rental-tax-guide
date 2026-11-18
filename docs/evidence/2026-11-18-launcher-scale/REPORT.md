# 2026-11-18 小幫手原視覺比例驗收

指定分支 `feat/direct-apply-operation-guide-20261031` 以 fast-forward 同步至 `42acfba`。縮小前對照 `05f096d`，修改前執行碼 `25c4122`，本輪實作 `ad19c1e`。

## 三版實測

同一 Google 靜態 Messenger 元件比對 10 組尺寸及字級，涵蓋 1440×900、1892×873、320／390／414 直向、844×390 橫向，及 560／561px 斷點。字級為 100／150／200%。截圖保存在 Git 忽略的 `.preview/`。

| 實測 CSS 像素 | 縮小前 | 本輪修改前 | 本輪修正 |
| --- | ---: | ---: | ---: |
| 桌機 PNG 矩形 | 150×150 | 84×84 | 150×150 |
| 560px 以下 PNG 矩形 | 132×132 | 72×72 | 132×132 |
| 桌機／手機按鈕矩形 | 84／72 | 84／72 | 84／72 |

PNG 沿用原檔。Canvas 查驗非透明區域為 x=4 至 322、y=0 至 360，還原圖與文字完整呈現。按鈕外新增與圖案非透明範圍同尺寸的操作面。由 `elementFromPoint` 驗證透明外緣不攔截點擊，並以觸控按角色或「點我問！」實際開啟。以鍵盤關閉並驗證焦點返回。縮小前的部分 PNG 在視窗邊緣溢出，本輪以圖案實際邊界留在視窗內。

[縮小前量測](original-scale.json) · [修改前量測](before-scale.json) · [修正版量測](after-scale.json) · [測試站量測](live-scale.json)

## 防遮擋與可達性

在右側尋找最低安全位置，同時檢查圖案邊界與按鈕矩形。整幅圖無安全位置時暫藏，捲回安全位置後恢復。短窗維持原關閉按鈕。關閉後若浮動入口可見，焦點回到入口。若入口必須暫藏，焦點回到共用的「直接問小幫手」按鈕。另在 844×390、200% 刻意捲到無安全位置，驗證關閉後焦點返回頁面入口與捲動位置不變，捲回後浮動入口恢復。

| 首頁及直接申請，共 30 組往返捲動 | 修改前 | 修正後 |
| --- | ---: | ---: |
| 暫藏樣本 | 2,748／8,702（31.6%） | 3,654／8,702（42.0%） |
| 相鄰可見點最大跳動 | 756 px | 683 px |
| 最長暫藏捲動跨度 | 6,240 px | 6,368 px |
| 暫藏後恢復 | 98 次 | 118 次 |

例如 320×640、200% 首頁暫藏由 460／874 筆增為 490／874 筆。1440×900、200% 首頁由 0／282 筆增為 88／282 筆。每筆可見樣本的圖案及按鈕均在視窗內，且無必要操作相交。暫藏時圖案及按鈕均無命中。首頁、申請管道、試算、書表與導覽各環境均另驗證 85 次觸控及 85 次 Enter。短窗、旋轉、輸入及 160 次頁面操作觸控由 final-qa-chat 回歸覆蓋。

[原位置量測](before-launcher.json) · [新位置量測](after-launcher.json) · [測試站控制回歸](live-controls.json) · [測試站聊天回歸](live-chat.json)

## 建置與測試站

本機 `npm run build`、`node scripts/build.mjs --check`、75/75 單元、效能預算、`node scripts/build-pages-test.mjs`、`git diff --check` 及 212 組 RWD 通過。以 9 組新 context 驗證側面板隱藏時仍為零專屬圖片請求。原角色 PNG 與側面板讀取分別檢查。

Cloudflare 自動建置 `ad19c1e` 成功，部署識別碼 `e16ac19c-ed1c-4722-83ab-a574e08cf17a`。正常 TLS 讀回的 33 檔 bytes／MIME 與本地相符。測試站重跑比例、觸控／鍵盤、短窗、圖片讀取、GA4 隔離與私有路徑 404。Chromium 使用憑證診斷，載入真實 Google 靜態元件並封鎖 CX 發問。觸控和旋轉為模擬裝置測試，實機與使用者視覺確認另留待驗收。

[本機建置紀錄](local-build.log) · [本機 RWD](local-rwd.json) · [測試站側面板讀取](live-images.json) · [測試站隔離](live-pages.json) · [正常 TLS 比對](live-normal-tls.json)

## 重現

以 `git archive 05f096d` 與 `git archive 42acfba` 建立兩份對照，和目前版本分別執行 `npm run build:pages:test`，設定不同 `PORT` 執行 `node scripts/serve.mjs --pages-test`。從目前版本執行以下指令，`PREVIEW_URL` 指向各自預覽或測試站。使用 Chromium、Playwright，並依環境為瀏覽器設定 `BROWSER_IGNORE_HTTPS_ERRORS=1`，正常 TLS 比對獨立執行。

```sh
node scripts/claude-closeout-browser.cjs --scale-only  # 縮小前加 --original，修改前加 --baseline
node scripts/claude-closeout-browser.cjs --launcher-only
node scripts/claude-closeout-browser.cjs --controls-only
node scripts/claude-closeout-browser.cjs --images-only
node scripts/final-qa-chat.cjs
node scripts/rwd6-check.cjs
node scripts/pages-test-browser-check.cjs
node --use-env-proxy scripts/final-qa-live.mjs
```
