# AGENTS.md — 出租房屋租稅優惠專區

## 開工必讀

1. [README.md](README.md)：網站目的、維護來源與基本指令。
2. [docs/PROJECT_WORKFLOW.md](docs/PROJECT_WORKFLOW.md)：跨環境操作、驗證及發布界線。
3. [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md)：唯一現行狀態及已知限制。
4. [docs/NEXT_TASK.md](docs/NEXT_TASK.md)：唯一現行任務與授權範圍。
5. [docs/WORKLOG.md](docs/WORKLOG.md)：重要歷史、決策與證據索引；依任務需要追讀原始紀錄。

舊根目錄 `PROJECT_STATE.md`、日期式 `TASK_*.md`、`docs/history/` 與 PoC 文件均保留供追溯，不是當前執行指令。現行文件與過去快照矛盾時，以實際 Git、正式來源及有日期的驗證證據校正，不把舊的待發布狀態當現況。

## 專案界線

- 接續開發使用 `feat/direct-apply-operation-guide-20261031`（Cloudflare 測試站所連結的分支）；`main` 是 GitHub Pages 發布主線，機關站另行交付。未授權不新開分支、不合併 main、不改正式部署或 Cloudflare 設定。
- GitHub 是網站原始碼、設定、測試、文件與版本的權威來源；`site/content.json` 是網站方案內容來源，`site/template.html`、`site/messenger.html` 是模板來源，`site/media.json` 是影片網址來源。`index.html` 為生成結果，不直接手改。
- CX/GCP 正式設定及知識庫另由 `dialogflow-cx-qa-framework`／機關 GCP 管理。網站改版不自動更新 Data Store，也不修改 Agent、Playbook、Tool、Environment、網域限制、GA4 或 R2 物件；如任務確需變更另行核准。
- 不自行修改已核定租稅政策、資格、稅額、時點或申辦管道；不將個資、敏感資料或秘密憑證放入 Git、公開產物、測試輸出或未核准的模型。
- 影片位於現有 R2，此 Repo 不保存 MP4；目前未設定須同步的前端 Google Drive 鏡像，純 Repo 工作不掃描 Drive。
- 使用者尚未核定本次改版內容時，只能做已授權的盤點／文件修正，不自行開始功能開發。每輪收尾依 Workflow 更新狀態、檢查差異、在授權分支提交推送並核實遠端。
