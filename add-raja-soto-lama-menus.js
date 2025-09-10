const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

// Check if restaurant exists
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const restaurant = dbData.kuliner?.find(k => k.title?.includes('Raja Soto') || k.title?.includes('Suradi'));

if (!restaurant) {
  console.log('❌ Restaurant not found. Please add Raja Soto Lama H.Suradi to kuliner first.');
  process.exit(1);
}

const restaurantId = restaurant.id;
const restaurantTitle = restaurant.title;
const restaurantSlug = restaurant.slug || '';

function createMenuItem(name, category, price, description = '', isSpicy = false, isPopular = false) {
  return {
    name,
    description,
    price,
    cookingTime: "10-15 menit",
    category,
    destinationId: restaurantId,
    destinationSlug: restaurantSlug,
    destinationTitle: restaurantTitle,
    rating: 4.5,
    isPopular,
    isSpicy,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function dualPricing(name, category, hotPrice, icedPrice, description = '') {
  return {
    name,
    description,
    priceHot: hotPrice,
    priceIced: icedPrice,
    cookingTime: "5-10 menit",
    category,
    destinationId: restaurantId,
    destinationSlug: restaurantSlug,
    destinationTitle: restaurantTitle,
    rating: 4.5,
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function triplePricing(name, category, juicePrice, hotPrice, icedPrice, description = '') {
  return {
    name,
    description,
    priceJuice: juicePrice,
    priceHot: hotPrice,
    priceIced: icedPrice,
    cookingTime: "5-10 menit",
    category,
    destinationId: restaurantId,
    destinationSlug: restaurantSlug,
    destinationTitle: restaurantTitle,
    rating: 4.5,
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

const menuItems = [
  // MAKANAN
  createMenuItem("Soto Daging Sapi", "Soto", 25000, "Soto dengan daging sapi segar", false, true),
  createMenuItem("Soto Daging Ayam", "Soto", 22000, "Soto dengan daging ayam segar", false, true),
  createMenuItem("Soto Babat & Iso", "Soto", 28000, "Soto dengan babat dan iso sapi", false, false),
  createMenuItem("Soto Sekengkel Urat", "Soto", 30000, "Soto dengan sekengkel urat sapi", false, false),
  createMenuItem("Soto Campur", "Soto", 35000, "Soto campur (Sapi + Babat + Iso + Urat)", false, true),
  createMenuItem("Mendoan Panas", "Gorengan", 15000, "Mendoan tempe panas", false, false),

  // MINUMAN - Jus
  createMenuItem("Jus Gobal Gabul", "Minuman", 14000, "Jus khas Gobal Gabul", false, true),
  createMenuItem("Jus Alpukat", "Minuman", 14000, "Jus alpukat segar", false, false),
  createMenuItem("Jus Durian", "Minuman", 18500, "Jus durian segar", false, false),
  createMenuItem("Jus Jambu", "Minuman", 10000, "Jus jambu segar", false, false),
  createMenuItem("Jus Mangga", "Minuman", 10000, "Jus mangga segar", false, false),
  createMenuItem("Jus Melon", "Minuman", 9000, "Jus melon segar", false, false),
  createMenuItem("Jus Nanas", "Minuman", 7000, "Jus nanas segar", false, false),
  createMenuItem("Jus Nangka", "Minuman", 9000, "Jus nangka segar", false, false),
  createMenuItem("Jus Semangka", "Minuman", 8000, "Jus semangka segar", false, false),
  createMenuItem("Jus Strawberry", "Minuman", 14000, "Jus strawberry segar", false, false),
  createMenuItem("Jus Tomat", "Minuman", 7000, "Jus tomat segar", false, false),
  createMenuItem("Jus Wortel", "Minuman", 7000, "Jus wortel segar", false, false),
  createMenuItem("Jus Sirsak Bulan", "Minuman", 11000, "Jus sirsak bulan segar", false, false),

  // MINUMAN - Dual pricing
  dualPricing("Teh", "Minuman", 5000, 5000, "Teh hangat dan dingin"),
  dualPricing("Teh Tawar", "Minuman", 4000, 4000, "Teh tawar hangat dan dingin"),
  dualPricing("Jeruk", "Minuman", 7000, 7000, "Jeruk hangat dan dingin"),
  dualPricing("Jeruk Nipis", "Minuman", 8000, 8000, "Jeruk nipis hangat dan dingin"),
  dualPricing("Lemon Tea", "Minuman", 9500, 9500, "Lemon tea hangat dan dingin"),
  dualPricing("Teh Jeruk Nipis", "Minuman", 8000, 8000, "Teh jeruk nipis hangat dan dingin"),
  dualPricing("Teh Tarik", "Minuman", 9000, 9000, "Teh tarik hangat dan dingin"),
  dualPricing("Kopi Hitam", "Minuman", 9000, 9000, "Kopi hitam hangat dan dingin"),
  dualPricing("Coklat Malt", "Minuman", 9500, 9500, "Coklat malt hangat dan dingin"),
  dualPricing("Susu Coklat", "Minuman", 8000, 8000, "Susu coklat hangat dan dingin"),
  dualPricing("Air Tawar Rebus", "Minuman", 2000, 2000, "Air tawar rebus hangat dan dingin"),

  // MINUMAN - Triple pricing
  triplePricing("Coffeemix", "Minuman", 7500, 7500, 7500, "Coffeemix dalam bentuk jus, es, dan panas"),
  triplePricing("Coklat", "Minuman", 8500, 8500, 8500, "Coklat dalam bentuk jus, es, dan panas"),

  // MINUMAN - Special
  createMenuItem("Wedang Pedas Gobal Gabul", "Minuman", 12000, "Wedang pedas khas Gobal Gabul", true, true),
];

// Add to database
const existingIds = dbData.menu_items?.map(item => parseInt(item.id)).filter(id => !isNaN(id)) || [];
let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

const menuItemsWithIds = menuItems.map(item => {
  const itemWithId = { ...item, id: nextId.toString() };
  nextId++;
  return itemWithId;
});

if (!dbData.menu_items) dbData.menu_items = [];
dbData.menu_items.push(...menuItemsWithIds);

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

console.log(`✅ Added ${menuItemsWithIds.length} menu items for ${restaurantTitle}`);
console.log(`📊 Categories: Soto (6), Minuman (20)`);
console.log(`🎯 Restaurant ID: ${restaurantId}`);
