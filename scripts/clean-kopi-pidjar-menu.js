const fs = require('fs');
const path = require('path');

// Read the database
const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Kopi Pidjar destination
const kopiPidjar = db.kuliner.find(dest => dest.title === 'Kopi Pidjar');
if (!kopiPidjar) {
  console.log('Kopi Pidjar destination not found');
  process.exit(1);
}

console.log(`Found destination: ${kopiPidjar.title} (ID: ${kopiPidjar.id})`);

// Valid categories according to the physical menu
const validCategories = [
  'Kopi Panas',
  'Es Kopi', 
  'Es Soda',
  'Es Susu',
  'Makanan',
  'Teh'
];

// Get all menu items for Kopi Pidjar
const allKopiPidjarMenus = db.menu_items.filter(item => item.destinationId === kopiPidjar.id);
console.log(`\nTotal menu items for Kopi Pidjar: ${allKopiPidjarMenus.length}`);

// Separate valid and invalid menu items
const validMenus = allKopiPidjarMenus.filter(item => validCategories.includes(item.category));
const invalidMenus = allKopiPidjarMenus.filter(item => !validCategories.includes(item.category));

console.log(`\nValid menu items (${validMenus.length}):`);
validMenus.forEach(menu => {
  console.log(`  - ${menu.name} (${menu.category})`);
});

console.log(`\nInvalid menu items to be removed (${invalidMenus.length}):`);
invalidMenus.forEach(menu => {
  console.log(`  - ${menu.name} (${menu.category})`);
});

// Remove invalid menu items
const originalCount = db.menu_items.length;
db.menu_items = db.menu_items.filter(item => {
  if (item.destinationId === kopiPidjar.id) {
    return validCategories.includes(item.category);
  }
  return true; // Keep items from other destinations
});

const removedCount = originalCount - db.menu_items.length;

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Kopi Pidjar menu cleanup completed!`);
console.log(`📊 Summary:`);
console.log(`   - Removed: ${removedCount} invalid menu items`);
console.log(`   - Kept: ${validMenus.length} valid menu items`);
console.log(`   - Total menu items in database: ${db.menu_items.length}`);

console.log(`\n📋 Valid categories kept:`);
validCategories.forEach(category => {
  const count = validMenus.filter(menu => menu.category === category).length;
  console.log(`   - ${category}: ${count} items`);
});

console.log(`\n🔍 Check the admin panel:`);
console.log(`   http://localhost:3000/admin/culinary/menu`);
console.log(`   Filter by: Kopi Pidjar`);
