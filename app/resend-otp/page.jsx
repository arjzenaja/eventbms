'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiRefresh, BiCheckCircle, BiEnvelope, BiLeftArrowAlt } from 'react-icons/bi';

export default function ResendOTPPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage
    const storedData = localStorage.getItem('pendingVerifyEmail');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setEmail(data.email);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        router.push('/register');
      }
    } else {
      router.push('/register');
    }

    // Jangan set cooldown awal; hanya setelah kirim ulang sukses
  }, [router]);

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResendOTP = async () => {
    if (!email) {
      setError('Email tidak ditemukan');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: 'User'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        const nextCooldown = (data?.data?.cooldown_seconds ?? 30);
        setCooldown(nextCooldown);
        
        // Show success message
        localStorage.setItem('flashToast', JSON.stringify({
          type: 'success',
          title: 'Kode OTP Dikirim Ulang',
          message: 'Kode OTP baru telah dikirim ke email Anda.'
        }));
        
        // Redirect to verify OTP page
        setTimeout(() => {
          router.push('/verify-otp');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiCheckCircle className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Kode OTP Dikirim!</h1>
            <p className="text-blue-200 mb-8">
              Kode OTP baru telah dikirim ke email Anda. Anda akan diarahkan ke halaman verifikasi.
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
            <h1 className="text-2xl font-bold text-white mb-2">Kirim Ulang OTP</h1>
            <p className="text-blue-200 text-sm">
              Kirim ulang kode OTP ke email Anda
            </p>
            <p className="text-white font-semibold text-sm mt-2">{email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Cooldown Timer */}
          {cooldown > 0 && (
            <div className="text-center mb-6">
              <div className="text-yellow-400 text-sm">
                Tunggu {cooldown} detik sebelum mengirim ulang
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleResendOTP}
              disabled={isLoading || cooldown > 0}
              className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform flex items-center justify-center gap-3 ${
                isLoading || cooldown > 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <BiRefresh className="text-xl" />
                  Kirim Ulang OTP
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push('/verify-otp')}
              className="w-full bg-transparent border-2 border-white/30 text-white font-bold py-3 px-6 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BiLeftArrowAlt className="text-lg" />
              Kembali ke Verifikasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
