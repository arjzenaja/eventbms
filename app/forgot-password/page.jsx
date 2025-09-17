'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      try {
        localStorage.setItem('flashToast', JSON.stringify({
          type: 'info',
          title: 'OTP Dikirim',
          message: 'Cek OTP di terminal server (valid 5 menit).'
        }));
      } catch (_) {}

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 pt-28 md:pt-36">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-600">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center p-1">
              <img src="/Lambang_Kabupaten_Banyumas.png" alt="Logo Kabupaten Banyumas" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-600/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Lupa Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Masukkan email Anda untuk menerima link reset password.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-700/90 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 text-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-700"
                  placeholder="Masukkan email Anda"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 dark:text-slate-500">📧</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-500 dark:from-slate-600 dark:via-blue-600 dark:to-indigo-600 hover:from-slate-600 dark:hover:from-slate-700 hover:via-blue-600 dark:hover:via-blue-700 hover:to-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Mengirim...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>Kirim Link Reset</span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link href={`/reset-password?email=${encodeURIComponent(email || '')}`} className="font-medium text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200">
                Masuk ke halaman reset password →
              </Link>
              <Link href="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                Kembali ke masuk
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2025 Dolan Banyumas. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}


