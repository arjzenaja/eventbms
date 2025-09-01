"use client";
import { useState, useEffect } from 'react';
import { BiSun, BiCloud, BiCloudRain, BiWind } from 'react-icons/bi';

const WeatherInfo = ({ destination }) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get coordinates for weather API
  const getDestinationCoords = () => {
    if (destination?.coordinates) {
      return destination.coordinates;
    }
    
    // Fallback coordinates based on location name
    const location = destination?.location?.toLowerCase() || '';
    if (location.includes('baturraden')) {
      return { lat: -7.3056, lng: 109.2194 };
    } else if (location.includes('purwokerto')) {
      return { lat: -7.4211, lng: 109.2344 };
    } else if (location.includes('ajibarang')) {
      return { lat: -7.4167, lng: 109.0667 };
    } else if (location.includes('wangon')) {
      return { lat: -7.5167, lng: 109.0500 };
    }
    
    return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
  };

  const destinationCoords = getDestinationCoords();

  useEffect(() => {
    // Simulate weather data (in real app, you'd use a weather API)
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data for Banyumas region
        const mockWeather = {
          temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
          condition: ['Cerah Berawan', 'Berawan', 'Hujan Ringan', 'Cerah'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 20) + 70, // 70-90%
          windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
          feelsLike: Math.floor(Math.random() * 8) + 25, // 25-33°C
          uvIndex: Math.floor(Math.random() * 5) + 5, // 5-10
          visibility: Math.floor(Math.random() * 5) + 8, // 8-13 km
          pressure: Math.floor(Math.random() * 10) + 1010, // 1010-1020 hPa
          sunrise: '05:45',
          sunset: '17:45',
          updatedAt: new Date().toLocaleTimeString('id-ID')
        };
        
        setWeather(mockWeather);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('cerah')) {
      return <BiSun className="w-8 h-8 text-yellow-500" />;
    } else if (conditionLower.includes('hujan')) {
      return <BiCloudRain className="w-8 h-8 text-blue-500" />;
    } else if (conditionLower.includes('berawan')) {
      return <BiCloud className="w-8 h-8 text-gray-500" />;
    } else {
      return <BiWind className="w-8 h-8 text-gray-400" />;
    }
  };

  const getWeatherColor = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('cerah')) {
      return 'from-yellow-400 to-orange-500';
    } else if (conditionLower.includes('hujan')) {
      return 'from-blue-400 to-blue-600';
    } else if (conditionLower.includes('berawan')) {
      return 'from-gray-400 to-gray-600';
    } else {
      return 'from-gray-300 to-gray-500';
    }
  };

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Rendah', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Sedang', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'Tinggi', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Sangat Tinggi', color: 'text-red-600' };
    return { level: 'Ekstrem', color: 'text-purple-600' };
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
            <BiSun className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          Informasi Cuaca
        </h3>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
            <BiSun className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          Informasi Cuaca
        </h3>
        <div className="text-center text-slate-600 dark:text-gray-400">
          Informasi cuaca tidak tersedia
        </div>
      </div>
    );
  }

  const uvInfo = getUVLevel(weather.uvIndex);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
        <div className="w-6 h-6 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
          <BiSun className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        </div>
        Informasi Cuaca
      </h3>

      {/* Main Weather Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-200 dark:border-sky-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                {weather.condition}
              </h4>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {destination.location}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800 dark:text-white">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-slate-600 dark:text-gray-400">
              Terasa {weather.feelsLike}°C
            </div>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-gray-400 text-center">
          Diperbarui: {weather.updatedAt}
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg text-center">
          <div className="text-sm text-slate-600 dark:text-gray-400 mb-1">Kelembaban</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">{weather.humidity}%</div>
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg text-center">
          <div className="text-sm text-slate-600 dark:text-gray-400 mb-1">Angin</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">{weather.windSpeed} km/h</div>
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg text-center">
          <div className="text-sm text-slate-600 dark:text-gray-400 mb-1">UV Index</div>
          <div className={`text-lg font-bold ${uvInfo.color}`}>{weather.uvIndex}</div>
          <div className="text-xs text-slate-500 dark:text-gray-400">{uvInfo.level}</div>
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg text-center">
          <div className="text-sm text-slate-600 dark:text-gray-400 mb-1">Jarak Pandang</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">{weather.visibility} km</div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <BiSun className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Matahari Terbit</div>
              <div className="font-bold text-slate-800 dark:text-white">{weather.sunrise}</div>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BiSun className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Matahari Terbenam</div>
              <div className="font-bold text-slate-800 dark:text-white">{weather.sunset}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Tips */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <BiSun className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          Tips Cuaca
        </h4>
        
        <div className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
          {weather.condition.toLowerCase().includes('hujan') && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Bawa payung atau jas hujan untuk perjalanan</span>
            </div>
          )}
          
          {weather.uvIndex > 7 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Gunakan tabir surya SPF 30+ dan topi untuk melindungi kulit</span>
            </div>
          )}
          
          {weather.temperature > 30 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Minum banyak air untuk menghindari dehidrasi</span>
            </div>
          )}
          
          {weather.windSpeed > 10 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Angin cukup kencang, perhatikan barang-barang yang mudah terbang</span>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Cuaca ideal untuk berwisata di {destination.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
