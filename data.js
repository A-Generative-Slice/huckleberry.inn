/**
 * Huckleberry Inn (@huckleberry.inn) - Catalog & Cloud Kitchen Data
 * Crafted for A Generative Slice Showcase
 */

const HUCKLEBERRY_DATA = {
  bakery: {
    name: "Your Huckleberry",
    handle: "@huckleberry.inn",
    tagline: "Luxury cakes made for sweet moments",
    taglineTamil: "இனிய தருணங்களுக்காக கைவினைஞர் கேக்குகள்",
    location: "Shafee Mohammed Road, Thousand Lights West, Nungambakkam, Chennai 600006",
    shortLocation: "Thousand Lights / Nungambakkam, Chennai",
    phone: "+91 8511839668",
    whatsappNumber: "918511839668",
    instagramUrl: "https://www.instagram.com/huckleberry.inn",
    rating: "4.8",
    reviewsCount: "137+ Instagram showcases",
    operatingHours: "11:00 AM – 9:00 PM (Tuesday – Sunday)",
    kitchenStatus: "Open for Weekend Bookings",
    leadTimeHours: 24
  },

  tiers: [
    {
      id: "miniature-couture",
      name: "Miniature Couture Box",
      tag: "Signature Bestseller",
      servings: "Individual / Gift Box (Set of 4)",
      weightKg: "0.6 kg",
      basePrice: 1200,
      description: "Delicate individual couture cakes in acrylic display boxes with silk ribbons.",
      layers: 1,
      heightClass: "tier-mini",
      popular: true
    },
    {
      id: "tier-1",
      name: "1-Tier Petite Celebration",
      tag: "Intimate Parties",
      servings: "6 - 8 Guests",
      weightKg: "1.0 kg",
      basePrice: 1650,
      description: "Flawless single-tier centerpiece with artisanal frosting and bespoke florals.",
      layers: 1,
      heightClass: "tier-single",
      popular: false
    },
    {
      id: "tier-2",
      name: "2-Tier Grand Milestone",
      tag: "Most Requested in DMs",
      servings: "18 - 24 Guests",
      weightKg: "2.5 kg",
      basePrice: 3800,
      description: "Architectural two-tier showstopper. Structural dowelling with customized dual-flavor options.",
      layers: 2,
      heightClass: "tier-double",
      popular: true
    },
    {
      id: "tier-3",
      name: "3-Tier Regal Banquet",
      tag: "Weddings & Galas",
      servings: "45 - 60 Guests",
      weightKg: "4.5 kg",
      basePrice: 7400,
      description: "Magnificent luxury tier with internal support pillars, cascaded fresh florals, and metallic gold accents.",
      layers: 3,
      heightClass: "tier-triple",
      popular: false
    }
  ],

  flavors: [
    {
      id: "belgian-truffle",
      name: "Belgian Dark Chocolate Truffle",
      notes: "70% Callebaut dark ganache, valrhona cocoa sponge, espresso soak",
      priceAdd: 0,
      colorHex: "#361B14",
      frostingHex: "#4A271F",
      badge: "Crowd Favorite"
    },
    {
      id: "lychee-rose",
      name: "Persian Lychee Rose & Raspberry",
      notes: "Wild raspberry coulis, organic Damask rose infusion, poached lychees",
      priceAdd: 250,
      colorHex: "#F28C9F",
      frostingHex: "#FADADD",
      badge: "Huckleberry Signature"
    },
    {
      id: "burnt-basque",
      name: "Burnt Basque Vanilla Bean",
      notes: "San Sebastián caramelized crust, gooey Madagascan vanilla mascarpone core",
      priceAdd: 300,
      colorHex: "#B87034",
      frostingHex: "#EBD0A7",
      badge: "Chef's Special"
    },
    {
      id: "biscoff-caramel",
      name: "Lotus Biscoff & Salted Butter Caramel",
      notes: "Speculoos spiced sponge, caramelized Biscoff crunch, Fleur de Sel drizzle",
      priceAdd: 200,
      colorHex: "#C67C38",
      frostingHex: "#DEB887",
      badge: ""
    },
    {
      id: "sicilian-lemon",
      name: "Sicilian Lemon Curd & Wild Berry",
      notes: "Zesty citrus curd, wild berry reduction, light elderflower chiffon",
      priceAdd: 150,
      colorHex: "#E7C95D",
      frostingHex: "#FFF5CC",
      badge: ""
    },
    {
      id: "red-velvet",
      name: "Red Velvet & Madagascan Cream Cheese",
      notes: "Traditional crimson cocoa crumb, silky whipped cream cheese frosting",
      priceAdd: 100,
      colorHex: "#8B1E29",
      frostingHex: "#FFF8F0",
      badge: ""
    }
  ],

  finishes: [
    {
      id: "vintage-lambeth",
      name: "Vintage Lambeth Ruffle Piping",
      desc: "Intricate Victorian lace piping, multi-drop garlands, and royal shell borders.",
      priceAdd: 350,
      styleClass: "finish-lambeth"
    },
    {
      id: "textured-palette",
      name: "Modern Textured Palette Knife",
      desc: "Painterly impressionist strokes, sculptural buttercream petals, and organic texture.",
      priceAdd: 250,
      styleClass: "finish-palette"
    },
    {
      id: "velvet-gold",
      name: "Matte Velvet Cocoa & 24K Gold Leaf",
      desc: "Airbrushed velvety texture dusted with genuine edible 24-karat gold leaf flake.",
      priceAdd: 450,
      styleClass: "finish-velvet"
    },
    {
      id: "semi-naked-floral",
      name: "Semi-Naked Rustic with Organic Florals",
      desc: "Delicately scraped sponge revealing layers, crowned with food-safe fresh botanicals.",
      priceAdd: 200,
      styleClass: "finish-rustic"
    }
  ],

  deliveryZones: [
    { zone: "Shafee Mohammed Rd / Thousand Lights (Kitchen Pickup)", pin: "600006", fee: 0 },
    { zone: "Nungambakkam & Wallace Gardens", pin: "600034", fee: 120 },
    { zone: "Alwarpet, T. Nagar & Gopalapuram", pin: "600018", fee: 160 },
    { zone: "Anna Nagar, Kilpauk & Egmore", pin: "600040", fee: 220 },
    { zone: "Adyar, Besant Nagar & ECR", pin: "600020", fee: 280 },
    { zone: "OMR, Velachery & Perungudi", pin: "600096", fee: 320 }
  ],

  signatureGallery: [
    {
      id: "gallery-1",
      title: "The Thousand Lights Lambeth Tier",
      category: "custom-tiers",
      weight: "2.5 kg (2-Tier)",
      flavor: "Lychee Rose + Belgian Ganache",
      price: "₹4,400",
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=900&q=80",
      description: "Artisanal vintage piping with edible pearls and soft blush rose highlights."
    },
    {
      id: "gallery-2",
      title: "Miniature Couture Quad Gift Box",
      category: "miniature",
      weight: "Set of 4 Designer Minis",
      flavor: "Assorted Chef Flavors",
      price: "₹1,200",
      image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=900&q=80",
      description: "Huckleberry Inn's famed miniature series. Perfect for birthdays, hampers and VIP corporate gifting."
    },
    {
      id: "gallery-3",
      title: "San Sebastián Burnt Basque Wheel",
      category: "cheesecake",
      weight: "1.2 kg",
      flavor: "Pure Madagascan Vanilla",
      price: "₹1,950",
      image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?auto=format&fit=crop&w=900&q=80",
      description: "Deep caramelized exterior with molten, silken center crafted with European cream cheese."
    },
    {
      id: "gallery-4",
      title: "Belgian Noir 70% Gold Leaf Cake",
      category: "custom-tiers",
      weight: "1.5 kg (1-Tier)",
      flavor: "Single Origin Callebaut",
      price: "₹2,650",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
      description: "Velvety dark ganache mirror glaze adorned with 24K edible gold leaves and candied blackberries."
    },
    {
      id: "gallery-5",
      title: "Petite Fleur Palette Knife Cake",
      category: "custom-tiers",
      weight: "1.0 kg",
      flavor: "Sicilian Lemon & Wild Berries",
      price: "₹1,950",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",
      description: "Hand-painted edible oil impasto petals with Swiss meringue buttercream."
    },
    {
      id: "gallery-6",
      title: "Artisanal Savoury Brioche & Quiche Tartlets",
      category: "savouries",
      weight: "Box of 6",
      flavor: "Sun-Dried Tomato & Feta Brioche",
      price: "₹850",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
      description: "Slow-fermented French butter brioche and caramelized onion quiches for high teas."
    }
  ],

  kitchenSimulatorOrders: [
    {
      id: "ORD-9412",
      customer: "Priyanka R. (Nungambakkam)",
      tier: "2-Tier Celebration (2.5 kg)",
      flavor: "Lychee Rose + Belgian Ganache",
      finish: "Vintage Lambeth Ruffle",
      date: "Tomorrow, 4:00 PM Slot",
      amount: "₹4,150",
      status: "Advance Paid (Slot Locked)",
      source: "Automated Portal Checkout",
      timeAgo: "14 mins ago"
    },
    {
      id: "ORD-9411",
      customer: "Karthik V. (Wallace Gardens)",
      tier: "Miniature Couture (Set of 4)",
      flavor: "Assorted Chef Selection",
      finish: "Acrylic Gift Ribbon",
      date: "Today, 6:30 PM",
      amount: "₹1,200",
      status: "Baking / Packaging",
      source: "Automated Portal Checkout",
      timeAgo: "42 mins ago"
    },
    {
      id: "ORD-9410",
      customer: "Deepa S. (Alwarpet)",
      tier: "Burnt Basque Cheesecake (1.2 kg)",
      flavor: "Madagascan Vanilla Bean",
      finish: "Rustic Wood Base",
      date: "Today, 7:00 PM",
      amount: "₹1,950",
      status: "Ready for Dispatch (Dunzo / Pickup)",
      source: "Automated Portal Checkout",
      timeAgo: "1 hr ago"
    },
    {
      id: "ORD-9409",
      customer: "Ananya M. (Thousand Lights)",
      tier: "3-Tier Regal Banquet (4.5 kg)",
      flavor: "Belgian Dark Chocolate Truffle",
      finish: "Velvet Cocoa & 24K Gold Leaf",
      date: "Saturday, 11:00 AM",
      amount: "₹8,200",
      status: "Consultation Booked",
      source: "VIP Automated Ingestion",
      timeAgo: "3 hrs ago"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HUCKLEBERRY_DATA;
}
