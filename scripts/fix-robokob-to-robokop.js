const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔍 Mencari menu dengan destinationTitle "Robokob"...');

// Find all menu items with destinationTitle "Robokob"
const robokobMenus = db.menu_items.filter(item => item.destinationTitle === 'Robokob');

console.log(`📊 Ditemukan ${robokobMenus.length} menu dengan destinationTitle "Robokob"`);

if (robokobMenus.length === 0) {
  console.log('❌ Tidak ada menu dengan destinationTitle "Robokob" ditemukan');
  process.exit(0);
}

// Update all Robokob menus to Robokop
let updatedCount = 0;
db.menu_items.forEach(menu => {
  if (menu.destinationTitle === 'Robokob') {
    menu.destinationTitle = 'Robokop';
    menu.destinationSlug = 'robokop';
    menu.updated_at = new Date().toISOString();
    updatedCount++;
    console.log(`✓ Updated: ${menu.name} -> destinationTitle: Robokop, destinationSlug: robokop`);
  }
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Berhasil mengupdate ${updatedCount} menu dari "Robokob" menjadi "Robokop"`);

// Verify the changes
const robokopMenus = db.menu_items.filter(item => item.destinationTitle === 'Robokop');
console.log(`📊 Total menu dengan destinationTitle "Robokop": ${robokopMenus.length}`);

// Show sample updated menus
console.log('\n📋 Sample menu yang sudah diupdate:');
robokopMenus.slice(0, 5).forEach(menu => {
  console.log(`- ${menu.name} (${menu.destinationTitle}, ${menu.destinationSlug})`);
});
