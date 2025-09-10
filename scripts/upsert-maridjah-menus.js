const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');
const DEST_ID = '15';
const DEST_TITLE = 'Maridjah';

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getNextId(db) {
  const ids = (db.menu_items || []).map(i => parseInt(i.id) || 0);
  return (Math.max(0, ...ids) + 1).toString();
}

function upsert(db, item) {
  if (!db.menu_items) db.menu_items = [];
  const idx = db.menu_items.findIndex(m => m.destinationId === DEST_ID && m.name.toLowerCase() === item.name.toLowerCase());
  if (idx >= 0) {
    db.menu_items[idx] = { ...db.menu_items[idx], ...item, updated_at: new Date().toISOString() };
  } else {
    db.menu_items.push({ id: getNextId(db), ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
}

function dual(name, category, iced, hot, opts = {}) {
  return {
    name,
    description: opts.description || '',
    price: null,
    priceIced: iced,
    priceHot: hot,
    cookingTime: opts.cookingTime || '',
    category,
    destinationId: DEST_ID,
    destinationSlug: opts.destinationSlug || '',
    destinationTitle: DEST_TITLE,
    rating: 4.4,
    isPopular: !!opts.isPopular,
    isSpicy: !!opts.isSpicy,
    halal: true,
    available: true,
    additionalInfo: opts.additionalInfo || [],
    flavorOptions: [],
    image: opts.image || ''
  };
}

function single(name, category, price, opts = {}) {
  return {
    name,
    description: opts.description || '',
    price,
    priceIced: null,
    priceHot: null,
    cookingTime: opts.cookingTime || '',
    category,
    destinationId: DEST_ID,
    destinationSlug: opts.destinationSlug || '',
    destinationTitle: DEST_TITLE,
    rating: 4.4,
    isPopular: !!opts.isPopular,
    isSpicy: !!opts.isSpicy,
    halal: true,
    available: true,
    additionalInfo: opts.additionalInfo || [],
    flavorOptions: [],
    image: opts.image || ''
  };
}

function main() {
  const db = readDb();
  const items = [
    // Minuman es/panas (from photo reference)
    dual('Kopi Susu', 'Minuman', 15000, 13000, { additionalInfo: ['Sweet'] }),
    dual('Kopi Hitam', 'Kopi', 10000, 8000),
    dual('Kopi Tubruk', 'Kopi', 7000, 7000),
    dual('Teh Manis', 'Minuman', 7000, 7000),
    dual('Teh Tawar', 'Minuman', 5000, 5000),
    dual('Teh Kampul', 'Minuman', 10000, 8000),
    single('Es Campur', 'Minuman', 15000),
    dual('Teh Tarik', 'Minuman', 17000, 15000, { isPopular: true }),
    dual('Jeruk', 'Minuman', 10000, 8000),
    dual('Milo Malaka', 'Minuman', 17000, 15000),
    dual('Teh Leci', 'Minuman', 15000, 15000),
    single('Soda Gembira', 'Minuman', 15000),
    single('Air Mineral', 'Minuman', 7000),
    single('Limun Oriental', 'Minuman', 15000),

    // Camilan / Topping / Makanan
    single('Roti Bakar Coklat Keju', 'Makanan Ringan', 15000),
    single('Pisang Bakar Coklat Keju', 'Makanan Ringan', 15000),
    single('Pisang Goreng Gula Aren', 'Makanan Ringan', 17000),
    single('Martabak', 'Makanan Ringan', 7000),
    single('Kerang Bulari Goreng', 'Makanan Ringan', 15000),
    single('Bayam Krispi', 'Add Ons', 5000),
    single('Telor Ceplok', 'Add Ons', 5000),
    single('Nasi Putih', 'Add Ons', 5000),
    single('Donat Keju', 'Makanan Ringan', 6000),
    single('Donat Coklat', 'Makanan Ringan', 6000),
    single('Mendoan', 'Makanan Ringan', 15000),
    single('Kentang Goreng', 'Makanan Ringan', 17000),
    single('Indomie Goreng Telor', 'Makanan Utama', 15000),
    single('Indomie Rebus Telor', 'Makanan Utama', 15000),
    single('Indomie Dok Dok', 'Makanan Utama', 18000, { isPopular: true }),
    single('Nasi Kulit Ayam', 'Makanan Utama', 20000),
    single('Nasi Telor Barendo', 'Makanan Utama', 17000),
    single('Nasi Ayam Bawang', 'Makanan Utama', 22000),
    single('Nasi Ayam Telor Asin', 'Makanan Utama', 22000),
    single('Nasi Goreng Babat', 'Makanan Utama', 22000),
    single('Nasi Goreng Ati', 'Makanan Utama', 20000),
    single('Nasi Goreng Ayam', 'Makanan Utama', 17000),
    single('Mie Ayam Kumisan', 'Makanan Utama', 20000),
    single('Sambal Bawang', 'Add Ons', 5000, { isSpicy: true }),
    single('Sambal Ijo', 'Add Ons', 5000, { isSpicy: true })
  ];

  items.forEach(item => upsert(db, item));
  writeDb(db);
  console.log(`✅ Upserted ${items.length} Maridjah menu items with dual pricing where applicable.`);
}

main();


