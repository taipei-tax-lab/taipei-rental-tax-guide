(function () {
  "use strict";

  // These four links are the most useful first choices for renters.
  var PRIMARY_TENANT_SERVICE_TITLES = [
    "中央擴大租金補貼",
    "臺北幸福租及租金加碼補貼",
    "包租代管承租資格與洽詢",
    "房屋租賃法律諮詢"
  ];

  function findTenantSection() {
    var section = document.querySelector("#tenant-services");
    return {
      section: section,
      grid: section && section.querySelector(".tenant-grid")
    };
  }

  function createTenantGrid(originalGrid, className, cards) {
    var grid = document.createElement("div");
    grid.className = originalGrid.className + " " + className;

    cards.forEach(function (card) {
      grid.appendChild(card);
    });

    return grid;
  }

  function getPrimaryTenantCards(cards) {
    var primaryCards = PRIMARY_TENANT_SERVICE_TITLES.map(function (title) {
      return cards.find(function (card) {
        var heading = card.querySelector("strong");
        return heading && heading.textContent.indexOf(title) !== -1;
      });
    }).filter(Boolean);

    // Keep the layout stable if a future content edit removes a priority card.
    cards.forEach(function (card) {
      if (primaryCards.length < 4 && primaryCards.indexOf(card) === -1) {
        primaryCards.push(card);
      }
    });

    return primaryCards;
  }

  function compactTenantServices() {
    var tenant = findTenantSection();

    if (
      !tenant.section ||
      !tenant.grid ||
      tenant.section.dataset.tenantCompacted === "true"
    ) {
      return;
    }

    var cards = Array.from(tenant.grid.children).filter(function (child) {
      return child.classList.contains("resource-card");
    });

    if (cards.length <= 4) {
      return;
    }

    var primaryCards = getPrimaryTenantCards(cards);
    var secondaryCards = cards.filter(function (card) {
      return primaryCards.indexOf(card) === -1;
    });
    var primaryGrid = createTenantGrid(
      tenant.grid,
      "tenant-primary-grid",
      primaryCards
    );
    var moreServices = document.createElement("details");
    moreServices.className = "tenant-more";

    var summary = document.createElement("summary");
    summary.textContent =
      "展開其他房客服務（" + secondaryCards.length + " 項）";
    moreServices.appendChild(summary);
    moreServices.appendChild(
      createTenantGrid(tenant.grid, "tenant-secondary-grid", secondaryCards)
    );

    tenant.grid.replaceWith(primaryGrid);
    primaryGrid.insertAdjacentElement("afterend", moreServices);
    tenant.section.dataset.tenantCompacted = "true";
  }

  function removeContactBars() {
    document.querySelectorAll(".contact-bar").forEach(function (contactBar) {
      contactBar.remove();
    });
  }

  function initialize() {
    compactTenantServices();
    removeContactBars();
  }

  // The generated page hydrates after this script tag; wait briefly so the
  // original tenant cards are available.
  function initializeAfterHydration() {
    window.setTimeout(initialize, 100);
  }

  if (document.readyState === "complete") {
    initializeAfterHydration();
  } else {
    window.addEventListener("load", initializeAfterHydration, { once: true });
  }
})();
