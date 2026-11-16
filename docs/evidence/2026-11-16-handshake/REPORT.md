# 第四輪握手、補助款及入口背景

開工乾淨遠端 d2cf8d5。personal 使用袖口與中央交握輪廓；subsidy 使用大矩形鈔票、中央圓形票面及向下領取箭頭。其他十四圖 byte-for-byte 不變，新 fixture 由 git show 6e6d7fe:scripts/icons.mjs 產生，保留舊 fixture 與守門斷言。實際卡片尺寸已檢視。

CSS 僅增加兩頁 ID 加 v2-entry-content 的 transparent 規則；原 body 背景、圖片 bytes、快取、OG、模板、白底申請卡、播放器、比較及詳情遮罩均保留。index 由 build 生成。

70/70 單元、build / --check、performance budget、Pages build 33 檔、diff check PASS。visual-consistency 五寬度×100/200%、icon-refinement 的 hover / focus / touch / SVG bounds / 選中返回通過。entry-background-check 實測四入口、詳情／比較 computed colors、原 backdrop、白卡、播放器底色、版本切換與原生 controls、深連結／重整／返回及 1440/390/320×100/200% 無溢出。測試隔離第三方，不送 CX 或污染 GA4，不實播全部影片。

截圖只存 .preview/handshake；本報告只保存文字與 JSON。待推送後補精確部署及 HTTPS 複驗；雲端 Chromium 的既有 CA 信任限制需明列診斷模式，不能當實機／正式 TLS 驗收。辨識度仍待使用者看測試站，BX015、實機／輔助科技及業務人工待辦保留。


第四輪部署完成：bcb857dd1930bba814a5a5e2cc43ad2fdc59baa8，Cloudflare deploy 3edcb6fb-4d5b-44c8-bcc0-d979613d711d SUCCESS。HTTPS computed style、1440/390/320×兩字級、原生影片控制／切換與導航回歸 PASS；兩入口透明 rgba(0,0,0,0)，詳情／比較維持 rgba(255,254,251,0.96)，卡片白底及播放器 rgb(16,56,68) 保留。實際畫面已檢視。瀏覽器為憑證診斷模式；Node 正常 TLS 逐 bytes 核對線上 HTML/CSS/背景與本地一致。其他14圖、背景資產、模板、JS、政策及雲端設定不變。收尾只補文件，runtime不變；辨識度及實機等原有人工待辦仍保留。
