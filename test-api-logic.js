const fs = require('fs');
const path = require('path');

// Simulate API call
console.log('🔍 TESTING API ENDPOINT');
console.log('======================\n');

// Read the database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Simulate the API logic
const destinationId = "2";
let menuItems = db.menu_items || [];

console.log(`📊 Total menu items in database: ${menuItems.length}`);

// Filter by destination if specified
if (destinationId) {
  console.log(`🔍 Filtering by destinationId: "${destinationId}"`);
  menuItems = menuItems.filter(item => item.destinationId === destinationId);
  console.log(`📋 Menu items after filtering: ${menuItems.length}`);
}

if (menuItems.length > 0) {
  const categories = [...new Set(menuItems.map(menu => menu.category))];
  const prices = menuItems.map(menu => menu.price);
  
  console.log('\n📂 CATEGORIES FOUND:');
  categories.forEach(category => {
    const count = menuItems.filter(menu => menu.category === category).length;
    console.log(`- ${category}: ${count} menu`);
  });
  
  console.log('\n💰 PRICE RANGE:');
  console.log(`- Min: Rp ${Math.min(...prices).toLocaleString('id-ID')}`);
  console.log(`- Max: Rp ${Math.max(...prices).toLocaleString('id-ID')}`);
  
  console.log('\n✅ API WOULD RETURN SUCCESS');
  console.log(`- Success: true`);
  console.log(`- Menus: ${menuItems.length} items`);
  console.log(`- Categories: ${categories.length} categories`);
} else {
  console.log('\n❌ API WOULD RETURN EMPTY');
  console.log('- Success: false');
  console.log('- Error: No menu items found');
}
