'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { useTheme } from '@/context/ThemeContext';

const SettingsPage = () => {
  const { user, isLoading, updateProfile, updatePreferences, logout } = useUser();
  const router = useRouter();
  const { setThemeMode, themeMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  
  // Preferences form state
  const [preferencesForm, setPreferencesForm] = useState({
    theme: user?.preferences?.theme || 'light',
    language: user?.preferences?.language || 'id',
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      push: user?.preferences?.notifications?.push ?? false,
      sms: user?.preferences?.notifications?.sms ?? false
    }
  });
  
  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    showSavedMessage();
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    updatePreferences(preferencesForm);
    showSavedMessage();
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to change password
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    // Reset form
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 text-center">
          <div className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Silakan Masuk</div>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Anda perlu login untuk mengakses pengaturan akun.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Masuk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Pengaturan <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Akun</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kelola profil, preferensi, dan keamanan akun Anda
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl text-center mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="font-medium">Perubahan berhasil disimpan!</span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'profile', label: 'Profil', icon: '👤' },
              { id: 'preferences', label: 'Preferensi', icon: '⚙️' },
              { id: 'security', label: 'Keamanan', icon: '🔒' },
              { id: 'notifications', label: 'Notifikasi', icon: '🔔' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Informasi Profil</h2>
                  <p className="text-gray-600 dark:text-gray-300">Update informasi pribadi Anda</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Masukkan email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Ceritakan tentang diri Anda"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Preferensi Aplikasi</h2>
                  <p className="text-gray-600 dark:text-gray-300">Sesuaikan pengalaman menggunakan aplikasi</p>
                </div>

                <form onSubmit={handlePreferencesSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tampilan</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tema
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Mode Terang', icon: '☀️' },
                            { value: 'dark', label: 'Mode Gelap', icon: '🌙' },
                            { value: 'auto', label: 'Otomatis', icon: '⚙️' }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setPreferencesForm({ ...preferencesForm, theme: opt.value });
                                setThemeMode(opt.value);
                              }}
                              aria-pressed={preferencesForm.theme === opt.value}
                              className={`p-4 rounded-2xl border transition-all text-left ${
                                preferencesForm.theme === opt.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{opt.icon}</span>
                                <span className="font-medium">{opt.label}</span>
                              </div>
                              <div className="mt-2">
                                <span
                                  className={`inline-block h-4 w-4 rounded-full border-2 align-middle ${
                                    preferencesForm.theme === opt.value
                                      ? 'border-blue-600 bg-blue-600'
                                      : 'border-gray-300'
                                  }`}
                                  role="radio"
                                  aria-checked={preferencesForm.theme === opt.value}
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bahasa
                        </label>
                        <div className="w-full">
                          <Select
                            value={preferencesForm.language}
                            onValueChange={(val) => setPreferencesForm({ ...preferencesForm, language: val })}
                          >
                            <SelectTrigger className="h-12 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-gray-900 dark:text-white">
                              <SelectValue placeholder="Pilih bahasa" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-xl">
                              <SelectItem value="id">Bahasa Indonesia</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notifikasi</h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferencesForm.notifications.email}
                            onChange={(e) => setPreferencesForm({
                              ...preferencesForm,
                              notifications: {...preferencesForm.notifications, email: e.target.checked}
                            })}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Notifikasi Email</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferencesForm.notifications.push}
                            onChange={(e) => setPreferencesForm({
                              ...preferencesForm,
                              notifications: {...preferencesForm.notifications, push: e.target.checked}
                            })}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Notifikasi Push</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferencesForm.notifications.sms}
                            onChange={(e) => setPreferencesForm({
                              ...preferencesForm,
                              notifications: {...preferencesForm.notifications, sms: e.target.checked}
                            })}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Notifikasi SMS</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      Simpan Preferensi
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Keamanan Akun</h2>
                  <p className="text-gray-600 dark:text-gray-300">Kelola keamanan dan akses akun Anda</p>
                </div>

                <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Masukkan password saat ini"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Masukkan password baru"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Konfirmasi password baru"
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      Ubah Password
                    </button>
                  </div>
                </form>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tindakan Berbahaya</h3>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Keluar dari Akun
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Pengaturan Notifikasi</h2>
                  <p className="text-gray-600 dark:text-gray-300">Atur kapan dan bagaimana Anda ingin menerima notifikasi</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notifikasi Wisata</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Event Baru</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Dapatkan info event wisata terbaru</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Promo & Diskon</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Info promo dan diskon wisata</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Update Destinasi</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Info terbaru tentang destinasi wisata</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notifikasi Sistem</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Update Aplikasi</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Info update dan fitur baru</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Maintenance</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Info maintenance dan downtime</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Keamanan</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Alert keamanan akun</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25">
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/">
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl transition-all duration-300 hover:scale-105">
              ← Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
