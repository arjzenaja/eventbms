"use client";

import { BiUser, BiPhone, BiEnvelope, BiTime, BiStar } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";

const TravelAgencyManager = ({ destination, contactInfo }) => {
	// Extract manager information from destination data
	const manager = destination.manager || destination.owner || destination.contact_person || {};
	
	// If no specific manager data, use contact info
	const managerInfo = {
		name: manager.name || contactInfo.name || "Pengelola Biro Perjalanan",
		phone: manager.phone || contactInfo.phone,
		email: manager.email || contactInfo.email,
		whatsapp: manager.whatsapp || contactInfo.whatsapp,
		instagram: manager.instagram || contactInfo.instagram,
		website: manager.website || contactInfo.website,
		position: manager.position || "Pengelola",
		experience: manager.experience || "Berpengalaman",
		rating: manager.rating || 4.5,
		availability: manager.availability || "24/7"
	};

	return (
		<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
					<BiUser className="text-2xl text-white" />
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengelola Biro Perjalanan</h2>
					<p className="text-gray-600 dark:text-gray-400">Informasi pengelola dan kontak langsung</p>
				</div>
			</div>

			{/* Manager Profile Card */}
			<div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
						<BiUser className="text-3xl text-white" />
					</div>
					<div>
						<h3 className="text-xl font-bold">{managerInfo.name}</h3>
						<p className="text-purple-100">{managerInfo.position}</p>
						<div className="flex items-center gap-2 mt-2">
							<BiStar className="text-yellow-300" />
							<span className="text-sm">{managerInfo.rating} / 5.0</span>
							<span className="text-purple-100 text-sm">• {managerInfo.experience}</span>
						</div>
					</div>
				</div>
				
				<div className="flex items-center gap-3 text-purple-100">
					<BiTime className="text-lg" />
					<span className="text-sm">Tersedia: {managerInfo.availability}</span>
				</div>
			</div>

			{/* Contact Methods */}
			<div className="space-y-4">
				<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Kontak Pengelola</h4>
				
				{/* Phone */}
				{managerInfo.phone && (
					<a 
						href={`tel:${managerInfo.phone}`}
						className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
					>
						<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<BiPhone className="text-xl text-white" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-blue-700 dark:text-blue-300">Telepon</p>
							<p className="text-sm text-blue-600 dark:text-blue-400">{managerInfo.phone}</p>
						</div>
					</a>
				)}

				{/* WhatsApp */}
				{managerInfo.whatsapp && (
					<a 
						href={`https://wa.me/${managerInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Halo ${managerInfo.name}, saya tertarik dengan layanan biro perjalanan ${destination.title}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors group"
					>
						<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<FaWhatsapp className="text-xl text-white" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-green-700 dark:text-green-300">WhatsApp</p>
							<p className="text-sm text-green-600 dark:text-green-400">Chat langsung dengan pengelola</p>
						</div>
					</a>
				)}

				{/* Email */}
				{managerInfo.email && (
					<a 
						href={`mailto:${managerInfo.email}?subject=Pertanyaan tentang ${destination.title}`}
						className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors group"
					>
						<div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<BiEnvelope className="text-xl text-white" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-purple-700 dark:text-purple-300">Email</p>
							<p className="text-sm text-purple-600 dark:text-purple-400">{managerInfo.email}</p>
						</div>
					</a>
				)}

				{/* Instagram */}
				{managerInfo.instagram && (
					<a 
						href={`https://instagram.com/${managerInfo.instagram.replace('@', '')}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-4 p-4 bg-pink-50 dark:bg-pink-900/30 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors group"
					>
						<div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<FaInstagram className="text-xl text-white" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-pink-700 dark:text-pink-300">Instagram</p>
							<p className="text-sm text-pink-600 dark:text-pink-400">@{managerInfo.instagram.replace('@', '')}</p>
						</div>
					</a>
				)}

				{/* Website */}
				{managerInfo.website && (
					<a 
						href={managerInfo.website}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors group"
					>
						<div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<FaGlobe className="text-xl text-white" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-indigo-700 dark:text-indigo-300">Website</p>
							<p className="text-sm text-indigo-600 dark:text-indigo-400">Kunjungi website resmi</p>
						</div>
					</a>
				)}
			</div>

			{/* Additional Info */}
			<div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
				<div className="flex items-start gap-3">
					<BiStar className="text-amber-500 text-xl mt-1 flex-shrink-0" />
					<div>
						<h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Tips Berkomunikasi</h5>
						<p className="text-sm text-amber-700 dark:text-amber-300">
							Hubungi pengelola untuk mendapatkan informasi detail tentang paket wisata, harga, dan jadwal keberangkatan yang tersedia.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TravelAgencyManager;
