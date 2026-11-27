# DESIGN.md — Your Huckleberry (`yourhuckleberry.in`)

> **Design System Specification** — Synthesized from `VoltAgent/awesome-design-md` (Stripe commerce clarity & Linear restraint), `nextlevelbuilder/ui-ux-pro-max-skill`, `rohitg00/awesome-claude-design` (Anti-Slop Kit), and `Laith0003/ux-skill` (171-rule WCAG 2.2 AA & UX linter).

---

## 1. Brand Positioning & Visual Direction
- **Identity:** Bespoke 100% Pure Vegetarian & Eggless Haute Pâtisserie + Chennai Cloud Kitchen (Nungambakkam, Chennai 600006).
- **Aesthetic Path:** **Calm Quiet-Luxury Editorial (Path A) + Beginner-Proof Delivery Utility (Path B)** — warm, composed, trustworthy, appetite-led, zero flashy/gimmicky animations.
- **Anti-Slop Rules Enforced:**
  - Zero teal/purple generic AI gradients, zero neon `#FF5C00` aggregator clutter clashing with Imperial Plum.
  - Zero raw hex overrides in components — all surfaces, alerts, and accents draw from semantic tokens.
  - Real text menus (never image-only flyers), explicit all-states UI (`idle`, `loading`, `empty`, `error`, `success`, `sold-out`).
  - Zero complex DIY cake-stacking dropdowns — ready-made items use 1-tap Bag / Direct UPI Checkout; grand custom & wedding cakes use a simple 10-minute Chef Ridha Voice Call booking.

---

## 2. Semantic Design Tokens

| Role | CSS Variable | Value | Contrast / Usage |
|---|---|---|---|
| **Page Background** | `--color-bg` | `#FAF8F5` | Warm unbleached cream canvas |
| **Card Surface** | `--color-surface` | `#FFFFFF` | Crisp elevated pastry cards & drawers |
| **Subtle Surface** | `--color-surface-subtle` | `#F4EFE8` | Warm inset banners & summary panels |
| **Primary Brand** | `--color-plum-royal` | `#371A40` | Headings, primary CTAs (13.4:1 on `#FAF8F5` — AAA) |
| **Deep Brand** | `--color-plum-deep` | `#240E2B` | High-contrast headers & dark banners |
| **Festive Accent** | `--color-terracotta` | `#A83E1C` | Warm spiced cinnamon accent for Festive Hampers & 7 PM Saver (5.8:1 on white — AA+) |
| **Festive Soft Surface** | `--color-terracotta-soft` | `#FDF4EF` | Calm warm background for festive/flash banners |
| **Gold Hairline / Accent** | `--color-gold-deep` | `#805819` | Darkened antique gold text (5.6:1 on `#FAF8F5` — WCAG 2.2 AA+) |
| **Pure Veg / Success** | `--color-veg-green` | `#0E7A53` | FSSAI pure veg indicator, verified status (5.2:1 on white — AA) |
| **Body Text** | `--color-text-main` | `#1D181F` | Primary readable text (16.5:1 — AAA) |
| **Muted Text** | `--color-text-muted` | `#574E5A` | Secondary copy (7.6:1 on `#FAF8F5` — AAA) |
| **Error** | `--color-error` | `#B91C1C` | Inline validation & out-of-zone alerts |

---

## 3. Typography & Spacing Discipline
- **Display / Editorial Headings:** `'Playfair Display', 'Cormorant Garamond', Georgia, serif`
- **Classical Micro-Labels:** `'Cinzel', Georgia, serif` (uppercase, tracked `0.16em`, minimum contrast 4.5:1)
- **UI & Body Copy:** `'Plus Jakarta Sans', system-ui, sans-serif` — base **`16px`**, `line-height: 1.6`
- **Spacing Scale:** Strict 4px / 8px rhythm (`8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Motion Restraint:** Subtle `200ms cubic-bezier(0.16, 1, 0.3, 1)` hover/state feedback only. Zero bouncing, floating, or distracting animations. Strict `@media (prefers-reduced-motion: reduce)` override.

---

## 4. Core Customer & Kitchen Workflows

### Customer Flow (Beginner-Proof)
1. **Check Chennai Delivery** → Instant 6-digit pincode checker above the fold.
2. **Browse & Add to Bag (or 1-Tap Order Now)** → Festive Hampers, Everyday Desserts, Mini Cakes, Tarts, ₹39 `TASTE39` Trial, or 7:00 PM Zero-Waste Saver.
3. **3-Step Guided UPI Checkout** → `1. Your Details` → `2. Scan & Pay UPI` → `3. Upload Proof & Done` → instant `#HK-XXXXXX` token.
4. **Track Live Status** → Top-of-page live tracker on `pipeline.html` (`Payment Check → Baking → Out for Delivery → Delivered`).
5. **Wedding & Custom Cakes** → Simple 10-minute Voice Call + dream photo upload on `atelier.html` (no confusing DIY tier stacker).

### Kitchen Team Flow (`admin.html` — Beginner-Proof for Baker & Staff)
- **Visual 4-Station Workflow Bar:** `1. Verify Payment` → `2. Bake & Prep` → `3. Pack & Dispatch` → `4. Delivered`.
- **1 Big Primary Action Button per Ticket:** Staff never hunt through dropdowns — each ticket shows the exact next button (`Check Payment Screenshot` → `Mark Ready & Dispatch` → `Mark Delivered`), plus **1-Tap Kitchen Prep Ticket Copy** and **1-Tap Customer WhatsApp Update**.
- **Built-in Shift Guide:** Collapsible 4-bullet morning-to-evening checklist right inside `admin.html`.
