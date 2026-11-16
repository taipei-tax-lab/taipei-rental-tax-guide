# NEXT_TASK — 2026-11-16 出租專區申請入口改版

狀態：**READY_FOR_IMPLEMENTATION**（2026-11-16，Asia/Taipei）。使用者已核定兩處 UI 改版，並授權本輪前端 GA4 埋點設計與實作；此文件為現行唯一任務。延續 Cloudflare 現行測試分支 `feat/direct-apply-operation-guide-20261031`，不可回到 main 或另開分支。前次文件校正已提交 `d18ae1d`。本輪需求文件提交不代表功能已完成。

## A. 首頁租金標準卡片

- [ ] 維持現行首頁六個卡片區域與順序（屋主、房客、直接申請、操作說明、直接問小幫手、租金標準）。原第六張插圖卡的外框尺寸、格線位置、圓角、間距及響應式行為維持不變；不要因加入子按鈕擴大外框或改動其他卡片。
- [ ] 原「所得達租金標準／申報優惠稅率專區」整張圖片入口改成真實 HTML 文字與控制項；第一排標題為「出租房屋達租金標準」（使用者原訊息「標題」依上下文校正為「標準」），第二排為左右並列、大小一致的兩個子按鈕。不可用文字圖片代替，不保留舊整張卡片連結、不可巢狀 anchor；外框只作容器。
- [ ] 左「試算」：https://services.arpa.tpctax.dof.gov.taipei/rentStandard/index.php?content=calculator
- [ ] 右「申請」：https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php

## B. 直接申請頁

- [ ] 首頁「直接申請／已了解方案？前往申辦」卡片外觀及既有內部導覽維持原樣；點入後將現有四方案入口改成三張等級一致、清楚可點選的卡片（依下列次序）。維持原頁回首頁／返回、導覽、深連結及 history 行為。
- [ ] 「線上申請」：https://service.taipei/case-detail/BX015 — 可加簡短輔助文字「前往市府線上申辦服務」。
- [ ] 「親自申請」：https://tpctax.gov.taipei/cp.aspx?n=EE558C7C1C627F29 — 可加「查詢各分處及交通資訊」。
- [ ] 「郵寄/傳真」：https://tpctax.gov.taipei/News_Content.aspx?n=1CDCF9E878CCDB8F&sms=EB055A67C769EB25&s=AAD268A00665CC03 — 可加「查詢各分處地址及傳真資訊」。
- [ ] 不修改其他頁面的四方案、比較、房客、快速導引、既有政策與申辦資源；新三張卡僅取代直接申請頁的入口，非刪除網站原方案。新連結集中於 `site/content.json`（與既有資料模型相容），透過模板／build 產出，避免多點硬編碼。精確保留 href 查詢參數（HTML 中 &amp; 正常解碼）；遵循現有外部連結開啟方式及無障礙語意；不加已被移除的外連右上箭頭。

## C. GA4 前端事件

就本次兩個使用流程做最小有用的事件設計：沿用既有 `assets/js/analytics.js` 白名單／安全包裝與現有 GA4 配置；新增入口事件及擴充既有 `service_entry_click` 的 service_id 枚舉，沿用既有 custom dimensions `service_id`、`destination_host`，不新增管理端維護負擔。

| 使用者行為 | event_name | service_id | destination_host |
| --- | --- | --- | --- |
| 首頁點擊直接申請 | direct_apply_open | — | — |
| 租金標準－試算 | service_entry_click | income_standard_calculate | services.arpa.tpctax.dof.gov.taipei |
| 租金標準－申請 | service_entry_click | income_standard_apply | services.arpa.tpctax.dof.gov.taipei |
| 直接申請－線上申請 | service_entry_click | direct_apply_online | service.taipei |
| 直接申請－親自申請 | service_entry_click | direct_apply_in_person | tpctax.gov.taipei |
| 直接申請－郵寄/傳真 | service_entry_click | direct_apply_mail_fax | tpctax.gov.taipei |

