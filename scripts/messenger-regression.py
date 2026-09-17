"""
Messenger UI & Layout Regression Test Suite (Python Playwright + Chrome)
Validates:
A. 提醒完整顯示: notice.scrollHeight <= notice.clientHeight + 1
B. notice 永遠在 details 外: !details.contains(notice)
C. assistant / chat gap: abs(chatRect.left - panelRect.right) <= 1px
D. assistant / chat top / bottom 對齊: difference <= 1px
E. 沒有 horizontal overflow: scrollWidth <= innerWidth
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
        context = browser.new_context()
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

        # 2. Open chat
        page.evaluate("() => document.querySelector('df-messenger-chat-bubble')?.openChat()")
        time.sleep(0.5)

        # 3. Viewport and zoom matrix
        viewports = [
            (1440, 900),
            (1280, 800),
            (1024, 768),
            (390, 844)
        ]
        zoom_levels = [1.0, 1.25, 1.5]

        for w, h in viewports:
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

        # 4. Notice geometry stress check (synthetic DOM manipulation)
        # Note: This is a synthetic container stress check on DOM geometry rather than
        # a simulation of Google's internal LitElement message rendering shadow DOM.
        # It verifies that varying payloads or manipulating the message-list node
        # does not cause notice clipping or displace the notice into details.
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

        # 5. Short viewport test (height < 400)
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

        # 6. Verify 0 console / page errors
        assert len(errors) == 0, f"Encountered runtime errors: {errors}"

        browser.close()
        print("ALL REGRESSION CHECKS PASSED: Favicon, notice non-clipping, gapless panel, and responsive layouts verified.")

if __name__ == "__main__":
    test_messenger_regression()
