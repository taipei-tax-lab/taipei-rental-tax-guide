# Dialogflow CX 對話框體驗提升規劃

> 適用專案：臺北市出租房屋租稅優惠智慧服務 PoC  
> 規劃日期：2026-09-01

## 一、規劃目標

在維持目前 GitHub Pages 靜態網站架構的前提下，將對話內容、知識、流程與後續改善機制集中由 Google Cloud Dialogflow CX 管理，並提升民眾使用對話框時的理解、操作與信任感。

建議採用以下分工：

```text
網站前端：聊天視窗外觀、尺寸、位置、響應式版面、空白狀態提示卡
Google Cloud：對話內容、知識檢索、流程分流、參數記憶、動態規則、測試與分析
```

## 二、目前專案狀態

- 網站為 GitHub Pages 靜態前端，不含本機後端、資料庫或 API 伺服器。
- 網站使用 Google 官方 Dialogflow CX Conversational Messenger Web Component。
- 目前對話主要由 `Default Playbook`、Data Store Tool 與 Vertex AI Search／Discovery Engine Data Store 提供服務。
- Data Store 目前以非結構化資料保存出租房屋租稅與租屋服務內容。
- 網站前端已經有聊天空白狀態提示卡及四個主題快捷查詢。
- 目前「出租房屋租稅知識庫_診斷」Tool 為正常使用中的 Tool；原有舊 Tool 不應重新掛回 Default Playbook。

## 三、文件規範與本次需求的區分

`docs/dialogflow-cx-operation-guide.md` 是既有的操作與驗證規範，不是本次新增功能需求。後續規劃仍需遵守其中的維護界線：

1. 重大修改前先備份 Agent、Playbook、Tool 或 Data Store。
2. 稅率、金額、期限、資格等精確資訊優先查詢 Data Store。
3. 查無充分資料時不得猜測或自行補全。
4. 正式資格、稅務認定及核定結果仍以主管機關公告與個案審查為準。
5. 修改後先測試 Simulator，再測試實際網站 Messenger。
6. 不將 API Key、Service Account Key 或其他秘密憑證放入前端。

本文件是依照上述規範提出的改善方案；它本身不會自動修改 Google Cloud 設定。

## 四、可以由 Google Cloud 管理的改善項目

### 1. 統一回答格式

在 Default Playbook Instructions、Examples 與 Fulfillment 中定義統一格式：

1. 先給一句簡短結論。
2. 說明適用對象或使用情境。
3. 列出優惠重點或主要條件。
4. 說明辦理步驟與應洽機關。
5. 提供官方來源或申請連結。
6. 加上必要的個案審查提醒。

Examples 應示範「如何查詢工具、如何引用資料、查不到時如何回覆」，不要把可能過期的稅率或期限當成固定答案保存。

### 2. 使用快速選項與資訊卡

在回答後加入 2～4 個下一步選項，例如：

- 查申請流程
- 看官方公告
- 比較其他出租方案
- 查詢承辦機關

可使用 Messenger 支援的 suggestion chips、info cards、description cards 及官方連結。這些屬於對話訊息內容，可由 CX Fulfillment 控制；不需要改變網站外層聊天視窗。

參考：

