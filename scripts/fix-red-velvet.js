const fs = require('fs');

// Read current database
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Find Red Velvet menu
const redVelvetIndex = db.menu_items.findIndex(m => m.name === 'Red Velvet');

if (redVelvetIndex !== -1) {
  const redVelvet = db.menu_items[redVelvetIndex];
  
  console.log('Current Red Velvet data:');
  console.log('- ID:', redVelvet.id);
  console.log('- Category:', redVelvet.category);
  console.log('- Price Hot:', redVelvet.priceHot);
  console.log('- Price Iced:', redVelvet.priceIced);
  console.log('- Price:', redVelvet.price);
  
  // Update Red Velvet to have correct category and dual pricing
  db.menu_items[redVelvetIndex] = {
    ...redVelvet,
    category: 'Non Coffe+',
    price: null, // Set to null for dual pricing
    priceIced: 26000,
    priceHot: 28000
  };
  
  // Save back to database
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  
  console.log('\n✅ Red Velvet updated:');
  console.log('- Category: Non Coffe+');
  console.log('- Price Hot: Rp 28,000');
  console.log('- Price Iced: Rp 26,000');
  console.log('- Price: null (dual pricing)');
  
} else {
  console.log('❌ Red Velvet menu not found');
}
