# YOUR HUCKLEBERRY — PROJECT MEMORY & REPOSITORY CONTEXT DOSSIER

> **CONFIDENTIAL ARCHITECTURAL MEMORY — FOR REPOSITORY CONTRIBUTORS & AGENTS**  
> *When cloning this repository, read this document first. It establishes the complete operational memory, architectural decisions, client specifics, and security governance for Your Huckleberry.*

---

## 1. Core Entity & Business Metadata

| Parameter | Operational Specification |
|---|---|
| **Client Brand** | **Your Huckleberry** (`@huckleberry.inn`) |
| **Founder & Creative Patissier** | **Ridha** |
| **Lead Digital Agency** | **A Generative Slice** (Mohammed Hussain, Founder & CEO) |
| **Commercial Bank** | **Indian Overseas Bank (IOB)** — Account Name: *Your Huckleberry* |
| **Primary UPI ID** | `eoteatop@okicici` (Payee Name: *huckle berry*) |
| **Kitchen & Studio Atelier** | Shafee Mohammed Road, Thousand Lights West, Nungambakkam, Chennai 600006 |
| **Dispatch & Baking Unit** | 13/5 Gulam Abbas Ali Khan 4th Street, Thousand Lights, Chennai 600006 |
| **Official Contact Numbers** | `+91 85118 39668` (Primary WhatsApp), `+91 73387 77927` |
| **Custom Domain** | **`yourhuckleberry.in`** / **`www.yourhuckleberry.in`** |
| **Domain Registrar** | BigRock (Order ID: `127024508`) |
| **Hosting Platform** | GitHub Pages (`A-Generative-Slice/huckleberry.inn` on branch `main`) |
| **Target Go-Live** | **December 1, 2026** |
| **Campaign Horizon** | **December 1 – December 31, 2026** (Festive Season) |

---

## 2. Infrastructure & DNS Architecture

### BigRock DNS Mapping (Verified via Google Public DNS DoH):
```
Apex (yourhuckleberry.in)  --> 4 A Records:
                               185.199.108.153
                               185.199.109.153
                               185.199.110.153
                               185.199.111.153
Subdomain (www)           --> CNAME Record:
                               a-generative-slice.github.io.
Root CNAME File           --> yourhuckleberry.in (In repository root)
```

### Domain Mail Strategy (3 Designated Mailboxes):
To keep marketing, transactional authentication, and customer notifications clean and deliverable:
1. **`orders@yourhuckleberry.in`**: Order confirmations, kitchen receipts, delivery slot updates.
2. **`auth@yourhuckleberry.in`**: 4-digit customer login OTPs, passwordless access, security verification.
3. **`corporate@yourhuckleberry.in`**: B2B festive hamper outreach, corporate pitches, internal kitchen alert forwarding.

*Kickoff Cost Protocol:* Built 100% free using Zoho Mail Forever Free Plan (up to 5 users, zero cost) + Resend.com (3,000 free emails/month for automated GitHub Actions outreach).

---

## 3. Public Repository Governance & Security Protocol

### The Challenge:
GitHub Pages requires the repository `A-Generative-Slice/huckleberry.inn` to be **Public** to host a custom domain on the standard plan. However, business operations, automated scripts, and customer interactions must never expose sensitive client credentials, private customer PII, or internal passwords online.

### The 4 Security Rules for this Repository:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   PUBLIC REPO SECURITY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Zero Secrets in Source Code:                                             │
│    - Never commit passwords, private API keys, or SMTP credentials.         │
│    - Use GitHub Repository Secrets (Settings -> Secrets -> Actions).        │
│    - Scripts read credentials via os.environ['SECRET_NAME'].                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Strict .gitignore Exclusion:                                             │
│    - .env, credentials.json, *.pem, *.key are strictly gitignored.          │
│    - customer_export_*.csv and private_leads*.json are excluded.            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Client Data Segregation:                                                 │
│    - Public Repo contains: Website code, UI assets, sanitized docs.         │
│    - Private Business Dashboard contains: Commercial proposals, lead lists, │
│      contractual terms (/sdcard/antigravity/a-generative-slice-business-    │
│      dashboard/clients/your-huckleberry/).                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. Client-Side Sanitized Storage:                                           │
│    - Customer cart & order verification proofs are stored in browser        │
│      localStorage on the user and admin devices, never dumped to git.       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Core Features & Architectural Solutions

