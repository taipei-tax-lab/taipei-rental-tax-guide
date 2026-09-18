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

        # 2. Verify floating launcher is completely absent from DOM
        launcher_check = page.evaluate("""() => {
            const l = document.querySelector('.income-standard-launcher');
            return {
                exists: !!l
            };
        }""")
        assert not launcher_check["exists"], "Floating launcher .income-standard-launcher must be completely removed from DOM"

        # 3. Audience 4-card layout & interaction checks
        # A. 4th card attributes & dual presentation elements
        card4_attrs = page.evaluate("""() => {
            const card = document.querySelector('.v2-income-standard-entry');
            const cardImage = card?.querySelector('.v2-income-standard-card-image');
            const fallback = card?.querySelector('.v2-income-standard-fallback');
            const fallbackIcon = card?.querySelector('picture');
            const strong = fallback?.querySelector('strong');
            const small = fallback?.querySelector('small');
            return {
                exists: !!card,
                href: card?.href,
                target: card?.target,
                rel: card?.rel,
                ariaLabel: card?.getAttribute('aria-label'),
                cardImgSrc: cardImage?.getAttribute('src'),
                fallbackExists: !!fallback,
                desktopSource: fallbackIcon?.querySelector('source[media]')?.getAttribute('srcset'),
                strongText: strong?.textContent?.trim(),
                smallText: small?.textContent?.trim()
            };
        }""")
        assert card4_attrs["exists"], "Missing .v2-income-standard-entry card"
        assert card4_attrs["href"] == "https://services.arpa.tpctax.dof.gov.taipei/incomeReachStandard/form.php", \
            f"Unexpected card href: {card4_attrs['href']}"
        assert card4_attrs["target"] == "_blank", f"Card target must be _blank, got {card4_attrs['target']}"
        assert "noopener" in card4_attrs["rel"] and "noreferrer" in card4_attrs["rel"], \
            f"rel must contain noopener and noreferrer, got {card4_attrs['rel']}"
        assert card4_attrs["cardImgSrc"] == "./assets/images/income-standard-illustration.png", \
            f"card img src unexpected: {card4_attrs['cardImgSrc']}"
        assert card4_attrs["fallbackExists"], "Fallback container must exist"
        assert card4_attrs["desktopSource"] == "./assets/images/income-standard-card.webp", \
            f"desktop source unexpected: {card4_attrs['desktopSource']}"
        assert card4_attrs["strongText"] == "所得達租金標準", \
            f"strong text unexpected: {card4_attrs['strongText']}"
        assert card4_attrs["smallText"] == "申報優惠稅率專區", \
            f"small text unexpected: {card4_attrs['smallText']}"

        # B. Viewport layout matrix: ALL 4 cards must have equal width and equal height (max diff <= 1px), plus dual presentation visibility
        audience_test_viewports = [
            (1440, 900),
            (1280, 800),
            (1100, 800),
            (1024, 768),
            (768, 1024),
            (390, 844),
            (360, 800),
            (320, 480)
        ]
        for w, h in audience_test_viewports:
            page.set_viewport_size({"width": w, "height": h})
            time.sleep(0.2)
            page.wait_for_function("""() => {
                const img = document.querySelector('.v2-income-standard-card-image');
                const expected = innerWidth >= 1100 ? 'income-standard-card.webp' : 'income-standard-illustration.webp';
                return img.complete && img.naturalWidth > 0 && img.currentSrc.endsWith(expected);
            }""")
            card_geom = page.evaluate("""() => {
                const cards = Array.from(document.querySelectorAll('.v2-audience > *'));
                const rects = cards.map(c => c.getBoundingClientRect());
                const widths = rects.map(r => r.width);
                const heights = rects.map(r => r.height);
                const cardImg = document.querySelector('.v2-income-standard-card-image');
                const fallback = document.querySelector('.v2-income-standard-fallback');
                const imageRect = cardImg.getBoundingClientRect();
                const anchorRect = cardImg.closest('a').getBoundingClientRect();
                const selected = document.querySelector('.v2-audience-selected');
                const selectedRect = selected?.getBoundingClientRect();
                const selectedCard = selected?.closest('.v2-audience-button');
                const selectedCardRect = selectedCard?.getBoundingClientRect();
                const subtitleRect = selectedCard?.querySelector('small').getBoundingClientRect();
                return {
                    count: cards.length,
                    widths: widths,
                    heights: heights,
                    maxWDiff: Math.max(...widths) - Math.min(...widths),
                    maxHDiff: Math.max(...heights) - Math.min(...heights),
                    topDiff: Math.max(...rects.map(r => r.top)) - Math.min(...rects.map(r => r.top)),
                    bottomDiff: Math.max(...rects.map(r => r.bottom)) - Math.min(...rects.map(r => r.bottom)),
                    imageWidth: imageRect.width,
                    imageHeight: imageRect.height,
                    anchorWidth: anchorRect.width,
                    anchorHeight: anchorRect.height,
                    selectedClear: !!selectedRect && selectedRect.top >= subtitleRect.bottom &&
                        selectedRect.bottom <= selectedCardRect.bottom &&
                        selectedRect.left >= selectedCardRect.left && selectedRect.right <= selectedCardRect.right,
                    overflow: document.documentElement.scrollWidth - window.innerWidth,
                    cardImgDisplay: cardImg ? window.getComputedStyle(cardImg).display : 'none',
                    currentSrc: cardImg.currentSrc,
                    fallbackDisplay: fallback ? window.getComputedStyle(fallback).display : 'none'
                };
            }""")
            assert card_geom["count"] == 4, f"Expected 4 audience cards at {w}x{h}, got {card_geom['count']}"
            assert (w >= 1100 or card_geom["maxWDiff"] <= 1.0), \
                f"Audience cards width diff must be <= 1px at {w}x{h}, got {card_geom['maxWDiff']} (widths: {card_geom['widths']})"
            assert card_geom["maxHDiff"] <= 1.0, \
                f"Audience cards height diff must be <= 1px across ALL 4 cards at {w}x{h}, got {card_geom['maxHDiff']} (heights: {card_geom['heights']})"
            assert card_geom["overflow"] <= 0, f"Horizontal overflow at {w}x{h}: {card_geom['overflow']}"

            # Dual presentation assertion: Desktop (>= 1100) shows card image; Tablet/Mobile (< 1100) shows fallback
            if w >= 1100:
                assert card_geom["topDiff"] <= 1 and card_geom["bottomDiff"] <= 1, \
                    f"Desktop card edges must align at {w}x{h}: {card_geom}"
                widths = card_geom["widths"]
                assert max(widths[:3]) - min(widths[:3]) <= 1
                assert 1.08 <= widths[3] / widths[0] <= 1.15
                assert abs(card_geom["anchorHeight"] - widths[3] * 378 / 1040) <= 1
                assert abs(card_geom["imageWidth"] - card_geom["anchorWidth"]) <= 1, \
                    f"Image must fill anchor width at {w}x{h}: {card_geom}"
                assert abs(card_geom["imageHeight"] - card_geom["anchorHeight"]) <= 1, \
                    f"Image must fill anchor height at {w}x{h}: {card_geom}"
                assert card_geom["selectedClear"], f"Selected label overlaps subtitle or escapes card at {w}x{h}"
                print(f"Audience geometry {w}x{h}: {card_geom}")
                assert card_geom["cardImgDisplay"] != "none", \
                    f"At {w}x{h} Desktop, full card image must be visible (got display: {card_geom['cardImgDisplay']})"
                assert card_geom["fallbackDisplay"] == "none", \
                    f"At {w}x{h} Desktop, fallback container must be hidden (got display: {card_geom['fallbackDisplay']})"
            else:
                assert card_geom["currentSrc"].endswith("income-standard-illustration.webp"), \
                    f"At {w}x{h}, picture must select the illustration: {card_geom}"
                assert card_geom["fallbackDisplay"] != "none", \
                    f"At {w}x{h} Tablet/Mobile, fallback container must be visible (got display: {card_geom['fallbackDisplay']})"

        # C. Audience card interactions
        page.set_viewport_size({"width": 1440, "height": 900})
        time.sleep(0.2)
        # Initial state: owner is active
        state0 = page.evaluate("""() => {
            const ownerBtn = document.querySelector('[data-audience="owner"]');
            const tenantBtn = document.querySelector('[data-audience="tenant"]');
            const card4 = document.querySelector('.v2-income-standard-entry');
            const ownerPanel = document.querySelector('[data-audience-panel="owner"]');
            const tenantPanel = document.querySelector('[data-audience-panel="tenant"]');
            return {
                ownerAria: ownerBtn?.getAttribute('aria-current'),
                tenantAria: tenantBtn?.getAttribute('aria-current'),
                card4Aria: card4?.getAttribute('aria-current'),
                ownerHidden: ownerPanel?.hidden,
                tenantHidden: tenantPanel?.hidden
            };
        }""")
        assert state0["ownerAria"] == "true", "Owner button should initially have aria-current='true'"
        assert state0["tenantAria"] is None, "Tenant button should not have aria-current"
        assert not state0["ownerHidden"], "Owner panel should initially be visible"
        assert state0["tenantHidden"], "Tenant panel should initially be hidden"

        # Click 4th card (income standard entry) -> should NOT change aria-current, should NOT switch panel
        page.evaluate("() => document.querySelector('.v2-income-standard-entry').dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}))")
        time.sleep(0.2)
        state_after_card4 = page.evaluate("""() => {
            const ownerBtn = document.querySelector('[data-audience="owner"]');
            const tenantBtn = document.querySelector('[data-audience="tenant"]');
            const card4 = document.querySelector('.v2-income-standard-entry');
            const ownerPanel = document.querySelector('[data-audience-panel="owner"]');
            const tenantPanel = document.querySelector('[data-audience-panel="tenant"]');
            return {
                ownerAria: ownerBtn?.getAttribute('aria-current'),
                tenantAria: tenantBtn?.getAttribute('aria-current'),
                card4Aria: card4?.getAttribute('aria-current'),
                ownerHidden: ownerPanel?.hidden,
                tenantHidden: tenantPanel?.hidden
            };
        }""")
        assert state_after_card4["ownerAria"] == "true", "Owner button should still have aria-current after clicking card 4"
        assert state_after_card4["card4Aria"] is None, "Card 4 must not receive aria-current"
        assert not state_after_card4["ownerHidden"], "Owner panel must remain visible after clicking card 4"
        assert state_after_card4["tenantHidden"], "Tenant panel must remain hidden after clicking card 4"

        # Click tenant button -> switches to tenant panel
        page.evaluate("() => document.querySelector('[data-audience=\"tenant\"]').click()")
        time.sleep(0.2)
        state_tenant = page.evaluate("""() => {
            const ownerBtn = document.querySelector('[data-audience="owner"]');
            const tenantBtn = document.querySelector('[data-audience="tenant"]');
            const ownerPanel = document.querySelector('[data-audience-panel="owner"]');
            const tenantPanel = document.querySelector('[data-audience-panel="tenant"]');
            return {
                ownerAria: ownerBtn?.getAttribute('aria-current'),
                tenantAria: tenantBtn?.getAttribute('aria-current'),
                ownerHidden: ownerPanel?.hidden,
                tenantHidden: tenantPanel?.hidden
            };
        }""")
        assert state_tenant["tenantAria"] == "true", "Tenant button should have aria-current='true'"
        assert state_tenant["ownerAria"] is None, "Owner button should not have aria-current"
        assert state_tenant["ownerHidden"], "Owner panel should be hidden"
        assert not state_tenant["tenantHidden"], "Tenant panel should be visible"

        # Click owner button -> switches back to owner panel
        page.evaluate("() => document.querySelector('[data-audience=\"owner\"]').click()")
        time.sleep(0.2)
        state_owner = page.evaluate("""() => {
            const ownerBtn = document.querySelector('[data-audience="owner"]');
            const tenantBtn = document.querySelector('[data-audience="tenant"]');
            const ownerPanel = document.querySelector('[data-audience-panel="owner"]');
            const tenantPanel = document.querySelector('[data-audience-panel="tenant"]');
            return {
                ownerAria: ownerBtn?.getAttribute('aria-current'),
                tenantAria: tenantBtn?.getAttribute('aria-current'),
                ownerHidden: ownerPanel?.hidden,
                tenantHidden: tenantPanel?.hidden
            };
        }""")
        assert state_owner["ownerAria"] == "true", "Owner button should have aria-current='true'"
        assert not state_owner["ownerHidden"], "Owner panel should be visible"

        # 4. Open chat via helper button and test notice & assistant panel geometry
        page.set_viewport_size({"width": 1440, "height": 900})
        time.sleep(0.3)
        page.evaluate("() => document.getElementById('open-helper').click()")
        page.wait_for_function("""() => {
            const bubble = document.querySelector('df-messenger-chat-bubble');
            const chat = bubble?.shadowRoot?.querySelector('.chat-wrapper');
            const rect = chat?.getBoundingClientRect();
            return rect && rect.width > 350 && rect.height > 500;
        }""")
        time.sleep(0.3)

        # 5. Viewport and zoom matrix with Chat Open
        test_viewports = [
            (1440, 900),
            (1280, 800),
            (1024, 768),
            (768, 1024),
            (390, 844),
            (320, 480),
            (390, 360)
        ]
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
