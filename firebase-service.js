/**
 * Your Huckleberry (yourhuckleberry.in) — Production Firebase Cloud & Analytics Service
 *
 * Uses Firebase v11 Modular Web SDK (CDN ESM) — zero build step required for GitHub Pages.
 * 100% Spark Free Tier compatible: compressed UPI proofs & consultation photos are stored
 * safely in isolated admin-only Firestore documents protected by `firestore.rules`.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const cfg = window.HUCKLEBERRY_CONFIG || {};
let app = null;
let db = null;
let auth = null;
let cloudReady = false;

if (typeof cfg.isFirebaseConfigured === "function" && cfg.isFirebaseConfigured()) {
  try {
    app = initializeApp(cfg.firebase);
    db = getFirestore(app);
    auth = getAuth(app);
    cloudReady = true;
  } catch (err) {
    console.error("[HuckleberryCloud] Firebase initialization failed:", err);
  }
}

// ============================================================================
// Meta Pixel Auto-Loader (Activates automatically once metaPixelId is set)
// ============================================================================
function initMetaPixel() {
  const pixelId = (cfg.metaPixelId || "").trim();
  if (!pixelId || window.fbq) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

function trackPixelEvent(eventName, params = {}) {
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, params);
    }
  } catch (_) {
    // Non-blocking analytics
  }
}

initMetaPixel();

// ============================================================================
// Utilities: Non-Guessable Order Token, Phone Normalization, Image Compression
// ============================================================================
function generateOrderToken() {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(6);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `HK-${code}`;
}

function normalizeIndianPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 11 && digits.startsWith("0")) return "91" + digits.slice(1);
  return digits;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

/**
 * Compresses any uploaded mobile photo/screenshot to a crisp JPEG data URL
 * guaranteed under maxChars (~220KB default) so Spark Firestore writes succeed fast on 4G.
 */
function compressImageToDataUrl(file, maxDim = 960, quality = 0.72, maxChars = 320000) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      reject(new Error("Please upload a valid image file (JPG, PNG, or WebP)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.onload = (evt) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid or corrupted image file."));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let q = quality;
        let dataUrl = canvas.toDataURL("image/jpeg", q);
        while (dataUrl.length > maxChars && q > 0.32) {
          q -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", q);
        }

        if (dataUrl.length > 440000) {
          // Final resize fallback for extraordinarily tall screenshots
          const scale = 0.65;
          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL("image/jpeg", 0.55);
        }

        resolve(dataUrl);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// Optional Cloudflare Email Relay (orders@, auth@, corporate@)
