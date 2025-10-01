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
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "10-25 menit") {
  return {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "25", // Waroeng Steak destination ID
    destinationSlug: "https://linktr.ee/waroengsteak?utm_source=linktree_profile_share&ltsid=95f88986-4379-4ea6-ab3e-f51c23fe98e4",
    destinationTitle: "Waroeng Steak",
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

// Waroeng Steak Menu Items
const waroengSteakMenus = [
  // CRISPY STEAK
  createMenuItem("Chicken Crispy Steak", "Chicken crispy steak", 24545, "Crispy Steak", ["Halal", "Crispy", "Chicken"], false, false, "15-20 menit"),
  createMenuItem("Chicken Double Crispy Steak", "Chicken double crispy steak", 31818, "Crispy Steak", ["Halal", "Crispy", "Chicken", "Double"], false, false, "20-25 menit"),
  createMenuItem("Sirloin Crispy Steak", "Sirloin crispy steak", 24545, "Crispy Steak", ["Halal", "Crispy", "Beef"], false, false, "15-20 menit"),
  createMenuItem("Sirloin Double Crispy Steak", "Sirloin double crispy steak", 31818, "Crispy Steak", ["Halal", "Crispy", "Beef", "Double"], false, false, "20-25 menit"),

  // ORIGINAL GRILL STEAK
  createMenuItem("Chicken Mushroom Steak", "Chicken mushroom steak", 24545, "Original Grill Steak", ["Halal", "Grilled", "Chicken", "Mushroom"], false, false, "15-20 menit"),
  createMenuItem("Chicken Pepper Steak", "Chicken pepper steak", 24545, "Original Grill Steak", ["Halal", "Grilled", "Chicken", "Pepper"], false, false, "15-20 menit"),
  createMenuItem("Beef Steak", "Beef steak", 33636, "Original Grill Steak", ["Halal", "Grilled", "Beef"], false, false, "15-20 menit"),
  createMenuItem("Black Pepper Steak", "Black pepper steak", 33636, "Original Grill Steak", ["Halal", "Grilled", "Beef", "Pepper"], false, false, "15-20 menit"),
  createMenuItem("Sirloin New Zealand", "Sirloin New Zealand", 75000, "Original Grill Steak", ["Halal", "Grilled", "Beef", "Premium"], true, false, "20-25 menit"),
  createMenuItem("Rib-Eye New Zealand", "Rib-eye New Zealand", 85000, "Original Grill Steak", ["Halal", "Grilled", "Beef", "Premium"], true, false, "20-25 menit"),

  // STEAK IKAN
  createMenuItem("Steak Kakap", "Steak kakap", 20909, "Steak Ikan", ["Halal", "Grilled", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Steak Cumi", "Steak cumi", 20909, "Steak Ikan", ["Halal", "Grilled", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Steak Tuna", "Steak tuna", 46818, "Steak Ikan", ["Halal", "Grilled", "Seafood", "Premium"], false, false, "15-20 menit"),

  // NASI PAPRIKA
  createMenuItem("Nasi Paprika Ayam", "Nasi paprika ayam", 15455, "Nasi Paprika", ["Halal", "Rice", "Chicken"], false, false, "10-15 menit"),
  createMenuItem("Nasi Paprika Sapi", "Nasi paprika sapi", 18182, "Nasi Paprika", ["Halal", "Rice", "Beef"], false, false, "10-15 menit"),

  // CHICKEN DRUMSTICK
  createMenuItem("Chicken Drumstick", "Chicken drumstick", 16364, "Chicken Drumstick", ["Halal", "Fried", "Chicken"], false, false, "10-15 menit"),

  // ADDITIONAL MENU ITEMS (from the image)
  createMenuItem("Cordon Bleu", "Cordon bleu", 24545, "Additional Menu", ["Halal", "Fried", "Chicken"], false, false, "15-20 menit"),
  createMenuItem("Spaghetti", "Spaghetti", 12273, "Additional Menu", ["Halal", "Pasta"], false, false, "10-15 menit"),

  // SIDE DISHES
  createMenuItem("French Fries", "French fries", 10000, "Side Dishes", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Kentang Lokal", "Kentang lokal", 7273, "Side Dishes", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Brown Sauce", "Brown sauce", 6364, "Side Dishes", ["Halal", "Sauce"], false, false, "2-3 menit"),
  createMenuItem("Mix Vegetable", "Mix vegetable", 5909, "Side Dishes", ["Halal", "Vegetable"], false, false, "5-8 menit"),
  createMenuItem("Nasi Putih", "Nasi putih", 5909, "Side Dishes", ["Halal", "Rice"], false, false, "2-3 menit"),
  createMenuItem("Mushroom", "Mushroom", 5455, "Side Dishes", ["Halal", "Vegetable"], false, false, "5-8 menit")
];

// Add waroeng steak menus to database
console.log(`Adding ${waroengSteakMenus.length} menu items for Waroeng Steak...`);

// Add each menu item
waroengSteakMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${waroengSteakMenus.length} menu items for Waroeng Steak!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = waroengSteakMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = waroengSteakMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);

// Popular items summary
const popularItems = waroengSteakMenus.filter(menu => menu.isPopular);
console.log(`\n⭐ Popular Items: ${popularItems.length} items`);
popularItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Premium items summary
const premiumItems = waroengSteakMenus.filter(menu => menu.additionalInfo.includes("Premium"));
console.log(`\n💎 Premium Items: ${premiumItems.length} items`);
premiumItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category}) - Rp ${item.price.toLocaleString()}`);
});

// Steak types summary
const steakTypes = waroengSteakMenus.filter(menu => 
  menu.category.includes("Steak") || 
  menu.name.toLowerCase().includes("steak")
);
console.log(`\n🥩 Steak Items: ${steakTypes.length} items`);
steakTypes.forEach(item => {
  console.log(`  - ${item.name} (${item.category}) - Rp ${item.price.toLocaleString()}`);
});
