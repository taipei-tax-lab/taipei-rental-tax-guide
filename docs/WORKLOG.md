# WORKLOG — 重要歷史與證據索引

此文件只記錄發生過的變更、決策與有日期的證據。現況以 [PROJECT_STATE](PROJECT_STATE.md) 為準；執行指令以 [NEXT_TASK](NEXT_TASK.md) 為準。過去 Task 中的「待審查／未發布／下一步」等是當時的階段，不代表現在仍可執行。既有詳細文件保留。

| 日期 | 歷程／證據 |
| --- | --- |
| 09/08–09/17 | V2 改版由原 Next 靜態快照轉成零相依可重建網站，保留四方案及服務；PR #2、#3 等見 [V2 紀錄](v2-development.md)、[9/17 handoff](handoff/2026-09-17_出租房屋租稅優惠專區_HANDOFF.md)。 |
| 09/24 | 財產稅科核定文字／資源修正，PR [#8](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/8) 合併；[原 Task](../TASK_2026-09-24_PROPERTY_TAX_REVIEW.md)。 |
| 09/27 | 正式 CX Phase 5A、發布維護、快速導引層級及 Messenger 多站配置；PR #9–#12 已合併。[Phase 5A](../TASK_2026-09-27_PHASE5A_CX_RELEASE_GATE.md)、[維護](../TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md)、[UX](../TASK_2026-09-27_IMPECCABLE_UX_AUDIT.md)、[多站](../TASK_2026-09-27_MESSENGER_MULTISITE_CONFIG.md)。`experiment/impeccable-free-design` 是獨立設計實驗，非待合併功能。 |
| 09/29 | 房屋稅年期 runtime context v1，PR #13 已發布。[任務與驗收](../TASK_2026-09-29_HOUSE_TAX_PERIOD_CONTEXT_V1.md)。 |
| 10/02 | GA4 基礎與事件 v1，PR #14、#15 已發布，配置 Realtime 代表事件與 custom definitions；中文 Explore 報表延後。[原 Task](../TASK_2026-10-02_GA4_EVENT_TRACKING_V1.md)。 |
| 10/10–10/13 | CX 正式基準文件校正 PR #16；後端 10/13 四服務 runtime gate 4/4，另見 [後端現況](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d/docs/CX_CURRENT_PRODUCTION_ARCHITECTURE.md)。 |
| 10/21 | 外部箭頭去除 PR [#17](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/17)，main `d5fad9e`，Pages [成功](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/39564340362)。[原 Task](../TASK_2026-10-21_REMOVE_EXTERNAL_LINK_ARROWS.md)。一次性部署 ZIP [run](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/39565683012) 固定此 SHA，非最新功能交付包。 |
| 10/28 | [機關部署診斷](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/diagnostics/official-rentaltax-hosting-20261028/docs/hosting/2026-10-28_official_deployment_diagnosis.md) 及[資訊室處理清單](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/blob/diagnostics/official-rentaltax-hosting-20261028/docs/hosting/2026-10-28_it_remediation_checklist.md) 保留於診斷分支（未合併），CSP／WebP 404 為當日證據，未驗證修復。 |
| 10/31 | 隱藏 Messenger 捲動按鈕，PR [#18](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/pull/18)，main `28fd76a`、Pages 成功。功能擴充分支新增直接申請、操作影片、Cloudflare 測試 build 隔離 GA4、六入口與導覽、影片原生控制。`ea05b3e` 為最後已完整記錄 HTTPS 影片回歸的程式 SHA；63/63 tests、非 CX HTTPS 驗收與 33 assets 證據；實體 iPhone LINE 待驗收。見 [10/31 Task](../TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md)、[HTTPS evidence](evidence/2026-10-31-native-video-controls/native-controls-https.json) 及 [history/](history/)。 |
| 11/04 | feature `c6d9cee` → `51161da`，七次首頁排版修整。五張卡與插圖卡視覺尺寸匹配、desktop 六入口兩列、compact／左對齊、操作說明與所得達租金標準交換；最終 Cloudflare check success。僅來源 CSS/template 更新，原有 `index.html` 沒有同步。尚未取得新的完整驗收證據。 |
| 11/16 | 使用者指定延續現有 Cloudflare branch，先整理矛盾文件，不開始此次改版實作。校正既有發布狀態、測試證據邊界、PoC 與正式環境、11/4 最新來源與生成物差異；新增統一 Agent 入口與現行文件，保留原始紀錄。 |

## 已記錄的非阻擋維護 backlog

9/27 [維護 Task](../TASK_2026-09-27_POST_RELEASE_MAINTENANCE.md) 曾列出索引式房客服務分類、build 中 FAQ 硬編碼、`resources.slice(3)` 依賴順序、小幫手初始圖片請求、Messenger shadow DOM workaround、政策版本／核對日期語義等。尚未重新排定；依業務效益與改版範圍決定，不順手重構。SEO／CSP 等廣泛 hardening 亦未核定；機關實際 CSP 故障另依 10/28 診斷處理。
