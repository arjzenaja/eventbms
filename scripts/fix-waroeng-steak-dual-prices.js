const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

const PAIRS = [
  ['Chicken', 21818, 25455],
  ['Sirloin', 24545, 28182],
  ['Tenderloin', 26364, 30000],
  ['Dori Steak', 24545, 28182],
  ['Steak Waroeng (Chicken+Sirloin Udang)', 32727, 36363],
  ['Cordon Bleu', 35455, 39091],
  ['Chicken Double', 34545, 38182],
  ['Sirloin Double', 40000, 44545],
  ['Tenderloin Double', 44545, 49091],
];

function run() {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const items = db.menu_items || [];
  const byName = new Map(PAIRS.map(([n,b,c]) => [n.toLowerCase(), { b, c }]));
  let updated = 0;
  for (const it of items) {
    if ((it.category || '').toLowerCase() !== 'steak ala waroeng') continue;
    const key = (it.name || '').toLowerCase();
    const p = byName.get(key);
    if (!p) continue;
    it.priceBrown = p.b;
    it.priceCheese = p.c;
    it.price = null; // avoid single price confusion
    it.updated_at = new Date().toISOString();
    updated++;
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Updated ${updated} Steak Ala Waroeng items with dual prices.`);
}

run();


