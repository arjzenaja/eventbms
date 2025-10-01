const fs = require('fs');
const path = require('path');

// Read the database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔍 MEMERIKSA DESTINATION ID DAN MENU');
console.log('====================================\n');

// Check culinary destinations
console.log('📂 DESTINASI KULINER:');
db.kuliner.forEach(dest => {
  console.log(`- ID: "${dest.id}" (${typeof dest.id}) → Name: "${dest.name}"`);
});

console.log('\n📊 MENU ITEMS - DESTINATION ID:');
const destinationIds = [...new Set(db.menu_items.map(menu => menu.destinationId))];
destinationIds.forEach(id => {
  const count = db.menu_items.filter(menu => menu.destinationId === id).length;
  console.log(`- "${id}" (${typeof id}): ${count} menu`);
});

console.log('\n🎯 MENU UNTUK DESTINATION ID "2":');
const menusForDest2 = db.menu_items.filter(menu => menu.destinationId === "2");
console.log(`Total: ${menusForDest2.length} menu`);

if (menusForDest2.length > 0) {
  menusForDest2.forEach(menu => {
    console.log(`- ${menu.name} (ID: ${menu.id}, DestID: "${menu.destinationId}")`);
  });
} else {
  console.log('❌ Tidak ada menu untuk destination ID "2"');
  
  // Check if there are menus with numeric ID 2
  const menusForDest2Numeric = db.menu_items.filter(menu => menu.destinationId === 2);
  console.log(`\n🔍 MENU UNTUK DESTINATION ID 2 (numeric): ${menusForDest2Numeric.length} menu`);
  
  if (menusForDest2Numeric.length > 0) {
    menusForDest2Numeric.forEach(menu => {
      console.log(`- ${menu.name} (ID: ${menu.id}, DestID: ${menu.destinationId})`);
    });
  }
}
