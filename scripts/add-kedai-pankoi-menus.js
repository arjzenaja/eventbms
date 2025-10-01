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
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "5-15 menit") {
  return {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "14", // Kedai Pankoi destination ID
    destinationSlug: "https://kedaipankoiofficial.taplink.ws/?fbclid=PAZXh0bgNhZW0CMTEAAacHicR11mBPvF1H8o16cbe036ObOMBqH6_Wxx8-OjkWsexwYuzqkt_X25izwA_aem_3ubyD4IIPVKUjNIgIkD8-w",
    destinationTitle: "Pankoi",
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

// Kedai Pankoi Menu Items
const pankoiMenus = [
  // PAKET RAMADHAN
  createMenuItem("Ifthar With You", "Paket buka puasa untuk 1 orang", 55000, "Paket Ramadhan", ["Halal", "Special"], true, false, "10-15 menit"),
  createMenuItem("Ifthar Together", "Paket buka puasa untuk 2 orang", 105000, "Paket Ramadhan", ["Halal", "Special"], true, false, "15-20 menit"),
  
  // MAKANAN
  createMenuItem("Nasi Chicken Katsu Mentai", "Nasi dengan chicken katsu dan saus mentai", 22000, "Makanan Utama", ["Halal", "Japanese", "Signature"], true, false, "12-18 menit"),
  createMenuItem("Nasi Chicken Katsu Curry", "Nasi dengan chicken katsu dan saus curry", 22000, "Makanan Utama", ["Halal", "Japanese"], false, false, "12-18 menit"),
  createMenuItem("Nasi Chicken Katsu Sambal Korek", "Nasi dengan chicken katsu dan sambal korek", 21000, "Makanan Utama", ["Halal", "Spicy"], false, true, "12-18 menit"),
  createMenuItem("Nasi Chicken Hainan", "Nasi ayam hainan yang lezat", 22000, "Makanan Utama", ["Halal", "Chinese"], false, false, "15-20 menit"),
  createMenuItem("Nasi Goreng Hongkong", "Nasi goreng ala Hongkong", 19000, "Makanan Utama", ["Halal", "Chinese"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Chili Oil", "Nasi goreng dengan chili oil", 20000, "Makanan Utama", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Nasi Telor Pontianak", "Nasi dengan telur khas Pontianak", 17000, "Makanan Utama", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Nasi Telor Curry", "Nasi dengan telur dan saus curry", 17000, "Makanan Utama", ["Halal", "Curry"], false, false, "8-12 menit"),
  createMenuItem("Kwetiaw Pankoi", "Kwetiaw spesial Kedai Pankoi", 23000, "Makanan Utama", ["Halal", "Chinese", "Signature"], true, false, "12-18 menit"),
  createMenuItem("Kwetiaw Goreng", "Kwetiaw goreng yang lezat", 21000, "Makanan Utama", ["Halal", "Chinese"], false, false, "10-15 menit"),
  
  // CEMILAN
  createMenuItem("Dimsum Ayam", "Dimsum ayam yang lembut", 18000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "8-12 menit"),
  createMenuItem("Hisitkaw", "Cemilan khas Chinese", 19000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "5-10 menit"),
  createMenuItem("Lumpia Kulit Tahu Ayam", "Lumpia dengan kulit tahu dan isi ayam", 23000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "10-15 menit"),
  createMenuItem("Lumpia Kulit Tahu Udang", "Lumpia dengan kulit tahu dan isi udang", 21000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "10-15 menit"),
  createMenuItem("Bapau Pankoi", "Bapau spesial Kedai Pankoi", 19000, "Makanan Ringan", ["Halal", "Chinese", "Signature"], true, false, "8-12 menit"),
  createMenuItem("Kuotie", "Kuotie yang renyah", 19000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "8-12 menit"),
  createMenuItem("Lumpia Goreng Ayam", "Lumpia goreng dengan isi ayam", 18000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "8-12 menit"),
  createMenuItem("Lumpia Goreng Udang", "Lumpia goreng dengan isi udang", 20000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "8-12 menit"),
  createMenuItem("Wonton", "Wonton yang lezat", 9000, "Makanan Ringan", ["Halal", "Chinese"], false, false, "5-8 menit"),
  createMenuItem("Roti Kaya", "Roti dengan selai kaya", 16000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Roti Coklat Pankoi", "Roti coklat spesial Kedai Pankoi", 16000, "Makanan Ringan", ["Halal", "Sweet", "Signature"], false, false, "3-5 menit"),
  createMenuItem("Cakwe Udang Pankoi", "Cakwe udang spesial Kedai Pankoi", 18000, "Makanan Ringan", ["Halal", "Chinese", "Signature"], false, false, "8-12 menit"),
  createMenuItem("Siomay Mercon", "Siomay dengan rasa pedas", 20000, "Makanan Ringan", ["Halal", "Spicy"], false, true, "8-12 menit"),
  
  // MINUMAN
  createMenuItem("Teh Tawar", "Teh tawar hangat/dingin", 4000, "Minuman", ["Halal", "Traditional"], false, false, "2-3 menit"),
  createMenuItem("Teh Manis", "Teh manis hangat/dingin", 6000, "Minuman", ["Halal", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Teh Tarik", "Teh tarik khas Malaysia", 9000, "Minuman", ["Halal", "Signature"], true, false, "3-5 menit"),
  createMenuItem("Lemon Tea", "Teh lemon segar", 9000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Limun", "Es limun segar", 19000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Coklat Pankoi", "Es coklat spesial Kedai Pankoi", 19000, "Minuman", ["Halal", "Cold", "Signature"], true, false, "3-5 menit"),
  createMenuItem("Kopi Butter", "Kopi dengan butter", 17000, "Kopi", ["Halal", "Signature"], false, false, "5-7 menit"),
  createMenuItem("Coklat Butter", "Coklat dengan butter", 13000, "Minuman", ["Halal", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Ice Coffee Pankoi", "Es kopi spesial Kedai Pankoi", 18000, "Kopi", ["Halal", "Cold", "Signature"], true, false, "5-7 menit"),
  createMenuItem("Kopi O", "Kopi hitam khas", 11000, "Kopi", ["Halal", "Traditional"], false, false, "3-5 menit"),
  
  // ADD ONS
  createMenuItem("Es Batu", "Es batu tambahan", 2000, "Add Ons", ["Cold"], false, false, "1 menit"),
  createMenuItem("Chili Oil", "Saus chili oil", 5000, "Add Ons", ["Spicy"], false, true, "1 menit"),
  createMenuItem("Saus Mentai", "Saus mentai tambahan", 5000, "Add Ons", ["Japanese"], false, false, "1 menit"),
  createMenuItem("Nasi Putih", "Nasi putih tambahan", 5000, "Add Ons", ["Traditional"], false, false, "2-3 menit"),
  createMenuItem("Telor Ceplok", "Telur ceplok tambahan", 7000, "Add Ons", ["Fresh"], false, false, "3-5 menit"),
  createMenuItem("Telor Dadar", "Telur dadar tambahan", 7000, "Add Ons", ["Fresh"], false, false, "3-5 menit")
];

// Add pankoi menus to database
console.log(`Adding ${pankoiMenus.length} menu items for Kedai Pankoi...`);

// Add each menu item
pankoiMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${pankoiMenus.length} menu items for Kedai Pankoi!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = pankoiMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});
