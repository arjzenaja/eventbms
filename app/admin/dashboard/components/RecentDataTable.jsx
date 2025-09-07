import Link from 'next/link';
import { useState, useEffect } from 'react';

// Client-side only event date formatter component
function ClientEventDateFormatter({ date }) {
  const [formattedDate, setFormattedDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (date) {
      setFormattedDate(new Date(date).toLocaleDateString('id-ID'));
    }
  }, [date]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>{formattedDate}</span>;
}

export default function RecentDataTable({ 
  filteredRecentData, 
  allRecentData, 
  searchTerm, 
  setSearchTerm 
}) {
  // Prefer created/added timestamp when available for "tanggal masuk data"
  const getEventCreatedAt = (event) => {
    if (!event) return null;
    const candidate =
      event.createdAt ||
      event.created_at ||
      event.addedAt ||
      event.added_at ||
      event.dateAdded ||
      event.date_added ||
      event.timestamp ||
      event.ts;
    return candidate || event.date || null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 lg:px-8 py-6 lg:py-8 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-700">📋 Data Terbaru</h2>
          <Link 
            href="/admin/data" 
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm lg:text-base flex items-center space-x-2 transition-colors duration-300"
          >
            <span>Lihat Semua</span>
            <span className="text-lg">→</span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm lg:text-base"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>
          <span className="text-sm lg:text-base text-slate-500 font-medium">
            {filteredRecentData.length} dari {allRecentData.length} data
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 lg:px-8 py-4 text-left text-xs lg:text-sm font-bold text-slate-600 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 lg:px-8 py-4 text-left text-xs lg:text-sm font-bold text-slate-600 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-6 lg:px-8 py-4 text-left text-xs lg:text-sm font-bold text-slate-600 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 lg:px-8 py-4 text-left text-xs lg:text-sm font-bold text-slate-600 uppercase tracking-wider">
                Tanggal Masuk
              </th>
              <th className="px-6 lg:px-8 py-4 text-left text-xs lg:text-sm font-bold text-slate-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredRecentData.length > 0 ? (
              filteredRecentData.map((item) => (
                <tr key={`${item.source}-${item.id}`} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img 
                        className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl object-cover shadow-sm" 
                        src={item.img_sm || '/placeholder.jpg'} 
                        alt={item.title}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm lg:text-base font-semibold text-slate-700 truncate">{item.title}</div>
                        <div className="text-sm text-slate-500 truncate">{item.short_description?.substring(0, 60)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl lg:text-3xl">{item.categoryIcon}</span>
                      <span className="text-sm lg:text-base text-slate-700 font-medium">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                    <span className="text-sm lg:text-base text-slate-700 font-medium">{item.location}</span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                    <span className="text-sm lg:text-base text-slate-700 font-medium">
                      <ClientEventDateFormatter date={getEventCreatedAt(item)} />
                    </span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1.5 text-xs lg:text-sm font-bold rounded-full ${
                      item.recommended 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {item.recommended ? '⭐ Direkomendasikan' : '✅ Aktif'}
                    </span>
                  </td>
                </tr>
              ))
            ) : searchTerm.trim() !== '' ? (
              <tr>
                <td colSpan={5} className="px-6 lg:px-8 py-12 lg:py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-5xl lg:text-6xl mb-4">🔍</div>
                    <p className="text-lg lg:text-xl font-semibold">Tidak ada hasil</p>
                    <p className="text-sm lg:text-base">Coba ubah kata kunci pencarian</p>
                  </div>
                </td>
              </tr>
            ) : allRecentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 lg:px-8 py-12 lg:py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-5xl lg:text-6xl mb-4">📊</div>
                    <p className="text-lg lg:text-xl font-semibold">Belum ada data</p>
                    <p className="text-sm lg:text-base">Data akan muncul di sini setelah Anda menambahkan item</p>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="px-6 lg:px-8 py-12 lg:py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-5xl lg:text-6xl mb-4">🔍</div>
                    <p className="text-lg lg:text-xl font-semibold">Tidak ada data yang cocok</p>
                    <p className="text-sm lg:text-base">Coba ubah kata kunci pencarian</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
