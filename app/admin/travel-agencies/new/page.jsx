'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import GalleryUploader from '@/components/GalleryUploader';

export default function NewTravelAgency() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    location: '',
    type: 'biro',
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
    opening_hours: '',
    latitude: '',
    longitude: '',
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
  const [galleryFiles, setGalleryFiles] = useState([]);
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
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setImageFiles(prev => ({
        ...prev,
        [name]: file
      }));
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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'contact') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'office_address') {
          formDataToSend.append('location', formData[key]);
          formDataToSend.append('address', formData[key]);
        } else if (key === 'type') {
          formDataToSend.append('type', 'biro');
          formDataToSend.append('category', 'Biro Perjalanan');
        } else if (key === 'contact') {
          const contactString = formData[key].whatsapp || formData[key].email || formData[key].instagram || formData[key].website || '';
          formDataToSend.append('contact', contactString);
        } else if (key === 'services') {
          formDataToSend.append('features', JSON.stringify(formData[key]));
        } else if (key === 'facilities') {
          const existingFeatures = formData.services || [];
          const allFeatures = [...existingFeatures, ...formData[key]];
          formDataToSend.append('features', JSON.stringify(allFeatures));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (imageFiles.img_sm) formDataToSend.append('img_sm', imageFiles.img_sm);
      if (imageFiles.img_lg) formDataToSend.append('img_lg', imageFiles.img_lg);
      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach((file) => formDataToSend.append('gallery[]', file));
      }

      const response = await fetch('/api/travel-agencies', {
        method: 'POST',
        body: formDataToSend,
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
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 3a1 1 0 00-.894.553L8.382 6H5a1 1 0 000 2h2.382l1.224 2.447A1 1 0 009.5 11h5a1 1 0 00.894-.553L16.618 8H19a1 1 0 100-2h-2.382l-1.224-2.447A1 1 0 0014.5 3h-4z"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Biro Perjalanan Baru</h1>
                  <p className="text-gray-600 mt-1">Lengkapi informasi usaha, kontak, harga, dan gambar.</p>
                </div>
              </div>
              <Link 
                href="/admin/travel-agencies"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama Biro Perjalanan */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Biro Perjalanan *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                      placeholder="Contoh: Banyumas Tour & Travel"
                    />
                  </div>

                  {/* Penjelasan Singkat */}
                  <div className="md:col-span-2">
                    <label htmlFor="short_description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Penjelasan Singkat Usaha *
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                      placeholder="Contoh: Cahaya Wisata Banyumas adalah agen perjalanan berpengalaman sejak 2015, spesialis tur edukasi dan alam di wilayah Barlingmascakeb..."
                    />
                  </div>

                  {/* Deskripsi Lengkap */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
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

                  {/* Lokasi */}
                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Purwokerto, Banyumas, Indonesia"
                    />
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
                      placeholder="@biroperjalanan.dolan-banyumas"
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
                    <label htmlFor="additional_info" className="block text-sm font-semibold text-gray-700 mb-2">
                      Info Tambahan
                    </label>
                    <textarea
                      id="additional_info"
                      name="additional_info"
                      value={formData.additional_info}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                      placeholder="Contoh:&#10;• Terdaftar resmi di ASITA atau Disbudpar&#10;• Melayani rombongan sekolah / kantor&#10;• Bisa booking via Traveloka / Tiket.com&#10;• Diskon khusus hari tertentu"
                    />
                  </div>

                  {/* Koordinat & Jam Operasional */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                        placeholder="-7.4268"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                        placeholder="109.2333"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional</label>
                      <input
                        type="text"
                        name="opening_hours"
                        value={formData.opening_hours}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                        placeholder="09:00 - 17:00"
                      />
                    </div>
                  </div>

                  {/* Gambar & Galeri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gambar Kecil */}
                    <div>
                      <label htmlFor="img_sm" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Kecil (untuk Card/Thumbnail)
                      </label>
                      <input
                        type="file"
                        id="img_sm"
                        name="img_sm"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 shadow-sm"
                      />
                      {imagePreviews.img_sm && (
                        <div className="mt-2">
                          <img src={imagePreviews.img_sm} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                        </div>
                      )}
                    </div>

                    {/* Gambar Besar */}
                    <div>
                      <label htmlFor="img_lg" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Besar (untuk Detail/Hero)
                      </label>
                      <input
                        type="file"
                        id="img_lg"
                        name="img_lg"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 shadow-sm"
                      />
                      {imagePreviews.img_lg && (
                        <div className="mt-2">
                          <img src={imagePreviews.img_lg} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                        </div>
                      )}
                    </div>
                  </div>

                  <GalleryUploader files={galleryFiles} setFiles={setGalleryFiles} />

                  {/* Recommended & Submit */}
                  <div className="pt-4 border-t border-gray-200 flex items-center">
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

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Link
                      href="/admin/travel-agencies"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      Batal
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...</>) : (<>Simpan Biro Perjalanan</>)}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
