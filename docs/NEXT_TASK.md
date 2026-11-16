# NEXT_TASK — 等待本次改版需求

狀態：**WAITING_FOR_USER_REQUIREMENTS**（2026-11-16）。

已確認：沿用 Cloudflare 現行測試分支 `feat/direct-apply-operation-guide-20261031`；先修正歷史／現行文件矛盾再討論改版，不進行功能開發，不合併 main，不改正式部署。使用者尚未提供改版內容，不擅自排定 UI、政策或 CX 改寫。

## 本階段（文件整理）

- [x] 核對 Git branch、main、11/4 來源變更、Cloudflare 與 GitHub Pages 歷史發布證據。
- [x] 校正文件中的已合併、待發布、PoC、測試站與機關站狀態矛盾。
- [x] 建立統一入口、狀態、任務、流程與歷史索引；原有 Task／歷史證據保留。
- [x] 記錄乾淨基準的 `index.html` build-check 失敗及兩支 UX2 測試仍斷言舊入口順序，不在純文件輪次修正生成物或測試。
- [ ] 待使用者提供新一輪改版需求，核定具體的修改項目及驗收條件後再更新本文件。

## 後續改版輪次的既知驗收前提（不是目前授權的實作清單）

接續最新 feature 來源，重新 build 及驗證生成物；按下一輪核定的入口順序同步 UX2 單元與 browser 斷言、維持原檢查強度。以實際需求決定測試範圍，保留既有核心功能及正式設定。已知 iPhone LINE 實機、機關 CSP/WebP/影片部署等待辦見 State；需要時再列入核定任務。整合 main 或正式部署另行授權。
