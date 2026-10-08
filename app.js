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
    deliverySlot: '4:00 PM – 6:00 PM (Fresh Evening)',
    lastGeneratedSlip: ''
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
  const egglessBadge = document.getElementById('eggless-badge');
  const inscriptionInput = document.getElementById('txt-inscription');
  const dateInput = document.getElementById('date-delivery');
  const slotSelect = document.getElementById('slot-delivery');

  // Modal Elements
  const dispatchBtn = document.getElementById('btn-dispatch-whatsapp');
  const orderDialog = document.getElementById('order-modal-dialog');
  const closeDialogBtn = document.getElementById('btn-close-dialog');
  const copySlipBtn = document.getElementById('btn-copy-slip');
  const dialogTokenId = document.getElementById('dialog-token-id');
  const dialogPriceDisplay = document.getElementById('dialog-price-display');
  const dialogWaCta = document.getElementById('dialog-wa-cta');

  // Quick-Look Elements
  const qlModal = document.getElementById('quick-look-modal');
  const qlCloseBtn = document.getElementById('btn-close-ql');
  const qlTitle = document.getElementById('ql-title');
  const qlBadge = document.getElementById('ql-badge');
  const qlImg = document.getElementById('ql-img');
  const qlQuote = document.getElementById('ql-quote');
  const qlDesc = document.getElementById('ql-desc');
  const qlPrice = document.getElementById('ql-price');
  const qlCustomizeBtn = document.getElementById('btn-ql-customize');
  let currentQlTier = 'mini-couture';

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // Mobile Nav Elements
  const mobileNavToggle = document.getElementById('btn-mobile-nav');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  // Initialize Date Input
  if (dateInput) {
    dateInput.min = getTomorrowDateString();
    dateInput.value = state.deliveryDate;
  }

  // 1. Toast Notification Utility
  function showToast(message, icon = '✨') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-pill';
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  // 2. Mobile Navigation Toggle
  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.toggle('open');
      mobileNavToggle.classList.toggle('open', isOpen);
    });

    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileNavToggle.classList.remove('open');
      });
    });
  }

  // 3. Category Filter Pills for Couture Collection
  const coutureFilterBar = document.getElementById('couture-filter-bar');
  const coutureCards = document.querySelectorAll('.couture-item-card');

  if (coutureFilterBar && coutureCards.length > 0) {
    coutureFilterBar.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        coutureFilterBar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        coutureCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-filtered-out');
          } else {
            card.classList.add('is-filtered-out');
          }
        });

        showToast(`Filtered: ${pill.textContent.trim()}`);
      });
    });
  }

  // 4. Quick-Look Modal Handler
  document.querySelectorAll('.btn-open-quicklook').forEach(cardImg => {
    cardImg.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = cardImg.dataset.title || 'Artisanal Creation';
      const price = cardImg.dataset.price || '₹350';
      const img = cardImg.dataset.img || '';
      const quote = cardImg.dataset.quote || '';
      const desc = cardImg.dataset.desc || '';
      const badge = cardImg.dataset.badge || 'Atelier Collection';
      currentQlTier = cardImg.dataset.tier || 'mini-couture';

      if (qlTitle) qlTitle.textContent = title;
      if (qlPrice) qlPrice.textContent = price;
      if (qlImg) qlImg.src = img;
      if (qlQuote) qlQuote.textContent = quote ? `“${quote}”` : '';
      if (qlDesc) qlDesc.textContent = desc;
      if (qlBadge) qlBadge.textContent = badge;

      if (qlModal) qlModal.showModal();
    });
  });

  if (qlCloseBtn && qlModal) {
    qlCloseBtn.addEventListener('click', () => qlModal.close());
    qlModal.addEventListener('click', (e) => {
      if (e.target === qlModal) qlModal.close();
    });
  }

  if (qlCustomizeBtn) {
    qlCustomizeBtn.addEventListener('click', () => {
      if (qlModal) qlModal.close();
      state.tierId = currentQlTier;
      renderTiers();
      updateSummary();
      const builder = document.getElementById('custom-builder');
      if (builder) {
        builder.scrollIntoView({ behavior: 'smooth' });
        showToast('Design loaded into Cake Atelier', '🎂');
      }
    });
  }

  // 5. Render Architectural Tiers
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
        showToast(`Scale selected: ${card.querySelector('.select-card-name').textContent}`, '🎂');
      });
    });
  }

  // 6. Render Flavors
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
        showToast(`Flavor: ${card.querySelector('.select-card-name').textContent.trim()}`, '🍓');
      });
    });
  }

  // 7. Render Finishes
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
        showToast(`Decor: ${card.querySelector('.select-card-name').textContent}`, '✨');
      });
    });
  }

  // 8. Render Delivery Zones
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

  // 9. Quick Select buttons from Showcase cards
  document.querySelectorAll('.btn-quick-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tierTarget = btn.dataset.tier;
      if (tierTarget) {
        state.tierId = tierTarget;
        renderTiers();
        updateSummary();
        const builder = document.getElementById('custom-builder');
        if (builder) {
          builder.scrollIntoView({ behavior: 'smooth' });
          showToast('Loaded design into Cake Atelier', '🎂');
        }
      }
    });
  });

  // 10. Update Summary, Pricing and Dynamic Visualizer
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
    const plaqueText = state.customMessage.slice(0, 24) || 'Your Huckleberry';

    let markup = '';

    if (tier.id === 'mini-couture') {
      markup = `
        <div class="canvas-cake-stand" title="Mini Couture Luxury Box">
          <div class="canvas-topper-pill">Mini Couture Acrylic Set</div>
          <div class="cake-tier-block tier-block-top" style="background: ${frostingColor}; border-top: 4px solid ${spongeColor}; width: 88px; height: 38px; border-radius: 4px;"></div>
          <div class="cake-stand-pedestal" style="width: 145px; height: 8px;"></div>
        </div>
      `;
    } else if (tier.id === 'bento-noir') {
      markup = `
        <div class="canvas-cake-stand" title="Noir Velvet Bento Celebration">
          <div class="canvas-topper-pill">${escapeHtml(plaqueText)}</div>
          <div class="cake-tier-block tier-block-base" style="background: #1C1819; border: 2px solid #C29557; width: 135px; height: 46px; border-radius: 6px;"></div>
          <div class="cake-stand-pedestal" style="width: 175px;"></div>
        </div>
      `;
    } else if (tier.id === 'tier-1') {
      markup = `
        <div class="canvas-cake-stand" title="Single Tier Classic Celebration">
          <div class="canvas-topper-pill">${escapeHtml(plaqueText)}</div>
          <div class="cake-tier-block tier-block-base" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor}; width: 175px; height: 62px;"></div>
          <div class="cake-stand-pedestal" style="width: 215px;"></div>
        </div>
      `;
    } else {
      // Two-Tier Milestone
      markup = `
        <div class="canvas-cake-stand" title="Two-Tier Grand Milestone Centerpiece">
          <div class="canvas-topper-pill">${escapeHtml(plaqueText)}</div>
          <div class="cake-tier-block tier-block-top" style="background: ${frostingColor}; border-top: 4px solid ${spongeColor};"></div>
          <div class="cake-tier-block tier-block-base" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor};"></div>
          <div class="cake-stand-pedestal"></div>
        </div>
      `;
    }

    cakeCanvas.innerHTML = markup;
  }

  // Interactive Click on Canvas Stand
  if (cakeCanvas) {
    cakeCanvas.addEventListener('click', () => {
      showToast('🍰 Centerpiece customized for your celebration!', '✨');
    });
  }

  // 11. Input Listeners
  if (egglessCheck) {
    egglessCheck.addEventListener('change', (e) => {
      state.isEggless = e.target.checked;
      if (egglessBadge) {
        egglessBadge.textContent = state.isEggless ? '🌿 Pure Veg Active' : 'Standard Recipe';
        egglessBadge.style.background = state.isEggless ? '#EAF7EF' : '#F5EFEB';
        egglessBadge.style.color = state.isEggless ? '#1B7A43' : '#6B6264';
      }
      updateSummary();
      showToast(state.isEggless ? '🌿 100% Eggless recipe confirmed' : 'Standard recipe selected');
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

  // 12. Order Generator & WhatsApp Dispatch
  function generateOrderSlip() {
    const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + flavor.priceAdd + finish.priceAdd + zone.fee;
    const advance = Math.round(total * 0.5);
    const token = 'HK-' + Math.floor(1000 + Math.random() * 9000);

    const message = 
`🎂 *CUSTOM CAKE RESERVATION - YOUR HUCKLEBERRY*
yourhuckleberry.in • Shafee Mohammed Road, Chennai
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
_Dispatched via yourhuckleberry.in (@huckleberry.inn)_
_Please confirm kitchen slot availability!_`;

    state.lastGeneratedSlip = message;

    const encoded = encodeURIComponent(message);
    const waNumber = (HUCKLEBERRY_DATA.brand && HUCKLEBERRY_DATA.brand.whatsappNumber) || '918511839668';
    const waLink = `https://wa.me/${waNumber}?text=${encoded}`;

    if (dialogTokenId) dialogTokenId.textContent = `#${token}`;
    if (dialogPriceDisplay) dialogPriceDisplay.textContent = `₹${total.toLocaleString('en-IN')} (Advance Deposit: ₹${advance.toLocaleString('en-IN')})`;
    if (dialogWaCta) dialogWaCta.href = waLink;

    if (orderDialog) orderDialog.showModal();
  }

  if (dispatchBtn) dispatchBtn.addEventListener('click', generateOrderSlip);
  if (mobileWhatsAppBtn) mobileWhatsAppBtn.addEventListener('click', generateOrderSlip);

  if (closeDialogBtn && orderDialog) {
    closeDialogBtn.addEventListener('click', () => orderDialog.close());
    orderDialog.addEventListener('click', (e) => {
      if (e.target === orderDialog) orderDialog.close();
    });
  }

  // 13. Copy Booking Slip to Clipboard
  if (copySlipBtn) {
    copySlipBtn.addEventListener('click', async () => {
      try {
        if (state.lastGeneratedSlip) {
          await navigator.clipboard.writeText(state.lastGeneratedSlip);
          showToast('📋 Booking details copied to clipboard!', '✅');
        }
      } catch (err) {
        showToast('Booking token: ' + (dialogTokenId ? dialogTokenId.textContent : '#HK'), '📋');
      }
    });
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
