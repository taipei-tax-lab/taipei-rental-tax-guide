# Dialogflow CX 操作與驗證說明

本文件是「臺北市出租房屋租稅優惠智慧服務 PoC」的 Dialogflow CX 操作指南。

文件用途：

- 協助日後在 Google Cloud Conversational Agents / Dialogflow CX Console 進行設定。
- 記錄目前 PoC 的 Agent、Playbook、Data Store、Tool 與測試基準。
- 讓雲端設定可以依照步驟操作與驗證。

本文件只記錄操作方式與目前已知設定，不會自動同步或修改 Google Cloud 設定。正式資格、稅率、期限與核定結果，仍應以主管機關最新公告及個案審查為準。

---

## 1. 專案架構

目前整體鏈路如下：

```text
民眾瀏覽器
  ↓
GitHub Pages 靜態網站
  ↓
Dialogflow CX Conversational Messenger
  ↓
Google Conversational Agents / Dialogflow CX
  ↓
Default Playbook
  ↓
Data Store Tool
  ↓
Vertex AI Search / Discovery Engine Data Store
  ↓
官方出租房屋租稅資料
```

目前網站是靜態前端，前端 repository 與 Dialogflow CX 雲端設定分開維護：

- GitHub repository：網站 HTML、CSS、JavaScript、圖片與 Messenger 嵌入設定。
- Google Cloud Console：Agent、Playbook、Example、Tool、Data Store、RAG 與 IAM。
- 本文件：雲端設定的操作紀錄與驗證基準。

---

## 2. Agent 基本設定

進入 Conversational Agents / Dialogflow CX Console 後，確認使用下列資源：

```text
Google Cloud Project ID: aerial-day-496714-v6
Project Display Name: Google AI Pro API Project

Agent Display Name: 出租房屋租稅優惠測試
Agent ID: 9fb1cac6-62cd-40e6-8b13-eecf651f1f72
Agent Region: asia-northeast1
Default Language: zh-tw
Time Zone: Asia/Hong_Kong
```

目前不要因為文件中的時區名稱而自行修改設定；若未來要改時區，應先說明原因、影響與驗證方式。

---

## 3. 修改前先備份

任何 Agent、Playbook、Tool 或 Flow 的重大修改前，先建立備份。

操作順序：

1. 開啟 Conversational Agents Console。
2. 選擇 Project `aerial-day-496714-v6`。
3. 選擇 Agent「出租房屋租稅優惠測試」。
4. 進入 `Manage`。
5. 開啟 `Change History`。
6. 進入 `Backup`。
7. 建立新的 Backup，填寫清楚的名稱與說明。

重大變更也可以使用 Agent Export 保存完整 Agent 資料。還原 Agent 可能覆蓋目標 Agent 的資料，使用前必須確認目標環境。

建議備份名稱包含：

```text
before-playbook-change-YYYYMMDD
before-tool-change-YYYYMMDD
before-rag-source-update-YYYYMMDD
```

---

## 4. Default Playbook 設計

### 4.1 主要 Goal

Default Playbook 的主要目標：

```text
協助民眾了解臺北市出租房屋相關租稅優惠、出租方案、申請方式及相關服務，並以清楚易懂的臺灣繁體中文與民眾進行對話。
```

### 4.2 Instructions 原則

Instructions 應至少包含以下原則：

1. 一律使用臺灣繁體中文。
2. 主要服務範圍是臺北市出租房屋租稅優惠、出租方案、申請方式及相關租客服務。
3. 回答清楚、簡潔，避免不必要的艱深稅務術語。
4. 資訊不足時，詢問必要的補充資訊。
5. 不確定時不得猜測、推測或捏造答案。
6. 涉及正式個案資格或稅務認定時，提醒使用者仍以主管機關實際審核為準。
7. 每個新對話只做一次簡短自我介紹。
8. 使用者已直接提出問題時，不要每次重新進行完整 Greeting。
9. 涉及稅率、金額、期限、資格、申請方式等精確資訊時，優先使用 Data Store Tool 查詢，不要只依賴模型既有知識。
10. Data Store 找不到充分資料時，明確說明資料不足，並引導使用者查看官方資料或聯絡承辦機關。
11. 不要將一般知識解說當成正式行政處分或個案核定。

### 4.3 高風險問題處理原則

下列問題不應完全交由生成式模型自由判定：

- 是否符合資格。
- 某一個案正式適用的稅率。
- 法定期限是否已過。
- 個案是否可以核准。
- 具體法律效果。

這些情況應逐步評估使用 Flow、結構化資料、Decision Logic、Webhook 或後端 API。現階段若尚未建立規則流程，回答應使用保守說法並引導主管機關確認。

---

## 5. Greeting Example

建立一個 Greeting Example，作為使用者打招呼時的示範：

