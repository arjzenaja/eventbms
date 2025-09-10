const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updated = 0;

(db.menu_items || []).forEach(item => {
  if (item.category === 'Non Coffee') {
    // If only single price is set, move it to priceIced
    if ((item.priceIced == null) && (item.price != null)) {
      item.priceIced = item.price;
      item.price = null;
      updated++;
    }
    // If priceHot was accidentally set equal to priceIced for ice-only items, clear it
    if (item.priceHot != null && item.priceIced != null && item.priceHot === item.priceIced) {
      // Assume ice-only menu → clear hot
      item.priceHot = null;
      updated++;
    }
  }
});

if (updated > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

console.log(`✅ Normalized Non Coffee pricing. Records updated: ${updated}`);
