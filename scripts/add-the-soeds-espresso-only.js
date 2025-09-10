const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');
const DEST_ID = '1';
const DEST_TITLE = 'The Soeds';

function readDb() { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function writeDb(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }
function nextId(db) { const ids=(db.menu_items||[]).map(i=>parseInt(i.id)||0); return (Math.max(0,...ids)+1).toString(); }

function upsert(db, item) {
  if (!db.menu_items) db.menu_items = [];
  const idx = db.menu_items.findIndex(m => m.destinationId===DEST_ID && m.name.toLowerCase()===item.name.toLowerCase());
  if (idx >= 0) db.menu_items[idx] = { ...db.menu_items[idx], ...item, updated_at: new Date().toISOString() };
  else db.menu_items.push({ id: nextId(db), ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
}

function dual(name, iced, hot) {
  return {
    name,
    description: '',
    price: null,
    priceIced: iced,
    priceHot: hot,
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
  };
}

function single(name, price) {
  return {
    name,
    description: '',
    price,
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
  };
}

function main(){
  const db = readDb();
  const items = [
    dual('Hazelnut Latte', 26000, null),
    dual('Crème Brulee', 28000, 24000),
    dual('Caramel Corn & Stars', 30000, null),
    dual('Caramel Machiato', 28000, 24000),
    dual('Latte', 24000, 22000),
    dual('Cappuccino', 24000, 22000),
    dual('Americano', 20000, 18000),
    dual('Affogato', 22000, null),
    dual('Flat White', null, 20000),
    dual('Piccolo Hot', null, 20000),
    single('Espresso', 10000),
    { ...single('Extra Shot', 5000), category: 'Add Ons' }
  ];
  items.forEach(it=>upsert(db,it));
  writeDb(db);
  console.log(`✅ Upserted ${items.length} THE ESPRESSO BASED items for The Soeds.`);
}

main();


