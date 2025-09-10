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
    destinationId: "20", // Saung Tepi Sawah destination ID
    destinationSlug: "",
    destinationTitle: "Saung Tepi Sawah",
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

// Saung Tepi Sawah Menu Items
const saungTepiSawahMenus = [
  // MAKANAN
  createMenuItem("Kerapu Goreng", "Kerapu goreng dengan pilihan asam manis atau saus padang", 18000, "Makanan", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Kerapu Bakar", "Kerapu bakar dengan pilihan asam manis atau saus padang", 18000, "Makanan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Kakap Merah Goreng", "Kakap merah goreng dengan pilihan asam manis atau saus padang", 18000, "Makanan", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Kakap Merah Bakar", "Kakap merah bakar dengan pilihan asam manis atau saus padang", 18000, "Makanan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Bawal Laut Goreng", "Bawal laut goreng dengan pilihan asam manis atau saus padang", 18000, "Makanan", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Bawal Laut Bakar", "Bawal laut bakar dengan pilihan asam manis atau saus padang", 18000, "Makanan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Iga Bakar", "Daging iga bakar dengan sambal dan lalapan", 45000, "Makanan", ["Halal", "Grilled"], true, false, "25-30 menit"),
  createMenuItem("Sop Iga", "Daging iga dengan wortel, tomat dan sayur sup lainnya", 47000, "Makanan", ["Halal", "Soup"], false, false, "20-25 menit"),
  
  // ADDITIONAL ITEM
  createMenuItem("Sambal Bawang", "Sambal bawang pedas", 5000, "Additional Item", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Sambal Terasi", "Sambal terasi pedas", 5000, "Additional Item", ["Halal", "Spicy"], false, true, "2-3 menit"),
  createMenuItem("Sambal Kecap", "Sambal kecap manis", 3000, "Additional Item", ["Halal", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Nasi Putih", "Nasi putih hangat", 5000, "Additional Item", ["Halal", "Traditional"], false, false, "2-3 menit"),
  createMenuItem("Pakan Ikan", "Pakan ikan untuk kolam", 1000, "Additional Item", ["Halal", "Special"], false, false, "1 menit"),
  
  // JUS BUAH
  createMenuItem("Jus Alpukat", "Jus alpukat segar", 13000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Mangga", "Jus mangga segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Strawberry", "Jus strawberry segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Nanas", "Jus nanas segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Melon", "Jus melon segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Tomat", "Jus tomat segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Jambu", "Jus jambu segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Jeruk", "Jus jeruk segar", 11000, "Jus Buah", ["Halal", "Fresh"], false, false, "3-5 menit"),
  
  // MINUMAN
  createMenuItem("Kopi Hitam", "Kopi hitam hangat", 5000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Kopi Hitam Es", "Kopi hitam dingin", 8000, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Kopi Susu", "Kopi susu hangat", 8000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Es Kopi Susu", "Kopi susu dingin", 12000, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Wedang Jahe", "Wedang jahe hangat", 8000, "Minuman", ["Halal", "Hot", "Herbal"], false, false, "5-8 menit"),
  createMenuItem("Jahe Susu", "Jahe susu hangat", 10000, "Minuman", ["Halal", "Hot", "Herbal"], false, false, "5-8 menit"),
  createMenuItem("Susu Putih", "Susu putih hangat", 8000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Susu Coklat", "Susu coklat hangat", 8000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Soda Gembira", "Soda gembira segar", 15000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Wedang Uwuh", "Wedang uwuh hangat", 12000, "Minuman", ["Halal", "Hot", "Herbal"], false, false, "5-8 menit"),
  createMenuItem("Beras Kencur", "Beras kencur hangat", 8000, "Minuman", ["Halal", "Hot", "Herbal"], false, false, "5-8 menit"),
  createMenuItem("Kunir Asem", "Kunir asem hangat", 8000, "Minuman", ["Halal", "Hot", "Herbal"], false, false, "5-8 menit"),
  createMenuItem("Lemon Tea Es", "Lemon tea dingin", 8000, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Lemon Tea Hangat", "Lemon tea hangat", 8000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Teh Manis Es", "Teh manis dingin", 5000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Teh Manis Hangat", "Teh manis hangat", 5000, "Minuman", ["Halal", "Hot", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Teh Tawar Es", "Teh tawar dingin", 2000, "Minuman", ["Halal", "Cold"], false, false, "2-3 menit"),
  createMenuItem("Teh Tawar Hangat", "Teh tawar hangat", 2000, "Minuman", ["Halal", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Jeruk Es", "Jeruk dingin", 7000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Hangat", "Jeruk hangat", 7000, "Minuman", ["Halal", "Hot", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Nipis Es", "Jeruk nipis dingin", 7000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Nipis Hangat", "Jeruk nipis hangat", 7000, "Minuman", ["Halal", "Hot", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Air Mineral 600ml", "Air mineral 600ml", 4000, "Minuman", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Kelapa Muda Murni", "Kelapa muda murni segar", 10000, "Minuman", ["Halal", "Fresh"], false, false, "2-3 menit"),
  createMenuItem("Kelapa Muda Gula", "Kelapa muda dengan gula", 15000, "Minuman", ["Halal", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Milo Es", "Milo dingin", 10000, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Milo Hangat", "Milo hangat", 10000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Coklat Es", "Coklat dingin", 10000, "Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Coklat Hangat", "Coklat hangat", 10000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Cappucino Es", "Cappucino dingin", 12000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Cappucino Hangat", "Cappucino hangat", 10000, "Minuman", ["Halal", "Hot"], false, false, "5-8 menit"),
  
  // NASI & MIE
  createMenuItem("Nasi Goreng Ayam", "Nasi goreng dengan ayam", 25000, "Nasi & Mie", ["Halal", "Traditional"], true, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Kencur", "Nasi goreng dengan kencur", 23000, "Nasi & Mie", ["Halal", "Herbal"], false, false, "10-15 menit"),
  createMenuItem("Mie Goreng", "Mie goreng tradisional", 23000, "Nasi & Mie", ["Halal", "Traditional"], false, false, "10-15 menit"),
  
  // MENU SAYUR
  createMenuItem("Karedok", "Karedok sayuran segar", 13000, "Menu Sayur", ["Halal", "Fresh", "Raw"], false, false, "5-8 menit"),
  createMenuItem("Tauge Polos", "Tauge polos", 13000, "Menu Sayur", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Tauge Pedas", "Tauge pedas", 13000, "Menu Sayur", ["Halal", "Fresh", "Spicy"], false, true, "5-8 menit"),
  createMenuItem("Cah Kangkung Polos", "Cah kangkung polos", 13000, "Menu Sayur", ["Halal", "Fresh"], false, false, "8-12 menit"),
  createMenuItem("Cah Kangkung Pedas", "Cah kangkung pedas", 13000, "Menu Sayur", ["Halal", "Fresh", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Gado-gado", "Gado-gado lengkap", 15000, "Menu Sayur", ["Halal", "Mixed"], true, false, "10-15 menit"),
  createMenuItem("Genjer", "Genjer segar", 13000, "Menu Sayur", ["Halal", "Fresh"], false, false, "8-12 menit"),
  createMenuItem("Kluban", "Kluban segar", 13000, "Menu Sayur", ["Halal", "Fresh"], false, false, "5-8 menit"),
  
  // CAMILAN
  createMenuItem("Kentang Goreng", "Kentang goreng renyah", 15000, "Cemilan", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Otak-otak Goreng", "Otak-otak goreng", 15000, "Cemilan", ["Halal", "Seafood"], false, false, "8-12 menit"),
  createMenuItem("Tahu Bakso Goreng", "Tahu bakso goreng", 15000, "Cemilan", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Mendoan", "Mendoan tempe", 12000, "Cemilan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Siomay Goreng", "Siomay goreng", 15000, "Cemilan", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Ranjem", "Ranjem goreng", 10000, "Cemilan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Tempe Goreng", "Tempe goreng", 8000, "Cemilan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Dage Goreng", "Dage goreng", 10000, "Cemilan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Pisang Goreng", "Pisang goreng", 12000, "Cemilan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  
  // AYAM/BEBEK
  createMenuItem("Ayam Kampung Sedang Goreng", "Ayam kampung sedang goreng", 27000, "Ayam/Bebek", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Kampung Sedang Bakar", "Ayam kampung sedang bakar", 27000, "Ayam/Bebek", ["Halal", "Grilled"], false, false, "20-25 menit"),
  createMenuItem("Ayam Kampung Besar Goreng", "Ayam kampung besar goreng", 30000, "Ayam/Bebek", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Kampung Besar Bakar", "Ayam kampung besar bakar", 30000, "Ayam/Bebek", ["Halal", "Grilled"], false, false, "20-25 menit"),
  createMenuItem("Ingkung Ayam Kampung Sedang Goreng", "Ingkung ayam kampung sedang goreng", 110000, "Ayam/Bebek", ["Halal", "Traditional"], true, false, "25-30 menit"),
  createMenuItem("Ingkung Ayam Kampung Sedang Bakar", "Ingkung ayam kampung sedang bakar", 110000, "Ayam/Bebek", ["Halal", "Grilled"], true, false, "30-35 menit"),
  createMenuItem("Ingkung Ayam Kampung Besar Goreng", "Ingkung ayam kampung besar goreng", 120000, "Ayam/Bebek", ["Halal", "Traditional"], true, false, "25-30 menit"),
  createMenuItem("Ingkung Ayam Kampung Besar Bakar", "Ingkung ayam kampung besar bakar", 120000, "Ayam/Bebek", ["Halal", "Grilled"], true, false, "30-35 menit"),
  createMenuItem("Ayam Potong Goreng", "Ayam potong goreng", 15000, "Ayam/Bebek", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Potong Bakar", "Ayam potong bakar", 15000, "Ayam/Bebek", ["Halal", "Grilled"], false, false, "20-25 menit"),
  createMenuItem("Ingkung Ayam Potong Goreng", "Ingkung ayam potong goreng", 60000, "Ayam/Bebek", ["Halal", "Traditional"], false, false, "25-30 menit"),
  createMenuItem("Ingkung Ayam Potong Bakar", "Ingkung ayam potong bakar", 60000, "Ayam/Bebek", ["Halal", "Grilled"], false, false, "30-35 menit"),
  createMenuItem("Bebek Goreng", "Bebek goreng", 27000, "Ayam/Bebek", ["Halal", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Bebek Bakar", "Bebek bakar", 27000, "Ayam/Bebek", ["Halal", "Grilled"], false, false, "25-30 menit"),
  createMenuItem("Ati Ampela Ayam Kampung", "Ati ampela ayam kampung", 7000, "Ayam/Bebek", ["Halal", "Traditional"], false, false, "10-15 menit")
];

// Add saung tepi sawah menus to database
console.log(`Adding ${saungTepiSawahMenus.length} menu items for Saung Tepi Sawah...`);

// Add each menu item
saungTepiSawahMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${saungTepiSawahMenus.length} menu items for Saung Tepi Sawah!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = saungTepiSawahMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = saungTepiSawahMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);
