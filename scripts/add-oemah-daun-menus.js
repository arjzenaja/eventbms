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
    destinationId: "21", // Oemah Daun destination ID
    destinationSlug: "https://linktr.ee/oemahdaun?utm_source=linktree_profile_share&ltsid=7403431c-4a90-444d-b2c3-f7d83b98718c",
    destinationTitle: "Oemah Daun",
    rating: 4.3,
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

// Oemah Daun Menu Items
const oemahDaunMenus = [
  // MENU MINUMAN
  createMenuItem("Mineral Gelas", "Air mineral dalam gelas", 3000, "Menu Minuman", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Es Cream Cup Brazil", "Es cream cup Brazil", 10000, "Menu Minuman", ["Halal", "Cold", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Es Cream Stik Aice", "Es cream stik Aice", 10000, "Menu Minuman", ["Halal", "Cold", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Es Greendong", "Es greendong segar", 12500, "Menu Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Buah Dingin", "Buah dingin segar", 12500, "Menu Minuman", ["Halal", "Cold", "Fresh"], false, false, "2-3 menit"),
  createMenuItem("Dawet Banjar", "Dawet banjar tradisional", 12500, "Menu Minuman", ["Halal", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Dawet Ireng", "Dawet ireng tradisional", 12500, "Menu Minuman", ["Halal", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Es Jeruk Kelapa Selasih", "Es jeruk kelapa selasih", 12500, "Menu Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Matcha Ice", "Matcha ice segar", 12500, "Menu Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Thai Tea Ice", "Thai tea ice segar", 12500, "Menu Minuman", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Choco Hazelnut Ice", "Choco hazelnut ice", 12500, "Menu Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Kopi Gula Aren", "Es kopi gula aren", 12500, "Menu Minuman", ["Halal", "Cold", "Coffee"], false, false, "3-5 menit"),
  
  // COFFEE BREAK
  createMenuItem("Coffee Break Paket 25K", "Paket coffee break 25K (3 jenis + kopi + teh)", 25000, "Coffee Break", ["Halal", "Package"], true, false, "10-15 menit"),
  createMenuItem("Coffee Break Paket 20K", "Paket coffee break 20K (2 jenis + kopi + teh)", 20000, "Coffee Break", ["Halal", "Package"], false, false, "10-15 menit"),
  
  // ANEKA AYAM
  createMenuItem("Ayam Kuluke", "Ayam kuluke", 59500, "Aneka Ayam", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Dua Rasa", "Ayam dua rasa", 59500, "Aneka Ayam", ["Halal", "Mixed"], false, false, "15-20 menit"),
  createMenuItem("Ayam Saos Pedas", "Ayam saos pedas", 59500, "Aneka Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Lada Hitam", "Ayam lada hitam", 59500, "Aneka Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Saos Mentega", "Ayam saos mentega", 59500, "Aneka Ayam", ["Halal"], false, false, "15-20 menit"),
  createMenuItem("Ayam Saos Padang", "Ayam saos padang", 59500, "Aneka Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Saos Tomat", "Ayam saos tomat", 59500, "Aneka Ayam", ["Halal"], false, false, "15-20 menit"),
  createMenuItem("Ayam Rica-rica", "Ayam rica-rica", 59500, "Aneka Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Panggang BBQ", "Ayam panggang BBQ", 59500, "Aneka Ayam", ["Halal", "Grilled"], false, false, "20-25 menit"),
  createMenuItem("Ayam Cabe Ijo", "Ayam cabe ijo", 59500, "Aneka Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Telor Asin", "Ayam telor asin", 59500, "Aneka Ayam", ["Halal"], false, false, "15-20 menit"),
  createMenuItem("Ayam Garlic", "Ayam garlic", 59500, "Aneka Ayam", ["Halal", "Garlic"], false, false, "15-20 menit"),
  createMenuItem("Ayam Teriyaki", "Ayam teriyaki", 59500, "Aneka Ayam", ["Halal", "Japanese"], false, false, "15-20 menit"),
  createMenuItem("Ayam Goreng Kampung", "Ayam goreng kampung", 32500, "Aneka Ayam", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Penyet Kampung", "Ayam penyet kampung", 32500, "Aneka Ayam", ["Halal", "Traditional"], false, false, "15-20 menit"),
  
  // ANEKA SOP
  createMenuItem("Sop Bakso Ayam", "Sop bakso ayam", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Soup Tofu Ayam", "Soup tofu ayam", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Pancawarna", "Sop pancawarna", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Jagung Ayam", "Sop jagung ayam", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Bakso Kuah", "Sop bakso kuah", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Iga", "Sop iga", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "20-25 menit"),
  createMenuItem("Sop Sosis", "Sop sosis", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Ayam", "Sop ayam", 58500, "Aneka Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  
  // ANEKA UDANG
  createMenuItem("Udang Goreng Tepung", "Udang goreng tepung", 75000, "Aneka Udang", ["Halal", "Seafood", "Crispy"], false, false, "15-20 menit"),
  createMenuItem("Udang Tepung Mayonais", "Udang tepung mayonais", 75000, "Aneka Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Saos Lada Hitam", "Udang saos lada hitam", 75000, "Aneka Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Saos Pedas", "Udang saos pedas", 75000, "Aneka Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Saos Padang", "Udang saos padang", 75000, "Aneka Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Rica-rica", "Udang rica-rica", 75000, "Aneka Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Telor Asin", "Udang telor asin", 75000, "Aneka Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  
  // ANEKA SAYURAN
  createMenuItem("Tumis Ca Kangkung Ayam", "Tumis ca kangkung ayam", 39000, "Aneka Sayuran", ["Halal", "Fresh"], false, false, "8-12 menit"),
  createMenuItem("Tumis/Ca Kangkung Teri", "Tumis/ca kangkung teri", 39000, "Aneka Sayuran", ["Halal", "Fresh"], false, false, "8-12 menit"),
  createMenuItem("Brokoli Ca Bawang Putih", "Brokoli ca bawang putih", 52500, "Aneka Sayuran", ["Halal", "Garlic"], false, false, "8-12 menit"),
  createMenuItem("Brokoli Ca Jamur", "Brokoli ca jamur", 52500, "Aneka Sayuran", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Brokoli Ca Ayam", "Brokoli ca ayam", 57500, "Aneka Sayuran", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Buncis Ayam", "Buncis ayam", 50000, "Aneka Sayuran", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Brokoli Ca Sapi", "Brokoli ca sapi", 57500, "Aneka Sayuran", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Cap Cay Goreng", "Cap cay goreng", 55000, "Aneka Sayuran", ["Halal", "Mixed"], false, false, "10-15 menit"),
  createMenuItem("Cap Cay Kuah", "Cap cay kuah", 55000, "Aneka Sayuran", ["Halal", "Mixed", "Soup"], false, false, "10-15 menit"),
  createMenuItem("Pokcoy Bawang Putih", "Pokcoy bawang putih", 47500, "Aneka Sayuran", ["Halal", "Garlic"], false, false, "8-12 menit"),
  createMenuItem("Pokcoy Ca Ayam", "Pokcoy ca ayam", 55000, "Aneka Sayuran", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Pokcoy Telor Asin", "Pokcoy telor asin", 55000, "Aneka Sayuran", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Putren Cabe Ijo", "Putren cabe ijo", 45000, "Aneka Sayuran", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Omelet", "Omelet", 35000, "Aneka Sayuran", ["Halal", "Egg"], false, false, "5-8 menit"),
  createMenuItem("Fuyunghay", "Fuyunghay", 59500, "Aneka Sayuran", ["Halal", "Egg"], false, false, "10-15 menit"),
  createMenuItem("Sapo Tahu", "Sapo tahu", 59500, "Aneka Sayuran", ["Halal"], false, false, "10-15 menit"),
  
  // GURAMEH
  createMenuItem("Gurameh Goreng", "Gurameh goreng", 120000, "Gurameh", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurameh Asam Manis", "Gurameh asam manis", 120000, "Gurameh", ["Halal", "Seafood", "Sweet"], false, false, "20-25 menit"),
  createMenuItem("Gurameh Dua Rasa", "Gurameh dua rasa", 120000, "Gurameh", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurameh Cabe Ijo", "Gurameh cabe ijo", 120000, "Gurameh", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurameh Saos Pedas", "Gurameh saos pedas", 120000, "Gurameh", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurameh Saos Padang", "Gurameh saos padang", 120000, "Gurameh", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurameh Rica-rica", "Gurameh rica-rica", 120000, "Gurameh", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurameh Telor Asin", "Gurameh telor asin", 120000, "Gurameh", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurameh Saos Thailand", "Gurameh saos thailand", 120000, "Gurameh", ["Halal", "Seafood", "Thai"], false, false, "20-25 menit"),
  
  // SAPI
  createMenuItem("Sapi Cabe Ijo", "Sapi cabe ijo", 75000, "Sapi", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sapi Teriyaki", "Sapi teriyaki", 75000, "Sapi", ["Halal", "Japanese"], false, false, "15-20 menit"),
  createMenuItem("Sapi Lada Hitam", "Sapi lada hitam", 75000, "Sapi", ["Halal", "Spicy"], false, true, "15-20 menit"),
  
  // CUMI
  createMenuItem("Cumi Goreng Tepung", "Cumi goreng tepung", 66000, "Cumi", ["Halal", "Seafood", "Crispy"], false, false, "15-20 menit"),
  createMenuItem("Cumi Kuluke", "Cumi kuluke", 66000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Cumi Tepung Mayonais", "Cumi tepung mayonais", 66000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Cumi Saos Lada Hitam", "Cumi saos lada hitam", 66000, "Cumi", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Cumi Telor Asin", "Cumi telor asin", 66000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Cumi Saos Pedas", "Cumi saos pedas", 66000, "Cumi", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  
  // MENU BUFFE
  createMenuItem("Menu Buffe 45K", "Paket buffe 45K per orang", 45000, "Menu Buffe", ["Halal", "Package"], false, false, "20-30 menit"),
  createMenuItem("Menu Buffe 50K", "Paket buffe 50K per orang", 50000, "Menu Buffe", ["Halal", "Package"], false, false, "20-30 menit"),
  createMenuItem("Menu Buffe 55K", "Paket buffe 55K per orang", 55000, "Menu Buffe", ["Halal", "Package"], false, false, "20-30 menit"),
  createMenuItem("Menu Buffe 65K", "Paket buffe 65K per orang", 65000, "Menu Buffe", ["Halal", "Package"], false, false, "20-30 menit"),
  createMenuItem("Menu Buffe 75K", "Paket buffe 75K per orang", 75000, "Menu Buffe", ["Halal", "Package"], false, false, "20-30 menit"),
  createMenuItem("Menu Buffe 85K", "Paket buffe 85K per orang", 85000, "Menu Buffe", ["Halal", "Package"], true, false, "20-30 menit")
];

// Add oemah daun menus to database
console.log(`Adding ${oemahDaunMenus.length} menu items for Oemah Daun...`);

// Add each menu item
oemahDaunMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${oemahDaunMenus.length} menu items for Oemah Daun!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = oemahDaunMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = oemahDaunMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);
