# PROJECT_STATE — 現行狀態

核對日期：2026-11-16（Asia/Taipei）。狀態：**視覺一致性改版已實作、推送、Cloudflare 測試站部署及回歸確認；待人工視覺／實機審查**。

## 11/16 前一輪申請入口實作

- 指定分支由乾淨遠端 `b55060aa536c2b8702e41daae25410b4bc8ed57a` 同步開始；未切換／另開分支。
- 首頁第六卡改 HTML 標題／試算／申請；四寬度與現行 Cloudflare 首頁基準的六卡 bounding box 逐項比對差異 <1px。三張管道卡只取代直接申請頁，原四方案、政策與其他頁面保留。
- 六項前端 GA4 映射已實作，白名單保留歷史值、只傳 hostname；test artifact 保持無 loader/config。[現行事件](GA4_EVENTS.md)。
- 修正短申請頁造成前後導覽閱讀位置被瀏覽器夾至舊頁底的問題，在目的頁 reflow 後還原已儲存座標；不因 history 額外送入口事件。
- `index.html` 已由來源重建、舊順序測試已校正；65/65 單元測試、建置一致性、performance budget 及本地四寬度入口／GA4／非 CX 驗收通過。完整命令及限制見 [本輪證據](evidence/2026-11-16-entry-redesign/REPORT.md)。
- 外部五網址：四個 HTTP 200、BX015 HTTP 404 但瀏覽器載入「申報房屋使用情形變更」與線上申辦內容；保留核定網址，發布前仍須人工確認。未填表／送件。瀏覽器以代理 TLS 診斷模式讀取，不代表正式 TLS 驗收。
- R2 metadata 顯示兩物件於 11/8 已由外部更新；本輪未修改物件／URL，僅更新既有影片測試的過期大小／時長快照。
- 程式 commit `f2d04d3108962ae7a6edbf7eb317afca051cc2c3` 已推送、Cloudflare check SUCCESS；真實 HTTPS 入口 layout／UX2／非 CX／GA4 隔離與影片回歸通過，完整結果見 report。桌機可見框另保留原插圖 92%×82% 內縮與圓角。iOS／Android／LINE 實機、真人／輔助科技、正式部署與真實 CX 問答仍待另案驗收。

## 版本與環境

