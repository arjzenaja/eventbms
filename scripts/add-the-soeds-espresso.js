const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');
const DEST_ID = '1';
const DEST_TITLE = 'The Soeds';

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
  const idx = db.menu_items.findIndex(
    m => m.destinationId === DEST_ID && m.name.toLowerCase() === item.name.toLowerCase()
  );
  if (idx >= 0) {
    db.menu_items[idx] = { ...db.menu_items[idx], ...item, updated_at: new Date().toISOString() };
  } else {
    db.menu_items.push({ id: getNextId(db), ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
}

function dual(name, iced, hot, opts = {}) {
  return {
    name,
    description: opts.description || '',
    price: null,
    priceIced: iced,
    priceHot: hot,
    cookingTime: opts.cookingTime || '',
    category: 'THE ESPRESSO BASED',
    destinationId: DEST_ID,
    destinationSlug: opts.destinationSlug || '',
    destinationTitle: DEST_TITLE,
    rating: 4.6,
    isPopular: !!opts.isPopular,
    isSpicy: false,
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
    // THE ESPRESSO BASED (from image)
    { category: 'THE ESPRESSO BASED', ...dual('Hazelnut Latte', 26000, null) },
    { category: 'THE ESPRESSO BASED', ...dual('Crème Brulee', 28000, 24000) },
    { category: 'THE ESPRESSO BASED', ...dual('Caramel Corn & Stars', 30000, null) },
    { category: 'THE ESPRESSO BASED', ...dual('Caramel Macchiato', 28000, 24000) },
    { category: 'THE ESPRESSO BASED', ...dual('Latte', 24000, 22000) },
    { category: 'THE ESPRESSO BASED', ...dual('Cappuccino', 24000, 22000, { isPopular: true }) },
    { category: 'THE ESPRESSO BASED', ...dual('Americano', 20000, 18000) },
    { category: 'THE ESPRESSO BASED', ...dual('Affogato', 22000, null) },
    // Only hot
    { category: 'THE ESPRESSO BASED', ...dual('Flat White', null, 20000) },
    { category: 'THE ESPRESSO BASED', ...dual('Piccolo Hot', null, 20000) },
    // Single price espresso & extra shot
    {
      name: 'Espresso',
      description: '',
      price: 10000,
      priceIced: null,
      priceHot: null,
      cookingTime: '',
      category: 'THE ESPRESSO BASED',
      destinationId: DEST_ID,
      destinationSlug: '',
      destinationTitle: DEST_TITLE,
      rating: 4.6,
      isPopular: false,
      isSpicy: false,
      halal: true,
      available: true,
      additionalInfo: [],
      flavorOptions: [],
      image: ''
    },
    {
      name: 'Extra Shot',
      description: '',
      price: 5000,
      priceIced: null,
      priceHot: null,
      cookingTime: '',
      category: 'Add Ons',
      destinationId: DEST_ID,
      destinationSlug: '',
      destinationTitle: DEST_TITLE,
      rating: 4.6,
      isPopular: false,
      isSpicy: false,
      halal: true,
      available: true,
      additionalInfo: [],
      flavorOptions: [],
      image: ''
    },

    // SOED'S Signature
    {
      name: 'Iced Soe-Kopyor',
      description: '',
      price: 22000,
      priceIced: null,
      priceHot: null,
      cookingTime: '',
      category: "SOED'S Signature",
      destinationId: DEST_ID,
      destinationSlug: '',
      destinationTitle: DEST_TITLE,
      rating: 4.6,
      isPopular: false,
      isSpicy: false,
      halal: true,
      available: true,
      additionalInfo: [],
      flavorOptions: [],
      image: ''
    },
    {
      name: 'Iced Coffee Soe-Kopyor',
      description: '',
      price: 24000,
      priceIced: null,
      priceHot: null,
      cookingTime: '',
      category: "SOED'S Signature",
      destinationId: DEST_ID,
      destinationSlug: '',
      destinationTitle: DEST_TITLE,
      rating: 4.6,
      isPopular: false,
      isSpicy: false,
      halal: true,
      available: true,
      additionalInfo: [],
      flavorOptions: [],
      image: ''
    },

    // ARTISAN TEA (IDR 23k each)
    ...[
      'Forest Berry',
      'Dark Opium',
      'Royal Java',
      'Cotton Candy',
      'Mango Mint',
      'Tropical Blue',
      'Minty Iced Cream',
      'Lemon Vanilla',
      'Strawberry Fragia'
    ].map(name => ({
      name,
      description: '',
      price: 23000,
      priceIced: null,
      priceHot: null,
      cookingTime: '',
      category: 'ARTISAN TEA',
      destinationId: DEST_ID,
      destinationSlug: '',
      destinationTitle: DEST_TITLE,
      rating: 4.6,
      isPopular: false,
      isSpicy: false,
      halal: true,
      available: true,
      additionalInfo: [],
      flavorOptions: [],
      image: ''
    }))
  ];

  items.forEach(item => upsert(db, item));
  writeDb(db);
  console.log(`✅ Upserted ${items.length} items for The Soeds (Espresso/Signature/Artisan Tea).`);
}

main();


