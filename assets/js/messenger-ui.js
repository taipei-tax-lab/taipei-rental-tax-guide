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
    assistantPanelOverlap: 1,
    assistantPanelLeftMargin: 16
  };

  var ASSISTANT_STATES = {
    idle: "assistant-idle",
    welcome: "assistant-welcome",
    thinking: "assistant-thinking",
    responding: "assistant-responding",
    guiding: "assistant-guiding",
    error: "assistant-error"
  };

  var ASSISTANT_COPY = {
    idle: {
      eyebrow: "臺北市稅捐稽徵處",
      title: "出租房屋租稅小幫手",
      description: "有出租房屋租稅、出租方案或申請流程問題，都可以直接問我。",
      status: "等待您的問題"
    },
    welcome: {
      eyebrow: "歡迎使用",
      title: "您好，我來協助您",
      description: "可以直接輸入問題，也可以從右側常見主題開始查詢。",
      status: "準備為您服務"
    },
    thinking: {
      eyebrow: "資訊整理中",
      title: "正在整理相關資訊",
      description: "我正在依您的問題查找並整理相關租稅與申請資訊。",
      status: "查詢與整理中…"
    },
    responding: {
      eyebrow: "回答已準備完成",
      title: "已為您整理好回答",
      description: "請查看右側回覆；如果還有不清楚的地方，可以繼續追問。",
      status: "回答已送達"
    },
    guiding: {
      eyebrow: "快速引導",
      title: "已收到您選擇的主題",
      description: "我會以這個主題為起點，整理相關資訊給您。",
      status: "正在帶入主題…"
    },
    error: {
      eyebrow: "暫時無法完成",
      title: "這次查詢沒有順利完成",
      description: "請稍後再試一次，或重新輸入您的問題。",
      status: "請重新嘗試"
    }
  };

  var ASSISTANT_TIMING = {
    welcome: 1500,
    thinkingMinimum: 1100,
    responding: 1250,
    error: 1900,
    guidingMinimum: 650,
    imageSwap: 90
  };

  var chatIsOpen = false;
  var assistantStateTimer = null;
  var assistantSwapToken = 0;
  var guidingUntil = 0;
  var thinkingUntil = 0;

  function ensureAssistantPanel() {
    if (document.querySelector(".assistant-panel")) {
      return;
    }

    var panel = document.createElement("aside");
    panel.className = "assistant-panel";
    panel.dataset.state = "idle";
    panel.setAttribute("aria-label", "出租房屋租稅小幫手使用說明");
    panel.setAttribute("aria-hidden", "true");
    panel.hidden = true;
    panel.innerHTML = [
      '<div class="assistant-panel__character">',
      '  <picture>',
      '    <source data-assistant-source srcset="./assets/images/assistant/assistant-idle.webp" type="image/webp">',
      '    <img data-assistant-image src="./assets/images/assistant/assistant-idle.png" alt="出租房屋租稅小幫手角色" width="400" height="656">',
      '  </picture>',
      '</div>',
      '<div class="assistant-panel__content">',
      '  <span class="assistant-panel__eyebrow" data-assistant-eyebrow>臺北市稅捐稽徵處</span>',
      '  <h2 data-assistant-title>出租房屋租稅小幫手</h2>',
      '  <p data-assistant-description>有出租房屋租稅、出租方案或申請流程問題，都可以直接問我。</p>',
      '  <div class="assistant-panel__status" role="status" aria-live="polite" aria-atomic="true">',
      '    <span class="assistant-panel__status-dot" aria-hidden="true"></span>',
      '    <span data-assistant-status>等待您的問題</span>',
      '  </div>',
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
        ".assistant-panel{position:fixed;z-index:9998;display:flex;flex-direction:column;width:280px;overflow:hidden;border:1px solid rgba(17,73,79,.16);border-right:0;border-radius:22px 0 0 22px;background:var(--cream);color:var(--ink);box-shadow:-14px 18px 50px rgba(13,57,63,.18);visibility:hidden}",
        ".assistant-panel.is-visible{visibility:visible}",
        ".assistant-panel[hidden]{display:none}",
        ".assistant-panel__character{flex:1 1 auto;min-height:0;padding:18px 24px 0;overflow:hidden;background:radial-gradient(circle at 50% 42%,rgba(255,255,255,.92),transparent 54%),linear-gradient(160deg,rgba(239,247,243,.94),rgba(238,226,202,.75))}",
        ".assistant-panel__character picture,.assistant-panel__character img{display:block;width:100%;height:100%}",
        ".assistant-panel__character img{object-fit:contain;object-position:center bottom;opacity:1;transform:translateY(0) scale(1);transition:opacity 140ms ease,transform 180ms ease}",
        ".assistant-panel.is-changing .assistant-panel__character img{opacity:.2;transform:translateY(2px) scale(.995)}",
        ".assistant-panel[data-state=thinking] .assistant-panel__character img{animation:assistant-thinking-motion 900ms ease-in-out infinite}",
        ".assistant-panel[data-state=guiding] .assistant-panel__character img{animation:assistant-guiding-motion 720ms ease-in-out infinite}",
        ".assistant-panel[data-state=responding] .assistant-panel__character img{animation:assistant-responding-motion 760ms ease-in-out infinite}",
        ".assistant-panel[data-state=error] .assistant-panel__character img{animation:assistant-error-motion 1000ms ease-in-out infinite}",
        ".assistant-panel__content{flex:none;padding:18px 20px 20px;border-top:1px solid rgba(17,73,79,.12);background:rgba(255,254,251,.96)}",
        ".assistant-panel__eyebrow{display:block;color:var(--teal);font-size:12px;font-weight:900;letter-spacing:.06em;line-height:1.4}",
        ".assistant-panel__content h2{margin:3px 0 8px;color:var(--teal-dark);font-size:19px;line-height:1.35}",
        ".assistant-panel__content>p:not(.assistant-panel__notice){margin:0;color:var(--ink-soft);font-size:14px;line-height:1.65}",
        ".assistant-panel__status{display:flex;align-items:center;gap:8px;margin:13px 0 0;padding:9px 11px;border:1px solid rgba(12,104,109,.12);border-radius:11px;background:rgba(239,247,243,.82);color:var(--teal-dark);font-size:12px;font-weight:800;line-height:1.4}",
        ".assistant-panel__status-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--teal);box-shadow:0 0 0 4px rgba(12,104,109,.1)}",
        ".assistant-panel[data-state=thinking] .assistant-panel__status-dot,.assistant-panel[data-state=guiding] .assistant-panel__status-dot{animation:assistant-status-pulse 1.15s ease-in-out infinite}",
        ".assistant-panel[data-state=responding] .assistant-panel__status-dot{background:#36845f;box-shadow:0 0 0 4px rgba(54,132,95,.1)}",
        ".assistant-panel[data-state=error] .assistant-panel__status{border-color:rgba(223,124,70,.18);background:rgba(223,124,70,.08);color:#8a4e2c}",
        ".assistant-panel[data-state=error] .assistant-panel__status-dot{background:var(--orange);box-shadow:0 0 0 4px rgba(223,124,70,.12)}",
        ".assistant-panel__notice{display:flex;align-items:flex-start;gap:8px;margin:12px 0 0;padding:11px 12px;border-radius:12px;background:rgba(223,124,70,.1);color:#557078;font-size:11px;line-height:1.55}",
        ".assistant-panel__notice svg{flex:none;width:16px;height:16px;margin-top:1px;color:var(--orange)}",
        "df-messenger.assistant-panel-attached{--df-messenger-chat-border-radius:0 22px 22px 0;--df-messenger-chat-window-box-shadow:14px 18px 50px rgba(13,57,63,.18)}",
        "@keyframes assistant-status-pulse{0%,100%{opacity:.55;transform:scale(.9)}50%{opacity:1;transform:scale(1.12)}}",
        "@keyframes assistant-thinking-motion{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-5px) rotate(-.4deg)}}",
        "@keyframes assistant-guiding-motion{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(2px,-4px) rotate(.35deg)}}",
        "@keyframes assistant-responding-motion{0%,100%{transform:translateY(1px) rotate(-.2deg)}50%{transform:translateY(-5px) rotate(.35deg)}}",
        "@keyframes assistant-error-motion{0%,100%{transform:translateY(-2px) rotate(-.6deg)}50%{transform:translateY(4px) rotate(.6deg)}}",
        "@media (prefers-reduced-motion:reduce){.assistant-panel__character img{animation:none!important;transition:none}.assistant-panel__status-dot{animation:none!important}}",
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

  function clearAssistantStateTimer() {
    if (assistantStateTimer !== null) {
      window.clearTimeout(assistantStateTimer);
      assistantStateTimer = null;
    }
  }

  function assistantAssetPath(state, extension) {
    return "./assets/images/assistant/" + ASSISTANT_STATES[state] + "." + extension;
  }

  function preloadAssistantStates() {
    Object.keys(ASSISTANT_STATES).forEach(function (state) {
      var image = new Image();
      image.src = assistantAssetPath(state, "webp");
    });
  }

  function updateAssistantCopy(panel, state) {
    var copy = ASSISTANT_COPY[state];

    if (!panel || !copy) {
      return;
    }

    var eyebrow = panel.querySelector("[data-assistant-eyebrow]");
    var title = panel.querySelector("[data-assistant-title]");
    var description = panel.querySelector("[data-assistant-description]");
    var status = panel.querySelector("[data-assistant-status]");

    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.description;
    if (status) status.textContent = copy.status;
  }

  function setAssistantState(state) {
    if (!Object.prototype.hasOwnProperty.call(ASSISTANT_STATES, state)) return;

    var panel = document.querySelector(".assistant-panel");
    if (!panel) return;

    updateAssistantCopy(panel, state);
    if (panel.dataset.state === state) return;

    clearAssistantStateTimer();
    assistantSwapToken += 1;
    var token = assistantSwapToken;
    var source = panel.querySelector("[data-assistant-source]");
    var image = panel.querySelector("[data-assistant-image]");

    panel.dataset.state = state;
    panel.classList.add("is-changing");

    window.setTimeout(function () {
      if (token !== assistantSwapToken) return;
      if (source) source.srcset = assistantAssetPath(state, "webp");
      if (image) image.src = assistantAssetPath(state, "png");
      panel.classList.remove("is-changing");
    }, ASSISTANT_TIMING.imageSwap);
  }

  function resetAssistantState() {
    clearAssistantStateTimer();
    guidingUntil = 0;
    thinkingUntil = 0;
    assistantSwapToken += 1;

    var panel = document.querySelector(".assistant-panel");
    if (!panel) return;

    var source = panel.querySelector("[data-assistant-source]");
    var image = panel.querySelector("[data-assistant-image]");
    panel.dataset.state = "idle";
    panel.classList.remove("is-changing");
    updateAssistantCopy(panel, "idle");
    if (source) source.srcset = assistantAssetPath("idle", "webp");
    if (image) image.src = assistantAssetPath("idle", "png");
  }

  function scheduleAssistantIdle(delay) {
    clearAssistantStateTimer();
    assistantStateTimer = window.setTimeout(function () {
      assistantStateTimer = null;
      setAssistantState("idle");
    }, delay);
  }

  function showTemporaryAssistantState(state, duration) {
    setAssistantState(state);
    scheduleAssistantIdle(duration);
  }

  function beginGuiding() {
    guidingUntil = Date.now() + ASSISTANT_TIMING.guidingMinimum;
    setAssistantState("guiding");
  }

  function beginThinking() {
    var remainingGuidingTime = guidingUntil - Date.now();

    function startThinking() {
      guidingUntil = 0;
      thinkingUntil = Date.now() + ASSISTANT_TIMING.thinkingMinimum;
      setAssistantState("thinking");
    }

    if (remainingGuidingTime > 0) {
      clearAssistantStateTimer();
      assistantStateTimer = window.setTimeout(function () {
        assistantStateTimer = null;
        startThinking();
      }, remainingGuidingTime);
      return;
    }
    startThinking();
  }

  function showStateAfterThinking(state, duration) {
    var remainingThinkingTime = thinkingUntil - Date.now();

    function showNextState() {
      assistantStateTimer = null;
      thinkingUntil = 0;
      showTemporaryAssistantState(state, duration);
    }

    if (remainingThinkingTime > 0) {
      clearAssistantStateTimer();
      assistantStateTimer = window.setTimeout(showNextState, remainingThinkingTime);
      return;
    }
    showNextState();
  }

  function resizeMessenger() {
    var elements = getMessengerElements();
    if (!elements.messenger || !elements.bubble) return;
    var viewport = getViewportSize();
    var chatWidth = Math.min(MESSENGER_LIMITS.maxWidth, Math.max(MESSENGER_LIMITS.minWidth, viewport.width - MESSENGER_LIMITS.horizontalMargin));
    var chatHeight = Math.min(MESSENGER_LIMITS.maxHeight, Math.max(MESSENGER_LIMITS.minHeight, viewport.height - MESSENGER_LIMITS.verticalMargin));
    var widthValue = String(Math.round(chatWidth));
    var heightValue = String(Math.round(chatHeight));
    elements.messenger.style.setProperty("--df-messenger-chat-window-width", widthValue + "px");
    elements.messenger.style.setProperty("--df-messenger-chat-window-height", heightValue + "px");
    if (elements.bubble.getAttribute("chat-width") !== widthValue) elements.bubble.setAttribute("chat-width", widthValue);
    if (elements.bubble.getAttribute("chat-height") !== heightValue) elements.bubble.setAttribute("chat-height", heightValue);
  }

  function positionEmptyState() {
    var elements = getMessengerElements();
    if (!elements.messenger || !elements.emptyState) return;
    var messengerStyle = getComputedStyle(elements.messenger);
    var right = parseFloat(messengerStyle.right) || 14;
    var bottom = parseFloat(messengerStyle.bottom) || 14;
    var bubbleSize = getCssPixels(elements.messenger, "--df-messenger-chat-bubble-size", 62);
    var windowOffset = getCssPixels(elements.messenger, "--df-messenger-chat-window-offset", 18);
    elements.emptyState.style.right = Math.max(22, right + 12) + "px";
    elements.emptyState.style.bottom = Math.max(14, bottom) + bubbleSize + windowOffset + 106 + "px";
  }

  function canShowAssistantPanel(viewport, chatWidth, right) {
    var requiredWidth = right + chatWidth + MESSENGER_LIMITS.assistantPanelWidth - MESSENGER_LIMITS.assistantPanelOverlap + MESSENGER_LIMITS.assistantPanelLeftMargin;
    return viewport.width >= MESSENGER_LIMITS.assistantPanelMinViewport && viewport.width >= requiredWidth;
  }

  function setAssistantPanelVisible(elements, isVisible) {
    var panel = elements.assistantPanel;
    if (!panel) return;
    panel.hidden = !isVisible;
    panel.classList.toggle("is-visible", isVisible);
    panel.setAttribute("aria-hidden", String(!isVisible));
    if (elements.messenger) elements.messenger.classList.toggle("assistant-panel-attached", isVisible);
  }

  function updateAssistantPanel() {
    var elements = getMessengerElements();
    if (!elements.messenger || !elements.assistantPanel) return;
    var viewport = getViewportSize();
    var messengerStyle = getComputedStyle(elements.messenger);
    var right = parseFloat(messengerStyle.right) || 14;
    var bottom = parseFloat(messengerStyle.bottom) || 14;
    var chatWidth = getCssPixels(elements.messenger, "--df-messenger-chat-window-width", MESSENGER_LIMITS.maxWidth);
    var chatHeight = getCssPixels(elements.messenger, "--df-messenger-chat-window-height", MESSENGER_LIMITS.maxHeight);
    var bubbleSize = getCssPixels(elements.messenger, "--df-messenger-chat-bubble-size", 62);
    var windowOffset = getCssPixels(elements.messenger, "--df-messenger-chat-window-offset", 18);
    var isVisible = chatIsOpen && canShowAssistantPanel(viewport, chatWidth, right);
    elements.assistantPanel.style.right = right + chatWidth - MESSENGER_LIMITS.assistantPanelOverlap + "px";
    elements.assistantPanel.style.bottom = Math.max(14, bottom) + bubbleSize + windowOffset + "px";
    elements.assistantPanel.style.height = Math.round(chatHeight) + "px";
    setAssistantPanelVisible(elements, isVisible);
  }

  function setEmptyStateVisible(emptyState, isVisible) {
    if (!emptyState) return;
    emptyState.hidden = !isVisible;
    emptyState.classList.toggle("is-visible", isVisible);
    emptyState.setAttribute("aria-hidden", String(!isVisible));
  }

  function bindAssistantEvents(elements) {
    if (!elements.assistantPanel || elements.assistantPanel.dataset.eventsBound === "true") return;
    document.addEventListener("df-chat-open-changed", function (event) {
      var detail = event.detail || {};
      chatIsOpen = detail.isOpen === true;
      updateAssistantPanel();
      if (chatIsOpen) showTemporaryAssistantState("welcome", ASSISTANT_TIMING.welcome);
      else resetAssistantState();
    });
    document.addEventListener("df-user-input-entered", beginThinking);
    document.addEventListener("df-request-sent", beginThinking);
    document.addEventListener("df-response-received", function () {
      guidingUntil = 0;
      showStateAfterThinking("responding", ASSISTANT_TIMING.responding);
    });
    document.addEventListener("df-messenger-error", function () {
      guidingUntil = 0;
      showStateAfterThinking("error", ASSISTANT_TIMING.error);
    });
    elements.assistantPanel.dataset.eventsBound = "true";
  }

  function bindEmptyState(elements) {
    if (!elements.emptyState || elements.emptyState.dataset.bound === "true") return;
    var conversationStarted = false;
    function hideEmptyState() {
      conversationStarted = true;
      setEmptyStateVisible(elements.emptyState, false);
    }
    function handleChatOpenChanged(event) {
      var detail = event.detail || {};
      setEmptyStateVisible(elements.emptyState, detail.isOpen === true && !conversationStarted);
    }
    function handleTopicClick(event) {
      var query = event.currentTarget.getAttribute("data-messenger-query");
      if (!query) return;
      hideEmptyState();
      beginGuiding();
      if (typeof elements.messenger.sendQuery === "function") {
        Promise.resolve(elements.messenger.sendQuery(query)).catch(function () {
          guidingUntil = 0;
          showTemporaryAssistantState("error", ASSISTANT_TIMING.error);
        });
      }
    }
    ["df-user-input-entered", "df-request-sent", "df-response-received"].forEach(function (eventName) {
      document.addEventListener(eventName, hideEmptyState);
    });
    document.addEventListener("df-chat-open-changed", handleChatOpenChanged);
    elements.emptyState.querySelectorAll("[data-messenger-query]").forEach(function (topic) {
      topic.addEventListener("click", handleTopicClick);
    });
    elements.emptyState.dataset.bound = "true";
  }

  function bindMessengerResize() {
    window.addEventListener("resize", function () {
      resizeMessenger(); positionEmptyState(); updateAssistantPanel();
    }, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () {
        resizeMessenger(); positionEmptyState(); updateAssistantPanel();
      }, { passive: true });
    }
  }

  function initialize() {
    ensureAssistantPanel();
    var elements = getMessengerElements();
    if (!elements.messenger || !elements.bubble) return;
    preloadAssistantStates();
    resetAssistantState();
    resizeMessenger();
    positionEmptyState();
    updateAssistantPanel();
    bindAssistantEvents(elements);
    bindEmptyState(elements);
    bindMessengerResize();
  }

  function initializeAfterHydration() { window.setTimeout(initialize, 100); }
  if (document.readyState === "complete") initializeAfterHydration();
  else window.addEventListener("load", initializeAfterHydration, { once: true });
})();
