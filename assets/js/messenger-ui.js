(function () {
  "use strict";

  var MESSENGER_LIMITS = {
    maxWidth: 430,
    maxHeight: 680,
    minWidth: 280,
    minHeight: 320,
    horizontalMargin: 32,
    verticalMargin: 124,
    assistantPanelMinViewport: 900,
    assistantPanelWidth: 280,
    assistantPanelGap: 18,
    assistantPanelLeftMargin: 16
  };

  var chatIsOpen = false;

  function ensureAssistantPanel() {
    if (document.querySelector(".assistant-panel")) {
      return;
    }

    var panel = document.createElement("aside");
    panel.className = "assistant-panel";
    panel.setAttribute("aria-label", "出租房屋租稅小幫手使用說明");
    panel.setAttribute("aria-hidden", "true");
    panel.hidden = true;
    panel.innerHTML = [
      '<div class="assistant-panel__character">',
      '  <picture>',
      '    <source srcset="./assets/images/assistant/assistant-idle.webp" type="image/webp">',
      '    <img src="./assets/images/assistant/assistant-idle.png" alt="出租房屋租稅小幫手角色" width="400" height="656">',
      '  </picture>',
      '</div>',
      '<div class="assistant-panel__content">',
      '  <span class="assistant-panel__eyebrow">臺北市稅捐稽徵處</span>',
      '  <h2>出租房屋租稅小幫手</h2>',
      '  <p>有出租房屋租稅、出租方案或申請流程問題，都可以直接問我。</p>',
      '  <p class="assistant-panel__notice">',
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">',
      '      <path d="M12 3 2.8 20h18.4z"></path>',
      '      <path d="M12 9v5M12 17.5v.01"></path>',
      '    </svg>',
      '    <span>本服務提供一般性資訊，請勿輸入身分證字號、完整地址或電話。</span>',
      '  </p>',
      '</div>'
    ].join("");

    document.body.appendChild(panel);

    if (!document.getElementById("assistant-panel-styles")) {
      var style = document.createElement("style");
      style.id = "assistant-panel-styles";
      style.textContent = [
        ".assistant-panel{position:fixed;z-index:9998;display:flex;flex-direction:column;width:280px;overflow:hidden;border:1px solid rgba(17,73,79,.16);border-radius:22px;background:var(--cream);color:var(--ink);box-shadow:0 18px 50px rgba(13,57,63,.2);visibility:hidden}",
        ".assistant-panel.is-visible{visibility:visible}",
        ".assistant-panel[hidden]{display:none}",
        ".assistant-panel__character{flex:1 1 auto;min-height:0;padding:18px 24px 0;overflow:hidden;background:radial-gradient(circle at 50% 42%,rgba(255,255,255,.92),transparent 54%),linear-gradient(160deg,rgba(239,247,243,.94),rgba(238,226,202,.75))}",
        ".assistant-panel__character picture,.assistant-panel__character img{display:block;width:100%;height:100%}",
        ".assistant-panel__character img{object-fit:contain;object-position:center bottom}",
        ".assistant-panel__content{flex:none;padding:18px 20px 20px;border-top:1px solid rgba(17,73,79,.12);background:rgba(255,254,251,.96)}",
        ".assistant-panel__eyebrow{display:block;color:var(--teal);font-size:12px;font-weight:900;letter-spacing:.06em;line-height:1.4}",
        ".assistant-panel__content h2{margin:3px 0 8px;color:var(--teal-dark);font-size:19px;line-height:1.35}",
        ".assistant-panel__content>p:not(.assistant-panel__notice){margin:0;color:var(--ink-soft);font-size:14px;line-height:1.65}",
        ".assistant-panel__notice{display:flex;align-items:flex-start;gap:8px;margin:14px 0 0;padding:11px 12px;border-radius:12px;background:rgba(223,124,70,.1);color:#557078;font-size:11px;line-height:1.55}",
        ".assistant-panel__notice svg{flex:none;width:16px;height:16px;margin-top:1px;color:var(--orange)}",
        "@media print{.assistant-panel{display:none!important}}"
      ].join("");
      document.head.appendChild(style);
    }
  }

  function getMessengerElements() {
    var messenger = document.querySelector("df-messenger");

    return {
      messenger: messenger,
      bubble: messenger && messenger.querySelector("df-messenger-chat-bubble"),
      assistantPanel: document.querySelector(".assistant-panel"),
      emptyState: document.querySelector(".messenger-empty-state")
    };
  }

  function getViewportSize() {
    var viewport = window.visualViewport;

    return {
      width: viewport ? viewport.width : window.innerWidth,
      height: viewport ? viewport.height : window.innerHeight
    };
  }

  function getCssPixels(element, property, fallback) {
    var value = parseFloat(getComputedStyle(element).getPropertyValue(property));

    return Number.isFinite(value) ? value : fallback;
  }

  function resizeMessenger() {
    var elements = getMessengerElements();

    if (!elements.messenger || !elements.bubble) {
      return;
    }

    var viewport = getViewportSize();
    var chatWidth = Math.min(
      MESSENGER_LIMITS.maxWidth,
      Math.max(
        MESSENGER_LIMITS.minWidth,
        viewport.width - MESSENGER_LIMITS.horizontalMargin
      )
    );
    var chatHeight = Math.min(
      MESSENGER_LIMITS.maxHeight,
      Math.max(
        MESSENGER_LIMITS.minHeight,
        viewport.height - MESSENGER_LIMITS.verticalMargin
      )
    );
    var widthValue = String(Math.round(chatWidth));
    var heightValue = String(Math.round(chatHeight));

    elements.messenger.style.setProperty(
      "--df-messenger-chat-window-width",
      widthValue + "px"
    );
    elements.messenger.style.setProperty(
      "--df-messenger-chat-window-height",
      heightValue + "px"
    );

    if (elements.bubble.getAttribute("chat-width") !== widthValue) {
      elements.bubble.setAttribute("chat-width", widthValue);
    }
    if (elements.bubble.getAttribute("chat-height") !== heightValue) {
      elements.bubble.setAttribute("chat-height", heightValue);
    }
  }

  function positionEmptyState() {
    var elements = getMessengerElements();

    if (!elements.messenger || !elements.emptyState) {
      return;
    }

    var messengerStyle = getComputedStyle(elements.messenger);
    var right = parseFloat(messengerStyle.right) || 14;
    var bottom = parseFloat(messengerStyle.bottom) || 14;
    var bubbleSize = getCssPixels(
      elements.messenger,
      "--df-messenger-chat-bubble-size",
      62
    );
    var windowOffset = getCssPixels(
      elements.messenger,
      "--df-messenger-chat-window-offset",
      18
    );

    elements.emptyState.style.right = Math.max(22, right + 12) + "px";
    elements.emptyState.style.bottom =
      Math.max(14, bottom) + bubbleSize + windowOffset + 106 + "px";
  }

  function canShowAssistantPanel(viewport, chatWidth, right) {
    var requiredWidth = right + chatWidth +
      MESSENGER_LIMITS.assistantPanelGap +
      MESSENGER_LIMITS.assistantPanelWidth +
      MESSENGER_LIMITS.assistantPanelLeftMargin;

    return viewport.width >= MESSENGER_LIMITS.assistantPanelMinViewport &&
      viewport.width >= requiredWidth;
  }

  function setAssistantPanelVisible(panel, isVisible) {
    if (!panel) {
      return;
    }

    panel.hidden = !isVisible;
    panel.classList.toggle("is-visible", isVisible);
    panel.setAttribute("aria-hidden", String(!isVisible));
  }

  function updateAssistantPanel() {
    var elements = getMessengerElements();

    if (!elements.messenger || !elements.assistantPanel) {
      return;
    }

    var viewport = getViewportSize();
    var messengerStyle = getComputedStyle(elements.messenger);
    var right = parseFloat(messengerStyle.right) || 14;
    var bottom = parseFloat(messengerStyle.bottom) || 14;
    var chatWidth = getCssPixels(
      elements.messenger,
      "--df-messenger-chat-window-width",
      MESSENGER_LIMITS.maxWidth
    );
    var chatHeight = getCssPixels(
      elements.messenger,
      "--df-messenger-chat-window-height",
      MESSENGER_LIMITS.maxHeight
    );
    var bubbleSize = getCssPixels(
      elements.messenger,
      "--df-messenger-chat-bubble-size",
      62
    );
    var windowOffset = getCssPixels(
      elements.messenger,
      "--df-messenger-chat-window-offset",
      18
    );
    var isVisible = chatIsOpen && canShowAssistantPanel(viewport, chatWidth, right);

    elements.assistantPanel.style.right =
      right + chatWidth + MESSENGER_LIMITS.assistantPanelGap + "px";
    elements.assistantPanel.style.bottom =
      Math.max(14, bottom) + bubbleSize + windowOffset + "px";
    elements.assistantPanel.style.height = Math.round(chatHeight) + "px";
    setAssistantPanelVisible(elements.assistantPanel, isVisible);
  }

  function setEmptyStateVisible(emptyState, isVisible) {
    if (!emptyState) {
      return;
    }

    emptyState.hidden = !isVisible;
    emptyState.classList.toggle("is-visible", isVisible);
    emptyState.setAttribute("aria-hidden", String(!isVisible));
  }

  function bindEmptyState(elements) {
    if (!elements.emptyState || elements.emptyState.dataset.bound === "true") {
      return;
    }

    var conversationStarted = false;

    function hideEmptyState() {
      conversationStarted = true;
      setEmptyStateVisible(elements.emptyState, false);
    }

    function handleChatOpenChanged(event) {
      var detail = event.detail || {};
      var isOpen = detail.isOpen === true;

      chatIsOpen = isOpen;
      updateAssistantPanel();

      setEmptyStateVisible(
        elements.emptyState,
        isOpen && !conversationStarted
      );
    }

    function handleTopicClick(event) {
      var query = event.currentTarget.getAttribute("data-messenger-query");

      if (!query) {
        return;
      }

      hideEmptyState();

      if (typeof elements.messenger.sendQuery === "function") {
        Promise.resolve(elements.messenger.sendQuery(query)).catch(function () {
          // Messenger displays its own error state; no extra page alert is needed.
        });
      }
    }

    [
      "df-user-input-entered",
      "df-request-sent",
      "df-response-received"
    ].forEach(function (eventName) {
      document.addEventListener(eventName, hideEmptyState);
    });

    document.addEventListener("df-chat-open-changed", handleChatOpenChanged);

    elements.emptyState
      .querySelectorAll("[data-messenger-query]")
      .forEach(function (topic) {
        topic.addEventListener("click", handleTopicClick);
      });

    elements.emptyState.dataset.bound = "true";
  }

  function bindMessengerResize() {
    window.addEventListener("resize", function () {
      resizeMessenger();
      positionEmptyState();
      updateAssistantPanel();
    }, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () {
        resizeMessenger();
        positionEmptyState();
        updateAssistantPanel();
      }, { passive: true });
    }
  }

  function initialize() {
    ensureAssistantPanel();

    var elements = getMessengerElements();

    if (!elements.messenger || !elements.bubble) {
      return;
    }

    resizeMessenger();
    positionEmptyState();
    updateAssistantPanel();
    bindEmptyState(elements);
    bindMessengerResize();
  }

  function initializeAfterHydration() {
    window.setTimeout(initialize, 100);
  }

  if (document.readyState === "complete") {
    initializeAfterHydration();
  } else {
    window.addEventListener("load", initializeAfterHydration, { once: true });
  }
})();
