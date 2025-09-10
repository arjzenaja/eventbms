const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const used = new Set();
let maxId = 0;
for (const item of db.menu_items) {
  const n = parseInt(item.id, 10);
  if (!Number.isNaN(n)) maxId = Math.max(maxId, n);
}

let changes = 0;
for (const item of db.menu_items) {
  const idStr = (item.id ?? '').toString();
  if (!used.has(idStr)) {
    used.add(idStr);
    continue;
  }
  // duplicate; assign a new id
  maxId += 1;
  const newId = maxId.toString();
  console.log(`Duplicate ${idStr} -> ${newId} (${item.name})`);
  item.id = newId;
  used.add(newId);
  changes += 1;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

const ids = db.menu_items.map(i => i.id);
console.log('Reassigned:', changes, 'Total:', ids.length, 'Unique:', new Set(ids).size);
