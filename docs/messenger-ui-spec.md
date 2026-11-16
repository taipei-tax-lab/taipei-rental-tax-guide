# Messenger 視窗介面規格

> 2026-11-16 依現行 source 校正。早期空白狀態卡／原生標題列設計已被取代；舊規格可由 Git 歷史追溯。本文件只描述前端，不宣稱真實 CX／機關站已重新驗收。

## 目的

讓 Dialogflow CX Messenger 在尚未開始對話時，不只呈現大面積空白，而是先提供清楚、安靜且不干擾輸入的視覺導覽。

這份規格描述的是網站前端介面，不是 Dialogflow CX 的 Start Page、Entry fulfillment 或第一句自動訊息。

## 目前行為

網站開啟官方 Messenger 視窗及人物面板，不自動送出問題。四個熱門問題為租金補貼、出租房屋租稅優惠、申請流程、房客權益；桌機置於人物面板，窄／矮視窗以輸入區上方的可展開熱門問題呈現。一般性資訊／個資提醒置於輸入區上方，與訊息區保持分離。人物依對話狀態更新；第一題由現有 runtime contract 直入 Rental Playbook。

## 介面層次

1. 視窗：沿用官方 Messenger，標題區依現有前端行為處理；保留關閉／重開行為。部分 titlebar 處理使用 shadow DOM workaround，不假設第三方內部 DOM 永遠不變。
2. 人物面板：顯示角色、說明與熱門問題，無獨立狀態列。
3. 正式訊息：保留原生訊息清單與主題 CSS；PR #18 已隱藏 Messenger 向下捲動按鈕。
4. 輸入區：底部原生輸入，上方加上個資提醒及窄視窗熱門問題。

## 響應式規則

- 依 visualViewport 計算聊天視窗大小與位置，桌機人物面板須具備至少 900px 寬、520px 高且有足夠剩餘空間，否則不顯示。
- 窄／矮視窗在輸入區提供可展開熱門問題；小於 400px 可用高度採 compact 行為，保留對話、輸入及關閉操作。
- 具體斷點、尺寸及狀態以 `messenger-ui.js` 與原有回歸測試為準，不沿用舊 366px 提示卡限制。

## 維護位置

- `assets/css/messenger.css`：Messenger 主題與 UI 樣式。
- `assets/js/messenger-ui.js`：尺寸、人物／熱門問題、開關、runtime context 與 GA4 行為事件。
- `site/messenger.html`：Messenger 元件及熱門問題 template 的正式來源；`index.html` 是生成物。

## Dialogflow CX 邊界

網站只在使用者點選主題時呼叫 Messenger 的 `sendQuery`，不會在聊天視窗開啟時自動送出訊息，也不需要修改目前 Agent 的開場設定。
