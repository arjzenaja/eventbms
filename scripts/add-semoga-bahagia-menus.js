const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '11';
const DEST_TITLE = 'Semoga Bahagia';

const dest = (db.kuliner || []).find(d => d.id === DEST_ID);
if (!dest) {
  console.error('❌ Destination not found:', DEST_ID);
  process.exit(1);
}
if (!dest.slug || dest.slug === 'Tidak Di Temukan') {
  dest.slug = 'semoga-bahagia';
}

if (!db.menu_items) db.menu_items = [];

function make(name, category, price, opts = {}) {
  return {
    name,
    description: opts.description || '',
    price: price ?? null,
    priceIced: opts.priceIced ?? null,
    priceHot: opts.priceHot ?? null,
    cookingTime: opts.cookingTime || '',
    category,
    destinationId: DEST_ID,
    destinationSlug: dest.slug || '',
    destinationTitle: DEST_TITLE,
    rating: 4.4,
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: [],
    flavorOptions: [],
    image: opts.image || ''
  };
}

const items = [
  // Kopi Dingin
  make('Es Kopi Kok Tong', 'kopi dingin', 12000),
  make('Es Kopi Susu Kok Tong', 'kopi dingin', 16000),
  make('Es Kopi Susu Pasaran', 'kopi dingin', 16000),
  make('Es Kopi Susu Cinnamon', 'kopi dingin', 16000),

  // Non Kopi Dingin
  make('Air Mineral', 'non kopi dingin', 6000),
  make('Es Teh', 'non kopi dingin', 7000),
  make('Soft Drink', 'non kopi dingin', 10000),
  make('Lemon Tea', 'non kopi dingin', 13000),
  make('Milo Dino', 'non kopi dingin', 16000),
  make('Teh Tarik', 'non kopi dingin', 16000),
  make('Matcha', 'non kopi dingin', 16000),
  make('Red Velvet', 'non kopi dingin', 16000),
  make('Banana', 'non kopi dingin', 16000),
  make('Susu Kocok Melon', 'non kopi dingin', 16000),
  make('Susu Kocok Cocopandan', 'non kopi dingin', 16000),
  make('Teh Tarik O Malaysia', 'non kopi dingin', 16000),
  make('Soda Gembira', 'non kopi dingin', 16000),
  make('Sarsaparilla', 'non kopi dingin', 16000),
  make('Coffee Beer', 'non kopi dingin', 16000),
  make('Badak', 'non kopi dingin', 17000),

  // Kopi Hangat
  make('Kopi Naga', 'kopi hangat', 7000),
  make('Kopi Susu Naga', 'kopi hangat', 12000),

  // Makanan
  make('Mie Rantau', 'makanan', 14000),
  make('Mie Rantau Telur', 'makanan', 17000),
  make('Indomie Kuah Spesial', 'makanan', 17000),
  make('Tambahan Telor', 'makanan', 3000),
];

// Insert avoiding duplicates (name+destination)
const existingKeys = new Set(
  db.menu_items
    .filter(m => m.destinationId === DEST_ID)
    .map(m => `${m.name}@@${m.destinationId}`)
);

let inserted = 0;
let idCursor = db.menu_items.length ? Math.max(...db.menu_items.map(x => Number(x.id) || 0)) + 1 : 1;
for (const m of items) {
  const key = `${m.name}@@${m.destinationId}`;
  if (!existingKeys.has(key)) {
    m.id = String(idCursor++);
    m.updated_at = new Date().toISOString();
    db.menu_items.push(m);
    existingKeys.add(key);
    inserted += 1;
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`✅ Inserted ${inserted} menus for Semoga Bahagia (id ${DEST_ID})`);



