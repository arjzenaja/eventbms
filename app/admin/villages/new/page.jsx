"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import GalleryUploader from "@/components/GalleryUploader";

export default function NewVillage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    short_description: "",
    description: "",
    type: "desa",
    category: "Desa Wisata",
    contact: "",
    address: "",
    manager: "",
    facilities: "",
    packages: "",
    price: "",
    info: "",
    coordinates: { lat: "", lng: "" },
    features: ["Budaya Lokal", "Akomodasi Homestay"],
    recommended: false,
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
  const [packagesList, setPackagesList] = useState([]);
  const [pkgDraft, setPkgDraft] = useState({ name: '', price: '', include: '', left: '', right: '', recommended: false });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categoryOptions = [
    { value: 'Desa Wisata', label: 'Desa Wisata', icon: '🏘️' },
    { value: 'Kampung Wisata', label: 'Kampung Wisata', icon: '🏡' },
    { value: 'Desa Budaya', label: 'Desa Budaya', icon: '🎎' },
    { value: 'Ecotourism', label: 'Ecotourism', icon: '🌿' },
  ];

  function CustomSelect({ label, value, onChange, options, className = '' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', close);
      return () => document.removeEventListener('mousedown', close);
    }, []);
    const current = options.find(o => o.value === value) || options[0];
    return (
      <div className={className} ref={ref}>
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <button type="button" onClick={() => setOpen(o => !o)} className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
          <span className="flex items-center gap-3">
            {current?.icon && <span className="text-lg leading-none">{current.icon}</span>}
            <span className="font-medium truncate">{current?.label}</span>
          </span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd"/></svg>
        </button>
        {open && (
          <div className="relative">
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="max-h-72 overflow-y-auto">
                {options.map(opt => (
                  <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-indigo-50 ${value === opt.value ? 'bg-indigo-50' : ''}`}>
                    <span className="flex items-center gap-3">
                      {opt.icon && <span className="text-lg leading-none">{opt.icon}</span>}
                      <span className={`font-medium ${value === opt.value ? 'text-indigo-700' : 'text-gray-900'}`}>{opt.label}</span>
                    </span>
                    {value === opt.value && <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
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

  const handleRemoveImage = (name) => {
    setImageFiles(prev => ({
      ...prev,
      [name]: null
    }));
    setImagePreviews(prev => ({
      ...prev,
      [name]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form data
      Object.keys(form).forEach(key => {
        if (key === 'packages') return; // append custom below
        if (key === 'coordinates') {
          formDataToSend.append('latitude', form.coordinates.lat);
          formDataToSend.append('longitude', form.coordinates.lng);
        } else {
          formDataToSend.append(key, form[key]);
        }
      });
      // Append packages from builder if any, else from textarea
      if (packagesList.length > 0) {
        formDataToSend.append('packages', JSON.stringify(packagesList));
      } else {
        formDataToSend.append('packages', form.packages || '');
      }
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
      }
      // Add gallery files
      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach((file) => formDataToSend.append('gallery[]', file));
      }

      const response = await fetch('/api/villages', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setForm({
          title: "",
          location: "",
          short_description: "",
          description: "",
          type: "desa",
          category: "Desa Wisata",
          contact: "",
          address: "",
          manager: "",
          facilities: "",
          packages: "",
          price: "",
          info: "",
          features: ["Budaya Lokal", "Akomodasi Homestay"],
          recommended: false,
        });
        setImageFiles({
          img_sm: null,
          img_lg: null
        });
        setImagePreviews({
          img_sm: null,
          img_lg: null
        });
        setGalleryFiles([]);
        setPackagesList([]);
      } else {
        alert(data.message || 'Gagal menyimpan data desa wisata');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan data desa wisata');
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
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 7v6m18-6v6"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Desa Wisata</h1>
                  <p className="text-gray-600 mt-1">Lengkapi informasi desa wisata, lokasi, paket, dan gambar.</p>
                </div>
              </div>
              <Link 
                href="/admin/villages" 
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
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
              {success && (
                <div className="px-6 py-4 bg-green-50 text-green-700 border-b border-green-100">Data desa wisata berhasil disimpan!</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-8 p-8">
        <div className="border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <h3 className="text-lg font-semibold text-gray-900">Informasi Dasar</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Desa Wisata</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Lokasi</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                placeholder="Kecamatan, Kabupaten"
              />
            </div>
            <div>
              <CustomSelect
                label="Kategori Desa Wisata"
                value={form.category}
                onChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                options={categoryOptions}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Deskripsi Singkat</label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                required
                rows={2}
                className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                placeholder="Deskripsi singkat dalam 1-2 kalimat"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Penjelasan Singkat Desa Wisata</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                placeholder="Daya tarik, keunikan, jenis wisata, pencapaian, dll."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                placeholder="Desa, Kecamatan, Kabupaten"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block font-medium text-black">Lokasi</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Kecamatan, Kabupaten"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Deskripsi Singkat</label>
          <textarea
            name="short_description"
            value={form.short_description}
            onChange={handleChange}
            required
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Deskripsi singkat dalam 1-2 kalimat"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Kategori Desa Wisata</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Kategori</option>
            <option value="alam">Desa Wisata</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-black">Penjelasan Singkat Desa Wisata</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Daya tarik, keunikan, jenis wisata, pencapaian, dll."
          />
        </div>
        <div>
          <label className="block font-medium text-black">Alamat Lengkap</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Desa, Kecamatan, Kabupaten"
          />
        </div>

        {/* Koordinat Lokasi */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-indigo-100 rounded-lg"><svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div><h3 className="text-lg font-semibold text-gray-900">Koordinat Lokasi</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude (Latitude)
              </label>
              <input
                type="text"
                value={form.coordinates.lat}
                onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                placeholder="Contoh: -7.123456"
              />
              <p className="text-xs text-gray-500 mt-1">Format: -7.123456 (negatif untuk belahan bumi selatan)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude (Longitude)
              </label>
              <input
                type="text"
                value={form.coordinates.lng}
                onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                placeholder="Contoh: 109.123456"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 109.123456 (positif untuk belahan bumi timur)</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>💡 Cara mendapatkan koordinat:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Buka Google Maps dan cari lokasi desa wisata</li>
              <li>• Klik kanan pada lokasi dan pilih "What's here?"</li>
              <li>• Koordinat akan muncul di bagian bawah</li>
              <li>• Atau gunakan aplikasi GPS di smartphone</li>
            </ul>
          </div>
        </div>
        <div className="border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-green-100 rounded-lg"><svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg></div><h3 className="text-lg font-semibold text-gray-900">Kontak & Pengelola</h3></div>
          <label className="block text-sm font-semibold text-gray-700">Kontak</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
            placeholder="Nomor telepon atau WhatsApp"
          />
          <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700">Pengelola / Pokdarwis</label>
          <input
            type="text"
            name="manager"
            value={form.manager}
            onChange={handleChange}
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
            placeholder="Nama kelompok atau kontak"
          />
          </div>
        </div>
        <div className="border-b border-gray-200 pb-8">
          <label className="block text-sm font-semibold text-gray-700">Fasilitas Desa Wisata</label>
          <textarea
            name="facilities"
            value={form.facilities}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
            placeholder="Contoh: Homestay, Area camping, Jalur tracking, dll. Satu fasilitas per baris."
          />
        </div>
        <div className="border-b border-gray-200 pb-8">
          <label className="block text-sm font-semibold text-gray-700">Paket Wisata</label>
          <textarea
            name="packages"
            value={form.packages}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
            placeholder="Contoh: Paket edukasi pertanian (Rp25.000/orang)&#10;Paket susur sungai (Rp75.000/orang)"
          />
        </div>

        {/* Paket Wisata (Builder Dinamis) */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-amber-100 rounded-lg"><svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/></svg></div><h3 className="text-lg font-semibold text-gray-900">Paket Wisata (Builder)</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
              <input type="text" value={pkgDraft.name} onChange={(e)=>setPkgDraft(prev=>({...prev,name:e.target.value}))} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm" placeholder="Paket Standar"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp, isi 0 jika Gratis)</label>
              <input type="number" min="0" value={pkgDraft.price} onChange={(e)=>setPkgDraft(prev=>({...prev,price:e.target.value}))} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm" placeholder="25000"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitur yang termasuk (pisahkan dengan koma)</label>
              <input type="text" value={pkgDraft.include} onChange={(e)=>setPkgDraft(prev=>({...prev,include:e.target.value}))} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm" placeholder="Tiket Masuk, Panduan Wisata"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Syarat (pisahkan dengan ;)</label>
              <input type="text" value={pkgDraft.left} onChange={(e)=>setPkgDraft(prev=>({...prev,left:e.target.value}))} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm" placeholder="Min. 1 orang; Bayar H-7"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pembatalan (pisahkan dengan ;)</label>
              <input type="text" value={pkgDraft.right} onChange={(e)=>setPkgDraft(prev=>({...prev,right:e.target.value}))} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm" placeholder="H-7 100%; H-3 50%"/>
            </div>
            <div className="flex items-center gap-2">
              <input id="pkg_recommended" type="checkbox" checked={pkgDraft.recommended} onChange={(e)=>setPkgDraft(prev=>({...prev,recommended:e.target.checked}))} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
              <label htmlFor="pkg_recommended" className="text-sm text-gray-700">Recommended</label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="button" onClick={()=>{
                const item={
                  name: pkgDraft.name || 'Paket Wisata',
                  price: Number(pkgDraft.price||0),
                  isFree: Number(pkgDraft.price||0)===0,
                  includes: (pkgDraft.include||'').split(',').map(s=>s.trim()).filter(Boolean),
                  leftTerms: (pkgDraft.left||'').split(';').map(s=>s.trim()).filter(Boolean),
                  rightTerms: (pkgDraft.right||'').split(';').map(s=>s.trim()).filter(Boolean),
                  recommended: pkgDraft.recommended
                };
                setPackagesList(prev=>[...prev,item]);
                setPkgDraft({ name:'', price:'', include:'', left:'', right:'', recommended:false });
              }} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors">Tambah Paket</button>
            </div>
          </div>

          {packagesList.length>0 && (
            <div className="mt-4 space-y-2">
              {packagesList.map((p,idx)=>(
                <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="text-sm text-gray-800 font-medium">{p.name} {p.isFree? '(Gratis)':`- Rp ${Number(p.price).toLocaleString('id-ID')}`}</div>
                  <button type="button" onClick={()=>setPackagesList(prev=>prev.filter((_,i)=>i!==idx))} className="text-red-600 text-sm hover:text-red-700">Hapus</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-b border-gray-200 pb-8">
          <label className="block text-sm font-semibold text-gray-700">Biaya Masuk (Rp) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setForm(prev => ({
                  ...prev,
                  price: value
                }));
              }}
              onFocus={(e) => {
                if (form.price && form.price.endsWith('000')) {
                  const cleanValue = form.price.replace(/000$/, '');
                  setForm(prev => ({
                    ...prev,
                    price: cleanValue
                  }));
                }
              }}
              onBlur={(e) => {
                if (form.price && !form.price.endsWith('000')) {
                  const formattedValue = `${form.price}000`;
                  setForm(prev => ({
                    ...prev,
                    price: formattedValue
                  }));
                }
              }}
              required
              maxLength="6"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm"
              placeholder="10"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-teal-100 rounded-lg"><svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div><h3 className="text-lg font-semibold text-gray-900">Gambar Desa Wisata</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Kecil (untuk Card/Thumbnail)
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                <p className="text-sm text-blue-800 font-medium mb-1">📱 Digunakan untuk:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Card desa wisata di halaman utama</li>
                  <li>• Thumbnail di list pencarian</li>
                  <li>• Preview di kategori wisata</li>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
              />
              {imagePreviews.img_sm && (
                <div className="mt-2 relative">
                  <img 
                    src={imagePreviews.img_sm} 
                    alt="Preview Gambar Kecil" 
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('img_sm')}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-lg"
                    title="Hapus gambar"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
            </div>

            <div>
              <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Besar (untuk Detail/Hero)
              </label>
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                <p className="text-sm text-green-800 font-medium mb-1">🖼️ Digunakan untuk:</p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Halaman detail desa wisata</li>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
              />
              {imagePreviews.img_lg && (
                <div className="mt-2 relative">
                  <img 
                    src={imagePreviews.img_lg} 
                    alt="Preview Gambar Besar" 
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('img_lg')}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-lg"
                    title="Hapus gambar"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
            </div>
          </div>
          <div className="mt-4">
            <GalleryUploader files={galleryFiles} setFiles={setGalleryFiles} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Info Tambahan (opsional)</label>
          <textarea
            name="info"
            value={form.info}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
            placeholder="Contoh: Juara lomba desa wisata, ramah difabel, dll."
          />
        </div>
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...</>) : (<>Simpan</>)}
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
