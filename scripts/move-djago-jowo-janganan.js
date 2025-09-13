const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '24'; // Djago Jowo
const NEW_CATEGORY = 'Aneka Janganan';

const items = db.menu_items || [];

const matchers = [
  /\bjangan\s*pare\b/i,
  /\bjangan\s*pakis\b/i,
  /\bbalado\s*terong\b/i,
  /\bjangan\s*genjer\b/i
];

let moved = 0;
for (const item of items) {
  if (String(item.destinationId) !== DEST_ID) continue;
  const name = item.name || '';
  if (matchers.some(rx => rx.test(name))) {
    if (item.category !== NEW_CATEGORY) {
      item.category = NEW_CATEGORY;
      item.updated_at = new Date().toISOString();
      moved++;
    }
  }
}

if (moved > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Moved ${moved} items to category '${NEW_CATEGORY}'.`);
} else {
  console.log('No matching items found to move.');
}