```text
您好！我是臺北市出租房屋租稅小幫手 👋

我可以協助您了解臺北市出租房屋相關的租稅優惠、出租方案、申請方式及租客服務。

例如：

- 我出租房屋可以享有什麼租稅優惠？
- 公益出租人是什麼？要如何認定？
- 一般出租、公益出租人與包租代管有什麼差別？
- 加入社會住宅包租代管有什麼好處？
- 房客可以申請哪些租金補貼？

您也可以直接描述您的情況，我會協助您整理下一步。
```

注意：Example 是 few-shot demonstration，不等於 Messenger 開啟時自動觸發 Greeting。若要在 Messenger 開啟時主動顯示歡迎訊息，應另外設計 entry event、intent 或 Messenger 觸發機制，並用 Simulator 與實際網站測試。

---

## 6. Data Store 設定

### 6.1 目前 Data Store

```text
Data Store Display Name: taipei-rental-tax-guide
Data Store ID: taipei-rental-tax-guide_1788167755664
Data Store Location: global
Data Type: Unstructured
```

目前 PoC 文件來源位於 Cloud Storage：

```text
Bucket: taipei-rental-tax-guide
Bucket Region: asia-northeast1
Folder: rental-tax-rag/
```

目前文件：

```text
00_出租房屋租稅優惠專區總覽.txt
01_公益出租人.txt
02_社會住宅包租代管.txt
03_個人租賃住宅包租代管.txt
04_一般出租房屋稅與租金標準.txt
```

### 6.2 檢查項目

進入 Data Store 後確認：

- 所有文件 Import completed。
- 沒有匯入錯誤。
- 文件已完成 indexing。
- Serving 已啟用。
- Generative AI 可使用。
- 文件來源、版本及更新日期有紀錄。

目前五份文件內容較小，PoC 階段不需要為了 advanced chunking 重新建立 Data Store。

正式上線前，應逐步將 PoC 整理資料替換為：

- 官方正式文件。
- 最新法規。
- 官方網站正式內容。
- 經業務單位確認或核可的知識文件。

---

## 7. Data Store Tool

### 7.1 目前應使用的 Tool

目前正常運作的是：

```text
Tool Display Name: 出租房屋租稅知識庫_診斷
Connected Data Store: taipei-rental-tax-guide
```

不要將舊 Tool 重新掛回 Default Playbook：

```text
出租房屋租稅知識庫
```

### 7.2 建立新的 Data Store Tool

只有在需要刻意診斷或建立新的 Tool 時才執行：

1. 在左側選單開啟 `Tools`。
2. 選擇 `Create`。
3. Tool Type 選擇 `Data store`。
4. 輸入唯一的 Tool 名稱與說明。
5. 在 `Data stores` 選擇 `Add data stores`。
6. 選擇既有的 `taipei-rental-tax-guide`。
7. 儲存 Tool。
8. 回到 Default Playbook 或 Example，確認使用的是新 Tool。

### 7.3 Tool 使用說明

在 Tool 說明或 Playbook Instructions 中清楚指定：

- 涉及精確租稅資訊時使用此 Tool。
- 查詢結果不足時不可自行補全。
- 回答應以 Data Store 查詢內容為依據。
- 必要時附上來源或官方連結。

---

## 8. RAG Example

建立或保留下列 Example：

```text
Example Name: RAG_公益出租人稅率
```

測試輸入：

```text
115年期公益出租人的房屋稅相當稅率是多少？
```

Example 應展示以下流程：

```text
使用者問題
  ↓
呼叫「出租房屋租稅知識庫_診斷」
  ↓
傳送查詢文字
  ↓
接收 Data Store Tool 結果
  ↓
根據查詢結果回答
  ↓
對話狀態為 OK
```

目前已知的驗證結果：

```text
115年期公益出租人的房屋稅相當稅率為 0.9%。
```

這個數值只是目前測試案例的查詢結果。Example 裡的 Tool output 是 few-shot demonstration，不是每次 runtime 實際搜尋的紀錄。

---

## 9. Simulator 測試

每次修改 Playbook、Example、Tool 或 Data Store 後，先在 Simulator 測試，再到 Messenger 測試。

### 9.1 一般對話

```text
你好
```

確認：

- 不會出現 Internal error。
- 只進行一次簡短自我介紹。
- 不會在每一輪重新完整 Greeting。

### 9.2 RAG 精確問題

```text
115年期公益出租人的房屋稅相當稅率是多少？
```

確認：

- 有呼叫 `出租房屋租稅知識庫_診斷`。
- Tool invocation 成功。
- Tool 回應正常。
- Grounding 結果良好。
- 回答使用查詢結果，而不是模型自行猜測。

### 9.3 其他主題

```text
一般出租有哪些房屋稅規定？
社會住宅包租代管有什麼租稅優惠？
個人租賃住宅包租代管需要什麼條件？
房客可以申請哪些租金補貼？
```

