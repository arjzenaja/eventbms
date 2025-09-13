const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '20'; // Saung Tepi Sawah
const CATEGORY = 'Ayam/Bebek';

const items = db.menu_items || [];

let updated = 0;

for (const item of items) {
  if (String(item.destinationId) !== DEST_ID) continue;
  if ((item.category || '') !== CATEGORY) continue;

  const name = (item.name || '').toLowerCase();

  // Ayam Kampung Goreng/Bakar → Sedang 27k, Besar 30k
  if (name.includes('ayam kampung') && (name.includes('goreng') || name.includes('bakar'))) {
    item.priceMedium = 27000;
    item.priceLarge = 30000;
    item.price = null;
    item.updated_at = new Date().toISOString();
    updated++;
    continue;
  }

  // Ingkung Ayam Kampung Goreng/Bakar → Sedang 110k, Besar 120k
  if (name.includes('ingkung ayam kampung') && (name.includes('goreng') || name.includes('bakar'))) {
    item.priceMedium = 110000;
    item.priceLarge = 120000;
    item.price = null;
    item.updated_at = new Date().toISOString();
    updated++;
    continue;
  }
}

if (updated > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Updated ${updated} Ayam/Bebek items with size prices (Sedang/Besar).`);
} else {
  console.log('No Ayam/Bebek items updated.');
}


