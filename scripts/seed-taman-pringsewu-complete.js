const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

// Read current database
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Get next available ID
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

console.log('🌱 Menambahkan menu Taman Pringsewu...');

// MINUMAN SPESIAL
const minumanSpesial = [
  createMenuItem("Teh Poci", "Teh tradisional dalam poci tanah liat", 13500, "Minuman Spesial", ["Traditional", "Hot"], true),
  createMenuItem("Es Durian", "Es durian segar dengan daging durian asli", 27500, "Minuman Spesial", ["Premium", "Cold", "Sweet"], true),
  createMenuItem("Es Seruni", "Es seruni segar dan menyegarkan", 15000, "Minuman Spesial", ["Cold", "Fresh"]),
  createMenuItem("Es Gulas", "Es gulas khas dengan rasa manis", 11000, "Minuman Spesial", ["Cold", "Sweet"])
];

// ANEKA JUS
const anekaJus = [
  createMenuItem("Jus Durian", "Jus durian segar tanpa pengawet", 27500, "Aneka Jus", ["Premium", "Fresh", "Sweet"], true),
  createMenuItem("Jus Alpokat", "Jus alpokat segar dan creamy", 17000, "Aneka Jus", ["Fresh", "Healthy"]),
  createMenuItem("Jus Strobery", "Jus stroberi segar dan asam manis", 15000, "Aneka Jus", ["Fresh", "Sweet", "Sour"]),
  createMenuItem("Jus Jambu Merah", "Jus jambu merah segar", 15000, "Aneka Jus", ["Fresh", "Healthy"]),
  createMenuItem("Jus Sirsak", "Jus sirsak segar dan asam", 15000, "Aneka Jus", ["Fresh", "Sour"]),
  createMenuItem("Jus Kelapa Muda", "Jus kelapa muda segar", 15000, "Aneka Jus", ["Fresh", "Cold"]),
  createMenuItem("Jus Mix", "Jus campuran buah segar", 14000, "Aneka Jus", ["Fresh", "Mixed"]),
  createMenuItem("Jus Jeruk", "Jus jeruk segar", 14000, "Aneka Jus", ["Fresh", "Sour"]),
  createMenuItem("Jus Melon", "Jus melon segar dan manis", 14000, "Aneka Jus", ["Fresh", "Sweet"]),
  createMenuItem("Jus Tomat", "Jus tomat segar", 14000, "Aneka Jus", ["Fresh", "Healthy"]),
  createMenuItem("Jus Mangga", "Jus mangga segar dan manis", 15000, "Aneka Jus", ["Fresh", "Sweet"]),
  createMenuItem("Jus Fiber", "Jus serat tinggi untuk kesehatan", 14000, "Aneka Jus", ["Fresh", "Healthy"])
];

// MINUMAN PANAS
const minumanPanas = [
  createMenuItem("Kopi Susu Jahe", "Kopi susu dengan jahe hangat", 14500, "Minuman Panas", ["Hot", "Spicy"], true),
  createMenuItem("Kopi Jahe", "Kopi hitam dengan jahe", 13000, "Minuman Panas", ["Hot", "Spicy"]),
  createMenuItem("Wedang Jahe", "Wedang jahe hangat tradisional", 12500, "Minuman Panas", ["Hot", "Traditional", "Spicy"]),
  createMenuItem("Jahe Susu", "Jahe susu hangat", 14500, "Minuman Panas", ["Hot", "Spicy"]),
  createMenuItem("Teh Tarik", "Teh tarik hangat", 13000, "Minuman Panas", ["Hot", "Traditional"], true),
  createMenuItem("Lemon Tea", "Teh lemon hangat", 11000, "Minuman Panas", ["Hot", "Sour"]),
  createMenuItem("Jeruk Panas", "Jeruk hangat", 13000, "Minuman Panas", ["Hot", "Sour"]),
  createMenuItem("Susu Milo", "Susu Milo hangat", 13000, "Minuman Panas", ["Hot", "Sweet"]),
  createMenuItem("Kopi Gelas", "Kopi hitam dalam gelas", 8500, "Minuman Panas", ["Hot"]),
  createMenuItem("Kopi Susu Cangkir", "Kopi susu dalam cangkir", 8500, "Minuman Panas", ["Hot"]),
  createMenuItem("Kopi Cangkir", "Kopi hitam dalam cangkir", 6000, "Minuman Panas", ["Hot"]),
  createMenuItem("Capucino Cangkir", "Cappuccino dalam cangkir", 9000, "Minuman Panas", ["Hot"]),
  createMenuItem("Nescafe", "Nescafe instan", 8500, "Minuman Panas", ["Hot"]),
  createMenuItem("White Coffe", "White coffee hangat", 7500, "Minuman Panas", ["Hot"])
];

