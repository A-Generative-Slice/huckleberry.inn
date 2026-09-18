/**
 * Your Huckleberry (@huckleberry.inn) - Catalog & Atelier Data
 * Shafee Mohammed Road, Thousand Lights / Nungambakkam, Chennai
 */

const HUCKLEBERRY_DATA = {
  bakery: {
    name: "Your Huckleberry",
    handle: "@huckleberry.inn",
    tagline: "Luxury cakes made for sweet moments",
    quote: "Made to be admired. Made to be savoured slowly.",
    secondaryQuote: "Every swirl, pearl and ribbon is placed with care to turn moments into memories.",
    address: "Shafee Mohammed Road, Thousand Lights West, Nungambakkam, Chennai 600006",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Shafee+Mohammed+Road,+Thousand+Lights+West,+Nungambakkam,+Chennai+600006",
    phone: "+91 8511839668",
    whatsappNumber: "918511839668",
    instagramUrl: "https://www.instagram.com/huckleberry.inn",
    hours: "11:00 AM – 9:00 PM, Tuesday to Sunday",
    specialOffer: "Buy 3 mini cakes and receive a complimentary signature mini. Available for a limited time."
  },

  // The 4 Core Architectural Form Factors
  tiers: [
    {
      id: "mini-couture",
      name: "Mini Couture Box",
      tag: "Signature Series",
      servings: "Individual or Gift Set",
      weightKg: "0.6 kg",
      basePrice: 1200,
      image: "assets/images/mini-couture-collection.jpg",
      description: "Individual designer cakes presented in luxury display boxes with satin silk ribbons.",
      popular: true
    },
    {
      id: "bento-noir",
      name: "Bento Celebration Petite",
      tag: "Bento Edition",
      servings: "2 to 4 guests",
      weightKg: "0.5 kg",
      basePrice: 850,
      image: "assets/images/bento-noir-25.jpg",
      description: "Chic minimalist bento cake with custom golden metallic calligraphy and constellation stars.",
      popular: false
    },
    {
      id: "tier-1",
      name: "Single Tier Classic",
      tag: "Intimate Gatherings",
      servings: "6 to 8 guests",
      weightKg: "1.0 kg",
      basePrice: 1650,
      image: "assets/images/love-letter-swirls.jpg",
      description: "Silk buttercream spirals crowned with hand-piped rosettes and delicate foliage.",
      popular: false
    },
    {
      id: "tier-2",
      name: "Two-Tier Grand Milestone",
      tag: "Most Requested",
      servings: "18 to 24 guests",
      weightKg: "2.5 kg",
      basePrice: 3950,
      image: "assets/images/moment-vintage-lambeth.jpg",
      description: "Vintage Lambeth Victorian ruffles, draped garlands, blush buttercream roses and pearls.",
      popular: true
    }
  ],

  // Flavor profiles
  flavors: [
    {
      id: "lychee-rose",
      name: "Persian Lychee Rose & Raspberry",
      notes: "Persian rosewater infusion, wild raspberry coulis, poached lychee pieces",
      priceAdd: 200,
      colorHex: "#EAC1C8",
      frostingHex: "#FCECEF",
      badge: "Signature"
    },
    {
      id: "belgian-truffle",
      name: "Belgian Dark Chocolate Truffle",
      notes: "70% Callebaut dark ganache, valrhona cocoa sponge, espresso liqueur soak",
      priceAdd: 0,
      colorHex: "#2E1B17",
      frostingHex: "#452620",
      badge: "Classic"
    },
    {
      id: "salted-caramel",
      name: "Salted Caramel Chocolate Sablé",
      notes: "Molten fleur de sel caramel with roasted cocoa bean crunch",
      priceAdd: 250,
      colorHex: "#A87038",
      frostingHex: "#EBD0AC",
      badge: "Chef's Special"
    },
    {
      id: "white-choc-candle",
      name: "White Chocolate Candle Vanilla",
      notes: "Ivory white chocolate ganache drips with Madagascan vanilla bean mascarpone",
      priceAdd: 150,
      colorHex: "#EAD69A",
      frostingHex: "#FFF9E6",
      badge: ""
    },
    {
      id: "sicilian-lemon",
      name: "Sicilian Lemon Wild Berry",
      notes: "Zesty citrus curd, simmered forest berries, elderflower scented sponge",
      priceAdd: 150,
      colorHex: "#E2C866",
      frostingHex: "#FFFBEB",
      badge: ""
    }
  ],

  // Artisanal Finishes
  finishes: [
    {
      id: "vintage-lambeth",
      name: "Vintage Lambeth Ruffle Piping",
      desc: "Victorian ruffled garlands, shell borders, and delicate luster pearls",
      priceAdd: 350
    },
    {
      id: "love-letter-swirls",
      name: "Love Letter Rosette Swirls",
      desc: "Silky top spiral with piped rosebud clusters and botanical leaves",
      priceAdd: 200
    },
    {
      id: "celestial-noir",
      name: "Noir Velvet & Gold Calligraphy",
      desc: "Matte noir frosting with hand-painted 24K edible gold lettering and stars",
      priceAdd: 300
    },
    {
      id: "pure-drip",
      name: "Minimalist Drip & Fresh Fruit",
      desc: "Warm ivory or strawberry drip with fresh berries and organic blossoms",
      priceAdd: 200
    }
  ],

  // Chennai Delivery Zones
  deliveryZones: [
    { zone: "Thousand Lights / Shafee Mohammed Rd (Kitchen Pickup)", pin: "600006", fee: 0 },
    { zone: "Nungambakkam & Wallace Gardens", pin: "600034", fee: 120 },
    { zone: "Alwarpet, Gopalapuram & T. Nagar", pin: "600018", fee: 150 },
    { zone: "Anna Nagar & Kilpauk", pin: "600040", fee: 200 },
    { zone: "Adyar, Besant Nagar & ECR", pin: "600020", fee: 260 },
    { zone: "OMR & Velachery", pin: "600096", fee: 300 }
  ],

  // The 6 Signature Creations using the real photos
  showcaseCreations: [
    {
      id: "showcase-moment",
      title: "She’s The Moment",
      subtitle: "Vintage Lambeth Celebration Tier",
      category: "tiered",
      weight: "2.5 kg Two-Tier",
      flavor: "Persian Lychee Rose & Raspberry",
      price: "₹3,950",
      image: "assets/images/moment-vintage-lambeth.jpg",
      quote: "Graceful Victorian garlands, hand-piped pink roses, and soft heirloom pearls.",
      highlight: "Instagram Showcase"
    },
    {
      id: "showcase-mini-couture",
      title: "The Mini Couture Collection",
      subtitle: "Haute Pâtisserie in Miniature",
      category: "miniature",
      weight: "Box of 4 Petite Cakes",
      flavor: "Assorted Pastry Chef Creations",
      price: "₹1,200",
      image: "assets/images/mini-couture-collection.jpg",
      quote: "Made to be admired. Made to be savoured slowly.",
      highlight: "Signature Collection"
    },
    {
      id: "showcase-ballgown",
      title: "The Pink Ruffled Ballgown",
      subtitle: "Miniature Couture Edition",
      category: "miniature",
      weight: "Individual Petite",
      flavor: "Raspberry Cream & Silk Buttercream",
      price: "₹350",
      image: "assets/images/mini-pink-ballgown.jpg",
      quote: "Every swirl, pearl and ribbon is placed with care to turn moments into memories.",
      highlight: "Mini Couture"
    },
    {
      id: "showcase-love-letter",
      title: "The Love Letter Cake",
      subtitle: "Silky Buttercream & Rosettes",
      category: "tiered",
      weight: "1.0 kg Single Tier",
      flavor: "Sicilian Lemon & Rose Wild Berry",
      price: "₹1,850",
      image: "assets/images/love-letter-swirls.jpg",
      quote: "Soft swirls, tiny roses and a cake that feels like a handwritten love letter.",
      highlight: "Best Seller"
    },
    {
      id: "showcase-caramel-tart",
      title: "Caramel Chocolate Tart",
      subtitle: "Valrhona Sablé & Molten Caramel",
      category: "specialty",
      weight: "Gourmet Individual Slice",
      flavor: "70% Dark Ganache & Salted Caramel",
      price: "₹320",
      image: "assets/images/caramel-chocolate-tart.jpg",
      quote: "We don’t do guilt here. We do caramel, chocolate, and absolutely no self-control.",
      highlight: "Chef's Special"
    },
    {
      id: "showcase-bento-noir",
      title: "Noir Gold Bento Cake",
      subtitle: "25 But Make It Tiny",
      category: "miniature",
      weight: "0.5 kg Bento Box",
      flavor: "Belgian Noir Chocolate Fudge",
      price: "₹850",
      image: "assets/images/bento-noir-25.jpg",
      quote: "Velvet midnight frosting with hand-painted golden constellations and custom lettering.",
      highlight: "Bento Edition"
    },
    {
      id: "showcase-white-candle",
      title: "White Chocolate Candle Bliss",
      subtitle: "Miniature Couture Edition",
      category: "miniature",
      weight: "Individual Petite",
      flavor: "Ivory White Chocolate Drip",
      price: "₹350",
      image: "assets/images/mini-white-candle.jpg",
      quote: "Sweetly minimal. Perfectly luxurious. Made to melt hearts.",
      highlight: "Mini Couture"
    },
    {
      id: "showcase-floral-rosette",
      title: "Floral & Feminine Rosette",
      subtitle: "Miniature Couture Edition",
      category: "miniature",
      weight: "Individual Petite",
      flavor: "Strawberry Vanilla Bean Chiffon",
      price: "₹350",
      image: "assets/images/mini-floral-rosette.jpg",
      quote: "A bloom of buttercream beauty in every little bite.",
      highlight: "Mini Couture"
    }
  ],

  // Live order queue simulation (for the pitch demo)
  liveOrders: [
    {
      id: "HK-4912",
      client: "Priyanka R., Nungambakkam",
      item: "Two-Tier Grand Milestone (2.5 kg)",
      spec: "Persian Lychee Rose • Vintage Lambeth • Eggless",
      slot: "Tomorrow, 4:00 PM Slot",
      price: "₹4,300",
      status: "Advance Confirmed",
      time: "10m ago"
    },
    {
      id: "HK-4911",
      client: "Ananya M., Thousand Lights",
      item: "Mini Couture Box (Set of 4)",
      spec: "Ballgown, Candle Bliss, Floral & Arch",
      slot: "Today, 6:00 PM Pickup",
      price: "₹1,200",
      status: "Baking & Packaging",
      time: "28m ago"
    },
    {
      id: "HK-4910",
      client: "Siddharth K., Alwarpet",
      item: "Caramel Chocolate Tarts (Box of 4)",
      spec: "70% Dark Ganache & Salted Caramel Sablé",
      slot: "Today, 7:30 PM Express",
      price: "₹1,280",
      status: "Ready for Dispatch",
      time: "55m ago"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HUCKLEBERRY_DATA;
}
