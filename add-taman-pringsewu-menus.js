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
    destinationId: "26", // Taman Pringsewu destination ID
    destinationSlug: "",
    destinationTitle: "Taman Pringsewu",
    rating: 4.5,
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

// Taman Pringsewu Menu Items
const tamanPringsewuMenus = [
  // MINUMAN SPESIAL
  createMenuItem("Teh Poci", "Teh poci", 13500, "Minuman Spesial", ["Halal", "Traditional", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Es Durian", "Es durian", 27500, "Minuman Spesial", ["Halal", "Cold", "Premium"], true, false, "5-8 menit"),
  createMenuItem("Es Seruni", "Es seruni", 15000, "Minuman Spesial", ["Halal", "Cold", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Es Gulas", "Es gulas", 11000, "Minuman Spesial", ["Halal", "Cold", "Traditional"], false, false, "5-8 menit"),

  // ANEKA JAMU
  createMenuItem("Jamu Kunir Asem", "Jamu kunir asem", 6500, "Aneka Jamu", ["Halal", "Traditional", "Herbal"], false, false, "3-5 menit"),
  createMenuItem("Jamu Cabe Puyang", "Jamu cabe puyang", 6500, "Aneka Jamu", ["Halal", "Traditional", "Herbal"], false, false, "3-5 menit"),

  // MINUMAN DINGIN
  createMenuItem("Es Kelapa Muda", "Es kelapa muda", 15000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Kelapa Jeruk", "Es kelapa jeruk", 15000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Kelapa Marquisa", "Es kelapa marquisa", 15000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Jeruk", "Es jeruk", 13000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Susu Milo", "Es susu milo", 13000, "Minuman Dingin", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Gembira", "Es soda gembira", 15000, "Minuman Dingin", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Klengkeng", "Es klengkeng", 13000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Capucino", "Es capucino", 13000, "Minuman Dingin", ["Halal", "Cold", "Coffee"], false, false, "3-5 menit"),
  createMenuItem("Es Cincau", "Es cincau", 11000, "Minuman Dingin", ["Halal", "Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Es Teh Tarik", "Es teh tarik", 13000, "Minuman Dingin", ["Halal", "Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Es Marqisa", "Es marqisa", 11000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Lemon Tea", "Es lemon tea", 11000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Lemon Squash", "Es lemon squash", 15000, "Minuman Dingin", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),

  // MINUMAN PANAS
  createMenuItem("Kopi Susu Jahe", "Kopi susu jahe", 14500, "Minuman Panas", ["Halal", "Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Kopi Jahe", "Kopi jahe", 13000, "Minuman Panas", ["Halal", "Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Wedang Jahe", "Wedang jahe", 12500, "Minuman Panas", ["Halal", "Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Jahe Susu", "Jahe susu", 14500, "Minuman Panas", ["Halal", "Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Teh Tarik", "Teh tarik", 13000, "Minuman Panas", ["Halal", "Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Lemon Tea", "Lemon tea", 11000, "Minuman Panas", ["Halal", "Hot", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Panas", "Jeruk panas", 13000, "Minuman Panas", ["Halal", "Hot", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Susu Milo", "Susu milo", 13000, "Minuman Panas", ["Halal", "Hot", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Kopi Gelas", "Kopi gelas", 8500, "Minuman Panas", ["Halal", "Hot", "Coffee"], false, false, "3-5 menit"),
  createMenuItem("Kopi Susu Cangkir", "Kopi susu cangkir", 8500, "Minuman Panas", ["Halal", "Hot", "Coffee"], false, false, "3-5 menit"),
  createMenuItem("Kopi Cangkir", "Kopi cangkir", 6000, "Minuman Panas", ["Halal", "Hot", "Coffee"], false, false, "3-5 menit"),
  createMenuItem("Capucino Cangkir", "Capucino cangkir", 9000, "Minuman Panas", ["Halal", "Hot", "Coffee"], false, false, "3-5 menit"),
  createMenuItem("Nescafe", "Nescafe", 8500, "Minuman Panas", ["Halal", "Hot", "Coffee"], false, false, "3-5 menit"),
  createMenuItem("White Coffee", "White coffee", 7500, "Minuman Panas", ["Halal", "Hot", "Coffee"], false, false, "3-5 menit"),

  // ANEKA JUS
  createMenuItem("Jus Durian", "Jus durian", 27500, "Aneka Jus", ["Halal", "Fresh", "Premium"], true, false, "5-8 menit"),
  createMenuItem("Jus Alpokat", "Jus alpokat", 17000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Strobery", "Jus strobery", 15000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Jambu Merah", "Jus jambu merah", 15000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Sirsak", "Jus sirsak", 15000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Kelapa Muda", "Jus kelapa muda", 15000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Mix", "Jus mix", 14000, "Aneka Jus", ["Halal", "Fresh", "Mixed"], false, false, "5-8 menit"),
  createMenuItem("Jus Jeruk", "Jus jeruk", 14000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Melon", "Jus melon", 14000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Tomat", "Jus tomat", 14000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Mangga", "Jus mangga", 15000, "Aneka Jus", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Jus Fiber", "Jus fiber", 14000, "Aneka Jus", ["Halal", "Fresh", "Healthy"], false, false, "5-8 menit"),

  // PAKET RAMADHAN 1
  createMenuItem("Paket Ramadhan 1", "Paket ramadhan 1 (untuk 3 orang) - Nasi Putih, Ayam Tepung, Cap Cay Jawa, Mie Goreng, Buah, Mineral Gelas, Telur Balado, Oseng Kacang Panjang, Soun Cabe Ijo, Kerupuk", 20000, "Paket Ramadhan 1", ["Halal", "Package", "Ramadhan"], false, false, "15-20 menit"),

  // PAKET RAMADHAN 2
  createMenuItem("Paket Ramadhan 2", "Paket ramadhan 2 (untuk 3 orang) - Nasi Putih, Ayam Kremes, Ca Jamur, Mie Goreng, Acar & Sambal, Buah, Mineral Gelas, Ikan Bumbu Bali, Lodeh Terong, Peyek Kacang", 23000, "Paket Ramadhan 2", ["Halal", "Package", "Ramadhan"], false, false, "15-20 menit"),

  // PAKET RAMADHAN 3
  createMenuItem("Paket Ramadhan 3", "Paket ramadhan 3 (untuk 3 orang) - Nasi Putih, Sop Sayap, Ayam Kremes, Oseng Keciwis, Acar & Sambal, Buah, Mineral Gelas, Sayur Asem, Ayam Bakar, Mie Goreng", 26000, "Paket Ramadhan 3", ["Halal", "Package", "Ramadhan"], false, false, "15-20 menit"),

  // PAKET RAMADHAN 4
  createMenuItem("Paket Ramadhan 4", "Paket ramadhan 4 (untuk 3 orang) - Nasi Putih, Sop Sosis, Ayam Gulung, Tahu Cabe Ijo, Kerupuk, Acar & Sambal, Buah, Mineral Gelas, Sop Sayur, Udang Gulung, Tumis Jamur", 29000, "Paket Ramadhan 4", ["Halal", "Package", "Ramadhan"], false, false, "15-20 menit"),

  // SOP
  createMenuItem("Sop Buntut", "Sop buntut", 30000, "Sop", ["Halal", "Soup"], false, false, "20-25 menit"),
  createMenuItem("Sop Iga", "Sop iga", 30000, "Sop", ["Halal", "Soup"], false, false, "20-25 menit"),
  createMenuItem("Sop Ayam", "Sop ayam", 20000, "Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Jagung", "Sop jagung", 25000, "Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Gurameh", "Sop gurameh", 29000, "Sop", ["Halal", "Soup", "Seafood"], false, false, "20-25 menit"),

  // NASI
  createMenuItem("Nasi Putih", "Nasi putih", 5000, "Nasi", ["Halal", "Staple"], false, false, "2-3 menit"),
  createMenuItem("Nasi Goreng Ayam", "Nasi goreng ayam", 25000, "Nasi", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Seafood", "Nasi goreng seafood", 28000, "Nasi", ["Halal", "Seafood"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Selimut", "Nasi goreng selimut", 21000, "Nasi", ["Halal", "Traditional"], false, false, "10-15 menit"),

  // GURAMEH
  createMenuItem("Gurameh Bakar Pringsewu", "Gurameh bakar pringsewu", 84000, "Gurameh", ["Halal", "Grilled", "Seafood", "Signature"], true, false, "25-30 menit"),
  createMenuItem("Gurameh Goreng", "Gurameh goreng", 84000, "Gurameh", ["Halal", "Fried", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurameh Asam Manis", "Gurameh asam manis", 70000, "Gurameh", ["Halal", "Seafood", "Sweet"], false, false, "20-25 menit"),
  createMenuItem("Gurameh Asam Pedas", "Gurameh asam pedas", 70000, "Gurameh", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),

  // AYAM
  createMenuItem("Ayam Bakar Kampung", "Ayam bakar kampung", 21000, "Ayam", ["Halal", "Grilled", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Ayam Bakar Penyet", "Ayam bakar penyet", 21000, "Ayam", ["Halal", "Grilled", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Ayam Goreng Kampung", "Ayam goreng kampung", 21000, "Ayam", ["Halal", "Fried", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Goreng Penyet", "Ayam goreng penyet", 21000, "Ayam", ["Halal", "Fried", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Kuluke", "Ayam kuluke", 31000, "Ayam", ["Halal", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Ayam Lada Hitam", "Ayam lada hitam", 31000, "Ayam", ["Halal", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Ayam Asam Manis", "Ayam asam manis", 31000, "Ayam", ["Halal", "Sweet"], false, false, "20-25 menit"),

  // TAHU/TEMPE
  createMenuItem("Tahu Tempe Kemul", "Tahu tempe kemul", 18000, "Tahu/Tempe", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Tahu Goreng", "Tahu goreng", 12000, "Tahu/Tempe", ["Halal", "Fried"], false, false, "5-8 menit"),
  createMenuItem("Tempe Goreng", "Tempe goreng", 12000, "Tahu/Tempe", ["Halal", "Fried"], false, false, "5-8 menit"),
  createMenuItem("Tahu Tempe Goreng", "Tahu tempe goreng", 12000, "Tahu/Tempe", ["Halal", "Fried"], false, false, "5-8 menit"),
  createMenuItem("Tahu Penyet", "Tahu penyet", 12000, "Tahu/Tempe", ["Halal", "Fried"], false, false, "5-8 menit"),
  createMenuItem("Tempe Penyet", "Tempe penyet", 12000, "Tahu/Tempe", ["Halal", "Fried"], false, false, "5-8 menit"),
  createMenuItem("Tahu Tempe Penyet", "Tahu tempe penyet", 12000, "Tahu/Tempe", ["Halal", "Fried"], false, false, "5-8 menit"),

  // UDANG
  createMenuItem("Udang Tepung", "Udang tepung", 30000, "Udang", ["Halal", "Fried", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Asam Pedas", "Udang asam pedas", 30000, "Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Mayonaise", "Udang mayonaise", 30000, "Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Renyah", "Udang renyah", 30000, "Udang", ["Halal", "Fried", "Seafood"], false, false, "15-20 menit"),

  // CUMI
  createMenuItem("Cumi Tepung", "Cumi tepung", 30000, "Cumi", ["Halal", "Fried", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Cumi Asam Manis", "Cumi asam manis", 30000, "Cumi", ["Halal", "Seafood", "Sweet"], false, false, "15-20 menit"),
  createMenuItem("Cumi Renyah", "Cumi renyah", 30000, "Cumi", ["Halal", "Fried", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Cumi Mayonaise", "Cumi mayonaise", 30000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),

  // STEAK
  createMenuItem("Steak Sapi Lada Hitam", "Steak sapi lada hitam", 35000, "Steak", ["Halal", "Grilled", "Beef", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Steak Ayam Lada Hitam", "Steak ayam lada hitam", 30000, "Steak", ["Halal", "Grilled", "Chicken", "Spicy"], false, true, "20-25 menit"),

  // SAYUR
  createMenuItem("Ca/Tumis Kangkung Ayam", "Ca/tumis kangkung ayam", 20000, "Sayur", ["Halal", "Vegetable"], false, false, "8-12 menit"),
  createMenuItem("Ca/Tumis Kangkung Seafood", "Ca/tumis kangkung seafood", 25000, "Sayur", ["Halal", "Vegetable", "Seafood"], false, false, "8-12 menit"),
  createMenuItem("Oseng Kangkung Ayam", "Oseng kangkung ayam", 20000, "Sayur", ["Halal", "Vegetable"], false, false, "8-12 menit"),
  createMenuItem("Oseng Kangkung Seafood", "Oseng kangkung seafood", 25000, "Sayur", ["Halal", "Vegetable", "Seafood"], false, false, "8-12 menit"),
  createMenuItem("Cap Cay Ayam", "Cap cay ayam", 20000, "Sayur", ["Halal", "Vegetable"], false, false, "10-15 menit"),
  createMenuItem("Cap Cay Seafood", "Cap cay seafood", 25000, "Sayur", ["Halal", "Vegetable", "Seafood"], false, false, "10-15 menit"),
  createMenuItem("Ca Brokoli Ayam", "Ca brokoli ayam", 20000, "Sayur", ["Halal", "Vegetable"], false, false, "8-12 menit"),
  createMenuItem("Ca Brokoli Seafood", "Ca brokoli seafood", 25000, "Sayur", ["Halal", "Vegetable", "Seafood"], false, false, "8-12 menit"),
  createMenuItem("Sapo Tahu Ayam", "Sapo tahu ayam", 20000, "Sayur", ["Halal", "Vegetable"], false, false, "10-15 menit"),
  createMenuItem("Sapo Tahu Seafood", "Sapo tahu seafood", 25000, "Sayur", ["Halal", "Vegetable", "Seafood"], false, false, "10-15 menit"),

  // PANAS (Hot Main Dishes)
  createMenuItem("Mie Ayam", "Mie ayam", 15000, "Panas", ["Halal", "Noodles", "Hot"], false, false, "10-15 menit"),
  createMenuItem("Mie Ayam Jumbo", "Mie ayam jumbo", 20000, "Panas", ["Halal", "Noodles", "Hot"], false, false, "10-15 menit"),
  createMenuItem("Steak Galantine", "Steak galantine", 25000, "Panas", ["Halal", "Grilled", "Hot"], false, false, "20-25 menit"),
  createMenuItem("Selat Pringsewu", "Selat pringsewu", 20000, "Panas", ["Halal", "Traditional", "Hot"], false, false, "15-20 menit"),
  createMenuItem("French Fries", "French fries", 15000, "Panas", ["Halal", "Fried", "Hot"], false, false, "5-8 menit"),

  // DESSERT
  createMenuItem("Buah Dingin K", "Buah dingin kecil", 11500, "Dessert", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Buah Dingin B", "Buah dingin besar", 20000, "Dessert", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Ice Cream Goreng", "Ice cream goreng", 17500, "Dessert", ["Halal", "Fried", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Salad Buah", "Salad buah", 12000, "Dessert", ["Halal", "Fresh", "Healthy"], false, false, "5-8 menit"),

  // SAMBAL
  createMenuItem("Sambal Trasi", "Sambal trasi", 5000, "Sambal", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Sambal Matang", "Sambal matang", 5000, "Sambal", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Sambal Bawang", "Sambal bawang", 5000, "Sambal", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Sambal Penyet", "Sambal penyet", 5000, "Sambal", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Lalap Sambal", "Lalap sambal", 9000, "Sambal", ["Halal", "Spicy", "Fresh"], false, true, "3-5 menit"),

  // VEGETARIAN
  createMenuItem("Soup Jamur Vegan", "Soup jamur vegan", 25000, "Vegetarian", ["Halal", "Vegan", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Jamur Crispy Vegan", "Jamur crispy vegan", 20500, "Vegetarian", ["Halal", "Vegan", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Cap Cay Vegan", "Cap cay vegan", 25000, "Vegetarian", ["Halal", "Vegan", "Vegetable"], false, false, "10-15 menit")
];

// Add taman pringsewu menus to database
console.log(`Adding ${tamanPringsewuMenus.length} menu items for Taman Pringsewu...`);

// Add each menu item
tamanPringsewuMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${tamanPringsewuMenus.length} menu items for Taman Pringsewu!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = tamanPringsewuMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = tamanPringsewuMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);

// Popular items summary
const popularItems = tamanPringsewuMenus.filter(menu => menu.isPopular);
console.log(`\n⭐ Popular Items: ${popularItems.length} items`);
popularItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Spicy items summary
const spicyItems = tamanPringsewuMenus.filter(menu => menu.isSpicy);
console.log(`\n🌶️ Spicy Items: ${spicyItems.length} items`);
spicyItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Traditional items summary
const traditionalItems = tamanPringsewuMenus.filter(menu => menu.additionalInfo.includes("Traditional"));
console.log(`\n🏺 Traditional Items: ${traditionalItems.length} items`);
traditionalItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Ramadhan packages summary
const ramadhanItems = tamanPringsewuMenus.filter(menu => menu.category.includes("Ramadhan"));
console.log(`\n🌙 Ramadhan Packages: ${ramadhanItems.length} items`);
ramadhanItems.forEach(item => {
  console.log(`  - ${item.name} - Rp ${item.price.toLocaleString()}`);
});
