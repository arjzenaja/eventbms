// Initialize Payment Data
// Run with: node scripts/init-payment-data.js

const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

// Read existing database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {};
  }
};

// Write to database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Initialize payment data
const initPaymentData = () => {
  console.log('🚀 Initializing Payment Data...\n');

  const db = readDatabase();
  
  // Initialize payments array if it doesn't exist
  if (!db.payments) {
    db.payments = [];
    console.log('✅ Created payments array');
  }

  // Add sample payment data
  const samplePayments = [
    {
      id: "PAY-1704067200000-sample1",
      userId: "user1",
      orderData: {
        eventId: "1",
        eventName: "Festival Musik Banyumas",
        ticketType: "vip",
        ticketPrice: 150000,
        amount: 2,
        totalPrice: 300000
      },
      paymentMethod: {
        id: "bank_transfer",
        name: "Bank Transfer",
        icon: "🏦",
        fee: 0
      },
      paymentForm: {
        customerName: "Ahmad Rizki",
        customerEmail: "ahmad@example.com",
        customerPhone: "081234567890",
        bankCode: "BCA",
        transferNote: "Pembayaran tiket Festival Musik"
      },
      amount: 300000,
      fee: 0,
      totalAmount: 300000,
      status: "completed",
      createdAt: "2024-01-01T00:00:00.000Z",
      expiresAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      completedAt: "2024-01-01T00:30:00.000Z",
      verificationStatus: "verified"
    },
    {
      id: "PAY-1704067200000-sample2",
      userId: "user2",
      orderData: {
        eventId: "2",
        eventName: "Workshop Kuliner Tradisional",
        ticketType: "regular",
        ticketPrice: 75000,
        amount: 1,
        totalPrice: 75000
      },
      paymentMethod: {
        id: "e_wallet",
        name: "E-Wallet",
        icon: "📱",
        fee: 2500
      },
      paymentForm: {
        customerName: "Siti Nurhaliza",
        customerEmail: "siti@example.com",
        customerPhone: "081234567891",
        walletCode: "DANA"
      },
      amount: 75000,
      fee: 2500,
      totalAmount: 77500,
      status: "pending",
      createdAt: "2024-01-01T01:00:00.000Z",
      expiresAt: "2024-01-02T01:00:00.000Z",
      updatedAt: "2024-01-01T01:00:00.000Z"
    },
    {
      id: "PAY-1704067200000-sample3",
      userId: "user3",
      orderData: {
        eventId: "3",
        eventName: "Pameran Seni Rupa",
        ticketType: "student",
        ticketPrice: 25000,
        amount: 3,
        totalPrice: 75000
      },
      paymentMethod: {
        id: "qris",
        name: "QRIS",
        icon: "📱",
        fee: 0
      },
      paymentForm: {
        customerName: "Budi Santoso",
        customerEmail: "budi@example.com",
        customerPhone: "081234567892"
      },
      amount: 75000,
      fee: 0,
      totalAmount: 75000,
      status: "completed",
      createdAt: "2024-01-01T02:00:00.000Z",
      expiresAt: "2024-01-02T02:00:00.000Z",
      updatedAt: "2024-01-01T02:00:00.000Z",
      completedAt: "2024-01-01T02:15:00.000Z",
      verificationStatus: "verified"
    },
    {
      id: "PAY-1704067200000-sample4",
      userId: "user4",
      orderData: {
        eventId: "4",
        eventName: "Seminar Kewirausahaan",
        ticketType: "vip",
        ticketPrice: 100000,
        amount: 1,
        totalPrice: 100000
      },
      paymentMethod: {
        id: "credit_card",
        name: "Kartu Kredit",
        icon: "💳",
        fee: 3000
      },
      paymentForm: {
        customerName: "Dewi Kartika",
        customerEmail: "dewi@example.com",
        customerPhone: "081234567893",
        cardNumber: "1234 5678 9012 3456",
        cardHolder: "DEWI KARTIKA",
        expiryDate: "12/25",
        cvv: "123"
      },
      amount: 100000,
      fee: 3000,
      totalAmount: 103000,
      status: "failed",
      createdAt: "2024-01-01T03:00:00.000Z",
      expiresAt: "2024-01-02T03:00:00.000Z",
      updatedAt: "2024-01-01T03:00:00.000Z",
      adminNotes: "Kartu kredit ditolak oleh bank"
    },
    {
      id: "PAY-1704067200000-sample5",
      userId: "user5",
      orderData: {
        eventId: "5",
        eventName: "Konser Akustik",
        ticketType: "regular",
        ticketPrice: 50000,
        amount: 2,
        totalPrice: 100000
      },
      paymentMethod: {
        id: "cash",
        name: "Tunai",
        icon: "💵",
        fee: 0
      },
      paymentForm: {
        customerName: "Eko Prasetyo",
        customerEmail: "eko@example.com",
        customerPhone: "081234567894"
      },
      amount: 100000,
      fee: 0,
      totalAmount: 100000,
      status: "pending",
      createdAt: "2024-01-01T04:00:00.000Z",
      expiresAt: "2024-01-02T04:00:00.000Z",
      updatedAt: "2024-01-01T04:00:00.000Z"
    }
  ];

  // Add sample payments to database
  samplePayments.forEach(payment => {
    const existingPayment = db.payments.find(p => p.id === payment.id);
    if (!existingPayment) {
      db.payments.push(payment);
      console.log(`✅ Added sample payment: ${payment.id}`);
    } else {
      console.log(`⚠️  Payment already exists: ${payment.id}`);
    }
  });

  // Write updated database
  if (writeDatabase(db)) {
    console.log('\n🎉 Payment data initialized successfully!');
    console.log(`📊 Total payments: ${db.payments.length}`);
    console.log(`✅ Completed: ${db.payments.filter(p => p.status === 'completed').length}`);
    console.log(`⏳ Pending: ${db.payments.filter(p => p.status === 'pending').length}`);
    console.log(`❌ Failed: ${db.payments.filter(p => p.status === 'failed').length}`);
    console.log(`🚫 Cancelled: ${db.payments.filter(p => p.status === 'cancelled').length}`);
  } else {
    console.log('\n❌ Failed to initialize payment data');
  }
};

// Run initialization
initPaymentData();
