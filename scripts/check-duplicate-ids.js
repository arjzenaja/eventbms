const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const map = new Map();
const dupes = new Map();
for (const item of db.menu_items) {
  const id = (item.id ?? '').toString();
  if (map.has(id)) {
    if (!dupes.has(id)) dupes.set(id, [map.get(id)]);
    dupes.get(id).push(item);
  } else {
    map.set(id, item);
  }
}

if (dupes.size === 0) {
  console.log('No duplicate IDs.');
  process.exit(0);
}

console.log('Duplicate IDs found:', dupes.size);
for (const [id, items] of dupes) {
  console.log('ID', id, 'count', items.length);
  items.forEach(i => console.log(' -', i.name, '| dest', i.destinationTitle, '| cat', i.category));
}
