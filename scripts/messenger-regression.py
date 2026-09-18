"""
Messenger UI & Layout Regression Test Suite (Python Playwright + Chrome)
Validates:
1. Favicon: tpctax-mark.png, image/png
2. 租金標準專區快捷按鈕 (income-standard-launcher):
   - 元素存在、href、target="_blank"、rel (noopener noreferrer)、aria-label、img
   - computed position: fixed, zIndex: 9997, df-messenger zIndex: 9999
   - Chat closed: shortcut 在 bubble 上方，gap 8～18px，右側對齊 diff <= 3px
   - 捲動測試: window.scrollTo 前後 top diff <= 1px, right diff <= 1px
   - Chat open: chat window 覆蓋 shortcut，elementFromPoint 不命中 shortcut，點擊無穿透
3. 提醒完整顯示: notice.scrollHeight <= notice.clientHeight + 1
4. notice 永遠在 details 外: !details.contains(notice)
5. assistant / chat gap: abs(chatRect.left - panelRect.right) <= 1px
6. assistant / chat top / bottom 對齊: difference <= 1px
7. Viewport matrix (1440x900, 1280x800, 1024x768, 768x1024, 390x844, 320x480, 390x360)
8. Zoom matrix (100%, 125%, 150%)
9. 沒有 horizontal overflow: scrollWidth <= innerWidth
10. 0 console / page errors
"""

import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PREVIEW_URL = "http://127.0.0.1:4173/"

