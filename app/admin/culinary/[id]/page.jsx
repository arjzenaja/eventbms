'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditCulinaryItem() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    short_description: '',
    type: 'cafe',
    price_range: '25.000 - 50.000',
    cuisine: 'Indonesia',
    opening_hours: '10:00 - 22:00',
    contact: '',
    address: '',
    features: ['Masakan Indonesia', 'Suasana Nyaman'],
    img_sm: '',
    img_lg: '',
    recommended: false,
    // Field tambahan yang ada di halaman detail
    manager: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    gallery: [],
    menu: [],
    category: 'Kuliner',
    coordinates: { lat: '', lng: '' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const CustomSelect = ({ label, value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>)}
        <button type="button" onClick={()=>setOpen(o=>!o)} className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 flex items-center justify-between shadow-sm ${open ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <span className="font-medium truncate">{options.find(o=>o.value===value)?.label || value}</span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        {open && (
          <ul className="mt-2 max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl">
            {options.map(opt => (
              <li key={opt.value}>
                <button type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-orange-50 ${value===opt.value ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchCulinaryItem = async () => {
      try {
        const response = await fetch(`/api/kuliner/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.kuliner.title || '',
            location: data.kuliner.location || '',
            description: data.kuliner.description || '',
            short_description: data.kuliner.short_description || '',
            type: data.kuliner.type || 'cafe',
            price_range: data.kuliner.price_range || '25.000 - 50.000',
            cuisine: data.kuliner.cuisine || 'Indonesia',
            opening_hours: data.kuliner.opening_hours || '10:00 - 22:00',
            contact: data.kuliner.contact || '',
            address: data.kuliner.address || '',
            features: data.kuliner.features || ['Masakan Indonesia', 'Suasana Nyaman'],
            img_sm: data.kuliner.img_sm || '',
            img_lg: data.kuliner.img_lg || '',
            recommended: data.kuliner.recommended || false,
            // Field tambahan
            manager: data.kuliner.manager || '',
            phone: data.kuliner.phone || '',
            whatsapp: data.kuliner.whatsapp || '',
            email: data.kuliner.email || '',
            website: data.kuliner.website || '',
            gallery: data.kuliner.gallery || [],
            menu: data.kuliner.menu || [],
            category: data.kuliner.category || 'Kuliner',
            coordinates: data.kuliner.coordinates || { lat: '', lng: '' }
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching culinary item:', error);
        setError('Terjadi kesalahan saat mengambil data item kuliner');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCulinaryItem();
    }
  }, [id]);

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
      const response = await fetch(`/api/kuliner/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Item kuliner berhasil diperbarui!');
        router.push('/admin/culinary');
      } else {
        alert('Gagal memperbarui item kuliner: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating culinary item:', error);
      alert('Terjadi kesalahan saat memperbarui item kuliner');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data item kuliner..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data item kuliner"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Edit Item Kuliner</h1>
                  <p className="mt-1 text-sm text-gray-500">Perbarui informasi kuliner, menu, dan kontak pengelola.</p>
                </div>
              </div>
              <Link href="/admin/culinary" className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">← Kembali</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
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
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Singkat *
                  </label>
                  <input
                    type="text"
                    id="short_description"
                    name="short_description"
                    required
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi singkat kuliner"
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
                    placeholder="Masukkan deskripsi lengkap kuliner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomSelect
                      label="Tipe Kuliner *"
                      value={formData.type}
                      onChange={(v)=>handleInputChange({ target:{ name:'type', value:v }})}
                      options={[
                        { value:'cafe', label:'Cafe' },
                        { value:'resto', label:'Restoran' },
                        { value:'rumah makan', label:'Rumah Makan' },
                        { value:'kedai', label:'Kedai' },
                        { value:'warung', label:'Warung' }
                      ]}
                    />
                  </div>

                  <div>
                    <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                      Kisaran Harga *
                    </label>
                    <input
                      type="text"
                      id="price_range"
                      name="price_range"
                      required
                      value={formData.price_range || '0 - 0'}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0 - 0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                      Jenis Masakan *
                    </label>
                    <input
                      type="text"
                      id="cuisine"
                      name="cuisine"
                      required
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Indonesia, Jawa, Sunda"
                    />
                  </div>

                  <div>
                    <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700">
                      Jam Buka *
                    </label>
                    <input
                      type="text"
                      id="opening_hours"
                      name="opening_hours"
                      required
                      value={formData.opening_hours}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: 10:00 - 22:00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                      Kontak
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nomor telepon atau email"
                    />
                  </div>

                                   <div>
                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                     Alamat Lengkap
                   </label>
                   <textarea
                     id="address"
                     name="address"
                     rows={2}
                     value={formData.address}
                     onChange={handleInputChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Alamat lengkap lokasi kuliner"
                   />
                 </div>

                 {/* Koordinat Lokasi */}
                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                     <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                     </svg>
                     Koordinat Lokasi
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                         Latitude
                       </label>
                       <input
                         type="number"
                         id="lat"
                         name="lat"
                         step="any"
                         value={formData.coordinates?.lat || ''}
                         onChange={(e) => setFormData(prev => ({
                           ...prev,
                           coordinates: { ...prev.coordinates, lat: e.target.value }
                         }))}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Contoh: -7.3056"
                       />
                     </div>
                     <div>
                       <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-2">
                         Longitude
                       </label>
                       <input
                         type="number"
                         id="lng"
                         name="lng"
                         step="any"
                         value={formData.coordinates?.lng || ''}
                         onChange={(e) => setFormData(prev => ({
                           ...prev,
                           coordinates: { ...prev.coordinates, lng: e.target.value }
                         }))}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Contoh: 109.2194"
                       />
                     </div>
                   </div>
                   <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     Koordinat untuk menampilkan lokasi di peta (opsional)
                   </p>
                 </div>

                 {/* Informasi Pengelola */}
                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengelola</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                         Nama Pengelola
                       </label>
                       <input
                         type="text"
                         id="manager"
                         name="manager"
                         value={formData.manager}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nama pemilik atau pengelola"
                       />
                     </div>

                     <div>
                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                         Nomor Telepon
                       </label>
                       <input
                         type="text"
                         id="phone"
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nomor telepon utama"
                       />
                     </div>

                     <div>
                       <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                         WhatsApp
                       </label>
                       <input
                         type="text"
                         id="whatsapp"
                         name="whatsapp"
                         value={formData.whatsapp}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nomor WhatsApp"
                       />
                     </div>

                     <div>
                       <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                         Email
                       </label>
                       <input
                         type="email"
                         id="email"
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Email pengelola"
                       />
                     </div>

                     <div className="md:col-span-2">
                       <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                         Website
                       </label>
                       <input
                         type="url"
                         id="website"
                         name="website"
                         value={formData.website}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="https://website.com"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Menu Section */}
                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Makanan</h3>
                   <div className="space-y-4">
                     <div>
                       <label htmlFor="menu" className="block text-sm font-medium text-gray-700 mb-2">
                         Daftar Menu (Opsional)
                       </label>
                       <textarea
                         id="menu"
                         name="menu"
                         rows={4}
                         value={formData.menu.join('\n')}
                         onChange={(e) => {
                           const menuArray = e.target.value.split('\n').map(item => item.trim()).filter(item => item);
                           setFormData(prev => ({ ...prev, menu: menuArray }));
                         }}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Masukkan menu satu per baris&#10;Contoh:&#10;Mendoan Tempe - Rp 8.000&#10;Soto Sokaraja - Rp 18.000&#10;Getuk Goreng - Rp 10.000"
                       />
                       <p className="text-xs text-gray-500 mt-1">Masukkan menu satu per baris. Format: Nama Menu - Harga</p>
                     </div>
                   </div>
                 </div>
                </div>

                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                    Fitur-fitur
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    rows={3}
                    value={formData.features.join(', ')}
                    onChange={(e) => {
                      const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                      setFormData(prev => ({ ...prev, features: featuresArray }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan fitur-fitur, pisahkan dengan koma (contoh: WiFi Gratis, Suasana Nyaman, Parkir Luas)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Pisahkan setiap fitur dengan koma
                  </p>
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
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
