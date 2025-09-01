"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiHeart, BiShare, BiArrowBack } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import TravelAgencyManager from "../../../../components/TravelAgencyManager";
import TravelAgencyPriceList from "../../../../components/TravelAgencyPriceList";

const BiroPerjalananDetail = () => {
	const { id } = useParams();
	const [destination, setDestination] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mapDistance, setMapDistance] = useState(null);
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		const fetchDestination = async () => {
			try {
				setIsLoading(true);
				const res = await fetch(`/api/biro_perjalanan/${id}`);
				if (!res.ok) {
					throw new Error("Failed to fetch destination");
				}
				const data = await res.json();
				setDestination(data.biro_perjalanan || data.destination || data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		if (id) {
			fetchDestination();
		}
	}, [id]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
					<div className="text-purple-600 dark:text-purple-400 text-xl">Memuat Biro Perjalanan...</div>
				</div>
			</div>
		);
	}

	if (error || !destination) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="text-center">
					<div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
						<BiStar className="text-4xl text-purple-500" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Biro Perjalanan Tidak Ditemukan</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">Biro perjalanan yang Anda cari tidak tersedia.</p>
					<button 
						onClick={() => window.history.back()} 
						className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
					>
						<BiArrowBack className="inline mr-2" />
						Kembali
					</button>
				</div>
			</div>
		);
	}

	const parseContact = (contact) => {
		if (typeof contact === 'string') {
			try {
				return JSON.parse(contact);
			} catch {
				return { phone: contact };
			}
		}
		return contact || {};
	};

	const cleanPhoneNumber = (phone) => {
		return phone ? phone.replace(/[^0-9]/g, '') : '';
	};

	const contactInfo = parseContact(destination.contact);

	// Prepare gallery images
	const galleryImages = [
		destination.img_lg,
		destination.img_sm,
		...(destination.gallery || [])
	].filter(Boolean);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Hero Section */}
			<div className="relative pt-24 pb-8 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20"></div>
				<div className="relative container mx-auto px-4">
					{/* Back Button */}
					<button 
						onClick={() => window.history.back()} 
						className="group mb-6 inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 transform hover:-translate-x-1"
					>
						<BiArrowBack className="text-xl group-hover:scale-110 transition-transform" />
						<span className="font-medium">Kembali ke Dolan Banyumas</span>
					</button>

					{/* Main Header */}
					<div className="max-w-4xl mx-auto text-center mb-8">
						<div className="inline-flex items-center gap-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full mb-3 border border-purple-200 dark:border-purple-700">
							<BiStar className="text-lg" />
							<span className="text-sm font-medium capitalize">{destination.type}</span>
						</div>
						
						<h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
							{destination.title}
						</h1>
						
						<div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
							<div className="flex items-center gap-2">
								<BiMap className="text-xl text-purple-500" />
								<span className="font-medium">{destination.location}</span>
							</div>
							{destination.recommended && (
								<div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-700">
									<BiStar className="text-lg" />
									<span className="text-sm font-medium">Direkomendasikan</span>
								</div>
							)}
							{destination.rating && (
								<div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
									<BiStar className="text-lg" />
									<span className="text-sm font-medium">{destination.rating}/5</span>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex items-center justify-center gap-3">
							<button 
								onClick={() => setIsLiked(!isLiked)}
								className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
									isLiked 
										? 'bg-red-500 text-white shadow-lg' 
										: 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30'
								}`}
							>
								<BiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
								<span className="text-sm font-medium">{isLiked ? 'Disukai' : 'Sukai'}</span>
							</button>
							
							<button className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/80">
								<BiShare className="text-lg" />
								<span className="text-sm font-medium">Bagikan</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 pb-12">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
						{/* Left Column - Gallery & Map */}
						<div className="xl:col-span-2 space-y-6">
							{/* Photo Gallery */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl mb-6 mt-6">
								<PhotoGallery
									images={galleryImages}
									title={destination.title}
								/>
							</div>

							{/* Description Section */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tentang Biro Perjalanan</h2>
								</div>
								
								<div className="prose prose-lg max-w-none">
									<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
										{destination.description || destination.short_description || "Deskripsi biro perjalanan tidak tersedia"}
									</p>
								</div>
							</div>

							{/* Pengelola Biro Perjalanan Section */}
							<TravelAgencyManager destination={destination} contactInfo={contactInfo} />

							{/* Map Section */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
								<ErrorBoundary>
									<SmartMap destination={destination} onDistanceCalculated={setMapDistance} />
								</ErrorBoundary>
							</div>

							{/* Distance & Travel Time Section */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
								<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Jarak & Waktu Tempuh</h3>
								
								{/* Distance Card */}
								<div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-4 mb-6 text-white">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
											<BiMap className="text-2xl text-white" />
										</div>
										<div>
											<p className="text-sm opacity-90">Jarak dari Lokasi Anda</p>
											<p className="text-2xl font-bold">{mapDistance || "0.5 km"}</p>
										</div>
									</div>
								</div>

								{/* Transport Options Grid */}
								<div className="grid grid-cols-3 gap-3">
									{/* Mobil */}
									<div className="bg-blue-500 rounded-xl p-3 text-white text-center">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
										<p className="text-xs font-medium">Mobil</p>
										<p className="text-sm font-bold">1 menit</p>
									</div>

									{/* Motor */}
									<div className="bg-green-500 rounded-xl p-3 text-white text-center">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
										</div>
										<p className="text-xs font-medium">Motor</p>
										<p className="text-sm font-bold">1 menit</p>
									</div>

									{/* Bus */}
									<div className="bg-purple-500 rounded-xl p-3 text-white text-center">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
										<p className="text-xs font-medium">Bus</p>
										<p className="text-sm font-bold">1 menit</p>
									</div>

									{/* Kereta */}
									<div className="bg-orange-500 rounded-xl p-3 text-white text-center">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
											</svg>
										</div>
										<p className="text-xs font-medium">Kereta</p>
										<p className="text-sm font-bold">1 menit</p>
									</div>

									{/* Jalan Kaki */}
									<div className="bg-red-500 rounded-xl p-3 text-white text-center">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
										<p className="text-xs font-medium">Jalan</p>
										<p className="text-sm font-bold">7 menit</p>
									</div>

									{/* Sepeda */}
									<div className="bg-teal-500 rounded-xl p-3 text-white text-center">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
										</div>
										<p className="text-xs font-medium">Sepeda</p>
										<p className="text-sm font-bold">2 menit</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right Sidebar */}
						<div className="space-y-4">
							{/* Price & Contact Card */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl mt-6">
								<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informasi Biro Perjalanan</h3>
								
								{/* Price Section */}
								{destination.price_range && (
									<div className="mb-6">
										<div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white text-center mb-4">
											<div className="text-sm opacity-90 mb-1">Kisaran Harga</div>
											<div className="text-2xl font-bold">{destination.price_range}</div>
										</div>
									</div>
								)}

								{/* Opening Hours */}
								{destination.opening_hours && (
									<div className="mb-6">
										<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Jam Operasional</h4>
										<div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
											<BiTime className="text-xl text-amber-500" />
											<span className="text-amber-700 dark:text-amber-300">{destination.opening_hours}</span>
										</div>
									</div>
								)}

								{/* Contact Section */}
								{contactInfo && Object.keys(contactInfo).length > 0 && (
									<div className="mb-6">
										<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Kontak</h4>
										<div className="space-y-3">
											{contactInfo.phone && (
												<a 
													href={`tel:${contactInfo.phone}`}
													className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
												>
													<BiPhone className="text-xl text-blue-500" />
													<span className="text-blue-700 dark:text-blue-300">{contactInfo.phone}</span>
												</a>
											)}
											
											{contactInfo.whatsapp && (
												<a 
													href={`https://wa.me/${cleanPhoneNumber(contactInfo.whatsapp)}?text=Halo, saya tertarik dengan biro perjalanan ${destination.title}`}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
												>
													<FaWhatsapp className="text-xl text-green-500" />
													<span className="text-green-700 dark:text-green-300">WhatsApp</span>
												</a>
											)}
											
											{contactInfo.instagram && (
												<a 
													href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/30 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
												>
													<FaInstagram className="text-xl text-pink-500" />
													<span className="text-pink-700 dark:text-pink-300">Instagram</span>
												</a>
											)}
											
											{contactInfo.website && (
												<a 
													href={contactInfo.website}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
												>
													<FaGlobe className="text-xl text-purple-500" />
													<span className="text-purple-700 dark:text-purple-300">Website</span>
												</a>
											)}
										</div>
									</div>
								)}

								{/* Address Section */}
								{destination.address && (
									<div className="mb-6">
										<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Alamat</h4>
										<div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
											<BiMap className="text-xl text-purple-500 mt-1 flex-shrink-0" />
											<span className="text-gray-700 dark:text-gray-300">{destination.address}</span>
										</div>
									</div>
								)}

								{/* Created Date */}
								{destination.created_at && (
									<div>
										<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ditambahkan</h4>
										<div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
											<BiTime className="text-xl text-amber-500" />
											<span className="text-amber-700 dark:text-amber-300">
												{new Date(destination.created_at).toLocaleDateString('id-ID', {
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})}
											</span>
										</div>
									</div>
								)}
							</div>

							{/* Features Section */}
							{destination.features && destination.features.length > 0 && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
											</svg>
										</div>
										<h3 className="text-xl font-bold text-gray-800 dark:text-white">Fitur & Fasilitas</h3>
									</div>
									
									<div className="space-y-3">
										{destination.features.map((feature, index) => (
											<div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
												<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
												<span className="text-sm text-purple-700 dark:text-purple-300">{feature}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Services Section */}
							{destination.services && destination.services.length > 0 && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
											</svg>
										</div>
										<h3 className="text-xl font-bold text-gray-800 dark:text-white">Layanan</h3>
									</div>
									
									<div className="space-y-3">
										{destination.services.map((service, index) => (
											<div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
												<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
												<span className="text-sm text-blue-700 dark:text-blue-300">{service}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Quick Actions */}
							<div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center">
								<h3 className="text-xl font-bold mb-4">Aksi Cepat</h3>
								
								{/* Main Action Buttons - Horizontal Layout */}
								<div className="grid grid-cols-4 gap-3 mb-4">
									{/* Telepon Button */}
									{contactInfo.phone ? (
										<a 
											href={`tel:${contactInfo.phone}`}
											className="flex flex-col items-center justify-center gap-2 bg-amber-600/80 hover:bg-amber-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
										>
											<BiPhone className="text-2xl" />
											<span className="text-xs">Telepon</span>
										</a>
									) : (
										<button className="flex flex-col items-center justify-center gap-2 bg-amber-600/80 hover:bg-amber-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
											<BiPhone className="text-2xl" />
											<span className="text-xs">Telepon</span>
										</button>
									)}
									
									{/* WhatsApp Button */}
									{contactInfo.whatsapp ? (
										<a 
											href={`https://wa.me/${cleanPhoneNumber(contactInfo.whatsapp)}?text=Halo, saya tertarik dengan biro perjalanan ${destination.title}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex flex-col items-center justify-center gap-2 bg-green-600/80 hover:bg-green-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
										>
											<FaWhatsapp className="text-2xl" />
											<span className="text-xs">WhatsApp</span>
										</a>
									) : (
										<button className="flex flex-col items-center justify-center gap-2 bg-green-600/80 hover:bg-green-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
											<FaWhatsapp className="text-2xl" />
											<span className="text-xs">WhatsApp</span>
										</button>
									)}
									
									{/* Arahkan Button */}
									<button className="flex flex-col items-center justify-center gap-2 bg-purple-600/80 hover:bg-purple-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
										<BiMap className="text-2xl" />
										<span className="text-xs">Arahkan</span>
									</button>
									
									{/* Bagikan Button */}
									<button className="flex flex-col items-center justify-center gap-2 bg-red-600/80 hover:bg-red-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
										<BiShare className="text-2xl" />
										<span className="text-xs">Bagikan</span>
									</button>
								</div>
								
								{/* Additional Info */}
								<div className="text-purple-100 text-sm">
									<p>Pilih aksi yang ingin Anda lakukan</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Daftar Harga Biro Perjalanan Section */}
			<div className="container mx-auto px-4 pb-12">
				<div className="max-w-7xl mx-auto">
					<TravelAgencyPriceList destination={destination} contactInfo={contactInfo} />
				</div>
			</div>
		</div>
	);
};

export default BiroPerjalananDetail;
