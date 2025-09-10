const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Total menu items: ${db.menu_items.length}`);

// Check for any duplicate IDs
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

console.log(`Duplicate IDs found: ${duplicateIds.length}`);
if (duplicateIds.length > 0) {
  console.log('Duplicate IDs:', duplicateIds);
}

// Check for items with same name, destination, and category that might cause React key conflicts
const keyConflicts = [];
const keyMap = {};

db.menu_items.forEach((item, index) => {
  // Create a unique key that would be used in React
  const reactKey = `${item.id}-${item.destinationId}-${item.name}`;
  
  if (keyMap[reactKey]) {
    keyConflicts.push({
      key: reactKey,
      item1: keyMap[reactKey],
      item2: item,
      index1: keyMap[reactKey].index,
      index2: index
    });
  } else {
    keyMap[reactKey] = { ...item, index };
  }
});

console.log(`\nReact key conflicts found: ${keyConflicts.length}`);
keyConflicts.forEach((conflict, index) => {
  console.log(`${index + 1}. Key: ${conflict.key}`);
  console.log(`   Item 1 (index ${conflict.index1}): ID ${conflict.item1.id}, Name: ${conflict.item1.name}, Category: ${conflict.item1.category}, Destination: ${conflict.item1.destinationTitle}`);
  console.log(`   Item 2 (index ${conflict.index2}): ID ${conflict.item2.id}, Name: ${conflict.item2.name}, Category: ${conflict.item2.category}, Destination: ${conflict.item2.destinationTitle}`);
});

// If there are conflicts, fix them by updating the ID of the second item
if (keyConflicts.length > 0) {
  console.log('\nFixing key conflicts...');
  
  // Get the highest ID
  let maxId = 0;
  db.menu_items.forEach(item => {
    const id = parseInt(item.id);
    if (id > maxId) {
      maxId = id;
    }
  });
  
  let newId = maxId + 1;
  let fixedCount = 0;
  
  keyConflicts.forEach(conflict => {
    // Update the ID of the second item
    const itemIndex = conflict.index2;
    db.menu_items[itemIndex].id = newId.toString();
    db.menu_items[itemIndex].updated_at = new Date().toISOString();
    
    console.log(`Fixed conflict: Updated item at index ${itemIndex} from ID ${conflict.item2.id} to ${newId}`);
    newId++;
    fixedCount++;
  });
  
  // Write the updated database
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  
  console.log(`\n✅ Fixed ${fixedCount} key conflicts!`);
  console.log(`📊 Total menu items: ${db.menu_items.length}`);
} else {
  console.log('\n✅ No key conflicts found!');
}

// Final verification
console.log('\nFinal verification:');
const finalKeyMap = {};
let finalConflicts = 0;

db.menu_items.forEach((item, index) => {
  const reactKey = `${item.id}-${item.destinationId}-${item.name}`;
  if (finalKeyMap[reactKey]) {
    finalConflicts++;
  } else {
    finalKeyMap[reactKey] = true;
  }
});

console.log(`Final key conflicts: ${finalConflicts}`);
if (finalConflicts === 0) {
  console.log('✅ All React keys are now unique!');
} else {
  console.log('❌ Still have key conflicts!');
}
