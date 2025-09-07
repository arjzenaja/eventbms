export default function ChartsSection({ chartData, stats }) {
  const getEventTypeIcon = (type) => {
    if (!type) return '📍';
    
    const icons = {
      'wisata-alam': '🏔️',
      'wisata-taman': '🌳',
      'wisata-budaya': '🏛️',
      'wisata-sejarah': '🏺',
      'wisata-buatan': '🎡',
      'wisata-minat-khusus': '🎯',
      'wisata-religi': '⛪',
      'objek-wisata': '🏔️',
      'desa-wisata': '🏘️',
      'biro-perjalanan': '🚌',
      'kuliner': '🍽️',
      'penginapan': '🏨',
      'oleh-oleh': '🛍️',
      'event': '🎉',
      'event-rakyat': '👥',
      'event-banyumas': '🎊'
    };
    return icons[type] || '📍';
  };

  const getEventTypeLabel = (type) => {
    if (!type) return 'Lainnya';
    
    const labels = {
      'wisata-alam': 'Objek Wisata',
      'wisata-taman': 'Objek Wisata',
      'wisata-budaya': 'Objek Wisata',
      'wisata-sejarah': 'Objek Wisata',
      'wisata-buatan': 'Objek Wisata',
      'wisata-minat-khusus': 'Objek Wisata',
      'wisata-religi': 'Objek Wisata',
      'objek-wisata': 'Objek Wisata',
      'desa-wisata': 'Desa Wisata',
      'biro-perjalanan': 'Biro Perjalanan',
      'kuliner': 'Kuliner',
      'penginapan': 'Penginapan',
      'oleh-oleh': 'Oleh-oleh',
      'event': 'Event',
      'event-rakyat': 'Event Rakyat',
      'event-banyumas': 'Event Banyumas'
    };
    return labels[type] || 'Lainnya';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Enhanced Event Types Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
        <h3 className="text-xl lg:text-2xl font-bold text-slate-700 mb-6">📈 Distribusi Jenis Event</h3>
        <div className="space-y-4 lg:space-y-6">
          {chartData.eventTypes.length > 0 ? (
            chartData.eventTypes.map((item, index) => {
              const percentage = stats.totalEvents > 0 ? (item.count / stats.totalEvents) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl lg:text-3xl">{getEventTypeIcon(item.type)}</span>
                    <div>
                      <span className="text-sm lg:text-base text-slate-700 font-semibold">{getEventTypeLabel(item.type)}</span>
                      <p className="text-xs text-slate-500">Jenis event</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 lg:w-32 bg-gray-200 rounded-full h-3 lg:h-4 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm lg:text-base font-bold text-slate-700 w-8 lg:w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 lg:py-16 text-slate-500">
              <div className="text-5xl lg:text-6xl mb-4">📊</div>
              <p className="text-lg lg:text-xl font-semibold mb-2">Tidak ada data untuk ditampilkan</p>
              <p className="text-sm lg:text-base">Data chart akan muncul setelah ada event</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Monthly Events Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
        <h3 className="text-xl lg:text-2xl font-bold text-slate-700 mb-6">📅 Event per Bulan</h3>
        <div className="space-y-4 lg:space-y-6">
          {chartData.monthlyEvents.length > 0 ? (
            chartData.monthlyEvents.map((item, index) => {
              const maxCount = Math.max(...chartData.monthlyEvents.map(m => m.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl lg:text-3xl">📅</span>
                    <div>
                      <span className="text-sm lg:text-base text-slate-700 font-semibold capitalize">{item.month}</span>
                      <p className="text-xs text-slate-500">Bulan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 lg:w-32 bg-gray-200 rounded-full h-3 lg:h-4 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm lg:text-base font-bold text-slate-700 w-8 lg:w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 lg:py-16 text-slate-500">
              <div className="text-5xl lg:text-6xl mb-4">📅</div>
              <p className="text-lg lg:text-xl font-semibold mb-2">Tidak ada data untuk ditampilkan</p>
              <p className="text-sm lg:text-base">Data chart akan muncul setelah ada event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
