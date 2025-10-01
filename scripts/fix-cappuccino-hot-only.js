const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let changed = 0;

(db.menu_items || []).forEach(item => {
  if (/cappuccino/i.test(item.name) && item.category === 'Classic Coffee') {
    // Use available number as hot; prefer existing hot value else priceIced else price
    const hot = item.priceHot ?? item.price ?? item.priceIced ?? null;
    item.price = null;
    item.priceIced = null; // cappuccino hot only
    item.priceHot = hot || 29000; // default to 29000 if nothing found
    item.updated_at = new Date().toISOString();
    changed++;
  }
});

if (changed > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

console.log(`✅ Cappuccino normalized to hot-only. Updated: ${changed}`);
