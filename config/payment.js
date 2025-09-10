// Payment System Configuration
export const paymentConfig = {
  // Payment methods configuration
  paymentMethods: {
    bank_transfer: {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Transfer ke rekening bank",
      icon: "🏦",
      fee: 0,
      available: true,
      banks: [
        { code: "BCA", name: "Bank Central Asia", account: "1234567890", holder: "EventBMS" },
        { code: "BNI", name: "Bank Negara Indonesia", account: "0987654321", holder: "EventBMS" },
        { code: "BRI", name: "Bank Rakyat Indonesia", account: "1122334455", holder: "EventBMS" },
        { code: "MANDIRI", name: "Bank Mandiri", account: "5566778899", holder: "EventBMS" }
      ]
    },
    e_wallet: {
      id: "e_wallet",
      name: "E-Wallet",
      description: "DANA, OVO, GoPay, ShopeePay",
      icon: "📱",
      fee: 2500,
      available: true,
      wallets: [
        { code: "DANA", name: "DANA", account: "081234567890", holder: "EventBMS" },
        { code: "OVO", name: "OVO", account: "081234567890", holder: "EventBMS" },
        { code: "GOPAY", name: "GoPay", account: "081234567890", holder: "EventBMS" },
        { code: "SHOPEEPAY", name: "ShopeePay", account: "081234567890", holder: "EventBMS" }
      ]
    },
    credit_card: {
      id: "credit_card",
      name: "Kartu Kredit",
      description: "Visa, Mastercard, JCB",
      icon: "💳",
      fee: 3000,
      available: true,
      cards: ["Visa", "Mastercard", "JCB"]
    },
    qris: {
      id: "qris",
      name: "QRIS",
      description: "Scan QR Code untuk pembayaran",
      icon: "📱",
      fee: 0,
      available: true,
      qrCode: "/api/qr-code"
    },
    cash: {
      id: "cash",
      name: "Tunai",
      description: "Bayar di lokasi acara",
      icon: "💵",
      fee: 0,
      available: true,
      note: "Pembayaran dilakukan saat check-in di lokasi acara"
    }
  },

  // Payment status configuration
  statuses: {
    pending: {
      label: "Menunggu Pembayaran",
      color: "yellow",
      icon: "⏳"
    },
    completed: {
      label: "Pembayaran Berhasil",
      color: "green",
      icon: "✅"
    },
    failed: {
      label: "Pembayaran Gagal",
      color: "red",
      icon: "❌"
    },
    cancelled: {
      label: "Pembayaran Dibatalkan",
      color: "red",
      icon: "🚫"
    }
  },

  // Payment validation rules
  validation: {
    customerName: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    customerEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    customerPhone: {
      required: true,
      pattern: /^[0-9+\-\s()]+$/,
      minLength: 10,
      maxLength: 15
    },
    cardNumber: {
      required: true,
      pattern: /^[0-9\s]{13,19}$/
    },
    cardHolder: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    expiryDate: {
      required: true,
      pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    },
    cvv: {
      required: true,
      pattern: /^[0-9]{3,4}$/
    }
  },

  // Payment processing configuration
  processing: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    expirationTime: 24 * 60 * 60 * 1000 // 24 hours
  },

  // Currency configuration
  currency: {
    code: "IDR",
    symbol: "Rp",
    locale: "id-ID"
  },

  // Notification configuration
  notifications: {
    email: {
      enabled: true,
      from: "noreply@eventbms.com",
      templates: {
        paymentCreated: "payment-created",
        paymentCompleted: "payment-completed",
        paymentFailed: "payment-failed"
      }
    },
    sms: {
      enabled: false,
      provider: "twilio"
    }
  },

  // Security configuration
  security: {
    encryptionKey: process.env.PAYMENT_ENCRYPTION_KEY || "default-key",
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    csrf: {
      enabled: true,
      secret: process.env.CSRF_SECRET || "default-secret"
    }
  },

  // Database configuration
  database: {
    table: "payments",
    indexes: ["id", "userId", "status", "createdAt"],
    backup: {
      enabled: true,
      interval: "daily",
      retention: 30 // days
    }
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: "logs/payment.log",
    maxSize: "10MB",
    maxFiles: 5
  },

  // Feature flags
  features: {
    refunds: false,
    partialPayments: false,
    paymentPlans: false,
    subscriptions: false,
    multiCurrency: false,
    mobileApp: false
  }
};

// Helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat(paymentConfig.currency.locale, {
    style: 'currency',
    currency: paymentConfig.currency.code
  }).format(amount);
};

export const validatePaymentForm = (form, method) => {
  const errors = {};
  const rules = paymentConfig.validation;

  // Validate required fields
  if (rules.customerName.required && !form.customerName) {
    errors.customerName = "Nama lengkap harus diisi";
  }

  if (rules.customerEmail.required && !form.customerEmail) {
    errors.customerEmail = "Email harus diisi";
  } else if (form.customerEmail && !rules.customerEmail.pattern.test(form.customerEmail)) {
    errors.customerEmail = "Format email tidak valid";
  }

  if (rules.customerPhone.required && !form.customerPhone) {
    errors.customerPhone = "Nomor telepon harus diisi";
  } else if (form.customerPhone && !rules.customerPhone.pattern.test(form.customerPhone)) {
    errors.customerPhone = "Format nomor telepon tidak valid";
  }

  // Validate method-specific fields
  if (method === "bank_transfer" && !form.bankCode) {
    errors.bankCode = "Pilih bank tujuan";
  }

  if (method === "e_wallet" && !form.walletCode) {
    errors.walletCode = "Pilih e-wallet";
  }

  if (method === "credit_card") {
    if (!form.cardNumber) {
      errors.cardNumber = "Nomor kartu harus diisi";
    } else if (!rules.cardNumber.pattern.test(form.cardNumber)) {
      errors.cardNumber = "Format nomor kartu tidak valid";
    }

    if (!form.cardHolder) {
      errors.cardHolder = "Nama pemegang kartu harus diisi";
    }

    if (!form.expiryDate) {
      errors.expiryDate = "Tanggal kadaluarsa harus diisi";
    } else if (!rules.expiryDate.pattern.test(form.expiryDate)) {
      errors.expiryDate = "Format tanggal kadaluarsa tidak valid (MM/YY)";
    }

    if (!form.cvv) {
      errors.cvv = "CVV harus diisi";
    } else if (!rules.cvv.pattern.test(form.cvv)) {
      errors.cvv = "Format CVV tidak valid";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generatePaymentId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `PAY-${timestamp}-${random}`;
};

export const calculateTotalAmount = (amount, fee) => {
  return amount + (fee || 0);
};

export const getPaymentMethod = (methodId) => {
  return paymentConfig.paymentMethods[methodId];
};

export const getStatusConfig = (status) => {
  return paymentConfig.statuses[status];
};

export default paymentConfig;
