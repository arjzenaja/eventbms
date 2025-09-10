const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');
const DEST_ID = '4';
const DEST_TITLE = 'Lembah Patih';

function readDb(){ return JSON.parse(fs.readFileSync(DB_PATH,'utf8')); }
function writeDb(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2)); }
function nextId(db){ const ids=(db.menu_items||[]).map(i=>parseInt(i.id)||0); return (Math.max(0,...ids)+1).toString(); }

function upsert(db, item){
  if(!db.menu_items) db.menu_items=[];
  const idx = db.menu_items.findIndex(m => m.destinationId===DEST_ID && m.name.toLowerCase()===item.name.toLowerCase());
  if(idx>=0){ db.menu_items[idx] = { ...db.menu_items[idx], ...item, updated_at: new Date().toISOString() }; }
  else { db.menu_items.push({ id: nextId(db), ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }); }
}

function dual(name, category, hot, iced, description=''){
  return {
    name,
    description,
    price: null,
    priceIced: iced,
    priceHot: hot,
    cookingTime: '',
    category,
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

function single(name, category, price, description=''){
  return {
    name,
    description,
    price,
    priceIced: null,
    priceHot: null,
    cookingTime: '',
    category,
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

  const teaItems = [
    dual('Artisan Tropical Sunset','Tea',29_000,31_000,'Green tea, lychee, kiwi'),
    dual('Artisan Earl Grey','Tea',29_000,31_000,'Assam black tea, Ceylon black tea, Bergamot oil'),
    dual('Artisan Berry Heaven','Tea',29_000,31_000,'Black tea, Marigold flower, Goji berry, Cranberry'),
    dual('Artisan Blue Moon','Tea',29_000,31_000,'Butterfly pea, blueberry, blackcurrant, grape, mandarin orange'),
    single('Lychee Tea','Tea',28_000)
  ];

  const classicCoffeeItems = [
    dual('Americano','Classic Coffee',26_000,28_000),
    single('Cappuccino','Classic Coffee',29_000),
    dual('Café Latte','Classic Coffee',30_000,32_000),
    dual('Pour Over','Classic Coffee',35_000,37_000,'Imported roasted beans'),
    single('Flavour Gula Aren','Classic Coffee',30_000),
    dual('Flavour Salted Caramel','Classic Coffee',32_000,34_000)
  ];

  [...teaItems, ...classicCoffeeItems].forEach(item => upsert(db,item));
  writeDb(db);
  console.log(`✅ Upserted ${teaItems.length + classicCoffeeItems.length} items for Lembah Patih (Tea & Classic Coffee).`);
}

main();


