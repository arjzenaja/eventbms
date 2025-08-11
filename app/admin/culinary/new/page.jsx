'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewCulinaryItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    type: 'cafe',
    img_sm: '/upcoming/img/food/1-sm.png',
    img_lg: '/upcoming/img/food/1-lg.png',
    recommended: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/culinary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Item kuliner berhasil ditambahkan!');
        router.push('/admin/culinary');
      } else {
        alert('Gagal menambahkan item kuliner: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating culinary item:', error);
      alert('Terjadi kesalahan saat membuat item kuliner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Tambah Item Kuliner Baru</h1>
              <Link 
                href="/admin/culinary" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Nama Kuliner *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama kuliner"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi kuliner"
                  />
                </div>

                {/* Tipe Kuliner */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipe Kuliner *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cafe">Cafe</option>
                    <option value="resto">Resto</option>
                    <option value="kedai">Kedai</option>
                    <option value="rumah-makan">Rumah Makan</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700">
                      Gambar Kecil
                    </label>
                    <input
                      type="text"
                      id="img_sm"
                      name="img_sm"
                      value={formData.img_sm}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL gambar kecil"
                    />
                  </div>

                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700">
                      Gambar Besar
                    </label>
                    <input
                      type="text"
                      id="img_lg"
                      name="img_lg"
                      value={formData.img_lg}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL gambar besar"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommended"
                    name="recommended"
                    checked={formData.recommended}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recommended" className="ml-2 block text-sm text-gray-900">
                    Rekomendasikan item ini
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/culinary"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
