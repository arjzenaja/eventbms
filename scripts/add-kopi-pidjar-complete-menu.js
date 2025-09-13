const fs = require('fs');
const path = require('path');

// Read the database
const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Kopi Pidjar destination
const kopiPidjar = db.kuliner.find(dest => dest.title === 'Kopi Pidjar');
if (!kopiPidjar) {
  console.log('Kopi Pidjar destination not found');
  process.exit(1);
}

console.log(`Found destination: ${kopiPidjar.title} (ID: ${kopiPidjar.id})`);

// Menu items for Kopi Pidjar
const menuItems = [
  // Kopi Panas (Hot Coffee)
  {
    name: 'Kopi Tubruk',
    description: 'Kopi tubruk panas dengan aroma khas',
    category: 'Kopi Panas',
    priceHot: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Hot', 'Signature']
  },
  {
    name: 'Kopi Saring',
    description: 'Kopi saring panas yang halus',
    category: 'Kopi Panas',
    priceHot: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.3,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Hot', 'Filtered']
  },
  {
    name: 'Kopi Susu Tubruk',
    description: 'Kopi tubruk dengan susu hangat',
    category: 'Kopi Panas',
    priceHot: 6000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Hot', 'Milk']
  },
  {
    name: 'Kopi Susu Saring',
    description: 'Kopi saring dengan susu hangat',
    category: 'Kopi Panas',
    priceHot: 6000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Hot', 'Milk', 'Filtered']
  },
  {
    name: 'Kopi Butter',
    description: 'Kopi dengan butter yang creamy',
    category: 'Kopi Panas',
    priceHot: 7000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Premium', 'Hot', 'Butter', 'Creamy']
  },
  {
    name: 'Kopi Arabika',
    description: 'Kopi arabika premium panas',
    category: 'Kopi Panas',
    priceHot: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.8,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Premium', 'Hot', 'Arabica', 'Signature']
  },

  // Es Kopi (Iced Coffee)
  {
    name: 'Es Kopi',
    description: 'Kopi dingin yang menyegarkan',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Cold', 'Refresh']
  },
  {
    name: 'Es Kopi Coklat',
    description: 'Es kopi dengan rasa coklat',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Chocolate', 'Sweet']
  },
  {
    name: 'Es Cappucino',
    description: 'Cappucino dingin dengan foam',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Foam', 'Premium']
  },
  {
    name: 'Es Kopsus Gula Aren',
    description: 'Es kopi susu dengan gula aren',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Palm Sugar', 'Traditional']
  },
  {
    name: 'Es Kopsus Karamel',
    description: 'Es kopi susu dengan karamel',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.6,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Caramel', 'Sweet']
  },
  {
    name: 'Es Kopsus Vanila',
    description: 'Es kopi susu dengan vanila',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Vanilla', 'Sweet']
  },
  {
    name: 'Es Kopsus Hazelnut',
    description: 'Es kopi susu dengan hazelnut',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.6,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Hazelnut', 'Premium']
  },
  {
    name: 'Es Kopsus Butterscotch',
    description: 'Es kopi susu dengan butterscotch',
    category: 'Es Kopi',
    priceIced: 10000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Butterscotch', 'Premium']
  },

  // Es Soda (Iced Soda)
  {
    name: 'Es Soda Leci',
    description: 'Soda dingin dengan rasa leci',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.3,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Lychee', 'Fruity']
  },
  {
    name: 'Es Soda Guava',
    description: 'Soda dingin dengan rasa jambu',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.2,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Guava', 'Fruity']
  },
  {
    name: 'Es Soda Mango',
    description: 'Soda dingin dengan rasa mangga',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Mango', 'Fruity']
  },
  {
    name: 'Es Soda Orange',
    description: 'Soda dingin dengan rasa jeruk',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.3,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Orange', 'Fruity']
  },
  {
    name: 'Es Soda Pineapple',
    description: 'Soda dingin dengan rasa nanas',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Pineapple', 'Fruity']
  },
  {
    name: 'Es Soda Blueberry',
    description: 'Soda dingin dengan rasa blueberry',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Blueberry', 'Fruity']
  },
  {
    name: 'Es Soda Fruitpunch',
    description: 'Soda dingin dengan campuran buah',
    category: 'Es Soda',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Soda', 'Mixed Fruit', 'Fruity']
  },

  // Es Susu (Iced Milk)
  {
    name: 'Es Susu Taro',
    description: 'Es susu dengan rasa taro',
    category: 'Es Susu',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Taro', 'Creamy']
  },
  {
    name: 'Es Susu Oreo',
    description: 'Es susu dengan oreo',
    category: 'Es Susu',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Oreo', 'Creamy']
  },
  {
    name: 'Es Susu Coklat',
    description: 'Es susu dengan rasa coklat',
    category: 'Es Susu',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Chocolate', 'Sweet']
  },
  {
    name: 'Es Susu Matcha',
    description: 'Es susu dengan matcha',
    category: 'Es Susu',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.6,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Matcha', 'Premium']
  },
  {
    name: 'Es Susu Banana',
    description: 'Es susu dengan rasa pisang',
    category: 'Es Susu',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Banana', 'Fruity']
  },
  {
    name: 'Es Susu Redvelvet',
    description: 'Es susu dengan rasa red velvet',
    category: 'Es Susu',
    priceIced: 10000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.7,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Cold', 'Milk', 'Red Velvet', 'Premium']
  },

  // Makanan (Food)
  {
    name: 'Risol',
    description: 'Risol goreng dengan isian sayuran',
    category: 'Makanan',
    price: 3000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.2,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Vegetable', 'Snack']
  },
  {
    name: 'Kebab',
    description: 'Kebab dengan daging dan sayuran segar',
    category: 'Makanan',
    price: 6000,
    cookingTime: '10-15 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.5,
    isPopular: true,
    halal: true,
    available: true,
    additionalInfo: ['Meat', 'Fresh', 'Filling']
  },
  {
    name: 'Piscok [3]',
    description: 'Pisang coklat goreng, 3 buah',
    category: 'Makanan',
    price: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Banana', 'Chocolate', 'Sweet']
  },
  {
    name: 'Cireng [5]',
    description: 'Cireng goreng, 5 buah',
    category: 'Makanan',
    price: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.3,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Traditional', 'Snack']
  },
  {
    name: 'Tempura [5]',
    description: 'Tempura goreng, 5 buah',
    category: 'Makanan',
    price: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Japanese', 'Crispy']
  },
  {
    name: 'Otak-otak [5]',
    description: 'Otak-otak goreng, 5 buah',
    category: 'Makanan',
    price: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.3,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Fish', 'Traditional']
  },
  {
    name: 'Kentang Goreng',
    description: 'Kentang goreng renyah',
    category: 'Makanan',
    price: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.2,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Potato', 'Crispy']
  },
  {
    name: 'Pisang Goreng [3]',
    description: 'Pisang goreng, 3 buah',
    category: 'Makanan',
    price: 5000,
    cookingTime: '5-10 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.4,
    halal: true,
    available: true,
    additionalInfo: ['Fried', 'Banana', 'Sweet']
  },
  {
    name: 'Roti Panggang',
    description: 'Roti panggang dengan selai',
    category: 'Makanan',
    price: 5000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.1,
    halal: true,
    available: true,
    additionalInfo: ['Toasted', 'Bread', 'Jam']
  },

  // Teh (Tea)
  {
    name: 'Teh Manis Hangat',
    description: 'Teh manis hangat yang menenangkan',
    category: 'Teh',
    priceHot: 5000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.2,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Hot', 'Sweet']
  },
  {
    name: 'Teh Tawar Hangat',
    description: 'Teh tawar hangat tanpa gula',
    category: 'Teh',
    priceHot: 5000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.1,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Hot', 'Plain']
  },
  {
    name: 'Es Teh Manis',
    description: 'Teh manis dingin yang menyegarkan',
    category: 'Teh',
    priceIced: 5000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.3,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Cold', 'Sweet', 'Refresh']
  },
  {
    name: 'Es Teh Tawar',
    description: 'Teh tawar dingin tanpa gula',
    category: 'Teh',
    priceIced: 5000,
    cookingTime: '3-5 menit',
    destinationId: kopiPidjar.id,
    destinationSlug: kopiPidjar.slug,
    destinationTitle: kopiPidjar.title,
    rating: 4.0,
    halal: true,
    available: true,
    additionalInfo: ['Traditional', 'Cold', 'Plain', 'Refresh']
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
console.log('Starting to upsert Kopi Pidjar menu items...');
const result = upsertMenuItems();

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Kopi Pidjar menu update completed!`);
console.log(`📊 Summary:`);
console.log(`   - Added: ${result.addedCount} items`);
console.log(`   - Updated: ${result.updatedCount} items`);
console.log(`   - Total processed: ${result.addedCount + result.updatedCount} items`);

console.log(`\n📋 Categories added/updated:`);
const categories = [...new Set(menuItems.map(item => item.category))];
categories.forEach(category => {
  const count = menuItems.filter(item => item.category === category).length;
  console.log(`   - ${category}: ${count} items`);
});

console.log(`\n🔍 Check the admin panel:`);
console.log(`   http://localhost:3000/admin/culinary/menu`);
console.log(`   Filter by: Kopi Pidjar`);
