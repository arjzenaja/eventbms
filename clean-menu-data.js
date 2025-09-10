const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Total menu items: ${db.menu_items.length}`);

// Remove any items with invalid or missing data
const validItems = db.menu_items.filter(item => {
  return item.id && 
         item.name && 
         item.destinationId && 
         item.category &&
         item.price !== undefined &&
         item.price !== null;
});

console.log(`Valid menu items: ${validItems.length}`);
console.log(`Removed ${db.menu_items.length - validItems.length} invalid items`);

// Ensure all IDs are unique and sequential
const idMap = new Map();
let nextId = 1;

// First, find the highest existing ID
let maxId = 0;
validItems.forEach(item => {
  const id = parseInt(item.id);
  if (id > maxId) {
    maxId = id;
  }
});

nextId = maxId + 1;

// Assign new unique IDs
validItems.forEach(item => {
  if (!idMap.has(item.id)) {
    idMap.set(item.id, item.id);
  } else {
    // This ID is duplicate, assign a new one
    item.id = nextId.toString();
    item.updated_at = new Date().toISOString();
    nextId++;
  }
});

// Update the database
db.menu_items = validItems;

// Write the cleaned database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Cleaned menu data!`);
console.log(`📊 Total menu items: ${db.menu_items.length}`);
console.log(`🔢 Next available ID: ${nextId}`);

// Verify no duplicates
const finalIds = db.menu_items.map(item => item.id);
const uniqueIds = new Set(finalIds);
console.log(`✅ Unique IDs: ${uniqueIds.size}/${finalIds.length}`);

if (uniqueIds.size === finalIds.length) {
  console.log('✅ All IDs are now unique!');
} else {
  console.log('❌ Still have duplicate IDs!');
}
