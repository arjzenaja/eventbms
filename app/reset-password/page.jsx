'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const initialEmail = params.get('email') || '';
    setEmail(initialEmail);
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email tidak boleh kosong.');
      return;
    }
    if (otp.length !== 6) {
      setError('Masukkan OTP 6 digit.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password, otp })
      });
      const data = await res.json();
      if (data.success) {
        try {
          localStorage.setItem('flashToast', JSON.stringify({
            type: 'success',
            title: 'Password Diperbarui',
            message: 'Silakan masuk menggunakan password baru.'
          }));
        } catch (_) {}
        router.push('/login');
      } else {
        setError(data.message || 'Gagal memperbarui password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 pt-28 md:pt-36">
      <div className="w-full max-w-md">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-600/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Reset Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Masukkan email dan password baru Anda.</p>
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
              <label htmlFor="otp" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Kode OTP</label>
              <input id="otp" type="text" inputMode="numeric" pattern="\\d{6}" value={otp} onChange={(e)=>setOtp(e.target.value.replace(/[^0-9]/g,''))} required className="appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-700/90 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 text-sm" placeholder="6 digit OTP" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email</label>
              <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-700/90 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 text-sm" placeholder="Email Anda" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Password Baru</label>
              <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-700/90 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 text-sm" placeholder="••••••••" />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Konfirmasi Password</label>
              <input id="confirm" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-700/90 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-300 dark:focus:border-blue-500 text-sm" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-500 dark:from-slate-600 dark:via-blue-600 dark:to-indigo-600 disabled:opacity-50">{isLoading ? 'Memproses...' : 'Simpan Password Baru'}</button>

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Kembali ke halaman masuk</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


