const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Total menu items: ${db.menu_items.length}`);

// Check for React key conflicts
const keyMap = new Map();
const conflicts = [];

db.menu_items.forEach((item, index) => {
  // Create the same key that would be used in React component
  const reactKey = `${item.id}-${item.destinationId}-${item.name}`;
  
  if (keyMap.has(reactKey)) {
    conflicts.push({
      key: reactKey,
      existing: keyMap.get(reactKey),
      current: { ...item, index }
    });
  } else {
    keyMap.set(reactKey, { ...item, index });
  }
});

console.log(`React key conflicts: ${conflicts.length}`);

if (conflicts.length > 0) {
  console.log('\nConflicts found:');
  conflicts.forEach((conflict, index) => {
    console.log(`${index + 1}. Key: ${conflict.key}`);
    console.log(`   Existing: ID ${conflict.existing.id}, Name: ${conflict.existing.name}, Category: ${conflict.existing.category}, Destination: ${conflict.existing.destinationTitle}`);
    console.log(`   Current:  ID ${conflict.current.id}, Name: ${conflict.current.name}, Category: ${conflict.current.category}, Destination: ${conflict.current.destinationTitle}`);
  });
} else {
  console.log('✅ No React key conflicts found!');
}

// Check for items with name "Mango" specifically
const mangoItems = db.menu_items.filter(item => item.name === 'Mango');
console.log(`\nMango items: ${mangoItems.length}`);
mangoItems.forEach((item, index) => {
  const reactKey = `${item.id}-${item.destinationId}-${item.name}`;
  console.log(`${index + 1}. Key: ${reactKey}, ID: ${item.id}, Category: ${item.category}, Destination: ${item.destinationTitle}`);
});

// Check for any items with ID 736
const items736 = db.menu_items.filter(item => item.id === '736');
console.log(`\nItems with ID 736: ${items736.length}`);
items736.forEach((item, index) => {
  const reactKey = `${item.id}-${item.destinationId}-${item.name}`;
  console.log(`${index + 1}. Key: ${reactKey}, Name: ${item.name}, Category: ${item.category}, Destination: ${item.destinationTitle}`);
});
