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
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "3-10 menit") {
  return {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "17", // Kopi Pidjar destination ID
    destinationSlug: "",
    destinationTitle: "Kopi Pidjar",
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

// Kopi Pidjar Menu Items
const pidjarMenus = [
  // KOPI PANAS
  createMenuItem("Kopi Tubruk", "Kopi tubruk tradisional", 5000, "Kopi", ["Halal", "Traditional", "Hot"], false, false, "5-7 menit"),
  createMenuItem("Kopi Saring", "Kopi saring yang halus", 5000, "Kopi", ["Halal", "Traditional", "Hot"], false, false, "5-7 menit"),
  createMenuItem("Kopi Susu Tubruk", "Kopi susu tubruk", 6000, "Kopi", ["Halal", "Sweet", "Hot"], false, false, "5-7 menit"),
  createMenuItem("Kopi Susu Saring", "Kopi susu saring", 6000, "Kopi", ["Halal", "Sweet", "Hot"], false, false, "5-7 menit"),
  createMenuItem("Kopi Butter", "Kopi dengan butter", 7000, "Kopi", ["Halal", "Signature", "Hot"], true, false, "5-7 menit"),
  createMenuItem("Kopi Arabika", "Kopi arabika premium", 10000, "Kopi", ["Halal", "Premium", "Hot"], true, false, "7-10 menit"),
  
  // ES KOPI
  createMenuItem("Es Kopi", "Es kopi segar", 10000, "Kopi", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Es Kopi Coklat", "Es kopi dengan coklat", 10000, "Kopi", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Cappucino", "Es cappucino creamy", 10000, "Kopi", ["Halal", "Cold", "Creamy"], false, false, "3-5 menit"),
  createMenuItem("Es Kopsus Gula Aren", "Es kopi susu dengan gula aren", 10000, "Kopi", ["Halal", "Cold", "Sweet", "Traditional"], true, false, "3-5 menit"),
  createMenuItem("Es Kopsus Karamel", "Es kopi susu karamel", 10000, "Kopi", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Kopsus Vanila", "Es kopi susu vanila", 10000, "Kopi", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Kopsus Hazelnut", "Es kopi susu hazelnut", 10000, "Kopi", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Kopsus Butterscotch", "Es kopi susu butterscotch", 10000, "Kopi", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  
  // ES SODA
  createMenuItem("Es Soda Leci", "Es soda leci segar", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Guava", "Es soda jambu biji", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Mango", "Es soda mangga", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Orange", "Es soda jeruk", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Pineapple", "Es soda nanas", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Blueberry", "Es soda blueberry", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Soda Fruitpunch", "Es soda fruitpunch", 10000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  
  // ES SUSU
  createMenuItem("Es Susu Taro", "Es susu taro", 10000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Susu Oreo", "Es susu oreo", 10000, "Minuman", ["Halal", "Cold", "Sweet"], true, false, "3-5 menit"),
  createMenuItem("Es Susu Coklat", "Es susu coklat", 10000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Susu Matcha", "Es susu matcha", 10000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Susu Banana", "Es susu pisang", 10000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Susu Redvelvet", "Es susu red velvet", 10000, "Minuman", ["Halal", "Cold", "Sweet"], true, false, "3-5 menit"),
  
  // MAKANAN
  createMenuItem("Risol", "Risol goreng", 3000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Kebab", "Kebab lezat", 6000, "Makanan Utama", ["Halal", "Signature"], true, false, "8-12 menit"),
  createMenuItem("Piscok [3]", "Pisang coklat 3 pcs", 5000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Cireng [5]", "Cireng 5 pcs", 5000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Tempura [5]", "Tempura 5 pcs", 5000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Otak-otak [5]", "Otak-otak 5 pcs", 5000, "Makanan Ringan", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Kentang Goreng", "Kentang goreng renyah", 5000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Pisang Goreng [3]", "Pisang goreng 3 pcs", 5000, "Makanan Ringan", ["Halal", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Roti Panggang", "Roti panggang", 5000, "Makanan Ringan", ["Halal", "Traditional"], false, false, "3-5 menit"),
  
  // TEH
  createMenuItem("Teh Manis Hangat", "Teh manis hangat", 5000, "Teh", ["Halal", "Sweet", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Teh Tawar Hangat", "Teh tawar hangat", 5000, "Teh", ["Halal", "Traditional", "Hot"], false, false, "2-3 menit"),
  createMenuItem("Es Teh Manis", "Es teh manis segar", 5000, "Teh", ["Halal", "Sweet", "Cold"], false, false, "2-3 menit"),
  createMenuItem("Es Teh Tawar", "Es teh tawar segar", 5000, "Teh", ["Halal", "Traditional", "Cold"], false, false, "2-3 menit")
];

// Add pidjar menus to database
console.log(`Adding ${pidjarMenus.length} menu items for Kopi Pidjar...`);

// Add each menu item
pidjarMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${pidjarMenus.length} menu items for Kopi Pidjar!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = pidjarMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Summary by original categories
console.log('\n🏷️ Menu Summary by Original Categories:');
const kopiPanasCount = pidjarMenus.filter(menu => menu.name.includes('Kopi') && !menu.name.includes('Es')).length;
const esKopiCount = pidjarMenus.filter(menu => menu.name.includes('Es Kopi') || menu.name.includes('Es Kopsus') || menu.name.includes('Es Cappucino')).length;
const esSodaCount = pidjarMenus.filter(menu => menu.name.includes('Es Soda')).length;
const esSusuCount = pidjarMenus.filter(menu => menu.name.includes('Es Susu')).length;
const makananCount = pidjarMenus.filter(menu => menu.name.includes('Risol') || menu.name.includes('Kebab') || menu.name.includes('Piscok') || menu.name.includes('Cireng') || menu.name.includes('Tempura') || menu.name.includes('Otak-otak') || menu.name.includes('Kentang') || menu.name.includes('Pisang Goreng') || menu.name.includes('Roti Panggang')).length;
const tehCount = pidjarMenus.filter(menu => menu.name.includes('Teh')).length;

console.log(`  KOPI PANAS: ${kopiPanasCount} items`);
console.log(`  ES KOPI: ${esKopiCount} items`);
console.log(`  ES SODA: ${esSodaCount} items`);
console.log(`  ES SUSU: ${esSusuCount} items`);
console.log(`  MAKANAN: ${makananCount} items`);
console.log(`  TEH: ${tehCount} items`);

// Price range summary
const prices = pidjarMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);