// MINUMAN DINGIN
const minumanDingin = [
  createMenuItem("Es Kelapa Muda", "Es kelapa muda segar", 15000, "Minuman Dingin", ["Cold", "Fresh"], true),
  createMenuItem("Es Kelapa Jeruk", "Es kelapa dengan jeruk", 15000, "Minuman Dingin", ["Cold", "Fresh"]),
  createMenuItem("Es Kelapa Marquisa", "Es kelapa dengan marquisa", 15000, "Minuman Dingin", ["Cold", "Fresh"]),
  createMenuItem("Es Jeruk", "Es jeruk segar", 13000, "Minuman Dingin", ["Cold", "Sour"]),
  createMenuItem("Es Susu Milo", "Es susu Milo dingin", 13000, "Minuman Dingin", ["Cold", "Sweet"]),
  createMenuItem("Es Soda Gembira", "Es soda gembira", 15000, "Minuman Dingin", ["Cold", "Sweet"]),
  createMenuItem("Es Klengkeng", "Es klengkeng segar", 13000, "Minuman Dingin", ["Cold", "Sweet"]),
  createMenuItem("Es Capucino", "Es cappuccino dingin", 13000, "Minuman Dingin", ["Cold"]),
  createMenuItem("Es Cincau", "Es cincau segar", 11000, "Minuman Dingin", ["Cold", "Fresh"]),
  createMenuItem("Es Teh Tarik", "Es teh tarik dingin", 13000, "Minuman Dingin", ["Cold", "Traditional"]),
  createMenuItem("Es Marqisa", "Es marquisa segar", 11000, "Minuman Dingin", ["Cold", "Fresh"]),
  createMenuItem("Es Lemon Tea", "Es lemon tea dingin", 11000, "Minuman Dingin", ["Cold", "Sour"]),
  createMenuItem("Es Lemon Squash", "Es lemon squash", 15000, "Minuman Dingin", ["Cold", "Sour"])
];

// PAKET RAMADAN
const paketRamadan = [
  createMenuItem("Paket Ramadhan 1", "Nasi Putih, Ayam Tepung, Cap Cay Jawa, Mie Goreng, Buah, Mineral Gelas, Telur Balado, Oseng Kacang Panjang, Soun Cabe Ijo, Kerupuk", 20000, "Paket Ramadan", ["Ramadan", "Package"], true),
  createMenuItem("Paket Ramadhan 2", "Nasi Putih, Ayam Kremes, Ca Jamur, Mie Goreng, Acar & Sambal, Buah, Mineral Gelas, Ikan Bumbu Bali, Lodeh Terong, Peyek Kacang", 23000, "Paket Ramadan", ["Ramadan", "Package"], true),
  createMenuItem("Paket Ramadhan 3", "Nasi Putih, Sop Sayap, Ayam Kremes, Oseng Keciwis, Acar & Sambal, Buah, Mineral Gelas, Sayur Asem, Ayam Bakar, Mie Goreng", 26000, "Paket Ramadan", ["Ramadan", "Package"], true),
  createMenuItem("Paket Ramadhan 4", "Nasi Putih, Sop Sosis, Ayam Gulung, Tahu Cabe Ijo, Kerupuk, Acar & Sambal, Buah, Mineral Gelas, Sop Sayur, Udang Gulung, Tumis Jamur", 29000, "Paket Ramadan", ["Ramadan", "Package"], true)
];

