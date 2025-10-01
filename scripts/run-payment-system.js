#!/usr/bin/env node

// Run Payment System
// Execute with: node run-payment-system.js

const fs = require('fs');
const path = require('path');

console.log('🚀 EventBMS Payment System');
console.log('==========================\n');

// Check if required files exist
const requiredFiles = [
  'context/PaymentContext.jsx',
  'components/PaymentMethod.jsx',
  'components/PaymentForm.jsx',
  'components/PaymentCheckout.jsx',
  'components/PaymentStatus.jsx',
  'components/PaymentInstructions.jsx',
  'components/PaymentHistory.jsx',
  'app/api/payments/route.js',
  'app/api/payments/[id]/route.js',
  'app/api/payments/verify/route.js',
  'app/checkout/page.jsx',
  'app/payment-status/[id]/page.jsx',
  'app/payment-instructions/[id]/page.jsx',
  'app/payment-history/page.jsx',
  'app/admin/payments/page.jsx',
  'config/payment.js',
  'db.json'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the installation.');
  process.exit(1);
}

console.log('\n✅ All required files are present!');

// Check database structure
console.log('\n📊 Checking database structure...');
try {
  const dbPath = path.join(process.cwd(), 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  if (dbData.payments) {
    console.log(`✅ Payments table exists with ${dbData.payments.length} records`);
  } else {
    console.log('⚠️  Payments table not found in database');
  }
  
  if (dbData.admins) {
    console.log(`✅ Admins table exists with ${dbData.admins.length} records`);
  } else {
    console.log('⚠️  Admins table not found in database');
  }
} catch (error) {
  console.log('❌ Error reading database:', error.message);
}

// Display system information
console.log('\n📱 Payment System Information:');
console.log('==============================');
console.log('🏦 Bank Transfer: BCA, BNI, BRI, Mandiri');
console.log('📱 E-Wallet: DANA, OVO, GoPay, ShopeePay');
console.log('💳 Credit Card: Visa, Mastercard, JCB');
console.log('📱 QRIS: Scan QR Code');
console.log('💵 Cash: Pay at location');
console.log('');

console.log('🔗 Available Pages:');
console.log('==================');
console.log('• /checkout - Checkout page');
console.log('• /payment-history - Payment history');
console.log('• /payment-status/[id] - Payment status');
console.log('• /payment-instructions/[id] - Payment instructions');
console.log('• /admin/payments - Admin panel');
console.log('');

console.log('🧪 Testing Commands:');
console.log('====================');
console.log('• node test-payment-system.js - Test API endpoints');
console.log('• node scripts/init-payment-data.js - Initialize data');
console.log('');

console.log('📚 Documentation:');
console.log('=================');
console.log('• PAYMENT_SYSTEM_README.md - Complete documentation');
console.log('• PAYMENT_DEMO.md - Usage examples');
console.log('• PAYMENT_SETUP_GUIDE.md - Setup instructions');
console.log('• PAYMENT_SYSTEM_SUMMARY.md - Feature summary');
console.log('');

console.log('🎉 Payment System is ready to use!');
console.log('Start the development server with: npm run dev');
console.log('');

// Check if development server is running
const checkDevServer = () => {
  const http = require('http');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/payments',
    method: 'GET',
    timeout: 2000
  };
  
  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Development server is running on http://localhost:3000');
    } else {
      console.log('⚠️  Development server is running but API may not be ready');
    }
  });
  
  req.on('error', () => {
    console.log('❌ Development server is not running');
    console.log('   Start it with: npm run dev');
  });
  
  req.on('timeout', () => {
    console.log('⚠️  Development server check timed out');
  });
  
  req.end();
};

// Check development server after a short delay
setTimeout(checkDevServer, 1000);
