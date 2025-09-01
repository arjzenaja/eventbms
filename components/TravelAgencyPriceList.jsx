"use client";

import { useState } from "react";
import { BiMoney, BiTime, BiMap, BiStar, BiCalendar, BiGroup, BiCar } from "react-icons/bi";
import { FaWhatsapp, FaPhone } from "react-icons/fa";

const TravelAgencyPriceList = ({ destination, contactInfo }) => {
	const [selectedCategory, setSelectedCategory] = useState("semua");
	const [selectedDuration, setSelectedDuration] = useState("semua");

	// Use actual price data from destination or fallback to sample data
	const priceData = destination.prices || destination.packages || [
		{
			id: 1,
			name: "Paket Wisata Banyumas 1 Hari",
			category: "domestik",
			duration: "1 hari",
			price: "Rp 350.000",
			originalPrice: "Rp 400.000",
			description: "Wisata ke destinasi populer Banyumas dengan transportasi dan makan siang",
			includes: ["Transportasi AC", "Makan Siang", "Tiket Masuk", "Tour Guide", "Asuransi"],
			excludes: ["Makan Pagi", "Makan Malam", "Pengeluaran Pribadi"],
			departure: "08:00 WIB",
			capacity: "Min. 10 orang",
			vehicle: "Bus AC",
			rating: 4.8,
			reviews: 45,
			image: destination.img_sm || "/placeholder.jpg"
		},
		{
			id: 2,
			name: "Paket Wisata Banyumas 2 Hari 1 Malam",
			category: "domestik",
			duration: "2 hari",
			price: "Rp 750.000",
			originalPrice: "Rp 850.000",
			description: "Paket lengkap 2 hari 1 malam dengan akomodasi hotel bintang 3",
			includes: ["Transportasi AC", "Akomodasi Hotel", "Makan 3x", "Tiket Masuk", "Tour Guide", "Asuransi"],
			excludes: ["Pengeluaran Pribadi", "Tips"],
			departure: "07:00 WIB",
			capacity: "Min. 8 orang",
			vehicle: "Bus AC",
			rating: 4.9,
			reviews: 32,
			image: destination.img_sm || "/placeholder.jpg"
		},
		{
			id: 3,
			name: "Paket Wisata Jawa Tengah 3 Hari 2 Malam",
			category: "domestik",
			duration: "3 hari",
			price: "Rp 1.250.000",
			originalPrice: "Rp 1.400.000",
			description: "Eksplorasi Jawa Tengah dengan destinasi Borobudur, Dieng, dan Banyumas",
			includes: ["Transportasi AC", "Akomodasi Hotel", "Makan 3x", "Tiket Masuk", "Tour Guide", "Asuransi"],
			excludes: ["Pengeluaran Pribadi", "Tips", "Makan Tambahan"],
			departure: "06:00 WIB",
			capacity: "Min. 6 orang",
			vehicle: "Bus AC",
			rating: 4.7,
			reviews: 28,
			image: destination.img_sm || "/placeholder.jpg"
		},
		{
			id: 4,
			name: "Paket Honeymoon Bali 4 Hari 3 Malam",
			category: "internasional",
			duration: "4 hari",
			price: "Rp 2.500.000",
			originalPrice: "Rp 3.000.000",
			description: "Paket romantis untuk pasangan dengan akomodasi villa pribadi",
			includes: ["Transportasi AC", "Villa Pribadi", "Makan 3x", "Tiket Masuk", "Tour Guide", "Asuransi"],
			excludes: ["Pengeluaran Pribadi", "Tips", "Aktivitas Tambahan"],
			departure: "09:00 WIB",
			capacity: "2 orang",
			vehicle: "Mobil Pribadi",
			rating: 5.0,
			reviews: 18,
			image: destination.img_sm || "/placeholder.jpg"
		}
	];

	const categories = [
		{ id: "semua", name: "Semua Paket", icon: "🌍" },
		{ id: "domestik", name: "Domestik", icon: "🏠" },
		{ id: "internasional", name: "Internasional", icon: "✈️" }
	];

	const durations = [
		{ id: "semua", name: "Semua Durasi", icon: "📅" },
		{ id: "1 hari", name: "1 Hari", icon: "☀️" },
		{ id: "2 hari", name: "2 Hari", icon: "🌅" },
		{ id: "3 hari", name: "3 Hari", icon: "🌄" },
		{ id: "4 hari", name: "4+ Hari", icon: "🗓️" }
	];

	const filteredPackages = priceData.filter(pkg => {
		const categoryMatch = selectedCategory === "semua" || pkg.category === selectedCategory;
		const durationMatch = selectedDuration === "semua" || pkg.duration === selectedDuration;
		return categoryMatch && durationMatch;
	});

	const formatPrice = (price) => {
		return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};

	const handleInquiry = (pkgData) => {
		const message = `Halo, saya tertarik dengan paket "${pkgData.name}" dengan harga ${pkgData.price}. Mohon informasi lebih lanjut.`;
		const whatsappNumber = contactInfo?.whatsapp || contactInfo?.phone;
		
		if (whatsappNumber) {
			const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
			window.open(whatsappUrl, '_blank');
		} else if (contactInfo?.phone) {
			window.open(`tel:${contactInfo.phone}`, '_blank');
		}
	};

	return (
		<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
					<BiMoney className="text-2xl text-white" />
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Harga Biro Perjalanan</h2>
					<p className="text-gray-600 dark:text-gray-400">Pilih paket wisata sesuai kebutuhan Anda</p>
				</div>
			</div>

			{/* Filter Section */}
			<div className="mb-6">
				{/* Category Filter */}
				<div className="mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Kategori Paket</h4>
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
									selectedCategory === category.id
										? 'bg-purple-500 text-white shadow-lg'
										: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
								}`}
							>
								<span>{category.icon}</span>
								<span className="text-sm font-medium">{category.name}</span>
							</button>
						))}
					</div>
				</div>

				{/* Duration Filter */}
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Durasi Perjalanan</h4>
					<div className="flex flex-wrap gap-2">
						{durations.map((duration) => (
							<button
								key={duration.id}
								onClick={() => setSelectedDuration(duration.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
									selectedDuration === duration.id
										? 'bg-green-500 text-white shadow-lg'
										: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
								}`}
							>
								<span>{duration.icon}</span>
								<span className="text-sm font-medium">{duration.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Price List */}
			<div className="space-y-6">
				{filteredPackages.length > 0 ? (
					filteredPackages.map((packageData) => (
						<div key={packageData.id} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Package Image */}
								<div className="lg:col-span-1">
									<div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
										<div className="absolute inset-0 flex items-center justify-center">
											<BiCar className="text-6xl text-white/50" />
										</div>
									</div>
								</div>

								{/* Package Details */}
								<div className="lg:col-span-2">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
												{packageData.name}
											</h3>
											<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
												<div className="flex items-center gap-1">
													<BiTime className="text-purple-500" />
													<span>{packageData.duration}</span>
												</div>
												<div className="flex items-center gap-1">
													<BiGroup className="text-green-500" />
													<span>{packageData.capacity}</span>
												</div>
												<div className="flex items-center gap-1">
													<BiStar className="text-yellow-500" />
													<span>{packageData.rating} ({packageData.reviews} ulasan)</span>
												</div>
											</div>
										</div>
									</div>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										{packageData.description}
									</p>

									{/* Price Section */}
									<div className="flex items-center justify-between mb-4">
										<div>
											<div className="flex items-center gap-2">
												<span className="text-2xl font-bold text-green-600 dark:text-green-400">
													{formatPrice(packageData.price)}
												</span>
												{packageData.originalPrice && (
													<span className="text-lg text-gray-500 line-through">
														{formatPrice(packageData.originalPrice)}
													</span>
												)}
											</div>
											<p className="text-sm text-gray-500">per orang</p>
										</div>
									</div>

									{/* Package Details Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										{/* Includes */}
										<div>
											<h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Termasuk:</h5>
											<ul className="space-y-1">
												{packageData.includes.map((item, index) => (
													<li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>

										{/* Excludes */}
										<div>
											<h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">Tidak Termasuk:</h5>
											<ul className="space-y-1">
												{packageData.excludes.map((item, index) => (
													<li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
														<div className="w-2 h-2 bg-red-500 rounded-full"></div>
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex flex-wrap gap-3">
										<button
											onClick={() => handleInquiry(packageData)}
											className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
										>
											<FaWhatsapp className="text-lg" />
											<span className="font-medium">Tanya Sekarang</span>
										</button>
										
										{contactInfo?.phone && (
											<a
												href={`tel:${contactInfo.phone}`}
												className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
											>
												<FaPhone className="text-lg" />
												<span className="font-medium">Telepon</span>
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-12">
						<div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
							<BiMoney className="text-4xl text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tidak Ada Paket Tersedia</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Tidak ada paket yang sesuai dengan filter yang dipilih. Coba ubah filter atau hubungi kami untuk informasi lebih lanjut.
						</p>
					</div>
				)}
			</div>

			{/* Additional Info */}
			<div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
				<div className="flex items-start gap-3">
					<BiMoney className="text-blue-500 text-xl mt-1 flex-shrink-0" />
					<div>
						<h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Informasi Harga</h5>
						<p className="text-sm text-blue-700 dark:text-blue-300">
							Harga dapat berubah sewaktu-waktu. Hubungi kami untuk mendapatkan harga terbaru dan informasi detail paket wisata.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TravelAgencyPriceList;
