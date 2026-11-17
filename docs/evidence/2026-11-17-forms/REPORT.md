# 2026-11-17 房客獨立展收與書表

從乾淨遠端 4745bd7 fast-forward 開工。只覆寫房客 grid align-items:start，原生 details 多卡獨立開關，不新增 JS。直接申請三卡保留等高；下方精簡兩組列表、每組兩份表，四個書表格式連結與兩個範例 PDF 共六個，44px 目標、書名＋格式＋範例及新視窗可及名稱。資料單一來源 site/media.json/applicationForms；operationGuide、政策與既有五服務入口和事件不變。

公開下載：正常 TLS、無登入／簽名 GET 六 URL 均 200，實際 bytes 與核定一致，四 PDF %PDF 簽章、兩 ODT ZIP 簽章及內部 mimetype=application/vnd.oasis.opendocument.text、content.xml 驗證通過。原檔只存 .preview/forms，未納 Git 或 Pages。範例文字可見示範姓名、占位公司及序列式號碼；書表適用性／完整內容仍由業務確認，不改原檔。

73/73 單元 PASS（原70保留），正負路徑／兩組六href／格式及可及標籤，暫存副本實際 build 證明相對路徑可生成、非法路徑失敗。原影片測試 fixture 追加 applicationForms 保留原影片安全斷言；Pages 非 CX 檢查只更新末尾新增區塊的 class 預期。

build / --check / performance budget / Pages 33檔 / diff check PASS。瀏覽器1440/390/320×100/200字級，依序開A、B、關A、開C、關其餘，非操作卡 open及高度不變；直接申請等高／透明、六連結焦點順序、44px與無溢出驗證。原 entry checker 七控制項、五href與六mock事件、history/reload/no gtag PASS。第三方 CX/GA4隔離，不送題或表單。瀏覽器外部TLS使用雲端CA診斷模式，不當成正常TLS驗收；公開 GET 的正常TLS另外驗證。

README 記錄 staging正式相對路徑與建議ODT MIME／CSP另案。本輪不製作正式包、不變更R2或雲端、不merge main。辨識／實機／輔助科技、BX015與正式業務驗收待辦保留。待推送後補Cloudflare精確部署及線上驗證，交GPT審查。


第五輪部署：36afac160d85bb2db4ecc0ed4591ea426a3e08db，Cloudflare deployment 4b059506-b5e7-4fa3-a3c8-188bde401ea5 SUCCESS。實際測試站六個公開書表連結原生啟動通過，兩ODT完成下載（failure=null），四PDF新視窗HTTP200；桌機／手機100及200%字級、房客獨立高度／open狀態、焦點、直接申請等高透明通過。HTTPS非CX全站回歸／33資產MIME／私有路徑404／零GA4通過；BX015仍404待人工確認。正常TLS線上HTML/CSS逐bytes等同本地。瀏覽器使用明確CA診斷模式，不作正式TLS／實機背書。`node --use-env-proxy scripts/forms-public-check.mjs` 可重現正常TLS匿名六下載、精確大小／簽章與ODT內部結構檢查，只保存JSON；不存原檔。收尾僅補測試工具與文字證據，網站runtime不變，交GPT審查。
