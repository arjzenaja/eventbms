const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find all items with ID 736
const items736 = db.menu_items.filter(item => item.id === '736');

console.log(`Found ${items736.length} items with ID 736:`);
items736.forEach((item, index) => {
  console.log(`${index + 1}. Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}, Destination ID: ${item.destinationId}`);
});

// Also check for items with destination ID 22 and name Mango
const mangoItems22 = db.menu_items.filter(item => item.destinationId === '22' && item.name === 'Mango');
console.log(`\nFound ${mangoItems22.length} Mango items from destination 22:`);
mangoItems22.forEach((item, index) => {
  console.log(`${index + 1}. ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}`);
});
