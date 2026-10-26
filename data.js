/**
 * Your Huckleberry (@huckleberry.inn) - Catalog & Atelier Data
 * Shafee Mohammed Road, Thousand Lights / Nungambakkam, Chennai
 */

const HUCKLEBERRY_DATA = {
  brand: {
    name: "Your Huckleberry",
    handle: "@huckleberry.inn",
    instagramUrl: "https://www.instagram.com/huckleberry.inn",
    whatsappPhone: "+91 8511839668",
    whatsappDisplay: "+91 8511839668",
    tagline: "Luxury cakes made for sweet moments.",
    address: "Shafee Mohammed Road, Nungambakkam, Chennai 600006",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Shafee+Mohammed+Road,+Thousand+Lights+West,+Nungambakkam,+Chennai+600006",
    hours: "11:00 AM – 9:00 PM (Tuesday – Sunday)",
    headlineProof: "Automated Cake Booking Engine for Your Huckleberry",
    quote: "Made to be admired. Made to be savoured slowly.",
    secondaryQuote: "Every swirl, pearl and ribbon is placed with care to turn moments into memories.",
    phone: "+91 8511839668",
    whatsappNumber: "918511839668",
    secondaryPhone: "+91 7338777927",
    secondaryAddress: "13/5 Gulam Abbas Ali Khan 4th Street, Thousand Lights, Chennai",
    flyerPromo: "GET 10% OFF ON ALL ORDERS • Sweet Moments For A Sweeter You",
    websiteUrl: "https://yourhuckleberry.in",
    websiteDisplay: "yourhuckleberry.in",
    specialOffer: "Buy 3 mini cakes and receive a complimentary signature mini. 10% OFF on all everyday desserts.",
    upiId: "eoteatop@okicici",
    upiPayee: "huckle berry",
    paymentQrUrl: "assets/payment-qr.jpg",
    upiDeepLink: "upi://pay?pa=eoteatop@okicici&pn=huckle%20berry&cu=INR"
  },

  get bakery() {
    return this.brand;
  },

  // The 5 Core Architectural Form Factors
  tiers: [
    {
      id: "mini-couture",
      name: "Mini Couture Box",
      tag: "Gift Set (4 Pcs)",
      servings: "4 Individual Cakes",
      weightKg: "0.6 kg",
      weightGrams: "600g",
      basePrice: 1200,
      image: "assets/images/tier-mini-couture.jpg",
      description: "Individual designer cakes presented in luxury display boxes with satin silk ribbons.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled at 4°C–8°C. Best enjoyed within 48 hours.",
      popular: true
    },
    {
      id: "bento-noir",
      name: "Bento Petite Cake",
      tag: "For 2 to 4 guests",
      servings: "2 to 4 guests",
      weightKg: "0.5 kg",
      weightGrams: "500g",
      basePrice: 850,
      image: "assets/images/bento-noir-clean.jpg",
      description: "Chic minimalist bento cake with custom golden calligraphy and constellation stars.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep refrigerated. Rest 15 mins at room temperature before slicing.",
      popular: false
    },
    {
      id: "tier-1",
      name: "Single Tier Cake",
      tag: "For 6 to 8 guests",
      servings: "6 to 8 guests",
      weightKg: "1.0 kg",
      weightGrams: "1000g",
      basePrice: 1650,
      image: "assets/images/tier-single-petite.jpg",
      description: "Silk buttercream spirals crowned with hand-piped rosettes and delicate foliage.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep refrigerated. Rest 15 mins at room temperature before cake-cutting.",
      popular: false
    },
    {
      id: "tier-2",
      name: "Two-Tier Cake",
      tag: "Most Popular (18–24 guests)",
      servings: "18 to 24 guests",
      weightKg: "2.5 kg",
      weightGrams: "2500g",
      basePrice: 3950,
      image: "assets/images/tier-two-tier-milestone.jpg",
      description: "Vintage Lambeth Victorian ruffles, draped garlands, blush buttercream roses and pearls.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled in celebratory case. Bring to room temperature 20 mins prior to presentation.",
      popular: true
    },
    {
      id: "tier-3",
      name: "Three-Tier Grand Cake",
      tag: "Grand Wedding (35–45 guests)",
      servings: "35 to 45 guests",
      weightKg: "4.5 kg",
      weightGrams: "4500g",
      basePrice: 6500,
      image: "assets/images/tier-three-tier-grand.jpg",
      description: "Victorian Lambeth royal icing architecture with intricate baroque lace and 24K edible gold leaf.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled in temperature-controlled display. Rest 25 mins prior to cutting.",
      popular: false
    }
  ],

  // Flavor profiles with photography
  flavors: [
    {
      id: "lychee-rose",
      name: "Persian Pistachio & Raspberry Rose",
      notes: "Persian rosewater infusion, wild raspberry coulis, natural pistachio crumb",
      priceAdd: 200,
      colorHex: "#9CB081",
      frostingHex: "#FCECEF",
      image: "assets/images/flavour-pistachio-raspberry.jpg",
      badge: "Signature"
    },
    {
      id: "belgian-truffle",
      name: "Belgian Dark Chocolate Truffle",
      notes: "70% Callebaut dark ganache, Valrhona cocoa sponge, crunchy praline feuilletine",
      priceAdd: 0,
      colorHex: "#2E1B17",
      frostingHex: "#452620",
      image: "assets/images/flavour-belgian-truffle.jpg",
      badge: "Classic"
    },
    {
      id: "salted-caramel",
      name: "Valrhona Noir & Salted Caramel",
      notes: "Decadent dark chocolate layers with molten golden fleur de sel caramel center",
      priceAdd: 250,
      colorHex: "#A87038",
      frostingHex: "#EBD0AC",
      image: "assets/images/flavour-valrhona-noir.jpg",
      badge: "Chef's Special"
    },
    {
      id: "white-choc-candle",
      name: "Madagascar Vanilla Bean & Strawberries",
      notes: "Real vanilla bean caviar sponge with whipped Chantilly and sliced ruby strawberries",
      priceAdd: 150,
      colorHex: "#EAD69A",
      frostingHex: "#FFF9E6",
      image: "assets/images/flavour-vanilla-chantilly.jpg",
      badge: "Artisanal"
    },
    {
      id: "sicilian-lemon",
      name: "Wild Blueberry & Meyer Lemon Curd",
      notes: "Zesty lemon sponge with vivid simmered wild blueberry compote and mascarpone frosting",
      priceAdd: 150,
      colorHex: "#5B4468",
      frostingHex: "#FFFBEB",
      image: "assets/images/flavour-blueberry-lemon.jpg",
      badge: "Fresh"
    },
    {
      id: "biscoff-hazelnut",
      name: "Lotus Biscoff & Roasted Hazelnut",
      notes: "Spiced speculoos biscuit layers, caramelized Biscoff spread, and roasted Piedmont hazelnuts",
      priceAdd: 220,
      colorHex: "#C47C3E",
      frostingHex: "#F7E6D0",
      image: "assets/images/flavour-biscoff-hazelnut.jpg",
      badge: "Gourmet"
    }
  ],

  // Artisanal Finishes
  finishes: [
    {
      id: "vintage-lambeth",
      name: "Vintage Lambeth (Ruffles & Pearls)",
      desc: "Victorian ruffled garlands, shell borders, and delicate luster pearls",
      priceAdd: 350
    },
    {
      id: "love-letter-swirls",
      name: "Rose Petal Swirls (Silky Rosettes)",
      desc: "Silky top spiral with piped rosebud clusters and botanical leaves",
      priceAdd: 200
    },
    {
      id: "celestial-noir",
      name: "Dark Velvet & Edible Gold",
      desc: "Matte noir frosting with hand-painted 24K edible gold lettering and stars",
      priceAdd: 300
    },
    {
      id: "pure-drip",
      name: "Berry Glaze Drip",
      desc: "Warm ivory or strawberry drip with fresh berries and organic blossoms",
      priceAdd: 200
    }
  ],

  // Chennai Delivery Zones
  deliveryZones: [
    { zone: "Free Kitchen Pickup (Shafee Mohammed Rd, Nungambakkam)", pin: "600006", fee: 0 },
    { zone: "Nungambakkam & Nearby", pin: "600034", fee: 120 },
    { zone: "Alwarpet, Gopalapuram & T. Nagar", pin: "600018", fee: 150 },
    { zone: "Anna Nagar & Kilpauk", pin: "600040", fee: 200 },
    { zone: "Adyar, Besant Nagar & ECR", pin: "600020", fee: 260 },
    { zone: "OMR, Velachery & Rest of Chennai", pin: "600096", fee: 300 }
  ],

  // The 8 Signature Creations with haute pâtisserie styling & Theobroma retail specs
  showcaseCreations: [
    {
      id: "showcase-moment",
      title: "She’s The Moment",
      subtitle: "Vintage Lambeth Celebration Tier",
      category: "tiered",
      weight: "2.5 kg (Two-Tier)",
      weightGrams: "2500g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep refrigerated at 4°C–8°C. Bring to room temperature 20 mins prior to cake-cutting.",
      flavor: "Persian Lychee Rose & Raspberry",
      price: "₹3,950",
      image: "assets/images/tier-two-tier-milestone.jpg",
      quote: "Graceful Victorian garlands, hand-piped pink roses, and soft heirloom pearls.",
      highlight: "Instagram Showcase"
    },
    {
      id: "showcase-mini-couture",
      title: "The Mini Couture Collection",
      subtitle: "Haute Pâtisserie in Miniature",
      category: "miniature",
      weight: "Quad Box (600g)",
      weightGrams: "600g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled in presentation case. Consume within 48 hours.",
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
      weight: "Individual Petite (150g)",
      weightGrams: "150g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)"],
      storage: "Keep refrigerated. Best enjoyed cold or slightly tempered.",
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
      weight: "1.0 kg (Single Tier)",
      weightGrams: "1000g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep refrigerated at 4°C–8°C. Best enjoyed within 48 hours.",
      flavor: "Sicilian Lemon & Rose Wild Berry",
      price: "₹1,850",
      image: "assets/images/couture-lambeth-clean.jpg",
      quote: "Soft swirls, tiny roses and a cake that feels like a handwritten love letter.",
      highlight: "Best Seller"
    },
    {
      id: "showcase-caramel-tart",
      title: "Caramel Chocolate Tart",
      subtitle: "Valrhona Sablé & Molten Caramel",
      category: "specialty",
      weight: "Gourmet Individual Tart (180g)",
      weightGrams: "180g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled. Enjoy cool for optimal crispness of sablé pastry.",
      flavor: "70% Dark Ganache & Salted Caramel",
      price: "₹320",
      image: "assets/images/caramel-chocolate-tart.jpg",
      quote: "We don’t do guilt here. We do caramel, chocolate, and absolutely no self-control.",
      highlight: "Chef's Special"
    },
    {
      id: "showcase-bento-noir",
      title: "Noir Gold Bento Cake",
      subtitle: "Velvet Noir Gold Edition",
      category: "miniature",
      weight: "Bento Box (500g)",
      weightGrams: "500g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled. Rest 15 mins at room temperature for velvety ganache bloom.",
      flavor: "Belgian Noir Chocolate Fudge",
      price: "₹850",
      image: "assets/images/bento-noir-clean.jpg",
      quote: "Velvet midnight frosting with hand-painted golden constellations and custom lettering.",
      highlight: "Bento Edition"
    },
    {
      id: "showcase-white-candle",
      title: "White Chocolate Candle Bliss",
      subtitle: "Miniature Couture Edition",
      category: "miniature",
      weight: "Individual Petite (150g)",
      weightGrams: "150g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)"],
      storage: "Keep refrigerated until candle lighting moment.",
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
      weight: "Individual Petite (150g)",
      weightGrams: "150g",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)"],
      storage: "Keep chilled at 4°C–8°C.",
      flavor: "Strawberry Vanilla Bean Chiffon",
      price: "₹350",
      image: "assets/images/mini-floral-rosette.jpg",
      quote: "A bloom of buttercream beauty in every little bite.",
      highlight: "Mini Couture"
    }
  ],

  // 15 Gourmet Everyday Desserts (From Official Menu Flyer • 10% Off)
  everydayDesserts: [
    {
      id: "dessert-ferrero-rocher",
      name: "Ferrero Rocher Pastry",
      category: "everyday",
      subCategory: "pastry",
      portion: "1 pc",
      weight: "160g Individual Cut",
      basePrice: 240,
      price: "₹240",
      discountedPrice: "₹216",
      image: "assets/images/item-ferrero-rocher.jpg",
      quote: "Layered gianduja hazelnut mousse, crispy praline wafer, and whole Ferrero Rocher.",
      desc: "Decadent square-cut hazelnut pastry layered with 70% Callebaut dark ganache, crunchy wafer feuilletine, and roasted hazelnuts, crowned with an artisan Ferrero Rocher truffle orb.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy", "Tree Nuts (Hazelnut)"],
      storage: "Keep refrigerated at 4°C–8°C. Best enjoyed within 48 hours.",
      highlight: "Chef's Signature"
    },
    {
      id: "dessert-cheesecake",
      name: "Classic Baked Cheesecake",
      category: "everyday",
      subCategory: "cheesecake",
      portion: "1 pc",
      weight: "150g Generous Slice",
      basePrice: 220,
      price: "₹220",
      discountedPrice: "₹198",
      image: "assets/images/item-cheesecake.jpg",
      quote: "Caramelized golden top, dense velvety custard center, and buttery graham crust.",
      desc: "Pure eggless New York style baked cheesecake crafted with rich Philadelphia cream cheese, Madagascar vanilla bean, and a slow-baked caramelized top.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)"],
      storage: "Keep chilled at 4°C–8°C. Rest 10 mins at room temperature before savoring.",
      highlight: "Bestseller"
    },
    {
      id: "dessert-raspberry-cake",
      name: "Raspberry Layered Cake",
      category: "everyday",
      subCategory: "pastry",
      portion: "1 pc",
      weight: "140g Pastry Slice",
      basePrice: 200,
      price: "₹200",
      discountedPrice: "₹180",
      image: "assets/images/item-raspberry-cake.jpg",
      quote: "Vibrant ruby raspberry coulis, light almond sponge, and fresh wild berries.",
      desc: "Artisan layered gateau featuring light vanilla almond genois sponge, tangy wild raspberry compote, whipped mascarpone cream, and fresh whole raspberries.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Tree Nuts (Almond)"],
      storage: "Keep refrigerated. Best enjoyed chilled.",
      highlight: "Berry Bliss"
    },
    {
      id: "dessert-crunch-tub",
      name: "Crunch Parfait Tub",
      category: "everyday",
      subCategory: "tubs",
      portion: "1 nos",
      weight: "200g Parfait Tub",
      basePrice: 200,
      price: "₹200",
      discountedPrice: "₹180",
      image: "assets/images/item-crunch-tub.jpg",
      quote: "Layers of velvety chocolate mousse, butter biscuit crunch, and praline pearls.",
      desc: "Crystal dessert tub loaded with alternating layers of whipped Belgian chocolate mousse, toasted sablé crumble, salted caramel drizzle, and golden crunchy pearls.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled in airtight dessert tub. Ready to spoon-dive.",
      highlight: "Popular Tub"
    },
    {
      id: "dessert-milo-tres-leches",
      name: "Milo Tres Leches Tub",
      category: "everyday",
      subCategory: "tubs",
      portion: "1 nos",
      weight: "180g Milk Tub",
      basePrice: 180,
      price: "₹180",
      discountedPrice: "₹162",
      image: "assets/images/item-milo-tres-leches.jpg",
      quote: "Slow-soaked malt milk sponge drenched in Milo cream and rich cocoa dust.",
      desc: "Ultra-moist Mexican tres leches sponge soaked in creamy evaporated and condensed milk infused with malt chocolate Milo, topped with velvet cream and heavy Milo dusting.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Malt (Barley)"],
      storage: "Serve ice-cold directly from refrigerator.",
      highlight: "Comfort Classic"
    },
    {
      id: "dessert-swiss-roll-chocolate",
      name: "Swiss Roll Chocolate",
      category: "everyday",
      subCategory: "swiss-rolls",
      portion: "1 pc",
      weight: "120g Roll Cut",
      basePrice: 120,
      price: "₹120",
      discountedPrice: "₹108",
      image: "assets/images/item-swiss-roll-chocolate.jpg",
      quote: "Soft dark cocoa roll with a spiral swirl of silky vanilla Chantilly cream.",
      desc: "Tender dark chocolate chiffon cake tightly rolled around fresh whipped vanilla cream, glazed with dark chocolate ganache lines and cocoa crisp nibs.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep chilled. Consume within 48 hours.",
      highlight: "Teatime Favorite"
    },
    {
      id: "dessert-swiss-roll-strawberry",
      name: "Swiss Roll Strawberry",
      category: "everyday",
      subCategory: "swiss-rolls",
      portion: "1 pc",
      weight: "120g Roll Cut",
      basePrice: 120,
      price: "₹120",
      discountedPrice: "₹108",
      image: "assets/images/item-swiss-roll-strawberry.jpg",
      quote: "Polka-dot pink strawberry roll with fresh whipped berry Chantilly cream.",
      desc: "Delicate pink sponge patterned with natural strawberry puree, rolled with whipped strawberry cream and topped with fresh sliced strawberries and glaze.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)"],
      storage: "Keep refrigerated at 4°C–8°C.",
      highlight: "Feminine Classic"
    },
    {
      id: "dessert-lava-cake",
      name: "Molten Chocolate Lava Cake",
      category: "everyday",
      subCategory: "warm-bakes",
      portion: "1 nos",
      weight: "110g Individual Cake",
      basePrice: 70,
      price: "₹70",
      discountedPrice: "₹63",
      image: "assets/images/item-lava-cake.jpg",
      quote: "Warm chocolate bundt cake with an oozing molten Belgian chocolate ganache river.",
      desc: "Warm for 15 seconds in the microwave to release an irresistible, warm, flowing center of liquid dark chocolate ganache. Pure heaven for chocolate lovers.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Refrigerate. Microwave for 15–20 seconds before serving warm.",
      highlight: "Top Value"
    },
    {
      id: "dessert-london-caramel",
      name: "London Caramel Gateau",
      category: "everyday",
      subCategory: "pastry",
      portion: "1 pc",
      weight: "150g Gateau Slice",
      basePrice: 220,
      price: "₹220",
      discountedPrice: "₹198",
      image: "assets/images/item-london-caramel.jpg",
      quote: "Buttery sablé layers, rich dulce de leche caramel, and glossy mirror ganache.",
      desc: "Luxurious London-style layered caramel gateau with crisp French butter sablé, slow-cooked dulce de leche, and mirror-finish Valrhona dark chocolate glaze with chocolate pearls.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Keep refrigerated. Rest 10 mins before enjoying.",
      highlight: "Luxury Caramel"
    },
    {
      id: "dessert-brownie-tub-mini",
      name: "Brownie Tub Mini",
      category: "everyday",
      subCategory: "tubs",
      portion: "1 nos",
      weight: "180g Mini Tub",
      basePrice: 220,
      price: "₹220",
      discountedPrice: "₹198",
      image: "assets/images/item-brownie-tub-mini.jpg",
      quote: "Bite-sized fudgy dark brownie cubes smothered in rich chocolate fudge sauce.",
      desc: "Heaped tub of moist, fudgy, crackly-crust dark chocolate brownie bites drenched in warm Belgian fudge sauce and sprinkled with dark chocolate chips.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Enjoy at room temperature or warm slightly for molten fudge bliss.",
      highlight: "Chocoholic"
    },
    {
      id: "dessert-brownie-tub-big",
      name: "Brownie Tub Big (Sharing)",
      category: "everyday",
      subCategory: "tubs",
      portion: "1 nos",
      weight: "450g Sharing Tub",
      basePrice: 550,
      price: "₹550",
      discountedPrice: "₹495",
      image: "assets/images/item-brownie-tub-big.jpg",
      quote: "Abundant sharing tub of fudgy brownies, roasted nuts, and chocolate ganache.",
      desc: "The ultimate party dessert tub loaded with over 450g of rich dark chocolate fudge brownies, toasted walnuts and hazelnuts, and double chocolate drizzle.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy", "Tree Nuts (Walnut, Hazelnut)"],
      storage: "Keep sealed at room temperature or refrigerated.",
      highlight: "Party Size"
    },
    {
      id: "dessert-cupcakes",
      name: "Dark Chocolate Fudge Cupcake",
      category: "everyday",
      subCategory: "cupcakes",
      portion: "1 pc",
      weight: "90g Cupcake",
      basePrice: 65,
      price: "₹65",
      discountedPrice: "₹58",
      image: "assets/images/item-cupcake.jpg",
      quote: "Velvety cocoa sponge crowned with a sky-high swirl of chocolate fudge buttercream.",
      desc: "Classic dark cocoa cupcake in fluted paper casing, piped with an indulgent tower of whipped chocolate buttercream and delicate chocolate vermicelli.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Soy"],
      storage: "Store at cool room temperature. Best fresh.",
      highlight: "Everyday Sweet"
    },
    {
      id: "dessert-nutella-cookies",
      name: "Gourmet Nutella Cookie",
      category: "everyday",
      subCategory: "cookies",
      portion: "1 nos",
      weight: "110g Giant Cookie",
      basePrice: 99,
      price: "₹99",
      discountedPrice: "₹89",
      image: "assets/images/item-nutella-cookie.jpg",
      quote: "Chunky Levain-style artisan cookie with roasted hazelnuts and molten Nutella core.",
      desc: "Thick, chewy, golden-brown cookie loaded with chocolate chips and roasted hazelnuts, baked with a gooey heart of pure Nutella that oozes when broken open.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Tree Nuts (Hazelnut)", "Soy"],
      storage: "Warm in oven or microwave for 10 seconds for gooey molten center.",
      highlight: "Staff Pick"
    },
    {
      id: "dessert-tiramisu",
      name: "Classic Italian Tiramisu Tub",
      category: "everyday",
      subCategory: "tubs",
      portion: "1 nos",
      weight: "200g Tub",
      basePrice: 250,
      price: "₹250",
      discountedPrice: "₹225",
      image: "assets/images/item-tiramisu-tub.jpg",
      quote: "Espresso-soaked savoiardi ladyfingers, whipped mascarpone cream, and Dutch cocoa.",
      desc: "Authentic eggless Venetian recipe crafted with freshly pulled espresso-soaked biscuits, fluffy Italian mascarpone cream, and a rich velvet blanket of dark cocoa powder.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)", "Coffee"],
      storage: "Keep chilled at 4°C. Serve cold.",
      highlight: "Italian Classic"
    },
    {
      id: "dessert-cake-pops",
      name: "Vanilla Cake Pops Duo",
      category: "everyday",
      subCategory: "more",
      portion: "1 pc",
      weight: "Duo Set (80g)",
      basePrice: 50,
      price: "₹50",
      discountedPrice: "₹45",
      image: "assets/images/item-cake-pops-vanilla.jpg",
      quote: "Festive duo of pink and white glazed vanilla cake pops tied with satin ribbon.",
      desc: "Two artisanal spherical vanilla sponge cake pops coated in glossy pastel raspberry and white chocolate candy shells with sprinkles, hand-tied with a lovely satin ribbon.",
      isEggless: true,
      allergens: ["Wheat (Gluten)", "Dairy (Milk)"],
      storage: "Keep chilled in cool dry place.",
      highlight: "Kids & Gifting"
    }
  ],

  // Structured Consumer Trust FAQ Accordion (Theobroma best practice)
  faqs: [
    {
      question: "Are all creations at Your Huckleberry 100% vegetarian / eggless?",
      answer: "Yes, absolutely. Every creation at Your Huckleberry is handcrafted with a 100% pure eggless vegetarian recipe. We use premium French dairy, high-fat cultured butter, and Belgian couverture chocolate to ensure our sponge retains supreme moisture, velvety crumb, and rich mouthfeel without ever using egg."
    },
    {
      question: "How far in advance should I place my cake order?",
      answer: "For our Mini Couture boxes and signature slices, same-day and next-day pickup or dispatch are often available based on daily kitchen batches. For custom celebration tiers (Single Tier Classic and Two-Tier Grand Milestone), we recommend locking your slot 24 to 48 hours in advance to allow our pastry chefs ample time for delicate Lambeth piping and stabilization."
    },
    {
      question: "How should I store and serve my cake in Chennai's climate?",
      answer: "Chennai's tropical climate requires care with high-grade buttercream and ganache. Keep your cake refrigerated at 4°C–8°C immediately upon arrival. For the finest flavor bloom and silky texture, remove the cake from the refrigerator approximately 15–20 minutes before cutting and serving."
    },
    {
      question: "What delivery options and service areas are available across Chennai?",
      answer: "We offer direct temperature-controlled doorstep dispatches across Nungambakkam, Thousand Lights, Alwarpet, T. Nagar, Gopalapuram, Kilpauk, Anna Nagar, Adyar, Besant Nagar, ECR, and OMR. You are also welcome to schedule complimentary direct pickup at our Shafee Mohammed Road atelier."
    },
    {
      question: "Why is a 50% advance deposit requested upon booking?",
      answer: "Because every milestone cake is custom-baked from scratch to your specific architecture, flavor profile, and piped inscription, the 50% advance secures your date and kitchen capacity, guaranteeing dedicated oven time and fresh artisanal ingredient sourcing."
    },
    {
      question: "Can I customize the color palette, piped plaque inscription, or dietary needs?",
      answer: "Yes! Use our Interactive Cake Atelier to test flavor pairings and type your custom message. When your WhatsApp booking slip generates, you can chat directly with our chef to request custom tint matching, ribbon colors, or special dietary notes."
    }
  ],

  // The 5-Stage Business & Cloud Kitchen Creation Pipeline
  pipelineStages: [
    {
      step: "01",
      name: "Bespoke Consultation & Architecture Curation",
      tagline: "Portion Precision & Sketches",
      desc: "Select scale from Mini Couture Quad (600g) to Three-Tier Grand Cake (4.5kg). Sketch review and Pantone tint matching.",
      detail: "Eliminates portion ambiguity. Every scale is calibrated for intimate celebrations or 45-guest royal gatherings.",
      image: "assets/images/pipeline-step1-consult.jpg",
      icon: "01"
    },
    {
      step: "02",
      name: "Flavour & Pure Veg Eggless Haute Baking",
      tagline: "Ingredient Provenance",
      desc: "100% Eggless Genois sponge crafted with Belgian Callebaut, Madagascar vanilla beans, and French cultured butter.",
      detail: "Clean-label ingredients. Strictly zero gelatine, zero egg wash, and zero artificial stabilizers.",
      image: "assets/images/caramel-chocolate-slice.jpg",
      icon: "02"
    },
    {
      step: "03",
      name: "Atelier Lambeth Hand-Piping & Pearls",
      tagline: "Artisanal Haute Pâtisserie",
      desc: "Intricate Victorian Lambeth swags, heirloom luster pearls, and hand-piped plaque calligraphy.",
      detail: "Unrushed piping precision executed by specialized pastry chefs in our Nungambakkam kitchen.",
      image: "assets/images/atelier-kitchen-craft.jpg",
      icon: "03"
    },
    {
      step: "04",
      name: "50% Token Deposit & UPI QR Reservation",
      tagline: "Real-Time Slot Lock",
      desc: "Instant booking slip generated for direct WhatsApp kitchen verification with token #HK-XXXX and instant UPI QR scan.",
      detail: "Guarantees dedicated oven time and scratch baking on your celebration morning. UPI ID: eoteatop@okicici",
      image: "assets/payment-qr.jpg",
      icon: "04"
    },
    {
      step: "05",
      name: "Cold-Chain Dispatch & Thermal Transit",
      tagline: "Zero-Melt Delivery",
      desc: "Specialized temperature-controlled delivery across Chennai or complimentary atelier pickup.",
      detail: "Delivered in reinforced display cases with satin silk ribbons, ready to centerpiece your event.",
      image: "assets/images/tier-mini-couture.jpg",
      icon: "05"
    }
  ],
  // Live order queue simulation (Theobroma & cloud kitchen operational transparency)
  liveOrders: [
    {
      id: "HK-4914",
      client: "Deepa S., Besant Nagar",
      item: "She’s The Moment Lambeth (2.5 kg)",
      spec: "Persian Lychee Rose • Vintage Lambeth • 100% Eggless",
      slot: "Today, 5:30 PM Express Slot",
      price: "₹3,950",
      status: "Master Hand-Piping",
      stagePercent: 85,
      time: "4m ago"
    },
    {
      id: "HK-4912",
      client: "Priyanka R., Nungambakkam",
      item: "Two-Tier Grand Milestone (2.5 kg)",
      spec: "Persian Lychee Rose • Vintage Lambeth • Eggless",
      slot: "Tomorrow, 4:00 PM Slot",
      price: "₹4,300",
      status: "Oven Baking & Chilling",
      stagePercent: 55,
      time: "14m ago"
    },
    {
      id: "HK-4911",
      client: "Ananya M., Thousand Lights",
      item: "Mini Couture Box (Set of 4)",
      spec: "Ballgown, Candle Bliss, Floral & Arch",
      slot: "Today, 6:00 PM Pickup",
      price: "₹1,200",
      status: "Presentation Packaging",
      stagePercent: 95,
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
      stagePercent: 100,
      time: "55m ago"
    },
    {
      id: "HK-4909",
      client: "Vikram N., Anna Nagar",
      item: "Noir Golden Bento Cake (0.5 kg)",
      spec: "Belgian Noir Chocolate Fudge • Gold Calligraphy",
      slot: "Today, 3:00 PM Slot",
      price: "₹850",
      status: "Cold-Chain Dispatched",
      stagePercent: 100,
      time: "1h ago"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HUCKLEBERRY_DATA;
}
