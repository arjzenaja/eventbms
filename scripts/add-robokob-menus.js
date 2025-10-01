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
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "5-10 menit") {
  return {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "1", // Assuming robokob is destination ID 1
    destinationSlug: "robokob",
    destinationTitle: "Robokob",
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

// Robokob Menu Items
const robokobMenus = [
  // MINUMAN
  createMenuItem("TEH", "Teh hangat segar", 5000, "Minuman", ["Hot", "Traditional"], false, false, "2-3 menit"),
  createMenuItem("MILK TEA", "Teh susu manis", 12000, "Minuman", ["Cold", "Sweet"], true, false, "3-5 menit"),
  createMenuItem("LECI TEA", "Teh leci segar", 12000, "Minuman", ["Cold", "Fresh"], true, false, "3-5 menit"),
  createMenuItem("LEMON TEA", "Teh lemon segar", 8000, "Minuman", ["Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("SUSU NAGA", "Susu naga merah", 8000, "Minuman", ["Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("JAHE SUSU", "Susu jahe hangat", 10000, "Minuman", ["Hot", "Traditional"], false, false, "5-7 menit"),
  createMenuItem("MINERAL", "Air mineral", 5000, "Minuman", ["Cold", "Fresh"], false, false, "1 menit"),
  
  // KOPI & MINUMAN KHUSUS
  createMenuItem("ES KOPI HITAM", "Kopi hitam dingin", 10000, "Kopi", ["Cold", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("ES KOPI SUSU", "Kopi susu dingin", 10000, "Kopi", ["Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("BADAK", "Minuman spesial Badak", 10000, "Minuman", ["Cold", "Signature"], true, false, "5-7 menit"),
  createMenuItem("JOSU", "Minuman spesial Josu", 10000, "Minuman", ["Cold", "Signature"], true, false, "5-7 menit"),
  createMenuItem("COLA SUSU", "Cola dengan susu", 12000, "Minuman", ["Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("MILO", "Minuman Milo", 15000, "Minuman", ["Hot", "Sweet"], false, false, "3-5 menit"),
  
  // SNACKS & SIDES
  createMenuItem("SELERAKU", "Snack Selera", 15000, "Makanan Ringan", ["Crispy", "Local"], false, false, "5-10 menit"),
  createMenuItem("OMELET", "Telur dadar", 12000, "Makanan Ringan", ["Hot", "Fresh"], false, false, "5-7 menit"),
  createMenuItem("KERUPUK", "Kerupuk goreng", 1000, "Makanan Ringan", ["Crispy", "Traditional"], false, false, "2-3 menit"),
  createMenuItem("ROTI PANGGANG BY YOSHIS", "Roti panggang spesial", 6000, "Makanan Ringan", ["Hot", "Fresh"], false, false, "5-7 menit"),
  createMenuItem("UBI MOJA BY UBI IBE", "Ubi moja spesial", 10000, "Makanan Ringan", ["Hot", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("SUSAH NAMANYA BY SAWALA", "Cranberry Cream Cheese Bread", 20000, "Makanan Ringan", ["Sweet", "Premium"], true, false, "10-15 menit"),
  
  // MAKANAN UTAMA - NASI
  createMenuItem("NASI SARDEN", "Nasi dengan sarden", 20000, "Makanan Utama", ["Hot", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("NASI OMELET", "Nasi dengan telur dadar", 15000, "Makanan Utama", ["Hot", "Fresh"], false, false, "8-12 menit"),
  createMenuItem("NASI TELOR", "Nasi dengan telur", 15000, "Makanan Utama", ["Hot", "Fresh"], false, false, "8-12 menit"),
  createMenuItem("NASI ABON", "Nasi dengan abon", 20000, "Makanan Utama", ["Hot", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("NASI USUS", "Nasi dengan usus", 15000, "Makanan Utama", ["Hot", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("NASI GILA", "Nasi gila spesial", 15000, "Makanan Utama", ["Hot", "Spicy"], true, true, "12-18 menit"),
  createMenuItem("NASI KULIT", "Nasi dengan kulit", 20000, "Makanan Utama", ["Hot", "Traditional"], false, false, "10-15 menit")
];

// Add robokob menus to database
console.log(`Adding ${robokobMenus.length} menu items for Robokob...`);

// Add each menu item
robokobMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${robokobMenus.length} menu items for Robokob!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = robokobMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});
