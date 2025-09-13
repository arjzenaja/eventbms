const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const DEST_ID = '25';
const DEST_TITLE = 'Waroeng Steak';

function readDb() { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); }
function nextId(db) {
  const nums = (db.menu_items||[]).map(i=>parseInt(i.id)).filter(n=>!isNaN(n));
  const max = nums.length?Math.max(...nums):0; return (max+1).toString();
}
function item(name, price, category, desc='') {
  return {
    id:'', name, description:desc, price,
    cookingTime:'10-20 menit', category,
    destinationId: DEST_ID, destinationSlug:'', destinationTitle: DEST_TITLE,
    rating:4.6, isPopular:false, isSpicy:false, halal:true, available:true,
    additionalInfo:['Halal'], image:'/placeholder.jpg',
    created_at:new Date().toISOString(), updated_at:new Date().toISOString()
  };
}

function run(){
  const db = readDb();
  db.menu_items = db.menu_items || [];
  // Clear existing
  db.menu_items = db.menu_items.filter(i => String(i.destinationId) !== DEST_ID);

  const rows = [];

  // Mix Double
  rows.push(item('Paket Mix Double (Chicken & Sirloin) + Fresh Lime', 48182, 'Mix Double'));

  // Rice Series (menu paket)
  rows.push(item('Paket Chicko', 27727, 'Rice Series'));
  rows.push(item('Paket Sirlo', 30909, 'Rice Series'));
  rows.push(item('Rice Bowl Chicken', 14545, 'Rice Series'));
  rows.push(item('Rice Bowl Dori', 15909, 'Rice Series'));
  rows.push(item('Chicken Sambal Korek', 28182, 'Rice Series'));
  rows.push(item('Dori Sambal Korek', 31818, 'Rice Series'));
  rows.push(item('Beef Sambal Korek', 32273, 'Rice Series'));
  rows.push(item('Beef Slice', 26364, 'Rice Series'));

  // Steak Ala Waroeng (Brown Sauce / Cheese Sauce: pricing pairs -> put Brown as price, Cheese as description)
  const ala = [
    ['Chicken', 21818, 'Cheese 25455'],
    ['Sirloin', 24545, 'Cheese 28182'],
    ['Tenderloin', 26364, 'Cheese 30000'],
    ['Dori Steak', 24545, 'Cheese 28182'],
    ['Steak Waroeng (Chicken+Sirloin Udang)', 32727, 'Cheese 36363'],
    ['Cordon Bleu', 35455, 'Cheese 39091'],
    ['Chicken Double', 34545, 'Cheese 38182'],
    ['Sirloin Double', 40000, 'Cheese 44545'],
    ['Tenderloin Double', 44545, 'Cheese 49091']
  ];
  ala.forEach(([n,p,desc])=>rows.push(item(n,p,'Steak Ala Waroeng',desc)));

  // Steak Grill (Lokal + Premium)
  const grill = [
    ['Chicken Mushroom', 29091],
    ['Chicken Pepper', 29091],
    ['Beef Steak', 40909],
    ['Beef Blackpepper', 40909],
    ['Dori Grill', 37273],
    ['Beef Bulky (kentang/spaghetti)', 50909],
    ['Chicken BBQ', 35455],
    ['Dori BBQ', 44545],
    ['Beef BBQ', 90000],
    ['Australian Sirloin', 104545],
    ['Wagyu Meltique', 98182]
  ];
  grill.forEach(([n,p])=>rows.push(item(n,p,'Steak Grill')));

  // Spaghetti
  rows.push(item('Spaghetti Beef Spicy', 20455, 'Spaghetti'));
  rows.push(item('Spaghetti Bolognese', 18182, 'Spaghetti'));

  // Camilan + Additional Menu (group under Camilan)
  const camilan = [
    ['Cheese Wedges', 14545],
    ['Cheese Fries', 19091],
    ['Cheese Sozis Fries', 19091],
    ['Kentang Lokal', 10000],
    ['Fries', 16364],
    ['Chicken Pop Crunchy', 15909],
    ['Fish Pop Crunchy', 15909],
    ['Drumstick', 18182],
    ['Mix Vegetable', 6364],
    ['Mushroom', 6364],
    ['Nasi Putih', 7273],
    ['Telur', 6364],
    ['Sambal Korek', 6364],
    ['Brown Sauce', 6818],
    ['Cheese Sauce', 10909]
  ];
  camilan.forEach(([n,p])=>rows.push(item(n,p,'Camilan')));

  // Coffee
  const coffee = [
    ['Cafe Latte', 22727],
    ['Caramel Latte', 22727],
    ['Kopi Susu Gula Aren', 22727],
    ['Caramel Machiato', 25455]
  ];
  coffee.forEach(([n,p])=>rows.push(item(n,p,'Coffee')));

  // Milkshake & Float
  const milk = [
    ['Milkshake (Chocolate/Strawberry/Vanilla)', 20000],
    ['Milkshake Special (Chocolate/Strawberry/Vanilla)', 23636],
    ['Milky Strawberry', 20000],
    ['Lemon Squash Float', 18182],
    ['Lychee Squash Float', 18182],
    ['Orange Float', 22727]
  ];
  milk.forEach(([n,p])=>rows.push(item(n,p,'Milkshake & Float')));

  // Tea & Lime
  const tea = [
    ['Teh Tawar (ice/hot)', 7273],
    ['Teh Manis (ice/hot)', 10909],
    ['Fresh Lime (ice/hot)', 16364],
    ['Honey Lime (ice/hot)', 17273],
    ['Lemon Tea (ice/hot)', 17273],
    ['Lychee Tea (ice/hot)', 17273],
    ['Air Mineral Botol', 10000],
    ['Orange', 19091]
  ];
  tea.forEach(([n,p])=>rows.push(item(n,p,'Tea & Lime')));

  // Waroeng Ice Cream
  rows.push(item('Waroeng Ice Cream', 8182, 'Waroeng Ice Cream'));

  // Super Box
  rows.push(item('Super Box', 137273, 'Super Box', '3 Chicken, 2 Tenderloin, 3 Drumstick, 1 Fries Reg, 4 Rice, 2 Brown Sauce, 2 Cheese Sauce, 4 Chili Sauce Sachet'));

  // Assign IDs and insert
  const existing = new Set(
    db.menu_items.filter(i=>String(i.destinationId)===DEST_ID)
      .map(i=>`${(i.name||'').trim().toLowerCase()}|${(i.category||'').trim().toLowerCase()}`)
  );
  let inserted = 0;
  for (const r of rows) {
    const key = `${r.name.trim().toLowerCase()}|${r.category.trim().toLowerCase()}`;
    if (existing.has(key)) continue;
    r.id = nextId(db);
    db.menu_items.push(r);
    existing.add(key);
    inserted++;
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Inserted ${inserted} Waroeng Steak items.`);
}

run();


