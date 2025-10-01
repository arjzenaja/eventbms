const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Get the next available ID
const getNextId = () => {
  const maxId = Math.max(...db.menu_items.map(item => parseInt(item.id) || 0));
  return maxId + 1;
};

// Helper function to create menu item with dual pricing
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "5-15 menit", priceIced = null, priceHot = null) {
  const menuItem = {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "15", // Maridjah destination ID
    destinationSlug: "",
    destinationTitle: "Maridjah",
    rating: 4.4,
    isPopular: isPopular,
    isSpicy: isSpicy,
    halal: true,
    available: true,
    additionalInfo: additionalInfo,
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add dual pricing if provided
  if (priceIced !== null) {
    menuItem.priceIced = priceIced;
  }
  if (priceHot !== null) {
    menuItem.priceHot = priceHot;
  }

  return menuItem;
}

// Maridjah Menu Items
const maridjahMenus = [
  // MINUMAN (ES/PANAS)
  createMenuItem("Kopi Susu", "Kopi susu yang creamy", 15000, "Minuman", ["Halal", "Sweet"], true, false, "3-5 menit", 15000, 13000),
  createMenuItem("Kopi Hitam", "Kopi hitam murni", 10000, "Kopi", ["Halal", "Traditional"], false, false, "3-5 menit", 10000, 8000),
  createMenuItem("Kopi Tubruk", "Kopi tubruk tradisional", null, "Kopi", ["Halal", "Traditional"], false, false, "5-7 menit", 7000, 7000),
  createMenuItem("Teh Manis", "Teh manis segar", null, "Minuman", ["Halal", "Sweet"], false, false, "2-3 menit", 7000, 7000),
  createMenuItem("Teh Tawar", "Teh tawar hangat", null, "Minuman", ["Halal", "Traditional"], false, false, "2-3 menit", 5000, 5000),
  createMenuItem("Teh Kampul", "Teh kampul khas", 10000, "Minuman", ["Halal", "Traditional"], false, false, "3-5 menit", 10000, 8000),
  createMenuItem("Es Campur", "Es campur segar", 15000, "Minuman", ["Halal", "Cold", "Fresh"], true, false, "5-7 menit"),
  createMenuItem("Teh Tarik", "Teh tarik khas Malaysia", 17000, "Minuman", ["Halal", "Signature"], true, false, "5-7 menit", 17000, 15000),
  createMenuItem("Jeruk", "Jeruk segar", 10000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit", 10000, 8000),
  createMenuItem("Milo Malaka", "Milo Malaka yang lezat", 17000, "Minuman", ["Halal", "Sweet"], false, false, "3-5 menit", 17000, 15000),
  createMenuItem("Teh Leci", "Teh leci segar", null, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit", 15000, 15000),
  createMenuItem("Soda Gembira", "Soda gembira yang menyegarkan", 15000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Air Mineral", "Air mineral", 7000, "Minuman", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Limun Oriental", "Limun oriental segar", 15000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  
  // CEMILAN
  createMenuItem("Roti Bakar Coklat Keju", "Roti bakar dengan coklat dan keju", 15000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Pisang Bakar Coklat Keju", "Pisang bakar dengan coklat dan keju", 15000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "8-12 menit"),
  createMenuItem("Pisang Goreng Gula Aren", "Pisang goreng dengan gula aren", 17000, "Makanan Ringan", ["Halal", "Sweet", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Martabak", "Martabak manis", 7000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "10-15 menit"),
  createMenuItem("Kerang Bulari Goreng", "Kerang bulari goreng", 15000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "8-12 menit"),
  
  // TOPING
  createMenuItem("Bayam Krispi", "Bayam krispi renyah", 5000, "Add Ons", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Telor Ceplok", "Telur ceplok", 5000, "Add Ons", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Nasi Putih", "Nasi putih tambahan", 5000, "Add Ons", ["Halal", "Traditional"], false, false, "2-3 menit"),
  createMenuItem("Donat Keju", "Donat dengan keju", 6000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Donat Coklat", "Donat dengan coklat", 6000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Mendoan", "Mendoan tempe", 15000, "Makanan Ringan", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Kentang Goreng", "Kentang goreng renyah", 17000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "8-12 menit"),
  
  // MAKANAN
  createMenuItem("Indomie Goreng Telor", "Indomie goreng dengan telur", 15000, "Makanan Utama", ["Halal", "Comfort"], false, false, "8-12 menit"),
  createMenuItem("Indomie Rebus Telor", "Indomie rebus dengan telur", 15000, "Makanan Utama", ["Halal", "Comfort"], false, false, "8-12 menit"),
  createMenuItem("Indomie Dok Dok", "Indomie dok dok spesial", 18000, "Makanan Utama", ["Halal", "Signature"], true, false, "10-15 menit"),
  createMenuItem("Nasi Kulit Ayam", "Nasi dengan kulit ayam", 20000, "Makanan Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Nasi Telor Barendo", "Nasi dengan telur barendo", 17000, "Makanan Utama", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Nasi Ayam Bawang", "Nasi dengan ayam bawang", 22000, "Makanan Utama", ["Halal", "Traditional"], false, false, "12-18 menit"),
  createMenuItem("Nasi Ayam Telor Asin", "Nasi dengan ayam telur asin", 22000, "Makanan Utama", ["Halal", "Traditional"], false, false, "12-18 menit"),
  createMenuItem("Nasi Goreng Babat", "Nasi goreng dengan babat", 22000, "Makanan Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Ati", "Nasi goreng dengan ati", 20000, "Makanan Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Ayam", "Nasi goreng dengan ayam", 17000, "Makanan Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Mie Ayam Kumisan", "Mie ayam kumisan", 20000, "Makanan Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Sambal Bawang", "Sambal bawang pedas", 5000, "Add Ons", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Sambal Ijo", "Sambal ijo pedas", 5000, "Add Ons", ["Halal", "Spicy"], false, true, "2-3 menit")
];

// Add maridjah menus to database
console.log(`Adding ${maridjahMenus.length} menu items for Maridjah...`);

// Add each menu item
maridjahMenus.forEach(menu => {
  db.menu_items.push(menu);
  const priceText = menu.priceIced && menu.priceHot ? 
    `Es: Rp ${menu.priceIced.toLocaleString()} / Panas: Rp ${menu.priceHot.toLocaleString()}` : 
    `Rp ${menu.price.toLocaleString()}`;
  console.log(`✓ Added: ${menu.name} - ${priceText}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${maridjahMenus.length} menu items for Maridjah!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = maridjahMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Summary of dual pricing items
const dualPricingItems = maridjahMenus.filter(menu => menu.priceIced && menu.priceHot);
console.log(`\n🥤 Items with dual pricing (Es/Panas): ${dualPricingItems.length}`);
dualPricingItems.forEach(menu => {
  console.log(`  - ${menu.name}: Es Rp ${menu.priceIced.toLocaleString()} / Panas Rp ${menu.priceHot.toLocaleString()}`);
});
