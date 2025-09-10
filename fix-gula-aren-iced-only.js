const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let changed = 0;

(db.menu_items || []).forEach(item => {
  if (/flavour\s*gula\s*aren/i.test(item.name) && item.category === 'Classic Coffee') {
    const iced = item.priceIced ?? item.price ?? item.priceHot ?? 30000;
    item.price = null;
    item.priceIced = iced;
    item.priceHot = null;
    item.updated_at = new Date().toISOString();
    changed++;
  }
});

if (changed > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

console.log(`✅ Flavour Gula Aren set to iced-only. Updated: ${changed}`);
