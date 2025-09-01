// Test script untuk mengecek API menu
const testMenuAPI = async () => {
  try {
    console.log('Testing API menu...');
    
    // Test GET menu
    const response = await fetch('/api/culinary/menu');
    const data = await response.json();
    
    console.log('API Response:', data);
    console.log('Menu items count:', data.menu_items?.length || 0);
    
    if (data.success && data.menu_items && data.menu_items.length > 0) {
      console.log('✅ Menu data found:', data.menu_items.length, 'items');
      data.menu_items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - Rp ${item.price}`);
      });
    } else {
      console.log('❌ No menu data found');
    }
    
  } catch (error) {
    console.error('❌ API Error:', error);
  }
};

// Test API kuliner destinations
const testKulinerAPI = async () => {
  try {
    console.log('Testing API kuliner...');
    
    const response = await fetch('/api/kuliner');
    const data = await response.json();
    
    console.log('Kuliner API Response:', data);
    console.log('Kuliner count:', data.kuliner?.length || 0);
    
  } catch (error) {
    console.error('❌ Kuliner API Error:', error);
  }
};

// Run tests
testMenuAPI();
testKulinerAPI();
