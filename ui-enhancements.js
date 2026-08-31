(function () {
  "use strict";

  function compactTenantServices() {
    var section = document.querySelector("#tenant-services");
    var grid = section && section.querySelector(".tenant-grid");

    if (!section || !grid || section.dataset.tenantCompacted === "true") {
      return;
    }

    var cards = Array.from(grid.children).filter(function (child) {
      return child.classList.contains("resource-card");
    });

    if (cards.length <= 4) {
      return;
    }

    var priorityTitles = [
      "中央擴大租金補貼",
      "臺北幸福租及租金加碼補貼",
      "包租代管承租資格與洽詢",
      "房屋租賃法律諮詢"
    ];
    var primaryCards = priorityTitles
      .map(function (title) {
        return cards.find(function (card) {
          var heading = card.querySelector("strong");
          return heading && heading.textContent.indexOf(title) !== -1;
        });
      })
      .filter(Boolean);

    cards.forEach(function (card) {
      if (primaryCards.length < 4 && primaryCards.indexOf(card) === -1) {
        primaryCards.push(card);
      }
    });

    var secondaryCards = cards.filter(function (card) {
      return primaryCards.indexOf(card) === -1;
    });

    function createGrid(className, cardList) {
      var newGrid = document.createElement("div");
      newGrid.className = grid.className + " " + className;
      cardList.forEach(function (card) {
        newGrid.appendChild(card);
      });
      return newGrid;
    }

    var primaryGrid = createGrid("tenant-primary-grid", primaryCards);
    var more = document.createElement("details");
    more.className = "tenant-more";

    var summary = document.createElement("summary");
    summary.textContent = "展開其他房客服務（" + secondaryCards.length + " 項）";
    more.appendChild(summary);
    more.appendChild(createGrid("tenant-secondary-grid", secondaryCards));

    grid.replaceWith(primaryGrid);
    primaryGrid.insertAdjacentElement("afterend", more);
    section.dataset.tenantCompacted = "true";
  }

  function resizeMessenger() {
    var messenger = document.querySelector("df-messenger");
    var bubble = messenger && messenger.querySelector("df-messenger-chat-bubble");

    if (!messenger || !bubble) {
      return;
    }

    var viewport = window.visualViewport;
    var viewportWidth = viewport ? viewport.width : window.innerWidth;
    var viewportHeight = viewport ? viewport.height : window.innerHeight;
    var chatWidth = Math.min(430, Math.max(280, viewportWidth - 32));
    var chatHeight = Math.min(680, Math.max(320, viewportHeight - 124));
    var widthValue = String(Math.round(chatWidth));
    var heightValue = String(Math.round(chatHeight));

    messenger.style.setProperty(
      "--df-messenger-chat-window-width",
      widthValue + "px"
    );
    messenger.style.setProperty(
      "--df-messenger-chat-window-height",
      heightValue + "px"
    );

    if (bubble.getAttribute("chat-width") !== widthValue) {
      bubble.setAttribute("chat-width", widthValue);
    }
    if (bubble.getAttribute("chat-height") !== heightValue) {
      bubble.setAttribute("chat-height", heightValue);
    }
  }

  function removeContactBar() {
    var contactBar = document.querySelector(".contact-bar");
    if (contactBar) {
      contactBar.remove();
    }
  }

  function initialize() {
    compactTenantServices();
    removeContactBar();
    resizeMessenger();

    window.addEventListener("resize", resizeMessenger, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resizeMessenger, {
        passive: true
      });
    }
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
