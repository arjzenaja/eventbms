const fs = require('fs');
const path = require('path');

// Read the database
const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Taman Langit destination
const tamanLangit = db.kuliner.find(dest => dest.title === 'Taman Langit');
if (!tamanLangit) {
  console.log('Taman Langit destination not found');
  process.exit(1);
}

console.log(`Found destination: ${tamanLangit.title} (ID: ${tamanLangit.id})`);

// Categories to remove
const categoriesToRemove = ['Minuman', 'Kopi', 'Teh'];

// Get all menu items for Taman Langit
const allTamanLangitMenus = db.menu_items.filter(item => item.destinationId === tamanLangit.id);
console.log(`\nTotal menu items for Taman Langit: ${allTamanLangitMenus.length}`);

// Separate menus to keep and remove
const menusToKeep = allTamanLangitMenus.filter(item => !categoriesToRemove.includes(item.category));
const menusToRemove = allTamanLangitMenus.filter(item => categoriesToRemove.includes(item.category));

console.log(`\nMenus to keep (${menusToKeep.length}):`);
const keepCategories = [...new Set(menusToKeep.map(item => item.category))];
keepCategories.forEach(category => {
  const count = menusToKeep.filter(item => item.category === category).length;
  console.log(`  - ${category}: ${count} items`);
});

console.log(`\nMenus to remove (${menusToRemove.length}):`);
categoriesToRemove.forEach(category => {
  const count = menusToRemove.filter(item => item.category === category).length;
  console.log(`  - ${category}: ${count} items`);
});

// Show some examples of items to be removed
console.log(`\nExamples of items to be removed:`);
categoriesToRemove.forEach(category => {
  const examples = menusToRemove.filter(item => item.category === category).slice(0, 3);
  examples.forEach(item => {
    console.log(`  - ${item.name} (${item.category})`);
  });
});

// Remove beverage menu items
const originalCount = db.menu_items.length;
db.menu_items = db.menu_items.filter(item => {
  if (item.destinationId === tamanLangit.id) {
    return !categoriesToRemove.includes(item.category);
  }
  return true; // Keep items from other destinations
});

const removedCount = originalCount - db.menu_items.length;

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Taman Langit beverage menu cleanup completed!`);
console.log(`📊 Summary:`);
console.log(`   - Removed: ${removedCount} beverage menu items`);
console.log(`   - Kept: ${menusToKeep.length} non-beverage menu items`);
console.log(`   - Total menu items in database: ${db.menu_items.length}`);

console.log(`\n📋 Categories kept:`);
keepCategories.forEach(category => {
  const count = menusToKeep.filter(item => item.category === category).length;
  console.log(`   - ${category}: ${count} items`);
});

console.log(`\n🔍 Check the admin panel:`);
console.log(`   http://localhost:3000/admin/culinary/menu`);
console.log(`   Filter by: Taman Langit`);
