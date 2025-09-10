const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const restaurantId = "31";
const restaurantTitle = "Ayam Penyet Surabaya";
const restaurantSlug = "";

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

const menuItems = [
  // LAUK DAN SAYUR
  createMenuItem("Empal Sapi Gepuk", "Lauk", 27000, "Empal sapi gepuk", false, false),
  createMenuItem("Cumi Goreng Tepung", "Lauk", 22000, "Cumi goreng tepung", false, false),
  createMenuItem("Tumis Kangkung", "Sayuran", 13000, "Tumis kangkung", false, false),
  createMenuItem("Tumis Tauge", "Sayuran", 14000, "Tumis tauge", false, false),
  createMenuItem("Balado Terong", "Sayuran", 15000, "Balado terong", true, false),
  createMenuItem("Balado Pete", "Sayuran", 17000, "Balado pete", true, false),
  createMenuItem("Oseng Teri Lomsok", "Lauk", 20000, "Oseng teri lomsok", true, false),
  createMenuItem("Balado Cumi", "Lauk", 28000, "Balado cumi", true, false),
  createMenuItem("Sate Paru/Usus", "Lauk", 8000, "Sate paru atau usus per tusuk", false, false),
  createMenuItem("Bacem Tempe/Tahu", "Lauk", 5000, "Bacem tempe atau tahu per pcs", false, false),
  createMenuItem("Goreng Tahu/Tempe", "Lauk", 11000, "Goreng tahu atau tempe", false, false),
  createMenuItem("Penyet Tempe/Tahu", "Lauk", 13000, "Penyet tempe atau tahu", true, false),
  createMenuItem("Nasi Putih", "Nasi", 5000, "Nasi putih", false, false),
  createMenuItem("Nasi Uduk", "Nasi", 4000, "Nasi uduk", false, false),

  // MENU PAKET
  createMenuItem("Paket Meriah", "Paket", 21000, "Ayam Bakar/Penyet (Ayam Broiler) + Es Teh Manis", false, true),
  createMenuItem("Ayam Bakar", "Paket", 25000, "Ayam bakar dengan nasi dan sambal", false, true),
  createMenuItem("Ayam Penyet", "Paket", 25000, "Ayam penyet dengan nasi dan sambal", true, true),
  createMenuItem("Nila Goreng/Bakar", "Paket", 26000, "Nila goreng atau bakar dengan nasi dan sambal", false, false),
  createMenuItem("Pecel Lele", "Paket", 24000, "Pecel lele dengan nasi dan sambal", true, false),
  createMenuItem("Bebek Goreng", "Paket", 31000, "Bebek goreng dengan nasi dan sambal", false, false),
  createMenuItem("Gurame Goreng/Bakar", "Paket", 31000, "Gurame goreng atau bakar dengan nasi dan sambal", false, false),
  createMenuItem("Nasi Kotak Ayam Penyet", "Paket", 24000, "Nasi + Ayam + Sambal Terong + Tahu Tempe Goreng + Lalap + Sambal", true, true),
  createMenuItem("Ayam Penyet + Es Teh", "Paket", 31000, "Ayam penyet dengan es teh manis", true, true),
  createMenuItem("Bebek Goreng + Es Teh", "Paket", 35000, "Bebek goreng dengan es teh manis", false, false),
  createMenuItem("Nila Goreng + Es Teh", "Paket", 29000, "Nila goreng dengan es teh manis", false, false),
  createMenuItem("Lele Goreng + Es Teh", "Paket", 28000, "Lele goreng dengan es teh manis", true, false),

  // MINUMAN
  createMenuItem("Es Teh Manis", "Minuman", 5000, "Es teh manis", false, false),
  createMenuItem("Es Jeruk", "Minuman", 13000, "Es jeruk", false, false),
  createMenuItem("Juice Jambu", "Minuman", 15000, "Juice jambu", false, false),
  createMenuItem("Juice Strawberry", "Minuman", 15000, "Juice strawberry", false, false),
  createMenuItem("Juice Orange", "Minuman", 15000, "Juice orange", false, false),
  createMenuItem("Juice Alpukat", "Minuman", 15000, "Juice alpukat", false, false),
  createMenuItem("Juice Mangga", "Minuman", 15000, "Juice mangga", false, false),
  createMenuItem("Soda Gembira", "Minuman", 13000, "Soda gembira", false, false),
  createMenuItem("Es Oplosan", "Minuman", 19000, "Es oplosan", false, false),
  createMenuItem("Es Buah", "Minuman", 19000, "Es buah", false, false),
  createMenuItem("Es Campur", "Minuman", 21000, "Es campur", false, false),
  createMenuItem("Lidah Buaya (Lemon/Cocopandan)", "Minuman", 15000, "Lidah buaya lemon atau cocopandan", false, false),
  createMenuItem("Wedang Tape", "Minuman", 15000, "Wedang tape", false, false),
  createMenuItem("Es Dawet", "Minuman", 17000, "Es dawet", false, false),
  createMenuItem("Es Cao", "Minuman", 17000, "Es cao", false, false),
  createMenuItem("Milkshake", "Minuman", 18000, "Milkshake (Orange, Strawberry, Melon, Rose)", false, false),
  dualPricing("Teh Manis", "Minuman", 5000, 5000, "Teh manis panas atau dingin"),
  createMenuItem("Lemon Tea", "Minuman", 8000, "Lemon tea", false, false),
  createMenuItem("Lemon Sirup", "Minuman", 12000, "Lemon sirup", false, false),
  dualPricing("Susu", "Minuman", 12000, 12000, "Susu panas atau dingin"),
  createMenuItem("Nutrisari", "Minuman", 10000, "Nutrisari", false, false),
  createMenuItem("Milo", "Minuman", 11000, "Milo", false, false),
  createMenuItem("Cappuccino", "Minuman", 11000, "Cappuccino", false, false),
  createMenuItem("Coffee Mix", "Minuman", 11000, "Coffee mix", false, false),
  dualPricing("Kopi", "Minuman", 12000, 12000, "Kopi panas atau dingin"),
  createMenuItem("Kopi Susu", "Minuman", 13000, "Kopi susu", false, false),
  createMenuItem("Jeruk Nipis", "Minuman", 13000, "Jeruk nipis", false, false),
  createMenuItem("Juice/Es Jeruk", "Minuman", 13000, "Juice atau es jeruk", false, false),
  createMenuItem("Juice Timun", "Minuman", 14000, "Juice timun", false, false),
  createMenuItem("Juice Tomat", "Minuman", 14000, "Juice tomat", false, false),
  createMenuItem("Juice Pepaya", "Minuman", 14000, "Juice pepaya", false, false),
  createMenuItem("Juice Semangka", "Minuman", 14000, "Juice semangka", false, false),
  createMenuItem("Juice Kuini", "Minuman", 15000, "Juice kuini", false, false),
  createMenuItem("Juice Terong Belanda", "Minuman", 15000, "Juice terong belanda", false, false),
  createMenuItem("Juice Melon", "Minuman", 15000, "Juice melon", false, false),
  createMenuItem("Juice Alpukat", "Minuman", 15000, "Juice alpukat", false, false),
  createMenuItem("Juice Jambu", "Minuman", 15000, "Juice jambu", false, false),
  createMenuItem("Juice Sirsak", "Minuman", 15000, "Juice sirsak", false, false),
  createMenuItem("Teh Tarik", "Minuman", 15000, "Teh tarik", false, false),
];

// Add to database
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
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
console.log(`📊 Categories: Lauk dan Sayur (14), Menu Paket (12), Minuman (25)`);
console.log(`🎯 Restaurant ID: ${restaurantId}`);
