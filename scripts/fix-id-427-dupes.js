const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const used = new Set(db.menu_items.map(i => i.id.toString()));

const nextFreeId = () => {
  let max = Math.max(...[...used].map(v => parseInt(v, 10) || 0));
  let cand = max + 1;
  while (used.has(cand.toString())) cand += 1;
  used.add(cand.toString());
  return cand.toString();
};

let changed = 0;
for (const item of db.menu_items) {
  if (item.id && item.id.toString() === '427') {
    const old = item.id;
    item.id = nextFreeId();
    changed += 1;
    console.log(`Reassigned 427 -> ${item.id} (${item.name})`);
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Total reassigned:', changed);
