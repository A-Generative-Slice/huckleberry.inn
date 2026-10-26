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
    customMessage: "",
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

  // Toast Container
  const toastContainer = document.getElementById("toast-container");

  // Mobile Nav Elements
  const mobileNavToggle = document.getElementById("btn-mobile-nav");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");

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

  // 2. Mobile Navigation Toggle with Backdrop, Outside-Click & Escape Dismiss
  function closeMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove("open");
    if (mobileNavToggle) {
      mobileNavToggle.classList.remove("open");
      mobileNavToggle.setAttribute("aria-expanded", "false");
    }
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (mobileNavDrawer) mobileNavDrawer.classList.add("open");
    if (mobileNavToggle) {
      mobileNavToggle.classList.add("open");
      mobileNavToggle.setAttribute("aria-expanded", "true");
    }
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains("open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (mobileNavBackdrop) {
      mobileNavBackdrop.addEventListener("click", () => {
        closeMobileNav();
      });
    }

    mobileNavDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        closeMobileNav();
      });
    });

    // Outside click closes drawer
    document.addEventListener("click", (e) => {
      if (mobileNavDrawer.classList.contains("open")) {
        if (!mobileNavDrawer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
          closeMobileNav();
        }
      }
    });

    // Escape key closes drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavDrawer.classList.contains("open")) {
        closeMobileNav();
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

    const promoCard = document.querySelector(".everyday-promo-card");
    if (promoCard) {
      if ((activeCategory === "all" || activeCategory === "everyday") && !query) {
        promoCard.style.display = "flex";
      } else {
        promoCard.style.display = "none";
      }
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

  // 4. Direct Card Click Navigation to Atelier or WhatsApp (Zero Modal Friction)
  document.querySelectorAll(".couture-item-card").forEach(card => {
    const cardImg = card.querySelector(".couture-card-img");
    const quickSelectBtn = card.querySelector(".btn-quick-select");
    const everydayBtn = card.querySelector(".btn-everyday-order");
    
    if (cardImg) {
      cardImg.style.cursor = "pointer";
      cardImg.addEventListener("click", () => {
        if (everydayBtn) {
          everydayBtn.click();
        } else if (quickSelectBtn) {
          quickSelectBtn.click();
        }
      });
    }
  });

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
        ${z.zone} ${z.fee > 0 ? `(+₹${z.fee} Delivery)` : ""}
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

    const custName = (document.getElementById("cust-name")?.value || "").trim();
    const custPhone = (document.getElementById("cust-phone")?.value || "").trim();
    const custAddress = (document.getElementById("cust-address")?.value || "").trim();

    let customerBlock = "";
    if (custName || custPhone || custAddress) {
      customerBlock = 
`*Customer Details:*
• Name: ${custName || "Guest"}
• Phone: ${custPhone || "Via WhatsApp"}
${custAddress ? `• Delivery Address: ${custAddress}\n` : ""}----------------------------------------
`;
    }

    const message = 
`*CUSTOM CAKE RESERVATION - YOUR HUCKLEBERRY*
yourhuckleberry.in • Shafee Mohammed Road, Chennai
----------------------------------------
*Token:* #${token}
*Cake Size:* ${tier.name} (${tier.weightKg} • ${tier.weightGrams || ""})
*Flavor:* ${flavor.name}
*Design Style:* ${finish ? finish.name : "Vintage Lambeth"}
*Dietary:* ${state.isEggless ? "100% Pure Veg (Eggless Recipe)" : "Standard Recipe"}
*Message on Cake:* "${state.customMessage || "None"}"
----------------------------------------
${customerBlock}*Delivery / Pickup:* ${zone.zone}
*Delivery Date:* ${state.deliveryDate}
*Delivery Time Slot:* ${state.deliverySlot}
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

  // 16. Token Tracker Lookup & Live Kitchen Concierge Check
  const tokenForm = document.getElementById("form-token-tracker");
  const tokenInput = document.getElementById("input-track-token");
  const tokenResult = document.getElementById("token-status-result");

  if (tokenForm && tokenInput) {
    tokenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = tokenInput.value.trim().toUpperCase().replace("#", "");
      if (!raw) {
        showToast("Please enter your booking token (e.g. HK-4912)", "ℹ️");
        return;
      }
      const fullToken = raw.startsWith("HK-") ? raw : `HK-${raw}`;
      showToast(`Token #${fullToken} located`, "✨");

      if (tokenResult) {
        tokenResult.style.display = "block";
        const waMsg = `Hello Your Huckleberry! I would like to check the baking and dispatch status of my order token #${fullToken}.`;
        tokenResult.innerHTML = `
          <div class="order-pipeline-card" style="border: 2px solid var(--color-gold-deep); box-shadow: 0 10px 30px rgba(44, 17, 51, 0.12); padding: 22px;">
            <div class="order-card-top" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="order-token-badge" style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; background: var(--color-plum-royal); padding: 4px 12px; border-radius: 20px;">#${escapeHtml(fullToken)}</span>
              <span style="color: #2E7D32; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 5px;">
                <span class="fssai-veg-marker"></span> 100% Eggless Pure Veg
              </span>
            </div>
            <div style="font-family: var(--font-editorial); font-size: 1.25rem; color: var(--color-plum-royal); font-weight: 600; margin-bottom: 6px;">
              Order Token Confirmed in Kitchen
            </div>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 16px;">
              Your reservation is registered at our Shafee Mohammed Road atelier. For real-time oven progress and instant dispatch ETA, tap below to message our pastry chef.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <a href="https://wa.me/918511839668?text=${encodeURIComponent(waMsg)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="flex: 1; min-width: 200px; text-align: center;">
                <span>Live Update via WhatsApp ➔</span>
              </a>
              <a href="tel:+918511839668" class="btn btn-secondary btn-sm" style="display: flex; align-items: center;">
                <span>Call Kitchen</span>
              </a>
            </div>
          </div>
        `;
        tokenResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  updateSummary();
});
