"use client";
import { useState } from "react";

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
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        formDataToSend.append(key, form[key]);
      });
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black">Tambah Desa Wisata</h1>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Data desa wisata berhasil disimpan!</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-black">Nama Desa Wisata</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
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
        <div>
          <label className="block font-medium text-black">Kontak</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nomor telepon atau WhatsApp"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Pengelola / Pokdarwis</label>
          <input
            type="text"
            name="manager"
            value={form.manager}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nama kelompok atau kontak"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Fasilitas Desa Wisata</label>
          <textarea
            name="facilities"
            value={form.facilities}
            onChange={handleChange}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Homestay, Area camping, Jalur tracking, dll. Satu fasilitas per baris."
          />
        </div>
        <div>
          <label className="block font-medium text-black">Paket Wisata</label>
          <textarea
            name="packages"
            value={form.packages}
            onChange={handleChange}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Paket edukasi pertanian (Rp25.000/orang)&#10;Paket susur sungai (Rp75.000/orang)"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Harga Masuk (Rp) *</label>
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="10"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Desa Wisata</h3>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              {imagePreviews.img_sm && (
                <div className="mt-2 relative">
                  <img 
                    src={imagePreviews.img_sm} 
                    alt="Preview Gambar Kecil" 
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('img_sm')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              {imagePreviews.img_lg && (
                <div className="mt-2 relative">
                  <img 
                    src={imagePreviews.img_lg} 
                    alt="Preview Gambar Besar" 
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('img_lg')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
                    title="Hapus gambar"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-black">Info Tambahan (opsional)</label>
          <textarea
            name="info"
            value={form.info}
            onChange={handleChange}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Juara lomba desa wisata, ramah difabel, dll."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded mt-4 transition-colors"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
