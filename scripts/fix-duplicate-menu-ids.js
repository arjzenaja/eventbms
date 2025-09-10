const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const used = new Set();
for (const item of db.menu_items) {
  if (!used.has(item.id)) {
    used.add(item.id);
    continue;
  }
  // reassign id
  let candidate = Math.max(...[...used].map(x => parseInt(x, 10) || 0)) + 1;
  while (used.has(candidate.toString())) {
    candidate += 1;
  }
  const old = item.id;
  item.id = candidate.toString();
  used.add(item.id);
  console.log(`Reassigned duplicate id ${old} -> ${item.id} (${item.name})`);
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

const ids = db.menu_items.map(i => i.id);
console.log('Final counts - items:', ids.length, 'unique:', new Set(ids).size);
