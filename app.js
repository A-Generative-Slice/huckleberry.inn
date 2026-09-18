/**
 * Your Huckleberry (@huckleberry.inn) - Luxury Atelier & Cloud Kitchen App
 * Shafee Mohammed Road, Thousand Lights / Nungambakkam, Chennai
 * Powered by A Generative Slice
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    tierId: 'tier-2',
    flavorId: 'lychee-rose',
    finishId: 'vintage-lambeth',
    isEggless: true,
    customMessage: 'Happy Celebration',
    deliveryPin: '600006',
    deliveryDate: getTomorrowDateString(),
    deliverySlot: '4:00 PM – 6:00 PM (Fresh Evening)'
  };

  // DOM Elements
  const tierContainer = document.getElementById('tier-cards-container');
  const flavorContainer = document.getElementById('flavor-cards-container');
  const finishContainer = document.getElementById('finish-cards-container');
  const zoneSelect = document.getElementById('select-zone');
  const cakeCanvas = document.getElementById('dynamic-cake-canvas');

  // Spec Summary Elements
  const specTier = document.getElementById('spec-tier-text');
  const specFlavor = document.getElementById('spec-flavor-text');
  const specFinish = document.getElementById('spec-finish-text');
  const specDietary = document.getElementById('spec-dietary-text');
  const specPlaque = document.getElementById('spec-plaque-text');
  const specZone = document.getElementById('spec-zone-text');
  const specSlot = document.getElementById('spec-slot-text');
  const totalPriceLabel = document.getElementById('label-total-price');
  const advancePriceLabel = document.getElementById('label-advance-price');

  // Mobile Bar Elements
  const mobileTier = document.getElementById('mobile-bar-tier');
  const mobilePrice = document.getElementById('mobile-bar-price');
  const mobileWhatsAppBtn = document.getElementById('btn-mobile-whatsapp');

  // Inputs
  const egglessCheck = document.getElementById('chk-eggless');
  const inscriptionInput = document.getElementById('txt-inscription');
  const dateInput = document.getElementById('date-delivery');
  const slotSelect = document.getElementById('slot-delivery');

  // Modal Elements
  const dispatchBtn = document.getElementById('btn-dispatch-whatsapp');
  const orderDialog = document.getElementById('order-modal-dialog');
  const closeDialogBtn = document.getElementById('btn-close-dialog');
  const dialogTokenId = document.getElementById('dialog-token-id');
  const dialogPriceDisplay = document.getElementById('dialog-price-display');
  const dialogWaCta = document.getElementById('dialog-wa-cta');

  // Initialize Date Input
  if (dateInput) {
    dateInput.min = getTomorrowDateString();
    dateInput.value = state.deliveryDate;
  }

  // 1. Render Architectural Tiers
  function renderTiers() {
    if (!tierContainer) return;
    tierContainer.innerHTML = HUCKLEBERRY_DATA.tiers.map(tier => `
      <div class="select-card ${tier.id === state.tierId ? 'selected' : ''}" data-tier="${tier.id}">
        <div class="select-card-header">
          <div class="select-card-name">${tier.name}</div>
          ${tier.popular ? `<span class="select-card-badge">${tier.tag}</span>` : ''}
        </div>
        <div class="select-card-desc">${tier.description}</div>
        <div class="select-card-meta">
          <span class="price-tag">₹${tier.basePrice.toLocaleString('en-IN')}</span>
          <span class="weight-tag">${tier.weightKg} • ${tier.servings}</span>
        </div>
      </div>
    `).join('');

    tierContainer.querySelectorAll('.select-card').forEach(card => {
      card.addEventListener('click', () => {
        state.tierId = card.dataset.tier;
        renderTiers();
        updateSummary();
      });
    });
  }

  // 2. Render Flavors
  function renderFlavors() {
    if (!flavorContainer) return;
    flavorContainer.innerHTML = HUCKLEBERRY_DATA.flavors.map(flavor => `
      <div class="select-card ${flavor.id === state.flavorId ? 'selected' : ''}" data-flavor="${flavor.id}">
        <div class="select-card-header">
          <div class="select-card-name">
            <span class="swatch-pip" style="background-color: ${flavor.colorHex}"></span>
            ${flavor.name}
          </div>
          ${flavor.badge ? `<span class="select-card-badge">${flavor.badge}</span>` : ''}
        </div>
        <div class="select-card-desc">${flavor.notes}</div>
        <div class="select-card-meta">
          <span class="price-tag">${flavor.priceAdd > 0 ? `+ ₹${flavor.priceAdd}` : 'Included'}</span>
          <span class="weight-tag">Pastry Chef Recipe</span>
        </div>
      </div>
    `).join('');

    flavorContainer.querySelectorAll('.select-card').forEach(card => {
      card.addEventListener('click', () => {
        state.flavorId = card.dataset.flavor;
        renderFlavors();
        updateSummary();
      });
    });
  }

  // 3. Render Finishes
  function renderFinishes() {
    if (!finishContainer) return;
    finishContainer.innerHTML = HUCKLEBERRY_DATA.finishes.map(finish => `
      <div class="select-card ${finish.id === state.finishId ? 'selected' : ''}" data-finish="${finish.id}">
        <div class="select-card-header">
          <div class="select-card-name">${finish.name}</div>
        </div>
        <div class="select-card-desc">${finish.desc}</div>
        <div class="select-card-meta">
          <span class="price-tag">+ ₹${finish.priceAdd}</span>
          <span class="weight-tag">Hand-Piped</span>
        </div>
      </div>
    `).join('');

    finishContainer.querySelectorAll('.select-card').forEach(card => {
      card.addEventListener('click', () => {
        state.finishId = card.dataset.finish;
        renderFinishes();
        updateSummary();
      });
    });
  }

  // 4. Render Delivery Zones
  function renderZones() {
    if (!zoneSelect) return;
    zoneSelect.innerHTML = HUCKLEBERRY_DATA.deliveryZones.map(z => `
      <option value="${z.pin}" ${z.pin === state.deliveryPin ? 'selected' : ''}>
        ${z.zone} (${z.fee === 0 ? 'Free Kitchen Pickup' : `+ ₹${z.fee} Delivery`})
      </option>
    `).join('');

    zoneSelect.addEventListener('change', (e) => {
      state.deliveryPin = e.target.value;
      updateSummary();
    });
  }

  // 5. Quick Select buttons from Showcase cards
  document.querySelectorAll('.btn-quick-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const tierTarget = btn.dataset.tier;
      if (tierTarget) {
        state.tierId = tierTarget;
        renderTiers();
        updateSummary();
        const builder = document.getElementById('custom-builder');
        if (builder) builder.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 6. Update Summary, Pricing and Dynamic Visualizer
  function updateSummary() {
    const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + flavor.priceAdd + finish.priceAdd + zone.fee;
    const advance = Math.round(total * 0.5);

    // Sidebar text
    if (specTier) specTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (specFlavor) specFlavor.textContent = flavor.name;
    if (specFinish) specFinish.textContent = finish.name;
    if (specDietary) specDietary.textContent = state.isEggless ? '100% Eggless Recipe' : 'Standard Recipe';
    if (specPlaque) specPlaque.textContent = state.customMessage.trim() ? `“${state.customMessage}”` : 'None';
    if (specZone) specZone.textContent = zone.zone.split('(')[0].trim();
    if (specSlot) specSlot.textContent = `${state.deliveryDate} • ${state.deliverySlot.split('(')[0].trim()}`;

    if (totalPriceLabel) totalPriceLabel.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (advancePriceLabel) advancePriceLabel.textContent = `₹${advance.toLocaleString('en-IN')}`;

    // Mobile bar
    if (mobileTier) mobileTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (mobilePrice) mobilePrice.textContent = `₹${total.toLocaleString('en-IN')}`;

    // Render Canvas Tiers
    renderCanvasTiers(tier, flavor);
  }

  function renderCanvasTiers(tier, flavor) {
    if (!cakeCanvas) return;
    const frostingColor = flavor.frostingHex || '#FCECEF';
    const spongeColor = flavor.colorHex || '#EAC1C8';
    const plaqueText = state.customMessage.slice(0, 26) || 'Your Huckleberry';

    let markup = '';

    if (tier.id === 'mini-couture') {
      markup = `
        <div class="canvas-cake-stand">
          <div class="canvas-topper-pill">Mini Couture Box</div>
          <div class="cake-tier-block tier-block-top" style="background: ${frostingColor}; border-top: 4px solid ${spongeColor}; width: 85px; height: 36px; border-radius: 4px;"></div>
          <div class="cake-stand-pedestal" style="width: 140px; height: 7px;"></div>
        </div>
      `;
    } else if (tier.id === 'bento-noir') {
      markup = `
        <div class="canvas-cake-stand">
          <div class="canvas-topper-pill">${escapeHtml(plaqueText)}</div>
          <div class="cake-tier-block tier-block-base" style="background: #1C1819; border: 2px solid #C29557; width: 130px; height: 44px; border-radius: 6px;"></div>
          <div class="cake-stand-pedestal" style="width: 170px;"></div>
        </div>
      `;
    } else if (tier.id === 'tier-1') {
      markup = `
        <div class="canvas-cake-stand">
          <div class="canvas-topper-pill">${escapeHtml(plaqueText)}</div>
          <div class="cake-tier-block tier-block-base" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor}; width: 170px; height: 60px;"></div>
          <div class="cake-stand-pedestal" style="width: 210px;"></div>
        </div>
      `;
    } else {
      // Two-Tier
      markup = `
        <div class="canvas-cake-stand">
          <div class="canvas-topper-pill">${escapeHtml(plaqueText)}</div>
          <div class="cake-tier-block tier-block-top" style="background: ${frostingColor}; border-top: 4px solid ${spongeColor};"></div>
          <div class="cake-tier-block tier-block-base" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor};"></div>
          <div class="cake-stand-pedestal"></div>
        </div>
      `;
    }

    cakeCanvas.innerHTML = markup;
  }

  // 7. Input Listeners
  if (egglessCheck) {
    egglessCheck.addEventListener('change', (e) => {
      state.isEggless = e.target.checked;
      updateSummary();
    });
  }

  if (inscriptionInput) {
    inscriptionInput.addEventListener('input', (e) => {
      state.customMessage = e.target.value;
      updateSummary();
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      state.deliveryDate = e.target.value;
      updateSummary();
    });
  }

  if (slotSelect) {
    slotSelect.addEventListener('change', (e) => {
      state.deliverySlot = e.target.value;
      updateSummary();
    });
  }

  // 8. Order Generator & WhatsApp Dispatch
  function triggerOrder() {
    const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + flavor.priceAdd + finish.priceAdd + zone.fee;
    const advance = Math.round(total * 0.5);
    const token = 'HK-' + Math.floor(1000 + Math.random() * 9000);

    const message = 
`🎂 *CUSTOM CAKE RESERVATION - YOUR HUCKLEBERRY*
@huckleberry.inn • Shafee Mohammed Road, Chennai
----------------------------------------
*Token:* #${token}
*Architecture:* ${tier.name} (${tier.weightKg})
*Flavor Profile:* ${flavor.name}
*Artisanal Piping:* ${finish.name}
*Dietary:* ${state.isEggless ? '100% Eggless Recipe' : 'Standard Recipe'}
*Plaque Message:* "${state.customMessage || 'Happy Celebration'}"
----------------------------------------
*Zone:* ${zone.zone}
*Date:* ${state.deliveryDate}
*Kitchen Slot:* ${state.deliverySlot}
----------------------------------------
*Estimated Total:* ₹${total.toLocaleString('en-IN')}
*Advance Deposit (50%):* ₹${advance.toLocaleString('en-IN')}
----------------------------------------
_Dispatched via Your Huckleberry Direct Portal (@huckleberry.inn)_
_Please confirm kitchen slot availability!_`;

    const encoded = encodeURIComponent(message);
    const waNumber = (HUCKLEBERRY_DATA.brand && HUCKLEBERRY_DATA.brand.whatsappNumber) || (HUCKLEBERRY_DATA.bakery && HUCKLEBERRY_DATA.bakery.whatsappNumber) || '918511839668';
    const waLink = `https://wa.me/${waNumber}?text=${encoded}`;

    if (dialogTokenId) dialogTokenId.textContent = `#${token}`;
    if (dialogPriceDisplay) dialogPriceDisplay.textContent = `₹${total.toLocaleString('en-IN')} (Advance Deposit: ₹${advance.toLocaleString('en-IN')})`;
    if (dialogWaCta) dialogWaCta.href = waLink;

    if (orderDialog) orderDialog.showModal();
  }

  if (dispatchBtn) dispatchBtn.addEventListener('click', triggerOrder);
  if (mobileWhatsAppBtn) mobileWhatsAppBtn.addEventListener('click', triggerOrder);

  if (closeDialogBtn && orderDialog) {
    closeDialogBtn.addEventListener('click', () => orderDialog.close());
  }

  // Utilities
  function getTomorrowDateString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Initial Load
  renderTiers();
  renderFlavors();
  renderFinishes();
  renderZones();
  updateSummary();
});