// SOP
const sop = [
  createMenuItem("Sop Buntut", "Sop buntut sapi dengan sayuran segar", 30000, "Sop", ["Hot", "Traditional"], true),
  createMenuItem("Sop Iga", "Sop iga sapi dengan bumbu rempah", 30000, "Sop", ["Hot", "Traditional"], true),
  createMenuItem("Sop Ayam", "Sop ayam dengan sayuran", 20000, "Sop", ["Hot", "Traditional"]),
  createMenuItem("Sop Jagung", "Sop jagung manis", 25000, "Sop", ["Hot", "Sweet"]),
  createMenuItem("Sop Gurameh", "Sop gurameh dengan sayuran", 29000, "Sop", ["Hot", "Seafood"])
];

// NASI
const nasi = [
  createMenuItem("Nasi Putih", "Nasi putih hangat", 5000, "Nasi", ["Hot", "Basic"]),
  createMenuItem("Nasi Goreng Ayam", "Nasi goreng dengan ayam", 25000, "Nasi", ["Hot", "Traditional"], true),
  createMenuItem("Nasi Goreng Seafood", "Nasi goreng dengan seafood", 28000, "Nasi", ["Hot", "Seafood"], true),
  createMenuItem("Nasi Goreng Selimut", "Nasi goreng dengan telur dadar", 21000, "Nasi", ["Hot", "Traditional"])
];

// GURAMEH
const gurameh = [
  createMenuItem("Gurameh Bakar Pringsewu", "Gurameh bakar khas Pringsewu", 84000, "Gurameh", ["Grilled", "Signature", "Premium"], true),
  createMenuItem("Gurameh Goreng", "Gurameh goreng crispy", 84000, "Gurameh", ["Fried", "Crispy", "Premium"], true),
  createMenuItem("Gurameh Asam Manis", "Gurameh asam manis", 70000, "Gurameh", ["Sweet", "Sour", "Premium"]),
  createMenuItem("Gurameh Asam Pedas", "Gurameh asam pedas", 70000, "Gurameh", ["Spicy", "Sour", "Premium"])
];

// AYAM
const ayam = [
  createMenuItem("Ayam Bakar Kampung", "Ayam kampung bakar", 21000, "Ayam", ["Grilled", "Traditional"], true),
  createMenuItem("Ayam Bakar Penyet", "Ayam bakar penyet", 21000, "Ayam", ["Grilled", "Spicy"], true),
  createMenuItem("Ayam Goreng Kampung", "Ayam kampung goreng", 21000, "Ayam", ["Fried", "Traditional"]),
  createMenuItem("Ayam Goreng Penyet", "Ayam goreng penyet", 21000, "Ayam", ["Fried", "Spicy"]),
  createMenuItem("Ayam Kuluke", "Ayam kuluke khas", 31000, "Ayam", ["Traditional", "Premium"]),
  createMenuItem("Ayam Lada Hitam", "Ayam lada hitam", 31000, "Ayam", ["Spicy", "Premium"]),
  createMenuItem("Ayam Asam Manis", "Ayam asam manis", 31000, "Ayam", ["Sweet", "Sour", "Premium"])
];

// TAHU TEMPE
const tahuTempe = [
  createMenuItem("Tahu Tempe Kemul", "Tahu tempe kemul", 18000, "Tahu Tempe", ["Traditional", "Fried"]),
  createMenuItem("Tahu Goreng", "Tahu goreng crispy", 12000, "Tahu Tempe", ["Fried", "Crispy"]),
  createMenuItem("Tempe Goreng", "Tempe goreng", 12000, "Tahu Tempe", ["Fried", "Traditional"]),
  createMenuItem("Tahu Tempe Goreng", "Tahu tempe goreng", 12000, "Tahu Tempe", ["Fried", "Traditional"]),
  createMenuItem("Tahu Penyet", "Tahu penyet", 12000, "Tahu Tempe", ["Spicy", "Fried"]),
  createMenuItem("Tempe Penyet", "Tempe penyet", 12000, "Tahu Tempe", ["Spicy", "Fried"]),
  createMenuItem("Tahu Tempe Penyet", "Tahu tempe penyet", 12000, "Tahu Tempe", ["Spicy", "Fried"])
];

// SAMBAL
const sambal = [
  createMenuItem("Sambal Trasi", "Sambal terasi", 5000, "Sambal", ["Spicy", "Traditional"]),
  createMenuItem("Sambal Matang", "Sambal matang", 5000, "Sambal", ["Spicy", "Traditional"]),
  createMenuItem("Sambal Bawang", "Sambal bawang", 5000, "Sambal", ["Spicy", "Traditional"]),
  createMenuItem("Sambal Penyet", "Sambal penyet", 5000, "Sambal", ["Spicy", "Traditional"]),
  createMenuItem("Lalap Sambal", "Lalap dengan sambal", 9000, "Sambal", ["Spicy", "Fresh"])
];

