import Link from 'next/link';

export default function StatsCards({ stats }) {
  const statsCards = [
    {
      title: "Total Data Masuk",
      count: stats.totalEvents + stats.totalDestinations + stats.totalAccommodations + stats.totalCulinary + stats.totalSouvenirs + stats.totalVillages + stats.totalTravelAgencies,
      subtitle: "Seluruh event & destinasi",
      icon: "📊",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Users",
      count: stats.totalUsers || 0,
      subtitle: "Pengguna terdaftar",
      icon: "👥",
      color: "from-purple-600 to-purple-700",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Event",
      count: stats.totalEvents,
      subtitle: "Event & kegiatan",
      icon: "🎉",
      color: "from-emerald-600 to-green-700",
      bgColor: "from-emerald-50 to-green-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Objek Wisata",
      count: stats.totalDestinations,
      subtitle: "Objek wisata",
      icon: "🏔️",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Desa Wisata",
      count: stats.totalVillages,
      subtitle: "Desa wisata aktif",
      icon: "🏘️",
      color: "from-teal-600 to-teal-700",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
      change: "+15%",
      changeType: "positive"
    },
    {
      title: "Kuliner",
      count: stats.totalCulinary,
      subtitle: "Makanan khas daerah",
      icon: "🍽️",
      color: "from-orange-600 to-orange-700",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      change: "+5%",
      changeType: "positive"
    },
    {
      title: "Penginapan",
      count: stats.totalAccommodations,
      subtitle: "Tempat menginap",
      icon: "🏨",
      color: "from-purple-600 to-purple-700",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      change: "+10%",
      changeType: "positive"
    },
    {
      title: "Biro Perjalanan",
      count: stats.totalTravelAgencies,
      subtitle: "Agen perjalanan",
      icon: "🚌",
      color: "from-indigo-600 to-indigo-700",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700",
      change: "+7%",
      changeType: "positive"
    },
    {
      title: "Souvenir",
      count: stats.totalSouvenirs,
      subtitle: "Toko oleh-oleh",
      icon: "🛍️",
      color: "from-rose-600 to-rose-700",
      bgColor: "from-rose-50 to-rose-100",
      borderColor: "border-rose-200",
      textColor: "text-rose-700",
      change: "+3%",
      changeType: "positive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => {
        // Define navigation paths for each card
        const getNavigationPath = (title) => {
          switch (title) {
            case "Total Data Masuk":
              return "/admin/data";
            case "Event":
              return "/admin/events";
            case "Objek Wisata":
              return "/admin/destinations";
            case "Desa Wisata":
              return "/admin/villages";
            case "Kuliner":
              return "/admin/culinary";
            case "Penginapan":
              return "/admin/accommodation";
            case "Biro Perjalanan":
              return "/admin/travel-agencies";
            case "Souvenir":
              return "/admin/souvenirs";
            case "Users":
              return "/admin/users";
            default:
              return "/admin/events";
          }
        };

        return (
          <Link key={index} href={getNavigationPath(stat.title)} className="block group">
            <div className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} text-gray-900 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group-hover:scale-105 relative overflow-hidden`}>
              {/* Background gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-4xl lg:text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                
                <h3 className="text-lg lg:text-xl font-bold mb-3 text-slate-700 group-hover:text-slate-600 transition-colors">
                  {stat.title}
                </h3>
                
                <p className="text-3xl lg:text-4xl font-bold mb-3 ${stat.textColor} group-hover:scale-105 transition-transform duration-300">
                  {stat.count.toLocaleString()}
                </p>
                
                <p className="text-sm lg:text-base text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
                  {stat.subtitle}
                </p>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-2 h-2 bg-gradient-to-r ${stat.color} rounded-full`}></div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
