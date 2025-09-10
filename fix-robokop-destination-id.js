const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔍 Mencari menu dengan destinationTitle "Robokop"...');

// Find all menu items with destinationTitle "Robokop"
const robokopMenus = db.menu_items.filter(item => item.destinationTitle === 'Robokop');

console.log(`📊 Ditemukan ${robokopMenus.length} menu dengan destinationTitle "Robokop"`);

if (robokopMenus.length === 0) {
  console.log('❌ Tidak ada menu dengan destinationTitle "Robokop" ditemukan');
  process.exit(0);
}

// Find Robokop destination
const robokopDestination = db.kuliner.find(dest => dest.title === 'Robokop');
if (!robokopDestination) {
  console.log('❌ Destinasi "Robokop" tidak ditemukan');
  process.exit(1);
}

console.log(`📍 Destinasi Robokop ditemukan: ID ${robokopDestination.id}, Slug: ${robokopDestination.slug}`);

// Update all Robokop menus with correct destination info
let updatedCount = 0;
db.menu_items.forEach(menu => {
  if (menu.destinationTitle === 'Robokop') {
    menu.destinationId = robokopDestination.id;
    menu.destinationSlug = robokopDestination.slug;
    menu.updated_at = new Date().toISOString();
    updatedCount++;
    console.log(`✓ Updated: ${menu.name} -> destinationId: ${robokopDestination.id}, destinationSlug: ${robokopDestination.slug}`);
  }
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Berhasil mengupdate ${updatedCount} menu Robokop dengan destinationId yang benar`);

// Verify the changes
const updatedRobokopMenus = db.menu_items.filter(item => item.destinationTitle === 'Robokop' && item.destinationId === robokopDestination.id);
console.log(`📊 Total menu Robokop dengan destinationId yang benar: ${updatedRobokopMenus.length}`);

// Show sample updated menus
console.log('\n📋 Sample menu yang sudah diupdate:');
updatedRobokopMenus.slice(0, 5).forEach(menu => {
  console.log(`- ${menu.name} (ID: ${menu.destinationId}, Slug: ${menu.destinationSlug})`);
});