- [ ] 一次真實啟用只送一次該自訂事件；支援滑鼠、觸控、鍵盤正常啟用。不得因渲染、回到上一頁、重新整理、直接進入 deep link 而重送 `direct_apply_open`。保留原 `income_standard` 允許值供歷史相容，但新子按鈕不再記舊整卡事件；移除或修正舊整卡 selector／handler，防雙重記錄。
- [ ] destination_host 取實際 href 的 hostname，不送完整 URL、query、使用者輸入、身分或表單值。此等事件代表入口點擊／申辦意圖，不代表完成申請；不宣稱轉換成功或新增 GA4 管理端 key event。保留既有其他事件、loader、Measurement ID、安全過濾及無 gtag 時正常導覽（不等待追蹤再跳轉）。
- [ ] 既有 Cloudflare test build 仍移除 GA4 loader／config，不發正式 GA4 請求；只在本地 mock gtag 驗證新事件。正式 GA4 管理設定、GCP/CX、R2、網域與部署配置均不在本輪授權。操作說明等未修改功能沿用原有追蹤，不額外擴大埋點範圍。

## D. 設計與可用性

- [ ] 使用現有深青色、淺青綠邊框、背景／字級、間距、圓角、輕陰影與既有 icon 系統。子按鈕是同一卡片中的對等操作，視覺層級清晰；三張申辦方式卡片採現有設計語言，簡潔而適合長者。可用既有或相容的線性 SVG 裝飾圖示，不增加外部依賴／圖片。
- [ ] 桌機維持六入口原格線，手機三張申辦方式卡片可依既有響應式策略疊排；各操作目標易辨識、可鍵盤依序到達、焦點可見、語意標籤完整、文字不被裁切，320px 寬亦無水平溢出。若外部新分頁，遵循既有安全 rel 及可及提示。圖示不得取代可讀標籤。
- [ ] 首頁以前後相同 viewport 的 bounding box／截圖比對外框尺寸及鄰近卡片；六張邏輯卡片仍存在，原五張入口＋兩個子連結共七個主要可操作元素，DOM／鍵盤順序與畫面一致。不得藉隱藏溢出或壓過小字達成尺寸。

## E. 驗證與完成條件

- [ ] 開工讀 AGENTS、Workflow、State、Task、Worklog，核對實際分支、HEAD、遠端及工作樹；保留使用者變更。記錄現行 Cloudflare UI／原方案基準再改。
- [ ] 由 `site/template.html`、`site/content.json`、`scripts/build.mjs`、`assets/css/guide-v2.css`、`assets/js/guide-ui.js`、`assets/js/analytics.js` 等實際結構決定最小必要差異；生成物 `index.html` 以 build 更新，不手改。既有圖片資源不任意刪除。
- [ ] 修正前次已知建置失同步：`npm run build`，`node scripts/build.mjs --check` 必須 PASS；更新 `tests/ux2.test.mjs`、`scripts/ux2-browser-check.cjs` 及其他實際受影響測試（舊入口順序、整卡單連結／四方案入口斷言），保持原驗證強度，不單純移除斷言。執行 `npm test`、既有相關 browser check 及 Cloudflare test build，記錄指令和結果。
- [ ] 瀏覽器驗證桌機、768px、390px、320px；確認兩個子按鈕、三卡、五個精確 URL、正常前後導覽與回上一頁、focus／keyboard、無水平溢出及其他原有功能。附新舊主要畫面截圖／尺寸證據。以 mock gtag 驗證六項映射、只送一次、無額外敏感參數、未裝 gtag 仍可用，並確認 test build 不送 GA4。
- [ ] 五個外部網址均做唯讀檢查（不填表、不送件）。規劃時四個連結可讀；BX015 以網頁檢索取得 404，未證實正常瀏覽器也失效；請用實際瀏覽器複查、記錄最終 URL／畫面及可用性。若仍 404、權限／網路限制，保留使用者指定 URL，不擅自換址，列為發布前人工確認項目；不得假報 PASS。
- [ ] 所有既有未改動功能保留：方案、房客、比較、快速導引、CX、小幫手、R2 影片；不因本輪要求更改機關正式資料或實施額外重構。既有尚未取得實機、機關部署證據者仍列待確認。
- [ ] README 若功能描述過時，更新相關段落；更新 GA4 現行事件說明（與舊事件歷史文件區隔）、State／Task／Worklog，區分程式完成、自動測試、Cloudflare 真實驗證、人工驗收。檢查 diff、敏感資料、生成物及文件一致性後，將本輪變更 commit/push 至指定分支並核對 GitHub 遠端；現有 Cloudflare Git 整合若自動建置，記錄 check 與測試站驗證情況，不另外修改部署配置。不 merge main、不正式部署。交付 commit、測試結果、截圖／證據及剩餘限制供審查。
