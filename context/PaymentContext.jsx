"use client";
import React, { createContext, useState, useContext } from "react";

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  // Payment methods state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethods] = useState([
    {
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
    {
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
    {
      id: "credit_card",
      name: "Kartu Kredit",
      description: "Visa, Mastercard, JCB",
      icon: "💳",
      fee: 3000,
      available: true,
      cards: ["Visa", "Mastercard", "JCB"]
    },
    {
      id: "qris",
      name: "QRIS",
      description: "Scan QR Code untuk pembayaran",
      icon: "📱",
      fee: 0,
      available: true,
      qrCode: "/api/qr-code"
    },
    {
      id: "cash",
      name: "Tunai",
      description: "Bayar di lokasi acara",
      icon: "💵",
      fee: 0,
      available: true,
      note: "Pembayaran dilakukan saat check-in di lokasi acara"
    }
  ]);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    // Bank transfer fields
    bankCode: "",
    accountNumber: "",
    accountHolder: "",
    transferAmount: 0,
    transferNote: "",
    
    // E-wallet fields
    walletCode: "",
    phoneNumber: "",
    
    // Credit card fields
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    
    // General fields
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: ""
  });

  // Payment status
  const [paymentStatus, setPaymentStatus] = useState({
    isProcessing: false,
    isSuccess: false,
    isFailed: false,
    transactionId: null,
    errorMessage: ""
  });

  // Payment history
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Functions
  const selectPaymentMethod = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method && method.available) {
      setSelectedPaymentMethod(method);
      // Reset form when changing payment method
      setPaymentForm({
        bankCode: "",
        accountNumber: "",
        accountHolder: "",
        transferAmount: 0,
        transferNote: "",
        walletCode: "",
        phoneNumber: "",
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        notes: ""
      });
    }
  };

  const updatePaymentForm = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePaymentForm = () => {
    const { customerName, customerEmail, customerPhone } = paymentForm;
    
    // Basic validation
    if (!customerName.trim()) return { valid: false, message: "Nama lengkap harus diisi" };
    if (!customerEmail.trim()) return { valid: false, message: "Email harus diisi" };
    if (!customerPhone.trim()) return { valid: false, message: "Nomor telepon harus diisi" };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) return { valid: false, message: "Format email tidak valid" };

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(customerPhone)) return { valid: false, message: "Format nomor telepon tidak valid" };

    // Payment method specific validation
    if (selectedPaymentMethod?.id === "bank_transfer") {
      if (!paymentForm.bankCode) return { valid: false, message: "Pilih bank tujuan" };
    }

    if (selectedPaymentMethod?.id === "e_wallet") {
      if (!paymentForm.walletCode) return { valid: false, message: "Pilih e-wallet" };
    }

    if (selectedPaymentMethod?.id === "credit_card") {
      if (!paymentForm.cardNumber || !paymentForm.cardHolder || !paymentForm.expiryDate || !paymentForm.cvv) {
        return { valid: false, message: "Data kartu kredit harus lengkap" };
      }
    }

    return { valid: true };
  };

  const processPayment = async (orderData) => {
    setPaymentStatus({
      isProcessing: true,
      isSuccess: false,
      isFailed: false,
      transactionId: null,
      errorMessage: ""
    });

    try {
      // Validate form first
      const validation = validatePaymentForm();
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Generate transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const paymentRecord = {
        id: transactionId,
        orderData,
        paymentMethod: selectedPaymentMethod,
        paymentForm: { ...paymentForm },
        amount: orderData.totalPrice,
        fee: selectedPaymentMethod?.fee || 0,
        totalAmount: orderData.totalPrice + (selectedPaymentMethod?.fee || 0),
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      // Save to database via API
      try {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderData,
            paymentMethod: selectedPaymentMethod,
            paymentForm: { ...paymentForm },
            amount: orderData.totalPrice,
            fee: selectedPaymentMethod?.fee || 0,
            userId: null // You can add user ID here if you have user authentication
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save payment to database');
        }

        const result = await response.json();
        console.log('Payment saved to database:', result);
        
        // Save payment data to localStorage for success page
        const successData = {
          orderId: result.payment.id,
          customerName: orderData.customerName || paymentForm.customerName,
          customerEmail: orderData.customerEmail || paymentForm.customerEmail,
          eventName: orderData.eventName,
          paymentMethod: selectedPaymentMethod?.name || 
                        (selectedPaymentMethod?.type === 'bank' ? 'Bank Transfer' :
                         selectedPaymentMethod?.type === 'ewallet' ? 'E-Wallet' :
                         selectedPaymentMethod?.type === 'credit_card' ? 'Kartu Kredit' :
                         selectedPaymentMethod?.type || 'Pembayaran'),
          totalAmount: paymentRecord.totalAmount
        };
        
        localStorage.setItem('lastPaymentData', JSON.stringify(successData));
        
        // Redirect to success page
        window.location.href = `/payment-success?paymentId=${result.payment.id}`;
        return; // Exit early to prevent showing success state in this component
      } catch (dbError) {
        console.error('Error saving payment to database:', dbError);
        // Continue with local state even if database save fails
      }

      // Add to payment history (local state)
      setPaymentHistory(prev => [paymentRecord, ...prev]);

      setPaymentStatus({
        isProcessing: false,
        isSuccess: true,
        isFailed: false,
        transactionId,
        errorMessage: ""
      });

      return { success: true, transactionId, paymentRecord };

    } catch (error) {
      setPaymentStatus({
        isProcessing: false,
        isSuccess: false,
        isFailed: true,
        transactionId: null,
        errorMessage: error.message
      });

      return { success: false, error: error.message };
    }
  };

  const resetPayment = () => {
    setSelectedPaymentMethod(null);
    setPaymentForm({
      bankCode: "",
      accountNumber: "",
      accountHolder: "",
      transferAmount: 0,
      transferNote: "",
      walletCode: "",
      phoneNumber: "",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: ""
    });
    setPaymentStatus({
      isProcessing: false,
      isSuccess: false,
      isFailed: false,
      transactionId: null,
      errorMessage: ""
    });
  };

  const getPaymentInstructions = () => {
    if (!selectedPaymentMethod) return null;

    const method = selectedPaymentMethod;
    const totalAmount = paymentForm.transferAmount || 0;

    switch (method.id) {
      case "bank_transfer":
        const bank = method.banks.find(b => b.code === paymentForm.bankCode);
        return {
          type: "bank_transfer",
          bank: bank,
          amount: totalAmount,
          account: bank?.account,
          holder: bank?.holder,
          note: paymentForm.transferNote || `Pembayaran tiket ${orderData?.eventName || 'event'}`
        };

      case "e_wallet":
        const wallet = method.wallets.find(w => w.code === paymentForm.walletCode);
        return {
          type: "e_wallet",
          wallet: wallet,
          amount: totalAmount,
          account: wallet?.account,
          holder: wallet?.holder
        };

      case "qris":
        return {
          type: "qris",
          amount: totalAmount,
          qrCode: method.qrCode
        };

      case "cash":
        return {
          type: "cash",
          amount: totalAmount,
          note: method.note
        };

      default:
        return null;
    }
  };

  const value = {
    // State
    selectedPaymentMethod,
    paymentMethods,
    paymentForm,
    paymentStatus,
    paymentHistory,

    // Functions
    selectPaymentMethod,
    updatePaymentForm,
    validatePaymentForm,
    processPayment,
    resetPayment,
    getPaymentInstructions
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentProvider };
export default PaymentProvider;
