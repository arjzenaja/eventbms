const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '8'; // Els Koffie

const keyOf = (item) => `${(item.name || '').trim().toLowerCase()}|${(item.category || '').trim().toLowerCase()}`;

const items = db.menu_items || [];
const elsItems = items.filter(i => (i.destinationId || '').toString() === DEST_ID);

const seen = new Map();
const removeIds = new Set();

for (const item of elsItems) {
  const k = keyOf(item);
  if (!seen.has(k)) {
    seen.set(k, item);
    continue;
  }
  // merge into existing
  const keep = seen.get(k);
  // Prefer explicit dual pricing values if present
  keep.priceIced = keep.priceIced ?? item.priceIced ?? null;
  keep.priceHot = keep.priceHot ?? item.priceHot ?? null;
  // If either side has dual values but price (single) exists, null it to avoid conflicts
  if ((keep.priceIced != null || keep.priceHot != null)) keep.price = null;
  // If still single price and missing, fill from duplicate
  if (keep.price == null && item.price != null && keep.priceIced == null && keep.priceHot == null) {
    keep.price = item.price;
  }
  // Mark duplicate for removal
  removeIds.add(item.id);
}

if (removeIds.size === 0) {
  console.log('No duplicates found for Els Koffie.');
  process.exit(0);
}

const beforeCount = elsItems.length;

db.menu_items = items.filter(i => !removeIds.has(i.id));

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

const afterEls = db.menu_items.filter(i => (i.destinationId || '').toString() === DEST_ID);
console.log(`Removed ${removeIds.size} duplicate items. Els Koffie count: ${beforeCount} -> ${afterEls.length}`);
