const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find all Mango items from destination 22 (Massapi)
const mangoItems22 = db.menu_items.filter(item => item.destinationId === '22' && item.name === 'Mango');

console.log(`Found ${mangoItems22.length} Mango items from destination 22 (Massapi):`);
mangoItems22.forEach((item, index) => {
  console.log(`${index + 1}. ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}`);
});

// Check if there are any items that would create the key "736-22-Mango"
const key73622Mango = db.menu_items.filter(item => 
  item.id === '736' && item.destinationId === '22' && item.name === 'Mango'
);

console.log(`\nFound ${key73622Mango.length} items with key pattern "736-22-Mango":`);
key73622Mango.forEach((item, index) => {
  console.log(`${index + 1}. ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}`);
});

// Check for any items with ID 736 from any destination
const allItems736 = db.menu_items.filter(item => item.id === '736');
console.log(`\nFound ${allItems736.length} items with ID 736 from any destination:`);
allItems736.forEach((item, index) => {
  console.log(`${index + 1}. ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}, Destination ID: ${item.destinationId}`);
});

// Check for any potential key conflicts with Mango
const allMangoItems = db.menu_items.filter(item => item.name === 'Mango');
console.log(`\nAll Mango items in database:`);
allMangoItems.forEach((item, index) => {
  console.log(`${index + 1}. ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}, Destination ID: ${item.destinationId}`);
});
