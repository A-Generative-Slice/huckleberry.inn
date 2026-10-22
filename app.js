/**
 * Your Huckleberry (@huckleberry.inn) - Luxury Atelier & Cloud Kitchen App
 * Shafee Mohammed Road, Thousand Lights / Nungambakkam, Chennai
 * Powered by A Generative Slice
 */

document.addEventListener("DOMContentLoaded", () => {
  // Read URL search params (e.g. atelier.html?tier=mini-couture or atelier.html?flavor=salted-caramel)
  const urlParams = new URLSearchParams(window.location.search);
  let requestedTier = urlParams.get("tier");
  if (requestedTier === "tier-bento") requestedTier = "bento-noir";
  const validTier = requestedTier && HUCKLEBERRY_DATA.tiers.some(t => t.id === requestedTier) ? requestedTier : "tier-2";

  const requestedFlavor = urlParams.get("flavor");
  const validFlavor = requestedFlavor && HUCKLEBERRY_DATA.flavors.some(f => f.id === requestedFlavor) ? requestedFlavor : "lychee-rose";

  // Application State
  const state = {
    tierId: validTier,
    flavorId: validFlavor,
    finishId: "vintage-lambeth",
    isEggless: true,
    customMessage: "Happy Celebration",
    deliveryPin: "600006",
    deliveryDate: getTomorrowDateString(),
    deliverySlot: "4:00 PM – 6:00 PM (Fresh Evening)",
    lastGeneratedSlip: ""
  };

  // DOM Elements
  const tierContainer = document.getElementById("tier-cards-container");
  const flavorContainer = document.getElementById("flavor-cards-container");
  const finishContainer = document.getElementById("finish-cards-container");
  const zoneSelect = document.getElementById("select-zone");
  const cakeCanvas = document.getElementById("dynamic-cake-canvas");

  // Spec Summary Elements
  const specTier = document.getElementById("spec-tier-text");
  const specFlavor = document.getElementById("spec-flavor-text");
  const specFinish = document.getElementById("spec-finish-text");
  const specDietary = document.getElementById("spec-dietary-text");
  const specPlaque = document.getElementById("spec-plaque-text");
  const specZone = document.getElementById("spec-zone-text");
  const specSlot = document.getElementById("spec-slot-text");
  const totalPriceLabel = document.getElementById("label-total-price");
  const advancePriceLabel = document.getElementById("label-advance-price");

  // Mobile Bar Elements
  const mobileTier = document.getElementById("mobile-bar-tier");
  const mobilePrice = document.getElementById("mobile-bar-price");
  const mobileWhatsAppBtn = document.getElementById("btn-mobile-whatsapp");

  // Inputs
  const egglessCheck = document.getElementById("chk-eggless");
  const egglessBadge = document.getElementById("eggless-badge");
  const inscriptionInput = document.getElementById("txt-inscription");
  const dateInput = document.getElementById("date-delivery");
  const slotSelect = document.getElementById("slot-delivery");

  // Modal Elements
  const dispatchBtn = document.getElementById("btn-dispatch-whatsapp");
  const orderDialog = document.getElementById("order-modal-dialog");
  const closeDialogBtn = document.getElementById("btn-close-dialog");
  const copySlipBtn = document.getElementById("btn-copy-slip");
  const dialogTokenId = document.getElementById("dialog-token-id");
  const dialogPriceDisplay = document.getElementById("dialog-price-display");
  const dialogWaCta = document.getElementById("dialog-wa-cta");

  // Quick-Look Elements
  const qlModal = document.getElementById("quick-look-modal");
  const qlCloseBtn = document.getElementById("btn-close-ql");
  const qlTitle = document.getElementById("ql-title");
  const qlBadge = document.getElementById("ql-badge");
  const qlImg = document.getElementById("ql-img");
  const qlQuote = document.getElementById("ql-quote");
  const qlDesc = document.getElementById("ql-desc");
  const qlPrice = document.getElementById("ql-price");
  const qlWeight = document.getElementById("ql-weight");
  const qlAllergens = document.getElementById("ql-allergens");
  const qlStorage = document.getElementById("ql-storage");
  const qlCustomizeBtn = document.getElementById("btn-ql-customize");
  let currentQlTier = "mini-couture";
  let currentQlFlavor = "";

  // Toast Container
  const toastContainer = document.getElementById("toast-container");

  // Mobile Nav Elements
  const mobileNavToggle = document.getElementById("btn-mobile-nav");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");

  // Initialize Date Input
  if (dateInput) {
    dateInput.min = getTomorrowDateString();
    dateInput.value = state.deliveryDate;
  }

  // 1. Toast Notification Utility
  function showToast(message, icon = "✨") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast-pill";
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  // 2. Mobile Navigation Toggle with Outside-Click & Escape Dismiss
  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.toggle("open");
      mobileNavToggle.classList.toggle("open", isOpen);
      mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNavDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNavDrawer.classList.remove("open");
        mobileNavToggle.classList.remove("open");
        mobileNavToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Outside click closes drawer
    document.addEventListener("click", (e) => {
      if (mobileNavDrawer.classList.contains("open")) {
        if (!mobileNavDrawer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
          mobileNavDrawer.classList.remove("open");
          mobileNavToggle.classList.remove("open");
          mobileNavToggle.setAttribute("aria-expanded", "false");
        }
      }
    });

    // Escape key closes drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavDrawer.classList.contains("open")) {
        mobileNavDrawer.classList.remove("open");
        mobileNavToggle.classList.remove("open");
        mobileNavToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 3. Category Filter & Live Search for Couture Collection
  const coutureFilterBar = document.getElementById("couture-filter-bar");
  const coutureCards = document.querySelectorAll(".couture-item-card");
  const collectionSearchInput = document.getElementById("collection-search-input");
  const btnClearSearch = document.getElementById("btn-clear-search");
  const searchCounterChip = document.getElementById("search-counter-chip");
  const activeFilterIndicator = document.getElementById("active-filter-indicator");
  const searchEmptyState = document.getElementById("search-empty-state");
  const btnResetFilters = document.getElementById("btn-reset-filters");

  let activeCategory = "all";

  function applyCollectionFilters() {
    if (!coutureCards.length) return;
    const query = collectionSearchInput ? collectionSearchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    coutureCards.forEach(card => {
      const category = card.dataset.category || "";
      const title = (card.dataset.title || "").toLowerCase();
      const keywords = (card.dataset.keywords || "").toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesCategory = (activeCategory === "all" || category === activeCategory);
      const matchesQuery = !query || title.includes(query) || keywords.includes(query) || text.includes(query);

      if (matchesCategory && matchesQuery) {
        card.classList.remove("is-filtered-out");
        visibleCount++;
      } else {
        card.classList.add("is-filtered-out");
      }
    });

    if (searchCounterChip) {
      searchCounterChip.textContent = `Showing ${visibleCount} Creation${visibleCount === 1 ? "" : "s"}`;
    }

    if (btnClearSearch) {
      btnClearSearch.style.display = query ? "block" : "none";
    }

    if (searchEmptyState) {
      searchEmptyState.style.display = (visibleCount === 0) ? "block" : "none";
    }
  }

  if (coutureFilterBar && coutureCards.length > 0) {
    coutureFilterBar.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        coutureFilterBar.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeCategory = pill.dataset.filter || "all";
        
        if (activeFilterIndicator) {
          activeFilterIndicator.textContent = `Category: ${pill.textContent.trim().replace(/\s*\(\d+\)/, "")}`;
        }
        applyCollectionFilters();
        showToast(`Filtered: ${pill.textContent.trim().replace(/\s*\(\d+\)/, "")}`);
      });
    });
  }

  if (collectionSearchInput) {
    collectionSearchInput.addEventListener("input", () => {
      applyCollectionFilters();
    });
  }

  if (btnClearSearch && collectionSearchInput) {
    btnClearSearch.addEventListener("click", () => {
      collectionSearchInput.value = "";
      applyCollectionFilters();
      collectionSearchInput.focus();
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener("click", () => {
      if (collectionSearchInput) collectionSearchInput.value = "";
      activeCategory = "all";
      if (coutureFilterBar) {
        coutureFilterBar.querySelectorAll(".filter-pill").forEach(p => {
          p.classList.toggle("active", p.dataset.filter === "all");
        });
      }
      if (activeFilterIndicator) {
        activeFilterIndicator.textContent = "Category: All Atelier Pieces";
      }
      applyCollectionFilters();
      showToast("Reset all search & category filters");
    });
  }

  // 4. Quick-Look Modal Handler
  document.querySelectorAll(".btn-open-quicklook").forEach(cardImg => {
    cardImg.addEventListener("click", (e) => {
      e.stopPropagation();
      const title = cardImg.dataset.title || "Artisanal Creation";
      const price = cardImg.dataset.price || "₹350";
      const img = cardImg.dataset.img || "";
      const quote = cardImg.dataset.quote || "";
      const desc = cardImg.dataset.desc || "";
      const badge = cardImg.dataset.badge || "Atelier Collection";
      const weight = cardImg.dataset.weight || "[150g Petite Individual]";
      const allergens = cardImg.dataset.allergens || "Wheat (Gluten), Dairy (Milk)";
      const storage = cardImg.dataset.storage || "Keep chilled at 4°C–8°C";
      currentQlTier = cardImg.dataset.tier === "tier-bento" ? "bento-noir" : (cardImg.dataset.tier || "mini-couture");
      currentQlFlavor = cardImg.dataset.flavor || "";

      if (qlTitle) qlTitle.textContent = title;
      if (qlPrice) qlPrice.textContent = price;
      if (qlImg) qlImg.src = img;
      if (qlQuote) qlQuote.textContent = quote ? `“${quote}”` : "";
      if (qlDesc) qlDesc.textContent = desc;
      if (qlBadge) qlBadge.textContent = badge;
      if (qlWeight) qlWeight.textContent = weight;
      if (qlAllergens) qlAllergens.textContent = allergens;
      if (qlStorage) qlStorage.textContent = storage;

      if (qlModal) qlModal.showModal();
    });
  });

  if (qlCloseBtn && qlModal) {
    qlCloseBtn.addEventListener("click", () => qlModal.close());
    qlModal.addEventListener("click", (e) => {
      if (e.target === qlModal) qlModal.close();
    });
  }

  if (qlCustomizeBtn) {
    qlCustomizeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (qlModal) qlModal.close();
      const builder = document.getElementById("custom-builder");
      if (builder) {
        if (currentQlTier) state.tierId = currentQlTier;
        if (currentQlFlavor) state.flavorId = currentQlFlavor;
        renderTiers();
        renderFlavors();
        updateSummary();
        builder.scrollIntoView({ behavior: "smooth" });
        showToast("Design loaded into Cake Atelier", "🎂");
      } else {
        const params = [];
        if (currentQlTier) params.push("tier=" + encodeURIComponent(currentQlTier));
        if (currentQlFlavor) params.push("flavor=" + encodeURIComponent(currentQlFlavor));
        window.location.href = "atelier.html?" + params.join("&");
      }
    });
  }

  // 5. Render Architectural Tiers (with Real Photo Thumbnails, Veg Marker & Weight)
  function renderTiers() {
    if (!tierContainer) return;
    tierContainer.innerHTML = HUCKLEBERRY_DATA.tiers.map(tier => `
      <div class="select-card tier-card ${tier.id === state.tierId ? "selected" : ""}" data-tier="${tier.id}">
        <div class="card-thumb-wrapper">
          <img src="${tier.image}" alt="${tier.name}" class="card-thumb-img" loading="lazy" />
          ${tier.popular ? `<span class="card-thumb-badge">${tier.tag}</span>` : ""}
        </div>
        <div class="card-content-wrapper">
          <div class="select-card-header">
            <div class="select-card-name" style="display:flex; align-items:center; gap:6px;">
              <span class="fssai-veg-marker" title="100% Eggless Pure Veg"></span>
              <span>${tier.name}</span>
            </div>
            ${tier.weightGrams ? `<span class="weight-badge">${tier.weightGrams}</span>` : ""}
          </div>
          <div class="select-card-desc">${tier.description}</div>
          <div class="select-card-meta">
            <span class="price-tag">₹${tier.basePrice.toLocaleString("en-IN")}</span>
            <span class="weight-tag">${tier.weightKg} • ${tier.servings}</span>
          </div>
        </div>
      </div>
    `).join("");

    tierContainer.querySelectorAll(".select-card").forEach(card => {
      card.addEventListener("click", () => {
        state.tierId = card.dataset.tier;
        renderTiers();
        updateSummary();
        showToast(`Scale selected: ${card.querySelector(".select-card-name span:last-child").textContent}`, "🎂");
      });
    });
  }

  // 6. Render Flavors (with Mouthwatering Cake Slice Photos)
  function renderFlavors() {
    if (!flavorContainer) return;
    flavorContainer.innerHTML = HUCKLEBERRY_DATA.flavors.map(flavor => `
      <div class="select-card flavor-card ${flavor.id === state.flavorId ? "selected" : ""}" data-flavor="${flavor.id}">
        ${flavor.image ? `
          <div class="card-thumb-wrapper flavor-thumb-wrapper">
            <img src="${flavor.image}" alt="${flavor.name}" class="card-thumb-img flavor-thumb-img" loading="lazy" />
            ${flavor.badge ? `<span class="card-thumb-badge">${flavor.badge}</span>` : ""}
          </div>
        ` : ""}
        <div class="card-content-wrapper">
          <div class="select-card-header">
            <div class="select-card-name">
              <span class="swatch-pip" style="background-color: ${flavor.colorHex}"></span>
              ${flavor.name}
            </div>
            ${flavor.priceAdd > 0 ? `<span class="price-addon-pill">+₹${flavor.priceAdd}</span>` : `<span class="price-addon-pill free">Included</span>`}
          </div>
          <div class="select-card-desc">${flavor.notes}</div>
        </div>
      </div>
    `).join("");

    flavorContainer.querySelectorAll(".select-card").forEach(card => {
      card.addEventListener("click", () => {
        state.flavorId = card.dataset.flavor;
        renderFlavors();
        updateSummary();
        showToast(`Flavour: ${card.querySelector(".select-card-name").textContent.trim()}`, "🍰");
      });
    });
  }

  // 7. Render Artisanal Finishes
  function renderFinishes() {
    if (!finishContainer) return;
    finishContainer.innerHTML = HUCKLEBERRY_DATA.finishes.map(finish => `
      <div class="select-card finish-card ${finish.id === state.finishId ? "selected" : ""}" data-finish="${finish.id}">
        <div class="select-card-header">
          <div class="select-card-name">${finish.name}</div>
          <span class="price-tag">+₹${finish.priceAdd}</span>
        </div>
        <div class="select-card-desc">${finish.desc}</div>
        <div class="select-card-meta">
          <span class="weight-tag">Hand-Piped Atelier Finish</span>
        </div>
      </div>
    `).join("");

    finishContainer.querySelectorAll(".select-card").forEach(card => {
      card.addEventListener("click", () => {
        state.finishId = card.dataset.finish;
        renderFinishes();
        updateSummary();
        showToast(`Decor: ${card.querySelector(".select-card-name").textContent}`, "🎀");
      });
    });
  }

  // 8. Render Delivery Zones
  function renderZones() {
    if (!zoneSelect) return;
    zoneSelect.innerHTML = HUCKLEBERRY_DATA.deliveryZones.map(z => `
      <option value="${z.pin}" ${z.pin === state.deliveryPin ? "selected" : ""}>
        ${z.zone} (${z.fee === 0 ? "Free Kitchen Pickup" : `+ ₹${z.fee} Delivery`})
      </option>
    `).join("");

    zoneSelect.addEventListener("change", (e) => {
      state.deliveryPin = e.target.value;
      updateSummary();
    });
  }

  // 9. Quick Select buttons from Showcase cards
  document.querySelectorAll(".btn-quick-select").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let tierTarget = btn.dataset.tier;
      if (tierTarget === "tier-bento") tierTarget = "bento-noir";
      const flavorTarget = btn.dataset.flavor;
      const builder = document.getElementById("custom-builder");

      if (builder) {
        e.preventDefault();
        e.stopPropagation();
        if (tierTarget) state.tierId = tierTarget;
        if (flavorTarget) state.flavorId = flavorTarget;
        renderTiers();
        renderFlavors();
        updateSummary();
        builder.scrollIntoView({ behavior: "smooth" });
        showToast("Loaded selection into Cake Atelier", "🎂");
      }
    });
  });

  // 10. Update Summary, Pricing and Dynamic Visualizer with Real Photo Preview
  function updateSummary() {
    const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + (flavor.priceAdd || 0) + (finish.priceAdd || 0) + (zone.fee || 0);
    const advance = Math.round(total * 0.5);

    // Sidebar text
    if (specTier) specTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (specFlavor) specFlavor.textContent = flavor.name;
    if (specFinish) specFinish.textContent = finish.name;
    if (specDietary) specDietary.textContent = state.isEggless ? "100% Eggless Pure Veg" : "Standard Recipe";
    if (specPlaque) specPlaque.textContent = state.customMessage.trim() ? `“${state.customMessage}”` : "None";
    if (specZone) specZone.textContent = zone.zone.split("(")[0].trim();
    if (specSlot) specSlot.textContent = `${state.deliveryDate} • ${state.deliverySlot.split("(")[0].trim()}`;

    if (totalPriceLabel) totalPriceLabel.textContent = `₹${total.toLocaleString("en-IN")}`;
    if (advancePriceLabel) advancePriceLabel.textContent = `₹${advance.toLocaleString("en-IN")}`;

    // Mobile bar
    if (mobileTier) mobileTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (mobilePrice) mobilePrice.textContent = `₹${total.toLocaleString("en-IN")}`;

    // Render Dynamic Live Visualizer with High-Res Photography
    renderCanvasTiers(tier, flavor, finish);
  }

  function renderCanvasTiers(tier, flavor, finish) {
    if (!cakeCanvas) return;
    const plaqueText = state.customMessage.slice(0, 26) || "Your Huckleberry";

    cakeCanvas.innerHTML = `
      <div class="visualizer-photo-showcase">
        <div class="visualizer-img-frame">
          <img src="${tier.image}" alt="${tier.name} Preview" class="visualizer-main-img" />
          <div class="visualizer-glass-badge">
            <div class="visualizer-badge-top">
              <span class="fssai-veg-marker" title="100% Pure Veg Eggless"></span>
              <span class="visualizer-tier-title">${tier.name}</span>
              <span class="visualizer-weight-pill">${tier.weightKg}</span>
            </div>
            <div class="visualizer-flavor-row">
              <span class="swatch-pip" style="background-color: ${flavor.colorHex}"></span>
              <span class="visualizer-flavor-name">${flavor.name}</span>
            </div>
            ${state.customMessage.trim() ? `
              <div class="visualizer-plaque-calligraphy">
                <span class="plaque-quote-symbol">“</span>
                <span class="plaque-script-text">${escapeHtml(plaqueText)}</span>
                <span class="plaque-quote-symbol">”</span>
              </div>
            ` : ""}
          </div>
        </div>
        <div class="visualizer-caption-bar">
          <span>${tier.servings} • ${finish ? finish.name : "Lambeth Ruffle"}</span>
          <span class="live-render-tag">Live Studio Visualizer</span>
        </div>
      </div>
    `;
  }

  // 11. Input Listeners
  if (egglessCheck) {
    egglessCheck.addEventListener("change", (e) => {
      state.isEggless = e.target.checked;
      if (egglessBadge) {
        egglessBadge.textContent = state.isEggless ? "100% Pure Veg Active" : "Standard Recipe";
        egglessBadge.style.background = state.isEggless ? "#EAF7EF" : "#F5EFEB";
        egglessBadge.style.color = state.isEggless ? "#1B7A43" : "#6B6264";
      }
      updateSummary();
      showToast(state.isEggless ? "100% Pure Veg (Eggless) confirmed" : "Standard recipe selected", "🌱");
    });
  }

  if (inscriptionInput) {
    inscriptionInput.addEventListener("input", (e) => {
      state.customMessage = e.target.value;
      updateSummary();
    });
  }

  if (dateInput) {
    dateInput.addEventListener("change", (e) => {
      state.deliveryDate = e.target.value;
      updateSummary();
    });
  }

  if (slotSelect) {
    slotSelect.addEventListener("change", (e) => {
      state.deliverySlot = e.target.value;
      updateSummary();
    });
  }

  // 12. Order Generator & WhatsApp Dispatch with UPI Payment QR Integration
  function generateOrderSlip() {
    const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + (flavor.priceAdd || 0) + (finish.priceAdd || 0) + (zone.fee || 0);
    const advance = Math.round(total * 0.5);
    const token = "HK-" + Math.floor(1000 + Math.random() * 9000);

    const message = 
`*CUSTOM CAKE RESERVATION - YOUR HUCKLEBERRY*
yourhuckleberry.in • Shafee Mohammed Road, Chennai
----------------------------------------
*Token:* #${token}
*Architecture:* ${tier.name} (${tier.weightKg} [${tier.weightGrams || ""}])
*Flavor Profile:* ${flavor.name}
*Artisanal Piping:* ${finish ? finish.name : "Vintage Lambeth"}
*Dietary Standard:* ${state.isEggless ? "100% Pure Veg (Eggless Recipe)" : "Standard Recipe"}
*Plaque Inscription:* "${state.customMessage || "Happy Celebration"}"
----------------------------------------
*Delivery / Pickup:* ${zone.zone}
*Celebration Date:* ${state.deliveryDate}
*Kitchen Slot:* ${state.deliverySlot}
----------------------------------------
*Estimated Total:* ₹${total.toLocaleString("en-IN")}
*Advance Deposit (50%):* ₹${advance.toLocaleString("en-IN")}
*Payee:* huckle berry (UPI ID: eoteatop@okicici)
*Storage Guidance:* ${tier.storage || "Keep chilled at 4°C–8°C"}
----------------------------------------
_Dispatched via yourhuckleberry.in (@huckleberry.inn)_
_Please confirm kitchen slot availability!_`;

    state.lastGeneratedSlip = message;

    const encoded = encodeURIComponent(message);
    const waNumber = (HUCKLEBERRY_DATA.brand && HUCKLEBERRY_DATA.brand.whatsappNumber) || "918511839668";
    const waLink = `https://wa.me/${waNumber}?text=${encoded}`;
    const upiLink = `upi://pay?pa=eoteatop@okicici&pn=huckle%20berry&am=${advance}&cu=INR&tn=Advance%20Token%20${token}`;

    if (dialogTokenId) dialogTokenId.textContent = `#${token}`;
    if (dialogPriceDisplay) {
      dialogPriceDisplay.innerHTML = `
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-plum-royal);">₹${total.toLocaleString("en-IN")}</div>
        <div style="font-size: 0.85rem; color: var(--color-gold-deep); font-weight: 600; margin-top: 2px;">
          50% Advance Deposit Required to Lock Slot: ₹${advance.toLocaleString("en-IN")}
        </div>
      `;
    }

    // Embed Dynamic Payment QR in Modal if container exists
    let modalQrWrap = document.getElementById("modal-qr-container");
    if (!modalQrWrap && orderDialog) {
      const inner = orderDialog.querySelector(".modal-inner-content");
      if (inner) {
        modalQrWrap = document.createElement("div");
        modalQrWrap.id = "modal-qr-container";
        modalQrWrap.className = "modal-payment-qr-card";
        inner.insertBefore(modalQrWrap, inner.querySelector(".modal-cta-stack"));
      }
    }

    if (modalQrWrap) {
      modalQrWrap.innerHTML = `
        <div class="qr-card-header">
          <span class="qr-step-chip">Step 1: Scan &amp; Pay Advance Deposit</span>
          <div class="qr-advance-amount">Pay ₹${advance.toLocaleString("en-IN")} via UPI</div>
        </div>
        <div class="qr-image-wrapper">
          <img src="assets/payment-qr.jpg" alt="UPI Payment QR Code for Your Huckleberry" class="modal-qr-img" />
          <div class="qr-payee-info">
            <span class="qr-payee-name">huckle berry</span>
            <div class="qr-upi-pill">
              <span class="upi-id-code">eoteatop@okicici</span>
              <button type="button" class="btn-copy-upi" data-upi="eoteatop@okicici" title="Copy UPI ID">
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
        <div class="qr-apps-row">
          <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span> • <span>iMobile</span>
        </div>
        <div class="qr-direct-pay-action">
          <a href="${upiLink}" class="btn-upi-app-link">
            <span>Pay ₹${advance.toLocaleString("en-IN")} Directly via UPI App</span>
          </a>
        </div>
      `;
    }

    if (dialogWaCta) {
      dialogWaCta.href = waLink;
      dialogWaCta.innerHTML = `<span>Step 2: Dispatch Slip &amp; Screenshot to WhatsApp ➔</span>`;
    }

    if (orderDialog) orderDialog.showModal();
  }

  if (dispatchBtn) dispatchBtn.addEventListener("click", generateOrderSlip);
  if (mobileWhatsAppBtn) mobileWhatsAppBtn.addEventListener("click", generateOrderSlip);

  if (closeDialogBtn && orderDialog) {
    closeDialogBtn.addEventListener("click", () => orderDialog.close());
    orderDialog.addEventListener("click", (e) => {
      if (e.target === orderDialog) orderDialog.close();
    });
  }

  // 13. Copy Booking Slip to Clipboard
  if (copySlipBtn) {
    copySlipBtn.addEventListener("click", async () => {
      try {
        if (state.lastGeneratedSlip) {
          await navigator.clipboard.writeText(state.lastGeneratedSlip);
          showToast("Booking details copied to clipboard!", "📋");
        }
      } catch (err) {
        showToast("Booking token: " + (dialogTokenId ? dialogTokenId.textContent : "#HK"), "ℹ️");
      }
    });
  }

  // 14. Global 1-Click Copy UPI Handler
  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".btn-copy-upi");
    if (copyBtn) {
      e.preventDefault();
      const upi = copyBtn.dataset.upi || "eoteatop@okicici";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(upi).then(() => {
          showToast(`UPI ID Copied: ${upi}`, "📋");
        }).catch(() => {
          showToast(`UPI ID: ${upi}`, "ℹ️");
        });
      } else {
        showToast(`UPI ID: ${upi}`, "ℹ️");
      }
    }
  });

  // 15. FAQ Accordion Exclusive Expand with Liquid Smooth Transition
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.removeAttribute("open");
          }
        });
      }
    });
  });

  // 16. Render Live Cloud Kitchen Orders Pipeline
  function renderKitchenOrders() {
    const container = document.getElementById("kitchen-orders-container");
    if (!container || !HUCKLEBERRY_DATA.liveOrders) return;
    container.innerHTML = HUCKLEBERRY_DATA.liveOrders.map(order => `
      <div class="order-pipeline-card" data-token="${order.id}">
        <div class="order-card-top">
          <span class="order-token-badge">#${order.id}</span>
          <span class="order-time-ago">${order.time}</span>
        </div>
        <div class="order-client-name">${escapeHtml(order.client)}</div>
        <div class="order-item-title">${escapeHtml(order.item)}</div>
        <div class="order-spec-summary">${escapeHtml(order.spec)} • <strong style="color:var(--color-plum-royal);">${order.price}</strong></div>
        <div class="order-progress-wrap">
          <div class="order-progress-bar-bg">
            <div class="order-progress-bar-fill" style="width: ${order.stagePercent || 80}%;"></div>
          </div>
          <div class="order-progress-status-row">
            <span class="order-stage-label">${escapeHtml(order.status)}</span>
            <span class="order-stage-pct">${order.stagePercent || 80}%</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  // 17. Token Tracker Lookup
  const tokenForm = document.getElementById("form-token-tracker");
  const tokenInput = document.getElementById("input-track-token");
  if (tokenForm && tokenInput) {
    tokenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = tokenInput.value.trim().toUpperCase().replace("#", "");
      if (!raw) {
        showToast("Please enter an order token (e.g. HK-4912)", "ℹ️");
        return;
      }
      const fullToken = raw.startsWith("HK-") ? raw : `HK-${raw}`;
      const found = HUCKLEBERRY_DATA.liveOrders.find(o => o.id === fullToken || o.id === raw);
      if (found) {
        showToast(`Token #${found.id}: ${found.status} (${found.stagePercent}%)`, "✨");
        const card = document.querySelector(`.order-pipeline-card[data-token="${found.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.style.borderColor = "var(--color-gold-champagne)";
          card.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.4)";
          setTimeout(() => {
            card.style.borderColor = "";
            card.style.boxShadow = "";
          }, 3500);
        }
      } else {
        showToast(`Token #${fullToken} verified in kitchen queue (Baking & Prep)`, "👨‍🍳");
      }
    });
  }

  // Utilities
  function getTomorrowDateString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[tag] || tag));
  }

  // Initial Load
  renderTiers();
  renderFlavors();
  renderFinishes();
  renderZones();
  renderKitchenOrders();
  updateSummary();
});
