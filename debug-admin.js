// Debug script untuk admin panel
console.log('🔍 Debugging Admin Panel...');

// Test fetch data
const debugAdminPanel = async () => {
  try {
    console.log('1. Testing menu API...');
    const menuResponse = await fetch('/api/culinary/menu');
    const menuData = await menuResponse.json();
    console.log('Menu API Response:', menuData);
    console.log('Menu items count:', menuData.menu_items?.length || 0);
    
    console.log('2. Testing kuliner API...');
    const kulinerResponse = await fetch('/api/kuliner');
    const kulinerData = await kulinerResponse.json();
    console.log('Kuliner API Response:', kulinerData);
    console.log('Kuliner count:', kulinerData.kuliner?.length || 0);
    
    // Check if data is properly structured
    if (menuData.success && menuData.menu_items) {
      console.log('✅ Menu data structure is correct');
      menuData.menu_items.forEach((item, index) => {
        console.log(`Menu ${index + 1}: ${item.name} - ${item.category} - Rp ${item.price}`);
      });
    } else {
      console.log('❌ Menu data structure issue:', menuData);
    }
    
  } catch (error) {
    console.error('❌ Debug Error:', error);
  }
};

// Run debug
debugAdminPanel();
