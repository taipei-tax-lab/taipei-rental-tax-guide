# GA4 現行前端事件契約

2026-11-16：本輪增加以下入口意圖訊號。權威白名單與過濾器為 `assets/js/analytics.js`；10/2 Task 為歷史規格，不代表本輪線上 GA4 驗收。

| 操作 | event_name | service_id | destination_host |
| --- | --- | --- | --- |
| 首頁直接申請入口（含共用首頁區域） | direct_apply_open | 無 | 無 |
| 租金標準試算 | service_entry_click | income_standard_calculate | services.arpa.tpctax.dof.gov.taipei |
| 租金標準申請 | service_entry_click | income_standard_apply | services.arpa.tpctax.dof.gov.taipei |
| 線上申請 | service_entry_click | direct_apply_online | service.taipei |
| 親自申請 | service_entry_click | direct_apply_in_person | tpctax.gov.taipei |
| 郵寄/傳真 | service_entry_click | direct_apply_mail_fax | tpctax.gov.taipei |

沿用既有 `service_id`、`destination_host` custom dimensions，不新增 GA4 管理端設定或 key event。`income_standard` 保留白名單供歷史相容；新版 DOM 不再送整卡事件。其他 audience、plan、guide、CX 事件契約保持原樣。

新訊號只在原生 click 啟用時由共用委派 handler 送一次；鍵盤 Enter、觸控由瀏覽器產生同一個 click，不另綁 touchend 或 keydown。渲染、deep link、reload、history 不記 `direct_apply_open`；再次真實啟用則另記一次。外連 hostname 從實際 href 取得，不傳 URL、query、輸入或表單值。無 gtag 或 gtag 拋錯不影響導覽，不等待事件完成。

這些事件只代表入口點擊／申辦意圖，不代表完成申請。正式 Measurement ID、loader/config 未變。Cloudflare test build 持續移除 loader/config，不發 GA4 網路請求；此次僅以本地 mock gtag 驗證，未查看或修改管理端。見 [11/16 證據](evidence/2026-11-16-entry-redesign/REPORT.md)。
