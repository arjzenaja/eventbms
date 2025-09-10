const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');
const DEST_ID = '3';
const DEST_TITLE = 'Loma Cafe';

function readDb(){ return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function writeDb(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2)); }
function nextId(db){ const ids=(db.menu_items||[]).map(i=>parseInt(i.id)||0); return (Math.max(0,...ids)+1).toString(); }

function upsert(db, item){
  if(!db.menu_items) db.menu_items=[];
  const idx=db.menu_items.findIndex(m=>m.destinationId===DEST_ID && m.name.toLowerCase()===item.name.toLowerCase());
  if(idx>=0){ db.menu_items[idx]={...db.menu_items[idx], ...item, updated_at:new Date().toISOString()}; }
  else { db.menu_items.push({id:nextId(db), ...item, created_at:new Date().toISOString(), updated_at:new Date().toISOString()}); }
}

function dual(name, category, hot, iced){
  return {
    name,
    description: '',
    price: null,
    priceIced: iced,
    priceHot: hot,
    cookingTime: '',
    category,
    destinationId: DEST_ID,
    destinationSlug: '',
    destinationTitle: DEST_TITLE,
    rating: 4.5,
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
  const db=readDb();

  const items=[
    // Tea Series (hot/ice same)
    dual('Jasmine Tea','Tea Series',12000,12000),
    dual('Milk Tea','Tea Series',15000,15000),
    dual('Lemon Tea','Tea Series',18000,18000),
    dual('Lychee Tea','Tea Series',18000,18000),

    // Coffee Series
    dual('Americano','Coffee Series',15000,15000),
    dual('Cappuccino','Coffee Series',20000,20000),
    dual('Loma Coffee','Coffee Series',20000,20000),

    // Milk Series
    dual('Chocolate','Milk Series',22000,22000),
    dual('Matcha Latte','Milk Series',22000,22000),

    // Fruits Series
    dual('Orange','Fruits Series',15000,15000),
    dual('Honey Lemon','Fruits Series',18000,18000),
    dual('Guava Juice','Fruits Series',18000,18000),
    dual('Strawberry Juice','Fruits Series',20000,20000),
    dual('Avocado Juice','Fruits Series',20000,20000),
    dual('Blue Ocean','Fruits Series',22000,22000),
  ];

  items.forEach(it=>upsert(db,it));
  writeDb(db);
  console.log(`✅ Upserted ${items.length} beverage items for Loma Cafe with dual pricing.`);
}

main();