### 9.4 找不到資料

使用一個 Data Store 沒有涵蓋的問題測試：

```text
請問我明年某一天一定會被核准哪一種稅率？
```

確認 Agent：

- 不會捏造答案。
- 說明現有資料不足或需要個案確認。
- 引導使用者查看官方資料或聯絡主管機關。

---

## 10. Messenger 前端設定

目前網站使用 Google 官方 `df-messenger` Web Component，不是 iframe。

目前設定位於 repository 根目錄的 `index.html`：

- CSS 在 `<head>`。
- Dialogflow Messenger JavaScript 在 `</body>` 前。
- `<df-messenger>` 元件在頁面底部。

主要設定：

```html
<df-messenger
  location="asia-northeast1"
  project-id="aerial-day-496714-v6"
  agent-id="9fb1cac6-62cd-40e6-8b13-eecf651f1f72"
  language-code="zh-tw"
  max-query-length="-1">
  <df-messenger-chat-bubble
    chat-title="出租房屋租稅小幫手"
    chat-subtitle="臺北市稅捐稽徵處"
    placeholder-text="請輸入您的問題，例如：公益出租人有何租稅優惠？"
    bot-writing-text="小幫手整理資訊中…"
    chat-width="430"
    chat-height="680"
    allow-fullscreen="small">
  </df-messenger-chat-bubble>
</df-messenger>
```

如果仍使用同一個 Agent、同一個 Region 與同一個 Language，Dialogflow Console 的一般 Playbook 或 Data Store 修改不需要修改前端。

只有在更換 Agent、Project、Region 或語言時，才需要同步檢查 `index.html`。

不要將 API key、Service Account key 或其他秘密憑證寫入前端 repository。Project ID 與 Agent ID 因為 Messenger 必須使用，會出現在公開 HTML 中；但秘密憑證不能放在前端。

---

## 11. 已知故障與處理方式

### 原 Data Store Tool binding state 異常

曾發生下列情況：

- 舊 Tool 表面上已綁定 Data Store。
- Data Store healthy。
- IAM 與 API 正常。
- Example 看似正常。
- 但只要 Default Playbook 掛上舊 Tool，連「你好」都會得到 `Internal error encountered.`。

經 A/B Test 後確認是原 Tool resource / Data Store binding state 異常，不是 Data Store 本身需要重建。

處理方式：

1. 保留原 Data Store。
2. 建立新的 Tool「出租房屋租稅知識庫_診斷」。
3. 新 Tool 連接同一個 `taipei-rental-tax-guide` Data Store。
4. Default Playbook 改掛新 Tool。
5. Instructions 內的 Tool reference 改成新 Tool。
6. RAG Example 改用新 Tool。
7. 以一般對話與 RAG 問題重新測試。

修復後一般對話與 RAG 均通過。除非是刻意診斷，不要把舊 Tool 重新掛回 Default Playbook，也不要刪除原 Tool 或 Data Store。

---

## 12. 每次雲端修改的標準流程

```text
先備份
  ↓
說明修改原因
  ↓
只修改一個主要項目
  ↓
儲存
  ↓
用 Simulator 測試一般對話
  ↓
用 Simulator 測試 RAG
  ↓
測試找不到答案的情況
  ↓
用 GitHub Pages 測試 Messenger
  ↓
記錄變更與測試結果
```

若修改涉及 Google Cloud Console，應先記錄：

1. 為什麼要修改。
2. 要修改哪個設定。
3. 可能風險。
4. 如何驗證成功。
5. 若失敗如何還原。

---

## 13. 最小驗收標準

視為基本鏈路正常，至少應符合：

- [ ] GitHub Pages 可以開啟。
- [ ] Messenger 可以開啟與輸入問題。
- [ ] 一般問候不會出現 Internal error。
- [ ] Default Playbook 使用正確的 Data Store Tool。
- [ ] 公益出租人稅率問題可以成功查詢。
- [ ] 一般出租、社會住宅包租代管、個人租賃住宅包租代管問題可以回答或正確引導。
- [ ] 找不到答案時不猜測。
- [ ] 回答使用臺灣繁體中文。
- [ ] 正式資格、稅率、期限與核定結果有適當的主管機關提醒。
- [ ] 變更後有保留備份與測試紀錄。

---

## 14. 目前優先順序

1. 維持現有前端與 Messenger 正常運作。
2. 維持 `出租房屋租稅知識庫_診斷` 的正常 RAG 鏈路。
3. 建立最小 RAG acceptance test。
4. 將 PoC 資料逐步替換為官方且經確認的知識來源。
5. 視需求再設計 Flow、Webhook、API、表單或正式資格判斷流程。

不要為了整理形式而重建 Data Store、刪除舊雲端資源，或大幅改寫目前可運作的前端。

