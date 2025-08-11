'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewSouvenirPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productType: 'makanan',
    productName: '',
    short_description: '',
    description: '',
    storeName: '',
    address: '',
    contact: '',
    price: '',
    packaging: '',
    photoLinks: '', // one per line or comma separated
    img_sm: '',
    img_lg: '',
    extraInfo: '',
    recommended: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const normalizePhotoLinks = (links) => {
    if (!links) return [];
    return links
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const photos = normalizePhotoLinks(formData.photoLinks);
      const firstPhoto = photos[0] || '';

      const payload = {
        // keep list/table compatibility
        title: formData.productName,
        location: formData.address,
        short_description:
          formData.short_description ||
          (formData.description ? `${formData.description.slice(0, 100)}...` : ''),
        description: formData.description,

        // extra metadata for oleh-oleh
        category: formData.productType, // makanan | pakaian
        store_name: formData.storeName,
        address: formData.address,
        contact: formData.contact,
        price: formData.price,
        packaging: formData.packaging,
        photo_links: photos,
        extra_info: formData.extraInfo,
        img_sm: formData.img_sm || firstPhoto || '/upcoming/img/art/1-sm.png',
        img_lg: formData.img_lg || firstPhoto || '/upcoming/img/art/1-lg.png',
        recommended: formData.recommended,
      };

      const response = await fetch('/api/souvenirs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        alert('Oleh-oleh berhasil ditambahkan!');
        router.push('/admin/souvenirs');
      } else {
        setError(data.message || 'Gagal menambahkan oleh-oleh');
      }
    } catch (err) {
      console.error('Error creating souvenir:', err);
      setError('Terjadi kesalahan saat menambahkan oleh-oleh');
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
              <h1 className="text-3xl font-bold text-gray-900">Tambah Oleh-oleh Baru</h1>
              <Link
                href="/admin/souvenirs"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Oleh-oleh
                    </label>
                    <select
                      id="productType"
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="makanan">Makanan</option>
                      <option value="pakaian">Pakaian</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      required
                      placeholder={formData.productType === 'makanan' ? 'Contoh: Getuk Goreng Sokaraja' : 'Contoh: Batik Gajah Uling'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Penjelasan Singkat
                    </label>
                    <input
                      type="text"
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      placeholder="Ringkas: 1-2 kalimat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={
                        formData.productType === 'makanan'
                          ? 'Bahan dasar, rasa, ciri khas, sejarah/asal-usul'
                          : 'Ciri khas motif, bahan, filosofi, keunikan'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                      Toko/Produsen
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      placeholder={formData.productType === 'makanan' ? 'Contoh: Sentra Oleh-oleh ...' : 'Contoh: Galeri Batik ...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak Penjual
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="HP/WA/Instagram/Marketplace"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Alamat toko/sentra oleh-oleh"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Harga
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder={formData.productType === 'makanan' ? 'Contoh: Rp15.000 per pack isi 10' : 'Contoh: Rp80.000 – Rp250.000'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="packaging" className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kemasan / Produk Lain
                    </label>
                    <input
                      type="text"
                      id="packaging"
                      name="packaging"
                      value={formData.packaging}
                      onChange={handleInputChange}
                      placeholder={formData.productType === 'makanan' ? 'Contoh: Box, plastik kedap udara' : 'Contoh: kain, baju, syal, tas'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="photoLinks" className="block text-sm font-medium text-gray-700 mb-2">
                      Link Foto / Galeri (satu per baris)
                    </label>
                    <textarea
                      id="photoLinks"
                      name="photoLinks"
                      rows={3}
                      value={formData.photoLinks}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/..., https://instagram.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                      URL Gambar Kecil (opsional)
                    </label>
                    <input
                      type="url"
                      id="img_sm"
                      name="img_sm"
                      value={formData.img_sm}
                      onChange={handleInputChange}
                      placeholder="/path/to/image-sm.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                      URL Gambar Besar (opsional)
                    </label>
                    <input
                      type="url"
                      id="img_lg"
                      name="img_lg"
                      value={formData.img_lg}
                      onChange={handleInputChange}
                      placeholder="/path/to/image-lg.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="extraInfo" className="block text-sm font-medium text-gray-700 mb-2">
                      Info Tambahan
                    </label>
                    <textarea
                      id="extraInfo"
                      name="extraInfo"
                      rows={2}
                      value={formData.extraInfo}
                      onChange={handleInputChange}
                      placeholder={
                        formData.productType === 'makanan'
                          ? 'Varian rasa, halal, bisa dipesan online, dll.'
                          : 'Bisa pesan motif custom, workshop tersedia, dll.'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
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
                        Tandai sebagai oleh-oleh yang direkomendasikan
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Link
                    href="/admin/souvenirs"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Oleh-oleh'}
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


