'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function NewTravelAgency() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    location: '',
    type: 'biro-perjalanan',
    services: [],
    office_address: '',
    contact: {
      whatsapp: '',
      email: '',
      instagram: '',
      website: ''
    },
    pricing: '',
    facilities: [],
    gallery_link: '',
    additional_info: '',
    recommended: false
  });

  const [imageFiles, setImageFiles] = useState({
    img_sm: null,
    img_lg: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    img_sm: null,
    img_lg: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const serviceOptions = [
    'Paket wisata lokal (one day trip, city tour)',
    'Paket luar kota / luar negeri',
    'Layanan sewa mobil',
    'Tiket pesawat/kereta',
    'Open trip / private trip',
    'Ziarah & religi tour'
  ];

  const facilityOptions = [
    'Guide lokal berpengalaman',
    'Free dokumentasi',
    'Mobil full AC',
    'Tiket masuk objek wisata',
    'Konsumsi / snack',
    'Penginapan (untuk paket multi-day)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      
      setImageFiles(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({
          ...prev,
          [name]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'contact') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
      }

      const response = await fetch('/api/travel-agencies', {
        method: 'POST',
        body: formDataToSend, // Don't set Content-Type header, let browser set it with boundary
      });

      const data = await response.json();

      if (data.success) {
        alert('Biro perjalanan berhasil ditambahkan!');
        router.push('/admin/travel-agencies');
      } else {
        setError(data.message || 'Gagal menambahkan biro perjalanan');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Terjadi kesalahan saat menambahkan biro perjalanan');
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
              <h1 className="text-3xl font-bold text-gray-900">Tambah Biro Perjalanan Baru</h1>
              <Link 
                href="/admin/travel-agencies"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                ← Kembali ke Biro Perjalanan
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama Biro Perjalanan */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Biro Perjalanan *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Banyumas Tour & Travel"
                    />
                  </div>

                  {/* Penjelasan Singkat */}
                  <div className="md:col-span-2">
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Penjelasan Singkat Usaha *
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Cahaya Wisata Banyumas adalah agen perjalanan berpengalaman sejak 2015, spesialis tur edukasi dan alam di wilayah Barlingmascakeb..."
                    />
                  </div>

                  {/* Deskripsi Lengkap */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Deskripsi lengkap tentang biro perjalanan..."
                    />
                  </div>

                  {/* Jenis Layanan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Jenis Layanan yang Ditawarkan *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceOptions.map((service) => (
                        <div key={service} className="flex items-center">
                          <input
                            type="checkbox"
                            id={service}
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceChange(service)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={service} className="ml-2 block text-sm text-gray-700">
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alamat Kantor */}
                  <div className="md:col-span-2">
                    <label htmlFor="office_address" className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Kantor / Lokasi Operasional *
                    </label>
                    <textarea
                      id="office_address"
                      name="office_address"
                      value={formData.office_address}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Jl. Dr. Angka No.88, Purwokerto, Banyumas"
                    />
                  </div>

                  {/* Kontak */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="text"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.contact.whatsapp}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.contact.email}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="info@biroperjalanan.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.contact.instagram}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="@biroperjalanan.bms"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.contact.website}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="www.biroperjalanan.id"
                    />
                  </div>

                  {/* Harga / Kisaran Tarif */}
                  <div className="md:col-span-2">
                    <label htmlFor="pricing" className="block text-sm font-medium text-gray-700 mb-2">
                      Harga / Kisaran Tarif Paket *
                    </label>
                    <textarea
                      id="pricing"
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh:&#10;• Tour Baturaden (half day): Rp175.000/orang&#10;• Trip Dieng 2 hari: Rp520.000/pax (min. 10 orang)"
                    />
                  </div>

                  {/* Fasilitas & Layanan Unggulan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Fasilitas & Layanan Unggulan
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {facilityOptions.map((facility) => (
                        <div key={facility} className="flex items-center">
                          <input
                            type="checkbox"
                            id={facility}
                            checked={formData.facilities.includes(facility)}
                            onChange={() => handleFacilityChange(facility)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={facility} className="ml-2 block text-sm text-gray-700">
                            {facility}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foto / Brosur Digital / Link Galeri */}
                  <div className="md:col-span-2">
                    <label htmlFor="gallery_link" className="block text-sm font-medium text-gray-700 mb-2">
                      Foto / Brosur Digital / Link Galeri
                    </label>
                    <input
                      type="url"
                      id="gallery_link"
                      name="gallery_link"
                      value={formData.gallery_link}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Link Google Drive, Instagram, katalog brosur, dll."
                    />
                  </div>

                  {/* Info Tambahan */}
                  <div className="md:col-span-2">
                    <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-2">
                      Info Tambahan
                    </label>
                    <textarea
                      id="additional_info"
                      name="additional_info"
                      value={formData.additional_info}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh:&#10;• Terdaftar resmi di ASITA atau Disbudpar&#10;• Melayani rombongan sekolah / kantor&#10;• Bisa booking via Traveloka / Tiket.com&#10;• Diskon khusus hari tertentu"
                    />
                  </div>

                  {/* Gambar Kecil */}
                  <div>
                    <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Kecil (untuk Card/Thumbnail)
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                      <p className="text-sm text-blue-800 font-medium mb-1">📱 Digunakan untuk:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Card biro perjalanan di halaman utama</li>
                        <li>• Thumbnail di list pencarian</li>
                        <li>• Preview di kategori travel</li>
                        <li>• Tampilan mobile yang responsif</li>
                      </ul>
                      <p className="text-xs text-blue-600 mt-2">💡 <strong>Rekomendasi:</strong> Gunakan gambar dengan rasio 1:1 (persegi) untuk hasil terbaik</p>
                    </div>
                    <input
                      type="file"
                      id="img_sm"
                      name="img_sm"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {imagePreviews.img_sm && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews.img_sm} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {/* Gambar Besar */}
                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Besar (untuk Detail/Hero)
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                      <p className="text-sm text-green-800 font-medium mb-1">🖼️ Digunakan untuk:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Halaman detail biro perjalanan</li>
                        <li>• Hero section yang menarik</li>
                        <li>• Galeri foto berkualitas tinggi</li>
                        <li>• Tampilan desktop yang optimal</li>
                      </ul>
                      <p className="text-xs text-green-600 mt-2">💡 <strong>Rekomendasi:</strong> Gunakan gambar landscape (16:9) atau portrait (4:3) dengan resolusi tinggi</p>
                    </div>
                    <input
                      type="file"
                      id="img_lg"
                      name="img_lg"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {imagePreviews.img_lg && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews.img_lg} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {/* Recommended */}
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
                      <label htmlFor="recommended" className="ml-2 block text-sm text-gray-700">
                        Tandai sebagai biro perjalanan yang direkomendasikan
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Link
                    href="/admin/travel-agencies"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Biro Perjalanan'}
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
