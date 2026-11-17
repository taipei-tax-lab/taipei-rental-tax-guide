# 第六輪：書表、名稱與 RWD

開工乾淨遠端 843534d，安全 fast-forward 指定分支。原73項回歸全部保留。

## 修正與問題清單

| 頁面／情境 | 原因與修正 | 前後量測 |
| --- | --- | --- |
| 直接申請書表，1440/1024px、100% | group padding 22→16px，列12→8px，上方距32→24px；不縮字或操作目標 | 414.5625→358.5625px，減13.51% |
| 書表，768px、100% | 同上；保留長書名旁格式按鈕，不為壓低高度硬裁切 | 451.34375→395.34375px，減12.41% |
| 書表，390/320px、100% | 手機原堆疊保留 | 817.46875→761.46875px，減6.85% |
| 六格式按鈕，全寬度／輸入方式 | 原按鈕沒有與試算／申請共用底色，hover 未限定 fine pointer。共用既有淺綠底、深青字、細框、6px圓角及 fine-hover 反色；保留各自尺寸 | 六個 computed styles 均同既有 service action；hover深青白字、focus-visible及touch無黏滯PASS |
| 第六主卡，窄版／200% | 更正為「出租房屋所得達租金標準」，原 two-span 保留自然換行，增加 max-width:100% 上限；六卡仍等框，不縮文字 | 212組矩陣含標題文字 range 完整落於外框 |
| 格式群，極窄／放大 | 群組允許換行並限制於父寬度；不改桌機書名旁按鈕布局 | 212組無橫溢出或可見子容器scrollWidth裁切 |

開工原版212組也未找到額外全站橫溢出／可見子容器裁切；沒有藉此重做其餘版型。新增標題上限與格式群換行是本輪長名稱／按鈕的局部容納措施，不聲稱修復原版不存在的全域缺陷。未使用全域 overflow-x:hidden。

## 範圍與證據

真正runtime變更僅 CSS、模板第六卡標題、重建index。圖示／背景bytes／cache／OG、media書表來源、影片URL、業務內容、服務連結、UI/GA4/Messenger JS及雲端設定皆不變。原exact-title測試按新名稱更新，其餘斷言保留。

- [改前矩陣](before.json)、[改後矩陣](after.json)：代表320/390/414/768/1024/1440 ×100/200%覆蓋13路由；380/381、700/701、1099/1100與844×390橫向抽樣四重點路由，共212組。首頁、四方案、導引、房客、申請、影片、比較、FAQ與資源／頁首尾。檢查真實layout、文件寬與可見子容器scrollWidth；長標題range在卡框內。非實體裝置。
- [格式按鈕](controls-local.json)：六按鈕正常／hover比對試算申請、焦點順序及touch非黏滯。
- [房客／書表](forms-local.json)：1440/390/320×100/200%、獨立details、申請等高／透明、44px、六個原生R2操作，兩ODT下載成功與四PDF 200。
- [事件與導航](events-local.json)：七控制項、五既有href、六mock事件、無gtag導覽、history/reload PASS。UX2與既有五寬度visual checker PASS。
- [捲動縮放](scroll-local.json)：36 viewport/zoom-equivalent、12 Chromium原生page zoom及深連結／重整／resize／返回PASS。
- [小幫手](chat-mock.json)：vendor DOM mock、第三方阻擋；執行本站真實geometry adapter及開合、輸入框定位，涵蓋1440/1024/768/390/320、橫向與鍵盤矮視窗。沒有測真實CX或保證Google vendor UI/實機。
- [單元](tests.txt)73/73、build/--check、[budget](budget.txt)、[Pages](pages.txt)33檔、diff PASS；[正常TLS公開六書表](public.json)匿名200、大小／PDF簽章／ODT內部mimetype/content驗證PASS，不存原檔。

重現：先build-pages-test，PORT=4175 serve --pages-test。node scripts/rwd6-check.cjs（--baseline保存改前）、node scripts/rwd6-controls.cjs、node scripts/rwd6-chat-check.cjs；其他既有scripts依README設定Chromium。畫面全部只在.preview/rwd6，未提交。瀏覽器外部TLS需明列診斷模式，正常TLS另以Node讀回；不送CX或GA4、不送件。

待本輪推送後補精確Cloudflare SHA及HTTPS複驗。BX015、實體手機／輔助科技、業務／機關驗收保留；交GPT／使用者審查，未合併main或製作正式部署。
