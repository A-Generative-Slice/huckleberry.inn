/**
 * Your Huckleberry (yourhuckleberry.in) — Cloud & Integration Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Paste your Firebase Web App config values below (Firebase Console -> Project Settings -> Your apps -> Web).
 *    Note: Firebase Web config keys are safe to expose publicly; all access is strictly enforced by `firestore.rules` + Firebase Auth.
 * 2. Optional: Paste your deployed Cloudflare Worker URL into `emailRelayUrl` to enable automatic
 *    `orders@yourhuckleberry.in` receipts, `auth@` OTPs, and instant `corporate@` alerts to Ridha's phone.
 * 3. Optional: Paste your Meta Pixel ID into `metaPixelId` once Ridha completes Meta Partner access.
 */

window.HUCKLEBERRY_CONFIG = {
  // 1. Firebase Spark Free Tier Config (Live Project: your-huckleberry)
  firebase: {
    apiKey: "AIzaSyD0vXnEDisD5ovP0qE23eyBHWzcINts2K8",
    authDomain: "your-huckleberry.firebaseapp.com",
    projectId: "your-huckleberry",
    storageBucket: "your-huckleberry.firebasestorage.app",
    messagingSenderId: "2837837279",
    appId: "1:2837837279:web:847270393b19e9b42cc06a"
  },

  // 2. Cloudflare Worker Email Relay (Keeps RESEND_API_KEY 100% secret server-side)
  // Example: "https://huckleberry-mail-relay.your-subdomain.workers.dev"
  emailRelayUrl: "",

  // 3. Meta Pixel ID (Paste 15-16 digit Pixel ID when ready — auto-initializes across all pages)
  metaPixelId: "",

  // 4. Promotional & Operational Rules
  promo: {
    trialCouponCode: "TASTE39",
    trialPrice: 39,
    trialItemId: "trial-mini-taster",
    trialItemName: "Artisan Mini Taster Cupcake / Brownie Bite (100% Pure Veg)",
    trialOriginalPrice: 120,
    trialDescription: "First-time Chennai buyer exclusive. Taste our Belgian Callebaut & French butter scratch kitchen before booking your milestone celebration cake.",
    trialDailyCap: 15,
    trialPickupNote: "Free pickup at Shafee Mohammed Rd, Nungambakkam (or standard Chennai delivery zone fee)."
  },

  // 5. 7:00 PM - 7:30 PM Zero-Waste Evening Saver Settings (IST)
  flashSale: {
    windowStartHour: 19,
    windowStartMin: 0,
    windowEndHour: 19,
    windowEndMin: 30,
    deliveryWindow: "8:00 PM – 9:00 PM (Central Chennai)",
    timezone: "Asia/Kolkata"
  },

  // Helper: returns true once real Firebase credentials have been pasted
  isFirebaseConfigured() {
    const fb = this.firebase || {};
    return Boolean(
      fb.apiKey &&
      fb.projectId &&
      fb.appId &&
      !String(fb.apiKey).startsWith("YOUR_") &&
      !String(fb.projectId).startsWith("YOUR_")
    );
  }
};
