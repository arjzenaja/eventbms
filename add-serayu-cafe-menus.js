const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Cafe Serayu destination info
const DEST_ID = '9';
const DEST_TITLE = 'Cafe Serayu';

// Ensure destination exists and provide a slug if missing
const dest = (db.kuliner || []).find(d => d.id === DEST_ID);
if (!dest) {
  console.error('❌ Destination not found:', DEST_ID);
  process.exit(1);
}
if (!dest.slug || dest.slug === 'Tidak Di Temukan') {
  dest.slug = 'cafe-serayu';
}

if (!db.menu_items) db.menu_items = [];

function single(name, category, price, description = '', image = '') {
  return {
    name,
    description,
    price,
    priceIced: null,
    priceHot: null,
    cookingTime: '',
    category,
    destinationId: DEST_ID,
    destinationSlug: dest.slug || '',
    destinationTitle: DEST_TITLE,
    rating: 4.5,
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: [],
    flavorOptions: [],
    image
  };
}

// Build menu items based on provided images/categories (prices are in thousands → actual Rupiah)
const newMenus = [
  // Tea zone
  single('Original Tea', 'Tea zone', 15000),
  single('Strawberry Tea', 'Tea zone', 22000),
  single('Lychee Tea', 'Tea zone', 22000),
  single('Lemon Tea', 'Tea zone', 22000),
  single('Mango Tea', 'Tea zone', 22000),
  single('Lemongrass Tea', 'Tea zone', 22000),
  single('Wedang Uwuh', 'Tea zone', 28000),

  // Please Squash
  single('Lyngo', 'Please Squash', 28000),
  single('Byngo', 'Please Squash', 28000),
  single('Virgin Mojito', 'Please Squash', 26000),
  single('Air Mineral', 'Please Squash', 10000),
  single('Jeruk Peras', 'Please Squash', 15000),

  // Milk Shake Time
  single('Ditepinya Sungai Serayu', 'Milk Shake', 32000),
  single('Senja Langit Serayu', 'Milk Shake', 32000),
  single('Bendung Arus Serayu', 'Milk Shake', 32000),
  single('Strawberry Matcha', 'Milk Shake', 32000),
  single('Red Velvet', 'Milk Shake', 30000),
  single('Chocolate', 'Milk Shake', 30000),
  single('Matcha', 'Milk Shake', 30000),

  // I will love strawberry
  single('Strawberry Milky', 'I will love strawberry', 30000),
  single('Strawberry Caramel', 'I will love strawberry', 32000),
  single('Strawberry Mojito', 'I will love strawberry', 28000),

  // Coffee Based
  single('Espresso', 'Coffee Based', 17000),
  single('Americano', 'Coffee Based', 25000),
  single('Cappuccino', 'Coffee Based', 27000),
  single('Coffee Latte', 'Coffee Based', 27000),
  single('Mochaccino', 'Coffee Based', 27000),
  single('Caramel Machiatto', 'Coffee Based', 28000),
  single('Affogato-nya Serayu', 'Coffee Based', 30000),

  // Manual Brew
  single('Local Beans', 'Manual Brew', 27000),
  single('Tubruk', 'Manual Brew', 23000),
  single('Vietnam Drip', 'Manual Brew', 23000),

  // Coffee Milk
  single('Barisan Kapal', 'Coffee Milk', 30000),
  single('Hamparan Padi', 'Coffee Milk', 30000),

  // Menu Prasmanan
  single('Nasi Putih + Oseng (2)', 'Menu Prasmanan', 10000),
  single('Nasi Putih + Sayur (1)', 'Menu Prasmanan', 10000),
  single('Nasi Putih + Oseng (2) + Sayur (1)', 'Menu Prasmanan', 13000),
  single('Sayur Terpisah (1)', 'Menu Prasmanan', 8000),
  single('Oseng Terpisah (1)', 'Menu Prasmanan', 5000),
  single('Mangut Iwak Pe', 'Menu Prasmanan', 18000),
  single('Ayam Goreng Burus', 'Menu Prasmanan', 15000),
  single('Ayam Suwir Balado', 'Menu Prasmanan', 15000),
  single('Ayam Opor', 'Menu Prasmanan', 15000),
  single('Ayam Bacem', 'Menu Prasmanan', 15000),
  single('Ayam Garang Asem', 'Menu Prasmanan', 15000),
  single('Empal Daging Goreng', 'Menu Prasmanan', 18000),
  single('Telor Dadar Ibu', 'Menu Prasmanan', 8000),
  single('Telor Bacem', 'Menu Prasmanan', 8000),
  single('Tahu Bacem', 'Menu Prasmanan', 5000),
  single('Tempe Bacem', 'Menu Prasmanan', 5000),
  single('Aneka Gorengan', 'Menu Prasmanan', 3000),

  // Menu Makanan (Sup & Soto & Rawon)
  single('Sop Ayam Rempah', 'Soup & Soto', 40000),
  single('Pecak Nila', 'Soup & Soto', 40000),
  single('Mangut Lele', 'Soup & Soto', 30000),
  single('Sop Iga Serayu', 'Soup & Soto', 90000),
  single('Rawon Iga Serayu', 'Soup & Soto', 90000),
  single('Soto Tangkar Serayu', 'Soup & Soto', 90000),
  single('Nasi Putih', 'Soup & Soto', 10000),

  // Ayam/Ikan/Iga Goreng & Bakar
  single('Ayam Goreng/Bakar', 'Grill & Fry', 35000),
  single('Nila Goreng/Bakar', 'Grill & Fry', 40000),
  single('Lele Goreng', 'Grill & Fry', 28000),
  single('Lembutan Goreng', 'Grill & Fry', 35000),
  single('Iso Goreng/Bakar', 'Grill & Fry', 40000),
  single('Iga Goreng/Bakar', 'Grill & Fry', 90000),

  // Snack & Platter
  single('Cireng', 'Snack & Platter', 20000),
  single('Dimsum', 'Snack & Platter', 28000),
  single('Pisang Goreng', 'Snack & Platter', 21000),
  single('Pisang Bakar', 'Snack & Platter', 21000),
  single('Kentang Goreng', 'Snack & Platter', 20000),
  single('Singkong Mentega', 'Snack & Platter', 20000),
  single('Mendoan Banyumas', 'Snack & Platter', 28000),
  single('Rebusan', 'Snack & Platter', 40000),
  single('Traditional Platter', 'Snack & Platter', 40000),

  // Nasi/Mie Goreng
  single('Nasi Goreng Serayu', 'Rice & Noodles', 35000),
  single('Nasi Goreng Ayam', 'Rice & Noodles', 30000),
  single('Mie Goreng Serayu', 'Rice & Noodles', 30000)
];

// Insert new items avoiding duplicates by name+destination
const existingKey = new Set(
  (db.menu_items || [])
    .filter(m => m.destinationId === DEST_ID)
    .map(m => `${m.name}@@${m.destinationId}`)
);

let inserted = 0;
newMenus.forEach(m => {
  const key = `${m.name}@@${m.destinationId}`;
  if (!existingKey.has(key)) {
    m.id = db.menu_items.length ? Math.max(...db.menu_items.map(x => Number(x.id) || 0)) + 1 : 1;
    m.updated_at = new Date().toISOString();
    db.menu_items.push(m);
    existingKey.add(key);
    inserted += 1;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`✅ Updated db.json. Inserted ${inserted} Cafe Serayu menus. Slug: ${dest.slug}`);


