"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentContext } from "@/context/PaymentContext";
import { TicketContext } from "@/context/TicketContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import PaymentMethod from "./PaymentMethod";
import PaymentForm from "./PaymentForm";
import PaymentProofUpload from "./PaymentProofUpload";
import { Toast } from "@/components/ui/alert";
import { BiCheckCircle } from "react-icons/bi";
import { BiXCircle } from "react-icons/bi";
import { BiLeftArrowAlt } from "react-icons/bi";
import { BiClock } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";
import { BiInfoCircle } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { BiLock } from "react-icons/bi";

const PaymentCheckout = ({ onBack, onSuccess }) => {
  const { checkoutData, clearCheckoutData } = useContext(TicketContext);
  const { paymentStatus, resetPayment } = useContext(PaymentContext);
  const { user, isAuthenticated, isLoading } = useUser();
  const { isDark, isLight } = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // 1: Payment Method, 2: Payment Form, 3: Success
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [selectedBank, setSelectedBank] = useState('bca');
  const [selectedEwallet, setSelectedEwallet] = useState('dana');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [paymentProof, setPaymentProof] = useState({
    file: null,
    preview: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'warning', title: '', message: '' });

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      setShowAuthModal(true);
    }
  }, [isLoading, isAuthenticated]);

  // Auto-fill form with user data if logged in
  useEffect(() => {
    if (user && isAuthenticated()) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user, isAuthenticated]);

  // Bank options data
  const bankOptions = [
    { value: 'bca', label: 'Bank Central Asia (BCA)', code: '014' },
    { value: 'mandiri', label: 'Bank Mandiri', code: '008' },
    { value: 'bni', label: 'Bank Negara Indonesia (BNI)', code: '009' },
    { value: 'bri', label: 'Bank Rakyat Indonesia (BRI)', code: '002' },
    { value: 'btn', label: 'Bank Tabungan Negara (BTN)', code: '200' },
    { value: 'cimb', label: 'CIMB Niaga', code: '022' },
    { value: 'danamon', label: 'Bank Danamon', code: '011' },
    { value: 'permata', label: 'Bank Permata', code: '013' }
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep(2);
  };

  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleBankSelect = (bankValue) => {
    setSelectedBank(bankValue);
  };

  const handleEwalletSelect = (ewalletValue) => {
    setSelectedEwallet(ewalletValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentProofChange = (file, preview) => {
    setPaymentProof({
      file,
      preview
    });
  };

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `ORDER-${timestamp}-${random}`.toUpperCase();
  };

  const handlePaymentSuccess = (result) => {
    setCurrentStep(3);
    // Clear checkout data after successful payment
    clearCheckoutData();
    if (onSuccess) {
      onSuccess(result);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1 && onBack) {
      onBack();
    }
  };

  const handleNewPayment = () => {
    resetPayment();
    setCurrentStep(1);
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    onBack(); // Go back to previous page
  };

  const handleCheckout = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }

    // Validate form data
    if (!formData.firstName || !formData.email || !formData.phone) {
      setToast({
        show: true,
        type: 'warning',
        title: 'Data belum lengkap',
        message: 'Mohon lengkapi semua field yang wajib diisi.'
      });
      return;
    }

    // Validate payment proof
    if (!paymentProof.file) {
      setToast({
        show: true,
        type: 'error',
        title: 'Bukti pembayaran wajib',
        message: 'Mohon upload bukti pembayaran terlebih dahulu.'
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      const orderId = generateOrderId();
      const totalAmount = displayData.totalPrice + 1500 + (displayData.totalPrice * 0.1);
      
      console.log('Demo Payment Details:', {
        orderId,
        customerName: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        paymentMethod: selectedPaymentMethod,
        bank: selectedPaymentMethod === 'bank' ? selectedBank : null,
        ewallet: selectedPaymentMethod === 'ewallet' ? selectedEwallet : null,
        amount: totalAmount
      });

      // Save payment to database
      try {
        const paymentData = {
          orderData: {
            eventId: displayData.eventId || 'demo-event',
            eventName: displayData.eventName || 'Demo Event',
            ticketType: displayData.ticketType || 'regular',
            ticketPrice: displayData.ticketPrice || 0,
            amount: displayData.amount || 1,
            totalPrice: displayData.totalPrice || 0,
            customerName: formData.firstName,
            customerEmail: formData.email,
            customerPhone: formData.phone
          },
          paymentMethod: {
            type: selectedPaymentMethod,
            name: selectedPaymentMethod === 'bank' ? (selectedBank?.name || 'Bank Transfer') : 
                  selectedPaymentMethod === 'ewallet' ? (selectedEwallet?.name || 'E-Wallet') : 
                  'Demo Payment Method',
            icon: selectedPaymentMethod === 'bank' ? '🏦' : 
                  selectedPaymentMethod === 'ewallet' ? '📱' : 
                  '💳'
          },
          paymentForm: {
            customerName: formData.firstName,
            customerEmail: formData.email,
            customerPhone: formData.phone
          },
          paymentProof: {
            fileName: paymentProof.file?.name || null,
            fileSize: paymentProof.file?.size || null,
            fileType: paymentProof.file?.type || null,
            preview: paymentProof.preview || null,
            hasProof: !!paymentProof.file,
            imageUrl: paymentProof.preview || null
          },
          amount: displayData.totalPrice || 0,
          fee: 1500 + ((displayData.totalPrice || 0) * 0.1),
          userId: null
        };

        console.log('Sending payment data:', JSON.stringify(paymentData, null, 2));
        console.log('Payment data validation:', {
          hasOrderData: !!paymentData.orderData,
          hasPaymentMethod: !!paymentData.paymentMethod,
          hasAmount: paymentData.amount !== undefined && paymentData.amount !== null,
          amountValue: paymentData.amount,
          amountType: typeof paymentData.amount
        });

        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        });

        console.log('Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Payment saved to database:', result);
          console.log('Payment ID:', result.payment?.id);
          
          // Save payment data to localStorage for success page
          const successData = {
            orderId: result.payment.id,
            customerName: formData.firstName,
            customerEmail: formData.email,
            eventName: displayData.eventName || 'Demo Event',
            paymentMethod: selectedPaymentMethod === 'bank' ? selectedBank?.name : 
                          selectedPaymentMethod === 'ewallet' ? selectedEwallet?.name : 
                          'Demo Payment Method',
            totalAmount: totalAmount,
            paymentProof: {
              fileName: paymentProof.file?.name || null,
              hasProof: !!paymentProof.file
            }
          };
          
          localStorage.setItem('lastPaymentData', JSON.stringify(successData));
          
          // Redirect to success page
          window.location.href = `/payment-success?paymentId=${result.payment.id}`;
          return; // Exit early to prevent showing success state in this component
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: 'Failed to parse error response' };
          }
          console.error('Failed to save payment to database:', errorData);
          console.error('Response status:', response.status);
          console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        }
      } catch (error) {
        console.error('Error saving payment to database:', error);
        console.error('Error stack:', error.stack);
      }

      // Show success state
      setShowSuccess(true);
      setCurrentStep(3);
      
      // Clear checkout data
      clearCheckoutData();
      
      // Call success callback
      if (onSuccess) {
        onSuccess({
          orderId: orderId,
          paymentMethod: selectedPaymentMethod,
          amount: totalAmount,
          status: 'success',
          paymentProof: {
            fileName: paymentProof.file?.name || null,
            hasProof: !!paymentProof.file
          }
        });
      }
      
      setIsProcessing(false);
    }, 2000); // 2 second delay to simulate processing
  };

  // Create fallback data if checkoutData is not available
  const fallbackData = {
    eventId: 'sample-event',
    eventName: 'Sample Event',
    ticketType: 'general',
    ticketPrice: 100000,
    amount: 1,
    totalPrice: 100000
  };

  const displayData = checkoutData || fallbackData;

  // Authentication Modal
  if (showAuthModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`rounded-3xl p-8 max-w-md w-full border shadow-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-white/20' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/60'
        }`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiLock className="text-white text-3xl" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Login Diperlukan</h2>
            <p className={`mb-8 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
              Anda harus login terlebih dahulu untuk melanjutkan pembelian tiket.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-3"
              >
                <BiUser className="text-xl" />
                Login Sekarang
              </button>
              
              <button
                onClick={handleRegisterRedirect}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-3"
              >
                <BiUser className="text-xl" />
                Daftar Akun Baru
              </button>
              
              <button
                onClick={handleCloseAuthModal}
                className={`w-full bg-transparent border-2 font-bold py-3 px-6 rounded-2xl transition-all duration-300 ${
                  isDark 
                    ? 'border-white/30 text-white hover:bg-white/10' 
                    : 'border-gray-300/60 text-gray-700 hover:bg-gray-100/80'
                }`}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success page for demo
  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiCheckCircle className="text-white text-4xl" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Pembayaran Berhasil!</h1>
            <p className={`text-xl ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Terima kasih atas pembelian tiket Anda</p>
          </div>

          <div className={`backdrop-blur-lg rounded-2xl p-8 border shadow-2xl mb-8 ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/90 border-gray-200/40'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Detail Pembayaran</h2>
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span className={isDark ? 'text-blue-200' : 'text-gray-600'}>Order ID:</span>
                <span className={`font-mono ${isDark ? 'text-white' : 'text-gray-800'}`}>ORDER-{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-blue-200' : 'text-gray-600'}>Nama:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>{formData.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-blue-200' : 'text-gray-600'}>Email:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-blue-200' : 'text-gray-600'}>Event:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>{displayData.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-blue-200' : 'text-gray-600'}>Metode Pembayaran:</span>
                <span className={`capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {selectedPaymentMethod === 'bank' ? `Transfer Bank (${selectedBank.toUpperCase()})` :
                   selectedPaymentMethod === 'ewallet' ? `E-Wallet (${selectedEwallet.toUpperCase()})` :
                   'QRIS'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-blue-200' : 'text-gray-600'}>Bukti Pembayaran:</span>
                <span className={`flex items-center gap-2 ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  <BiCheck className="text-lg" />
                  {paymentProof.file?.name || 'Telah diupload'}
                </span>
              </div>
              <div className={`border-t pt-4 ${isDark ? 'border-white/20' : 'border-gray-200/60'}`}>
                <div className="flex justify-between text-xl font-bold">
                  <span className={isDark ? 'text-white' : 'text-gray-800'}>Total:</span>
                  <span className="text-green-400">{formatPrice(displayData.totalPrice + 1500 + (displayData.totalPrice * 0.1))}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setShowSuccess(false);
                setCurrentStep(1);
                setFormData({ firstName: '', lastName: '', email: '', phone: '' });
                setPaymentProof({ file: null, preview: null });
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              Beli Tiket Lainnya
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className={`bg-transparent border-2 font-bold py-4 px-8 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'border-white/30 text-white hover:bg-white/10' 
                  : 'border-gray-300/60 text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
      <Toast
        type={toast.type}
        title={toast.title}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        position="top-right"
        autoClose={true}
        autoCloseDelay={2800}
      />
      {/* Demo Notice */}
      <div className={`bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border ${isDark ? 'border-yellow-400/40' : 'border-yellow-500/60'} rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-yellow-100' : 'text-yellow-800'}`}>Mode Demo</h3>
            <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>Ini adalah versi demo. Pembayaran akan disimulasikan tanpa transaksi nyata.</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <button
          onClick={handleBack}
          className={`group p-4 rounded-2xl ${isDark ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' : 'bg-gray-100/80 hover:bg-gray-200/80 border-gray-300/40 hover:border-gray-400/60'} transition-all duration-300 backdrop-blur-sm border hover:scale-105 shadow-lg hover:shadow-xl`}
        >
          <BiLeftArrowAlt className={`text-xl ${isDark ? 'text-white group-hover:text-blue-300' : 'text-gray-700 group-hover:text-blue-600'} transition-colors`} />
        </button>
        <div className="flex-1">
          <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent' : 'text-gray-800 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
            Checkout Pembayaran
          </h1>
          <p className={`text-xl ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Selesaikan pembayaran untuk tiket Anda</p>
          {isAuthenticated() && user && (
            <div className={`mt-2 flex items-center gap-2 text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>
              <BiUser className="text-lg" />
              <span>Login sebagai: {user.name}</span>
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <div className={`w-16 h-16 ${isDark ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/20' : 'bg-gradient-to-br from-blue-100 to-purple-100 border-gray-300/40'} rounded-2xl flex items-center justify-center border animate-pulse`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-8">
          <div className={`bg-gradient-to-br ${isDark ? 'from-white/10 to-white/5 border-white/20' : 'from-white/90 to-gray-50/90 border-gray-200/40'} backdrop-blur-lg rounded-3xl p-8 border shadow-2xl ${isDark ? 'hover:shadow-blue-500/10' : 'hover:shadow-blue-200/20'} transition-all duration-500 hover:scale-[1.02]`}>
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Ringkasan Pesanan
            </h2>
            
            <div className="space-y-6">
              <div className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50/80 border-gray-200/40 hover:bg-gray-100/80'} rounded-xl p-5 border transition-all duration-300`}>
                <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Event
                </div>
                <div className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>{displayData.eventName}</div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50/80 border-gray-200/40 hover:bg-gray-100/80'} rounded-xl p-5 border transition-all duration-300`}>
                <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Tipe Tiket
                </div>
                <div className={`font-semibold text-lg capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>{displayData.ticketType}</div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50/80 border-gray-200/40 hover:bg-gray-100/80'} rounded-xl p-5 border transition-all duration-300`}>
                <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Harga per Tiket
                </div>
                <div className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatPrice(displayData.ticketPrice)}</div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50/80 border-gray-200/40 hover:bg-gray-100/80'} rounded-xl p-5 border transition-all duration-300`}>
                <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Jumlah
                </div>
                <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{displayData.amount} tiket</div>
              </div>
              
              <div className={`h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-gray-300/40'} to-transparent my-6`} />
              
              <div className={`bg-gradient-to-r ${isDark ? 'from-blue-600/20 to-indigo-600/20 border-blue-400/30' : 'from-blue-100/80 to-indigo-100/80 border-blue-300/50'} rounded-2xl p-6 border shadow-lg`}>
                <div className="flex justify-between items-center">
                  <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Total</span>
                  <span className={`font-bold text-3xl ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{formatPrice(displayData.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-gray-200/40'} backdrop-blur-lg rounded-2xl p-6 border shadow-2xl`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informasi Produk
            </h2>
            
            <div className="space-y-4">
              <div className={`flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/40'} rounded-lg p-4 border`}>
                <BiCheck className="text-green-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>Tiket Digital</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Tiket akan dikirim ke email Anda setelah pembayaran berhasil</div>
                </div>
              </div>
              
              <div className={`flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/40'} rounded-lg p-4 border`}>
                <BiCheck className="text-green-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>Pembayaran Aman</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Transaksi dilindungi dengan enkripsi SSL 256-bit</div>
                </div>
              </div>
              
              <div className={`flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/40'} rounded-lg p-4 border`}>
                <BiCheck className="text-green-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>Proses Cepat</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Konfirmasi pembayaran dalam 1x24 jam</div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-gray-200/40'} backdrop-blur-lg rounded-2xl p-6 border shadow-2xl`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <BiInfoCircle className="w-6 h-6 text-blue-400" />
              Syarat dan Ketentuan
            </h2>
            
            <div className="space-y-4">
              <div className={`flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/40'} rounded-lg p-4 border`}>
                <BiInfoCircle className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Pembatalan Tiket</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Tiket dapat dibatalkan maksimal 24 jam sebelum acara dimulai</div>
                </div>
              </div>
              
              <div className={`flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/40'} rounded-lg p-4 border`}>
                <BiInfoCircle className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Refund</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Pengembalian dana akan diproses dalam 3-5 hari kerja</div>
                </div>
              </div>
              
              <div className={`flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/40'} rounded-lg p-4 border`}>
                <BiInfoCircle className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Validasi Tiket</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Tunjukkan tiket digital saat check-in di lokasi acara</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Checkout Form */}
        <div className="space-y-8">
          {/* Customer Information */}
          <div className={`bg-gradient-to-br ${isDark ? 'from-white/10 to-white/5 border-white/20 hover:shadow-blue-500/10' : 'from-white/90 to-gray-50/90 border-gray-200/40 hover:shadow-blue-200/20'} backdrop-blur-lg rounded-3xl p-8 border shadow-2xl transition-all duration-500 hover:scale-[1.01]`}>
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Informasi Pelanggan
            </h2>
            
            <div className="space-y-8">
              <div>
                <label className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Nama Lengkap *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-6 py-5 border rounded-2xl transition-all duration-300 group-hover:border-blue-300/50 ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15' 
                        : 'bg-white/90 border-gray-300/60 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Email *
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-6 py-5 border rounded-2xl transition-all duration-300 group-hover:border-blue-300/50 ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15' 
                        : 'bg-white/90 border-gray-300/60 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Nomor Telepon *
                </label>
                <div className="flex group">
                  <select className={`px-6 py-5 border rounded-l-2xl focus:ring-2 group-hover:border-blue-300/50 transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/20' 
                      : 'bg-white/90 border-gray-300/60 text-gray-800 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}>
                    <option value="+62">+62</option>
                    <option value="+1">+1</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      placeholder="81234567890"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-6 py-5 border border-l-0 rounded-r-2xl transition-all duration-300 group-hover:border-blue-300/50 ${
                        isDark 
                          ? 'bg-white/10 border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15' 
                          : 'bg-white/90 border-gray-300/60 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof Upload */}
          <div className={`bg-gradient-to-br ${isDark ? 'from-white/10 to-white/5 border-white/20 hover:shadow-orange-500/10' : 'from-white/90 to-gray-50/90 border-gray-200/40 hover:shadow-orange-200/20'} backdrop-blur-lg rounded-3xl p-8 border shadow-2xl transition-all duration-500 hover:scale-[1.01]`}>
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Bukti Pembayaran
            </h2>
            
            <PaymentProofUpload 
              onImageChange={handlePaymentProofChange}
              isDark={isDark}
              isLight={isLight}
            />
          </div>

          {/* Payment Method */}
          <div className={`bg-gradient-to-br backdrop-blur-lg rounded-3xl p-8 border shadow-2xl transition-all duration-500 hover:scale-[1.01] ${
            isDark 
              ? 'from-white/10 to-white/5 border-white/20 hover:shadow-blue-500/10' 
              : 'from-white/90 to-gray-50/90 border-gray-200/40 hover:shadow-blue-200/20'
          }`}>
            <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              Metode Pembayaran
            </h2>
            
            <div className="space-y-6">
              <div 
                onClick={() => handlePaymentMethodClick('bank')}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                  selectedPaymentMethod === 'bank' 
                    ? isDark
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-400/50 shadow-lg shadow-blue-500/20'
                      : 'bg-gradient-to-r from-blue-100/80 to-indigo-100/80 border-blue-400/60 shadow-lg shadow-blue-500/20'
                    : isDark
                      ? 'bg-white/10 border-white/20 hover:border-blue-400/50 hover:bg-white/15'
                      : 'bg-white/80 border-gray-200/60 hover:border-blue-400/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    selectedPaymentMethod === 'bank' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : isDark
                        ? 'bg-white/10 group-hover:bg-blue-500/20'
                        : 'bg-gray-100 group-hover:bg-blue-500/20'
                  }`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>Transfer Bank</div>
                    <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>BCA, Mandiri, BNI, BRI</div>
                  </div>
                </div>
                <div className={`text-2xl transition-all duration-300 ${
                  selectedPaymentMethod === 'bank' ? 'text-green-400' : isDark ? 'text-white/30 group-hover:text-green-400' : 'text-gray-400 group-hover:text-green-400'
                }`}>✓</div>
              </div>
              
              <div 
                onClick={() => handlePaymentMethodClick('ewallet')}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                  selectedPaymentMethod === 'ewallet' 
                    ? isDark
                      ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/50 shadow-lg shadow-green-500/20'
                      : 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 border-green-400/60 shadow-lg shadow-green-500/20'
                    : isDark
                      ? 'bg-white/10 border-white/20 hover:border-green-400/50 hover:bg-white/15'
                      : 'bg-white/80 border-gray-200/60 hover:border-green-400/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    selectedPaymentMethod === 'ewallet' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : isDark
                        ? 'bg-white/10 group-hover:bg-green-500/20'
                        : 'bg-gray-100 group-hover:bg-green-500/20'
                  }`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>E-Wallet</div>
                    <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>DANA, OVO, GoPay, ShopeePay</div>
                  </div>
                </div>
                <div className={`text-2xl transition-all duration-300 ${
                  selectedPaymentMethod === 'ewallet' ? 'text-green-400' : isDark ? 'text-white/30 group-hover:text-green-400' : 'text-gray-400 group-hover:text-green-400'
                }`}>✓</div>
              </div>
              
              <div 
                onClick={() => handlePaymentMethodClick('qris')}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                  selectedPaymentMethod === 'qris' 
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/50 shadow-lg shadow-purple-500/20'
                      : 'bg-gradient-to-r from-purple-100/80 to-pink-100/80 border-purple-400/60 shadow-lg shadow-purple-500/20'
                    : isDark
                      ? 'bg-white/10 border-white/20 hover:border-purple-400/50 hover:bg-white/15'
                      : 'bg-white/80 border-gray-200/60 hover:border-purple-400/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    selectedPaymentMethod === 'qris' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                      : isDark
                        ? 'bg-white/10 group-hover:bg-purple-500/20'
                        : 'bg-gray-100 group-hover:bg-purple-500/20'
                  }`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>QRIS</div>
                    <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Scan QR Code untuk pembayaran</div>
                  </div>
                </div>
                <div className={`text-2xl transition-all duration-300 ${
                  selectedPaymentMethod === 'qris' ? 'text-green-400' : isDark ? 'text-white/30 group-hover:text-green-400' : 'text-gray-400 group-hover:text-green-400'
                }`}>✓</div>
              </div>
            </div>

            {/* Bank Selection Dropdown - Only show when bank is selected */}
            {selectedPaymentMethod === 'bank' && (
              <div className={`mt-8 p-6 rounded-2xl border transition-all duration-300 shadow-lg hover:shadow-blue-500/10 ${
                isDark 
                  ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 hover:border-blue-400/30'
                  : 'bg-gradient-to-br from-gray-50/80 to-white/90 border-gray-200/60 hover:bg-gradient-to-br hover:from-gray-100/80 hover:to-white hover:border-blue-400/60'
              }`}>
                <label className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Pilih Bank
                </label>
                <div className="relative group">
                  <select
                    value={selectedBank}
                    onChange={(e) => handleBankSelect(e.target.value)}
                    className={`w-full px-6 py-5 border rounded-2xl focus:ring-2 transition-all duration-300 group-hover:border-blue-300/50 appearance-none cursor-pointer shadow-lg hover:shadow-blue-500/10 ${
                      isDark 
                        ? 'bg-gradient-to-r from-gray-800/90 to-gray-900/90 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/20 focus:bg-gray-800'
                        : 'bg-white border-gray-300/60 text-gray-800 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white'
                    }`}
                  >
                    {bankOptions.map((bank) => (
                      <option key={bank.value} value={bank.value} className={isDark ? "bg-gray-900 text-white py-2 px-4" : "bg-white text-gray-800 py-2 px-4"}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20">
                      <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                </div>
                <div className={`mt-4 p-3 rounded-xl border ${
                  isDark 
                    ? 'bg-blue-600/10 border-blue-400/20' 
                    : 'bg-blue-50/80 border-blue-300/40'
                }`}>
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Kode Bank: {bankOptions.find(bank => bank.value === selectedBank)?.code}</span>
                  </div>
                </div>
              </div>
            )}

            {/* E-Wallet Selection - Only show when e-wallet is selected */}
            {selectedPaymentMethod === 'ewallet' && (
              <div className={`mt-6 p-5 rounded-xl border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gray-50/80 border-gray-200/60'
              }`}>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                  Pilih E-Wallet
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'dana', label: 'DANA' },
                    { value: 'ovo', label: 'OVO' },
                    { value: 'gopay', label: 'GoPay' },
                    { value: 'shopeepay', label: 'ShopeePay' }
                  ].map((wallet) => (
                    <button
                      key={wallet.value}
                      onClick={() => handleEwalletSelect(wallet.value)}
                      className={`p-3 border rounded-lg transition-all duration-300 text-center ${
                        selectedEwallet === wallet.value
                          ? isDark
                            ? 'bg-blue-600/20 border-blue-400/50 shadow-lg shadow-blue-500/10 text-white'
                            : 'bg-blue-100/80 border-blue-400/60 shadow-lg shadow-blue-500/10 text-gray-800'
                          : isDark
                            ? 'bg-white/10 border-white/20 hover:border-blue-400/50 hover:bg-white/15 text-white'
                            : 'bg-white/80 border-gray-200/60 hover:border-blue-400/60 hover:bg-white text-gray-800'
                      }`}
                    >
                      {wallet.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QRIS Info - Only show when QRIS is selected */}
            {selectedPaymentMethod === 'qris' && (
              <div className={`mt-6 p-5 rounded-xl border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gray-50/80 border-gray-200/60'
              }`}>
                <div className="text-center">
                  <div className={`w-32 h-32 border-2 border-dashed rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    isDark 
                      ? 'bg-white/10 border-white/30' 
                      : 'bg-white/80 border-gray-300/60'
                  }`}>
                    <svg className={`w-16 h-16 ${isDark ? 'text-white/50' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                    QR Code akan muncul setelah Anda mengklik "Lanjutkan Pembayaran"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-2xl ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/90 border-gray-200/40'
          }`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Ringkasan Pembayaran
            </h2>
            
            <div className="space-y-4">
              <div className={`flex justify-between items-center py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}>
                <span className={`font-medium ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Subtotal</span>
                <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatPrice(displayData.ticketPrice * displayData.amount)}</span>
              </div>
              <div className={`flex justify-between items-center py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}>
                <span className={`font-medium ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Biaya Admin</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatPrice(1500)}</span>
              </div>
              <div className={`flex justify-between items-center py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200/60'}`}>
                <span className={`font-medium ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>Pajak</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatPrice(displayData.totalPrice * 0.1)}</span>
              </div>
              <div className={`bg-gradient-to-r rounded-xl p-5 border ${
                isDark 
                  ? 'from-blue-600/20 to-indigo-600/20 border-blue-400/30' 
                  : 'from-blue-100/80 to-indigo-100/80 border-blue-300/50'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Total</span>
                  <span className={`font-bold text-2xl ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{formatPrice(displayData.totalPrice + 1500 + (displayData.totalPrice * 0.1))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-8">
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`group w-full font-bold py-6 px-8 rounded-3xl transition-all duration-500 transform shadow-2xl relative overflow-hidden ${
                isProcessing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-blue-500/25 active:scale-95'
              }`}
            >
              {/* Animated background */}
              {!isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              )}
              
              <div className="relative flex items-center justify-center gap-4">
                {isProcessing ? (
                  <>
                    <div className="relative">
                      <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="text-xl font-semibold">Memproses Pembayaran Demo...</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                    </div>
                    <span className="text-xl font-semibold">Lanjutkan Pembayaran (Demo)</span>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Security Info */}
          <div className={`text-center rounded-xl p-4 border ${
            isDark 
              ? 'bg-white/5 border-white/10' 
              : 'bg-gray-50/80 border-gray-200/60'
          }`}>
            <p className={`text-sm font-medium ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
              🔒 Pembayaran aman • ⚡ Proses cepat • 🎫 Tiket digital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