def test_messenger_regression():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        page.goto(PREVIEW_URL, wait_until="networkidle")
        page.wait_for_function("() => document.querySelector('.assistant-panel')?.dataset.topicsBound === 'true'")

        # 1. Favicon checks
        favicon_href = page.evaluate("() => document.querySelector('link[rel*=\"icon\"]')?.href")
        favicon_type = page.evaluate("() => document.querySelector('link[rel*=\"icon\"]')?.type")
        assert "tpctax-mark.png" in (favicon_href or ""), f"Favicon must link to tpctax-mark.png, got {favicon_href}"
        assert favicon_type == "image/png", f"Favicon type must be image/png, got {favicon_type}"

        # 2. Income standard floating launcher checks (Chat closed)
        launcher_attrs = page.evaluate("""() => {
            const l = document.querySelector('.income-standard-launcher');
            const img = l?.querySelector('img');
            const df = document.querySelector('df-messenger');
            const lCS = l ? getComputedStyle(l) : null;
            const dfCS = df ? getComputedStyle(df) : null;
            return {
                exists: !!l,
                href: l?.href,
                target: l?.target,
                rel: l?.rel,
                ariaLabel: l?.getAttribute('aria-label'),
                imgSrc: img?.getAttribute('src'),
                imgAlt: img?.getAttribute('alt'),
                position: lCS?.position,
                zIndex: lCS?.zIndex,
                dfZIndex: dfCS?.zIndex,
            };
        }""")
        assert launcher_attrs["exists"], "Missing .income-standard-launcher element"
        assert launcher_attrs["href"] == "https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php", \
            f"Unexpected href: {launcher_attrs['href']}"
        assert launcher_attrs["target"] == "_blank", f"target must be _blank, got {launcher_attrs['target']}"
        assert "noopener" in launcher_attrs["rel"] and "noreferrer" in launcher_attrs["rel"], \
            f"rel must contain noopener and noreferrer, got {launcher_attrs['rel']}"
        assert launcher_attrs["imgSrc"] == "./assets/images/income-standard-launcher.png", \
            f"img src unexpected: {launcher_attrs['imgSrc']}"
        assert launcher_attrs["imgAlt"] == "所得達租金標準申報優惠稅率專區", \
            f"img alt unexpected: {launcher_attrs['imgAlt']}"
        assert launcher_attrs["position"] == "fixed", f"Launcher position must be fixed, got {launcher_attrs['position']}"
        assert launcher_attrs["zIndex"] == "9997", f"Launcher z-index must be 9997, got {launcher_attrs['zIndex']}"
        assert launcher_attrs["dfZIndex"] == "9999", f"df-messenger z-index must be 9999, got {launcher_attrs['dfZIndex']}"

        # 3. Scroll test (Chat closed)
        pre_scroll = page.evaluate("() => document.querySelector('.income-standard-launcher')?.getBoundingClientRect()")
        page.evaluate("() => window.scrollTo(0, document.documentElement.scrollHeight)")
        time.sleep(0.2)
        post_scroll = page.evaluate("() => document.querySelector('.income-standard-launcher')?.getBoundingClientRect()")
        page.evaluate("() => window.scrollTo(0, 0)")
        time.sleep(0.2)
        assert abs(post_scroll["top"] - pre_scroll["top"]) <= 1.0, \
            f"Scroll test failed: top diff is {abs(post_scroll['top'] - pre_scroll['top'])}"
        assert abs(post_scroll["right"] - pre_scroll["right"]) <= 1.0, \
            f"Scroll test failed: right diff is {abs(post_scroll['right'] - pre_scroll['right'])}"

        # 4. Viewport matrix for chat closed: gap and alignment
        test_viewports = [
            (1440, 900),
            (1280, 800),
            (1024, 768),
            (768, 1024),
            (390, 844),
            (320, 480),
            (390, 360)
        ]

        for w, h in test_viewports:
            page.set_viewport_size({"width": w, "height": h})
            time.sleep(0.2)
            geom = page.evaluate("""() => {
                const l = document.querySelector('.income-standard-launcher');
                const df = document.querySelector('df-messenger');
                const bubble = document.querySelector('df-messenger-chat-bubble');
                const btn = bubble?.shadowRoot?.querySelector('button.bubble');
                const lRect = l?.getBoundingClientRect();
                const dfRect = df?.getBoundingClientRect();
                const btnRect = btn?.getBoundingClientRect();

                const bubbleTop = (btnRect && btnRect.height > 0) ? btnRect.top : (dfRect ? dfRect.top : null);
                const bubbleRight = (btnRect && btnRect.width > 0) ? btnRect.right : (dfRect ? dfRect.right : null);

                return {
                    lRect: lRect,
                    bubbleTop: bubbleTop,
                    bubbleRight: bubbleRight,
                    gap: (bubbleTop !== null && lRect) ? (bubbleTop - lRect.bottom) : null,
                    rightDiff: (bubbleRight !== null && lRect) ? Math.abs(bubbleRight - lRect.right) : null,
                    overflow: document.documentElement.scrollWidth - window.innerWidth
                };
            }""")
            assert geom["gap"] is not None, f"Could not measure gap at {w}x{h}"
            assert 8.0 <= geom["gap"] <= 18.0, \
                f"Shortcut gap with bubble must be 8-18px at {w}x{h}, got {geom['gap']}"
            assert geom["rightDiff"] <= 3.0, \
                f"Shortcut right-alignment diff with bubble must be <= 3px at {w}x{h}, got {geom['rightDiff']}"
            assert geom["overflow"] <= 0, \
                f"Horizontal overflow detected at {w}x{h} (closed): {geom['overflow']}px"

        # 5. Open chat and test layering, elementFromPoint, and click-through
        page.set_viewport_size({"width": 1440, "height": 900})
        time.sleep(0.3)
        page.evaluate("() => document.querySelector('df-messenger-chat-bubble')?.openChat()")
        time.sleep(0.6)

        # A. Layering & elementFromPoint
        layering = page.evaluate("""() => {
            const l = document.querySelector('.income-standard-launcher');
            const bubble = document.querySelector('df-messenger-chat-bubble');
            const chat = bubble?.shadowRoot?.querySelector('.chat-wrapper');
            const lRect = l?.getBoundingClientRect();
            const cRect = chat?.getBoundingClientRect();

            const centerX = lRect.left + lRect.width / 2;
            const centerY = lRect.top + lRect.height / 2;
            const hit = document.elementFromPoint(centerX, centerY);

            return {
                covered: (cRect && lRect) ? (
                    cRect.left <= lRect.left &&
                    cRect.right >= lRect.right &&
                    cRect.top <= lRect.top &&
                    cRect.bottom >= lRect.bottom
                ) : false,
                hitTag: hit?.tagName,
                hitLauncher: hit === l || l?.contains(hit)
            };
        }""")
        assert layering["covered"], "Chat window must fully cover the shortcut button when open"
        assert not layering["hitLauncher"], f"elementFromPoint at shortcut center must not hit shortcut, got {layering['hitTag']}"

        # B. Click-through protection check
        new_pages = []
        context.on("page", lambda p: new_pages.append(p))
        lRect = page.evaluate("() => document.querySelector('.income-standard-launcher').getBoundingClientRect()")
        page.mouse.click(lRect["left"] + lRect["width"] / 2, lRect["top"] + lRect["height"] / 2)
        time.sleep(0.3)
        assert len(new_pages) == 0, "Click over chat window unexpectedly triggered underlying shortcut!"

        # 6. Viewport and zoom matrix with Chat Open
        zoom_levels = [1.0, 1.25, 1.5]

        for w, h in test_viewports:
            page.set_viewport_size({"width": w, "height": h})
            time.sleep(0.3)

            for zoom in zoom_levels:
                cdp = context.new_cdp_session(page)
                cdp.send("Emulation.setPageScaleFactor", {"pageScaleFactor": zoom})
                time.sleep(0.2)

                m = page.evaluate("""() => {
                    const bubble = document.querySelector('df-messenger-chat-bubble');
                    const chat = bubble?.shadowRoot?.querySelector('.chat-wrapper');
                    const panel = document.querySelector('.assistant-panel');
                    const extras = chat?.querySelector('df-messenger-chat')?.shadowRoot?.querySelector('.rental-input-extras');
                    const notice = extras?.querySelector('p');
                    const details = extras?.querySelector('details');
                    const input = chat?.querySelector('df-messenger-chat')?.shadowRoot?.querySelector('df-messenger-user-input');

                    const c = chat ? chat.getBoundingClientRect() : null;
                    const p = (panel && !panel.hidden) ? panel.getBoundingClientRect() : null;

                    return {
                        panelVisible: !!(panel && !panel.hidden),
                        chatLeft: c ? c.left : null,
                        panelRight: p ? p.right : null,
                        gap: (c && p) ? (c.left - p.right) : null,
                        topDiff: (c && p) ? Math.abs(p.top - c.top) : null,
                        bottomDiff: (c && p) ? Math.abs(p.bottom - c.bottom) : null,
                        noticeInDetails: details && notice ? details.contains(notice) : false,
                        noticeScrollHeight: notice ? notice.scrollHeight : 0,
                        noticeClientHeight: notice ? notice.clientHeight : 0,
                        inputVisible: input ? (input.offsetParent !== null) : false,
                        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth
                    };
                }""")
                cdp.send("Emulation.setPageScaleFactor", {"pageScaleFactor": 1.0})

                # A. 提醒完整顯示
                assert m["noticeScrollHeight"] <= m["noticeClientHeight"] + 1, \
                    f"Notice clipped at {w}x{h} zoom={zoom}: scroll={m['noticeScrollHeight']} client={m['noticeClientHeight']}"
                # B. notice 永遠在 details 外
                assert not m["noticeInDetails"], f"Notice must not be inside details at {w}x{h} zoom={zoom}"
                # C & D. Assistant panel gap and top/bottom alignment when visible
                if m["panelVisible"]:
                    assert abs(m["gap"]) <= 1.0, f"Assistant/chat gap exceeds 1px at {w}x{h} zoom={zoom}: gap={m['gap']}"
                    assert m["topDiff"] <= 1.0, f"Top difference exceeds 1px at {w}x{h} zoom={zoom}: diff={m['topDiff']}"
                    assert m["bottomDiff"] <= 1.0, f"Bottom difference exceeds 1px at {w}x{h} zoom={zoom}: diff={m['bottomDiff']}"
                # E. 沒有 horizontal overflow
                assert m["horizontalOverflow"] <= 0, f"Horizontal overflow detected at {w}x{h} zoom={zoom}: {m['horizontalOverflow']}px"

        # 7. Notice geometry stress check (synthetic DOM manipulation)
        page.set_viewport_size({"width": 1024, "height": 768})
        for count, text_len in [(0, 0), (1, 30), (1, 600), (6, 200)]:
            page.evaluate(f"""() => {{
                const bubble = document.querySelector('df-messenger-chat-bubble');
                const chat = bubble?.shadowRoot?.querySelector('df-messenger-chat');
                const list = chat?.shadowRoot?.querySelector('df-messenger-message-list');
                if (list) {{
                    list.innerHTML = '';
                    for (let i = 0; i < {count}; i++) {{
                        const msg = document.createElement('div');
                        msg.className = 'message bot-message';
                        msg.style.padding = '12px';
                        msg.textContent = '測試訊息 ' + '臺北市稅捐稽徵處提供公益出租人優惠。'.repeat({max(1, text_len // 30)});
                        list.appendChild(msg);
                    }}
                    list.scrollTop = list.scrollHeight;
                }}
            }}""")
            time.sleep(0.2)
            msg_check = page.evaluate("""() => {
                const bubble = document.querySelector('df-messenger-chat-bubble');
                const chat = bubble?.shadowRoot?.querySelector('df-messenger-chat');
                const extras = chat?.shadowRoot?.querySelector('.rental-input-extras');
                const notice = extras?.querySelector('p');
                const details = extras?.querySelector('details');
                return {
                    noticeInDetails: details && notice ? details.contains(notice) : false,
                    clipped: notice ? (notice.scrollHeight > notice.clientHeight + 1) : false
                };
            }""")
            assert not msg_check["clipped"], f"Notice geometry stress check: notice clipped with synthetic payload count={count}, len={text_len}"
            assert not msg_check["noticeInDetails"], f"Notice geometry stress check: notice unexpectedly placed in details with synthetic payload count={count}"

        # 8. Short viewport test (height < 400)
        page.set_viewport_size({"width": 390, "height": 360})
        time.sleep(0.3)
        short_check = page.evaluate("""() => {
            const bubble = document.querySelector('df-messenger-chat-bubble');
            const chat = bubble?.shadowRoot?.querySelector('df-messenger-chat');
            const extras = chat?.shadowRoot?.querySelector('.rental-input-extras');
            const notice = extras?.querySelector('p');
            const details = extras?.querySelector('details');
            return {
                noticeInDetails: details && notice ? details.contains(notice) : false,
                clipped: notice ? (notice.scrollHeight > notice.clientHeight + 1) : false,
                summaryText: details?.querySelector('summary')?.textContent
            };
        }""")
        assert not short_check["noticeInDetails"], "Notice must remain outside details even in short viewports (<400px)"
        assert not short_check["clipped"], "Notice clipped in short viewport"
        assert short_check["summaryText"] == "熱門問題", f"Summary text unexpected: {short_check['summaryText']}"

        # 9. Verify 0 console / page errors
        assert len(errors) == 0, f"Encountered runtime errors: {errors}"

        browser.close()
        print("ALL REGRESSION CHECKS PASSED: Favicon, floating shortcut, notice non-clipping, gapless panel, and responsive layouts verified.")

if __name__ == "__main__":
    test_messenger_regression()