- [Google Cloud：Dialogflow CX Messenger fulfillment](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/fulfillment?authuser=0000&hl=en)
- [Google Cloud：Dialogflow CX Messenger HTML customizations](https://docs.cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger/html)

目前網站的前端空白狀態卡可先保留，Google Cloud 主要負責回答後的下一步選項，避免兩套快捷入口重複。

### 3. 建立屋主／房客分流

建議逐步建立下列 Flow 或 Page：

- `屋主服務 Flow`
- `房客服務 Flow`
- `租稅優惠 Page`
- `租金補貼 Page`
- `申請流程 Page`
- `官方窗口 Page`

主要分流問題：

1. 使用者是屋主還是房客？
2. 想查租稅優惠、租金補貼、出租方案或辦理流程？
3. 想了解資格、優惠內容、準備文件還是承辦機關？

### 4. 使用參數保留對話上下文

可使用 Intent、Form parameter 與 Session parameter 保存：

- 使用者身分：屋主／房客
- 查詢主題：租稅優惠／租金補貼／出租方案
- 方案類型：一般出租／公益出租人／包租代管
- 使用者想查看的資訊：資格／優惠／文件／流程

這樣使用者接著問「那我要去哪裡辦？」時，Agent 可以依照前文回答，而不必要求使用者重新描述問題。

參考：[Google Cloud：Parameters](https://docs.cloud.google.com/dialogflow/cx/docs/concept/parameter)

### 5. 以 Data Store 強化官方資料可信度

目前的非結構化 Data Store 可繼續支援一般說明；正式上線前建議另外整理高精確度資料：

- 稅率
- 金額
- 期限
- 所得或租金標準
- 申請資格
- 承辦機關
- 官方來源網址
- 生效年度與最後確認日期

可考慮建立結構化 FAQ 或結構化 Data Store，並在資料中保存年度、生效日期、資料來源與確認狀態。一般解說與精確規則分開，有助於降低過期資料混用的風險。

Data Store Tool 應設定來源連結、引用及查無資料時的安全 fallback。參考：[Google Cloud：Data store tools](https://cloud.google.com/dialogflow/cx/docs/concept/data-store/handler)

### 6. 對查不到答案與不完整問題設計 fallback

建議為 no-match、Tool 失敗及資訊不足分別設計回應：

```text
目前資料不足，無法確認您的個案是否符合條件。
我可以先協助您查看一般規定、申請流程或官方承辦窗口。
```

若使用者提出「明年一定會核准嗎？」或要求正式核定，應明確說明 Agent 只能提供一般性資訊，不能代替主管機關認定。

Generative fallback 可以用於協助理解口語或重新表達，但不應用來自行產生稅率、期限或個案資格結論。

### 7. 以 Webhook 處理動態規則與計算

涉及下列功能時，再導入 Google Cloud Run 或 Cloud Functions Webhook：

- 依年度判斷適用規則
- 期限是否已過
- 租金或稅額計算
- 條件欄位檢核
- 方案比較與資格初步篩選

Dialogflow CX 負責理解問題與收集參數，Webhook 負責計算或驗證，最後由 Agent 用易懂文字呈現結果。Webhook 結果仍應標示「初步判斷」或「一般資訊」，不能宣稱正式核定。

參考：[Google Cloud：Webhooks](https://docs.cloud.google.com/dialogflow/cx/docs/concept/webhook?authuser=31)

### 8. 建立測試與分析機制

在 Dialogflow CX 建立 Test Cases，至少涵蓋：

- 一般問候
- 公益出租人稅率問題
- 一般出租規定
- 社會住宅包租代管
- 房客租金補貼
- 連續追問與上下文記憶
- 查不到資料
- 個案核定或不應回答的問題

啟用 Conversation History 與 Analytics 後，定期觀察 no-match、Tool 失敗、Webhook 失敗與使用者常見追問，作為下一輪改善依據。

參考：

- [Google Cloud：Test cases](https://docs.cloud.google.com/dialogflow/cx/docs/concept/test-case)
- [Google Cloud：Analytics](https://docs.cloud.google.com/dialogflow/cx/docs/concept/analytics?authuser=2)

## 五、仍需要修改網站前端的項目

以下項目不能只在 Google Cloud Console 完成：

- 聊天泡泡的位置、尺寸與手機版位置。
- 對話框寬高與響應式行為。
- 聊天標題、副標題、輸入框提示與等待文字。
- 目前網站的空白狀態提示卡。
- 是否初始展開對話框。
- 自訂 Messenger 元件或特殊視覺卡片。

目前相關維護位置：

- `index.html`：Messenger 元件與基本屬性。
- `assets/css/messenger.css`：主題、尺寸與空白狀態卡樣式。
- `assets/js/messenger-ui.js`：尺寸計算、開關狀態與快捷查詢。

若要在開啟聊天視窗時自動顯示歡迎訊息，需要前端開啟事件設定與 Dialogflow CX 的 Start Page／Entry fulfillment 一起配合，不屬於純 Cloud 端修改。

## 六、建議執行順序

### 第一階段：低風險快速改善

1. 備份目前 Agent。
2. 保持現有 Data Store 與「出租房屋租稅知識庫_診斷」Tool 不變。
3. 整理 Default Playbook Instructions 與 Examples。
4. 統一回答格式。
5. 加入官方來源、引用與安全 fallback。
6. 在回答後加入下一步 chips 或資訊卡。
7. 建立 8～12 個 Test Cases。

### 第二階段：互動式導引

1. 建立屋主／房客 Flow。
2. 用 Page 與 Form 收集非敏感的情境資訊。
3. 使用 Session parameters 保留對話上下文。
4. 依主題提供專屬的辦理清單與官方入口。

### 第三階段：精確規則與試算

1. 整理結構化的年度規則資料。
2. 建立 Cloud Run 或 Cloud Functions Webhook。
3. 實作期限、金額、稅率或條件的初步計算與驗證。
4. 以實際主管機關案例建立測試資料。

### 第四階段：持續營運

1. 啟用並定期檢視 Conversation History 與 Analytics。
2. 追蹤 no-match、查詢失敗與資料過期情況。
3. 每次官方規定更新時，記錄資料版本、生效日期與確認人員。
4. 定期重跑 Test Cases，確認更新沒有破壞既有對話。

## 七、最小驗收標準

- 一般問候不出現 Internal error。
- 公益出租人、一般出租、包租代管與租金補貼問題可正確分流。
- 精確資料能取得官方來源或引用。
- 查不到資料時不猜測。
- 追問可以保留前文身分與主題。
- 回答後能提供清楚的下一步選項。
- 正式資格、稅率、期限與核定結果都有適當提醒。
- Simulator、實際 Messenger、桌面版與手機版均完成測試。
- 變更前有備份，變更後有測試紀錄。

## 八、整體建議

第一批最值得投入的功能是「標準化回答格式、官方來源、快速選項、安全 fallback 與測試案例」。這些工作大多可由 Google Cloud 管理，對現有前端影響小，卻能明顯改善可理解性、操作便利性與資訊可信度。

正式資格判斷、期限檢核與試算功能則應放在第二階段之後，搭配結構化資料與 Webhook 實作，不宜直接交給生成式模型自由回答。
