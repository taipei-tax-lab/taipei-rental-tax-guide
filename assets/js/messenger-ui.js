(function () {
  "use strict";

  var MESSENGER_LIMITS = {
    maxWidth: 430,
    maxHeight: 680,
    minWidth: 280,
    minHeight: 320,
    horizontalMargin: 32,
    verticalMargin: 124
  };

  function getMessengerElements() {
    var messenger = document.querySelector("df-messenger");

    return {
      messenger: messenger,
      bubble: messenger && messenger.querySelector("df-messenger-chat-bubble"),
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
    }, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () {
        resizeMessenger();
        positionEmptyState();
      }, { passive: true });
    }
  }

  function initialize() {
    var elements = getMessengerElements();

    if (!elements.messenger || !elements.bubble) {
      return;
    }

    resizeMessenger();
    positionEmptyState();
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
