// Test Payment System
// Run with: node test-payment-system.js

const testPaymentSystem = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Payment System...\n');

  // Test 1: Create Payment
  console.log('1. Testing Create Payment...');
  try {
    const paymentData = {
      orderData: {
        eventId: "1",
        eventName: "Test Event",
        ticketType: "vip",
        ticketPrice: 100000,
        amount: 2,
        totalPrice: 200000
      },
      paymentMethod: {
        id: "bank_transfer",
        name: "Bank Transfer",
        icon: "🏦",
        fee: 0
      },
      paymentForm: {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "081234567890",
        bankCode: "BCA"
      },
      amount: 200000,
      fee: 0
    };

    const response = await fetch(`${baseUrl}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Payment created successfully');
      console.log(`   ID: ${result.payment.id}`);
      console.log(`   Status: ${result.payment.status}`);
      console.log(`   Total: Rp ${result.payment.totalAmount.toLocaleString('id-ID')}\n`);
      
      const paymentId = result.payment.id;
      
      // Test 2: Get Payment
      console.log('2. Testing Get Payment...');
      try {
        const getResponse = await fetch(`${baseUrl}/api/payments/${paymentId}`);
        const getResult = await getResponse.json();
        
        if (getResult.payment) {
          console.log('✅ Payment retrieved successfully');
          console.log(`   Event: ${getResult.payment.orderData.eventName}`);
          console.log(`   Customer: ${getResult.payment.paymentForm.customerName}\n`);
        } else {
          console.log('❌ Failed to retrieve payment\n');
        }
      } catch (error) {
        console.log('❌ Error retrieving payment:', error.message, '\n');
      }

      // Test 3: Update Payment Status
      console.log('3. Testing Update Payment Status...');
      try {
        const updateResponse = await fetch(`${baseUrl}/api/payments/${paymentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'completed',
            adminNotes: 'Payment verified by admin'
          })
        });

        const updateResult = await updateResponse.json();
        
        if (updateResult.success) {
          console.log('✅ Payment status updated successfully');
          console.log(`   New Status: ${updateResult.payment.status}`);
          console.log(`   Admin Notes: ${updateResult.payment.adminNotes}\n`);
        } else {
          console.log('❌ Failed to update payment status\n');
        }
      } catch (error) {
        console.log('❌ Error updating payment status:', error.message, '\n');
      }

      // Test 4: Verify Payment
      console.log('4. Testing Verify Payment...');
      try {
        const verifyResponse = await fetch(`${baseUrl}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: paymentId,
            verificationStatus: 'verified',
            adminNotes: 'Payment verified successfully'
          })
        });

        const verifyResult = await verifyResponse.json();
        
        if (verifyResult.success) {
          console.log('✅ Payment verified successfully');
          console.log(`   Verification Status: ${verifyResult.payment.verificationStatus}\n`);
        } else {
          console.log('❌ Failed to verify payment\n');
        }
      } catch (error) {
        console.log('❌ Error verifying payment:', error.message, '\n');
      }

    } else {
      console.log('❌ Failed to create payment:', result.error, '\n');
    }
  } catch (error) {
    console.log('❌ Error creating payment:', error.message, '\n');
  }

  // Test 5: Get All Payments
  console.log('5. Testing Get All Payments...');
  try {
    const response = await fetch(`${baseUrl}/api/payments`);
    const result = await response.json();
    
    if (result.payments) {
      console.log('✅ Payments retrieved successfully');
      console.log(`   Total Payments: ${result.payments.length}`);
      console.log(`   Recent Payment: ${result.payments[0]?.id || 'None'}\n`);
    } else {
      console.log('❌ Failed to retrieve payments\n');
    }
  } catch (error) {
    console.log('❌ Error retrieving payments:', error.message, '\n');
  }

  // Test 6: Test Different Payment Methods
  console.log('6. Testing Different Payment Methods...');
  
  const paymentMethods = [
    {
      id: "e_wallet",
      name: "E-Wallet",
      icon: "📱",
      fee: 2500,
      paymentForm: {
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        customerPhone: "081234567891",
        walletCode: "DANA"
      }
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      icon: "💳",
      fee: 3000,
      paymentForm: {
        customerName: "Bob Smith",
        customerEmail: "bob@example.com",
        customerPhone: "081234567892",
        cardNumber: "1234 5678 9012 3456",
        cardHolder: "BOB SMITH",
        expiryDate: "12/25",
        cvv: "123"
      }
    },
    {
      id: "qris",
      name: "QRIS",
      icon: "📱",
      fee: 0,
      paymentForm: {
        customerName: "Alice Johnson",
        customerEmail: "alice@example.com",
        customerPhone: "081234567893"
      }
    }
  ];

  for (const method of paymentMethods) {
    try {
      const paymentData = {
        orderData: {
          eventId: "2",
          eventName: "Test Event 2",
          ticketType: "regular",
          ticketPrice: 50000,
          amount: 1,
          totalPrice: 50000
        },
        paymentMethod: method,
        paymentForm: method.paymentForm,
        amount: 50000,
        fee: method.fee
      };

      const response = await fetch(`${baseUrl}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${method.name} payment created successfully`);
        console.log(`   ID: ${result.payment.id}`);
        console.log(`   Fee: Rp ${method.fee.toLocaleString('id-ID')}`);
        console.log(`   Total: Rp ${result.payment.totalAmount.toLocaleString('id-ID')}\n`);
      } else {
        console.log(`❌ Failed to create ${method.name} payment:`, result.error, '\n');
      }
    } catch (error) {
      console.log(`❌ Error creating ${method.name} payment:`, error.message, '\n');
    }
  }

  console.log('🎉 Payment System Testing Complete!');
};

// Run the test
testPaymentSystem().catch(console.error);
