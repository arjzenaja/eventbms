'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function UserProfile() {
  const { user, updateProfile, logout } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update user profile in context
        updateProfile(data.user);
        setMessage('Profile berhasil diperbarui!');
        setIsEditing(false);
      } else {
        setMessage(data.message || 'Gagal memperbarui profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Gagal memperbarui profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Saya</h1>
            <p className="text-lg text-gray-600">Kelola informasi akun Anda</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${
                message.includes('berhasil') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="0812-3456-7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="text"
                    value={new Date(user.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-500 bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || ''
                      });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Aksi Akun</h3>
            
            <div className="space-y-4">
              <Link href="/change-password">
                <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Ubah Password</h4>
                      <p className="text-sm text-gray-600">Perbarui password akun Anda</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left p-4 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-700">Keluar</h4>
                    <p className="text-sm text-red-600">Keluar dari akun Anda</p>
                  </div>
                  <span className="text-red-400">→</span>
                </div>
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/">
              <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                ← Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
