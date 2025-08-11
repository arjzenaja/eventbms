"use client";
import { useState } from "react";

export default function NewVillage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    manager: "",
    facilities: "",
    packages: "",
    price: "",
    gallery: "",
    info: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi submit, bisa diganti dengan fetch ke backend
    setSuccess(true);
    setForm({
      name: "",
      category: "",
      description: "",
      address: "",
      manager: "",
      facilities: "",
      packages: "",
      price: "",
      gallery: "",
      info: "",
    });
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
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
            placeholder="Contoh: Paket edukasi pertanian (Rp25.000/orang)\nPaket susur sungai (Rp75.000/orang)"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Harga Masuk</label>
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Gratis atau Rp10.000"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Link Galeri Foto / Media Sosial</label>
          <input
            type="text"
            name="gallery"
            value={form.gallery}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Link Instagram, Google Drive, Youtube, dll."
          />
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-4"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
