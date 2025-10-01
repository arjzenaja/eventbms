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
    destinationId: "22", // Massapi destination ID
    destinationSlug: "https://linktr.ee/massapicafe?utm_source=linktree_profile_share&ltsid=4f5ac697-e2ba-4b6d-a896-74ebf12b58b6",
    destinationTitle: "Massapi",
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

// Massapi Menu Items
const massapiMenus = [
  // DESSERT
  createMenuItem("Banana Berry Split", "Banana split dengan beragam buah berry", 30000, "Dessert", ["Halal", "Sweet", "Fresh"], false, false, "5-10 menit"),
  createMenuItem("Banana Split", "Banana split klasik dengan es krim", 30000, "Dessert", ["Halal", "Sweet", "Classic"], false, false, "5-10 menit"),
  createMenuItem("Fruit Salad", "Salad buah segar", 30000, "Dessert", ["Halal", "Fresh", "Healthy"], false, false, "3-5 menit"),
  createMenuItem("Ice Cream Coklat", "Es krim coklat", 25000, "Dessert", ["Halal", "Sweet", "Cold"], false, false, "2-3 menit"),
  createMenuItem("Ice Cream Mix", "Es krim campuran", 25000, "Dessert", ["Halal", "Sweet", "Cold"], false, false, "2-3 menit"),
  createMenuItem("Ice Cream Strawberry", "Es krim strawberry", 25000, "Dessert", ["Halal", "Sweet", "Cold"], false, false, "2-3 menit"),

  // ADD ONS MENU
  createMenuItem("Air Mineral", "Air mineral", 10000, "Add Ons Menu", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Nasi", "Nasi putih", 5000, "Add Ons Menu", ["Halal", "Staple"], false, false, "2-3 menit"),
  createMenuItem("Telur Ceplok", "Telur ceplok", 5000, "Add Ons Menu", ["Halal", "Egg"], false, false, "3-5 menit"),

  // SNACKS
  createMenuItem("Dumpling Chicken", "Dumpling ayam", 15000, "Snacks", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Fish Roll", "Roll ikan", 15000, "Snacks", ["Halal", "Seafood"], false, false, "8-12 menit"),
  createMenuItem("French Fries", "Kentang goreng", 15000, "Snacks", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Mendoan", "Tempe mendoan", 10000, "Snacks", ["Halal", "Traditional"], true, false, "5-8 menit"),
  createMenuItem("Mix Platter", "Platter campuran", 55000, "Snacks", ["Halal", "Mixed"], true, false, "10-15 menit"),
  createMenuItem("Onion Ring", "Ring bawang", 20000, "Snacks", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Pisang Bakar Coklat", "Pisang bakar coklat", 25000, "Snacks", ["Halal", "Sweet"], false, false, "8-12 menit"),
  createMenuItem("Pisang Bakar Coklat Keju", "Pisang bakar coklat keju", 25000, "Snacks", ["Halal", "Sweet"], false, false, "8-12 menit"),
  createMenuItem("Pisang Bakar Keju", "Pisang bakar keju", 25000, "Snacks", ["Halal", "Sweet"], false, false, "8-12 menit"),
  createMenuItem("Pisang Goreng", "Pisang goreng", 15000, "Snacks", ["Halal", "Traditional"], true, false, "5-8 menit"),
  createMenuItem("Potato Wedges", "Potato wedges", 20000, "Snacks", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Sosis Bakar", "Sosis bakar", 30000, "Snacks", ["Halal", "Grilled"], false, false, "8-12 menit"),

  // BREAD
  createMenuItem("Burger", "Burger", 25000, "Bread", ["Halal", "Western"], false, false, "10-15 menit"),
  createMenuItem("Lotus Toast", "Lotus toast", 27000, "Bread", ["Halal", "Sweet"], true, false, "5-8 menit"),
  createMenuItem("Roti Bakar", "Roti bakar", 25000, "Bread", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Toast Beef", "Toast beef", 27000, "Bread", ["Halal", "Meat"], false, false, "8-12 menit"),
  createMenuItem("Toast Egg", "Toast egg", 20000, "Bread", ["Halal", "Egg"], false, false, "5-8 menit"),
  createMenuItem("Toast Sosis", "Toast sosis", 23000, "Bread", ["Halal", "Meat"], false, false, "8-12 menit"),

  // COFFEE
  createMenuItem("Arabica Coffee", "Kopi arabica", 20000, "Coffee", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Avocado Coffee Ice", "Kopi alpukat es", 25000, "Coffee", ["Halal", "Cold", "New"], false, false, "5-8 menit"),
  createMenuItem("Kosu Arabica", "Kosu arabica", 25000, "Coffee", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Kosu Robusta", "Kosu robusta", 20000, "Coffee", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Robusta Coffee", "Kopi robusta", 15000, "Coffee", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Strawberry Coffee Ice", "Kopi strawberry es", 25000, "Coffee", ["Halal", "Cold", "New"], false, false, "5-8 menit"),

  // NON COFFEE
  createMenuItem("Hot Chocolate", "Coklat panas", 20000, "Non Coffee", ["Halal", "Hot", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Hot Greentea", "Teh hijau panas", 20000, "Non Coffee", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Lemon Uwuh", "Lemon uwuh", 20000, "Non Coffee", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Susu Jahe", "Susu jahe", 20000, "Non Coffee", ["Halal", "Hot", "Traditional"], true, false, "3-5 menit"),
  createMenuItem("Susu Murni", "Susu murni", 15000, "Non Coffee", ["Halal", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Wedhang Jahe", "Wedhang jahe", 12000, "Non Coffee", ["Halal", "Hot", "Traditional"], false, false, "3-5 menit"),
  createMenuItem("Wedhang Uwuh", "Wedhang uwuh", 15000, "Non Coffee", ["Halal", "Hot", "Traditional"], false, false, "3-5 menit"),

  // TEA
  createMenuItem("Jasmine Tea", "Teh melati", 15000, "Tea", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Lemon Tea", "Teh lemon", 15000, "Tea", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Lychee Tea", "Teh lychee", 20000, "Tea", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Peach Tea", "Teh peach", 20000, "Tea", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Reguler Tea", "Teh reguler", 15000, "Tea", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Strawberry Tea", "Teh strawberry", 20000, "Tea", ["Halal", "Cold"], false, false, "3-5 menit"),

  // MILKSHAKE
  createMenuItem("Milkshake Banana", "Milkshake pisang", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Choco Banana", "Milkshake coklat pisang", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], true, false, "5-8 menit"),
  createMenuItem("Milkshake Choco Berry", "Milkshake coklat berry", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Chocolate", "Milkshake coklat", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Matcha", "Milkshake matcha", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Oreo", "Milkshake oreo", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Red Velvet", "Milkshake red velvet", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Regal Banana", "Milkshake regal pisang", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], true, false, "5-8 menit"),
  createMenuItem("Milkshake Strawberry", "Milkshake strawberry", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Vanilla Caramel", "Milkshake vanilla caramel", 25000, "Milkshake", ["Halal", "Cold", "Sweet"], true, false, "5-8 menit"),
  createMenuItem("Milkshake Vanilla", "Milkshake vanilla", 20000, "Milkshake", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),

  // FRAPPE
  createMenuItem("Choco Cookies Frappe", "Choco cookies frappe", 28000, "Frappe", ["Halal", "Cold", "Sweet"], true, false, "5-8 menit"),
  createMenuItem("Choco Regal Frappe", "Choco regal frappe", 28000, "Frappe", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Lotus Biscoff Frappe", "Lotus biscoff frappe", 30000, "Frappe", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),

  // JUICE
  createMenuItem("Avocado", "Jus alpukat", 20000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Avocado Choco Ice", "Jus alpukat coklat es", 25000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Mango", "Jus mangga", 20000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Orange", "Jus jeruk", 20000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Strawberry", "Jus strawberry", 20000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Sunkist Juice", "Jus sunkist", 20000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Sunkist Mango", "Jus sunkist mangga", 20000, "Juice", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),

  // SMOOTHIE
  createMenuItem("Banana Avocado", "Smoothie pisang alpukat", 25000, "Smoothie", ["Halal", "Cold", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Mango", "Smoothie mangga", 25000, "Smoothie", ["Halal", "Cold", "Fresh"], true, false, "5-8 menit"),

  // YUJU
  createMenuItem("Yuju Red Berry", "Yuju red berry", 22000, "Yuju", ["Halal", "Cold", "Fresh"], true, false, "5-8 menit"),

  // YOGURT
  createMenuItem("Love in Berry", "Yogurt love in berry", 25000, "Yogurt", ["Halal", "Cold", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Tropical Mix", "Yogurt tropical mix", 25000, "Yogurt", ["Halal", "Cold", "Fresh"], true, false, "5-8 menit"),
  createMenuItem("Tropical Pink", "Yogurt tropical pink", 25000, "Yogurt", ["Halal", "Cold", "Fresh"], true, false, "5-8 menit"),

  // SAMBEL GAMI
  createMenuItem("Sambal Gami Tenderloin Beef", "Sambal gami tenderloin beef", 55000, "Sambel Gami", ["Halal", "Spicy"], true, true, "15-20 menit"),
  createMenuItem("Sambal Gami Paru Sapi", "Sambal gami paru sapi", 35000, "Sambel Gami", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sambal Gami Babat Sapi", "Sambal gami babat sapi", 35000, "Sambel Gami", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sambal Gami Ayam Goreng Kampung", "Sambal gami ayam goreng kampung", 40000, "Sambel Gami", ["Halal", "Spicy"], true, true, "15-20 menit"),

  // STEAK
  createMenuItem("Super Steak Black Pepper Sauce", "Super steak black pepper sauce", 150000, "Steak", ["Halal", "Premium"], true, false, "20-25 menit"),
  createMenuItem("Super Steak Mushroom Sauce", "Super steak mushroom sauce", 160000, "Steak", ["Halal", "Premium"], false, false, "20-25 menit"),
  createMenuItem("Super Steak Reguler Sauce", "Super steak reguler sauce", 150000, "Steak", ["Halal", "Premium"], false, false, "20-25 menit"),
  createMenuItem("Steak Black Pepper Sauce", "Steak black pepper sauce", 65000, "Steak", ["Halal"], false, false, "15-20 menit"),
  createMenuItem("Steak Mushroom Sauce", "Steak mushroom sauce", 65000, "Steak", ["Halal"], true, false, "15-20 menit"),
  createMenuItem("Steak Reguler Sauce", "Steak reguler sauce", 60000, "Steak", ["Halal"], false, false, "15-20 menit"),

  // RICE
  createMenuItem("Ayam Goreng Kampung Sambal Massapi", "Ayam goreng kampung sambal massapi", 35000, "Rice", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Nasi Goreng Ayam", "Nasi goreng ayam", 25000, "Rice", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Massapi", "Nasi goreng massapi", 30000, "Rice", ["Halal", "Signature"], true, false, "10-15 menit"),
  createMenuItem("Paru Sambal Massapi", "Paru sambal massapi", 35000, "Rice", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Rice Bowl Ayam", "Rice bowl ayam", 25000, "Rice", ["Halal", "Modern"], false, false, "10-15 menit"),
  createMenuItem("Rice Bowl Chicken Katsu", "Rice bowl chicken katsu", 30000, "Rice", ["Halal", "Japanese", "New"], false, false, "15-20 menit"),
  createMenuItem("Rice Bowl Sapi", "Rice bowl sapi", 35000, "Rice", ["Halal", "Modern"], false, false, "15-20 menit"),
  createMenuItem("Sapi Sambal Ijo", "Sapi sambal ijo", 40000, "Rice", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sapi Sambal Matah", "Sapi sambal matah", 40000, "Rice", ["Halal", "Spicy"], true, true, "15-20 menit"),
  createMenuItem("Sapi Sambal Mercon", "Sapi sambal mercon", 45000, "Rice", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Tongseng Massapi", "Tongseng massapi", 40000, "Rice", ["Halal", "Traditional", "New"], false, false, "15-20 menit"),

  // SOP
  createMenuItem("Sop Bakso Balungan", "Sop bakso balungan", 45000, "Sop", ["Halal", "Soup"], false, false, "15-20 menit"),
  createMenuItem("Sop Buntut", "Sop buntut", 55000, "Sop", ["Halal", "Soup"], true, false, "20-25 menit"),
  createMenuItem("Sop Iga", "Sop iga", 50000, "Sop", ["Halal", "Soup"], false, false, "20-25 menit"),
  createMenuItem("Sop Massapi", "Sop massapi", 40000, "Sop", ["Halal", "Soup", "Signature"], true, false, "15-20 menit"),
  createMenuItem("Sup Krim Asparagus", "Sup krim asparagus", 35000, "Sop", ["Halal", "Soup", "New"], false, false, "10-15 menit"),

  // MIE
  createMenuItem("Mie Goreng Ayam", "Mie goreng ayam", 25000, "Mie", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Mie Goreng Massapi", "Mie goreng massapi", 30000, "Mie", ["Halal", "Signature"], false, false, "10-15 menit"),
  createMenuItem("Mie Kuah Ayam", "Mie kuah ayam", 25000, "Mie", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Mie Kuah Massapi", "Mie kuah massapi", 30000, "Mie", ["Halal", "Signature"], true, false, "10-15 menit"),

  // PASTA
  createMenuItem("Fettucine Bolognese", "Fettucine bolognese", 40000, "Pasta", ["Halal", "Italian", "New"], false, false, "15-20 menit"),
  createMenuItem("Fettucine Carbonara", "Fettucine carbonara", 40000, "Pasta", ["Halal", "Italian", "New"], false, false, "15-20 menit"),
  createMenuItem("Spaghetti Aglio Olio", "Spaghetti aglio olio", 40000, "Pasta", ["Halal", "Italian", "New"], false, false, "15-20 menit"),

  // ALA CARTE
  createMenuItem("Capcay Ayam", "Capcay ayam", 30000, "Ala Carte", ["Halal", "Mixed"], false, false, "10-15 menit"),
  createMenuItem("Capcay Sapi", "Capcay sapi", 35000, "Ala Carte", ["Halal", "Mixed"], false, false, "10-15 menit"),
  createMenuItem("Capcay Bakso", "Capcay bakso", 20000, "Ala Carte", ["Halal", "Mixed"], false, false, "10-15 menit"),
  createMenuItem("Capcay Sosis", "Capcay sosis", 20000, "Ala Carte", ["Halal", "Mixed"], false, false, "10-15 menit")
];

// Add massapi menus to database
console.log(`Adding ${massapiMenus.length} menu items for Massapi Cafe & Resto...`);

// Add each menu item
massapiMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${massapiMenus.length} menu items for Massapi Cafe & Resto!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = massapiMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = massapiMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);

// Popular items summary
const popularItems = massapiMenus.filter(menu => menu.isPopular);
console.log(`\n⭐ Popular Items: ${popularItems.length} items`);
popularItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});

// Spicy items summary
const spicyItems = massapiMenus.filter(menu => menu.isSpicy);
console.log(`\n🌶️ Spicy Items: ${spicyItems.length} items`);
spicyItems.forEach(item => {
  console.log(`  - ${item.name} (${item.category})`);
});