| 項目 | 已核對基準 |
| --- | --- |
| Repo | `taipei-tax-lab/taipei-rental-tax-guide` |
| 指定開發分支 | `feat/direct-apply-operation-guide-20261031` |
| 歷史文件整理前開發基準 | `51161daf856ab6ede91f69077b1ed2e2971f315d`（2026-11-04） |
| main 最新已發布基準 | `28fd76aed2a212776fa5eade5eca18e02ff24701`（PR #18，2026-10-31） |
| 分支關係（文件整理前） | feature 領先 main 26 commits、落後 0；未合併，沒有待合併 PR |
| Cloudflare 測試（本輪實作） | [test site](https://rental-tax-guide-test.pages.dev/)，`346d24df57d8db4efca8376ebe717f71502289d0` 的 [Cloudflare Pages check](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/commit/346d24df57d8db4efca8376ebe717f71502289d0/checks) SUCCESS；部署 `8a04701f-9b6b-4ca5-96e8-e528e5cf1733`，使用既有 Git 整合 |
| GitHub Pages | [主線網站](https://taipei-tax-lab.github.io/taipei-rental-tax-guide/)，[10/31 部署成功](https://github.com/taipei-tax-lab/taipei-rental-tax-guide/actions/runs/41170372607)（main `28fd76a`） |
| 機關站 | [rentaltax](https://services.arpa.tpctax.dof.gov.taipei/rentaltax/)，獨立部署；未取得 10/28 診斷之後的修復／正式版本驗收證據 |

前次歷史文件校正已提交 `d18ae1d`；本次在其上提交需求文件。以上表格 SHA 為文件整理前核對的程式／發布基準，不將文件提交當成新的功能版本。每輪開工須再讀取實際 Git refs 及需要的部署證據。

## 已完成與剩餘驗證

| 功能／事項 | 證據與界線 |
| --- | --- |
| V2 方案／房客／比較／快速導引、所得達租金標準、AI 小幫手 | 已在 main 合併及 GitHub Pages 發布。 |
| 10/21 外部連結箭頭 | PR #17 已合併；45/45 為該輪測試。 |
| 10/31 Messenger 向下捲動按鈕 | PR #18 已合併及 Pages 部署成功；機關手機端無獨立驗收證據。 |
| 直接申請、操作說明、六入口、導覽定位、R2 橫式／直式影片 | feature 已實作及測試站發布；未合併 main；10/31 非 CX HTTPS 驗收及 63/63 tests 為 `ea05b3e`／文件交接 `1108957` 的歷史證據。 |
| 11/4 入口卡片排版 | 7 commits 修改 `site/template.html`／`assets/css/guide-v2.css`；最新來源順序：屋主、房客、直接申請、操作說明、直接問小幫手、所得達租金標準。Cloudflare check SUCCESS，未取得這 7 commits 的獨立全套回歸證據。 |
| 建置一致性（已修正） | 以下為修正前歷史：2026-11-16 在乾淨 `51161da` checkout 執行 `node scripts/build.mjs --check`，FAIL：`index.html is stale; run npm run build`。11/4 僅更新模板/CSS，未提交新生成 HTML；Cloudflare 自動 build 不代表 Git 內產物已更新。11/16 功能輪次已重建、--check PASS。 |
| 入口順序測試（已修正） | 靜態核對 `tests/ux2.test.mjs`、`scripts/ux2-browser-check.cjs` 仍斷言 10/31 舊入口順序（所得達租金標準第 4、操作說明第 6）；與 11/4 原始碼相反。後續應按核定入口順序修正斷言並保留鍵盤/DOM 順序驗證，不以刪除測試解決。11/16 功能輪次已校正順序並執行回歸。 |
| 真實影片實機 | iPhone LINE／Safari、Android 硬體未有完整驗收證據；10/31 Chromium 自動化驗證不等於實機 PASS。 |
| 正式站部署 | 前次診斷確認 CSP 通訊阻擋、九個 WebP 404、Google Fonts／data GIF CSP；不直接假定伺服器已修復。影片正式來源／MIME／Range/CSP 待核定及驗收。 |
| GA4 | main v1 已發布且 10/2 Realtime 代表事件曾驗證；Cloudflare test artifact 刻意不發 GA4。中文 Explore／管理報表尚待後續決定。 |
| 可用性／無障礙 | 已有部分桌機、手機 emulation、鍵盤等歷史檢查；真人首次使用、完整輔助科技、實機仍待確認。 |

## CX 界線

前端 `site/messenger.html` 使用機關 Tokyo Agent、首題直入 Rental Playbook，後端正式證據以 [CX framework 2026-10-13 verified baseline](https://github.com/taipei-tax-lab/dialogflow-cx-qa-framework/blob/63fa97d/config/current_production_baseline.json) 為準：Rental Playbook v3、Rental Official Docs Tool v1、七份 TXT；10/28 診斷曾唯讀核對 Production mapping。不是當日 GCP live GET 或私人 Messenger Integration 設定回讀。Cloudflare 測試站的真實 CX 問答不在最近功能驗收範圍；不因改前端而變更 GCP、R2 或網域授權。

## 前輪審查與本輪需求來源

指定分支推送與 Cloudflare 測試站複驗已完成；GPT 於 11/16 讀取實際差異、桌機／手機畫面、HTTPS 驗收紀錄與 Cloudflare check（`101f1a3` SUCCESS），獨立在同 SHA 重跑 build --check、65/65 單元測試、performance budget、Pages test build（33 檔／GA4 停用）皆 PASS。依使用者指示清除現行分支全部 49 張測試截圖（本輪 29、歷史 20），保留文字／JSON／log；未改 runtime。待人工審查；待確認項目及證據見本輪 report。未授權合併 main、正式發布或更改 CX／GA4 管理端／R2／部署設定。使用者現已核定十項視覺一致性改版（A 背景、主卡外框及圖示、直接申請三欄、四方案／房客圖示、標號與比較文案）。正式執行規格以 [NEXT_TASK.md](NEXT_TASK.md) 為準；需求交接時 A 圖置於 `assets/images/hero-taipei-a.webp`；本輪已接入 runtime，實作與驗證以下節為準，前輪實機／正式站等限制仍保留。


## 11/16 視覺一致性改版實作

由乾淨遠端 `bea4edb` 同步。核定 A 已成為 runtime WebP / PNG（兩格式全像素一致，含 CSS / OG 快取版本），原交接檔重複名稱移除；16 個自製 SVG 集中於 `scripts/icons.mjs`，六主卡同框、左圖示均可見，直接申請沿用房客三欄／手機單欄，四方案取消裝飾數字並保留 accent／選中外框，指定比較片語已修正。未改政策、五個服務 href、前端事件及 Messenger / media / CX / R2 / GA4 設定。

68/68 單元、建置一致性、WebP budget、33 檔隔離 Pages build、本地五寬度×100/200% 字級／同框與圖示／44px 按鈕、鍵盤／事件／history、36+12 捲動縮放及非 CX 前端回歸通過。標準 Chromium 對 R2 / Pages 的憑證信任遭環境阻擋；影片播放／seek／fullscreen 以明確 TLS 診斷模式通過，不等於正式 TLS 驗收。完整結果、限制、命令與本輪測試站狀態見 [視覺改版報告](evidence/2026-11-16-visual-consistency/REPORT.md)。完整來源 `346d24d` 已推送，Cloudflare GitHub check 及 API deploy stage 均 SUCCESS。HTTPS 的五寬度×兩字級／實際入口／UX2／六項 mock 事件／非 CX／GA4 隔離／影片回歸通過（Chromium 採明確 TLS 診斷模式）；Node 使用原有 CA 與正常 TLS 驗證，線上 HTML / CSS / A 雙格式 / 主要 JS 與本地 Pages build 逐 bytes 相同。首筆提交漏入模板已在 `346d24d` 補齊，不以不完整中間提交驗收。收尾僅補測試代理相容與證據文件，不變更 runtime；截圖只存 `.preview/`。實機、真人、輔助科技、BX015 及正式業務驗收的原有待辦保留。
