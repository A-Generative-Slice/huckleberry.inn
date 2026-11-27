/**
 * Your Huckleberry (yourhuckleberry.in) — Free-Tier Cloudflare Worker Email Relay
 *
 * Keeps RESEND_API_KEY 100% server-side. Sends:
 *  - POST /api/notify-order        -> Customer receipt (orders@) + Kitchen alert (corporate@)
 *  - POST /api/notify-consultation -> Customer confirmation (orders@) + Chef Ridha alert (corporate@)
 *  - POST /api/send-otp            -> 4-digit verification code (auth@) + signed stateless token
 *  - POST /api/verify-otp          -> Verifies 4-digit code against signed token
 */

function corsHeaders(origin, allowedOrigin) {
  const allowed = [allowedOrigin, "https://www.yourhuckleberry.in", "http://localhost:3000", "http://127.0.0.1:5500"];
  const matched = allowed.includes(origin) ? origin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": matched,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

async function sendResendEmail(env, { from, to, subject, html, replyTo }) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY secret is not configured in Cloudflare Worker.");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo || undefined
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error ${res.status}: ${errText}`);
  }
  return res.json();
}

async function signHmac(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://yourhuckleberry.in";
    const headers = corsHeaders(origin, allowedOrigin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), { status: 405, headers });
    }

    const url = new URL(request.url);
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON payload" }), { status: 400, headers });
    }

    const ordersFrom = env.ORDERS_FROM || "Your Huckleberry Orders <orders@yourhuckleberry.in>";
    const authFrom = env.AUTH_FROM || "Your Huckleberry Auth <auth@yourhuckleberry.in>";
    const kitchenTo = env.KITCHEN_ALERT_TO || "corporate@yourhuckleberry.in";

    try {
      // 1. Order Receipt + Instant Kitchen Alert
      if (url.pathname === "/api/notify-order") {
        const { token, customerName, customerEmail, customerPhone, address, itemSummary, total, advanceAmount, deliveryDate, deliverySlot, utr, orderType } = body;
        if (!token || !customerEmail || !customerName) {
          return new Response(JSON.stringify({ ok: false, error: "Missing required order fields" }), { status: 400, headers });
        }

        const trackUrl = `https://yourhuckleberry.in/pipeline.html?token=${encodeURIComponent(token)}`;
        const adminUrl = `https://yourhuckleberry.in/admin.html`;

        // Customer Receipt
        await sendResendEmail(env, {
          from: ordersFrom,
          to: customerEmail,
          replyTo: kitchenTo,
          subject: `Order Received #${esc(token)} — Your Huckleberry Chennai`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #2D1820; border: 1px solid #EFE4D8; border-radius: 14px; overflow: hidden;">
              <div style="background: #3E1929; color: #FAF7F2; padding: 22px 24px;">
                <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #E2C088;">Your Huckleberry • Nungambakkam, Chennai</div>
                <h1 style="margin: 6px 0 0; font-size: 20px;">Thank You, ${esc(customerName)}!</h1>
              </div>
              <div style="padding: 22px 24px; background: #FFFFFF;">
                <p style="margin: 0 0 14px; font-size: 14px; line-height: 1.6;">
                  We have received your booking slip and UPI payment proof for token <strong>#${esc(token)}</strong>. Chef Ridha's kitchen team will verify your transfer and begin baking!
                </p>
                <div style="background: #FAF7F2; border-radius: 10px; padding: 14px 16px; font-size: 13px; line-height: 1.7; margin-bottom: 16px;">
                  <div><strong>Order Token:</strong> #${esc(token)}</div>
                  <div><strong>Selection:</strong> ${esc(itemSummary)}</div>
                  <div><strong>Total:</strong> ₹${esc(total)} (Paid/Advance: ₹${esc(advanceAmount)})</div>
                  <div><strong>Delivery / Pickup:</strong> ${esc(deliveryDate || "Confirmed via WhatsApp")} • ${esc(deliverySlot || "")}</div>
                  <div><strong>Address:</strong> ${esc(address || "Shafee Mohammed Rd Studio Pickup")}</div>
                  ${utr ? `<div><strong>UPI Ref / UTR:</strong> ${esc(utr)}</div>` : ""}
                </div>
                <p style="text-align: center; margin: 18px 0;">
                  <a href="${trackUrl}" style="background: #3E1929; color: #FFFFFF; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">Track Live Kitchen Status ➔</a>
                </p>
                <p style="font-size: 12px; color: #6B5C61; margin-top: 16px;">
                  100% Pure Veg Eggless Haute Pâtisserie • Shafee Mohammed Road, Nungambakkam, Chennai 600006<br/>
                  WhatsApp Concierge: +91 85118 39668
                </p>
              </div>
            </div>`
        });

        // Instant Kitchen Alert to Ridha's Phone
        await sendResendEmail(env, {
          from: ordersFrom,
          to: kitchenTo,
          replyTo: customerEmail,
          subject: `🔔 NEW ORDER #${esc(token)} (₹${esc(total)}) — ${esc(customerName)} [${esc(orderType || "web")}]`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; color: #0F172A;">
              <h2 style="color: #C2410C; margin-bottom: 10px;">New Paid Order Awaiting Verification</h2>
              <p><strong>Token:</strong> #${esc(token)} (${esc(orderType)})<br/>
              <strong>Customer:</strong> ${esc(customerName)} • ${esc(customerPhone)} • ${esc(customerEmail)}<br/>
              <strong>Items:</strong> ${esc(itemSummary)}<br/>
              <strong>Total / Paid:</strong> ₹${esc(total)} / ₹${esc(advanceAmount)}<br/>
              <strong>UTR:</strong> ${esc(utr || "See attached screenshot in Admin")}<br/>
              <strong>Slot:</strong> ${esc(deliveryDate)} • ${esc(deliverySlot)}<br/>
              <strong>Address:</strong> ${esc(address)}</p>
              <p style="margin-top: 16px;">
                <a href="${adminUrl}" style="background: #FF5C00; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 700;">Open Kitchen Command &amp; Verify Screenshot ➔</a>
              </p>
            </div>`
        });

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
      }

      // 2. Wedding & Milestone Consultation Alert
      if (url.pathname === "/api/notify-consultation") {
        const { name, phone, email, eventDate, guestCount, preferredCallSlot, notes, photoCount } = body;
        if (!name || !email) {
          return new Response(JSON.stringify({ ok: false, error: "Missing consultation fields" }), { status: 400, headers });
        }

        await sendResendEmail(env, {
          from: ordersFrom,
          to: kitchenTo,
          replyTo: email,
          subject: `🎂 BESPOKE CONSULTATION: ${esc(name)} — ${esc(eventDate)} (${esc(guestCount)} guests)`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; color: #0F172A;">
              <h2 style="color: #7C2D12;">New Wedding / Milestone Voice Call Request</h2>
              <p><strong>Client:</strong> ${esc(name)}<br/>
              <strong>Phone:</strong> ${esc(phone)}<br/>
              <strong>Email:</strong> ${esc(email)}<br/>
              <strong>Event Date:</strong> ${esc(eventDate)}<br/>
              <strong>Guest Count:</strong> ${esc(guestCount)}<br/>
              <strong>Preferred 10-Min Call Slot:</strong> ${esc(preferredCallSlot)}<br/>
              <strong>Dream Cake Photos Attached:</strong> ${esc(photoCount || 0)}<br/>
              <strong>Notes:</strong> ${esc(notes)}</p>
              <p><a href="https://yourhuckleberry.in/admin.html" style="background: #3E1929; color: #FFFFFF; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">View Reference Photos in Admin ➔</a></p>
            </div>`
        });

        await sendResendEmail(env, {
          from: ordersFrom,
          to: email,
          replyTo: kitchenTo,
          subject: `Consultation Call Requested — Chef Ridha, Your Huckleberry`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; color: #2D1820;">
              <h2 style="color: #3E1929;">We've Received Your Bespoke Cake Request</h2>
              <p>Hi ${esc(name)}, thank you for reaching out to Your Huckleberry! Chef Ridha has received your event details (${esc(eventDate)} • ${esc(guestCount)} guests) and preferred 10-minute call window (${esc(preferredCallSlot)}).</p>
              <p>We will reach out to you on <strong>${esc(phone)}</strong> shortly. For immediate inspiration sharing, message us anytime on WhatsApp at <strong>+91 85118 39668</strong>.</p>
            </div>`
        });

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
      }

      // 3. Stateless 4-Digit Email OTP (auth@yourhuckleberry.in)
      if (url.pathname === "/api/send-otp") {
        const email = String(body.email || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400, headers });
        }
        const secret = env.OTP_HMAC_SECRET || env.RESEND_API_KEY;
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        const code = String(1000 + (arr[0] % 9000));
        const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
        const sig = await signHmac(secret, `${email}|${code}|${exp}`);

        await sendResendEmail(env, {
          from: authFrom,
          to: email,
          subject: `${code} is your Your Huckleberry verification code`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; color: #2D1820; padding: 20px; border: 1px solid #EFE4D8; border-radius: 12px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C29557;">Your Huckleberry Chennai</div>
              <h2 style="margin: 8px 0; color: #3E1929;">Your Verification Code</h2>
              <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #3E1929; background: #FAF7F2; padding: 14px; text-align: center; border-radius: 8px; margin: 14px 0;">${code}</div>
              <p style="font-size: 13px; color: #6B5C61;">Valid for 10 minutes. If you did not request this code on yourhuckleberry.in, you can safely ignore this email.</p>
            </div>`
        });

        return new Response(JSON.stringify({ ok: true, challenge: `${exp}.${sig}` }), { status: 200, headers });
      }

      if (url.pathname === "/api/verify-otp") {
        const email = String(body.email || "").trim().toLowerCase();
        const code = String(body.code || "").trim();
        const challenge = String(body.challenge || "");
        const [expStr, sig] = challenge.split(".");
        const exp = Number(expStr);
        if (!email || !code || !exp || !sig || Date.now() > exp) {
          return new Response(JSON.stringify({ ok: false, error: "Verification code expired or invalid." }), { status: 400, headers });
        }
        const secret = env.OTP_HMAC_SECRET || env.RESEND_API_KEY;
        const expected = await signHmac(secret, `${email}|${code}|${exp}`);
        if (expected !== sig) {
          return new Response(JSON.stringify({ ok: false, error: "Incorrect 4-digit verification code." }), { status: 400, headers });
        }
        return new Response(JSON.stringify({ ok: true, verified: true }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
  }
};