// VEGETARIAN
const vegetarian = [
  createMenuItem("Soup Jamur Vegan", "Sup jamur vegan", 25000, "Vegetarian", ["Hot", "Vegan", "Healthy"]),
  createMenuItem("Jamur Crispy Vegan", "Jamur crispy vegan", 20500, "Vegetarian", ["Fried", "Vegan", "Crispy"]),
  createMenuItem("Cap Cay Vegan", "Cap cay vegan", 25000, "Vegetarian", ["Vegan", "Healthy"])
];

// PANAS (Minuman Panas - duplikat dari Minuman Panas untuk kategori terpisah)
const panas = [
  createMenuItem("Teh Poci Panas", "Teh poci hangat", 14500, "Panas", ["Hot", "Traditional"], true),
  createMenuItem("Jahe Poci", "Jahe dalam poci", 16000, "Panas", ["Hot", "Spicy"]),
  createMenuItem("Jahe Susu Poci", "Jahe susu dalam poci", 18000, "Panas", ["Hot", "Spicy"]),
  createMenuItem("Jeruk Panas", "Jeruk hangat", 12500, "Panas", ["Hot", "Sour"]),
  createMenuItem("Kopi Panas", "Kopi hitam hangat", 8000, "Panas", ["Hot"]),
  createMenuItem("Kopi Susu Panas", "Kopi susu hangat", 9000, "Panas", ["Hot"]),
  createMenuItem("Lemon Tea Panas", "Lemon tea hangat", 10000, "Panas", ["Hot", "Sour"]),
  createMenuItem("Susu Milo Panas", "Susu Milo hangat", 13000, "Panas", ["Hot", "Sweet"])
];

// DESSERT
const dessert = [
  createMenuItem("Buah Dingin K", "Buah dingin kecil", 11500, "Dessert", ["Cold", "Fresh", "Sweet"]),
  createMenuItem("Buah Dingin B", "Buah dingin besar", 20000, "Dessert", ["Cold", "Fresh", "Sweet"]),
  createMenuItem("Ice Cream Goreng", "Ice cream goreng", 17500, "Dessert", ["Cold", "Sweet", "Fried"], true),
  createMenuItem("Salad Buah", "Salad buah segar", 12000, "Dessert", ["Cold", "Fresh", "Healthy"])
];

// PAKET KHUSUS
const paketKhusus = [
  createMenuItem("Paket 3 Orang", "Nasi Putih, Ayam Tepung Asam Manis, Tumis Kangkung Ayam, Sapo Tahu Ayam, Mendoan, Buah Segar, Es Kelapa Muda", 160000, "Paket Khusus", ["Package", "Group"], true),
  createMenuItem("Paket 5 Orang", "Nasi Putih, Gurame Cabe Ijo, Udang Tepung Asam Manis, Tumis Kangkung Seafood, Cap Cay Polos, Buah Segar, Teh Tarik", 240000, "Paket Khusus", ["Package", "Group"], true)
];

// Combine all menus
const allMenus = [
  ...minumanSpesial,
  ...anekaJus,
  ...minumanPanas,
  ...minumanDingin,
  ...paketRamadan,
  ...sop,
  ...nasi,
  ...gurameh,
  ...ayam,
  ...tahuTempe,
  ...sambal,
  ...vegetarian,
  ...panas,
  ...dessert,
  ...paketKhusus
];

console.log(`📊 Total menu items yang akan ditambahkan: ${allMenus.length}`);

// Add to database
db.menu_items.push(...allMenus);

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('✅ Menu Taman Pringsewu berhasil ditambahkan!');

// Show summary by category
const categorySummary = {};
allMenus.forEach(item => {
  categorySummary[item.category] = (categorySummary[item.category] || 0) + 1;
});

console.log('\n📋 Ringkasan per kategori:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`- ${category}: ${count} items`);
});

console.log(`\n🎉 Total menu items di database: ${db.menu_items.length}`);
