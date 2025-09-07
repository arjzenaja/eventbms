import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      title: "Tambah Event",
      icon: "🎉",
      href: "/admin/events/new",
      color: "from-blue-600 to-blue-700",
      hoverColor: "from-blue-700 to-blue-800",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    {
      title: "Tambah Objek Wisata",
      icon: "🏔️",
      href: "/admin/destinations/new",
      color: "from-emerald-600 to-emerald-700",
      hoverColor: "from-emerald-700 to-emerald-800",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700"
    },
    {
      title: "Tambah Kuliner",
      icon: "🍽️",
      href: "/admin/culinary/new",
      color: "from-orange-600 to-orange-700",
      hoverColor: "from-orange-700 to-orange-800",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-700"
    },
    {
      title: "Tambah Penginapan",
      icon: "🏨",
      href: "/admin/accommodation/new",
      color: "from-purple-600 to-purple-700",
      hoverColor: "from-purple-700 to-purple-800",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    {
      title: "Tambah Souvenir",
      icon: "🛍️",
      href: "/admin/souvenirs/new",
      color: "from-rose-600 to-rose-700",
      hoverColor: "from-rose-700 to-rose-800",
      bgColor: "from-rose-50 to-rose-100",
      borderColor: "border-rose-200",
      textColor: "text-rose-700"
    },
    {
      title: "Tambah Biro Perjalanan",
      icon: "🚌",
      href: "/admin/travel-agencies/new",
      color: "from-indigo-600 to-indigo-700",
      hoverColor: "from-indigo-700 to-indigo-800",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700"
    },
    {
      title: "Tambah Desa Wisata",
      icon: "🏘️",
      href: "/admin/villages/new",
      color: "from-teal-600 to-teal-700",
      hoverColor: "from-teal-700 to-teal-800",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      textColor: "text-teal-700"
    },
    {
      title: "Kelola Data",
      icon: "📊",
      href: "/admin/data",
      color: "from-gray-600 to-gray-700",
      hoverColor: "from-gray-700 to-gray-800",
      bgColor: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      textColor: "text-slate-700"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
      <h3 className="text-xl lg:text-2xl font-bold text-slate-700 mb-6">⚡ Aksi Cepat</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group block"
            aria-label={action.title}
          >
            <div className={`bg-gradient-to-br ${action.bgColor} border ${action.borderColor} hover:bg-gradient-to-br ${action.hoverColor} px-6 py-6 lg:px-8 lg:py-8 rounded-2xl text-center font-medium transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-2xl relative overflow-hidden`}>
              {/* Background gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-3xl lg:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <div className={`text-sm lg:text-base font-bold ${action.textColor} group-hover:text-white transition-colors drop-shadow-sm`}>
                  {action.title}
                </div>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-2 h-2 bg-gradient-to-r ${action.color} rounded-full`}></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