### A. Manual UPI QR + Mandatory Screenshot Upload Gate
* **The Problem:** 3rd-party payment gateways (Razorpay) require days of KYC verification and charge per-transaction fees. Customers also frequently place fake orders without paying.
* **The Solution:** On [`atelier.html`](file:///sdcard/antigravity/huckleberry.inn/atelier.html), customers scan `eoteatop@okicici` to pay a 50% advance. The order button is **hard-locked** until the user uploads their UPI payment screenshot. Orders cannot be submitted without proof.
* **Manual Verification:** In [`admin.html`](file:///sdcard/antigravity/huckleberry.inn/admin.html), kitchen staff inspects the screenshot in a full-screen Lightbox, verifies with their bank app, and clicks *"✓ Verify & Start Baking"*.

### B. Kitchen Operations Command Center (`admin.html`)
* **Live Order Pipeline:** Tracks orders through 4 distinct stages: *Pending Payment / Audit ➔ In Oven / Prep ➔ Out for Delivery ➔ Delivered*.
* **1-Click Customer CSV Export:** Downloads all registered customer emails and phone numbers to feed marketing and seasonal campaigns.
* **7:00 PM – 7:30 PM Zero-Waste Flash Window:** A 30-minute daily evening flash sale where kitchen staff lists surplus fresh pastries at near-cost price for 8:00 PM – 9:00 PM delivery, eliminating food waste.
* **Bespoke Consultation Manager:** Replaces the automated 3D customizer for multi-tier wedding cakes with high-touch voice consultation scheduling with Chef Ridha.

### C. December 2026 Festive Catalog
* Traditional Christmas Plum Cake (Vintage Tin 500g @ ₹650 / 1kg @ ₹1,200)
* Corporate Executive Celebration Hamper (6-Item Luxury Box @ ₹1,450)
* Mini Couture Luxe Trunk (4-Piece Set @ ₹1,200)
* Artisanal Office Party Snack & Savory Platter (24 Pcs @ ₹2,200)

### D. The ₹39 Introductory Trial Cake Hook (`TASTE39`)
* A low-barrier introductory coupon that allows first-time Chennai buyers to pay just ₹30–₹60 out of pocket for a fresh mini cake or brownie tub.
* Captures verified emails and phone numbers, converting cold social media lurkers into loyal repeat customers.

### E. Meta Ads Manager vs. In-App Boost (The Sales Rationale)
* **Why Past Boost Ads Failed:** In-app "Boost" optimizes for cheap clicks across India (Bihar, UP, Delhi, Maharashtra) who double-tap food reels but can never buy fresh cream cakes in Chennai.
* **Our Meta Ads Setup:** Pin-drop geo-fencing strictly within 8–10km of Thousand Lights/Nungambakkam/Alwarpet/OMR, targeting affluent professionals (Ages 25–48) with Click-to-WhatsApp and Direct Checkout objectives.

---

## 5. File Inventory & Repository Structure

```
huckleberry.inn/
├── .gitignore                     # Security & PII exclusion rules
├── .nojekyll                      # Bypasses Jekyll processing on GitHub Pages
├── CNAME                          # Production domain: yourhuckleberry.in
├── README.md                      # Comprehensive public repository documentation
├── PROJECT_MEMORY.md              # THIS FILE: Complete operational memory & context
├── index.html                     # Homepage with December Festive Announcement Ribbon
├── collection.html                # 38-item categorized catalog with Festive Hampers tab
├── atelier.html                   # Cake Atelier, Voice Consultation booking & UPI Gate
├── admin.html                     # Kitchen Command Center, order tracker & CSV export
├── pipeline.html                  # 5-step creation & hygiene pipeline showcase
├── gallery.html                   # Visual archives & client celebration tiers
├── location.html                  # Studio atelier directions & Chennai delivery map
├── faq.html                       # 100% Pure Veg standards & ordering policies
├── data.js                        # Master data catalog (38 items + 4 festive hampers)
├── app.js                         # Application logic, filters, UPI gate & LocalStorage
├── style.css                      # Ultra-luxury haute patisserie styling framework
├── assets/
│   ├── logo.jpg                   # Your Huckleberry official arch crest
│   ├── payment-qr.jpg             # UPI QR code (eoteatop@okicici)
│   ├── images/                    # 40+ high-resolution product & atelier photography
│   └── Your_Huckleberry_Commercial_Proposal_Dec2026.pdf # 3-Page Executive Proposal
└── scripts/
    └── generate_remaining_items.py # Script for generating catalog items
```

---

## 6. Commercial Terms & Retainer Summary

* **Scope 1: E-Commerce Storefront & Operations Build** (One-Time Setup): **₹15,000**
* **Scope 2: December Growth & Outreach Retainer** (Dec 1 – Dec 31): **₹10,000**
* **Total Agency Fee:** **₹25,000**
* **Payment Milestones:**
  - 50% Kickoff Advance: **₹12,500** (Payable immediately)
  - 50% Go-Live Balance: **₹12,500** (Payable Dec 1, 2026 upon verified go-live)
* **Formal Proposal Document:** [`assets/Your_Huckleberry_Commercial_Proposal_Dec2026.pdf`](file:///sdcard/antigravity/huckleberry.inn/assets/Your_Huckleberry_Commercial_Proposal_Dec2026.pdf)

---

## 7. Immediate Action Checklist for Next Session

1. **BigRock DNS Records**: Add the 5 Zoho TXT/MX records to activate `orders@yourhuckleberry.in`.
2. **Onboarding Inputs**: Collect 4 items from Ridha (photos, price checks, Zoho SMS OTP, and ₹12,500 advance).
3. **Outreach Engine**: Configure GitHub Actions workflow with Resend API key for 50/day corporate pitches.
4. **Ad Account**: Link Meta Ads Manager to `@huckleberry.inn` with Chennai pin-drop geo-fencing.
