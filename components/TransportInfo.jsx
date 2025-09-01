"use client";
import { useState, useEffect } from 'react';
import { BiBus, BiTrain, BiCar, BiWalk, BiTime, BiMap } from 'react-icons/bi';

const TransportInfo = ({ destination }) => {
  const [transportOptions, setTransportOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching transport data
    const fetchTransportData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock transport data based on location
        const location = destination?.location?.toLowerCase() || '';
        let mockData = [];
        
        if (location.includes('baturraden')) {
          mockData = [
            {
              type: 'bus',
              name: 'Bus AKAP Purwokerto - Baturraden',
              route: 'Terminal Purwokerto → Baturraden',
              frequency: 'Setiap 30 menit',
              duration: '45 menit',
              cost: 'Rp 15.000',
              schedule: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00'],
              operator: 'PO Sinar Jaya',
              stops: ['Terminal Purwokerto', 'Pasar Wage', 'Baturraden']
            },
            {
              type: 'bus',
              name: 'Bus Kota Baturraden',
              route: 'Purwokerto → Baturraden',
              frequency: 'Setiap 15 menit',
              duration: '40 menit',
              cost: 'Rp 8.000',
              schedule: ['05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00'],
              operator: 'PO Rosalia Indah',
              stops: ['Terminal Purwokerto', 'Pasar Wage', 'Baturraden']
            },
            {
              type: 'train',
              name: 'Kereta Api Purwokerto - Baturraden',
              route: 'Stasiun Purwokerto → Stasiun Baturraden',
              frequency: 'Setiap 2 jam',
              duration: '35 menit',
              cost: 'Rp 12.000',
              schedule: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
              operator: 'KAI Commuter',
              stops: ['Stasiun Purwokerto', 'Stasiun Baturraden']
            }
          ];
        } else if (location.includes('purwokerto')) {
          mockData = [
            {
              type: 'bus',
              name: 'Bus Kota Purwokerto',
              route: 'Terminal Purwokerto → Pusat Kota',
              frequency: 'Setiap 10 menit',
              duration: '15 menit',
              cost: 'Rp 5.000',
              schedule: ['05:00', '05:10', '05:20', '05:30', '05:40', '05:50', '06:00'],
              operator: 'PO Rosalia Indah',
              stops: ['Terminal Purwokerto', 'Pasar Wage', 'Alun-alun Purwokerto']
            },
            {
              type: 'train',
              name: 'Kereta Api Jakarta - Purwokerto',
              route: 'Stasiun Jakarta → Stasiun Purwokerto',
              frequency: 'Setiap 3 jam',
              duration: '4 jam 30 menit',
              cost: 'Rp 150.000',
              schedule: ['06:00', '09:00', '12:00', '15:00', '18:00'],
              operator: 'KAI Argo Parahyangan',
              stops: ['Stasiun Jakarta', 'Stasiun Bandung', 'Stasiun Purwokerto']
            }
          ];
        } else {
          // Default transport options
          mockData = [
            {
              type: 'bus',
              name: 'Bus Antar Kota',
              route: 'Terminal → Destinasi',
              frequency: 'Setiap 1 jam',
              duration: '60 menit',
              cost: 'Rp 10.000',
              schedule: ['06:00', '07:00', '08:00', '09:00', '10:00'],
              operator: 'PO Sinar Jaya',
              stops: ['Terminal', 'Pasar', 'Destinasi']
            }
          ];
        }
        
        setTransportOptions(mockData);
      } catch (error) {
        console.error('Error fetching transport data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransportData();
  }, [destination]);

  const getTransportIcon = (type) => {
    switch (type) {
      case 'bus':
        return <BiBus className="w-6 h-6" />;
      case 'train':
        return <BiTrain className="w-6 h-6" />;
      case 'car':
        return <BiCar className="w-6 h-6" />;
      case 'walking':
        return <BiWalk className="w-6 h-6" />;
      default:
        return <BiTime className="w-6 h-6" />;
    }
  };

  const getTransportColor = (type) => {
    switch (type) {
      case 'bus':
        return 'from-blue-500 to-blue-600';
      case 'train':
        return 'from-green-500 to-green-600';
      case 'car':
        return 'from-purple-500 to-purple-600';
      case 'walking':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTransportLabel = (type) => {
    switch (type) {
      case 'bus':
        return 'Bus';
      case 'train':
        return 'Kereta Api';
      case 'car':
        return 'Mobil';
      case 'walking':
        return 'Jalan Kaki';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <BiBus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          Transportasi Publik
        </h3>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <BiBus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        Transportasi Publik
      </h3>

      {transportOptions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiBus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-slate-600 dark:text-gray-400">Informasi transportasi tidak tersedia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transportOptions.map((option, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Transport Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getTransportColor(option.type)} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                  {getTransportIcon(option.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white truncate">
                    {option.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {option.operator}
                  </p>
                </div>
              </div>

              {/* Route Information */}
              <div className="mb-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BiMap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Rute</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-white">{option.route}</p>
              </div>

              {/* Transport Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Frekuensi</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{option.frequency}</div>
                </div>
                
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Durasi</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{option.duration}</div>
                </div>
                
                <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Biaya</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{option.cost}</div>
                </div>
                
                <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Jenis</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{getTransportLabel(option.type)}</div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <BiTime className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Jadwal Pagi</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.schedule.slice(0, 6).map((time, timeIndex) => (
                    <span
                      key={timeIndex}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-md font-medium"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stops */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BiMap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Pemberhentian</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.stops.map((stop, stopIndex) => (
                    <span
                      key={stopIndex}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-md"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transport Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <BiBus className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          Tips Transportasi
        </h4>
        
        <div className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Datang ke terminal/stasiun 15-30 menit sebelum keberangkatan</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Siapkan uang pas untuk pembayaran tiket</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Bawa kartu identitas untuk pembelian tiket kereta</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Periksa jadwal terbaru di terminal atau aplikasi resmi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportInfo;
