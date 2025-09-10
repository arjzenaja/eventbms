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
    destinationId: "24", // Djago Jowo destination ID
    destinationSlug: "https://djagojowo.co.id/?fbclid=PAZXh0bgNhZW0CMTEAAae24DL8sssALXm_9sUadKZ8Ktw4HSdfK0ldMT2pzrVfnuPIZYv-0l2v8XHTLw_aem_lOUShOGj0miDD9TMosHT2A",
    destinationTitle: "Djago Jowo",
    rating: 4.6,
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

// Djago Jowo Menu Items
const djagoJowoMenus = [
  // AYAM JOWO AGENG
  createMenuItem("Ayam 1/8 Ekor", "Ayam jowo ageng 1/8 ekor dengan sambal ijo/tlenjeng/terasi", 29000, "Ayam Jowo Ageng", ["Halal", "Traditional", "Javanese"], false, false, "20-25 menit"),
  createMenuItem("Ayam 1/4 Ekor", "Ayam jowo ageng 1/4 ekor dengan sambal ijo/tlenjeng/terasi", 53000, "Ayam Jowo Ageng", ["Halal", "Traditional", "Javanese"], false, false, "20-25 menit"),
  createMenuItem("Ayam 1 Ekor", "Ayam jowo ageng 1 ekor dengan sambal ijo/tlenjeng/terasi", 210000, "Ayam Jowo Ageng", ["Halal", "Traditional", "Javanese"], true, false, "30-35 menit"),
  createMenuItem("Paket Ayam 1/8 Ekor", "Paket ayam jowo ageng 1/8 ekor lengkap", 35000, "Ayam Jowo Ageng", ["Halal", "Traditional", "Javanese", "Package"], false, false, "20-25 menit"),
  createMenuItem("Paket Ayam 1/4 Ekor", "Paket ayam jowo ageng 1/4 ekor lengkap", 55000, "Ayam Jowo Ageng", ["Halal", "Traditional", "Javanese", "Package"], false, false, "20-25 menit"),

  // MINUMAN
  createMenuItem("Air Es", "Air es", 1000, "Minuman", ["Halal", "Cold"], false, false, "1 menit"),
  createMenuItem("Teh Tawar Es/Anget", "Teh tawar es/anget", 2000, "Minuman", ["Halal", "Cold", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Air Mineral Botol", "Air mineral botol", 6000, "Minuman", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Teh Manis Es/Anget", "Teh manis es/anget", 6000, "Minuman", ["Halal", "Sweet", "Cold", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Lemon Tea DJ Es/Anget", "Lemon tea DJ es/anget", 9000, "Minuman", ["Halal", "Cold", "Hot", "Signature"], false, false, "3-5 menit"),
  createMenuItem("Gula Asem Es/Anget", "Gula asem es/anget", 10000, "Minuman", ["Halal", "Traditional", "Cold", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Es/Anget", "Jeruk es/anget", 10000, "Minuman", ["Halal", "Cold", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Nipis Es/Anget", "Jeruk nipis es/anget", 10000, "Minuman", ["Halal", "Cold", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Kunir Asem Es/Anget", "Kunir asem es/anget", 10000, "Minuman", ["Halal", "Traditional", "Cold", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Susu Es/Anget", "Susu es/anget", 10000, "Minuman", ["Halal", "Cold", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Wedang Uwuh", "Wedang uwuh", 10000, "Minuman", ["Halal", "Traditional", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Wedang Jahe", "Wedang jahe", 10000, "Minuman", ["Halal", "Traditional", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Kopi Tubruk", "Kopi tubruk", 10000, "Minuman", ["Halal", "Traditional", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Teh Gula Batu", "Teh gula batu", 13000, "Minuman", ["Halal", "Traditional", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Jahe Susu", "Jahe susu", 15000, "Minuman", ["Halal", "Traditional", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Kopi Susu", "Kopi susu", 15000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Es Campur", "Es campur", 15000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Es Dawet", "Es dawet", 15000, "Minuman", ["Halal", "Traditional", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Es Cincau Nangka", "Es cincau nangka", 15000, "Minuman", ["Halal", "Cold", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Puding Kelapa Muda", "Puding kelapa muda", 30000, "Minuman", ["Halal", "Cold", "Dessert"], false, false, "10-15 menit"),

  // ALA CARTE
  createMenuItem("Mendoan", "Mendoan", 3000, "Ala Carte", ["Halal", "Traditional", "Crispy"], false, false, "3-5 menit"),
  createMenuItem("Bakwan Sayur", "Bakwan sayur", 4000, "Ala Carte", ["Halal", "Crispy", "Vegetable"], false, false, "3-5 menit"),
  createMenuItem("Nasi Putih", "Nasi putih", 6000, "Ala Carte", ["Halal", "Staple"], false, false, "2-3 menit"),
  createMenuItem("Tahu/Tempe Goreng", "Tahu/tempe goreng", 7000, "Ala Carte", ["Halal", "Traditional", "Crispy"], false, false, "3-5 menit"),
  createMenuItem("Telur Dadar", "Telur dadar", 7000, "Ala Carte", ["Halal", "Egg"], false, false, "3-5 menit"),
  createMenuItem("Kerupuk", "Kerupuk", 7000, "Ala Carte", ["Halal", "Crispy"], false, false, "1-2 menit"),
  createMenuItem("Rempelo Ati", "Rempelo ati", 9000, "Ala Carte", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Oseng Tempe", "Oseng tempe", 9000, "Ala Carte", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Kepala", "Kepala", 9000, "Ala Carte", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Lodeh Welok", "Lodeh welok", 10000, "Ala Carte", ["Halal", "Traditional", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Pete (Bakar/Goreng)", "Pete bakar/goreng", 11000, "Ala Carte", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Jangan Kangkung", "Jangan kangkung", 10000, "Ala Carte", ["Halal", "Vegetable"], false, false, "5-8 menit"),
  createMenuItem("Mie Goreng Pedas/Tdk Pedas", "Mie goreng pedas/tidak pedas", 15000, "Ala Carte", ["Halal", "Noodles"], false, false, "8-12 menit"),
  createMenuItem("Kikil Gongso Lombok Ijo", "Kikil gongso lombok ijo", 16000, "Ala Carte", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Cumi Lombok Ijo", "Cumi lombok ijo", 25000, "Ala Carte", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),

  // JAJANAN
  createMenuItem("Pisang Godhog", "Pisang godhog", 3000, "Jajanan", ["Halal", "Traditional", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Pisang Goreng", "Pisang goreng", 3500, "Jajanan", ["Halal", "Traditional", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Singkong Goreng Asin", "Singkong goreng asin", 6000, "Jajanan", ["Halal", "Traditional", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Kacang Rebus", "Kacang rebus", 6000, "Jajanan", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Rangin Gendis Jawa/Putih (Isi 6)", "Rangin gendis jawa/putih isi 6", 10000, "Jajanan", ["Halal", "Traditional", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Singkong Goreng Cokelat Keju", "Singkong goreng cokelat keju", 10000, "Jajanan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Emping/Kripik Pisang/Singkong", "Emping/kripik pisang/singkong", 10000, "Jajanan", ["Halal", "Traditional", "Crispy"], false, false, "1-2 menit"),

  // ANEKA JANGANAN (Additional category from the menu)
  createMenuItem("Jangan Pare", "Jangan pare", 10000, "Jajanan", ["Halal", "Vegetable", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Jangan Pakis", "Jangan pakis", 10000, "Jajanan", ["Halal", "Vegetable", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Jangan Balado Terong", "Jangan balado terong", 10000, "Jajanan", ["Halal", "Vegetable", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Jangan Genjer", "Jangan genjer", 10000, "Jajanan", ["Halal", "Vegetable", "Traditional"], false, false, "8-12 menit")
];

// Add djago jowo menus to database
console.log(`Adding ${djagoJowoMenus.length} menu items for Djago Jowo...`);

// Add each menu item
djagoJowoMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${djagoJowoMenus.length} menu items for Djago Jowo!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = djagoJowoMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = djagoJowoMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);

// Popular items summary
const popularItems = djagoJowoMenus.filter(menu => menu.isPopular);
console.log(`\n⭐ Popular Items: ${popularItems.length} items`);
popularItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Spicy items summary
const spicyItems = djagoJowoMenus.filter(menu => menu.isSpicy);
console.log(`\n🌶️ Spicy Items: ${spicyItems.length} items`);
spicyItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Traditional items summary
const traditionalItems = djagoJowoMenus.filter(menu => menu.additionalInfo.includes("Traditional"));
console.log(`\n🏺 Traditional Items: ${traditionalItems.length} items`);
traditionalItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});
