const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '5';
const DEST_TITLE = 'Lav Cafe';

const dest = (db.kuliner || []).find(d => d.id === DEST_ID);
if (!dest) {
  console.error('❌ Lav Cafe not found');
  process.exit(1);
}

// Fix slug if it mistakenly contains URL
if (!dest.slug || dest.slug.includes('http')) dest.slug = 'lav-cafe';

if (!db.menu_items) db.menu_items = [];

function makeId() {
  return db.menu_items.length ? Math.max(...db.menu_items.map(m => Number(m.id) || 0)) + 1 : 1;
}

function baseItem(overrides) {
  return {
    id: String(makeId()),
    price: null,
    priceIced: null,
    priceHot: null,
    cookingTime: '10-15 menit',
    destinationId: DEST_ID,
    destinationSlug: dest.slug,
    destinationTitle: DEST_TITLE,
    rating: 4.5,
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    flavorOptions: [],
    image: '/placeholder.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// Helper factories
const single = (name, category, price, description='') => baseItem({ name, category, description, price });
const icedOnly = (name, category, price, description='') => baseItem({ name, category, description, priceIced: price });
const hotOnly = (name, category, price, description='') => baseItem({ name, category, description, priceHot: price });
const dual = (name, category, hot, iced, description='') => baseItem({ name, category, description, priceHot: hot, priceIced: iced });

// Menus from images (k suffix -> *1000)
const menus = [
  // Salads / Soups / Rice (subset)
  single('Tropical Salad', 'Makanan Utama', 40000),
  single('LAV Grilled Chicken Salad', 'Makanan Utama', 45000),
  single('Crispy Beef Kale Salad', 'Makanan Utama', 50000),
  single('Apple Kale Quinoa Salad', 'Makanan Utama', 50000),
  single('Rawon Miso', 'Makanan Utama', 75000),
  single('Aromatic Tomyam Soup', 'Makanan Utama', 120000),
  single('LAV Special Fried Rice', 'Fried Rice', 40000),
  single('Salmon Fried Rice', 'Fried Rice', 55000),
  single('Rawon Fried Rice', 'Fried Rice', 55000),
  single('Kambing Fried Rice', 'Fried Rice', 55000),
  single('Nasi Ayam Goreng', 'Makanan Utama', 40000),
  single('Nasi Ayam Bakar', 'Makanan Utama', 40000),
  single('LAV Tenggiri Sambal Matah', 'Makanan Utama', 40000),

  // Snacks subset
  single('French Fries', 'Snack', 30000),
  single('Crispy Salmon Skin', 'Snack', 35000),
  single('Shimeji Salted Egg', 'Snack', 35000),
  single('Corn Salted Egg', 'Snack', 35000),
  single('Truffle French Fries', 'Snack', 40000),
  single('Crispy Chicken Tangkep', 'Snack', 45000),
  single('Onion Ring', 'Snack', 35000),
  single('Crispy Kale', 'Snack', 35000),
  single('Potato Chips', 'Snack', 35000),

  // Pizza & Pasta subset
  single('Pizza Peking Duck', 'Pizza', 100000),
  single('Pizza Beef Pepperoni', 'Pizza', 95000),
  single('Pizza Salmon Sambal Matah', 'Pizza', 95000),
  single('Mie Goreng LAV', 'Makanan Utama', 40000),
  single('Kwetiau Goreng LAV', 'Makanan Utama', 40000),
  single('LAV Kwetiau Aromatic Salted Egg', 'Makanan Utama', 60000),
  single('Beef Penne Bolognese', 'Pasta', 60000),
  single('Truffle Fettuccini Carbonara', 'Pasta', 70000),
  single('LAV Spaghetti Sambal Terasi', 'Pasta', 70000),
  single('LAV Spaghetti Satay', 'Pasta', 70000),

  // Desserts subset
  single('Croissant Rambut Nenek', 'Dessert', 45000),
  single('Lemon Tart', 'Dessert', 45000),
  single('Croissant Nutella', 'Dessert', 35000),
  single('Oreo Cheesecake', 'Dessert', 45000),
  single('Pineapple Cinnamon', 'Dessert', 35000),
  single('Apple Strudel', 'Dessert', 45000),
  single('Cinnamon Roll', 'Dessert', 35000),

  // Drinks (ice-only; no hot/ice pair shown)
  icedOnly('Spice Cola', 'Non Coffee', 35000),
  icedOnly('Fruity Cola', 'Non Coffee', 35000),
  icedOnly('Vanilla Cola', 'Non Coffee', 35000),
  icedOnly('Strawberry Mojito', 'Non Coffee', 35000),
  icedOnly('Lovely Lychee', 'Non Coffee', 38000),
  icedOnly('Lychee Mojito', 'Non Coffee', 35000),
];

// Insert without duplicates for Lav Cafe
const key = (m) => `${m.name}@@${DEST_ID}`;
const existing = new Set(db.menu_items.filter(x => x.destinationId === DEST_ID).map(x => key(x)));
let inserted = 0;
menus.forEach(m => {11;
  if (!existing.has(key(m))) {
    db.menu_items.push(m);
    existing.add(key(m));
    inserted++;
  }
});

dest.updated_at = new Date().toISOString();

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`✅ Lav Cafe updated. Inserted ${inserted} menus. Slug: ${dest.slug}`);
