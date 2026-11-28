/**
 * Your Huckleberry (@huckleberry.inn) Storefront, Multi-Item Order Bag,
 * Direct UPI Checkout & Live Cloud Kitchen Client
 * Shafee Mohammed Road, Thousand Lights / Nungambakkam, Chennai 600006
 */

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    document.body.appendChild(toastContainer);
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
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[tag] || tag));
  }

  function showToast(message, icon = "✓") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast-pill";
    toast.innerHTML = `<span>${escapeHtml(icon)}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-leaving");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    }, 2800);
  }

  // Minimal, smooth tactile button press ripple (respects prefers-reduced-motion)
  const reduceMotionQuery = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  document.addEventListener("pointerdown", (e) => {
    if (reduceMotionQuery && reduceMotionQuery.matches) return;
    const target = e.target.closest(".btn, .btn-terracotta, .btn-add-bag, .btn-open-bag, .filter-pill");
    if (!target || target.disabled) return;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 0.9;
    const ripple = document.createElement("span");
    ripple.className = "btn-tap-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 450);
  });

  function getCloud() {
    return window.HuckleberryCloud || null;
  }

  function waitForCloud(callback) {
    if (window.HuckleberryCloud) callback(window.HuckleberryCloud);
    else window.addEventListener("huckleberry:cloud-ready", () => callback(window.HuckleberryCloud), { once: true });
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

  // Track Meta Pixel Contact events on WhatsApp links
  document.addEventListener("click", (e) => {
    const waAnchor = e.target.closest("a[href*='wa.me']");
    if (waAnchor && window.HuckleberryCloud) {
      window.HuckleberryCloud.trackPixelEvent("Contact", { content_name: "WhatsApp Click" });
    }
  });

  // ==========================================================================
  // 1. Fixed Navbar Elevation & Viewport-Pinned Mobile Drawer
  // ==========================================================================
  const siteNavbar = document.querySelector(".site-navbar");
  const mobileNavToggle = document.getElementById("btn-mobile-nav");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");

  // Portal mobile drawer & backdrop directly onto document.body so navbar backdrop-filter
  // never traps position:fixed descendants when the customer scrolls down the page.
  if (mobileNavBackdrop && mobileNavBackdrop.parentElement !== document.body) {
    document.body.appendChild(mobileNavBackdrop);
  }
  if (mobileNavDrawer && mobileNavDrawer.parentElement !== document.body) {
    document.body.appendChild(mobileNavDrawer);
  }

  if (siteNavbar) {
    const syncNavScrollState = () => {
      siteNavbar.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", syncNavScrollState, { passive: true });
    syncNavScrollState();
  }

  function closeMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove("open");
      mobileNavDrawer.setAttribute("aria-hidden", "true");
    }
    if (mobileNavToggle) {
      mobileNavToggle.classList.remove("open");
      mobileNavToggle.setAttribute("aria-expanded", "false");
    }
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.remove("open");
      mobileNavBackdrop.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.scrollTop = 0;
      mobileNavDrawer.classList.add("open");
      mobileNavDrawer.setAttribute("aria-hidden", "false");
    }
    if (mobileNavToggle) {
      mobileNavToggle.classList.add("open");
      mobileNavToggle.setAttribute("aria-expanded", "true");
    }
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.add("open");
      mobileNavBackdrop.setAttribute("aria-hidden", "false");
    }
    document.body.classList.add("nav-open");
  }

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (mobileNavDrawer.classList.contains("open")) closeMobileNav();
      else openMobileNav();
    });
    mobileNavBackdrop?.addEventListener("click", closeMobileNav);
    mobileNavDrawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileNav));
    document.addEventListener("click", (e) => {
      if (mobileNavDrawer.classList.contains("open") && !mobileNavDrawer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        closeMobileNav();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNavDrawer.classList.contains("open")) closeMobileNav();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && mobileNavDrawer.classList.contains("open")) closeMobileNav();
    });
  }

  // ==========================================================================
  // 2. Instant Chennai Delivery Pincode Checker (Above the Fold Utility)
  // ==========================================================================
  const CHENNAI_ZONES_MAP = {
    "600006": { area: "Nungambakkam / Thousand Lights", fee: 120, zonePin: "600034" },
    "600034": { area: "Nungambakkam / Chetpet", fee: 120, zonePin: "600034" },
    "600031": { area: "Chetpet / Harrington Rd", fee: 120, zonePin: "600034" },
    "600018": { area: "Alwarpet / Teynampet", fee: 150, zonePin: "600018" },
    "600086": { area: "Gopalapuram / Poes Garden", fee: 150, zonePin: "600018" },
    "600017": { area: "T. Nagar", fee: 150, zonePin: "600018" },
    "600004": { area: "Mylapore / RA Puram", fee: 150, zonePin: "600018" },
    "600040": { area: "Anna Nagar", fee: 200, zonePin: "600040" },
    "600010": { area: "Kilpauk", fee: 200, zonePin: "600040" },
    "600020": { area: "Adyar / Besant Nagar", fee: 260, zonePin: "600020" },
    "600090": { area: "Besant Nagar", fee: 260, zonePin: "600020" },
    "600041": { area: "Thiruvanmiyur / ECR", fee: 260, zonePin: "600020" },
    "600032": { area: "Guindy / IT Park", fee: 200, zonePin: "600040" },
    "600096": { area: "Perungudi / OMR", fee: 300, zonePin: "600096" },
    "600119": { area: "Sholinganallur / OMR", fee: 300, zonePin: "600096" },
    "600042": { area: "Velachery", fee: 300, zonePin: "600096" }
  };

  let savedCustomerPincode = sessionStorage.getItem("yh_pincode") || "";

  function evaluateChennaiPincode(raw) {
    const pin = String(raw || "").replace(/\D/g, "").slice(0, 6);
    if (pin.length !== 6) {
      return { ok: false, msg: "Please enter a valid 6-digit Chennai pincode, like 600006 or 600018." };
    }
    if (CHENNAI_ZONES_MAP[pin]) {
      const z = CHENNAI_ZONES_MAP[pin];
      return {
        ok: true,
        pin,
        zonePin: z.zonePin,
        msg: `✓ Yes! We deliver to ${z.area}, ${pin}. Delivery is ₹${z.fee}, or choose free pickup at Nungambakkam.`
      };
    }
    if (pin.startsWith("600") || pin.startsWith("601") || pin.startsWith("602") || pin.startsWith("603")) {
      return {
        ok: true,
        pin,
        zonePin: "600096",
        msg: `✓ Yes! We deliver to ${pin} for ₹300, or choose free pickup at Shafee Mohammed Rd.`
      };
    }
    return {
      ok: false,
      msg: `Sorry, we only deliver inside Chennai right now so every cake reaches you fresh and chilled.`
    };
  }

  document.querySelectorAll(".pincode-checker-form").forEach((form) => {
    const input = form.querySelector(".pincode-input");
    const output = form.parentElement?.querySelector(".pincode-result-msg");
    if (input && savedCustomerPincode) input.value = savedCustomerPincode;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!input || !output) return;
      const res = evaluateChennaiPincode(input.value);
      output.textContent = res.msg;
      output.className = `pincode-result-msg ${res.ok ? "ok" : "warn"}`;
      if (res.ok) {
        savedCustomerPincode = res.pin;
        sessionStorage.setItem("yh_pincode", res.pin);
      }
    });
  });

  // ==========================================================================
  // 3. Multi-Item Simple Order Bag + Sticky Thumb Bar
  // ==========================================================================
  function loadBag() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem("yh_order_bag") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  let orderBag = loadBag();

  function saveBag(shouldBump = false) {
    try {
      sessionStorage.setItem("yh_order_bag", JSON.stringify(orderBag));
    } catch (_) {}
    renderStickyBagBar(shouldBump);
  }

  function addToBag(item, triggerBtn) {
    const key = `${item.title}__${item.price}`;
    const existing = orderBag.find((x) => x.key === key);
    if (existing) {
      existing.qty = Math.min(50, existing.qty + (item.qty || 1));
    } else {
      if (orderBag.length >= 20) {
        showToast("Bag limit is 20 different items per order. Please finish checkout first.", "⚠️");
        return;
      }
      orderBag.push({
        key,
        title: item.title,
        price: Number(item.price),
        qty: item.qty || 1,
        orderType: item.orderType || "everyday"
      });
    }
    saveBag(true);
    if (triggerBtn) {
      const origText = triggerBtn.dataset.origLabel || "+ Bag";
      triggerBtn.dataset.origLabel = origText;
      triggerBtn.textContent = "✓ Added";
      triggerBtn.classList.add("added");
      clearTimeout(triggerBtn._addedTimer);
      triggerBtn._addedTimer = setTimeout(() => {
        triggerBtn.textContent = origText;
        triggerBtn.classList.remove("added");
      }, 900);
    }
    showToast(`Added ${item.title} to your bag`, "✓");
  }

  function ensureStickyBagBar() {
    let bar = document.getElementById("sticky-bag-bar");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "sticky-bag-bar";
    bar.className = "sticky-bag-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Your Order Bag");
    bar.innerHTML = `
      <div class="sticky-bag-meta">
        <span id="sticky-bag-count" class="sticky-bag-count">0 items in bag</span>
        <span id="sticky-bag-total" class="sticky-bag-total">₹0</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button type="button" id="btn-clear-bag" style="background:none; border:none; color:rgba(250,248,245,0.75); font-size:0.78rem; cursor:pointer; text-decoration:underline;">Clear</button>
        <button type="button" id="btn-open-bag-checkout" class="btn-open-bag">Review &amp; Pay UPI ➔</button>
      </div>
    `;
    document.body.appendChild(bar);

    bar.querySelector("#btn-clear-bag").addEventListener("click", () => {
      orderBag = [];
      saveBag();
      showToast("Order Bag cleared");
    });

    bar.querySelector("#btn-open-bag-checkout").addEventListener("click", () => {
      if (!orderBag.length) return;
      openBagCheckout();
    });
    return bar;
  }

  function renderStickyBagBar(shouldBump = false) {
    const bar = ensureStickyBagBar();
    const totalItems = orderBag.reduce((s, i) => s + i.qty, 0);
    const subtotal = orderBag.reduce((s, i) => s + i.price * i.qty, 0);
    if (totalItems > 0) {
      bar.classList.add("visible");
      bar.querySelector("#sticky-bag-count").textContent = `${totalItems} item${totalItems === 1 ? "" : "s"} in bag`;
      bar.querySelector("#sticky-bag-total").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
      if (shouldBump) {
        bar.classList.remove("bump");
        void bar.offsetWidth;
        bar.classList.add("bump");
      }
    } else {
      bar.classList.remove("visible", "bump");
    }
  }

  // ==========================================================================
  // 4. Unified 3-Step Direct UPI Checkout Modal (Single Item OR Multi-Item Bag)
  // ==========================================================================
  let uModalState = null;

  function ensureUniversalModal() {
    let dlg = document.getElementById("universal-checkout-dialog");
    if (dlg) return dlg;

    dlg = document.createElement("dialog");
    dlg.id = "universal-checkout-dialog";
    dlg.className = "order-dialog";
    dlg.style.maxWidth = "550px";
    dlg.style.width = "94%";
    dlg.innerHTML = `
      <div class="modal-dialog-header">
        <div class="modal-dialog-title">
          <span id="uc-modal-heading">Simple 3-Step UPI Checkout</span>
        </div>
        <button id="uc-btn-close" type="button" class="modal-close-button" aria-label="Close checkout">&times;</button>
      </div>
      <div class="modal-inner-content" id="uc-body">
        <div id="uc-form-stage">
          <!-- Beginner-Friendly 3-Step Progress Indicator -->
          <div class="checkout-stepper" aria-label="Checkout steps">
            <div class="checkout-step-pill active" id="uc-step-1">1. Your Details</div>
            <div class="checkout-step-pill" id="uc-step-2">2. Scan &amp; Pay UPI</div>
            <div class="checkout-step-pill" id="uc-step-3">3. Upload Proof</div>
          </div>

          <!-- Order Summary Card -->
          <div style="background: var(--color-surface-subtle); border: 1px solid var(--color-border-gold); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
            <div id="uc-single-item-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div>
                  <span id="uc-badge" style="display:inline-block; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--color-terracotta-dark); background:var(--color-terracotta-soft); border:1px solid var(--color-terracotta-border); padding:2px 8px; border-radius:5px; margin-bottom:4px;">Direct Order</span>
                  <h3 id="uc-item-title" style="font-family:var(--font-editorial); font-size:1.18rem; color:var(--color-plum-royal); margin:0;"></h3>
                  <p id="uc-item-sub" style="font-size:0.8rem; color:var(--color-text-muted); margin:2px 0 0;"></p>
                </div>
                <div style="text-align:right; white-space:nowrap;">
                  <div id="uc-unit-price" style="font-size:1.08rem; font-weight:700; color:var(--color-plum-royal);"></div>
                  <div id="uc-orig-price" style="font-size:0.76rem; color:var(--color-text-light); text-decoration:line-through;"></div>
                </div>
              </div>

              <div id="uc-variant-wrap" style="display:none; margin-top:10px;">
                <label for="uc-variant-select" style="display:block; font-size:0.78rem; font-weight:600; color:var(--color-plum-royal); margin-bottom:4px;">Choose Pack Size:</label>
                <select id="uc-variant-select" name="variant" class="form-select" style="width:100%; padding:9px 10px; font-size:0.86rem;"></select>
              </div>
            </div>

            <!-- Multi-Item Bag List (Shown in Bag Mode) -->
            <div id="uc-bag-items-box" style="display:none; margin-bottom:8px;"></div>

            <!-- Quantity & Delivery Zone -->
            <div style="display:grid; grid-template-columns: 105px 1fr; gap:10px; margin-top:10px;">
              <div id="uc-qty-wrap">
                <label for="uc-qty" style="display:block; font-size:0.76rem; font-weight:600; color:var(--color-plum-royal); margin-bottom:4px;">Quantity</label>
                <input type="number" id="uc-qty" name="qty" min="1" max="50" value="1" style="width:100%; padding:8px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.88rem; background:#FFF;" />
              </div>
              <div id="uc-zone-wrap">
                <label for="uc-zone" style="display:block; font-size:0.76rem; font-weight:600; color:var(--color-plum-royal); margin-bottom:4px;">Chennai Delivery or Pickup</label>
                <select id="uc-zone" name="zone" class="form-select" style="width:100%; padding:8px 32px 8px 10px; font-size:0.84rem; background:#FFF; text-overflow:ellipsis;"></select>
              </div>
            </div>

            <!-- Coupon Code Row -->
            <div id="uc-coupon-wrap" style="display:flex; gap:8px; margin-top:10px;">
              <input type="text" id="uc-coupon-input" name="coupon" placeholder="Have a coupon? Try TASTE39" style="flex:1; padding:8px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.84rem; text-transform:uppercase; background:#FFF;" />
              <button type="button" id="uc-btn-apply-coupon" class="btn btn-secondary btn-sm" style="padding:7px 14px; font-size:0.8rem;">Apply</button>
            </div>
            <div id="uc-coupon-msg" style="font-size:0.78rem; font-weight:600; margin-top:6px; display:none;"></div>
          </div>

          <!-- Step 1: Customer Details -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap:8px; margin-bottom:8px;">
            <div>
              <label for="uc-name" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">Your Name *</label>
              <input type="text" id="uc-name" name="customerName" autocomplete="name" placeholder="Sneha Reddy" required style="width:100%; padding:9px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.88rem;" />
            </div>
            <div>
              <label for="uc-phone" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">WhatsApp Number *</label>
              <input type="tel" id="uc-phone" name="customerPhone" autocomplete="tel" placeholder="10-digit mobile" required style="width:100%; padding:9px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.88rem;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 115px; gap:8px; margin-bottom:8px;">
            <div>
              <label for="uc-email" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">Email Address *</label>
              <input type="email" id="uc-email" name="customerEmail" autocomplete="email" placeholder="you@example.com" required style="width:100%; padding:9px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.88rem;" />
            </div>
            <div>
              <label for="uc-pincode" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">Chennai PIN *</label>
              <input type="text" id="uc-pincode" name="pincode" autocomplete="postal-code" placeholder="600006" maxlength="6" required style="width:100%; padding:9px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.88rem;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
            <div>
              <label for="uc-date" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">Date *</label>
              <input type="date" id="uc-date" name="deliveryDate" required style="width:100%; padding:8px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.84rem;" />
            </div>
            <div>
              <label for="uc-slot" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">Time Slot</label>
              <select id="uc-slot" name="deliverySlot" style="width:100%; padding:8px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.82rem; background:#FFF;">
                <option value="11:00 AM to 1:00 PM">11:00 AM to 1:00 PM</option>
                <option value="1:00 PM to 4:00 PM">1:00 PM to 4:00 PM</option>
                <option value="4:00 PM to 6:00 PM" selected>4:00 PM to 6:00 PM</option>
                <option value="6:00 PM to 8:30 PM">6:00 PM to 8:30 PM</option>
                <option value="8:00 PM to 9:00 PM Evening Saver">8:00 PM to 9:00 PM Evening Saver</option>
              </select>
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <label for="uc-address" style="display:block; font-size:0.76rem; font-weight:600; margin-bottom:3px; color:var(--color-plum-royal);">Delivery Address or Studio Pickup *</label>
            <input type="text" id="uc-address" name="address" placeholder="Door No., Street, Area, Landmark" required style="width:100%; padding:9px 10px; border:1px solid #D5C9BF; border-radius:8px; font-size:0.88rem;" />
          </div>

          <!-- Step 2: UPI QR Card -->
          <div class="modal-payment-qr-card" style="margin-bottom: 12px;">
            <div class="qr-card-header">
              <span class="qr-step-chip">Step 2: Scan &amp; Pay Direct via UPI • Zero Extra Fee</span>
              <div id="uc-payable-amount" class="qr-advance-amount">Pay ₹0 via UPI</div>
              <div id="uc-total-breakdown" style="font-size:0.78rem; color:var(--color-text-muted); margin-top:2px;"></div>
            </div>
            <div class="qr-image-wrapper">
              <img id="uc-qr-img" src="assets/payment-qr.jpg" alt="Your Huckleberry UPI Payment QR" class="modal-qr-img" style="max-width: 145px;" />
              <div class="qr-payee-info">
                <span class="qr-payee-name" id="uc-payee-name">huckle berry</span>
                <div class="qr-upi-pill">
                  <span class="upi-id-code" id="uc-upi-id">eoteatop@okicici</span>
                  <button type="button" class="btn-copy-upi" data-upi="eoteatop@okicici">Copy</button>
                </div>
              </div>
            </div>
            <div class="qr-direct-pay-action">
              <a id="uc-upi-deeplink" href="#" class="btn-upi-app-link"><span>Open GPay / PhonePe / Paytm to Pay</span></a>
            </div>
          </div>

          <!-- Step 3: Mandatory Payment Screenshot Gate -->
          <div style="background: var(--color-terracotta-soft); border: 1.5px dashed var(--color-terracotta); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <label for="uc-proof-file" style="font-size:0.84rem; font-weight:700; color:var(--color-terracotta-dark);">Step 3: Upload UPI Payment Screenshot *</label>
              <span style="font-size:0.68rem; font-weight:700; color:#FFF; background:var(--color-terracotta); padding:2px 7px; border-radius:4px;">REQUIRED</span>
            </div>
            <input type="file" id="uc-proof-file" name="paymentProof" accept="image/*" style="width:100%; font-size:0.82rem; padding:7px; background:#FFF; border:1px solid var(--color-terracotta-border); border-radius:6px; margin-bottom:8px; cursor:pointer;" />
            <input type="text" id="uc-utr" name="utr" placeholder="UPI Reference or UTR Number, optional" style="width:100%; font-size:0.82rem; padding:8px 10px; background:#FFF; border:1px solid var(--color-terracotta-border); border-radius:6px;" />
            <div id="uc-proof-preview" style="display:none; align-items:center; gap:10px; background:#FFF; padding:8px; border-radius:6px; border:1px solid var(--color-veg-green); margin-top:8px;">
              <img id="uc-proof-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Payment Screenshot Preview" style="width:42px; height:42px; object-fit:cover; border-radius:4px;" />
              <span id="uc-proof-status" style="font-size:0.8rem; color:var(--color-veg-green); font-weight:700;">✓ Screenshot Ready</span>
            </div>
          </div>

          <div id="uc-error-box" role="alert" style="display:none; background:var(--color-error-bg); color:var(--color-error); font-size:0.82rem; font-weight:700; padding:10px 12px; border-radius:8px; margin-bottom:10px;"></div>

          <button type="button" id="uc-btn-submit" class="btn btn-whatsapp-dispatch" style="width:100%;">
            <span>Confirm &amp; Lock Baking Slot ➔</span>
          </button>
          <p style="font-size:0.76rem; color:var(--color-text-muted); text-align:center; margin-top:8px;">
            By ordering you agree to our <a href="policies.html" target="_blank" rel="noopener" style="color:var(--color-plum-royal); font-weight:600; text-decoration:underline;">Booking &amp; Refund Policy</a>.
          </p>
        </div>

        <!-- Confirmed Success Stage -->
        <div id="uc-success-stage" style="display:none; text-align:center; padding:10px 4px;">
          <div style="font-size:2.2rem; margin-bottom:6px; color:var(--color-veg-green);">✓</div>
          <h3 style="font-family:var(--font-editorial); font-size:1.5rem; color:var(--color-plum-royal); margin:0 0 6px;">Order Received &amp; Slot Locked</h3>
          <p id="uc-success-subtitle" style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:14px;"></p>
          <div style="background:var(--color-surface-subtle); border:1.5px solid var(--color-border-gold); border-radius:12px; padding:14px; margin-bottom:16px;">
            <div style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--color-gold-deep); font-weight:700;">Your Order Tracking Token</div>
            <div id="uc-success-token" style="font-family:var(--font-sans); font-size:1.55rem; font-weight:800; color:var(--color-plum-royal); margin:4px 0;"></div>
            <div id="uc-success-summary" style="font-size:0.82rem; color:var(--color-text-muted);"></div>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <a id="uc-success-track" href="pipeline.html" class="btn btn-primary" style="text-decoration:none; width:100%; justify-content:center;">
              <span>Track Live Kitchen &amp; Delivery Status ➔</span>
            </a>
            <a id="uc-success-wa" href="#" target="_blank" rel="noopener" class="btn btn-secondary" style="text-decoration:none; width:100%; justify-content:center;">
              <span>Send a Copy on WhatsApp</span>
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

    dlg.querySelector("#uc-btn-close").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

    const recalc = () => updateUniversalTotals(dlg);
    dlg.querySelector("#uc-qty").addEventListener("input", recalc);
    dlg.querySelector("#uc-zone").addEventListener("change", (e) => {
      const pin = e.target.value;
      const pinEl = dlg.querySelector("#uc-pincode");
      if (pinEl && /^\d{6}$/.test(pin)) pinEl.value = pin;
      recalc();
    });
    dlg.querySelector("#uc-variant-select").addEventListener("change", recalc);

    // Highlight Step 2 pill when user taps Pay or enters details
    ["#uc-name", "#uc-phone", "#uc-email", "#uc-address"].forEach((sel) => {
      dlg.querySelector(sel)?.addEventListener("blur", () => {
        if (dlg.querySelector("#uc-name").value.trim() && dlg.querySelector("#uc-phone").value.trim()) {
          dlg.querySelector("#uc-step-2")?.classList.add("active");
        }
      });
    });

    // Multi-Item Bag qty controls inside modal
    dlg.querySelector("#uc-bag-items-box").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-bag-action]");
      if (!btn || !uModalState || !uModalState.isBagMode) return;
      const idx = Number(btn.dataset.idx);
      const act = btn.dataset.bagAction;
      if (!orderBag[idx]) return;
      if (act === "inc") orderBag[idx].qty = Math.min(50, orderBag[idx].qty + 1);
      if (act === "dec") orderBag[idx].qty = Math.max(1, orderBag[idx].qty - 1);
      if (act === "rem") orderBag.splice(idx, 1);
      saveBag();
      if (!orderBag.length) {
        dlg.close();
        showToast("Your bag is now empty");
        return;
      }
      renderBagItemsInModal(dlg);
      recalc();
    });

    // Coupon Apply
    dlg.querySelector("#uc-btn-apply-coupon").addEventListener("click", () => {
      const code = dlg.querySelector("#uc-coupon-input").value.trim().toUpperCase();
      const msgEl = dlg.querySelector("#uc-coupon-msg");
      if (!uModalState) return;
      if (code === "TASTE39") {
        if (uModalState.orderType === "trial") {
          uModalState.couponCode = "TASTE39";
          msgEl.style.display = "block";
          msgEl.style.color = "var(--color-veg-green)";
          msgEl.textContent = "✓ Coupon TASTE39 active! First-time Chennai buyer price: ₹39.";
        } else {
          msgEl.style.display = "block";
          msgEl.style.color = "var(--color-terracotta-dark)";
          msgEl.innerHTML = `Coupon <strong>TASTE39</strong> applies to our ₹39 First-Time Trial Treat! <button type="button" id="uc-switch-trial" style="background:none;border:none;color:var(--color-plum-royal);text-decoration:underline;font-weight:700;cursor:pointer;padding:0;">Switch to ₹39 Trial</button>`;
          msgEl.querySelector("#uc-switch-trial")?.addEventListener("click", () => openTrialCheckout());
        }
      } else if (!code) {
        uModalState.couponCode = "";
        msgEl.style.display = "none";
      } else {
        uModalState.couponCode = "";
        msgEl.style.display = "block";
        msgEl.style.color = "var(--color-error)";
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
      statusTxt.textContent = "Preparing screenshot...";
      try {
        const cloud = getCloud();
        const dataUrl = cloud
          ? await cloud.compressImageToDataUrl(file, 960, 0.72)
          : await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
        uModalState.proofDataUrl = dataUrl;
        previewImg.src = dataUrl;
        statusTxt.textContent = `✓ Payment Screenshot Ready (${Math.round(dataUrl.length / 1024)} KB)`;
        dlg.querySelector("#uc-step-2")?.classList.add("active");
        dlg.querySelector("#uc-step-3")?.classList.add("active");
        showToast("Payment screenshot attached", "📸");
      } catch (err) {
        uModalState.proofDataUrl = null;
        previewBox.style.display = "none";
        errBox.textContent = err.message || "Could not process image. Please upload a JPG or PNG screenshot.";
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
      if (!name) return showErr(errBox, "Please enter your name.");
      if (digits.length < 10) return showErr(errBox, "Please enter a valid 10-digit WhatsApp number.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr(errBox, "Please enter a valid email address.");
      if (!/^\d{6}$/.test(pincode) || !pincode.startsWith("60")) return showErr(errBox, "We currently deliver only inside Chennai pincodes starting with 60.");
      if (!address) return showErr(errBox, "Please enter your Chennai delivery address or type 'Studio Pickup'.");
      if (!uModalState.proofDataUrl) return showErr(errBox, "Step 3 Required: Please upload your GPay / PhonePe / Paytm payment screenshot to confirm your baking slot.");

      const totals = computeUniversalTotals(dlg);
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Confirming Order in Kitchen...</span>`;

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
          items: totals.itemsList,
          itemSummary: totals.summaryText,
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

        if (uModalState.isBagMode) {
          orderBag = [];
          saveBag();
        }

        const waMsg = [
          `*CONFIRMED ORDER SLIP: YOUR HUCKLEBERRY*`,
          `Token: #${token}`,
          `Order: ${orderPayload.itemSummary}`,
          uModalState.couponCode ? `Offer: ${uModalState.couponCode}` : null,
          `Total: ₹${totals.total.toLocaleString("en-IN")} | Paid via UPI: ₹${totals.payableNow.toLocaleString("en-IN")}`,
          utr ? `UTR: ${utr}` : `Payment Screenshot: Uploaded on yourhuckleberry.in`,
          `Buyer: ${name}, ${phone}, ${email}`,
          `Delivery: ${address}, Chennai ${pincode}`,
          `Date & Slot: ${dateVal} • ${slotVal}`,
          `Track Live: https://yourhuckleberry.in/pipeline.html?token=${token}`
        ].filter(Boolean).join("\n");

        const waHref = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(waMsg)}`;
        const hasEmailRelay = Boolean((window.HUCKLEBERRY_CONFIG?.emailRelayUrl || "").trim());

        dlg.querySelector("#uc-form-stage").style.display = "none";
        dlg.querySelector("#uc-success-stage").style.display = "block";
        dlg.querySelector("#uc-success-token").textContent = `#${token}`;
        dlg.querySelector("#uc-success-summary").textContent = `${orderPayload.itemSummary} • Total ₹${totals.total.toLocaleString("en-IN")} • UPI ₹${totals.payableNow.toLocaleString("en-IN")}`;
        dlg.querySelector("#uc-success-subtitle").textContent = cloudSaved
          ? hasEmailRelay
            ? "Your payment proof is live in Chef Ridha's Kitchen Command and a receipt is on its way to your email."
            : "Your payment proof is live in Chef Ridha's Kitchen Command! Save your tracking token below or send a copy on WhatsApp."
          : "Tap WhatsApp below to send your order slip directly to Chef Ridha.";
        dlg.querySelector("#uc-success-wa").href = waHref;
        dlg.querySelector("#uc-success-track").href = `pipeline.html?token=${encodeURIComponent(token)}`;
        showToast(`Order #${token} confirmed!`, "✓");
      } catch (err) {
        showErr(errBox, err.message || "Could not submit order. Please retry or message us on WhatsApp.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Confirm &amp; Lock Baking Slot ➔</span>`;
      }
    });

    return dlg;
  }

  function showErr(el, msg) {
    el.textContent = "⚠️ " + msg;
    el.style.display = "block";
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderBagItemsInModal(dlg) {
    const box = dlg.querySelector("#uc-bag-items-box");
    if (!box) return;
    box.innerHTML = `
      <div style="font-size:0.74rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-gold-deep); margin-bottom:8px;">Your Selected Treats (${orderBag.reduce((s, i) => s + i.qty, 0)} items)</div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${orderBag.map((item, idx) => `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; background:#FFFFFF; padding:8px 10px; border-radius:8px; border:1px solid var(--color-border);">
            <div style="font-size:0.84rem; font-weight:600; color:var(--color-plum-royal); flex:1;">
              ${escapeHtml(item.title)}
              <div style="font-size:0.76rem; color:var(--color-text-muted);">₹${item.price} × ${item.qty} = ₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <button type="button" data-bag-action="dec" data-idx="${idx}" aria-label="Decrease quantity" style="width:26px; height:26px; border-radius:6px; border:1px solid #D5C9BF; background:#FAF8F5; cursor:pointer; font-weight:700;">−</button>
              <span style="min-width:20px; text-align:center; font-size:0.82rem; font-weight:700;">${item.qty}</span>
              <button type="button" data-bag-action="inc" data-idx="${idx}" aria-label="Increase quantity" style="width:26px; height:26px; border-radius:6px; border:1px solid #D5C9BF; background:#FAF8F5; cursor:pointer; font-weight:700;">+</button>
              <button type="button" data-bag-action="rem" data-idx="${idx}" aria-label="Remove item" style="width:26px; height:26px; border-radius:6px; border:none; background:#FEF2F2; color:#B91C1C; cursor:pointer; font-weight:700;">×</button>
            </div>
          </div>
        `).join("")}
      </div>`;
  }

  function computeUniversalTotals(dlg) {
    const zSel = dlg.querySelector("#uc-zone");
    const fee = Number(zSel?.selectedOptions?.[0]?.dataset?.fee || 0);

    if (uModalState.isBagMode) {
      const subtotal = orderBag.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
      const total = Math.max(1, subtotal + fee);
      const payableNow = Math.max(1, Math.round(total * 0.5));
      const summaryText = orderBag.map((i) => `${i.title} × ${i.qty}`).join(", ");
      const itemsList = orderBag.map((i) => ({ name: i.title, qty: i.qty, price: i.price }));
      return { qty: orderBag.reduce((s, i) => s + i.qty, 0), unitPrice: subtotal, fee, subtotal, discount: 0, total, payableNow, summaryText, itemsList };
    }

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
      const subEl = dlg.querySelector("#uc-item-sub");
      if (subEl) subEl.textContent = `${chosen.label} • ${uModalState.baseQuote || "100% Pure Veg Eggless"}`;
    }

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

    return {
      qty,
      unitPrice,
      fee,
      subtotal,
      discount,
      total,
      payableNow,
      summaryText: `${itemTitle} × ${qty}`,
      itemsList: [{ name: itemTitle, qty, price: unitPrice }]
    };
  }

  function updateUniversalTotals(dlg) {
    if (!uModalState) return;
    const t = computeUniversalTotals(dlg);
    const upi = getUpiInfo();

    if (!uModalState.isBagMode) {
      dlg.querySelector("#uc-unit-price").textContent = `₹${t.unitPrice.toLocaleString("en-IN")}`;
    }
    dlg.querySelector("#uc-payable-amount").textContent = uModalState.requireFullPayment
      ? `Pay ₹${t.payableNow.toLocaleString("en-IN")} via UPI`
      : `Pay 50% Advance ₹${t.payableNow.toLocaleString("en-IN")} via UPI`;
    dlg.querySelector("#uc-total-breakdown").textContent = `Order Total: ₹${t.total.toLocaleString("en-IN")}${t.fee > 0 ? ` • includes ₹${t.fee} Chennai AC delivery` : " • Free studio pickup"}`;
    dlg.querySelector("#uc-upi-deeplink").href = `upi://pay?pa=${encodeURIComponent(upi.upiId)}&pn=${encodeURIComponent(upi.payee)}&am=${t.payableNow}&cu=INR&tn=${encodeURIComponent("Your Huckleberry Order")}`;
  }

  function openUniversalCheckout(config) {
    const dlg = ensureUniversalModal();
    uModalState = {
      isBagMode: Boolean(config.isBagMode),
      orderType: config.orderType || "everyday",
      title: config.title || "Atelier Creation",
      subtitle: config.subtitle || "100% Pure Veg Eggless • Nungambakkam Kitchen",
      baseQuote: config.baseQuote || "100% Pure Veg Eggless • Nungambakkam Kitchen",
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
    dlg.querySelector("#uc-step-1")?.classList.add("active");
    dlg.querySelector("#uc-step-2")?.classList.remove("active");
    dlg.querySelector("#uc-step-3")?.classList.remove("active");

    dlg.querySelector("#uc-modal-heading").textContent = config.modalHeading || "Simple 3-Step UPI Checkout";

    const singleBox = dlg.querySelector("#uc-single-item-box");
    const bagBox = dlg.querySelector("#uc-bag-items-box");
    const qtyWrap = dlg.querySelector("#uc-qty-wrap");

    if (uModalState.isBagMode) {
      singleBox.style.display = "none";
      bagBox.style.display = "block";
      qtyWrap.style.display = "none";
      dlg.querySelector("#uc-zone-wrap").style.gridColumn = "1 / -1";
      renderBagItemsInModal(dlg);
    } else {
      singleBox.style.display = "block";
      bagBox.style.display = "none";
      qtyWrap.style.display = "block";
      dlg.querySelector("#uc-zone-wrap").style.gridColumn = "";
      dlg.querySelector("#uc-badge").textContent = uModalState.badge;
      dlg.querySelector("#uc-item-title").textContent = uModalState.title;
      dlg.querySelector("#uc-item-sub").textContent = uModalState.subtitle;
      dlg.querySelector("#uc-orig-price").textContent = uModalState.originalPrice ? `₹${uModalState.originalPrice}` : "";

      const qtyInput = dlg.querySelector("#uc-qty");
      qtyInput.value = "1";
      qtyInput.max = String(uModalState.maxQty);
      qtyInput.disabled = uModalState.maxQty === 1;

      const varWrap = dlg.querySelector("#uc-variant-wrap");
      const varSel = dlg.querySelector("#uc-variant-select");
      if (uModalState.variants && uModalState.variants.length) {
        varWrap.style.display = "block";
        varSel.innerHTML = uModalState.variants
          .map((v) => `<option value="${escapeHtml(v.label)}">${escapeHtml(v.label)} • ₹${Number(v.price).toLocaleString("en-IN")}</option>`)
          .join("");
      } else {
        varWrap.style.display = "none";
      }
    }

    // Pre-fill pincode if checked earlier
    if (savedCustomerPincode && !dlg.querySelector("#uc-pincode").value) {
      dlg.querySelector("#uc-pincode").value = savedCustomerPincode;
    }

    const dEl = dlg.querySelector("#uc-date");
    const sEl = dlg.querySelector("#uc-slot");
    if (uModalState.orderType === "flash") {
      dEl.min = getTodayDateString();
      dEl.value = getTodayDateString();
      sEl.value = "8:00 PM to 9:00 PM Evening Saver";
    } else {
      dEl.min = getTodayDateString();
      dEl.value = getTomorrowDateString();
      sEl.value = "4:00 PM to 6:00 PM";
    }

    const cInput = dlg.querySelector("#uc-coupon-input");
    const cMsg = dlg.querySelector("#uc-coupon-msg");
    cInput.value = uModalState.couponCode;
    if (uModalState.couponCode === "TASTE39") {
      cMsg.style.display = "block";
      cMsg.style.color = "var(--color-veg-green)";
      cMsg.textContent = "✓ Coupon TASTE39 applied! First-time Chennai buyer rate is ₹39, limit 1 per phone.";
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
        content_name: uModalState.isBagMode ? "Multi-Item Bag" : uModalState.title,
        currency: "INR"
      });
    }
    dlg.showModal();
    dlg.scrollTop = 0;
    const modalBody = dlg.querySelector("#uc-body");
    if (modalBody) modalBody.scrollTop = 0;
  }

  function openBagCheckout() {
    const hasFestive = orderBag.some((i) => i.orderType === "festive");
    openUniversalCheckout({
      isBagMode: true,
      orderType: hasFestive ? "festive" : "everyday",
      modalHeading: "Review Your Bag & Pay via UPI",
      requireFullPayment: false
    });
  }

  function openTrialCheckout() {
    const promo = window.HUCKLEBERRY_CONFIG?.promo || {};
    openUniversalCheckout({
      orderType: "trial",
      modalHeading: "₹39 First-Time Trial Treat",
      badge: "COUPON TASTE39 • FIRST-TIME CHENNAI BUYER",
      title: promo.trialItemName || "Artisan Mini Taster Treat",
      subtitle: promo.trialPickupNote || "Free Nungambakkam pickup or Chennai AC delivery • Limit 1 per phone",
      price: promo.trialPrice || 39,
      originalPrice: promo.trialOriginalPrice || 120,
      requireFullPayment: true,
      couponCode: "TASTE39",
      maxQty: 1
    });
  }

  document.addEventListener("click", (e) => {
    const trialBtn = e.target.closest(".btn-open-trial-checkout");
    if (trialBtn) {
      e.preventDefault();
      openTrialCheckout();
    }
  });

  if ((urlParams.get("offer") || "").toUpperCase() === "TASTE39") {
    setTimeout(() => openTrialCheckout(), 350);
  }

  // ==========================================================================
  // 5. Live 7:00 to 7:30 PM Evening Saver (With Sold-Out Greying)
  // ==========================================================================
  const flashMount = document.getElementById("zero-waste-saver-mount");
  if (flashMount) {
    let latestFlash = { configured: false, active: false, items: [] };

    function getCountdownLabel() {
      const now = new Date();
      const istStr = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit" });
      const [h, m] = istStr.split(":").map(Number);
      const totalMins = h * 60 + m;
      const start = 19 * 60;
      const end = 19 * 60 + 30;
      if (totalMins >= start && totalMins < end) return `LIVE NOW • Closes in ${end - totalMins} min`;
      const minsUntil = totalMins < start ? start - totalMins : 24 * 60 - totalMins + start;
      return `Opens daily at 7:00 PM IST, in ${Math.floor(minsUntil / 60)}h ${minsUntil % 60}m`;
    }

    function renderFlashMount() {
      const allItems = latestFlash.items || [];
      const hasAnyItems = allItems.length > 0;
      const isLiveNow = Boolean(latestFlash.active && hasAnyItems);
      const clockText = getCountdownLabel();

      if (isLiveNow) {
        flashMount.innerHTML = `
          <div style="background: var(--color-terracotta-soft); border: 1.5px solid var(--color-terracotta); border-radius: 18px; padding: 22px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:var(--color-terracotta); color:#FFF; font-size:0.72rem; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">
                  LIVE NOW • 7:00 TO 7:30 PM EVENING SAVER
                </div>
                <h2 style="font-family:var(--font-editorial); font-size:1.45rem; color:var(--color-plum-royal); margin:0;">Fresh Closing-Hour Treats at Near-Cost Price</h2>
                <p style="font-size:0.88rem; color:var(--color-text-muted); margin:4px 0 0;">Baked fresh today in Nungambakkam. Order now for 8:00 to 9:00 PM Chennai delivery or free pickup.</p>
              </div>
              <span style="font-size:0.8rem; font-weight:700; color:var(--color-terracotta-dark); background:#FFFFFF; border:1px solid var(--color-terracotta-border); padding:6px 12px; border-radius:10px;">${escapeHtml(clockText)}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap:14px;">
              ${allItems.map((item) => {
                const soldOut = Number(item.qtyRemaining || 0) <= 0 || item.active === false;
                return `
                  <article class="${soldOut ? "flash-card-soldout" : ""}" style="background:#FFFFFF; border:1px solid var(--color-border-gold); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:6px;">
                        <span style="font-size:0.72rem; font-weight:700; color:${soldOut ? "#574E5A" : "var(--color-veg-green)"}; background:${soldOut ? "#EFECE8" : "var(--color-veg-bg)"}; padding:2px 8px; border-radius:12px;">
                          ${soldOut ? "Sold Out Today" : `Only ${Number(item.qtyRemaining)} left`}
                        </span>
                        <span style="font-size:0.72rem; font-weight:600; color:var(--color-terracotta);">8 to 9 PM Delivery</span>
                      </div>
                      <h3 style="font-family:var(--font-editorial); font-size:1.12rem; color:var(--color-plum-royal); margin:0;">${escapeHtml(item.name)}</h3>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding-top:8px; border-top:1px dashed var(--color-border);">
                      <div>
                        <span style="font-size:1.15rem; font-weight:800; color:var(--color-terracotta);">₹${Number(item.flashPrice)}</span>
                        <span style="font-size:0.8rem; color:var(--color-text-light); text-decoration:line-through; margin-left:6px;">₹${Number(item.originalPrice)}</span>
                      </div>
                      <button type="button" class="btn btn-sm btn-grab-flash" data-flash-id="${escapeHtml(item.id)}" ${soldOut ? "disabled" : ""} style="background:${soldOut ? "#CBD5E1" : "var(--color-terracotta)"}; color:#FFF; font-weight:700; padding:8px 14px; border-radius:8px; border:none; cursor:${soldOut ? "not-allowed" : "pointer"};">
                        ${soldOut ? "Sold Out" : "Grab Now ➔"}
                      </button>
                    </div>
                  </article>`;
              }).join("")}
            </div>
          </div>`;
      } else {
        flashMount.innerHTML = `
          <div style="background: var(--color-surface); border: 1px solid var(--color-border-gold); border-radius: 16px; padding: 20px 22px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; box-shadow: var(--shadow-subtle);">
            <div style="max-width:650px;">
              <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.74rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-terracotta-dark); background:var(--color-terracotta-soft); border:1px solid var(--color-terracotta-border); padding:3px 10px; border-radius:6px; margin-bottom:6px;">
                Evening Saver • Daily 7:00 to 7:30 PM
              </div>
              <h2 style="font-family:var(--font-editorial); font-size:1.35rem; color:var(--color-plum-royal); margin:0 0 4px;">Fresh Closing-Hour Pastries at Near-Cost Price</h2>
              <p style="font-size:0.88rem; color:var(--color-text-muted); margin:0; line-height:1.55;">
                Whenever freshly baked pastries are left over at closing, Chef Ridha lists them right here between <strong>7:00 PM and 7:30 PM</strong> for 8:00 to 9:00 PM Chennai delivery so nothing goes to waste.
              </p>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-start; gap:8px;">
              <span style="font-size:0.8rem; font-weight:700; color:var(--color-plum-royal); background:var(--color-surface-subtle); border:1px solid var(--color-border); padding:7px 12px; border-radius:10px;">${escapeHtml(clockText)}</span>
              <button type="button" class="btn btn-sm btn-open-trial-checkout" style="background:var(--color-plum-royal); color:#FAF8F5; padding:9px 16px; border-radius:8px; border:none; cursor:pointer; font-weight:600;">
                Try Our ₹39 Tasting Treat ➔
              </button>
            </div>
          </div>`;
      }
    }

    flashMount.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-grab-flash");
      if (!btn || btn.disabled) return;
      const item = (latestFlash.items || []).find((i) => i.id === btn.dataset.flashId);
      if (!item || Number(item.qtyRemaining || 0) <= 0) return;
      openUniversalCheckout({
        orderType: "flash",
        modalHeading: "Evening Saver Checkout",
        badge: "7:00 TO 7:30 PM SAVER • 8 TO 9 PM DELIVERY",
        title: item.name,
        subtitle: `Only ${item.qtyRemaining} left • 8:00 to 9:00 PM Chennai delivery or pickup`,
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
        cloud.subscribeFlashSale((s) => { latestFlash = s; renderFlashMount(); });
      }
    });
  }

  // ==========================================================================
  // 6. Collection Page Search, Category Filters & Dual (+ Bag / Order Now) Actions
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

    if (searchCounterChip) searchCounterChip.textContent = `Showing ${visibleCount} Creation${visibleCount === 1 ? "" : "s"}`;

    const promoCard = document.querySelector(".everyday-promo-card");
    if (promoCard) promoCard.style.display = (activeCategory === "all" || activeCategory === "everyday") && !query ? "flex" : "none";
    const festivePromoCard = document.querySelector(".festive-promo-card");
    if (festivePromoCard) festivePromoCard.style.display = (activeCategory === "all" || activeCategory === "festive") && !query ? "flex" : "none";
    if (btnClearSearch) btnClearSearch.style.display = query ? "block" : "none";
    if (searchEmptyState) searchEmptyState.style.display = visibleCount === 0 ? "block" : "none";
  }

  if (coutureFilterBar && coutureCards.length > 0) {
    applyCollectionFilters();
    coutureFilterBar.querySelectorAll(".filter-pill").forEach((pill) => {
      if (pill.classList.contains("btn-open-trial-checkout")) return;
      pill.addEventListener("click", () => {
        coutureFilterBar.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeCategory = pill.dataset.filter || "all";
        if (activeFilterIndicator) activeFilterIndicator.textContent = `Category: ${pill.textContent.trim().replace(/\s*\(\d+\)/, "")}`;
        applyCollectionFilters();
        if (window.HuckleberryCloud) window.HuckleberryCloud.trackPixelEvent("ViewContent", { content_category: activeCategory });
      });
    });

    const initialCategory = urlParams.get("category") || urlParams.get("filter");
    if (initialCategory) {
      const targetPill = coutureFilterBar.querySelector(`.filter-pill[data-filter="${initialCategory}"]`);
      if (targetPill) targetPill.click();
    }
  }

  collectionSearchInput?.addEventListener("input", applyCollectionFilters);
  btnClearSearch?.addEventListener("click", () => {
    if (collectionSearchInput) { collectionSearchInput.value = ""; applyCollectionFilters(); collectionSearchInput.focus(); }
  });
  btnResetFilters?.addEventListener("click", () => {
    if (collectionSearchInput) collectionSearchInput.value = "";
    activeCategory = "all";
    coutureFilterBar?.querySelectorAll(".filter-pill").forEach((p) => p.classList.toggle("active", p.dataset.filter === "all"));
    if (activeFilterIndicator) activeFilterIndicator.textContent = "Category: All Menu Items";
    applyCollectionFilters();
  });

  // Wire Collection Cards: Ready-to-order items get (+ Bag & Order Now); Custom Tiered cakes link cleanly to Chef Consultation!
  coutureCards.forEach((card) => {
    const category = card.dataset.category || "";
    const cardImg = card.querySelector(".couture-card-img");
    const footer = card.querySelector(".couture-card-footer");
    const actionLink = footer?.querySelector("a.btn, a[href]");
    const atelierLink = footer?.querySelector("a[href*='atelier.html']");

    if ((category === "everyday" || category === "festive" || category === "tarts" || category === "miniature" || category === "bento") && footer) {
      const title = card.dataset.title || cardImg?.dataset.title || card.querySelector(".couture-card-title")?.textContent?.trim() || "Atelier Treat";
      const rawPrice = (cardImg?.dataset.price || card.querySelector(".couture-price")?.textContent || "0").replace(/[^\d]/g, "");
      const priceNum = Number(rawPrice) || 0;
      const weight = cardImg?.dataset.weight || "";
      const quote = cardImg?.dataset.quote || "";

      // Only convert priced ready-to-order items (skip flavor cards with "+₹200" add-ons)
      if (priceNum > 0) {
        let variants = null;
        if (title.toLowerCase().includes("plum cake")) {
          variants = [
            { label: "500g Vintage Matte Gold Tin", price: 650 },
            { label: "1 kg Grand Vintage Gold Tin", price: 1200 }
          ];
        }

        const launchSingleCheckout = (e) => {
          e.preventDefault();
          openUniversalCheckout({
            orderType: category === "festive" ? "festive" : "everyday",
            modalHeading: category === "festive" ? "Festive Hamper Direct Booking" : "Simple 3-Step UPI Checkout",
            badge: category === "festive" ? "DECEMBER FESTIVE • 50% UPI ADVANCE" : "READY-TO-ORDER • 50% UPI ADVANCE",
            title,
            subtitle: `${weight ? weight + " • " : ""}${quote || "100% Pure Veg Eggless"}`,
            baseQuote: quote || "100% Pure Veg Eggless",
            price: priceNum,
            variants,
            requireFullPayment: false
          });
        };

        const targetBtn = actionLink;
        if (targetBtn && !footer.querySelector(".card-action-group")) {
          const group = document.createElement("div");
          group.className = "card-action-group";

          const addBtn = document.createElement("button");
          addBtn.type = "button";
          addBtn.className = "btn-add-bag";
          addBtn.textContent = "+ Bag";
          const bagTitle = variants ? `${title} (${variants[0].label})` : title;
          const bagPrice = variants ? Number(variants[0].price) : priceNum;
          addBtn.setAttribute("aria-label", `Add ${bagTitle} to Order Bag`);
          addBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            addToBag({ title: bagTitle, price: bagPrice, qty: 1, orderType: category === "festive" ? "festive" : "everyday" }, addBtn);
          });
          group.appendChild(addBtn);

          targetBtn.textContent = "Order Now ➔";
          targetBtn.className = "btn btn-sm btn-primary";
          targetBtn.removeAttribute("target");
          targetBtn.href = "#";
          targetBtn.addEventListener("click", launchSingleCheckout);
          group.appendChild(targetBtn);
          footer.appendChild(group);
        }

        if (cardImg) {
          cardImg.style.cursor = "pointer";
          cardImg.addEventListener("click", launchSingleCheckout);
        }
      }
    } else if (atelierLink) {
      // Custom celebration tiers / flavor inspiration cards route cleanly to Chef Consultation
      atelierLink.textContent = "Book Chef Call ➔";
      atelierLink.href = "atelier.html";
      if (cardImg) {
        cardImg.style.cursor = "pointer";
        cardImg.addEventListener("click", () => { window.location.href = "atelier.html"; });
      }
    }
  });

  // ==========================================================================
  // 7. Real Custom & Wedding Cake Voice Consultation Form (atelier.html)
  // ==========================================================================
  const consultForm = document.getElementById("form-consultation-quick");
  if (consultForm) {
    consultForm.removeAttribute("onsubmit");
    let consultPhotos = [];

    const photoInput = document.getElementById("consult-photos");
    const photoPreviewWrap = document.getElementById("consult-photo-previews");
    const consultStatusBox = document.getElementById("consult-submit-status");

    function renderConsultThumbs() {
      if (!photoPreviewWrap) return;
      photoPreviewWrap.innerHTML = consultPhotos
        .map((src, idx) => `
          <div style="position:relative; display:inline-block;">
            <img src="${src}" alt="Dream Cake Ref ${idx + 1}" style="width:52px; height:52px; object-fit:cover; border-radius:8px; border:1px solid var(--color-border-gold);" />
            <button type="button" data-remove-idx="${idx}" aria-label="Remove photo" style="position:absolute; top:-6px; right:-6px; width:18px; height:18px; border-radius:50%; background:#B91C1C; color:#FFF; border:none; font-size:11px; cursor:pointer; line-height:1;">&times;</button>
          </div>`)
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
            : await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
          if (consultPhotos.length < 3) consultPhotos.push(compressed);
        } catch (err) {
          showToast(err.message || "Could not process photo", "⚠️");
        }
      }
      renderConsultThumbs();
      photoInput.value = "";
      showToast(`${consultPhotos.length} inspiration photo(s) attached`, "📸");
    });

    consultForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = consultForm.querySelector("button[type='submit']");
      const name = document.getElementById("consult-name")?.value.trim() || "";
      const phone = document.getElementById("consult-phone")?.value.trim() || "";
      const email = document.getElementById("consult-email")?.value.trim() || "";
      const eventDate = document.getElementById("consult-date")?.value || "";
      const guestCount = document.getElementById("consult-guests")?.value.trim() || "TBD";
      const preferredCallSlot = document.getElementById("consult-call-slot")?.value || "Afternoon, 2 PM to 5 PM";
      const notes = document.getElementById("consult-notes")?.value.trim() || "";

      if (btn) { btn.disabled = true; btn.textContent = "Scheduling Voice Call..."; }

      try {
        const cloud = getCloud();
        if (cloud) {
          await cloud.submitConsultation({ name, phone, email, eventDate, guestCount, preferredCallSlot, notes, referencePhotos: consultPhotos });
        }
        const waMsg = `Hello Chef Ridha! I just booked a 10-Min Custom Cake Voice Call on yourhuckleberry.in.\nName: ${name}\nDate: ${eventDate}\nGuests: ${guestCount}\nCall Window: ${preferredCallSlot}\nNotes: ${notes}`;
        const waHref = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(waMsg)}`;

        if (consultStatusBox) {
          consultStatusBox.style.display = "block";
          consultStatusBox.style.background = "var(--color-veg-bg)";
          consultStatusBox.style.color = "var(--color-veg-green)";
          consultStatusBox.style.border = "1px solid var(--color-veg-border)";
          consultStatusBox.innerHTML = `
            <strong>✓ Voice Call Booked with Chef Ridha!</strong><br />
            Your details ${consultPhotos.length ? `and ${consultPhotos.length} dream cake photo(s) ` : ""}are in our studio schedule for <strong>${escapeHtml(preferredCallSlot)}</strong>.
            <div style="margin-top:8px;"><a href="${escapeHtml(waHref)}" target="_blank" rel="noopener" style="color:var(--color-plum-royal); font-weight:700; text-decoration:underline;">Also send a quick WhatsApp hello ➔</a></div>`;
        }
        consultForm.reset();
        consultPhotos = [];
        renderConsultThumbs();
        showToast("Voice call booked with Chef Ridha!", "📞");
      } catch (err) {
        if (consultStatusBox) {
          consultStatusBox.style.display = "block";
          consultStatusBox.style.background = "var(--color-error-bg)";
          consultStatusBox.style.color = "var(--color-error)";
          consultStatusBox.style.border = "1px solid rgba(185,28,28,0.25)";
          consultStatusBox.textContent = "⚠️ " + (err.message || "Could not submit consultation.");
        }
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Book 10-Min Voice Call with Chef Ridha"; }
      }
    });
  }

  // ==========================================================================
  // 8. Global 1-Click Copy UPI & FAQ Exclusive Accordion
  // ==========================================================================
  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".btn-copy-upi");
    if (copyBtn) {
      e.preventDefault();
      const upi = copyBtn.dataset.upi || getUpiInfo().upiId;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(upi).then(() => showToast(`UPI ID Copied: ${upi}`, "📋")).catch(() => showToast(`UPI ID: ${upi}`));
      } else {
        showToast(`UPI ID: ${upi}`);
      }
    }
  });

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item && other.open) other.removeAttribute("open"); });
    });
  });

  // ==========================================================================
  // 9. Live Real Order Token Tracker (pipeline.html)
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
    tokenResult.innerHTML = `<div class="order-pipeline-card" style="padding: 20px; text-align:center;">Checking kitchen board for <strong>#${escapeHtml(fullToken)}</strong>...</div>`;

    const waMsg = `Hello Your Huckleberry! Checking live status for order token #${fullToken}.`;
    const waHref = `https://wa.me/${getPrimaryWhatsAppNumber()}?text=${encodeURIComponent(waMsg)}`;

    try {
      const cloud = getCloud();
      const res = cloud ? await cloud.lookupOrderTracking(fullToken) : { configured: false, found: false, token: fullToken };

      if (!res.configured) {
        tokenResult.innerHTML = `
          <div class="order-pipeline-card" style="border: 1.5px solid var(--color-border-gold); padding: 22px;">
            <div style="font-weight:700; color:var(--color-plum-royal); margin-bottom:8px;">Token #${escapeHtml(fullToken)} • WhatsApp Status Check</div>
            <p style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:14px;">Tap below to ask our kitchen directly for a live update.</p>
            <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Check Status on WhatsApp ➔</a>
          </div>`;
        return;
      }

      if (!res.found) {
        tokenResult.innerHTML = `
          <div class="order-pipeline-card" style="border: 1.5px solid var(--color-error); padding: 22px;">
            <div style="font-weight:700; color:var(--color-error); margin-bottom:6px;">Token #${escapeHtml(fullToken)} Not Found</div>
            <p style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:14px;">We couldn't find an active order matching <strong>#${escapeHtml(fullToken)}</strong>. Please double-check the token from your order confirmation screen or WhatsApp slip.</p>
            <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Verify with Kitchen on WhatsApp ➔</a>
          </div>`;
        return;
      }

      const d = res.data;
      const stages = [
        { key: "pending", label: "1. Payment Check" },
        { key: "baking", label: "2. Baking Fresh" },
        { key: "delivery", label: "3. Out for Delivery" },
        { key: "delivered", label: "4. Delivered" }
      ];
      const activeIdx = Math.max(0, stages.findIndex((s) => s.key === d.status));

      tokenResult.innerHTML = `
        <div class="order-pipeline-card" style="border: 1.5px solid var(--color-border-gold); box-shadow: var(--shadow-card); padding: 22px;">
          <div class="order-card-top" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
            <span class="order-token-badge" style="font-size:0.95rem; font-weight:700; color:#FFF; background:var(--color-plum-royal); padding:4px 12px; border-radius:20px;">#${escapeHtml(fullToken)}</span>
            <span style="font-size:0.82rem; font-weight:700; color:var(--color-veg-green); background:var(--color-veg-bg); padding:4px 10px; border-radius:12px;">${escapeHtml(d.statusLabel || d.status)}</span>
          </div>
          <div style="font-family:var(--font-editorial); font-size:1.3rem; color:var(--color-plum-royal); font-weight:600; margin-bottom:4px;">${escapeHtml(d.itemSummary || "Your Huckleberry Order")}</div>
          <p style="font-size:0.86rem; color:var(--color-text-muted); margin-bottom:16px;">Scheduled: <strong>${escapeHtml(d.deliveryDate || "Confirmed")}</strong> • ${escapeHtml(d.deliverySlot || "")}</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:6px; margin-bottom:18px;">
            ${stages.map((st, idx) => `
              <div style="text-align:center; padding:9px 6px; border-radius:8px; font-size:0.76rem; font-weight:700; background:${idx <= activeIdx ? "var(--color-plum-royal)" : "var(--color-surface-subtle)"}; color:${idx <= activeIdx ? "#FAF8F5" : "var(--color-text-muted)"};">
                ${idx <= activeIdx ? "✓ " : ""}${st.label}
              </div>`).join("")}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="flex:1; min-width:190px; text-align:center; justify-content:center;">Message Kitchen Concierge ➔</a>
            <a href="tel:+918511839668" class="btn btn-secondary btn-sm">Call Kitchen</a>
          </div>
        </div>`;
      tokenResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      tokenResult.innerHTML = `<div class="order-pipeline-card" style="padding:20px; color:var(--color-error);">Could not verify token right now (${escapeHtml(err.message)}). <a href="${waHref}" target="_blank" rel="noopener">Check via WhatsApp ➔</a></div>`;
    }
  }

  if (tokenForm && tokenInput) {
    tokenForm.addEventListener("submit", (e) => { e.preventDefault(); runTokenLookup(tokenInput.value); });
    const preToken = urlParams.get("token");
    if (preToken) {
      tokenInput.value = preToken;
      waitForCloud(() => runTokenLookup(preToken));
    }
  }

  // Render sticky bag bar on load if user has items in session bag
  renderStickyBagBar();
});
