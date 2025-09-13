"use client";

import Link from "next/link";
import { BiSearch, BiMap, BiPhone, BiStar, BiFilter, BiGrid, BiDownload, BiUser, BiCalendar, BiHeart, BiShare, BiNavigation, BiTime, BiCreditCard, BiCheckCircle, BiHelpCircle, BiRightArrowAlt, BiHome, BiMenu, BiBookOpen, BiInfoCircle } from "react-icons/bi";

const TutorialPage = () => {

    return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-12">
            <span className="inline-block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-2xl md:text-3xl font-bold mb-8">
              📚 Panduan Lengkap
            </span>
        </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Tutorial
            </span>
            <br />
            <span className="text-white">Dolan Banyumas</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Pelajari cara menggunakan website Dolan Banyumas untuk menemukan destinasi wisata, 
            kuliner, penginapan, dan berbagai layanan wisata di Kabupaten Banyumas
          </p>
      </div>

        {/* Table of Contents */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <BiBookOpen className="text-blue-400" />
            Daftar Isi Tutorial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="#beranda" className="group">
              <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 border border-white/10 hover:border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BiHome className="text-blue-400 text-xl" />
        </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">Beranda</h3>
      </div>
                <p className="text-gray-300 text-sm">Cara menggunakan halaman utama dan navigasi website</p>
    </div>
            </Link>
            
            <Link href="#pencarian" className="group">
              <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 border border-white/10 hover:border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <BiSearch className="text-green-400 text-xl" />
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-green-400 transition-colors">Pencarian</h3>
                </div>
                <p className="text-gray-300 text-sm">Cara mencari destinasi dan menggunakan filter</p>
              </div>
            </Link>
            
            <Link href="#destinasi" className="group">
              <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 border border-white/10 hover:border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <BiMap className="text-purple-400 text-xl" />
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">Destinasi</h3>
                </div>
                <p className="text-gray-300 text-sm">Menjelajahi berbagai kategori destinasi wisata</p>
              </div>
            </Link>
            
            <Link href="#detail" className="group">
              <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 border border-white/10 hover:border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <BiInfoCircle className="text-orange-400 text-xl" />
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors">Detail Destinasi</h3>
                </div>
                <p className="text-gray-300 text-sm">Memahami informasi lengkap destinasi</p>
              </div>
            </Link>
            
            <Link href="#booking" className="group">
              <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 border border-white/10 hover:border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <BiCreditCard className="text-red-400 text-xl" />
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-red-400 transition-colors">Booking & Reservasi</h3>
                </div>
                <p className="text-gray-300 text-sm">Cara melakukan pemesanan dan reservasi</p>
              </div>
            </Link>
            
            <Link href="#faq" className="group">
              <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-2xl p-6 border border-white/10 hover:border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <BiHelpCircle className="text-cyan-400 text-xl" />
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">FAQ</h3>
                </div>
                <p className="text-gray-300 text-sm">Pertanyaan yang sering diajukan</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Tutorial Section 1: Beranda */}
        <div id="beranda" className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <BiHome className="text-blue-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">1. Beranda & Navigasi</h2>
              <p className="text-gray-300">Cara menggunakan halaman utama dan menu navigasi</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiMenu className="text-blue-400" />
                  Menu Navigasi
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Jelajahi:</strong> Menampilkan semua destinasi wisata</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Tentang Kami:</strong> Informasi tentang Dolan Banyumas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Panduan Kami:</strong> Tutorial penggunaan website (halaman ini)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiSearch className="text-green-400" />
                  Fitur Pencarian Cepat
                </h3>
                <p className="text-gray-300 mb-4">Di halaman beranda, Anda dapat:</p>
                <ul className="space-y-2 text-gray-300">
                  <li>• Menggunakan search bar untuk mencari destinasi</li>
                  <li>• Memilih kategori destinasi langsung dari beranda</li>
                  <li>• Melihat destinasi populer dan rekomendasi</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">💡 Tips Navigasi</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Gunakan Menu Mobile</p>
                    <p className="text-gray-300 text-sm">Di perangkat mobile, tap ikon menu (☰) untuk mengakses navigasi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Scroll untuk Eksplorasi</p>
                    <p className="text-gray-300 text-sm">Scroll ke bawah untuk melihat lebih banyak konten dan fitur</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Logo untuk Kembali</p>
                    <p className="text-gray-300 text-sm">Klik logo Dolan Banyumas untuk kembali ke beranda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Section 2: Pencarian */}
        <div id="pencarian" className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <BiSearch className="text-green-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">2. Pencarian & Filter</h2>
              <p className="text-gray-300">Cara mencari dan memfilter destinasi sesuai kebutuhan</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiSearch className="text-green-400" />
                  Pencarian Destinasi
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">1. Gunakan Search Bar</p>
                    <p className="text-gray-300 text-sm">Ketik nama destinasi, lokasi, atau kata kunci di search bar</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">2. Pilih Kategori</p>
                    <p className="text-gray-300 text-sm">Klik kategori yang diinginkan: Wisata, Kuliner, Penginapan, dll.</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">3. Gunakan Filter</p>
                    <p className="text-gray-300 text-sm">Filter berdasarkan tipe, rating, atau lokasi spesifik</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiFilter className="text-purple-400" />
                  Filter Lanjutan
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Filter Tipe:</strong> Wisata Alam, Cafe, Hotel, dll.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Urutkan:</strong> Nama, Rating, atau Lokasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Tampilan:</strong> Grid atau List view</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">🔍 Tips Pencarian</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Gunakan Kata Kunci Spesifik</p>
                    <p className="text-gray-300 text-sm">Contoh: "air terjun", "cafe", "hotel baturaden"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Kombinasi Filter</p>
                    <p className="text-gray-300 text-sm">Gunakan kategori + filter tipe untuk hasil lebih akurat</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Clear Filter</p>
                    <p className="text-gray-300 text-sm">Gunakan tombol "Clear Filters" untuk reset pencarian</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tutorial Section 3: Destinasi */}
        <div id="destinasi" className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <BiMap className="text-purple-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">3. Kategori Destinasi</h2>
              <p className="text-gray-300">Memahami berbagai kategori destinasi yang tersedia</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏞️</span>
            </div>
                <h3 className="text-white font-semibold text-lg">Objek Wisata</h3>
          </div>
              <p className="text-gray-300 text-sm mb-4">Tempat wisata alam, sejarah, budaya, dan buatan</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Wisata Alam</li>
                <li>• Wisata Budaya</li>
                <li>• Wisata Sejarah</li>
                <li>• Wisata Religi</li>
              </ul>
        </div>
            
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl p-6 border border-orange-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
      </div>
                <h3 className="text-white font-semibold text-lg">Kuliner</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Tempat makan dan minuman khas daerah</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Cafe & Resto</li>
                <li>• Rumah Makan</li>
                <li>• Kedai Tradisional</li>
                <li>• Street Food</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏨</span>
                </div>
                <h3 className="text-white font-semibold text-lg">Penginapan</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Tempat menginap untuk wisatawan</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Hotel</li>
                <li>• Villa</li>
                <li>• Homestay</li>
                <li>• Resort</li>
              </ul>
          </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
            </div>
                <h3 className="text-white font-semibold text-lg">Oleh-Oleh</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Souvenir dan produk lokal</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Kerajinan Tangan</li>
                <li>• Makanan Khas</li>
                <li>• Pakaian Tradisional</li>
                <li>• Produk Lokal</li>
              </ul>
          </div>

            <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-2xl p-6 border border-teal-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏘️</span>
          </div>
                <h3 className="text-white font-semibold text-lg">Desa Wisata</h3>
        </div>
              <p className="text-gray-300 text-sm mb-4">Desa dengan budaya dan kehidupan lokal</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Desa Budaya</li>
                <li>• Desa Alam</li>
                <li>• Desa Kerajinan</li>
                <li>• Desa Pertanian</li>
              </ul>
      </div>
            
            <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-2xl p-6 border border-indigo-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
          </div>
                <h3 className="text-white font-semibold text-lg">Biro Perjalanan</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Layanan tour dan travel</p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Paket Wisata</li>
                <li>• Transportasi</li>
                <li>• Guide Lokal</li>
                <li>• Event Organizer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tutorial Section 4: Detail Destinasi */}
        <div id="detail" className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <BiInfoCircle className="text-orange-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">4. Detail Destinasi</h2>
              <p className="text-gray-300">Memahami informasi lengkap destinasi wisata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiMap className="text-orange-400" />
                  Informasi Dasar
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Nama Destinasi:</strong> Nama lengkap tempat wisata</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Lokasi:</strong> Alamat dan area destinasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Deskripsi:</strong> Penjelasan lengkap tentang destinasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Rating:</strong> Penilaian dari pengunjung</span>
                  </li>
                </ul>
          </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiTime className="text-blue-400" />
                  Informasi Operasional
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Jam Buka:</strong> Waktu operasional destinasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Harga Tiket:</strong> Biaya masuk dan paket</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Fasilitas:</strong> Amenities yang tersedia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Kontak:</strong> Nomor telepon dan WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">📋 Fitur Detail</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Galeri Foto</p>
                    <p className="text-gray-300 text-sm">Lihat foto-foto destinasi untuk referensi visual</p>
                      </div>
                      </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Peta Lokasi</p>
                    <p className="text-gray-300 text-sm">Gunakan fitur navigasi untuk menuju destinasi</p>
                    </div>
                  </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Share & Bookmark</p>
                    <p className="text-gray-300 text-sm">Bagikan atau simpan destinasi favorit</p>
                      </div>
                      </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Review & Rating</p>
                    <p className="text-gray-300 text-sm">Baca ulasan dari pengunjung lain</p>
                    </div>
                  </div>
                      </div>
                      </div>
                    </div>
                  </div>

        {/* Tutorial Section 5: Booking & Reservasi */}
        <div id="booking" className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <BiCreditCard className="text-red-400 text-2xl" />
                      </div>
            <div>
              <h2 className="text-3xl font-bold text-white">5. Booking & Reservasi</h2>
              <p className="text-gray-300">Cara melakukan pemesanan dan reservasi destinasi</p>
                      </div>
                    </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiCalendar className="text-red-400" />
                  Langkah Booking
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">1. Pilih Destinasi</p>
                    <p className="text-gray-300 text-sm">Klik destinasi yang ingin dikunjungi</p>
                      </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">2. Pilih Paket</p>
                    <p className="text-gray-300 text-sm">Pilih paket wisata atau tiket yang sesuai</p>
                      </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">3. Isi Data</p>
                    <p className="text-gray-300 text-sm">Lengkapi informasi pemesanan</p>
                    </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">4. Konfirmasi</p>
                    <p className="text-gray-300 text-sm">Konfirmasi dan lakukan pembayaran</p>
                  </div>
                      </div>
                      </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiPhone className="text-green-400" />
                  Kontak Langsung
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>WhatsApp:</strong> Hubungi langsung via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Telepon:</strong> Hubungi nomor yang tersedia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Email:</strong> Kirim email untuk reservasi</span>
                  </li>
                </ul>
                    </div>
                  </div>
            
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">💳 Tips Booking</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Reservasi Awal</p>
                    <p className="text-gray-300 text-sm">Booking minimal 1-2 hari sebelumnya</p>
                      </div>
                      </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Konfirmasi Ulang</p>
                    <p className="text-gray-300 text-sm">Konfirmasi ulang sebelum hari H</p>
                    </div>
                  </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Baca Syarat</p>
                    <p className="text-gray-300 text-sm">Baca syarat dan ketentuan dengan teliti</p>
              </div>
            </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Simpan Bukti</p>
                    <p className="text-gray-300 text-sm">Simpan bukti pembayaran dan konfirmasi</p>
            </div>
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
              <BiHelpCircle className="text-cyan-400 text-2xl" />
                      </div>
            <div>
              <h2 className="text-3xl font-bold text-white">6. FAQ - Pertanyaan Umum</h2>
              <p className="text-gray-300">Jawaban untuk pertanyaan yang sering diajukan</p>
                        </div>
                    </div>
                    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiHelpCircle className="text-cyan-400" />
                  Tentang Website
                      </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-2">Apa itu Dolan Banyumas?</p>
                    <p className="text-gray-300 text-sm">Dolan Banyumas adalah platform wisata komprehensif yang menyediakan informasi lengkap tentang destinasi wisata, kuliner, penginapan, dan layanan wisata di Kabupaten Banyumas.</p>
                          </div>
                  <div>
                    <p className="text-white font-medium mb-2">Apakah website ini gratis?</p>
                    <p className="text-gray-300 text-sm">Ya, penggunaan website Dolan Banyumas sepenuhnya gratis. Anda hanya membayar untuk destinasi atau layanan yang dipesan.</p>
                        </div>
                  <div>
                    <p className="text-white font-medium mb-2">Bagaimana cara update informasi?</p>
                    <p className="text-gray-300 text-sm">Informasi destinasi diupdate secara berkala. Jika ada informasi yang tidak akurat, silakan hubungi kami.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiMap className="text-green-400" />
                  Tentang Destinasi
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-2">Berapa banyak destinasi yang tersedia?</p>
                    <p className="text-gray-300 text-sm">Kami memiliki ratusan destinasi wisata yang terbagi dalam berbagai kategori seperti wisata alam, kuliner, penginapan, dan lainnya.</p>
                      </div>
                  <div>
                    <p className="text-white font-medium mb-2">Apakah semua destinasi buka setiap hari?</p>
                    <p className="text-gray-300 text-sm">Tidak, jam operasional bervariasi. Silakan cek informasi jam buka di detail masing-masing destinasi.</p>
                    </div>
                  <div>
                    <p className="text-white font-medium mb-2">Bagaimana cara menuju destinasi?</p>
                    <p className="text-gray-300 text-sm">Setiap destinasi dilengkapi dengan alamat lengkap dan fitur navigasi untuk memudahkan perjalanan Anda.</p>
                  </div>
                </div>
                        </div>
                      </div>
                      
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiCreditCard className="text-orange-400" />
                  Tentang Booking
                          </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-2">Bagaimana cara booking destinasi?</p>
                    <p className="text-gray-300 text-sm">Pilih destinasi, pilih paket, isi data pemesanan, dan konfirmasi. Atau hubungi langsung via WhatsApp/telepon.</p>
                            </div>
                  <div>
                    <p className="text-white font-medium mb-2">Apakah ada biaya booking?</p>
                    <p className="text-gray-300 text-sm">Biaya booking bervariasi tergantung destinasi dan paket yang dipilih. Informasi lengkap tersedia di detail destinasi.</p>
                        </div>
                  <div>
                    <p className="text-white font-medium mb-2">Bagaimana jika ingin cancel booking?</p>
                    <p className="text-gray-300 text-sm">Hubungi langsung penyedia layanan untuk informasi kebijakan pembatalan dan refund.</p>
                            </div>
                          </div>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <BiPhone className="text-blue-400" />
                  Bantuan & Kontak
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium mb-2">Bagaimana cara menghubungi customer service?</p>
                    <p className="text-gray-300 text-sm">Anda dapat menghubungi kami melalui WhatsApp, email, atau telepon yang tersedia di halaman kontak.</p>
                          </div>
                  <div>
                    <p className="text-white font-medium mb-2">Apakah ada aplikasi mobile?</p>
                    <p className="text-gray-300 text-sm">Website ini responsive dan dapat diakses dengan baik di perangkat mobile. Aplikasi mobile sedang dalam pengembangan.</p>
                            </div>
                  <div>
                    <p className="text-white font-medium mb-2">Bagaimana cara memberikan feedback?</p>
                    <p className="text-gray-300 text-sm">Silakan hubungi kami melalui kontak yang tersedia atau berikan rating dan review di destinasi yang telah dikunjungi.</p>
                        </div>
                      </div>
                    </div>
                  </div>
          </div>
            </div>

        {/* Call to Action */}
        <div className="text-center py-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-16 border border-blue-500/20">
            <h3 className="text-4xl font-bold text-white mb-6">
              Siap Memulai Petualangan?
            </h3>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Sekarang Anda sudah memahami cara menggunakan website Dolan Banyumas. 
              Mulai jelajahi destinasi menarik dan buat kenangan tak terlupakan di Banyumas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
                <button className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3">
                  <BiHome className="text-xl" />
                Kembali ke Beranda
              </button>
            </Link>
              <Link href="/dolan-banyumas">
                <button className="px-10 py-5 bg-white/10 text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center gap-3">
                  <BiMap className="text-xl" />
                  Jelajahi Destinasi
              </button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
