# TASK_2026-09-24_PROPERTY_TAX_REVIEW

## Goal

依財產稅科最新修正稿 `督導網頁-新1150922.pdf`，更新「出租房屋租稅優惠專區」的文字與指定連結。

本檔為本輪實作的**唯一核定修改清單**。除下列項目外，不要主動改寫、統一用語、補政策內容或調整 UI。

---

## 0. User-confirmed corrections after PDF review

These two corrections supersede the literal PDF reading:

1. **Page 2｜FAQ「包租與代管，有什麼不同？」第一行**
   - Before: `房東簽訂包租約後`
   - After: `房東簽訂租約後`
   - Action: 刪除「包」字。

2. **Page 8｜個人租賃住宅包租代管｜適合誰？**
   - Before: `並能簽訂一年以上住宅使用租約`
   - After: `並簽訂一年以上住宅使用租約`
   - Action: 刪除「能」字。

---

## 1. Page 1｜首頁「屋主方案」

### 1.1 一般出租｜房屋稅摘要
- 在「適用稅率」後補句號。
- 僅補標點，不改其他句意。

### 1.2 個人租賃住宅包租代管｜首頁方案文字
- 將「並應簽訂一年以上住宅使用租約」改為：
  - `並簽訂一年以上住宅使用租約`
- 如果現行內容是「並能簽訂…」，也應依本輪核定結果改成「並簽訂…」。

### 1.3 個人租賃住宅包租代管｜地價稅摘要
- 目標文字：`減徵 40%，每屋減徵稅額以1萬元為上限`

---

## 2. Page 2｜常見問題、聯絡方式

### 2.1 FAQ「包租與代管，有什麼不同？」
- `房東簽訂包租約後` → `房東簽訂租約後`
- `協助房東出租住宅給房客` → `協助房東將住宅媒合並出租給房客`

### 2.2 FAQ「本市一般租金標準？」
- `公告土地現值總額` → `公告土地現值`

### 2.3 同一 FAQ 下方資源連結
- 刪除：`114年度房屋及土地之「當地一般租金標準」`
- 保留租金標準試算入口。

### 2.4 官方申辦與聯絡方式
- `臺北市稅捐處聯絡資訊與服務據點` → `稅捐處聯絡資訊與服務據點`

---

## 3. Page 3｜房客服務入口

### 3.1 「我有租屋／設備問題」說明
- `請依需求找下列窗口` → `請依問題找下列窗口`

### 3.2 「包租代管承租資格與洽詢」主管機關文字
- 改為：`臺北市政府都市發展局`
- 不要保留多餘的「包租代管」字樣。

### 3.3 「我要找包租代管房屋」新增資源
- Title: `臺北市住宅及都市更新中心`
- URL: `https://thurc.org.taipei/ThurcTaipei/Portal/AssetManagement`
- 原「國家住宅及都市更新中心」保留；這是新增，不是取代。

---

## 4. Page 4｜四方案完整比較

### 4.1 一般出租｜主要門檻
- `出租供住宅使用` → `房屋出租供住宅使用`

### 4.2 公益出租人｜主要門檻
- 刪除 `並經直轄市、縣(市)主管機關認定者` 或現行對應的主管機關認定片段。
- 只刪本輪指定片段，不主動重寫其他資格文字。

### 4.3 個人租賃住宅包租代管｜主要門檻
- 把「一年以上」條件明確改為：`租期一年以上`

### 4.4 個人租賃住宅包租代管｜綜合所得稅
- `6,001元～20,000元` → `6,001元～2萬元`
- 本段所有 `扣除必要費用` → `減除必要費用`
- 新增：`向國稅局申報；請保存租約、租金及相關資料。`

---

## 5. Page 5｜一般出租詳細頁

### 5.1 完整適用條件第 1 點
- `出租供住宅使用` → `房屋出租供住宅使用`

### 5.2 完整適用條件第 2 點
- `逾期申請者自次年(期)起適用` → `逾期申請者自次期起適用`

### 5.3 下一步按鈕
- `開啟官方租金標準試算` → `開啟租金標準試算`

---

## 6. Page 6｜公益出租人詳細頁

### 6.1 完整適用條件第 1 點
- 刪除 `並經直轄市、縣(市)主管機關認定者` 或現行對應的主管機關認定片段。

### 6.2 可先準備的資料
- `身分證` → `身分證號`
- 若現行句為 `租賃契約（*應載明出租人姓名及身分證）`，改為 `租賃契約（*應載明出租人姓名及身分證號）`。

---

## 7. Page 7｜社會住宅包租代管詳細頁

### 7.1 下一步按鈕／連結文字
- 刪除「計畫」二字。
- 例如：`屋主洽詢租屋服務事業計畫業者` → `屋主洽詢租屋服務事業業者`

