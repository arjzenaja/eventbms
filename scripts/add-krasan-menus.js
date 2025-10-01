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

// Helper function to create menu item
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "5-15 menit", priceIced = null, priceHot = null) {
  const menuItem = {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "16", // Krasan destination ID
    destinationSlug: "",
    destinationTitle: "Krasan",
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

// Krasan Menu Items
const krasanMenus = [
  // MADHANG (Makanan Utama)
  createMenuItem("Yamin Manis/Asin", "Yamin dengan rasa manis atau asin", 8000, "Makanan Utama", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Yamin Manis/Asin + Pangsit Rebus", "Yamin dengan pangsit rebus", 15000, "Makanan Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Yamin Manis/Asin Pedas", "Yamin dengan rasa pedas", 12000, "Makanan Utama", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Yamin Manis/Asin Pedas + Pangsit Rebus", "Yamin pedas dengan pangsit rebus", 17000, "Makanan Utama", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Yamin Chili Oil", "Yamin dengan chili oil", 12000, "Makanan Utama", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Yamin Chili Oil + Pangsit Rebus", "Yamin chili oil dengan pangsit rebus", 17000, "Makanan Utama", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Nasi Luncheon/Kulit/Telor", "Nasi dengan luncheon, kulit, atau telur", 13000, "Makanan Utama", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Nasi Luncheon/Kulit/Telor + Chili Oil", "Nasi dengan chili oil", 16000, "Makanan Utama", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Nasi Luncheon/Kulit/Telor + Sambal Matah", "Nasi dengan sambal matah", 17000, "Makanan Utama", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Kulit Krispi Saos BBQ", "Kulit krispi dengan saus BBQ", 12000, "Makanan Utama", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Nasi Ayam Pek Cham Kee", "Nasi ayam khas Pek Cham Kee", 17000, "Makanan Utama", ["Halal", "Chinese"], false, false, "10-15 menit"),
  
  // MEDHANG (Minuman)
  createMenuItem("Kopi Tubruk", "Kopi tubruk tradisional", 8000, "Kopi", ["Halal", "Traditional"], false, false, "5-7 menit"),
  createMenuItem("Es Kopi Susu", "Es kopi susu segar", 13000, "Kopi", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Kopi Latte", "Es kopi latte creamy", 13000, "Kopi", ["Halal", "Cold", "Creamy"], false, false, "3-5 menit"),
  createMenuItem("Es Kopi Tarik", "Es kopi tarik khas Malaysia", 13000, "Kopi", ["Halal", "Cold", "Signature"], true, false, "5-7 menit"),
  createMenuItem("Es Kopi Krasan", "Es kopi spesial Krasan", 15000, "Kopi", ["Halal", "Cold", "Signature"], true, false, "5-7 menit"),
  createMenuItem("V60 Hot/Ice", "Kopi V60 manual brew", 15000, "Kopi", ["Halal", "Premium"], false, false, "8-12 menit", 16000, 15000),
  createMenuItem("Es Teh Leci", "Es teh leci segar", 9000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Teh Tarik", "Es teh tarik khas", 13000, "Minuman", ["Halal", "Cold", "Signature"], false, false, "5-7 menit"),
  createMenuItem("Es Cokelat Krasan", "Es cokelat spesial Krasan", 15000, "Minuman", ["Halal", "Cold", "Sweet", "Signature"], true, false, "3-5 menit"),
  createMenuItem("Es Matcha Latte", "Es matcha latte creamy", 15000, "Minuman", ["Halal", "Cold", "Creamy"], false, false, "3-5 menit"),
  createMenuItem("Es Matcha Espresso", "Es matcha dengan espresso", 15000, "Minuman", ["Halal", "Cold", "Premium"], false, false, "5-7 menit"),
  createMenuItem("Es Jasmine Tea", "Es teh jasmine segar", 8000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  
  // JUGURAN (Snacks/Sides)
  createMenuItem("Tape Goreng", "Tape goreng renyah", 3000, "Makanan Ringan", ["Halal", "Traditional", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Pisang Goreng Ori", "Pisang goreng original", 4000, "Makanan Ringan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Pisang Goreng Coklat", "Pisang goreng dengan coklat", 5000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Pisang Goreng Keju", "Pisang goreng dengan keju", 5000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Roti Panggang Coklat", "Roti panggang dengan coklat", 15000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Roti Panggang Keju", "Roti panggang dengan keju", 15000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Roti Krasan", "Roti spesial Krasan", 15000, "Makanan Ringan", ["Halal", "Signature"], true, false, "5-8 menit"),
  createMenuItem("Dimsum Ayam", "Dimsum ayam yang lembut", 15000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "8-12 menit"),
  createMenuItem("Pangsit Rebus", "Pangsit rebus lezat", 8000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "8-12 menit"),
  createMenuItem("Pangsit Rebus Chili Oil", "Pangsit rebus dengan chili oil", 12000, "Makanan Ringan", ["Halal", "Chinese", "Spicy"], false, true, "8-12 menit")
];

// Add krasan menus to database
console.log(`Adding ${krasanMenus.length} menu items for Krasan...`);

// Add each menu item
krasanMenus.forEach(menu => {
  db.menu_items.push(menu);
  const priceText = menu.priceIced && menu.priceHot ? 
    `Es: Rp ${menu.priceIced.toLocaleString()} / Panas: Rp ${menu.priceHot.toLocaleString()}` : 
    `Rp ${menu.price.toLocaleString()}`;
  console.log(`✓ Added: ${menu.name} - ${priceText}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${krasanMenus.length} menu items for Krasan!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = krasanMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Summary of dual pricing items
const dualPricingItems = krasanMenus.filter(menu => menu.priceIced && menu.priceHot);
console.log(`\n🥤 Items with dual pricing (Es/Panas): ${dualPricingItems.length}`);
dualPricingItems.forEach(menu => {
  console.log(`  - ${menu.name}: Es Rp ${menu.priceIced.toLocaleString()} / Panas Rp ${menu.priceHot.toLocaleString()}`);
});

// Summary by original categories
console.log('\n🏷️ Menu Summary by Original Categories:');
const madhangCount = krasanMenus.filter(menu => menu.name.includes('Yamin') || menu.name.includes('Nasi') || menu.name.includes('Kulit')).length;
const medhangCount = krasanMenus.filter(menu => menu.name.includes('Kopi') || menu.name.includes('Teh') || menu.name.includes('Es') || menu.name.includes('V60') || menu.name.includes('Matcha') || menu.name.includes('Jasmine')).length;
const juguranCount = krasanMenus.filter(menu => menu.name.includes('Tape') || menu.name.includes('Pisang') || menu.name.includes('Roti') || menu.name.includes('Dimsum') || menu.name.includes('Pangsit')).length;

console.log(`  MADHANG (Makanan Utama): ${madhangCount} items`);
console.log(`  MEDHANG (Minuman): ${medhangCount} items`);
console.log(`  JUGURAN (Snacks/Sides): ${juguranCount} items`);
