/**
 * Your Huckleberry (@huckleberry.inn) - Cloud Kitchen Interactive App
 * Powered by A Generative Slice
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current Builder State
  const state = {
    tierId: 'tier-2',
    flavorId: 'lychee-rose',
    finishId: 'vintage-lambeth',
    isEggless: true,
    isVegan: false,
    customMessage: 'Happy Birthday Sarah! ✨',
    deliveryPin: '600006',
    deliveryDate: getTomorrowDateString(),
    deliverySlot: '4:00 PM – 6:00 PM (Fresh Evening Batch)',
    addonPlaque: true,
    addonCandles: false,
    addonGoldLeaf: false
  };

  // DOM Elements Cache
  const tierContainer = document.getElementById('tier-options-container');
  const flavorContainer = document.getElementById('flavor-options-container');
  const finishContainer = document.getElementById('finish-options-container');
  const deliverySelect = document.getElementById('delivery-zone-select');
  const galleryContainer = document.getElementById('gallery-container');
  const galleryFilterBtns = document.querySelectorAll('.filter-btn');

  // Summary Elements
  const cakeCanvas = document.getElementById('cake-canvas');
  const summaryTier = document.getElementById('summary-tier');
  const summaryFlavor = document.getElementById('summary-flavor');
  const summaryFinish = document.getElementById('summary-finish');
  const summaryDietary = document.getElementById('summary-dietary');
  const summaryMessage = document.getElementById('summary-message');
  const summaryDelivery = document.getElementById('summary-delivery');
  const summarySlot = document.getElementById('summary-slot');
  const totalAmountEl = document.getElementById('total-amount');
  const advanceAmountEl = document.getElementById('advance-amount');

  // Inputs
  const egglessToggle = document.getElementById('toggle-eggless');
  const customMessageInput = document.getElementById('input-custom-message');
  const deliveryDateInput = document.getElementById('input-delivery-date');
  const deliverySlotSelect = document.getElementById('select-delivery-slot');
  const addonPlaqueCheck = document.getElementById('check-addon-plaque');
  const addonCandlesCheck = document.getElementById('check-addon-candles');
  const addonGoldLeafCheck = document.getElementById('check-addon-goldleaf');

  // Action Buttons & Modals
  const btnWhatsapp = document.getElementById('btn-whatsapp-dispatch');
  const orderModal = document.getElementById('order-confirmation-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const kitchenDrawer = document.getElementById('kitchen-ops-drawer');
  const drawerHeader = document.getElementById('drawer-header');
  const navKitchenToggle = document.getElementById('btn-nav-kitchen');
  const opsOrdersList = document.getElementById('ops-orders-list');
  const btnSimulateOrder = document.getElementById('btn-simulate-order');

  // Initialize Date Input Default (Tomorrow)
  if (deliveryDateInput) {
    deliveryDateInput.min = getTomorrowDateString();
    deliveryDateInput.value = state.deliveryDate;
  }

  // 1. Render Tiers
  function renderTiers() {
    if (!tierContainer) return;
    tierContainer.innerHTML = HUCKLEBERRY_DATA.tiers.map(tier => `
      <div class="option-card ${tier.id === state.tierId ? 'active' : ''}" data-tier-id="${tier.id}">
        ${tier.popular ? `<span class="option-badge">${tier.tag}</span>` : ''}
        <div>
          <div class="option-name">${tier.name}</div>
          <div class="option-desc">${tier.description}</div>
        </div>
        <div class="option-meta">
          <span class="price">₹${tier.basePrice.toLocaleString('en-IN')}</span>
          <span class="servings">⚖️ ${tier.weightKg} (${tier.servings})</span>
        </div>
      </div>
    `).join('');

    tierContainer.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        state.tierId = card.dataset.tierId;
        renderTiers();
        updateSummaryAndVisualizer();
      });
    });
  }

  // 2. Render Flavors
  function renderFlavors() {
    if (!flavorContainer) return;
    flavorContainer.innerHTML = HUCKLEBERRY_DATA.flavors.map(flavor => `
      <div class="option-card ${flavor.id === state.flavorId ? 'active' : ''}" data-flavor-id="${flavor.id}">
        ${flavor.badge ? `<span class="option-badge">${flavor.badge}</span>` : ''}
        <div>
          <div class="option-name">
            <span class="flavor-dot" style="background-color: ${flavor.colorHex}"></span>
            ${flavor.name}
          </div>
          <div class="option-desc">${flavor.notes}</div>
        </div>
        <div class="option-meta">
          <span class="price">${flavor.priceAdd > 0 ? `+ ₹${flavor.priceAdd}` : 'Included'}</span>
          <span class="servings">Chef Calibrated</span>
        </div>
      </div>
    `).join('');

    flavorContainer.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        state.flavorId = card.dataset.flavorId;
        renderFlavors();
        updateSummaryAndVisualizer();
      });
    });
  }

  // 3. Render Finishes
  function renderFinishes() {
    if (!finishContainer) return;
    finishContainer.innerHTML = HUCKLEBERRY_DATA.finishes.map(finish => `
      <div class="option-card ${finish.id === state.finishId ? 'active' : ''}" data-finish-id="${finish.id}">
        <div>
          <div class="option-name">${finish.name}</div>
          <div class="option-desc">${finish.desc}</div>
        </div>
        <div class="option-meta">
          <span class="price">+ ₹${finish.priceAdd}</span>
          <span class="servings">Artisanal Decor</span>
        </div>
      </div>
    `).join('');

    finishContainer.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        state.finishId = card.dataset.finishId;
        renderFinishes();
        updateSummaryAndVisualizer();
      });
    });
  }

  // 4. Render Delivery Zones
  function renderDeliveryZones() {
    if (!deliverySelect) return;
    deliverySelect.innerHTML = HUCKLEBERRY_DATA.deliveryZones.map(zone => `
      <option value="${zone.pin}" ${zone.pin === state.deliveryPin ? 'selected' : ''}>
        ${zone.zone} (${zone.fee === 0 ? 'FREE Pickup' : `+ ₹${zone.fee} Delivery`})
      </option>
    `).join('');

    deliverySelect.addEventListener('change', (e) => {
      state.deliveryPin = e.target.value;
      updateSummaryAndVisualizer();
    });
  }

  // 5. Render Gallery
  function renderGallery(filter = 'all') {
    if (!galleryContainer) return;
    const items = filter === 'all' 
      ? HUCKLEBERRY_DATA.signatureGallery 
      : HUCKLEBERRY_DATA.signatureGallery.filter(item => item.category === filter);

    galleryContainer.innerHTML = items.map(item => `
      <article class="gallery-card" data-category="${item.category}">
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <span class="card-tag-pill">${item.weight}</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.description}</p>
          <div class="card-footer-row">
            <span class="card-price">${item.price}</span>
            <button class="btn btn-sm btn-outline btn-customize-item" data-title="${item.title}" data-category="${item.category}">
              Customize Design ➔
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Attach customize triggers
    galleryContainer.querySelectorAll('.btn-customize-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        if (cat === 'miniature') state.tierId = 'miniature-couture';
        else if (cat === 'cheesecake') state.flavorId = 'burnt-basque';
        else state.tierId = 'tier-2';

        renderTiers();
        renderFlavors();
        updateSummaryAndVisualizer();

        // Smooth scroll to builder
        const builderEl = document.getElementById('cake-builder');
        if (builderEl) {
          builderEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Filter Buttons
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });

  // 6. Dynamic Cake Visualizer & Price Calculation
  function updateSummaryAndVisualizer() {
    const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId);
    const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId);
    const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId);
    const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    // Price Math
    let total = tier.basePrice + flavor.priceAdd + finish.priceAdd + zone.fee;
    if (state.addonPlaque) total += 150;
    if (state.addonCandles) total += 200;
    if (state.addonGoldLeaf) total += 350;

    const advanceDeposit = Math.round(total * 0.5);

    // Update Summary Sidebar Texts
    if (summaryTier) summaryTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (summaryFlavor) summaryFlavor.textContent = flavor.name;
    if (summaryFinish) summaryFinish.textContent = finish.name;
    if (summaryDietary) summaryDietary.textContent = state.isEggless ? '100% Eggless Recipe' : 'Standard Recipe';
    if (summaryMessage) summaryMessage.textContent = state.customMessage.trim() ? `"${state.customMessage}"` : 'None';
    if (summaryDelivery) summaryDelivery.textContent = zone.zone.split('(')[0].trim();
    if (summarySlot) summarySlot.textContent = `${state.deliveryDate} | ${state.deliverySlot.split('(')[0].trim()}`;

    if (totalAmountEl) totalAmountEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (advanceAmountEl) advanceAmountEl.textContent = `₹${advanceDeposit.toLocaleString('en-IN')}`;

    // Render Dynamic Visualizer Tiers
    renderVisualizerTiers(tier, flavor, finish);
  }

  function renderVisualizerTiers(tier, flavor, finish) {
    if (!cakeCanvas) return;
    const frostingColor = flavor.frostingHex || '#FADADD';
    const spongeColor = flavor.colorHex || '#361B14';
    const topperText = state.customMessage.slice(0, 24) || 'Your Huckleberry';

    let tiersMarkup = '';

    if (tier.id === 'miniature-couture') {
      tiersMarkup = `
        <div class="cake-stand">
          <div class="cake-topper-text">✨ Petite Couture Box ✨</div>
          <div class="cake-tier tier-layer-top" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor}; width: 80px; height: 32px; border-radius: 4px;">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-pedestal" style="width: 140px; height: 8px;"></div>
        </div>
      `;
    } else if (tier.id === 'tier-1') {
      tiersMarkup = `
        <div class="cake-stand">
          <div class="cake-topper-text">${escapeHtml(topperText)}</div>
          <div class="cake-tier tier-layer-base" style="background: ${frostingColor}; border-top: 6px solid ${spongeColor}; width: 170px; height: 60px;">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-pedestal" style="width: 210px;"></div>
        </div>
      `;
    } else if (tier.id === 'tier-2') {
      tiersMarkup = `
        <div class="cake-stand">
          <div class="cake-topper-text">${escapeHtml(topperText)}</div>
          <div class="cake-tier tier-layer-top" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor};">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-tier tier-layer-base" style="background: ${frostingColor}; border-top: 6px solid ${spongeColor};">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-pedestal"></div>
        </div>
      `;
    } else if (tier.id === 'tier-3') {
      tiersMarkup = `
        <div class="cake-stand">
          <div class="cake-topper-text">${escapeHtml(topperText)}</div>
          <div class="cake-tier tier-layer-top" style="background: ${frostingColor}; border-top: 4px solid ${spongeColor}; width: 95px; height: 34px;">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-tier tier-layer-mid" style="background: ${frostingColor}; border-top: 5px solid ${spongeColor};">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-tier tier-layer-base" style="background: ${frostingColor}; border-top: 6px solid ${spongeColor}; width: 220px; height: 56px;">
            <div class="tier-piping"></div>
          </div>
          <div class="cake-pedestal" style="width: 250px;"></div>
        </div>
      `;
    }

    cakeCanvas.innerHTML = tiersMarkup;
  }

  // 7. Input Event Listeners
  if (egglessToggle) {
    egglessToggle.addEventListener('change', (e) => {
      state.isEggless = e.target.checked;
      updateSummaryAndVisualizer();
    });
  }

  if (customMessageInput) {
    customMessageInput.addEventListener('input', (e) => {
      state.customMessage = e.target.value;
      updateSummaryAndVisualizer();
    });
  }

  if (deliveryDateInput) {
    deliveryDateInput.addEventListener('change', (e) => {
      state.deliveryDate = e.target.value;
      updateSummaryAndVisualizer();
    });
  }

  if (deliverySlotSelect) {
    deliverySlotSelect.addEventListener('change', (e) => {
      state.deliverySlot = e.target.value;
      updateSummaryAndVisualizer();
    });
  }

  if (addonPlaqueCheck) {
    addonPlaqueCheck.addEventListener('change', (e) => {
      state.addonPlaque = e.target.checked;
      updateSummaryAndVisualizer();
    });
  }

  if (addonCandlesCheck) {
    addonCandlesCheck.addEventListener('change', (e) => {
      state.addonCandles = e.target.checked;
      updateSummaryAndVisualizer();
    });
  }

  if (addonGoldLeafCheck) {
    addonGoldLeafCheck.addEventListener('change', (e) => {
      state.addonGoldLeaf = e.target.checked;
      updateSummaryAndVisualizer();
    });
  }

  // 8. 1-Tap WhatsApp Kitchen Dispatch Generator
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const tier = HUCKLEBERRY_DATA.tiers.find(t => t.id === state.tierId);
      const flavor = HUCKLEBERRY_DATA.flavors.find(f => f.id === state.flavorId);
      const finish = HUCKLEBERRY_DATA.finishes.find(f => f.id === state.finishId);
      const zone = HUCKLEBERRY_DATA.deliveryZones.find(z => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

      let total = tier.basePrice + flavor.priceAdd + finish.priceAdd + zone.fee;
      if (state.addonPlaque) total += 150;
      if (state.addonCandles) total += 200;
      if (state.addonGoldLeaf) total += 350;
      const advanceDeposit = Math.round(total * 0.5);

      const bookingToken = 'HK-' + Math.floor(1000 + Math.random() * 9000);

      // WhatsApp Message String
      const messageText = 
`🎂 *NEW CUSTOM CAKE BOOKING - YOUR HUCKLEBERRY*
======================================
*Booking Token:* #${bookingToken}
*Cake Tier:* ${tier.name} (${tier.weightKg})
*Base Flavor:* ${flavor.name}
*Artisanal Finish:* ${finish.name}
*Dietary:* ${state.isEggless ? '🌱 100% Eggless Recipe' : 'Standard Recipe'}
*Piped Message:* "${state.customMessage || 'Happy Celebration'}"
*Add-ons:* ${[state.addonPlaque ? 'Acrylic Plaque' : '', state.addonCandles ? 'Candle Kit' : '', state.addonGoldLeaf ? '24K Gold Leaf' : ''].filter(Boolean).join(', ') || 'Standard Decor'}
--------------------------------------
*Delivery / Pickup Zone:* ${zone.zone}
*Scheduled Date:* ${state.deliveryDate}
*Time Slot:* ${state.deliverySlot}
--------------------------------------
*Total Order Estimate:* ₹${total.toLocaleString('en-IN')}
*Advance Deposit Required (50%):* ₹${advanceDeposit.toLocaleString('en-IN')}
======================================
_Automated Cloud Kitchen Order from Huckleberry Portal_
_Please confirm kitchen slot availability!_`;

      const encodedMsg = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/${HUCKLEBERRY_DATA.bakery.whatsappNumber}?text=${encodedMsg}`;

      // Populate Modal & Show
      const modalTokenEl = document.getElementById('modal-booking-token');
      const modalAmountEl = document.getElementById('modal-booking-amount');
      const modalWaLink = document.getElementById('modal-wa-link');

      if (modalTokenEl) modalTokenEl.textContent = `#${bookingToken}`;
      if (modalAmountEl) modalAmountEl.textContent = `₹${total.toLocaleString('en-IN')} (Advance: ₹${advanceDeposit.toLocaleString('en-IN')})`;
      if (modalWaLink) modalWaLink.href = waUrl;

      if (orderModal) {
        orderModal.showModal();
      }

      // Add to Simulated Kitchen Queue
      addSimulatedOrder({
        id: bookingToken,
        customer: "Website Direct Booking (Chennai)",
        tier: `${tier.name} (${tier.weightKg})`,
        flavor: flavor.name,
        finish: finish.name,
        date: `${state.deliveryDate}, ${state.deliverySlot.split(' ')[0]}`,
        amount: `₹${total.toLocaleString('en-IN')}`,
        status: "Slot Requested (WhatsApp Dispatched)",
        source: "Direct Portal Checkout",
        timeAgo: "Just now"
      });
    });
  }

  if (closeModalBtn && orderModal) {
    closeModalBtn.addEventListener('click', () => {
      orderModal.close();
    });
  }

  // 9. Kitchen Operations Drawer Simulator
  function toggleDrawer() {
    if (!kitchenDrawer) return;
    kitchenDrawer.classList.toggle('open');
  }

  if (drawerHeader) drawerHeader.addEventListener('click', toggleDrawer);
  if (navKitchenToggle) navKitchenToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (kitchenDrawer && !kitchenDrawer.classList.contains('open')) {
      kitchenDrawer.classList.add('open');
    }
  });

  function renderKitchenSimulator() {
    if (!opsOrdersList) return;
    opsOrdersList.innerHTML = HUCKLEBERRY_DATA.kitchenSimulatorOrders.map(order => `
      <div class="ops-order-card">
        <div class="ops-card-top">
          <span class="ops-order-id">#${order.id}</span>
          <span class="ops-order-time">⏱️ ${order.timeAgo}</span>
        </div>
        <div class="ops-customer-name">${order.customer}</div>
        <div class="ops-cake-details">
          <strong>${order.tier}</strong> • ${order.flavor}<br>
          <em>${order.finish} • ${order.date}</em>
        </div>
        <div class="ops-card-footer">
          <span class="ops-status-pill ${getStatusClass(order.status)}">${order.status}</span>
          <span class="ops-amount">${order.amount}</span>
        </div>
      </div>
    `).join('');
  }

  function addSimulatedOrder(order) {
    HUCKLEBERRY_DATA.kitchenSimulatorOrders.unshift(order);
    renderKitchenSimulator();
    // Highlight drawer briefly
    if (kitchenDrawer) {
      kitchenDrawer.style.boxShadow = '0 -10px 45px rgba(82, 22, 47, 0.4)';
      setTimeout(() => {
        kitchenDrawer.style.boxShadow = '';
      }, 2000);
    }
  }

  if (btnSimulateOrder) {
    btnSimulateOrder.addEventListener('click', () => {
      const mockOrder = {
        id: 'HK-' + Math.floor(2000 + Math.random() * 8000),
        customer: "Pooja V. (Nungambakkam High Rd)",
        tier: "2-Tier Celebration (2.5 kg)",
        flavor: "Burnt Basque + Belgian Truffle",
        finish: "Vintage Lambeth Ruffle",
        date: "Sunday, 5:00 PM Slot",
        amount: "₹4,300",
        status: "Advance Paid (Slot Locked)",
        source: "Automated Portal Checkout",
        timeAgo: "Just now"
      };
      addSimulatedOrder(mockOrder);
      alert('✨ Simulated High-Ticket Order Generated!\nNotice how this order is automatically sized, priced, and routed to the kitchen queue with zero DM lag.');
    });
  }

  function getStatusClass(status) {
    if (status.includes('Paid') || status.includes('Locked')) return 'confirmed';
    if (status.includes('Baking')) return 'baking';
    if (status.includes('Ready') || status.includes('Dispatch')) return 'ready';
    return '';
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

  // Initial Boot
  renderTiers();
  renderFlavors();
  renderFinishes();
  renderDeliveryZones();
  renderGallery('all');
  renderKitchenSimulator();
  updateSummaryAndVisualizer();
});
