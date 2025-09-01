'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Settings, Save, RefreshCw, Database, Bell, Shield, Palette, Globe, ArrowLeft, User, Lock, Monitor, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    theme: 'light',
    language: 'id',
    timezone: 'Asia/Jakarta',
    dataRetention: '1 year',
    emailNotifications: true,
    pushNotifications: false,
    securityLogs: true,
    autoSave: true
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setNotification({ 
      show: true, 
      message: 'Pengaturan berhasil disimpan!', 
      type: 'success' 
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
    
    setLoading(false);
  };

  const handleResetSettings = () => {
    if (confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
      setSettings({
        notifications: true,
        autoBackup: true,
        theme: 'light',
        language: 'id',
        timezone: 'Asia/Jakarta',
        dataRetention: '1 year',
        emailNotifications: true,
        pushNotifications: false,
        securityLogs: true,
        autoSave: true
      });
      
      setNotification({ 
        show: true, 
        message: 'Pengaturan berhasil direset ke default!', 
        type: 'success' 
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 4000);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-6">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transition-all duration-300 transform ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {notification.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className="ml-4 text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/data"
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="text-blue-600" size={32} />
                  Pengaturan Sistem
                </h1>
                <p className="text-lg text-gray-600">Kelola konfigurasi dan preferensi sistem admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <RefreshCw size={18} className="inline mr-2" />
                Reset Default
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={18} />
                )}
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - User & Security */}
          <div className="space-y-6">
            {/* User Profile Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <User className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Profil Pengguna</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Admin Test</h4>
                    <p className="text-sm text-gray-600">super_admin</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Notifikasi
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Lock className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Keamanan</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Log Keamanan</h4>
                    <p className="text-sm text-gray-600">Catat semua aktivitas login</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.securityLogs}
                      onChange={(e) => handleSettingChange('securityLogs', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Auto Save</h4>
                    <p className="text-sm text-gray-600">Simpan otomatis setiap 5 menit</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Notifications & Data */}
          <div className="space-y-6">
            {/* Notifications Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Bell className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Notifikasi</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Notifikasi Sistem</h4>
                    <p className="text-sm text-gray-600">Update dan perubahan data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Notifikasi real-time</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Management Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Database className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Manajemen Data</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Auto Backup</h4>
                    <p className="text-sm text-gray-600">Backup otomatis harian</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Retensi Data
                  </label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                  >
                    <option value="6 months">6 Bulan</option>
                    <option value="1 year">1 Tahun</option>
                    <option value="2 years">2 Tahun</option>
                    <option value="5 years">5 Tahun</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Appearance & Regional */}
          <div className="space-y-6">
            {/* Appearance Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Palette className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tampilan</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Tema
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSettingChange('theme', 'light')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        settings.theme === 'light'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">☀️</div>
                        <div className="font-medium">Light</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSettingChange('theme', 'dark')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        settings.theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🌙</div>
                        <div className="font-medium">Dark</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Globe className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Regional</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Bahasa
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Zona Waktu
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                  >
                    <option value="Asia/Jakarta">WIB (UTC+7)</option>
                    <option value="Asia/Makassar">WITA (UTC+8)</option>
                    <option value="Asia/Jayapura">WIT (UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-200 rounded-xl">
                <Monitor className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Status Sistem</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Database</span>
                <span className="text-green-600 font-semibold">● Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">API</span>
                <span className="text-green-600 font-semibold">● Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Backup</span>
                <span className="text-green-600 font-semibold">● Enabled</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-200 rounded-xl">
                <FileText className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-green-900">Data Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Total Records</span>
                <span className="text-green-600 font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Last Backup</span>
                <span className="text-green-600 font-semibold">2 jam lalu</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Storage</span>
                <span className="text-green-600 font-semibold">2.4 GB</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-200 rounded-xl">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-purple-900">Keamanan</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700">Login Terakhir</span>
                <span className="text-purple-600 font-semibold">5 menit lalu</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700">Session</span>
                <span className="text-green-600 font-semibold">● Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700">2FA</span>
                <span className="text-green-600 font-semibold">● Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}



