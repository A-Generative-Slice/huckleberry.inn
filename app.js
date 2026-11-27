/**
 * Your Huckleberry (@huckleberry.inn) - Production Atelier, Direct Checkout & Cloud Kitchen App
 * Shafee Mohammed Road, Thousand Lights / Nungambakkam, Chennai
 * Powered by A Generative Slice
 */

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  let requestedTier = urlParams.get("tier");
  if (requestedTier === "tier-bento") requestedTier = "bento-noir";
  const validTier =
    typeof HUCKLEBERRY_DATA !== "undefined" &&
    requestedTier &&
    HUCKLEBERRY_DATA.tiers.some((t) => t.id === requestedTier)
      ? requestedTier
      : "tier-2";

  const requestedFlavor = urlParams.get("flavor");
  const validFlavor =
    typeof HUCKLEBERRY_DATA !== "undefined" &&
    requestedFlavor &&
    HUCKLEBERRY_DATA.flavors.some((f) => f.id === requestedFlavor)
      ? requestedFlavor
      : "lychee-rose";

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

  // DOM Elements (Atelier Page)
  const tierContainer = document.getElementById("tier-cards-container");
  const flavorContainer = document.getElementById("flavor-cards-container");
  const finishContainer = document.getElementById("finish-cards-container");
  const zoneSelect = document.getElementById("select-zone");
  const cakeCanvas = document.getElementById("dynamic-cake-canvas");

  const specTier = document.getElementById("spec-tier-text");
  const specFlavor = document.getElementById("spec-flavor-text");
  const specFinish = document.getElementById("spec-finish-text");
  const specDietary = document.getElementById("spec-dietary-text");
  const specPlaque = document.getElementById("spec-plaque-text");
  const specZone = document.getElementById("spec-zone-text");
  const specSlot = document.getElementById("spec-slot-text");
  const totalPriceLabel = document.getElementById("label-total-price");
  const advancePriceLabel = document.getElementById("label-advance-price");

  const mobileTier = document.getElementById("mobile-bar-tier");
  const mobilePrice = document.getElementById("mobile-bar-price");
  const mobileWhatsAppBtn = document.getElementById("btn-mobile-whatsapp");

  const egglessCheck = document.getElementById("chk-eggless");
  const egglessBadge = document.getElementById("eggless-badge");
  const inscriptionInput = document.getElementById("txt-inscription");
  const dateInput = document.getElementById("date-delivery");
  const slotSelect = document.getElementById("slot-delivery");

  const dispatchBtn = document.getElementById("btn-dispatch-whatsapp");
  const orderDialog = document.getElementById("order-modal-dialog");
  const closeDialogBtn = document.getElementById("btn-close-dialog");
  const copySlipBtn = document.getElementById("btn-copy-slip");
  const dialogTokenId = document.getElementById("dialog-token-id");
  const dialogPriceDisplay = document.getElementById("dialog-price-display");
  const dialogWaCta = document.getElementById("dialog-wa-cta");

  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    document.body.appendChild(toastContainer);
  }

  const mobileNavToggle = document.getElementById("btn-mobile-nav");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");

  if (dateInput) {
    dateInput.min = getTomorrowDateString();
    dateInput.value = state.deliveryDate;
  }

  // ==========================================================================
  // Utilities
  // ==========================================================================
  function getTomorrowDateString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  function getTodayDateString() {
    return new Date().toISOString().split("T")[0];
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>'"]/g, (tag) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[tag] || tag));
  }

  function showToast(message, icon = "✨") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast-pill";
    toast.innerHTML = `<span>${escapeHtml(icon)}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3400);
  }

  function getCloud() {
    return window.HuckleberryCloud || null;
  }

  function fallbackToken() {
    return "HK-" + Math.floor(100000 + Math.random() * 900000);
  }

  function getPrimaryWhatsAppNumber() {
    return (typeof HUCKLEBERRY_DATA !== "undefined" && HUCKLEBERRY_DATA.brand?.whatsappNumber) || "918511839668";
  }

  function getUpiInfo() {
    const brand = typeof HUCKLEBERRY_DATA !== "undefined" ? HUCKLEBERRY_DATA.brand : {};
    return {
      upiId: brand?.upiId || "eoteatop@okicici",
      payee: brand?.upiPayee || "huckle berry",
      qrUrl: brand?.paymentQrUrl || "assets/payment-qr.jpg"
    };
  }

  function waitForCloud(callback) {
    if (window.HuckleberryCloud) {
      callback(window.HuckleberryCloud);
    } else {
      window.addEventListener("huckleberry:cloud-ready", () => callback(window.HuckleberryCloud), { once: true });
    }
  }

  // Track Meta Pixel Contact events on any WhatsApp link click
  document.addEventListener("click", (e) => {
    const waAnchor = e.target.closest("a[href*='wa.me']");
    if (waAnchor && window.HuckleberryCloud) {
      window.HuckleberryCloud.trackPixelEvent("Contact", { content_name: "WhatsApp Click" });
    }
  });

  // ==========================================================================
  // 1. Mobile Navigation Drawer
  // ==========================================================================
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
      if (mobileNavDrawer.classList.contains("open")) closeMobileNav();
      else openMobileNav();
    });
    if (mobileNavBackdrop) mobileNavBackdrop.addEventListener("click", closeMobileNav);
    mobileNavDrawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileNav));
    document.addEventListener("click", (e) => {
      if (mobileNavDrawer.classList.contains("open") && !mobileNavDrawer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        closeMobileNav();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavDrawer.classList.contains("open")) closeMobileNav();
    });
  }

  // ==========================================================================
  // 2. Universal Direct Checkout Modal (Festive, Everyday, TASTE39, 7PM Flash)
  // ==========================================================================
  let uModalState = null;

  function ensureUniversalModal() {
    let dlg = document.getElementById("universal-checkout-dialog");
    if (dlg) return dlg;

    dlg = document.createElement("dialog");
    dlg.id = "universal-checkout-dialog";
    dlg.className = "order-dialog";
    dlg.style.maxWidth = "540px";
    dlg.style.width = "94%";
    dlg.innerHTML = `
      <div class="modal-dialog-header">
        <div class="modal-dialog-title">
          <span id="uc-modal-heading">Direct UPI Checkout</span>
        </div>
        <button id="uc-btn-close" type="button" class="modal-close-button" aria-label="Close">&times;</button>
      </div>
      <div class="modal-inner-content" id="uc-body">
        <div id="uc-form-stage">
          <!-- Item Summary Banner -->
          <div style="background: #FAF7F2; border: 1px solid rgba(194,149,87,0.35); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
              <div>
                <span id="uc-badge" style="display:inline-block; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#C2410C; background:#FFEDD5; padding:2px 7px; border-radius:4px; margin-bottom:4px;">Direct Order</span>
                <h3 id="uc-item-title" style="font-family:var(--font-editorial); font-size:1.15rem; color:var(--color-plum-royal); margin:0;"></h3>
                <p id="uc-item-sub" style="font-size:0.78rem; color:var(--color-text-muted); margin:2px 0 0;"></p>
              </div>
              <div style="text-align:right; white-space:nowrap;">
                <div id="uc-unit-price" style="font-size:1.05rem; font-weight:700; color:var(--color-plum-royal);"></div>
                <div id="uc-orig-price" style="font-size:0.74rem; color:#94A3B8; text-decoration:line-through;"></div>
              </div>
            </div>

            <!-- Optional Variant Selector (e.g. Plum Cake 500g vs 1kg) -->
            <div id="uc-variant-wrap" style="display:none; margin-top:10px;">
              <label for="uc-variant-select" style="display:block; font-size:0.75rem; font-weight:600; color:var(--color-plum-royal); margin-bottom:4px;">Select Size / Pack:</label>
              <select id="uc-variant-select" class="form-select" style="width:100%; padding:8px 10px; font-size:0.84rem;"></select>
            </div>

            <!-- Quantity & Delivery Zone -->
            <div style="display:grid; grid-template-columns: 110px 1fr; gap:10px; margin-top:10px;">
              <div id="uc-qty-wrap">
                <label for="uc-qty" style="display:block; font-size:0.74rem; font-weight:600; color:var(--color-plum-royal); margin-bottom:4px;">Quantity</label>
                <input type="number" id="uc-qty" min="1" max="50" value="1" style="width:100%; padding:8px 10px; border:1px solid #D8C7B8; border-radius:8px; font-size:0.86rem;" />
              </div>
              <div>
                <label for="uc-zone" style="display:block; font-size:0.74rem; font-weight:600; color:var(--color-plum-royal); margin-bottom:4px;">Chennai Delivery / Pickup</label>
                <select id="uc-zone" class="form-select" style="width:100%; padding:8px 10px; font-size:0.82rem;"></select>
              </div>
            </div>

            <!-- Coupon Code Row -->
            <div id="uc-coupon-wrap" style="display:flex; gap:8px; margin-top:10px;">
              <input type="text" id="uc-coupon-input" placeholder="Have a coupon? Try TASTE39" style="flex:1; padding:8px 10px; border:1px solid #D8C7B8; border-radius:8px; font-size:0.82rem; text-transform:uppercase;" />
              <button type="button" id="uc-btn-apply-coupon" class="btn btn-secondary btn-sm" style="padding:7px 14px; font-size:0.78rem;">Apply</button>
            </div>
            <div id="uc-coupon-msg" style="font-size:0.75rem; font-weight:600; margin-top:5px; display:none;"></div>
          </div>

          <!-- Customer Details -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
            <div>
              <label for="uc-name" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">Full Name *</label>
              <input type="text" id="uc-name" placeholder="e.g. Sneha Reddy" required style="width:100%; padding:9px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.84rem;" />
            </div>
            <div>
              <label for="uc-phone" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">WhatsApp Number *</label>
              <input type="tel" id="uc-phone" placeholder="10-digit mobile" required style="width:100%; padding:9px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.84rem;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 115px; gap:8px; margin-bottom:8px;">
            <div>
              <label for="uc-email" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">Email Address (For Receipt) *</label>
              <input type="email" id="uc-email" placeholder="you@example.com" required style="width:100%; padding:9px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.84rem;" />
            </div>
            <div>
              <label for="uc-pincode" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">Pincode *</label>
              <input type="text" id="uc-pincode" placeholder="600006" maxlength="6" required style="width:100%; padding:9px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.84rem;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
            <div>
              <label for="uc-date" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">Delivery / Pickup Date *</label>
              <input type="date" id="uc-date" required style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.82rem;" />
            </div>
            <div>
              <label for="uc-slot" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">Time Slot</label>
              <select id="uc-slot" style="width:100%; padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.8rem;">
                <option value="11:00 AM – 1:00 PM">11:00 AM – 1:00 PM</option>
                <option value="1:00 PM – 4:00 PM">1:00 PM – 4:00 PM</option>
                <option value="4:00 PM – 6:00 PM" selected>4:00 PM – 6:00 PM</option>
                <option value="6:00 PM – 8:30 PM">6:00 PM – 8:30 PM</option>
                <option value="8:00 PM – 9:00 PM (Evening Saver)">8:00 PM – 9:00 PM (Evening Saver)</option>
              </select>
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <label for="uc-address" style="display:block; font-size:0.74rem; font-weight:600; margin-bottom:3px;">Chennai Delivery Address / Landmark *</label>
            <input type="text" id="uc-address" placeholder="Flat/Door No., Street, Area in Chennai (or write Studio Pickup)" required style="width:100%; padding:9px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.84rem;" />
          </div>

          <!-- Step 1: UPI QR Card -->
          <div class="modal-payment-qr-card" style="margin-bottom: 12px;">
            <div class="qr-card-header">
              <span class="qr-step-chip">Step 1: Scan &amp; Pay via UPI (₹0 Gateway Fee)</span>
              <div id="uc-payable-amount" class="qr-advance-amount">Pay ₹0 via UPI</div>
              <div id="uc-total-breakdown" style="font-size:0.74rem; color:var(--color-text-muted); margin-top:2px;"></div>
            </div>
            <div class="qr-image-wrapper">
              <img id="uc-qr-img" src="assets/payment-qr.jpg" alt="Your Huckleberry UPI Payment QR" class="modal-qr-img" style="max-width: 150px;" />
              <div class="qr-payee-info">
                <span class="qr-payee-name" id="uc-payee-name">huckle berry</span>
                <div class="qr-upi-pill">
                  <span class="upi-id-code" id="uc-upi-id">eoteatop@okicici</span>
                  <button type="button" class="btn-copy-upi" data-upi="eoteatop@okicici">Copy</button>
                </div>
              </div>
            </div>
            <div class="qr-direct-pay-action">
              <a id="uc-upi-deeplink" href="#" class="btn-upi-app-link"><span>Open UPI App to Pay Now</span></a>
            </div>
          </div>

          <!-- Step 2: Mandatory Payment Screenshot Gate -->
          <div style="background: #FFF7ED; border: 1.5px dashed #FF5C00; border-radius: 12px; padding: 14px; margin-bottom: 12px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <strong style="font-size:0.84rem; color:#7C2D12;">📸 Step 2: Upload Payment Screenshot (Required)</strong>
              <span style="font-size:0.68rem; font-weight:700; color:#FFF; background:#C2410C; padding:2px 6px; border-radius:4px;">MANDATORY</span>
            </div>
            <input type="file" id="uc-proof-file" accept="image/*" style="width:100%; font-size:0.8rem; padding:7px; background:#FFF; border:1px solid #FED7AA; border-radius:6px; margin-bottom:8px; cursor:pointer;" />
            <input type="text" id="uc-utr" placeholder="UPI Reference / UTR Number (Optional)" style="width:100%; font-size:0.8rem; padding:8px 10px; background:#FFF; border:1px solid #FED7AA; border-radius:6px;" />
            <div id="uc-proof-preview" style="display:none; align-items:center; gap:10px; background:#FFF; padding:8px; border-radius:6px; border:1px solid #10B981; margin-top:8px;">
              <img id="uc-proof-img" src="" alt="Payment Screenshot Preview" style="width:42px; height:42px; object-fit:cover; border-radius:4px;" />
              <span id="uc-proof-status" style="font-size:0.78rem; color:#047857; font-weight:700;">✓ Screenshot Compressed &amp; Ready</span>
            </div>
          </div>

          <div id="uc-error-box" style="display:none; background:#FEE2E2; color:#B91C1C; font-size:0.8rem; font-weight:700; padding:9px 12px; border-radius:8px; margin-bottom:10px;"></div>

          <button type="button" id="uc-btn-submit" class="btn btn-whatsapp-dispatch" style="width:100%;">
            <span>Step 3: Lock Baking Slot &amp; Submit Order ➔</span>
          </button>
          <p style="font-size:0.72rem; color:var(--color-text-muted); text-align:center; margin-top:8px;">
            By ordering you agree to our <a href="policies.html" target="_blank" rel="noopener">Booking &amp; Refund Policy</a>.
          </p>
        </div>

        <!-- Confirmed Success Stage -->
        <div id="uc-success-stage" style="display:none; text-align:center; padding:10px 4px;">
          <div style="font-size:2.4rem; margin-bottom:6px;">🎉</div>
          <h3 style="font-family:var(--font-editorial); font-size:1.45rem; color:var(--color-plum-royal); margin:0 0 6px;">Baking Slot Locked!</h3>
          <p id="uc-success-subtitle" style="font-size:0.86rem; color:var(--color-text-muted); margin-bottom:14px;"></p>
          <div style="background:#FAF7F2; border:1.5px solid #D4AF37; border-radius:12px; padding:14px; margin-bottom:16px;">
            <div style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-gold-deep); font-weight:700;">Official Kitchen Token</div>
            <div id="uc-success-token" style="font-family:var(--font-heading); font-size:1.55rem; font-weight:800; color:var(--color-plum-royal); margin:4px 0;"></div>
            <div id="uc-success-summary" style="font-size:0.8rem; color:var(--color-text-muted);"></div>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <a id="uc-success-wa" href="#" target="_blank" rel="noopener" class="btn btn-whatsapp-dispatch" style="text-decoration:none;">
              <span>Send Slip Copy on WhatsApp ➔</span>
            </a>
            <a id="uc-success-track" href="pipeline.html" class="btn btn-secondary" style="text-decoration:none; width:100%;">
              <span>Track Live Oven &amp; Delivery Status</span>
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(dlg);

    // Populate zones
    const zSel = dlg.querySelector("#uc-zone");
    if (zSel && typeof HUCKLEBERRY_DATA !== "undefined") {
      zSel.innerHTML = HUCKLEBERRY_DATA.deliveryZones
        .map((z) => `<option value="${escapeHtml(z.pin)}" data-fee="${z.fee || 0}">${escapeHtml(z.zone)}${z.fee > 0 ? ` (+₹${z.fee})` : ""}</option>`)
        .join("");
    }

    const closeFn = () => dlg.close();
    dlg.querySelector("#uc-btn-close").addEventListener("click", closeFn);
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });

    const recalc = () => updateUniversalTotals(dlg);
    dlg.querySelector("#uc-qty").addEventListener("input", recalc);
    dlg.querySelector("#uc-zone").addEventListener("change", (e) => {
      const pin = e.target.value;
      const pinEl = dlg.querySelector("#uc-pincode");
      if (pinEl && /^\d{6}$/.test(pin)) pinEl.value = pin;
      recalc();
    });
    dlg.querySelector("#uc-variant-select").addEventListener("change", recalc);

    // Coupon Apply
    dlg.querySelector("#uc-btn-apply-coupon").addEventListener("click", () => {
      const code = dlg.querySelector("#uc-coupon-input").value.trim().toUpperCase();
      const msgEl = dlg.querySelector("#uc-coupon-msg");
      if (!uModalState) return;

      if (code === "TASTE39") {
        if (uModalState.orderType === "trial") {
          uModalState.couponCode = "TASTE39";
          msgEl.style.display = "block";
          msgEl.style.color = "#047857";
          msgEl.textContent = "✓ Coupon TASTE39 active! Trial price locked at ₹39 (1 per Chennai buyer).";
        } else {
          // Allow converting eligible single everyday item or guiding to ₹39 Trial Hook
          msgEl.style.display = "block";
          msgEl.style.color = "#B45309";
          msgEl.innerHTML = `Coupon <strong>TASTE39</strong> applies to the ₹39 First-Time Trial Treat! <button type="button" id="uc-switch-trial" style="background:none;border:none;color:#C2410C;text-decoration:underline;font-weight:700;cursor:pointer;padding:0;">Switch to ₹39 Trial Treat</button>`;
          msgEl.querySelector("#uc-switch-trial")?.addEventListener("click", () => {
            openTrialCheckout();
          });
        }
      } else if (!code) {
        uModalState.couponCode = "";
        msgEl.style.display = "none";
      } else {
        uModalState.couponCode = "";
        msgEl.style.display = "block";
        msgEl.style.color = "#B91C1C";
        msgEl.textContent = `Coupon "${code}" is not active. Try TASTE39 for first-time Chennai trial treats.`;
      }
      recalc();
    });

    // Payment Screenshot Compression
    dlg.querySelector("#uc-proof-file").addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file || !uModalState) return;
      const previewBox = dlg.querySelector("#uc-proof-preview");
      const previewImg = dlg.querySelector("#uc-proof-img");
      const statusTxt = dlg.querySelector("#uc-proof-status");
      const errBox = dlg.querySelector("#uc-error-box");
      errBox.style.display = "none";
      previewBox.style.display = "flex";
      statusTxt.textContent = "Compressing screenshot for instant upload...";
      try {
        const cloud = getCloud();
        const dataUrl = cloud
          ? await cloud.compressImageToDataUrl(file, 960, 0.72)
          : await new Promise((res, rej) => {
              const r = new FileReader();
              r.onload = () => res(r.result);
              r.onerror = rej;
              r.readAsDataURL(file);
            });
        uModalState.proofDataUrl = dataUrl;
        previewImg.src = dataUrl;
        statusTxt.textContent = `✓ Payment Screenshot Ready (${Math.round(dataUrl.length / 1024)} KB)`;
        showToast("Payment screenshot attached!", "📸");
      } catch (err) {
        uModalState.proofDataUrl = null;
        previewBox.style.display = "none";
        errBox.textContent = err.message || "Could not process image. Please pick a JPG/PNG screenshot.";
        errBox.style.display = "block";
      }
    });

    // Submit Order
    dlg.querySelector("#uc-btn-submit").addEventListener("click", async () => {
      if (!uModalState) return;
      const errBox = dlg.querySelector("#uc-error-box");
      const submitBtn = dlg.querySelector("#uc-btn-submit");
      errBox.style.display = "none";

      const name = dlg.querySelector("#uc-name").value.trim();
      const phone = dlg.querySelector("#uc-phone").value.trim();
      const email = dlg.querySelector("#uc-email").value.trim();
      const pincode = dlg.querySelector("#uc-pincode").value.trim();
      const address = dlg.querySelector("#uc-address").value.trim();
      const dateVal = dlg.querySelector("#uc-date").value;
      const slotVal = dlg.querySelector("#uc-slot").value;
      const utr = dlg.querySelector("#uc-utr").value.trim();

      const digits = phone.replace(/\D/g, "");
      if (!name) return showErr(errBox, "Please enter your full name.");
      if (digits.length < 10) return showErr(errBox, "Please enter a valid 10-digit WhatsApp number.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr(errBox, "Please enter a valid email address for your order receipt.");
      if (!/^\d{6}$/.test(pincode) || !pincode.startsWith("60")) return showErr(errBox, "We currently deliver strictly inside Chennai (600xxx–603xxx pincodes).");
      if (!address) return showErr(errBox, "Please enter your Chennai delivery address or write 'Studio Pickup'.");
      if (!uModalState.proofDataUrl) return showErr(errBox, "Mandatory Step 2: Please upload your GPay / PhonePe / Paytm transfer screenshot to lock your baking slot.");

      const totals = computeUniversalTotals(dlg);
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Locking Baking Slot...</span>`;

      try {
        const cloud = getCloud();
        const token = cloud ? cloud.generateOrderToken() : fallbackToken();
        const orderPayload = {
          id: token,
          orderType: uModalState.orderType,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          address,
          pincode,
          items: [{ name: totals.itemTitle, qty: totals.qty, price: totals.unitPrice }],
          itemSummary: `${totals.itemTitle} × ${totals.qty}`,
          subtotal: totals.subtotal,
          discount: totals.discount,
          couponCode: uModalState.couponCode || "",
          total: totals.total,
          advanceAmount: totals.payableNow,
          paymentMethod: uModalState.requireFullPayment ? "upi_full" : "upi_advance",
          utr,
          deliveryDate: dateVal,
          deliverySlot: slotVal,
          inscription: "",
          isEggless: true,
          flashItemId: uModalState.flashItemId || "",
          flashQty: uModalState.orderType === "flash" ? totals.qty : 0
        };

        let cloudSaved = false;
        if (cloud) {
          const res = await cloud.submitOrder({ order: orderPayload, proofDataUrl: uModalState.proofDataUrl });
          cloudSaved = res.cloudSaved;
        }

        const waMsg = [
          `*CONFIRMED ORDER SLIP — YOUR HUCKLEBERRY*`,
          `Token: #${token}`,
          `Item: ${orderPayload.itemSummary}`,
          uModalState.couponCode ? `Coupon: ${uModalState.couponCode}` : null,
          `Total: ₹${totals.total.toLocaleString("en-IN")} | Paid via UPI: ₹${totals.payableNow.toLocaleString("en-IN")}`,
          utr ? `UTR: ${utr}` : `Screenshot: Uploaded on yourhuckleberry.in`,
          `Customer: ${name} (${phone} | ${email})`,
          `Delivery: ${address}, Chennai ${pincode}`,
          `Slot: ${dateVal} • ${slotVal}`,
          `Track Live: https://yourhuckleberry.in/pipeline.html?token=${token}`
        ]
          .filter(Boolean)
          .join("\n");

        const waHref = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(waMsg)}`;

        dlg.querySelector("#uc-form-stage").style.display = "none";
        dlg.querySelector("#uc-success-stage").style.display = "block";
        dlg.querySelector("#uc-success-token").textContent = `#${token}`;
        dlg.querySelector("#uc-success-summary").textContent = `${orderPayload.itemSummary} • Total ₹${totals.total.toLocaleString("en-IN")} (UPI ₹${totals.payableNow.toLocaleString("en-IN")})`;
        dlg.querySelector("#uc-success-subtitle").textContent = cloudSaved
          ? "Your payment proof is live in Chef Ridha's Kitchen Command and a receipt is on its way to your email!"
          : "Tap below to dispatch your order slip directly to Chef Ridha on WhatsApp.";
        dlg.querySelector("#uc-success-wa").href = waHref;
        dlg.querySelector("#uc-success-track").href = `pipeline.html?token=${encodeURIComponent(token)}`;
        showToast(`Order #${token} confirmed!`, "🎉");
      } catch (err) {
        showErr(errBox, err.message || "Could not submit order. Please retry or message us on WhatsApp.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Step 3: Lock Baking Slot &amp; Submit Order ➔</span>`;
      }
    });

    return dlg;
  }

  function showErr(el, msg) {
    el.textContent = "⚠️ " + msg;
    el.style.display = "block";
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function computeUniversalTotals(dlg) {
    const qtyInput = dlg.querySelector("#uc-qty");
    const maxQty = uModalState.maxQty || 50;
    const qty = Math.max(1, Math.min(maxQty, parseInt(qtyInput.value || 1, 10) || 1));

    let unitPrice = Number(uModalState.unitPrice || 0);
    let itemTitle = uModalState.title;

    if (uModalState.variants && uModalState.variants.length) {
      const sel = dlg.querySelector("#uc-variant-select");
      const chosen = uModalState.variants[sel.selectedIndex] || uModalState.variants[0];
      unitPrice = Number(chosen.price);
      itemTitle = `${uModalState.title} (${chosen.label})`;
    }

    const zSel = dlg.querySelector("#uc-zone");
    const fee = Number(zSel?.selectedOptions?.[0]?.dataset?.fee || 0);

    let subtotal = unitPrice * qty;
    let discount = 0;
    if (uModalState.orderType === "trial" && uModalState.couponCode === "TASTE39") {
      const orig = Number(uModalState.originalPrice || 120) * qty;
      subtotal = orig;
      discount = Math.max(0, orig - unitPrice * qty);
    }
    const itemsNet = uModalState.orderType === "trial" ? unitPrice * qty : subtotal - discount;
    const total = Math.max(1, itemsNet + fee);
    const payableNow = uModalState.requireFullPayment ? total : Math.max(1, Math.round(total * 0.5));

    return { qty, unitPrice, itemTitle, fee, subtotal, discount, total, payableNow };
  }

  function updateUniversalTotals(dlg) {
    if (!uModalState) return;
    const t = computeUniversalTotals(dlg);
    const upi = getUpiInfo();

    dlg.querySelector("#uc-unit-price").textContent = `₹${t.unitPrice.toLocaleString("en-IN")}`;
    dlg.querySelector("#uc-payable-amount").textContent = uModalState.requireFullPayment
      ? `Pay Full Amount ₹${t.payableNow.toLocaleString("en-IN")} via UPI`
      : `Pay 50% Advance ₹${t.payableNow.toLocaleString("en-IN")} via UPI`;
    dlg.querySelector("#uc-total-breakdown").textContent = `Order Total: ₹${t.total.toLocaleString("en-IN")}${t.fee > 0 ? ` (incl. ₹${t.fee} Chennai AC delivery)` : " (Free Nungambakkam Studio Pickup)"}`;
    dlg.querySelector("#uc-upi-deeplink").href = `upi://pay?pa=${encodeURIComponent(upi.upiId)}&pn=${encodeURIComponent(upi.payee)}&am=${t.payableNow}&cu=INR&tn=${encodeURIComponent("Your Huckleberry Order")}`;
  }

  function openUniversalCheckout(config) {
    const dlg = ensureUniversalModal();
    uModalState = {
      orderType: config.orderType || "everyday",
      title: config.title || "Atelier Creation",
      subtitle: config.subtitle || "100% Pure Veg Eggless • Nungambakkam Scratch Kitchen",
      badge: config.badge || "Direct Order",
      unitPrice: Number(config.price || 0),
      originalPrice: config.originalPrice ? Number(config.originalPrice) : null,
      variants: config.variants || null,
      requireFullPayment: Boolean(config.requireFullPayment),
      couponCode: config.couponCode || "",
      maxQty: config.maxQty || 50,
      flashItemId: config.flashItemId || "",
      proofDataUrl: null
    };

    dlg.querySelector("#uc-form-stage").style.display = "block";
    dlg.querySelector("#uc-success-stage").style.display = "none";
    dlg.querySelector("#uc-error-box").style.display = "none";
    dlg.querySelector("#uc-proof-file").value = "";
    dlg.querySelector("#uc-utr").value = "";
    dlg.querySelector("#uc-proof-preview").style.display = "none";

    dlg.querySelector("#uc-modal-heading").textContent = config.modalHeading || "Direct UPI Checkout";
    dlg.querySelector("#uc-badge").textContent = uModalState.badge;
    dlg.querySelector("#uc-item-title").textContent = uModalState.title;
    dlg.querySelector("#uc-item-sub").textContent = uModalState.subtitle;
    dlg.querySelector("#uc-orig-price").textContent = uModalState.originalPrice ? `₹${uModalState.originalPrice}` : "";

    const qtyInput = dlg.querySelector("#uc-qty");
    qtyInput.value = "1";
    qtyInput.max = String(uModalState.maxQty);
    qtyInput.disabled = uModalState.maxQty === 1;

    // Variants (e.g. Plum Cake 500g / 1kg)
    const varWrap = dlg.querySelector("#uc-variant-wrap");
    const varSel = dlg.querySelector("#uc-variant-select");
    if (uModalState.variants && uModalState.variants.length) {
      varWrap.style.display = "block";
      varSel.innerHTML = uModalState.variants
        .map((v) => `<option value="${escapeHtml(v.label)}">${escapeHtml(v.label)} — ₹${Number(v.price).toLocaleString("en-IN")}</option>`)
        .join("");
    } else {
      varWrap.style.display = "none";
    }

    // Date & Slot defaults
    const dEl = dlg.querySelector("#uc-date");
    const sEl = dlg.querySelector("#uc-slot");
    if (uModalState.orderType === "flash") {
      dEl.min = getTodayDateString();
      dEl.value = getTodayDateString();
      sEl.value = "8:00 PM – 9:00 PM (Evening Saver)";
    } else {
      dEl.min = getTodayDateString();
      dEl.value = getTomorrowDateString();
      sEl.value = "4:00 PM – 6:00 PM";
    }

    // Coupon box state
    const cInput = dlg.querySelector("#uc-coupon-input");
    const cMsg = dlg.querySelector("#uc-coupon-msg");
    cInput.value = uModalState.couponCode;
    if (uModalState.couponCode === "TASTE39") {
      cMsg.style.display = "block";
      cMsg.style.color = "#047857";
      cMsg.textContent = "✓ Coupon TASTE39 applied! First-time Chennai buyer rate: ₹39 (limit 1 per phone).";
    } else {
      cMsg.style.display = "none";
    }

    const upi = getUpiInfo();
    dlg.querySelector("#uc-qr-img").src = upi.qrUrl;
    dlg.querySelector("#uc-payee-name").textContent = upi.payee;
    dlg.querySelector("#uc-upi-id").textContent = upi.upiId;
    dlg.querySelector(".btn-copy-upi").dataset.upi = upi.upiId;

    updateUniversalTotals(dlg);
    if (window.HuckleberryCloud) {
      window.HuckleberryCloud.trackPixelEvent("InitiateCheckout", {
        content_name: uModalState.title,
        value: uModalState.unitPrice,
        currency: "INR"
      });
    }
    dlg.showModal();
  }

  function openTrialCheckout() {
    const promo = window.HUCKLEBERRY_CONFIG?.promo || {};
    openUniversalCheckout({
      orderType: "trial",
      modalHeading: "₹39 Trial Cake Magnet (TASTE39)",
      badge: "TASTE39 • FIRST-TIME CHENNAI BUYER",
      title: promo.trialItemName || "Artisan Mini Taster Treat (100% Pure Veg)",
      subtitle: promo.trialPickupNote || "Free Nungambakkam pickup or Chennai AC delivery • Limit 1 per phone",
      price: promo.trialPrice || 39,
      originalPrice: promo.trialOriginalPrice || 120,
      requireFullPayment: true,
      couponCode: "TASTE39",
      maxQty: 1
    });
  }

  // Global triggers for ₹39 Trial Hook buttons
  document.addEventListener("click", (e) => {
    const trialBtn = e.target.closest(".btn-open-trial-checkout");
    if (trialBtn) {
      e.preventDefault();
      openTrialCheckout();
    }
  });

  // Auto-open TASTE39 if arriving from Meta Ad deep link (?offer=TASTE39)
  if ((urlParams.get("offer") || "").toUpperCase() === "TASTE39") {
    setTimeout(() => openTrialCheckout(), 350);
  }

  // ==========================================================================
  // 3. Live 7:00 PM – 7:30 PM Zero-Waste Evening Saver (Storefront Mount)
  // ==========================================================================
  const flashMount = document.getElementById("zero-waste-saver-mount");
  if (flashMount) {
    let latestFlash = { configured: false, active: false, items: [] };

    function getIstClock() {
      const now = new Date();
      const istStr = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit" });
      const [h, m] = istStr.split(":").map(Number);
      return { hour: h, minute: m, totalMins: h * 60 + m };
    }

    function getCountdownLabel() {
      const { totalMins } = getIstClock();
      const start = 19 * 60; // 7:00 PM IST
      const end = 19 * 60 + 30; // 7:30 PM IST
      if (totalMins >= start && totalMins < end) {
        return `LIVE WINDOW OPEN • Closes in ${end - totalMins} min`;
      }
      const minsUntil = totalMins < start ? start - totalMins : 24 * 60 - totalMins + start;
      const hrs = Math.floor(minsUntil / 60);
      const mins = minsUntil % 60;
      return `Next daily window at 7:00 PM IST (${hrs}h ${mins}m)`;
    }

    function renderFlashMount() {
      const liveItems = (latestFlash.items || []).filter((i) => Number(i.qtyRemaining || 0) > 0 && i.active !== false);
      const isLiveNow = Boolean(latestFlash.active && liveItems.length > 0);
      const clockText = getCountdownLabel();

      if (isLiveNow) {
        flashMount.innerHTML = `
          <div style="background: linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%); border: 2px solid #FF5C00; border-radius: 20px; padding: 26px 24px; box-shadow: 0 12px 32px -8px rgba(255,92,0,0.18);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:#FF5C00; color:#FFF; font-size:0.72rem; font-weight:800; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">
                  ⚡ LIVE NOW • 7:00–7:30 PM ZERO-WASTE EVENING SAVER
                </div>
                <h2 style="font-family:var(--font-editorial); font-size:1.55rem; color:#7C2D12; margin:0;">Fresh Closing-Hour Surplus at Near-Cost Price</h2>
                <p style="font-size:0.86rem; color:#9A3412; margin:4px 0 0;">Baked fresh today in Nungambakkam. Order immediately for 8:00–9:00 PM Central Chennai delivery or pickup.</p>
              </div>
              <span style="font-size:0.78rem; font-weight:700; color:#7C2D12; background:#FFEDD5; padding:6px 12px; border-radius:10px;">${escapeHtml(clockText)}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap:14px;">
              ${liveItems
                .map(
                  (item) => `
                <article style="background:#FFFFFF; border:1px solid #FED7AA; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:6px;">
                      <span style="font-size:0.7rem; font-weight:700; color:#047857; background:#ECFDF5; padding:2px 8px; border-radius:12px;">Only ${Number(item.qtyRemaining)} left</span>
                      <span style="font-size:0.7rem; font-weight:700; color:#C2410C;">8–9 PM Delivery</span>
                    </div>
                    <h3 style="font-family:var(--font-editorial); font-size:1.12rem; color:var(--color-plum-royal); margin:0;">${escapeHtml(item.name)}</h3>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding-top:8px; border-top:1px dashed #F1E4D8;">
                    <div>
                      <span style="font-size:1.15rem; font-weight:800; color:#FF5C00;">₹${Number(item.flashPrice)}</span>
                      <span style="font-size:0.78rem; color:#94A3B8; text-decoration:line-through; margin-left:6px;">₹${Number(item.originalPrice)}</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-grab-flash" data-flash-id="${escapeHtml(item.id)}" style="background:#FF5C00; color:#FFF; font-weight:700; padding:8px 14px; border-radius:8px; border:none; cursor:pointer;">
                      Grab Now ➔
                    </button>
                  </div>
                </article>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      } else {
        flashMount.innerHTML = `
          <div style="background: linear-gradient(135deg, #FAF7F2 0%, #FFF7ED 100%); border: 1.5px solid rgba(255,92,0,0.28); border-radius: 18px; padding: 22px 26px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
            <div style="max-width:650px;">
              <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#C2410C; background:rgba(255,92,0,0.1); padding:3px 9px; border-radius:6px; margin-bottom:6px;">
                ⚡ Zero-Waste Evening Saver • Daily 7:00 – 7:30 PM IST
              </div>
              <h2 style="font-family:var(--font-editorial); font-size:1.38rem; color:var(--color-plum-royal); margin:0 0 4px;">Fresh Closing-Hour Pastries at Near-Cost Price</h2>
              <p style="font-size:0.86rem; color:var(--color-text-muted); margin:0; line-height:1.55;">
                Whenever fresh scratch-baked pastries remain at closing, Chef Ridha unlocks them right here between <strong>7:00 PM and 7:30 PM</strong> for 8:00–9:00 PM Chennai delivery—saving Belgian butter, cream, and zero food waste.
              </p>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
              <span style="font-size:0.78rem; font-weight:700; color:#7C2D12; background:#FFEDD5; padding:7px 12px; border-radius:10px;">${escapeHtml(clockText)}</span>
              <button type="button" class="btn btn-sm btn-open-trial-checkout" style="background:var(--color-plum-royal); color:#FFF; padding:9px 16px; border-radius:8px; border:none; cursor:pointer; font-weight:600;">
                Try ₹39 Taster Now (TASTE39) ➔
              </button>
            </div>
          </div>
        `;
      }
    }

    flashMount.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-grab-flash");
      if (!btn) return;
      const item = (latestFlash.items || []).find((i) => i.id === btn.dataset.flashId);
      if (!item) return;
      openUniversalCheckout({
        orderType: "flash",
        modalHeading: "⚡ Zero-Waste Evening Saver Checkout",
        badge: "7:00–7:30 PM FLASH • 8–9 PM DELIVERY",
        title: item.name,
        subtitle: `Only ${item.qtyRemaining} left • 8:00–9:00 PM Central Chennai delivery / pickup`,
        price: Number(item.flashPrice),
        originalPrice: Number(item.originalPrice),
        requireFullPayment: true,
        maxQty: Number(item.qtyRemaining || 1),
        flashItemId: item.id
      });
    });

    renderFlashMount();
    setInterval(renderFlashMount, 30000);
    waitForCloud((cloud) => {
      if (cloud) {
        cloud.subscribeFlashSale((s) => {
          latestFlash = s;
          renderFlashMount();
        });
      }
    });
  }

  // ==========================================================================
  // 4. Collection Page Filtering, Search & Direct UPI Checkout Wiring
  // ==========================================================================
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

    coutureCards.forEach((card) => {
      const category = card.dataset.category || "";
      const title = (card.dataset.title || "").toLowerCase();
      const keywords = (card.dataset.keywords || "").toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesCategory = activeCategory === "all" || category === activeCategory;
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
    if (promoCard) promoCard.style.display = (activeCategory === "all" || activeCategory === "everyday") && !query ? "flex" : "none";

    const festivePromoCard = document.querySelector(".festive-promo-card");
    if (festivePromoCard) festivePromoCard.style.display = (activeCategory === "all" || activeCategory === "festive") && !query ? "flex" : "none";

    if (btnClearSearch) btnClearSearch.style.display = query ? "block" : "none";
    if (searchEmptyState) searchEmptyState.style.display = visibleCount === 0 ? "block" : "none";
  }

  if (coutureFilterBar && coutureCards.length > 0) {
    // Sync initial counter accurately (38)
    applyCollectionFilters();

    coutureFilterBar.querySelectorAll(".filter-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        coutureFilterBar.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeCategory = pill.dataset.filter || "all";
        if (activeFilterIndicator) {
          activeFilterIndicator.textContent = `Category: ${pill.textContent.trim().replace(/\s*\(\d+\)/, "")}`;
        }
        applyCollectionFilters();
        if (window.HuckleberryCloud) {
          window.HuckleberryCloud.trackPixelEvent("ViewContent", { content_category: activeCategory });
        }
        showToast(`Filtered: ${pill.textContent.trim().replace(/\s*\(\d+\)/, "")}`);
      });
    });

    const initialCategory = urlParams.get("category") || urlParams.get("filter");
    if (initialCategory) {
      const targetPill = coutureFilterBar.querySelector(`.filter-pill[data-filter="${initialCategory}"]`);
      if (targetPill) targetPill.click();
    }
  }

  if (collectionSearchInput) collectionSearchInput.addEventListener("input", applyCollectionFilters);
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
      coutureFilterBar?.querySelectorAll(".filter-pill").forEach((p) => p.classList.toggle("active", p.dataset.filter === "all"));
      if (activeFilterIndicator) activeFilterIndicator.textContent = "Category: All Atelier Pieces";
      applyCollectionFilters();
      showToast("Reset all search & category filters");
    });
  }

  // Upgrade all Festive & Everyday cards in collection.html to Direct UPI Screenshot Checkout!
  coutureCards.forEach((card) => {
    const category = card.dataset.category || "";
    const cardImg = card.querySelector(".couture-card-img");
    const orderLink = card.querySelector(".couture-card-footer a[href*='wa.me']");
    const quickSelectBtn = card.querySelector(".btn-quick-select");

    if ((category === "everyday" || category === "festive") && orderLink) {
      const title = card.dataset.title || cardImg?.dataset.title || card.querySelector(".couture-card-title")?.textContent?.trim() || "Atelier Creation";
      const rawPrice = (cardImg?.dataset.price || card.querySelector(".couture-price")?.textContent || "0").replace(/[^\d]/g, "");
      const priceNum = Number(rawPrice) || 100;
      const weight = cardImg?.dataset.weight || "";
      const quote = cardImg?.dataset.quote || "";

      // Special 500g vs 1kg variant picker for Traditional Christmas Plum Cake
      let variants = null;
      if (title.toLowerCase().includes("plum cake")) {
        variants = [
          { label: "500g Vintage Matte Gold Tin", price: 650 },
          { label: "1 kg Grand Vintage Gold Tin", price: 1200 }
        ];
      }

      const launchCheckout = (e) => {
        e.preventDefault();
        openUniversalCheckout({
          orderType: category === "festive" ? "festive" : "everyday",
          modalHeading: category === "festive" ? "🎄 Festive Hamper Direct Booking" : "Direct UPI Dessert Checkout",
          badge: category === "festive" ? "DECEMBER FESTIVE • 50% UPI ADVANCE" : "EVERYDAY MENU • 10% DIRECT OFF",
          title,
          subtitle: `${weight ? weight + " • " : ""}${quote || "100% Pure Veg Eggless"}`,
          price: priceNum,
          variants,
          requireFullPayment: false
        });
      };

      orderLink.textContent = category === "festive" ? "Book Now (UPI) ➔" : "Order Now (UPI) ➔";
      orderLink.addEventListener("click", launchCheckout);

      if (cardImg) {
        cardImg.style.cursor = "pointer";
        cardImg.addEventListener("click", launchCheckout);
      }
    } else if (cardImg && quickSelectBtn) {
      cardImg.style.cursor = "pointer";
      cardImg.addEventListener("click", () => quickSelectBtn.click());
    }
  });

  // ==========================================================================
  // 5. Real Wedding & Grand Milestone Voice Consultation Form (atelier.html)
  // ==========================================================================
  const consultForm = document.getElementById("form-consultation-quick");
  if (consultForm) {
    // Remove any legacy inline onsubmit
    consultForm.removeAttribute("onsubmit");
    let consultPhotos = [];

    const photoInput = document.getElementById("consult-photos");
    const photoPreviewWrap = document.getElementById("consult-photo-previews");
    const consultStatusBox = document.getElementById("consult-submit-status");

    function renderConsultThumbs() {
      if (!photoPreviewWrap) return;
      photoPreviewWrap.innerHTML = consultPhotos
        .map(
          (src, idx) => `
        <div style="position:relative; display:inline-block;">
          <img src="${src}" alt="Dream Cake Ref ${idx + 1}" style="width:52px; height:52px; object-fit:cover; border-radius:8px; border:1px solid #FED7AA;" />
          <button type="button" data-remove-idx="${idx}" aria-label="Remove photo" style="position:absolute; top:-6px; right:-6px; width:18px; height:18px; border-radius:50%; background:#DC2626; color:#FFF; border:none; font-size:11px; cursor:pointer; line-height:1;">&times;</button>
        </div>`
        )
        .join("");
    }

    photoPreviewWrap?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-idx]");
      if (!btn) return;
      consultPhotos.splice(Number(btn.dataset.removeIdx), 1);
      renderConsultThumbs();
    });

    photoInput?.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 3 - consultPhotos.length);
      if (!files.length) return;
      const cloud = getCloud();
      for (const f of files) {
        try {
          const compressed = cloud
            ? await cloud.compressImageToDataUrl(f, 800, 0.68, 170000)
            : await new Promise((res, rej) => {
                const r = new FileReader();
                r.onload = () => res(r.result);
                r.onerror = rej;
                r.readAsDataURL(f);
              });
          if (consultPhotos.length < 3) consultPhotos.push(compressed);
        } catch (err) {
          showToast(err.message || "Could not process reference photo", "⚠️");
        }
      }
      renderConsultThumbs();
      photoInput.value = "";
      showToast(`${consultPhotos.length} dream cake photo(s) attached`, "📸");
    });

    consultForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = consultForm.querySelector("button[type='submit']");
      const name = document.getElementById("consult-name")?.value.trim() || "";
      const phone = document.getElementById("consult-phone")?.value.trim() || "";
      const email = document.getElementById("consult-email")?.value.trim() || "";
      const eventDate = document.getElementById("consult-date")?.value || "";
      const guestCount = document.getElementById("consult-guests")?.value.trim() || "TBD";
      const preferredCallSlot = document.getElementById("consult-call-slot")?.value || "Afternoon (2 PM – 5 PM)";
      const notes = document.getElementById("consult-notes")?.value.trim() || "";

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Scheduling Voice Call...";
      }

      try {
        const cloud = getCloud();
        if (cloud) {
          await cloud.submitConsultation({
            name,
            phone,
            email,
            eventDate,
            guestCount,
            preferredCallSlot,
            notes,
            referencePhotos: consultPhotos
          });
        }

        const waMsg = `Hello Chef Ridha! I just submitted a Wedding/Grand Cake Voice Consultation on yourhuckleberry.in.\nName: ${name}\nEvent Date: ${eventDate}\nGuests: ${guestCount}\nPreferred 10-Min Call Slot: ${preferredCallSlot}\nNotes: ${notes}`;
        const waHref = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(waMsg)}`;

        if (consultStatusBox) {
          consultStatusBox.style.display = "block";
          consultStatusBox.style.background = "#ECFDF5";
          consultStatusBox.style.color = "#065F46";
          consultStatusBox.style.border = "1px solid #A7F3D0";
          consultStatusBox.innerHTML = `
            <strong>✓ Voice Call Requested with Chef Ridha!</strong><br />
            Your details ${consultPhotos.length ? `and ${consultPhotos.length} dream cake photo(s) ` : ""}are live in our studio calendar for <strong>${escapeHtml(preferredCallSlot)}</strong>.
            <div style="margin-top:8px;"><a href="${escapeHtml(waHref)}" target="_blank" rel="noopener" style="color:#047857; font-weight:700; text-decoration:underline;">Also ping Chef Ridha on WhatsApp ➔</a></div>
          `;
        }
        consultForm.reset();
        consultPhotos = [];
        renderConsultThumbs();
        showToast("Voice consultation booked with Chef Ridha!", "📞");
      } catch (err) {
        if (consultStatusBox) {
          consultStatusBox.style.display = "block";
          consultStatusBox.style.background = "#FEE2E2";
          consultStatusBox.style.color = "#B91C1C";
          consultStatusBox.style.border = "1px solid #FECACA";
          consultStatusBox.textContent = "⚠️ " + (err.message || "Could not submit consultation.");
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Book 10-Min Voice Call with Chef Ridha";
        }
      }
    });
  }

  // ==========================================================================
  // 6. Interactive Custom Cake Atelier (atelier.html)
  // ==========================================================================
  function renderTiers() {
    if (!tierContainer || typeof HUCKLEBERRY_DATA === "undefined") return;
    tierContainer.innerHTML = HUCKLEBERRY_DATA.tiers
      .map(
        (tier) => `
      <div class="select-card tier-card ${tier.id === state.tierId ? "selected" : ""}" data-tier="${tier.id}">
        <div class="card-thumb-wrapper">
          <img src="${tier.image}" alt="${escapeHtml(tier.name)}" class="card-thumb-img" loading="lazy" />
          ${tier.popular ? `<span class="card-thumb-badge">${escapeHtml(tier.tag)}</span>` : ""}
        </div>
        <div class="card-content-wrapper">
          <div class="select-card-header">
            <div class="select-card-name" style="display:flex; align-items:center; gap:6px;">
              <span class="fssai-veg-marker" title="100% Eggless Pure Veg"></span>
              <span>${escapeHtml(tier.name)}</span>
            </div>
            ${tier.weightGrams ? `<span class="weight-badge">${escapeHtml(tier.weightGrams)}</span>` : ""}
          </div>
          <div class="select-card-desc">${escapeHtml(tier.description)}</div>
          <div class="select-card-meta">
            <span class="price-tag">₹${tier.basePrice.toLocaleString("en-IN")}</span>
            <span class="weight-tag">${escapeHtml(tier.weightKg)} • ${escapeHtml(tier.servings)}</span>
          </div>
        </div>
      </div>`
      )
      .join("");

    tierContainer.querySelectorAll(".select-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.tierId = card.dataset.tier;
        renderTiers();
        updateSummary();
        showToast(`Scale selected: ${card.querySelector(".select-card-name span:last-child").textContent}`, "🎂");
      });
    });
  }

  function renderFlavors() {
    if (!flavorContainer || typeof HUCKLEBERRY_DATA === "undefined") return;
    flavorContainer.innerHTML = HUCKLEBERRY_DATA.flavors
      .map(
        (flavor) => `
      <div class="select-card flavor-card ${flavor.id === state.flavorId ? "selected" : ""}" data-flavor="${flavor.id}">
        ${
          flavor.image
            ? `<div class="card-thumb-wrapper flavor-thumb-wrapper">
                <img src="${flavor.image}" alt="${escapeHtml(flavor.name)}" class="card-thumb-img flavor-thumb-img" loading="lazy" />
                ${flavor.badge ? `<span class="card-thumb-badge">${escapeHtml(flavor.badge)}</span>` : ""}
              </div>`
            : ""
        }
        <div class="card-content-wrapper">
          <div class="select-card-header">
            <div class="select-card-name">
              <span class="swatch-pip" style="background-color: ${flavor.colorHex}"></span>
              ${escapeHtml(flavor.name)}
            </div>
            ${flavor.priceAdd > 0 ? `<span class="price-addon-pill">+₹${flavor.priceAdd}</span>` : `<span class="price-addon-pill free">Included</span>`}
          </div>
          <div class="select-card-desc">${escapeHtml(flavor.notes)}</div>
        </div>
      </div>`
      )
      .join("");

    flavorContainer.querySelectorAll(".select-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.flavorId = card.dataset.flavor;
        renderFlavors();
        updateSummary();
        showToast(`Flavour: ${card.querySelector(".select-card-name").textContent.trim()}`, "🍰");
      });
    });
  }

  function renderFinishes() {
    if (!finishContainer || typeof HUCKLEBERRY_DATA === "undefined") return;
    finishContainer.innerHTML = HUCKLEBERRY_DATA.finishes
      .map(
        (finish) => `
      <div class="select-card finish-card ${finish.id === state.finishId ? "selected" : ""}" data-finish="${finish.id}">
        <div class="select-card-header">
          <div class="select-card-name">${escapeHtml(finish.name)}</div>
          <span class="price-tag">+₹${finish.priceAdd}</span>
        </div>
        <div class="select-card-desc">${escapeHtml(finish.desc)}</div>
        <div class="select-card-meta"><span class="weight-tag">Hand-Piped Atelier Finish</span></div>
      </div>`
      )
      .join("");

    finishContainer.querySelectorAll(".select-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.finishId = card.dataset.finish;
        renderFinishes();
        updateSummary();
        showToast(`Decor: ${card.querySelector(".select-card-name").textContent}`, "🎀");
      });
    });
  }

  function renderZones() {
    if (!zoneSelect || typeof HUCKLEBERRY_DATA === "undefined") return;
    zoneSelect.innerHTML = HUCKLEBERRY_DATA.deliveryZones
      .map(
        (z) => `
      <option value="${z.pin}" ${z.pin === state.deliveryPin ? "selected" : ""}>
        ${escapeHtml(z.zone)} ${z.fee > 0 ? `(+₹${z.fee} Delivery)` : ""}
      </option>`
      )
      .join("");

    zoneSelect.addEventListener("change", (e) => {
      state.deliveryPin = e.target.value;
      const pinEl = document.getElementById("cust-pincode");
      if (pinEl && /^\d{6}$/.test(state.deliveryPin)) pinEl.value = state.deliveryPin;
      updateSummary();
    });
  }

  document.querySelectorAll(".btn-quick-select").forEach((btn) => {
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

  function updateSummary() {
    if (typeof HUCKLEBERRY_DATA === "undefined") return;
    const tier = HUCKLEBERRY_DATA.tiers.find((t) => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find((f) => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find((f) => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find((z) => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + (flavor.priceAdd || 0) + (finish.priceAdd || 0) + (zone.fee || 0);
    const advance = Math.round(total * 0.5);

    if (specTier) specTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (specFlavor) specFlavor.textContent = flavor.name;
    if (specFinish) specFinish.textContent = finish.name;
    if (specDietary) specDietary.textContent = state.isEggless ? "100% Eggless Pure Veg" : "Standard Recipe";
    if (specPlaque) specPlaque.textContent = state.customMessage.trim() ? `“${state.customMessage}”` : "None";
    if (specZone) specZone.textContent = zone.zone.split("(")[0].trim();
    if (specSlot) specSlot.textContent = `${state.deliveryDate} • ${state.deliverySlot.split("(")[0].trim()}`;

    if (totalPriceLabel) totalPriceLabel.textContent = `₹${total.toLocaleString("en-IN")}`;
    if (advancePriceLabel) advancePriceLabel.textContent = `₹${advance.toLocaleString("en-IN")}`;
    if (mobileTier) mobileTier.textContent = `${tier.name} (${tier.weightKg})`;
    if (mobilePrice) mobilePrice.textContent = `₹${total.toLocaleString("en-IN")}`;

    renderCanvasTiers(tier, flavor, finish);
  }

  function renderCanvasTiers(tier, flavor, finish) {
    if (!cakeCanvas) return;
    const plaqueText = state.customMessage.slice(0, 26) || "Your Huckleberry";
    cakeCanvas.innerHTML = `
      <div class="visualizer-photo-showcase">
        <div class="visualizer-img-frame">
          <img src="${tier.image}" alt="${escapeHtml(tier.name)} Preview" class="visualizer-main-img" />
          <div class="visualizer-glass-badge">
            <div class="visualizer-badge-top">
              <span class="fssai-veg-marker" title="100% Pure Veg Eggless"></span>
              <span class="visualizer-tier-title">${escapeHtml(tier.name)}</span>
              <span class="visualizer-weight-pill">${escapeHtml(tier.weightKg)}</span>
            </div>
            <div class="visualizer-flavor-row">
              <span class="swatch-pip" style="background-color: ${flavor.colorHex}"></span>
              <span class="visualizer-flavor-name">${escapeHtml(flavor.name)}</span>
            </div>
            ${
              state.customMessage.trim()
                ? `<div class="visualizer-plaque-calligraphy">
                    <span class="plaque-quote-symbol">“</span>
                    <span class="plaque-script-text">${escapeHtml(plaqueText)}</span>
                    <span class="plaque-quote-symbol">”</span>
                  </div>`
                : ""
            }
          </div>
        </div>
        <div class="visualizer-caption-bar">
          <span>${escapeHtml(tier.servings)} • ${escapeHtml(finish ? finish.name : "Lambeth Ruffle")}</span>
          <span class="live-render-tag">Live Studio Visualizer</span>
        </div>
      </div>`;
  }

  if (egglessCheck) {
    egglessCheck.addEventListener("change", (e) => {
      state.isEggless = e.target.checked;
      if (egglessBadge) egglessBadge.textContent = state.isEggless ? "100% Pure Veg Active" : "Standard Recipe";
      updateSummary();
    });
  }
  if (inscriptionInput) inscriptionInput.addEventListener("input", (e) => { state.customMessage = e.target.value; updateSummary(); });
  if (dateInput) dateInput.addEventListener("change", (e) => { state.deliveryDate = e.target.value; updateSummary(); });
  if (slotSelect) slotSelect.addEventListener("change", (e) => { state.deliverySlot = e.target.value; updateSummary(); });

  // Atelier Order Modal + Real Cloud Submission
  function generateOrderSlip() {
    if (typeof HUCKLEBERRY_DATA === "undefined") return;
    const custName = (document.getElementById("cust-name")?.value || "").trim();
    const custEmail = (document.getElementById("cust-email")?.value || "").trim();
    const custPhone = (document.getElementById("cust-phone")?.value || "").trim();
    const custPincode = (document.getElementById("cust-pincode")?.value || state.deliveryPin || "600006").trim();
    const custAddress = (document.getElementById("cust-address")?.value || "").trim();

    if (!custName) {
      showToast("Please enter your Full Name in Step 5 first", "⚠️");
      document.getElementById("cust-name")?.focus();
      return;
    }
    if (custPhone.replace(/\D/g, "").length < 10) {
      showToast("Please enter your 10-digit WhatsApp Number in Step 5", "⚠️");
      document.getElementById("cust-phone")?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(custEmail)) {
      showToast("Please enter a valid Email Address in Step 5 for your receipt", "⚠️");
      document.getElementById("cust-email")?.focus();
      return;
    }

    const tier = HUCKLEBERRY_DATA.tiers.find((t) => t.id === state.tierId) || HUCKLEBERRY_DATA.tiers[0];
    const flavor = HUCKLEBERRY_DATA.flavors.find((f) => f.id === state.flavorId) || HUCKLEBERRY_DATA.flavors[0];
    const finish = HUCKLEBERRY_DATA.finishes.find((f) => f.id === state.finishId) || HUCKLEBERRY_DATA.finishes[0];
    const zone = HUCKLEBERRY_DATA.deliveryZones.find((z) => z.pin === state.deliveryPin) || HUCKLEBERRY_DATA.deliveryZones[0];

    const total = tier.basePrice + (flavor.priceAdd || 0) + (finish.priceAdd || 0) + (zone.fee || 0);
    const advance = Math.round(total * 0.5);
    const cloud = getCloud();
    const token = cloud ? cloud.generateOrderToken() : fallbackToken();
    const upi = getUpiInfo();

    const message = `*CUSTOM CAKE RESERVATION - YOUR HUCKLEBERRY*
