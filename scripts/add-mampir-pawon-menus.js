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
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "5-20 menit") {
  return {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "23", // Mampir Pawon destination ID
    destinationSlug: "",
    destinationTitle: "Mampir Pawon",
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
}

// Mampir Pawon Menu Items
const mampirPawonMenus = [
  // MENU UTAMA/SPESIAL
  createMenuItem("Nasi Rames", "Nasi, sayur, mie, sambel", 7000, "Menu Utama", ["Halal", "Traditional", "Complete"], true, false, "5-10 menit"),

  // LAUK UTAMA
  createMenuItem("Aneka Ayam Potong", "Aneka ayam potong", 11000, "Lauk Utama", ["Halal", "Meat"], false, false, "15-20 menit"),
  createMenuItem("Aneka Jeroan", "Aneka jeroan", 10000, "Lauk Utama", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Aneka Telur", "Aneka telur", 4000, "Lauk Utama", ["Halal", "Egg"], false, false, "5-10 menit"),
  createMenuItem("Aneka Sayur/Oseng/Mie", "Aneka sayur/oseng/mie", 4000, "Lauk Utama", ["Halal", "Vegetable"], false, false, "8-12 menit"),
  createMenuItem("Aneka Pindang Besek", "Aneka pindang besek", 5000, "Lauk Utama", ["Halal", "Seafood"], false, false, "10-15 menit"),
  createMenuItem("Ayam Kampung Srundeng/Bakar", "Ayam kampung srundeng/bakar", 28000, "Lauk Utama", ["Halal", "Traditional", "Grilled"], true, false, "20-25 menit"),
  createMenuItem("Bebek Goreng", "Bebek goreng", 35000, "Lauk Utama", ["Halal", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Garang Asem Ayam Kampung", "Garang asem ayam kampung", 30000, "Lauk Utama", ["Halal", "Traditional", "Sour"], false, false, "20-25 menit"),
  createMenuItem("Kepala Bebek", "Kepala bebek", 5000, "Lauk Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Kepala Ayam Potong", "Kepala ayam potong", 4000, "Lauk Utama", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Lele Goreng", "Lele goreng", 9000, "Lauk Utama", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Mangut Lele", "Mangut lele", 11000, "Lauk Utama", ["Halal", "Seafood", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Mujaer Goreng", "Mujaer goreng", 17000, "Lauk Utama", ["Halal", "Seafood"], false, false, "15-20 menit"),

  // MINUMAN
  createMenuItem("Air Es/Teh Tawar/Es Batu", "Air es/teh tawar/es batu", 1500, "Minuman", ["Halal", "Cold"], false, false, "1-2 menit"),
  createMenuItem("Air Mineral", "Air mineral", 5000, "Minuman", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Es Dawet", "Es dawet", 16000, "Minuman", ["Halal", "Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Es Podeng", "Es podeng", 12000, "Minuman", ["Halal", "Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Es Setup", "Es setup", 12000, "Minuman", ["Halal", "Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Es Tape Hijau", "Es tape hijau", 10000, "Minuman", ["Halal", "Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Kopi Tubruk", "Kopi tubruk", 7000, "Minuman", ["Halal", "Hot", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Kunir Asem/Gula Asem/Beras Kencur", "Kunir asem/gula asem/beras kencur", 6000, "Minuman", ["Halal", "Traditional", "Herbal"], false, false, "3-5 menit"),
  createMenuItem("Milo Hangat/Es", "Milo hangat/es", 9000, "Minuman", ["Halal", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Nestea Jeruk Hangat/Es", "Nestea jeruk hangat/es", 6500, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Nestea Lemon Tea Hangat/Es", "Nestea lemon tea hangat/es", 6500, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Teh Manis Hangat/Es", "Teh manis hangat/es", 3000, "Minuman", ["Halal", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Teh Poci Gula Batu", "Teh poci gula batu", 10000, "Minuman", ["Halal", "Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Teh Sereh Hangat/Es", "Teh sereh hangat/es", 7500, "Minuman", ["Halal", "Traditional", "Herbal"], false, false, "3-5 menit"),
  createMenuItem("Wedang/Es Jahe", "Wedang/es jahe", 9000, "Minuman", ["Halal", "Traditional", "Herbal"], false, false, "3-5 menit"),
  createMenuItem("Wedang Uwuh", "Wedang uwuh", 9000, "Minuman", ["Halal", "Traditional", "Herbal"], false, false, "3-5 menit"),

  // MENU TAMBAHAN
  createMenuItem("Gereh", "Gereh", 5000, "Menu Tambahan", ["Halal", "Seafood"], false, false, "5-8 menit"),
  createMenuItem("Kerupuk Palembang", "Kerupuk palembang", 1000, "Menu Tambahan", ["Halal", "Crispy"], false, false, "1-2 menit"),
  createMenuItem("Pete", "Pete", 10000, "Menu Tambahan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Aneka Tahu/Tempe", "Aneka tahu/tempe", 3000, "Menu Tambahan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Nasi Putih", "Nasi putih", 5000, "Menu Tambahan", ["Halal", "Staple"], false, false, "2-3 menit"),
  createMenuItem("Sambel+Lalapan", "Sambel+lalapan", 4000, "Menu Tambahan", ["Halal", "Spicy"], false, true, "3-5 menit"),

  // GORENGAN
  createMenuItem("Bakwan Sayur", "Bakwan sayur", 1000, "Gorengan", ["Halal", "Crispy", "Vegetable"], false, false, "3-5 menit"),
  createMenuItem("Dage", "Dage", 1000, "Gorengan", ["Halal", "Crispy", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Mendoan", "Mendoan", 2500, "Gorengan", ["Halal", "Crispy", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Pisang Goreng", "Pisang goreng", 3500, "Gorengan", ["Halal", "Crispy", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Tahu Isi", "Tahu isi", 2500, "Gorengan", ["Halal", "Crispy"], false, false, "3-5 menit"),
  createMenuItem("Tempe Munthuk", "Tempe munthuk", 2500, "Gorengan", ["Halal", "Crispy", "Traditional"], false, false, "3-5 menit")
];

// Add mampir pawon menus to database
console.log(`Adding ${mampirPawonMenus.length} menu items for Mampir Pawon...`);

// Add each menu item
mampirPawonMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${mampirPawonMenus.length} menu items for Mampir Pawon!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = mampirPawonMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = mampirPawonMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);

// Popular items summary
const popularItems = mampirPawonMenus.filter(menu => menu.isPopular);
console.log(`\n⭐ Popular Items: ${popularItems.length} items`);
popularItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Spicy items summary
const spicyItems = mampirPawonMenus.filter(menu => menu.isSpicy);
console.log(`\n🌶️ Spicy Items: ${spicyItems.length} items`);
spicyItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Traditional items summary
const traditionalItems = mampirPawonMenus.filter(menu => menu.additionalInfo.includes("Traditional"));
console.log(`\n🏺 Traditional Items: ${traditionalItems.length} items`);
traditionalItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});
