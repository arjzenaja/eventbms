// Test script untuk fungsi update menu
const testUpdateMenu = async () => {
  try {
    console.log('🔍 Testing Menu Update Function...');
    
    // Test 1: Check current menu data
    console.log('1. Checking current menu data...');
    const menuResponse = await fetch('/api/culinary/menu');
    const menuData = await menuResponse.json();
    
    if (menuData.success && menuData.menu_items && menuData.menu_items.length > 0) {
      const firstMenu = menuData.menu_items[0];
      console.log('First menu:', firstMenu);
      
      // Test 2: Update menu status
      console.log('2. Testing menu status update...');
      const formData = new FormData();
      formData.append('id', firstMenu.id);
      formData.append('available', 'false'); // Toggle status
      
      const updateResponse = await fetch('/api/culinary/menu', {
        method: 'PUT',
        body: formData,
      });
      
      const updateData = await updateResponse.json();
      console.log('Update response:', updateData);
      
      if (updateData.success) {
        console.log('✅ Menu update successful!');
        
        // Test 3: Verify the update
        console.log('3. Verifying the update...');
        const verifyResponse = await fetch('/api/culinary/menu');
        const verifyData = await verifyResponse.json();
        
        const updatedMenu = verifyData.menu_items.find(item => item.id === firstMenu.id);
        console.log('Updated menu:', updatedMenu);
        
        // Test 4: Toggle back to original status
        console.log('4. Toggling back to original status...');
        const formData2 = new FormData();
        formData2.append('id', firstMenu.id);
        formData2.append('available', 'true');
        
        const updateResponse2 = await fetch('/api/culinary/menu', {
          method: 'PUT',
          body: formData2,
        });
        
        const updateData2 = await updateResponse2.json();
        console.log('Second update response:', updateData2);
        
        if (updateData2.success) {
          console.log('✅ Menu update test completed successfully!');
        } else {
          console.log('❌ Second update failed:', updateData2.message);
        }
        
      } else {
        console.log('❌ Menu update failed:', updateData.message);
      }
      
    } else {
      console.log('❌ No menu data found to test');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  }
};

// Run the test
testUpdateMenu();
