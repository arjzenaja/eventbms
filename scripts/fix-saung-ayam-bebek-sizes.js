const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '20'; // Saung Tepi Sawah
const CATEGORY = 'Ayam/Bebek';

const items = db.menu_items || [];
const target = items.filter(i => String(i.destinationId) === DEST_ID && (i.category || '') === CATEGORY);

// Normalize name by removing size tokens (Sedang/Besar)
const normalizeName = (name) => {
  if (!name) return '';
  // Replace ` Sedang ` and ` Besar ` tokens when they are separate words
  return name
    .replace(/\bSedang\b/gi, '')
    .replace(/\bBesar\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const groups = new Map();
for (const item of target) {
  const baseName = normalizeName(item.name || '');
  const key = `${baseName}|${CATEGORY}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(item);
}

const removeIds = new Set();
let mergedCount = 0;

for (const [key, group] of groups.entries()) {
  if (group.length < 2) continue;
  // Find candidates: ones containing Sedang vs Besar
  const medium = group.find(g => /\bSedang\b/i.test(g.name || ''));
  const large = group.find(g => /\bBesar\b/i.test(g.name || ''));

  // Pick a representative to keep (prefer medium)
  const keep = medium || group[0];

  if (medium) {
    keep.priceMedium = medium.price != null ? medium.price : keep.priceMedium ?? null;
  }
  if (large) {
    keep.priceLarge = large.price != null ? large.price : keep.priceLarge ?? null;
  }

  // Clear single price if medium/large exist
  if (keep.priceMedium != null || keep.priceLarge != null) {
    keep.price = null;
  }

  // Set normalized name for the kept item
  keep.name = key.split('|')[0];
  keep.updated_at = new Date().toISOString();

  // Mark others (except keep) for removal
  for (const g of group) {
    if (g.id !== keep.id) removeIds.add(g.id);
  }
  mergedCount++;
}

if (removeIds.size > 0) {
  const before = db.menu_items.length;
  db.menu_items = items.filter(i => !removeIds.has(i.id));
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  const after = db.menu_items.length;
  console.log(`Merged ${mergedCount} size groups. Removed ${removeIds.size} items. Total: ${before} -> ${after}`);
} else {
  console.log('No size-based duplicates found to merge for Saung Tepi Sawah Ayam/Bebek.');
}


