const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find all items with name "Mango"
const mangoItems = db.menu_items.filter(item => item.name === 'Mango');

console.log(`Found ${mangoItems.length} items with name "Mango":`);
mangoItems.forEach((item, index) => {
  console.log(`${index + 1}. ID: ${item.id}, Category: ${item.category}, Destination: ${item.destinationTitle}, Description: ${item.description}`);
});

// Check for items with same ID and name combination that might cause React key conflicts
const keyMap = {};
const conflicts = [];

db.menu_items.forEach(item => {
  const key = `${item.id}-${item.destinationId}-${item.name}`;
  if (keyMap[key]) {
    conflicts.push({
      key: key,
      item1: keyMap[key],
      item2: item
    });
  } else {
    keyMap[key] = item;
  }
});

console.log(`\nFound ${conflicts.length} key conflicts:`);
conflicts.forEach((conflict, index) => {
  console.log(`${index + 1}. Key: ${conflict.key}`);
  console.log(`   Item 1: ID ${conflict.item1.id}, Name: ${conflict.item1.name}, Category: ${conflict.item1.category}`);
  console.log(`   Item 2: ID ${conflict.item2.id}, Name: ${conflict.item2.name}, Category: ${conflict.item2.category}`);
});
