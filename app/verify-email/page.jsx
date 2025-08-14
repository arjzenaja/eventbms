'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { MailCheck, Mail, RefreshCw, ExternalLink, Copy, ShieldCheck, Clock, Sparkles } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const [state, setState] = useState({ status: 'idle', message: '' });
  const [userEmail, setUserEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const startVerification = async (token) => {
    setState({ status: 'verifying', message: 'Memverifikasi email Anda...' });
    try {
      const res = await fetch('/api/users/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.success) {
        // Auto-login after verification
        login(data.user);
        try {
          localStorage.setItem('flashToast', JSON.stringify({
            type: 'success',
            title: 'Email Terverifikasi',
            message: 'Akun Anda sudah aktif. Selamat datang!'
          }));
        } catch (_) {}
        setState({ status: 'success', message: 'Email berhasil diverifikasi. Mengarahkan ke beranda...' });
        setTimeout(() => router.push('/'), 1200);
      } else {
        setState({ status: 'error', message: data.message || 'Token verifikasi tidak valid.' });
      }
    } catch (e) {
      setState({ status: 'error', message: 'Terjadi kesalahan koneksi. Coba lagi nanti.' });
    }
  };

  useEffect(() => {
    // Try token from URL first, fallback to localStorage
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      startVerification(tokenFromUrl);
      return;
    }
    try {
      const pending = JSON.parse(localStorage.getItem('pendingVerifyEmail') || 'null');
      if (pending?.token) {
        startVerification(pending.token);
        localStorage.removeItem('pendingVerifyEmail');
      } else {
        setState({ status: 'waiting', message: 'Kami telah mengirim tautan verifikasi ke email Anda. Silakan periksa inbox/spam.' });
      }
      if (pending?.email) setUserEmail(pending.email);
    } catch (_) {
      setState({ status: 'waiting', message: 'Kami telah mengirim tautan verifikasi ke email Anda. Silakan periksa inbox/spam.' });
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const resend = async () => {
    try {
      const pending = JSON.parse(localStorage.getItem('pendingVerifyEmail') || 'null');
      const email = pending?.email;
      if (!email) {
        setState({ status: 'error', message: 'Email tidak ditemukan untuk kirim ulang.' });
        return;
      }
      if (resendCooldown > 0) return;
      setState({ status: 'sending', message: 'Mengirim ulang email verifikasi...' });
      const res = await fetch('/api/users/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setState({ status: 'waiting', message: 'Email verifikasi telah dikirim ulang. Periksa inbox/spam Anda.' });
        setResendCooldown(30);
      } else {
        setState({ status: 'error', message: data.message || 'Gagal mengirim ulang email verifikasi.' });
      }
    } catch (e) {
      setState({ status: 'error', message: 'Terjadi kesalahan koneksi. Coba lagi nanti.' });
    }
  };

  const maskedEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const visible = user.slice(0, 2);
    return `${visible}${user.length > 2 ? '*****' : ''}@${domain}`;
  };

  const providerLink = (email) => {
    const domain = (email || '').split('@')[1] || '';
    if (domain.includes('gmail')) return 'https://mail.google.com';
    if (domain.includes('yahoo')) return 'https://mail.yahoo.com';
    if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) return 'https://outlook.live.com/mail/';
    if (domain.includes('icloud')) return 'https://www.icloud.com/mail';
    return null;
  };

  const openProvider = () => {
    const link = providerLink(userEmail);
    if (link) window.open(link, '_blank');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(userEmail);
      setState({ status: 'waiting', message: 'Alamat email disalin ke clipboard.' });
    } catch (_) {
      setState({ status: 'error', message: 'Gagal menyalin alamat email.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-white">DB</span>
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Verifikasi Email
        </h2>
        <p className="text-center text-lg text-gray-600 mb-8">
          Aktifkan akun Anda dengan memverifikasi email.
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
              <MailCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Cek email Anda
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-gray-600 mt-1">
                Kami mengirim tautan verifikasi ke{' '}
                <span className="font-medium text-gray-900">{maskedEmail(userEmail)}</span>
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600" /> Buka email berjudul <span className="italic">"Verifikasi Email Akun Dolan Banyumas"</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> Klik tombol “Verifikasi Email” di dalam email</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" /> Cek folder Spam/Promosi jika tidak menemukan email</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={openProvider}
                  disabled={!providerLink(userEmail)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${providerLink(userEmail) ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  title={providerLink(userEmail) ? 'Buka penyedia email' : 'Penyedia email tidak terdeteksi'}
                >
                  <ExternalLink className="w-4 h-4" /> Buka Email
                </button>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-[1.02]"
                >
                  <Copy className="w-4 h-4" /> Salin Alamat
                </button>
                <button
                  onClick={resend}
                  disabled={state.status === 'sending' || resendCooldown > 0}
                  className={`col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${state.status === 'sending' || resendCooldown > 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:scale-[1.02]'}`}
                >
                  <RefreshCw className={`w-4 h-4 ${state.status === 'sending' ? 'animate-spin' : ''}`} />
                  {state.status === 'sending' ? 'Mengirim ulang...' : resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang Email'}
                </button>
              </div>

              <div className="mt-6">
                <div className={`rounded-xl p-3 text-sm ${state.status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : state.status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {state.message}
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                Salah email?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Daftar ulang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2025 Dolan Banyumas. All rights reserved.
        </p>
      </div>
    </div>
  );
}


