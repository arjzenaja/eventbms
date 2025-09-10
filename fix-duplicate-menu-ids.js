const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Found ${db.menu_items.length} menu items in database`);

// Find all unique IDs and check for duplicates
const idCounts = {};
const duplicateIds = [];

db.menu_items.forEach((item, index) => {
  const id = item.id;
  if (idCounts[id]) {
    idCounts[id]++;
    if (idCounts[id] === 2) {
      duplicateIds.push(id);
    }
  } else {
    idCounts[id] = 1;
  }
});

console.log(`Found ${duplicateIds.length} duplicate IDs:`, duplicateIds);

// Get the highest ID in the database
let maxId = 0;
db.menu_items.forEach(item => {
  const id = parseInt(item.id);
  if (id > maxId) {
    maxId = id;
  }
});

console.log(`Current max ID: ${maxId}`);

// Fix duplicate IDs by reassigning them
let newId = maxId + 1;
let fixedCount = 0;

db.menu_items.forEach((item, index) => {
  const id = item.id;
  if (idCounts[id] > 1) {
    // This is a duplicate ID, reassign it
    item.id = newId.toString();
    newId++;
    fixedCount++;
    console.log(`Fixed duplicate ID ${id} -> ${item.id} for item: ${item.name}`);
  }
});

console.log(`\nFixed ${fixedCount} duplicate IDs`);

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`✅ Successfully fixed duplicate menu IDs!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);
console.log(`🔢 New max ID: ${newId - 1}`);

// Verify no more duplicates
const newIdCounts = {};
let hasDuplicates = false;

db.menu_items.forEach(item => {
  const id = item.id;
  if (newIdCounts[id]) {
    newIdCounts[id]++;
    hasDuplicates = true;
  } else {
    newIdCounts[id] = 1;
  }
});

if (hasDuplicates) {
  console.log(`❌ Still found duplicates after fix!`);
} else {
  console.log(`✅ No more duplicate IDs found!`);
}