### 7.2 建議辦理順序第 4 點
- 整句改為：`業者完成媒合與簽約，並協助後續管理。`

### 7.3 可先準備的資料
- `合作業者要求的申請文件` → `業者要求的申請文件`

### 7.4 適用期間與注意事項
- `117年期稅率1%` → `117年期起稅率1%`

---

## 8. Page 8｜個人租賃住宅包租代管詳細頁

### 8.1 適合誰？
- User-confirmed:
  - `並能簽訂一年以上住宅使用租約` → `並簽訂一年以上住宅使用租約`
- 如果現行網站是「並應簽訂…」，同樣改成 `並簽訂一年以上住宅使用租約`。

### 8.2 完整適用條件第 1 點
- 把「一年以上」明確寫為：`租期一年以上`

### 8.3 綜合所得稅
- `6,001元～20,000元` → `6,001元～2萬元`
- 本區所有 `扣除必要費用` → `減除必要費用`
- 新增：`向國稅局申報；請保存租約、租金及費用相關資料。`

---

## 9. Deliberate differences: DO NOT normalize

1. Page 5 一般出租指定 `逾期申請者自次期起適用`；Page 8 PDF 未指示把既有 `自次年(期)起適用` 改成相同文字。不要自行統一。
2. Page 4 比較表提醒為 `向國稅局申報；請保存租約、租金及相關資料。`；Page 8 詳細頁提醒為 `向國稅局申報；請保存租約、租金及費用相關資料。`。兩者「費用」不同，請忠實保留。

---

## 10. Implementation guidance

- 優先修改 `site/content.json`。
- FAQ、房客資源、聯絡方式若不在 `site/content.json`，搜尋其他 source 檔。
- `index.html` 是 build 產物，不要直接當 source 手改。
- 完成 source 修改後執行 build 更新 generated output。

### Scope exclusions
- 不改 Desktop / Mobile layout。
- 不改第 4 張「所得達租金標準」入口設計。
- 不改 CSS，除非文字變更造成明確 regression 且先回報。
- 不改 favicon、Hero、Messenger、Assistant images/preload、Dialogflow CX、GCP、效能架構。
- 不改未指定的政策文字或 URL。

---

## 11. Verification checklist

### Content assertions
- 核定 Before 字串應刪除者已不存在。
- After 新字串存在於正確 section。
- `臺北市住宅及都市更新中心` 新連結存在且 URL 正確。
- `國家住宅及都市更新中心` 仍存在。
- `114年度房屋及土地之「當地一般租金標準」` 連結不存在。
- Page 4 / Page 8 所得稅提醒保持各自核定 wording。

### Build / tests
- `npm run build`
- `npm test`
- `node scripts/performance-budget.mjs`
- `git diff --check`
- 若環境可跑 Chrome：`python scripts/messenger-regression.py`

### Targeted browser smoke
- Desktop 1440×900
- Mobile 390×844
- 無文字截斷／異常 overflow
- pageerror = 0
- console.error = 0

---

## 12. Git workflow

1. 從最新 `main` 建立 `fix/2026-09-24-property-tax-content`。
2. 完成修改與測試。
3. 更新 `PROJECT_STATE.md`：status → `IMPLEMENTED_AWAITING_REVIEW`，並記錄 branch、implementation commit SHA、changed files、test results。
4. 建議 commit message：`fix: apply latest property tax content review`。
5. Push branch。
6. **不要開 PR。不要 merge main。**
7. 停止並回報 ChatGPT Review。

---

## 13. ChatGPT review result (2026-09-24)

Status: **PASS / APPROVED FOR PR**

Verified directly on GitHub:
- Branch: `fix/2026-09-24-property-tax-content`
- Implementation commit: `24c08736a13057df5b04b7f5c8490f7e366a88d5`
- State update commit: `7f3ad18cccdafa856263dc7bc86abc175251a664`
- Branch is ahead of `main` by 2 commits and behind by 0.
- Approved PDF edits and the two user-confirmed corrections are present in source and generated output.
- Deliberate wording differences were preserved.
- No unrelated UI / responsive / Messenger / image / performance changes were introduced.

## 14. Next action: release

AntiGravity 2.0 may now:
1. Re-run build/tests.
2. Open PR from `fix/2026-09-24-property-tax-content` to `main`.
3. Merge via **Standard Merge Commit** only.
4. Wait for GitHub Pages to build.
5. Run a targeted production content smoke test.
6. Update `PROJECT_STATE.md` to `RELEASED` with PR / merge / Pages / production verification data.
7. Commit and push the final state update to `main`.
8. Stop.

Do not:
- squash
- rebase
- force push
- delete historical branches
- perform extra content rewriting
- make any UI polishing changes