// ============================================================================
async function notifyEmailRelay(endpointPath, payload) {
  const baseUrl = (cfg.emailRelayUrl || "").trim().replace(/\/$/, "");
  if (!baseUrl) return { skipped: true };
  try {
    const res = await fetch(`${baseUrl}${endpointPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn("[HuckleberryCloud] Email relay non-OK response:", res.status);
      return { ok: false, status: res.status };
    }
    return await res.json();
  } catch (err) {
    console.warn("[HuckleberryCloud] Email relay unreachable (order still saved):", err);
    return { ok: false };
  }
}

// ============================================================================
// Customer Storefront Cloud Operations
// ============================================================================
async function submitOrder({ order, proofDataUrl }) {
  const token = order.id || generateOrderToken();
  const normalizedPhone = normalizeIndianPhone(order.customerPhone);
  const couponCode = String(order.couponCode || "").trim().toUpperCase();

  if (!order.customerName || !isValidEmail(order.customerEmail) || normalizedPhone.length < 10) {
    throw new Error("Please enter a valid name, email address, and 10-digit WhatsApp number.");
  }
  if (!proofDataUrl || !proofDataUrl.startsWith("data:image/")) {
    throw new Error("Mandatory UPI payment screenshot is missing.");
  }

  const sanitizedOrder = {
    id: token,
    orderType: order.orderType || "custom",
    customerName: String(order.customerName).trim().slice(0, 120),
    customerEmail: String(order.customerEmail).trim().toLowerCase().slice(0, 160),
    customerPhone: String(order.customerPhone).trim().slice(0, 24),
    normalizedPhone: normalizedPhone.slice(0, 15),
    address: String(order.address || "").trim().slice(0, 500),
    pincode: String(order.pincode || "").trim().slice(0, 12),
    items: Array.isArray(order.items) ? order.items.slice(0, 20) : [{ name: String(order.itemSummary || "Atelier Creation").slice(0, 140), qty: 1, price: Number(order.total || 0) }],
    itemSummary: String(order.itemSummary || "Atelier Order").trim().slice(0, 300),
    subtotal: Math.max(0, Number(order.subtotal ?? order.total ?? 0)),
    discount: Math.max(0, Number(order.discount ?? 0)),
    couponCode: couponCode.slice(0, 30),
    total: Math.max(1, Number(order.total || 0)),
    advanceAmount: Math.max(0, Math.min(Number(order.advanceAmount ?? order.total ?? 0), Number(order.total || 0))),
    paymentMethod: order.paymentMethod === "upi_full" ? "upi_full" : "upi_advance",
    utr: String(order.utr || "").trim().slice(0, 64),
    hasProof: true,
    deliveryDate: String(order.deliveryDate || "").trim().slice(0, 30),
    deliverySlot: String(order.deliverySlot || "").trim().slice(0, 80),
    inscription: String(order.inscription || "").trim().slice(0, 80),
    isEggless: order.isEggless !== false,
    flashItemId: String(order.flashItemId || "").trim().slice(0, 80),
    flashQty: Math.max(0, Math.min(20, parseInt(order.flashQty || 0, 10) || 0)),
    status: "pending",
    statusLabel: "Payment Audit Required"
  };

  if (cloudReady && db) {
    const batch = writeBatch(db);
    const now = serverTimestamp();

    batch.set(doc(db, "orders", token), {
      ...sanitizedOrder,
      createdAt: now,
      updatedAt: now
    });

    batch.set(doc(db, "order_proofs", token), {
      orderId: token,
      proofDataUrl,
      utr: sanitizedOrder.utr,
      createdAt: now
    });

    batch.set(doc(db, "order_tracking", token), {
      token,
      itemSummary: sanitizedOrder.itemSummary,
      orderType: sanitizedOrder.orderType,
      deliveryDate: sanitizedOrder.deliveryDate,
      deliverySlot: sanitizedOrder.deliverySlot,
      status: "pending",
      statusLabel: "Payment Audit Required",
      createdAt: now,
      updatedAt: now
    });

    if (couponCode === "TASTE39") {
      const claimId = `TASTE39_${sanitizedOrder.normalizedPhone}`;
      batch.set(doc(db, "coupon_claims", claimId), {
        coupon: "TASTE39",
        orderId: token,
        createdAt: now
      });
    }

    try {
      await batch.commit();
    } catch (err) {
      if (couponCode === "TASTE39" && err && (err.code === "permission-denied" || String(err.message).includes("permission"))) {
        throw new Error("Coupon TASTE39 has already been redeemed for this phone number. Each Chennai buyer can redeem the ₹39 Trial Hook once!");
      }
      throw err;
    }
  }

  // Trigger automated email receipt + instant kitchen alert (non-blocking)
  notifyEmailRelay("/api/notify-order", {
    token,
    customerName: sanitizedOrder.customerName,
    customerEmail: sanitizedOrder.customerEmail,
    customerPhone: sanitizedOrder.customerPhone,
    address: sanitizedOrder.address,
    itemSummary: sanitizedOrder.itemSummary,
    total: sanitizedOrder.total,
    advanceAmount: sanitizedOrder.advanceAmount,
    deliveryDate: sanitizedOrder.deliveryDate,
    deliverySlot: sanitizedOrder.deliverySlot,
    utr: sanitizedOrder.utr,
    orderType: sanitizedOrder.orderType
  });

  trackPixelEvent("Purchase", {
    value: sanitizedOrder.total,
    currency: "INR",
    content_name: sanitizedOrder.itemSummary,
    content_type: sanitizedOrder.orderType
  });

  return { token, cloudSaved: cloudReady, order: sanitizedOrder };
}

async function lookupOrderTracking(rawToken) {
  const clean = String(rawToken || "").trim().toUpperCase().replace(/^#/, "");
  const token = clean.startsWith("HK-") ? clean : `HK-${clean}`;
  if (!cloudReady || !db) {
    return { configured: false, token, found: false };
  }
  const snap = await getDoc(doc(db, "order_tracking", token));
  if (!snap.exists()) {
    return { configured: true, token, found: false };
  }
  return { configured: true, token, found: true, data: snap.data() };
}

async function submitConsultation(payload) {
  const name = String(payload.name || "").trim().slice(0, 120);
  const phone = String(payload.phone || "").trim().slice(0, 24);
  const email = String(payload.email || "").trim().toLowerCase().slice(0, 160);
  const eventDate = String(payload.eventDate || "").trim().slice(0, 30);
  const guestCount = String(payload.guestCount || "Not specified").trim().slice(0, 40);
  const preferredCallSlot = String(payload.preferredCallSlot || "Anytime 11 AM – 7 PM").trim().slice(0, 80);
  const notes = String(payload.notes || "").trim().slice(0, 1000);
  const referencePhotos = Array.isArray(payload.referencePhotos) ? payload.referencePhotos.slice(0, 3) : [];

  if (!name || normalizeIndianPhone(phone).length < 10 || !isValidEmail(email) || !eventDate) {
    throw new Error("Please fill in your name, 10-digit phone number, valid email, and event date.");
  }

  let docId = "CONS-" + Math.floor(1000 + Math.random() * 9000);
  if (cloudReady && db) {
    const now = serverTimestamp();
    const ref = await addDoc(collection(db, "consultations"), {
      name,
      phone,
      email,
      eventDate,
      guestCount,
      preferredCallSlot,
      notes,
      referencePhotos,
      status: "scheduled",
      createdAt: now,
      updatedAt: now
    });
    docId = ref.id;
  }

  notifyEmailRelay("/api/notify-consultation", {
    id: docId,
    name,
    phone,
    email,
    eventDate,
    guestCount,
    preferredCallSlot,
    notes,
    photoCount: referencePhotos.length
  });

  trackPixelEvent("Lead", {
    content_name: "Wedding & Milestone Voice Consultation",
    content_category: "bespoke_consultation"
  });

  return { id: docId, cloudSaved: cloudReady };
}

function subscribeFlashSale(callback) {
  if (!cloudReady || !db) {
    callback({ configured: false, active: false, note: "", items: [] });
    return () => {};
  }

  let currentConfig = { active: false, note: "", windowStart: "19:00", windowEnd: "19:30", deliveryWindow: "8:00 PM – 9:00 PM (Central Chennai)" };
  let currentItems = [];

  const emit = () => {
    callback({
      configured: true,
      active: Boolean(currentConfig.active),
      note: currentConfig.note || "",
      windowStart: currentConfig.windowStart || "19:00",
      windowEnd: currentConfig.windowEnd || "19:30",
      deliveryWindow: currentConfig.deliveryWindow || "8:00 PM – 9:00 PM (Central Chennai)",
      items: currentItems
    });
  };

  const unsubCfg = onSnapshot(
    doc(db, "flash_config", "evening_saver"),
    (snap) => {
      if (snap.exists()) currentConfig = { ...currentConfig, ...snap.data() };
      else currentConfig = { ...currentConfig, active: false };
      emit();
    },
    (err) => console.warn("[HuckleberryCloud] Flash config listener:", err.code)
  );

  const unsubItems = onSnapshot(
    query(collection(db, "flash_items"), orderBy("updatedAt", "desc"), limit(30)),
    (snap) => {
      currentItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      emit();
    },
    (err) => console.warn("[HuckleberryCloud] Flash items listener:", err.code)
  );

  return () => {
    unsubCfg();
    unsubItems();
  };
}

// ============================================================================
// Authenticated Kitchen Admin Operations (`admin.html`)
// ============================================================================
function onAdminAuthChange(cb) {
  if (!cloudReady || !auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

async function signInAdmin(email, password) {
  if (!cloudReady || !auth) throw new Error("Firebase is not configured yet in firebase-config.js.");
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

async function signOutAdmin() {
  if (!cloudReady || !auth) return;
  await signOut(auth);
}

async function checkIsAdmin(uid) {
  if (!cloudReady || !db || !uid) return false;
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch (err) {
    console.warn("[HuckleberryCloud] Admin check error:", err.code);
    return false;
  }
}

function subscribeOrders(callback, onError) {
  if (!cloudReady || !db) return () => {};
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(200));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(list);
    },
    (err) => onError && onError(err)
  );
}

async function getOrderProof(orderId) {
  if (!cloudReady || !db) return null;
  const snap = await getDoc(doc(db, "order_proofs", orderId));
  return snap.exists() ? snap.data() : null;
}

const ORDER_STATUS_LABELS = {
  pending: "Payment Audit Required",
  baking: "In Oven / Prep",
  delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

async function updateOrderStatus(orderId, newStatus, extra = {}) {
  if (!cloudReady || !db) throw new Error("Firebase not configured.");
  const label = ORDER_STATUS_LABELS[newStatus] || newStatus;
  const batch = writeBatch(db);
  const now = serverTimestamp();

  const orderUpdate = {
    status: newStatus,
    statusLabel: label,
    updatedAt: now
  };
  if (newStatus === "baking" && extra.markVerified) {
    orderUpdate.verifiedAt = now;
  }

  batch.update(doc(db, "orders", orderId), orderUpdate);
  batch.update(doc(db, "order_tracking", orderId), {
    status: newStatus,
    statusLabel: label,
    updatedAt: now
  });

  // Automatically decrement evening flash stock when Kitchen verifies a flash order
  if (extra.decrementFlashItemId && extra.decrementFlashQty > 0) {
    const flashRef = doc(db, "flash_items", extra.decrementFlashItemId);
    const flashSnap = await getDoc(flashRef);
    if (flashSnap.exists()) {
      const cur = Number(flashSnap.data().qtyRemaining || 0);
      const nextQty = Math.max(0, cur - Number(extra.decrementFlashQty));
      batch.update(flashRef, {
        qtyRemaining: nextQty,
        active: nextQty > 0,
        updatedAt: now
      });
    }
  }

  await batch.commit();
}

function subscribeConsultations(callback, onError) {
  if (!cloudReady || !db) return () => {};
  const q = query(collection(db, "consultations"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(list);
    },
    (err) => onError && onError(err)
  );
}

async function updateConsultationStatus(consultationId, status) {
  if (!cloudReady || !db) throw new Error("Firebase not configured.");
  await updateDoc(doc(db, "consultations", consultationId), {
    status,
    updatedAt: serverTimestamp()
  });
}

async function setFlashConfig(active, note = "") {
  if (!cloudReady || !db) throw new Error("Firebase not configured.");
  await setDoc(
    doc(db, "flash_config", "evening_saver"),
    {
      active: Boolean(active),
      windowStart: "19:00",
      windowEnd: "19:30",
      deliveryWindow: "8:00 PM – 9:00 PM (Central Chennai)",
      note: String(note || "").trim().slice(0, 300),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

async function addFlashItem({ name, originalPrice, flashPrice, qtyRemaining, image = "" }) {
  if (!cloudReady || !db) throw new Error("Firebase not configured.");
  const qty = Math.max(1, Math.min(500, parseInt(qtyRemaining, 10) || 1));
  const orig = Math.max(1, Number(originalPrice) || Number(flashPrice));
  const flash = Math.max(1, Number(flashPrice) || 1);
  return addDoc(collection(db, "flash_items"), {
    name: String(name || "").trim().slice(0, 120),
    originalPrice: orig,
    flashPrice: flash,
    qtyRemaining: qty,
    active: qty > 0,
    image: String(image || "").trim().slice(0, 300),
    updatedAt: serverTimestamp()
  });
}

async function updateFlashItemQty(itemId, newQty) {
  if (!cloudReady || !db) throw new Error("Firebase not configured.");
  const qty = Math.max(0, Math.min(500, parseInt(newQty, 10) || 0));
  await updateDoc(doc(db, "flash_items", itemId), {
    qtyRemaining: qty,
    active: qty > 0,
    updatedAt: serverTimestamp()
  });
}

async function removeFlashItem(itemId) {
  if (!cloudReady || !db) throw new Error("Firebase not configured.");
  await deleteDoc(doc(db, "flash_items", itemId));
}

// ============================================================================
// Expose Global API & Emit Ready Event
// ============================================================================
window.HuckleberryCloud = {
  isReady: () => cloudReady,
  generateOrderToken,
  normalizeIndianPhone,
  isValidEmail,
  compressImageToDataUrl,
  trackPixelEvent,
  submitOrder,
  lookupOrderTracking,
  submitConsultation,
  subscribeFlashSale,
  // Admin
  onAdminAuthChange,
  signInAdmin,
  signOutAdmin,
  checkIsAdmin,
  subscribeOrders,
  getOrderProof,
  updateOrderStatus,
  subscribeConsultations,
  updateConsultationStatus,
  setFlashConfig,
  addFlashItem,
  updateFlashItemQty,
  removeFlashItem,
  ORDER_STATUS_LABELS,
  increment
};

window.dispatchEvent(new CustomEvent("huckleberry:cloud-ready", { detail: { ready: cloudReady } }));
