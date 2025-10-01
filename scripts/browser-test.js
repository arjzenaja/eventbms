// Test script untuk dijalankan di browser console
// Copy dan paste script ini di browser console saat membuka halaman admin menu

console.log('🔍 Testing Admin Menu Panel...');

// Test 1: Check if data is loaded
console.log('Current menuItems:', window.menuItems || 'Not found');
console.log('Current culinaryDestinations:', window.culinaryDestinations || 'Not found');

// Test 2: Manual API calls
const testAPIs = async () => {
  try {
    // Test menu API
    console.log('Testing /api/kuliner/menu...');
    const menuResponse = await fetch('/api/kuliner/menu');
    const menuData = await menuResponse.json();
    console.log('Menu API Result:', menuData);
    
    // Test kuliner API
    console.log('Testing /api/kuliner...');
    const kulinerResponse = await fetch('/api/kuliner');
    const kulinerData = await kulinerResponse.json();
    console.log('Kuliner API Result:', kulinerData);
    
    // Check if data exists
    if (menuData.success && menuData.menu_items && menuData.menu_items.length > 0) {
      console.log('✅ Menu data found:', menuData.menu_items.length, 'items');
      menuData.menu_items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} - ${item.category} - Rp ${item.price}`);
      });
    } else {
      console.log('❌ No menu data found');
    }
    
    if (kulinerData.success && kulinerData.kuliner && kulinerData.kuliner.length > 0) {
      console.log('✅ Kuliner data found:', kulinerData.kuliner.length, 'destinations');
      kulinerData.kuliner.forEach((dest, index) => {
        console.log(`  ${index + 1}. ${dest.title} (ID: ${dest.id})`);
      });
    } else {
      console.log('❌ No kuliner data found');
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Run the test
testAPIs();
