const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const tamanLangit = db.kuliner.find(dest => dest.title === 'Taman Langit');
if (!tamanLangit) {
  console.log('Taman Langit not found');
  process.exit(1);
}

const menuItems = [
  // Tala Ice Cream
  { name: 'Choco Brownie', category: 'Tala Ice Cream', price: 28000, description: '3 scoops of chocolate ice cream, served with brownie pieces and grated dark chocolate' },
  { name: 'Vanilla Cookie\'s', category: 'Tala Ice Cream', price: 28000, description: '3 scoops of vanilla ice cream, topped with caramel sauce, Oreo crumbs, and a whole Oreo cookie' },
  { name: 'Vanilla Regal', category: 'Tala Ice Cream', price: 28000, description: '3 scoops of vanilla ice cream, served with caramel crumbs, Regal biscuits, and caramel sauce' },
  { name: 'Strawberry Cheese', category: 'Tala Ice Cream', price: 28000, description: '3 scoops of strawberry ice cream, accompanied by red velvet crumbs, grated cheddar cheese, and a Ritz biscuit' },
  { name: 'Affogato', category: 'Tala Ice Cream', price: 28000, description: '3 scoops of vanilla ice cream, served with espresso and caramel sauce' },
  { name: 'Tala Mix Ice Cream', category: 'Tala Ice Cream', price: 32000, description: '1 scoop each of vanilla, chocolate, and strawberry ice cream, topped with grated cheddar cheese, Oreo crumbs, and fresh strawberry slices' },

  // Signature Drink
  { name: 'Strawberry Aperol Sour', category: 'Signature Drink', price: 37000, description: 'Strawberry Vanilla With Rosela Flower' },
  { name: 'Guavalush', category: 'Signature Drink', price: 37000, description: 'Guava juice - Mint - Grenadine - Lime' },
  { name: 'Hazzy Mac Irish', category: 'Signature Drink', price: 37000, description: 'Irish Cream With Espresso & Nutty' },
  { name: 'Irish Butter Beer', category: 'Signature Drink', price: 37000, description: 'Irish Cream With Zero Cola' },

  // Mocktail & Soda
  { name: 'Pinky Peach', category: 'Mocktail & Soda', price: 35000, description: 'Soda - Peach - Strawberry - Leci - Mint' },
  { name: 'Summer Feeling', category: 'Mocktail & Soda', price: 35000, description: 'Soda - Blue Citrus - Lychee - Madu - Mint' },
  { name: 'Mojito', category: 'Mocktail & Soda', price: 35000, description: 'Soda - Lemon - Lime - Syrup - Mint' },
  { name: 'Radiation Breeze', category: 'Mocktail & Soda', price: 35000, description: 'Apple Lime Soda, Lemon, Blue Citrus, Mint' },
  { name: 'Tropical Punch', category: 'Mocktail & Soda', price: 35000, description: '4 Punch Of Tropical Fruits, Grenadine, Dry Lemon' },
  { name: 'Pina Splash', category: 'Mocktail & Soda', price: 35000, description: 'Pineapple, Peach, Coconut Water, Dry Pineapple' },
  { name: 'Apple Blast', category: 'Mocktail & Soda', price: 35000, description: 'Jahe Merah, Apple Juice, Peach, Dry Apple' },
  { name: 'Morphling', category: 'Mocktail & Soda', price: 35000, description: 'Orange Juice, Madu, Orange Sunkist, Lychee, Blue Citrus, Soda' },
  { name: 'Aurora', category: 'Mocktail & Soda', price: 35000, description: 'Butterfly Pea, Lychee, Jelly, Soda' },

  // Fritsy Drink
  { name: 'Apple Freeze', category: 'Fritsy Drink', price: 35000, description: 'Apple Juice - Mint - Coconut Water' },
  { name: 'Cucumber Collins', category: 'Fritsy Drink', price: 35000, description: 'Soda - Blue Curacao - Cucumber - Mint - Lime' },

  // Frappe & Shake
  { name: 'Frappio Matcha', category: 'Frappe & Shake', price: 38000, description: 'Matcha - Susu Full Cream - Oreo Crumb - Vanilla Eskrim' },
  { name: 'Ringo Manggo', category: 'Frappe & Shake', price: 38000, description: 'Mango Frappe - Peach - Yakult - Vanilla Eskrim' },
  { name: 'RhumBaccino', category: 'Frappe & Shake', price: 38000, description: 'Espresso - Cokelat Rum Syrup - Dark Cokelat - Cokelat Eskrim' },
  { name: 'Monstro Milo', category: 'Frappe & Shake', price: 38000, description: 'Milo - Cokelat Sauce - Susu Full Cream - Eskrim Coklat' },
  { name: 'Cookie\'s Scream', category: 'Frappe & Shake', price: 38000, description: 'Vanilla - Oreo Crumb - Susu Full Cream - Eskrim Vanilla' },
  { name: 'Frappio Taro', category: 'Frappe & Shake', price: 38000, description: 'Taro - Susu Full Cream - Oreo Crumb - Eskrim Vanilla' },
  { name: 'Avocado Cino', category: 'Frappe & Shake', price: 38000, description: 'Espresso - Avocado Frappe - Dark Chocolate - Vanilla Eskrim' },
  { name: 'Chizzu Ichigo', category: 'Frappe & Shake', price: 38000, description: 'Strawberry Frappe - CreamCheese - Strawberry Eskrim' },
  { name: 'Gomu No', category: 'Frappe & Shake', price: 38000, description: 'Bubble Gum Frappe - Strawberry Sauce - Marshmellow - Strawberry Eskrim' },
  { name: 'Butter Crumbs', category: 'Frappe & Shake', price: 38000, description: 'Caramel - Vanilla - Butter Cookies - Caramel Sauce - Vanilla Eskrim' },
  { name: 'Cora Cora', category: 'Frappe & Shake', price: 38000, description: 'Dark Cokelat - Caramel - Hazzelnut - Marshmellow' },

  // Based Macchiato
  { name: 'Salted Caramel Macchiato', category: 'Based Macchiato', price: 34000, description: 'Salted - Espresso - Caramel Sauce - Susu Full Cream - Macchiato' },
  { name: 'Butterscotch Macchiato', category: 'Based Macchiato', price: 34000, description: 'Butterscotch Sauce - Espresso - Susu Full Cream - Caramel Crumb - Macchiato' },
  { name: 'Matcha Macchiato', category: 'Based Macchiato', price: 34000, description: 'Matcha - Susu Full Cream - Macchiato' },
  { name: 'Red Velvet Macchiato', category: 'Based Macchiato', price: 34000, description: 'Red Velvet - Susu Full Cream - Macchiato' },
  { name: 'Taro Macchiato', category: 'Based Macchiato', price: 34000, description: 'Taro - Susu Full Cream - Macchiato' },

  // Ultimate Tea
  { name: 'Hot Milk Tea', category: 'Ultimate Tea', priceHot: 25000, description: 'Signature Teh Taman Langit - Susu Steam' },
  { name: 'Hot Jasmine Tea', category: 'Ultimate Tea', priceHot: 22000, description: 'Teh Celup Melati' },
  { name: 'Hot Lemon Tea', category: 'Ultimate Tea', priceHot: 25000, description: 'Signature Teh Taman Langit - Madu - Lemon' },
  { name: 'Ice Tea', category: 'Ultimate Tea', priceIced: 22000, description: 'Signature Teh Taman Langit - Simple Syrup' },
  { name: 'Iced Yuzu Lemon Tea', category: 'Ultimate Tea', priceIced: 28000, description: 'Signature Teh Taman Langit - Yuzu Citrus - Lemon' },
  { name: 'Lychee Tea', category: 'Ultimate Tea', priceIced: 28000, description: 'Signature Teh Taman Langit - Lychee' },
  { name: 'Berry Tea', category: 'Ultimate Tea', priceIced: 28000, description: 'Signature Teh Taman Langit - Fresh Strawberry' },
  { name: 'Peach Tea', category: 'Ultimate Tea', priceIced: 28000, description: 'Signature Teh Taman Langit - Peach - Mandarin Orange' },
  { name: 'Rum Tea', category: 'Ultimate Tea', priceIced: 28000, description: 'Signature Teh Taman Langit - Rum - Mint' },
  { name: 'Tala Iced Milk Tea', category: 'Ultimate Tea', priceIced: 28000, description: 'Signature Teh Taman Langit - Gula Aren - Susu Full Cream' },

  // Based Ice Espresso
  { name: 'Iced Americano', category: 'Based Ice Espresso', priceIced: 34000, description: 'Espresso - Ice Cube - Mineral Water' },
  { name: 'Mocha Presso', category: 'Based Ice Espresso', priceIced: 38000, description: 'Espresso - Dark Cokelat - Susu Full Cream' },
  { name: 'Coffee Lattee Ice', category: 'Based Ice Espresso', priceIced: 38000, description: 'Espresso - Susu Full Cream' },
  { name: 'Double Shaken', category: 'Based Ice Espresso', priceIced: 38000, description: 'Double Shoot Espresso - Susu Full Cream - Aren' },
  { name: 'Cappuccino Presso', category: 'Based Ice Espresso', priceIced: 38000, description: 'Espresso - Susu Full Cream - Foam' },
  { name: 'Caramel Presso', category: 'Based Ice Espresso', priceIced: 38000, description: 'Espresso - Caramel - Susu Full Cream' },
  { name: 'Tala Ice Coffee', category: 'Based Ice Espresso', priceIced: 38000, description: 'Espresso - Susu Full Cream - Aren' },
  { name: 'Black Smack', category: 'Based Ice Espresso', priceIced: 38000, description: 'Espresso - Apple Lime Soda - Dry Lemon' },

  // Hot Stuff
  { name: 'Hot Americano', category: 'Hot Stuff', priceHot: 28000, description: 'Espresso - Hot Water' },
  { name: 'Warm Caramel Latte', category: 'Hot Stuff', priceHot: 32000, description: 'Espresso - Caramel - 65 Celcius Susu Steam dengan Foam' },
  { name: 'Warm Hazelnut Latte', category: 'Hot Stuff', priceHot: 32000, description: 'Espresso - Hazelnut - 65 Celcius Susu Steam dengan Foam' },
  { name: 'Warm Mochaccino', category: 'Hot Stuff', priceHot: 32000, description: 'Espresso - Dark Cokelat - 65 Celcius Susu Steam dengan Foam' },
  { name: 'Warm Milo', category: 'Hot Stuff', priceHot: 28000, description: '65 Celcius Susu Stream dengan Choco Milo' },
  { name: 'Warm Coffee Latte', category: 'Hot Stuff', priceHot: 32000, description: 'Espresso - 65 Celcius Susu Steam dengan Foam' },
  { name: 'Warm Cappuccino', category: 'Hot Stuff', priceHot: 32000, description: 'Espresso - 65 Celcius Susu Steam dengan Thick Foam' },
  { name: 'Warm Red Velvet Latte', category: 'Hot Stuff', priceHot: 32000, description: '65 Celcius Susu Stream dengan Red Velvet' },
  { name: 'Warm Matcha Latte', category: 'Hot Stuff', priceHot: 32000, description: '65 Celcius Susu Stream dengan Matcha' },
  { name: 'Wedang Jahe', category: 'Hot Stuff', priceHot: 25000, description: 'Wedang Jahe Panas' },
  { name: 'Wedang Jahe Susu', category: 'Hot Stuff', priceHot: 28000, description: 'Wedang Jahe Panas dengan Susu' },
  { name: 'Magic Latte', category: 'Hot Stuff', priceHot: 32000, description: 'Double Ristretto with Susu Steam' }
];

let addedCount = 0;
let updatedCount = 0;

menuItems.forEach(item => {
  const existingIndex = db.menu_items.findIndex(menu => 
    menu.name === item.name && menu.destinationId === tamanLangit.id
  );

  const menuData = {
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price || null,
    priceIced: item.priceIced || null,
    priceHot: item.priceHot || null,
    cookingTime: '5-15 menit',
    destinationId: tamanLangit.id,
    destinationSlug: tamanLangit.slug,
    destinationTitle: tamanLangit.title,
    rating: 4.5,
    isPopular: Math.random() > 0.7,
    halal: true,
    available: true,
    additionalInfo: ['Fresh', 'Premium']
  };

  if (existingIndex !== -1) {
    db.menu_items[existingIndex] = { ...db.menu_items[existingIndex], ...menuData };
    updatedCount++;
  } else {
    const newId = Math.max(...db.menu_items.map(m => parseInt(m.id) || 0)) + 1;
    db.menu_items.push({ id: newId.toString(), ...menuData });
    addedCount++;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`✅ Taman Langit all categories added!`);
console.log(`📊 Added: ${addedCount}, Updated: ${updatedCount}`);
console.log(`🔍 Check: http://localhost:3000/admin/culinary/menu`);
