const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = "4";
const DEST_TITLE = 'Lembah Patih';

// Ensure destination exists and fix slug
const dest = (db.kuliner || []).find(d => d.id === DEST_ID);
if (!dest) {
  console.error('❌ Destination not found:', DEST_ID);
  process.exit(1);
}
if (!dest.slug || dest.slug === 'Tidak Di Temukan') {
  dest.slug = 'lembah-patih';
}

if (!db.menu_items) db.menu_items = [];

// Helper to create single-price item
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

// Helper to create dual-price item
function dual(name, category, hot, iced, description = '', image = '') {
  return {
    name,
    description,
    price: null,
    priceHot: hot,
    priceIced: iced,
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

// Define menus based on images (prices in thousands → *1000)
const newMenus = [
  // FROM THE PLATE TO SHARE
  single('Mix Platter', 'From The Plate To Share', 75000),
  single('Truffled French Fries', 'From The Plate To Share', 45000),
  single('Fish And Chip', 'From The Plate To Share', 65000),
  single('Pizza Meat Lovers', 'From The Plate To Share', 85000),
  single('Pizza Beef Salami And Bell Pepper', 'From The Plate To Share', 85000),
  single('Pizza Margarita', 'From The Plate To Share', 65000),

  // FROM THE GRILL
  single('Signature Burger', 'From The Grill', 65000),
  single('Sirloin AUS Premium 180 gr', 'From The Grill', 130000),
  single('Chicken Rosemary', 'From The Grill', 65000),

  // SWEET TOOTH
  single('Lotus Biscoff Toast', 'Sweet Tooth', 35000),
  single('Peanut Butter Toast', 'Sweet Tooth', 35000),
  single('Choux Au Craquelin', 'Sweet Tooth', 35000),
  single('Baked Alaskan', 'Sweet Tooth', 45000),
  single('Churros', 'Sweet Tooth', 40000),
  single('Donut Patih', 'Sweet Tooth', 35000),

  // ASIAN CORNERS
  single('Nasi Goreng Iga Bakar', 'Asian Corners', 65000),
  single('Dori Mentai', 'Asian Corners', 45000),
  single('Ayam Sambal Matah', 'Asian Corners', 50000),
  single('Chicken Nanban', 'Asian Corners', 55000),
  single('Sundubu Jjigae', 'Asian Corners', 50000),
  single('Iga Soup', 'Asian Corners', 65000),
  single('Tumis Cumi Asin Pete', 'Asian Corners', 55000),

  // PASTA OF THE WEEK
  single('Pasta of The Week', 'Pasta Of The Week', 70000),

  // NON COFFEE
  single('Sweet Sparkling Tepache', 'Non Coffee', 30000),
  single('Sunrise', 'Non Coffee', 30000),
  dual('Chocolate', 'Non Coffee', 32000, 34000),
  dual('Matcha', 'Non Coffee', 30000, 32000),
  single('Mineral Water', 'Non Coffee', 12000),

  // TEA (dual 29/31 except Lychee 28)
  dual('Artisan Tropical Sunset', 'Tea', 29000, 31000),
  dual('Artisan Earl Grey', 'Tea', 29000, 31000),
  dual('Artisan Berry Heaven', 'Tea', 29000, 31000),
  dual('Artisan Blue Moon', 'Tea', 29000, 31000),
  single('Lychee Tea', 'Tea', 28000),

  // SIGNATURE MOCKTAIL (single 35)
  single('Bukit', 'Signature Mocktail', 35000),
  single('Jenara', 'Signature Mocktail', 35000),
  single('Embun', 'Signature Mocktail', 35000),

  // TAP COFFEE BAR (single)
  single('Nitro Cold Brew Coffee', 'Tap Coffee Bar', 25000),
  single('Seasonal Coffee Sparking', 'Tap Coffee Bar', 26000),

  // CLASSIC COFFEE (some dual)
  dual('Americano', 'Classic Coffee', 26000, 28000),
  single('Cappuccino', 'Classic Coffee', 29000),
  dual('Café Latte', 'Classic Coffee', 30000, 32000),
  dual('Pour Over', 'Classic Coffee', 35000, 37000),
  single('Flavour Gula Aren', 'Classic Coffee', 30000),
  dual('Flavour Salted Caramel', 'Classic Coffee', 32000, 34000)
];

// Insert: avoid duplicates (by name + destination)
const existingKey = new Set(
  db.menu_items
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
console.log(`✅ Updated db.json. Inserted ${inserted} Lembah Patih menus. Fixed slug: ${dest.slug}`);
