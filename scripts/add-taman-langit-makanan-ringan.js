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

// Menu items for Taman Langit - Makanan Ringan
const menuItems = [
  {
    name: '5 Banana Sesame',
    description: 'Pisang Goreng, Balut dengan Karamel disajikan dengan Toping Wijen',
    category: 'Makanan Ringan',
    price: 30000,
    cookingTime: '8-12 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.5,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Banana', 'Caramel', 'Sesame', 'Sweet']
  },
  {
    name: '6 Tala Banana',
    description: 'Pisang Goreng disajikan dengan Saus Kaya',
    category: 'Makanan Ringan',
    price: 33000,
    cookingTime: '8-12 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Banana', 'Kaya Sauce', 'Sweet']
  },
  {
    name: '7 Churros',
    description: 'Donat Khas Spanyol disajikan dengan Cinnamon Sugar & Saus Coklat',
    category: 'Makanan Ringan',
    price: 35000,
    cookingTime: '10-15 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Spanish', 'Doughnut', 'Cinnamon', 'Chocolate', 'Premium']
  },
  {
    name: '8 Fried Dumpling',
    description: 'Dumpling Goreng dengan Isian Ayam Udang disajikan dengan Saus Bangkok',
    category: 'Makanan Ringan',
    price: 35000,
    cookingTime: '10-15 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Dumpling', 'Chicken', 'Shrimp', 'Bangkok Sauce']
  },
  {
    name: '9 Tala Platter',
    description: 'French Fries 100g - Onion Ring 80g - Jamur Enoki 100g - Chicken Lolipop & Fried Dumpling disajikan dengan Tartar Saus & Bangkok Saus',
    category: 'Makanan Ringan',
    price: 65000,
    cookingTime: '15-20 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.8,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Platter', 'Mixed', 'French Fries', 'Onion Ring', 'Enoki', 'Chicken Lollipop', 'Dumpling', 'Premium']
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
console.log('Starting to upsert Taman Langit Makanan Ringan menu items...');
const result = upsertMenuItems();

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Taman Langit Makanan Ringan menu update completed!`);
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
console.log(`   Category: Makanan Ringan`);