yourhuckleberry.in • Shafee Mohammed Road, Chennai
----------------------------------------
*Token:* #${token}
*Cake Size:* ${tier.name} (${tier.weightKg})
*Flavor:* ${flavor.name}
*Design Style:* ${finish.name}
*Dietary:* ${state.isEggless ? "100% Pure Veg (Eggless)" : "Standard"}
*Message on Cake:* "${state.customMessage || "None"}"
----------------------------------------
*Customer:* ${custName} • ${custPhone} • ${custEmail}
*Delivery / Pickup:* ${zone.zone}${custAddress ? ` — ${custAddress}` : ""} (PIN ${custPincode})
*Slot:* ${state.deliveryDate} • ${state.deliverySlot}
----------------------------------------
*Total:* ₹${total.toLocaleString("en-IN")}
*50% Advance Deposit:* ₹${advance.toLocaleString("en-IN")}
*Payee:* ${upi.payee} (UPI ID: ${upi.upiId})
*Track Live:* https://yourhuckleberry.in/pipeline.html?token=${token}`;

    state.lastGeneratedSlip = message;

    const waBase = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
    const upiLink = `upi://pay?pa=${encodeURIComponent(upi.upiId)}&pn=${encodeURIComponent(upi.payee)}&am=${advance}&cu=INR&tn=${encodeURIComponent("Advance " + token)}`;

    if (dialogTokenId) dialogTokenId.textContent = `#${token}`;
    if (dialogPriceDisplay) {
      dialogPriceDisplay.innerHTML = `
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--color-plum-royal);">₹${total.toLocaleString("en-IN")}</div>
        <div style="font-size: 0.85rem; color: var(--color-gold-deep); font-weight: 600; margin-top: 2px;">
          50% Advance Required to Lock Slot: ₹${advance.toLocaleString("en-IN")}
        </div>`;
    }

    const modalQrWrap = document.getElementById("modal-qr-container");
    if (modalQrWrap) {
      modalQrWrap.innerHTML = `
        <div class="qr-card-header">
          <span class="qr-step-chip">Step 1: Scan &amp; Pay 50% Advance Deposit</span>
          <div class="qr-advance-amount">Pay ₹${advance.toLocaleString("en-IN")} via UPI</div>
        </div>
        <div class="qr-image-wrapper">
          <img src="${upi.qrUrl}" alt="UPI Payment QR Code for Your Huckleberry" class="modal-qr-img" />
          <div class="qr-payee-info">
            <span class="qr-payee-name">${escapeHtml(upi.payee)}</span>
            <div class="qr-upi-pill">
              <span class="upi-id-code">${escapeHtml(upi.upiId)}</span>
              <button type="button" class="btn-copy-upi" data-upi="${escapeHtml(upi.upiId)}">Copy</button>
            </div>
          </div>
        </div>
        <div class="qr-apps-row"><span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span></div>
        <div class="qr-direct-pay-action">
          <a href="${upiLink}" class="btn-upi-app-link"><span>Pay ₹${advance.toLocaleString("en-IN")} Directly via UPI App</span></a>
        </div>`;
    }

    let currentProofDataUrl = null;
    let submitted = false;
    const proofInput = document.getElementById("order-payment-proof");
    const utrInput = document.getElementById("order-utr-number");
    const previewContainer = document.getElementById("screenshot-preview-container");
    const previewImg = document.getElementById("screenshot-preview-img");
    const requiredMsg = document.getElementById("screenshot-required-msg");

    if (proofInput) {
      proofInput.value = "";
      if (utrInput) utrInput.value = "";
      if (previewContainer) previewContainer.style.display = "none";
      if (requiredMsg) requiredMsg.style.display = "none";

      proofInput.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          currentProofDataUrl = cloud
            ? await cloud.compressImageToDataUrl(file, 960, 0.72)
            : await new Promise((res, rej) => {
                const r = new FileReader();
                r.onload = () => res(r.result);
                r.onerror = rej;
                r.readAsDataURL(file);
              });
          if (previewImg) previewImg.src = currentProofDataUrl;
          if (previewContainer) previewContainer.style.display = "flex";
          if (requiredMsg) requiredMsg.style.display = "none";
          showToast("Payment screenshot compressed & attached!", "📸");
        } catch (err) {
          currentProofDataUrl = null;
          showToast(err.message || "Please upload a valid image screenshot.", "⚠️");
        }
      };
    }

    if (dialogWaCta) {
      dialogWaCta.href = waBase;
      dialogWaCta.innerHTML = `<span>Step 3: Lock Baking Slot &amp; Send to Kitchen ➔</span>`;
      dialogWaCta.onclick = async (e) => {
        if (submitted) return true; // Second click opens WhatsApp cleanly
        e.preventDefault();

        if (!currentProofDataUrl) {
          if (requiredMsg) {
            requiredMsg.textContent = "⚠️ Step 2 Required: Please upload your UPI payment screenshot first.";
            requiredMsg.style.display = "block";
            requiredMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
          showToast("Payment screenshot required to lock slot!", "⚠️");
          return false;
        }

        const utrVal = utrInput ? utrInput.value.trim() : "";
        dialogWaCta.innerHTML = `<span>Saving Order to Kitchen Cloud...</span>`;

        try {
          if (cloud) {
            await cloud.submitOrder({
              order: {
                id: token,
                orderType: "custom",
                customerName: custName,
                customerEmail: custEmail,
                customerPhone: custPhone,
                address: custAddress || zone.zone,
                pincode: custPincode,
                items: [{ name: `${tier.name} (${flavor.name}, ${finish.name})`, qty: 1, price: total }],
                itemSummary: `${tier.name} — ${flavor.name} (${finish.name})`,
                subtotal: total,
                discount: 0,
                couponCode: "",
                total,
                advanceAmount: advance,
                paymentMethod: "upi_advance",
                utr: utrVal,
                deliveryDate: state.deliveryDate,
                deliverySlot: state.deliverySlot,
                inscription: state.customMessage,
                isEggless: state.isEggless
              },
              proofDataUrl: currentProofDataUrl
            });
          }

          let finalWa = waBase;
          if (utrVal) finalWa += encodeURIComponent(`\n*UPI Ref/UTR:* ${utrVal}`);
          finalWa += encodeURIComponent("\n*Screenshot:* Uploaded directly to Kitchen Command for audit.");
          dialogWaCta.href = finalWa;
          submitted = true;
          dialogWaCta.innerHTML = `<span>✓ Slot Locked! Open WhatsApp Confirmation ➔</span>`;
          showToast(`Order #${token} sent straight to Chef Ridha's Kitchen!`, "🎉");
          window.open(finalWa, "_blank", "noopener");
        } catch (err) {
          if (requiredMsg) {
            requiredMsg.textContent = "⚠️ " + (err.message || "Could not save order. Please try again.");
            requiredMsg.style.display = "block";
          }
          dialogWaCta.innerHTML = `<span>Step 3: Lock Baking Slot &amp; Send to Kitchen ➔</span>`;
        }
      };
    }

    if (cloud) {
      cloud.trackPixelEvent("InitiateCheckout", {
        content_name: tier.name,
        value: total,
        currency: "INR"
      });
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

  if (copySlipBtn) {
    copySlipBtn.addEventListener("click", async () => {
      try {
        if (state.lastGeneratedSlip) {
          await navigator.clipboard.writeText(state.lastGeneratedSlip);
          showToast("Booking details copied to clipboard!", "📋");
        }
      } catch (_) {
        showToast("Booking token: " + (dialogTokenId ? dialogTokenId.textContent : "#HK"), "ℹ️");
      }
    });
  }

  // Global 1-Click Copy UPI Handler
  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".btn-copy-upi");
    if (copyBtn) {
      e.preventDefault();
      const upi = copyBtn.dataset.upi || getUpiInfo().upiId;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(upi).then(() => showToast(`UPI ID Copied: ${upi}`, "📋")).catch(() => showToast(`UPI ID: ${upi}`, "ℹ️"));
      } else {
        showToast(`UPI ID: ${upi}`, "ℹ️");
      }
    }
  });

  // FAQ Exclusive Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) other.removeAttribute("open");
        });
      }
    });
  });

  // ==========================================================================
  // 7. Live Real Order Token Tracker (pipeline.html)
  // ==========================================================================
  const tokenForm = document.getElementById("form-token-tracker");
  const tokenInput = document.getElementById("input-track-token");
  const tokenResult = document.getElementById("token-status-result");

  async function runTokenLookup(rawInput) {
    const raw = String(rawInput || "").trim().toUpperCase().replace(/^#/, "");
    if (!raw) {
      showToast("Please enter your booking token (e.g. HK-7K4M9P)", "ℹ️");
      return;
    }
    const fullToken = raw.startsWith("HK-") ? raw : `HK-${raw}`;
    if (!tokenResult) return;

    tokenResult.style.display = "block";
    tokenResult.innerHTML = `<div class="order-pipeline-card" style="padding: 22px; text-align:center;">Checking kitchen board for <strong>#${escapeHtml(fullToken)}</strong>...</div>`;

    const waMsg = `Hello Your Huckleberry! Checking live status for order token #${fullToken}.`;
    const waHref = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(waMsg)}`;

    try {
      const cloud = getCloud();
      const res = cloud ? await cloud.lookupOrderTracking(fullToken) : { configured: false, found: false, token: fullToken };

      if (!res.configured) {
        tokenResult.innerHTML = `
          <div class="order-pipeline-card" style="border: 1.5px solid var(--color-gold-deep); padding: 22px;">
            <div style="font-weight:700; color:var(--color-plum-royal); margin-bottom:8px;">Token #${escapeHtml(fullToken)} — WhatsApp Concierge Lookup</div>
            <p style="font-size:0.86rem; color:var(--color-text-muted); margin-bottom:14px;">Live cloud tracker sync activates once kitchen cloud credentials are linked. Tap below for an instant chef status update.</p>
            <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Check Status via WhatsApp ➔</a>
          </div>`;
        return;
      }

      if (!res.found) {
        tokenResult.innerHTML = `
          <div class="order-pipeline-card" style="border: 1.5px solid #EF4444; padding: 22px;">
            <div style="font-weight:700; color:#B91C1C; margin-bottom:6px;">Token #${escapeHtml(fullToken)} Not Found</div>
            <p style="font-size:0.86rem; color:var(--color-text-muted); margin-bottom:14px;">We couldn't find an active order matching <strong>#${escapeHtml(fullToken)}</strong>. Please double-check your confirmation email from <code>orders@yourhuckleberry.in</code> or contact our kitchen concierge.</p>
            <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Verify with Kitchen on WhatsApp ➔</a>
          </div>`;
        return;
      }

      const d = res.data;
      const stages = [
        { key: "pending", label: "Payment Audit" },
        { key: "baking", label: "In Oven / Piping" },
        { key: "delivery", label: "Out for Delivery" },
        { key: "delivered", label: "Delivered" }
      ];
      const activeIdx = Math.max(0, stages.findIndex((s) => s.key === d.status));

      tokenResult.innerHTML = `
        <div class="order-pipeline-card" style="border: 2px solid var(--color-gold-deep); box-shadow: 0 10px 30px rgba(44,17,51,0.12); padding: 22px;">
          <div class="order-card-top" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
            <span class="order-token-badge" style="font-size:0.95rem; font-weight:700; color:#FFF; background:var(--color-plum-royal); padding:4px 12px; border-radius:20px;">#${escapeHtml(fullToken)}</span>
            <span style="font-size:0.8rem; font-weight:700; color:#047857; background:#ECFDF5; padding:4px 10px; border-radius:12px;">${escapeHtml(d.statusLabel || d.status)}</span>
          </div>
          <div style="font-family:var(--font-editorial); font-size:1.25rem; color:var(--color-plum-royal); font-weight:600; margin-bottom:4px;">${escapeHtml(d.itemSummary || "Bespoke Atelier Order")}</div>
          <p style="font-size:0.84rem; color:var(--color-text-muted); margin-bottom:16px;">Scheduled: <strong>${escapeHtml(d.deliveryDate || "Confirmed")}</strong> • ${escapeHtml(d.deliverySlot || "")}</p>
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-bottom:18px;">
            ${stages
              .map(
                (st, idx) => `
              <div style="text-align:center; padding:8px 4px; border-radius:8px; font-size:0.72rem; font-weight:700; background:${idx <= activeIdx ? "var(--color-plum-royal)" : "#F1F5F9"}; color:${idx <= activeIdx ? "#FAF7F2" : "#64748B"};">
                ${idx <= activeIdx ? "✓ " : ""}${st.label}
              </div>`
              )
              .join("")}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="flex:1; min-width:190px; text-align:center;">Message Kitchen Concierge ➔</a>
            <a href="tel:+918511839668" class="btn btn-secondary btn-sm">Call Kitchen</a>
          </div>
        </div>`;
      tokenResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      tokenResult.innerHTML = `<div class="order-pipeline-card" style="padding:20px; color:#B91C1C;">Could not verify token right now (${escapeHtml(err.message)}). <a href="${waHref}" target="_blank" rel="noopener">Check via WhatsApp ➔</a></div>`;
    }
  }

  if (tokenForm && tokenInput) {
    tokenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runTokenLookup(tokenInput.value);
    });

    const preToken = urlParams.get("token");
    if (preToken) {
      tokenInput.value = preToken;
      waitForCloud(() => runTokenLookup(preToken));
    }
  }

  // Initial Load for Atelier
  renderTiers();
  renderFlavors();
  renderFinishes();
  renderZones();
  updateSummary();
});
