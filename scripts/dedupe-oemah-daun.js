const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '21'; // Oemah Daun

const keyOf = (item) => `${(item.name || '').trim().toLowerCase()}|${(item.category || '').trim().toLowerCase()}`;

const items = db.menu_items || [];
const targetItems = items.filter(i => (i.destinationId || '').toString() === DEST_ID);

const seen = new Map();
const removeIds = new Set();

for (const item of targetItems) {
  const k = keyOf(item);
  if (!seen.has(k)) {
    seen.set(k, item);
    continue;
  }
  const keep = seen.get(k);
  // Merge dual price fields if present
  keep.priceIced = keep.priceIced ?? item.priceIced ?? null;
  keep.priceHot = keep.priceHot ?? item.priceHot ?? null;
  if ((keep.priceIced != null || keep.priceHot != null)) keep.price = null;
  if (keep.price == null && item.price != null && keep.priceIced == null && keep.priceHot == null) {
    keep.price = item.price;
  }
  // Prefer keeping image if missing
  if (!keep.image && item.image) keep.image = item.image;
  keep.updated_at = new Date().toISOString();
  removeIds.add(item.id);
}

if (removeIds.size === 0) {
  console.log('No duplicates found for Oemah Daun.');
  process.exit(0);
}

const beforeCount = targetItems.length;

db.menu_items = items.filter(i => !removeIds.has(i.id));

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

const afterTarget = db.menu_items.filter(i => (i.destinationId || '').toString() === DEST_ID);
console.log(`Removed ${removeIds.size} duplicate items. Oemah Daun count: ${beforeCount} -> ${afterTarget.length}`);
