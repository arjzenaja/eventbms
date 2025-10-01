const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const redVelvet = db.menu_items.find(m => m.name === 'Red Velvet');

if (redVelvet) {
  console.log('Red Velvet details:');
  console.log('- ID:', redVelvet.id);
  console.log('- Category:', redVelvet.category);
  console.log('- Price Hot:', redVelvet.priceHot);
  console.log('- Price Iced:', redVelvet.priceIced);
  console.log('- Price:', redVelvet.price);
  console.log('- Destination:', redVelvet.destinationTitle);
} else {
  console.log('Red Velvet not found');
}
