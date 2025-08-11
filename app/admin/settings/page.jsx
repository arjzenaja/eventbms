'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSettingsPage() {
  const { adminUser, updateProfile, updatePreferences } = useAdmin();

  const [name, setName] = useState(adminUser?.name || '');
  const [email, setEmail] = useState(adminUser?.email || '');
  const [theme, setTheme] = useState(adminUser?.preferences?.theme || 'light');
  const [notifEmail, setNotifEmail] = useState(
    adminUser?.preferences?.notifications?.email ?? true
  );
  const [notifPush, setNotifPush] = useState(
    adminUser?.preferences?.notifications?.push ?? false
  );
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSavePrefs = (e) => {
    e.preventDefault();
    updatePreferences({
      theme,
      notifications: { email: notifEmail, push: notifPush },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Pengaturan</h2>
        <p className="text-sm text-gray-900">Kelola profil dan preferensi admin.</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
          Perubahan tersimpan.
        </div>
      )}

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Profil</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Nama</label>
            <input
              className="w-full border rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Simpan Profil
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Preferensi</h3>
        <form onSubmit={handleSavePrefs} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Tema</label>
            <select
              className="w-full border rounded-md px-3 py-2 bg-white text-gray-900"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Terang</option>
              <option value="dark">Gelap</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Notifikasi</label>
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center space-x-2 text-gray-900">
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                />
                <span>Email</span>
              </label>
              <label className="inline-flex items-center space-x-2 text-gray-900">
                <input
                  type="checkbox"
                  checked={notifPush}
                  onChange={(e) => setNotifPush(e.target.checked)}
                />
                <span>Push</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Simpan Preferensi
          </button>
        </form>
      </section>
    </div>
  );
}



