'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserProvider, useUser } from '@/context/UserContext';
import { BiRefresh, BiCheckCircle, BiXCircle, BiTime, BiEnvelope, BiLeftArrowAlt } from 'react-icons/bi';

function VerifyOTPContent() {
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpId, setOtpId] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(3);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get('email');
    const storedData = localStorage.getItem('pendingVerifyEmail');
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setEmail(data.email);
        setName(data.name || '');
      } catch (error) {
        console.error('Error parsing stored data:', error);
        router.push('/register');
        return;
      }
    } else {
      router.push('/register');
      return;
    }

    // Check OTP status
    checkOTPStatus();
  }, [searchParams, router]);

  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const checkOTPStatus = async () => {
    try {
      const response = await fetch(`/api/users/verify-otp?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        setTimeLeft(data.data.expires_in);
        setOtpId(data.data.otp_id);
        setAttempts(data.data.attempts);
        setMaxAttempts(data.data.max_attempts);
      } else {
        setError('Tidak ada kode OTP aktif. Silakan daftar ulang.');
      }
    } catch (error) {
      console.error('Error checking OTP status:', error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedDigits.length === 6) {
      const newOtp = pastedDigits.split('');
      setOtpCode(newOtp);
      setError('');
      
      // Focus last input
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otpCode.join('');
    
    if (otpString.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp_code: otpString,
          otp_id: otpId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        
        // Show success message and redirect to login
        localStorage.setItem('flashToast', JSON.stringify({
          type: 'success',
          title: 'Verifikasi Berhasil!',
          message: 'Email Anda telah berhasil diverifikasi. Silakan login untuk melanjutkan.'
        }));
        
        // Clear pending verification data
        localStorage.removeItem('pendingVerifyEmail');
        
        // Redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message);
        setAttempts(prev => prev + 1);
        
        // Clear OTP on error
        setOtpCode(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || 'User'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTimeLeft(data.data.expires_in);
        setOtpId(data.data.otp_id);
        setAttempts(0);
        setOtpCode(['', '', '', '', '', '']);
        
        // Show success message
        setSuccess(false);
        setError('');
        
        // Focus first input
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiCheckCircle className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Verifikasi Berhasil!</h1>
            <p className="text-blue-200 mb-8">
              Email Anda telah berhasil diverifikasi. Anda akan diarahkan ke halaman utama.
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiEnvelope className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verifikasi Email</h1>
            <p className="text-blue-200 text-sm">
              Masukkan 6 digit kode OTP yang telah dikirim ke
            </p>
            <p className="text-white font-semibold">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center gap-3 mb-4">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15 transition-all duration-300"
                  disabled={isLoading}
                />
              ))}
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                <BiXCircle className="text-lg" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {timeLeft > 0 ? (
              <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-4">
                <BiTime className="text-lg" />
                <span>Kode berlaku selama: {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="text-yellow-400 text-sm mb-4">
                Kode OTP telah kedaluwarsa
              </div>
            )}
            
            <button
              onClick={handleResendOTP}
              disabled={isResending || timeLeft > 0}
              className={`text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors ${
                isResending || timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                  Mengirim ulang...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <BiRefresh className="text-lg" />
                  Kirim ulang kode OTP
                </div>
              )}
            </button>
          </div>

          {/* Attempts Info */}
          {attempts > 0 && (
            <div className="text-center mb-6">
              <div className="text-yellow-400 text-sm">
                Percobaan: {attempts}/{maxAttempts}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleVerify}
              disabled={isLoading || otpCode.join('').length !== 6}
              className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform ${
                isLoading || otpCode.join('').length !== 6
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Memverifikasi...
                </div>
              ) : (
                'Verifikasi Email'
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/resend-otp')}
                className="bg-transparent border-2 border-yellow-400/30 text-yellow-400 font-bold py-3 px-4 rounded-2xl hover:bg-yellow-400/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <BiRefresh className="text-lg" />
                Kirim Ulang
              </button>
              
              <button
                onClick={() => router.push('/register')}
                className="bg-transparent border-2 border-white/30 text-white font-bold py-3 px-4 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <BiLeftArrowAlt className="text-lg" />
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <UserProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      }>
        <VerifyOTPContent />
      </Suspense>
    </UserProvider>
  );
}
