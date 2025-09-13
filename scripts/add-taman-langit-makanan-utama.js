const fs = require('fs');
const path = require('path');

// Read the database
const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Taman Langit destination
const tamanLangit = db.kuliner.find(dest => dest.title === 'Taman Langit');
if (!tamanLangit) {
  console.log('Taman Langit destination not found');
  process.exit(1);
}

console.log(`Found destination: ${tamanLangit.title} (ID: ${tamanLangit.id})`);

// Menu items for Taman Langit - Makanan Utama
const menuItems = [
  {
    name: 'Roasted Chicken Barbosa',
    description: 'Half a roasted chicken served with a choice of sauce and french fries',
    category: 'Makanan Utama',
    price: 75000,
    cookingTime: '20-25 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Roasted', 'Chicken', 'French Fries', 'Sauce Choice', 'Premium']
  },
  {
    name: 'Swedish Meatball',
    description: '6 pieces of meatball served with demi-glace sauce, mashed potato, mushrooms, fresh salad, and strawberry jam',
    category: 'Makanan Utama',
    price: 85000,
    cookingTime: '15-20 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Meatball', 'Demi-glace', 'Mashed Potato', 'Mushroom', 'Fresh Salad', 'Strawberry Jam', 'Swedish']
  },
  {
    name: 'Chicken Steak',
    description: '200g chicken steak served with a choice of sauce',
    category: 'Makanan Utama',
    price: 55000,
    cookingTime: '15-20 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.5,
    halal: true,
    available: true,
    additionalInfo: ['Chicken', 'Steak', '200g', 'Sauce Choice', 'Grilled']
  },
  {
    name: 'Pan Seared Salmon',
    description: '120g pan-seared fresh salmon, served with mashed potato, baby green beans, and white sauce',
    category: 'Makanan Utama',
    price: 135000,
    cookingTime: '15-20 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.8,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Salmon', 'Pan Seared', '120g', 'Mashed Potato', 'Green Beans', 'White Sauce', 'Premium', 'Fresh']
  },
  {
    name: 'Crispy Chicken Steak',
    description: 'Crispy chicken steak served with a choice of sauce',
    category: 'Makanan Utama',
    price: 50000,
    cookingTime: '15-20 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Chicken', 'Crispy', 'Steak', 'Sauce Choice', 'Fried']
  },
  {
    name: 'Sirloin Steak',
    description: '160g sirloin steak served with a choice of sauce',
    category: 'Makanan Utama',
    price: 150000,
    cookingTime: '20-25 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.9,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Sirloin', 'Steak', '160g', 'Sauce Choice', 'Grilled', 'Premium', 'Beef']
  }
];

// Function to upsert menu items
function upsertMenuItems() {
  let addedCount = 0;
  let updatedCount = 0;

  menuItems.forEach(menuItem => {
    // Check if menu item already exists
    const existingIndex = db.menu_items.findIndex(item => 
      item.name === menuItem.name && 
      item.destinationId === menuItem.destinationId &&
      item.category === menuItem.category
    );

    if (existingIndex !== -1) {
      // Update existing item
      db.menu_items[existingIndex] = {
        ...db.menu_items[existingIndex],
        ...menuItem,
        id: db.menu_items[existingIndex].id // Keep existing ID
      };
      updatedCount++;
      console.log(`Updated: ${menuItem.name} (${menuItem.category})`);
    } else {
      // Add new item
      const newId = Math.max(...db.menu_items.map(item => parseInt(item.id) || 0)) + 1;
      db.menu_items.push({
        ...menuItem,
        id: newId.toString()
      });
      addedCount++;
      console.log(`Added: ${menuItem.name} (${menuItem.category})`);
    }
  });

  return { addedCount, updatedCount };
}

// Upsert menu items
console.log('Starting to upsert Taman Langit Makanan Utama menu items...');
const result = upsertMenuItems();

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Taman Langit Makanan Utama menu update completed!`);
console.log(`📊 Summary:`);
console.log(`   - Added: ${result.addedCount} items`);
console.log(`   - Updated: ${result.updatedCount} items`);
console.log(`   - Total processed: ${result.addedCount + result.updatedCount} items`);

console.log(`\n📋 Menu items added/updated:`);
menuItems.forEach(item => {
  console.log(`   - ${item.name}: Rp ${item.price.toLocaleString('id-ID')}`);
});

console.log(`\n🔍 Check the admin panel:`);
console.log(`   http://localhost:3000/admin/culinary/menu`);
console.log(`   Filter by: Taman Langit`);
console.log(`   Category: Makanan Utama`);
