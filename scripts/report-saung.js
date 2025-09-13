const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const items = db.menu_items || [];
const byDestId = items.filter(i => String(i.destinationId) === '20');
const byTitle = items.filter(i => (i.destinationTitle || '').trim().toLowerCase() === 'saung tepi sawah');

const dupMap = new Map();
for (const i of byDestId) {
  const key = `${(i.name||'').trim().toLowerCase()}|${(i.category||'').trim().toLowerCase()}`;
  dupMap.set(key, (dupMap.get(key) || 0) + 1);
}
const dups = [...dupMap.entries()].filter(([,v]) => v > 1).sort((a,b)=>b[1]-a[1]);

console.log(JSON.stringify({
  totalAll: items.length,
  totalByDestId: byDestId.length,
  totalByTitle: byTitle.length,
  sampleNames: byDestId.slice(0, 10).map(i => ({ name: i.name, category: i.category, id: i.id })),
  duplicateKeysCount: dups.length,
  topDuplicateKeys: dups.slice(0, 20)
}, null, 2));


