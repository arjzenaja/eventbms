"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiHeart, BiShare, BiArrowBack } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import DesaWisataMenuSection from "../../../../components/DesaWisataMenuSection";
import TourismManager from "../../../../components/TourismManager";
import WeatherInfo from "../../../../components/WeatherInfo";
import Rating from "../../../../components/Rating";

const DesaWisataDetail = () => {
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
				const res = await fetch(`/api/desa_wisata/${id}`);
				if (!res.ok) {
					throw new Error("Failed to fetch destination");
				}
				const data = await res.json();
				setDestination(data.desa_wisata || data.destination || data);
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
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
					<div className="text-green-600 dark:text-green-400 text-xl">Memuat Desa Wisata...</div>
				</div>
			</div>
		);
	}

	if (error || !destination) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="text-center">
					<div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
						<BiStar className="text-4xl text-green-500" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Desa Wisata Tidak Ditemukan</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">Desa wisata yang Anda cari tidak tersedia.</p>
					<button 
						onClick={() => window.history.back()} 
						className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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

	const contactInfo = parseContact(destination.contact);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Enhanced Hero Section */}
			<div className="relative pt-24 pb-16 overflow-hidden">
				{/* Enhanced Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30"></div>
				<div className="absolute inset-0 bg-[url('/pattern_bg.png')] opacity-10"></div>
				
				{/* Floating Elements */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-green-300/20 rounded-full blur-xl animate-bounce"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl animate-bounce delay-1000"></div>
				<div className="absolute bottom-20 left-1/4 w-12 h-12 bg-teal-300/20 rounded-full blur-xl animate-bounce delay-2000"></div>
				<div className="absolute top-60 right-1/3 w-14 h-14 bg-cyan-300/20 rounded-full blur-xl animate-bounce delay-3000"></div>
				
				<div className="relative container mx-auto px-4">
					{/* Enhanced Back Button */}
					<button 
						onClick={() => window.history.back()} 
						className="group mt-16 mb-8 inline-flex items-center gap-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 transform hover:-translate-x-1"
					>
						<div className="w-12 h-12 bg-green-500/30 group-hover:bg-green-500/40 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl">
							<BiArrowBack className="text-2xl group-hover:scale-110 transition-transform" />
						</div>
						<span className="font-bold text-lg">Kembali ke Dolan Banyumas</span>
					</button>

					{/* Enhanced Main Header */}
					<div className="max-w-5xl mx-auto text-center mb-12">
						<div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-bold mb-6 shadow-2xl">
							<BiStar className="text-2xl" style={{ animationDuration: '3s' }} />
							<span className="capitalize">{destination.type || 'Desa Wisata'}</span>
						</div>
						
						<h1 className="text-6xl md:text-8xl font-black text-gray-800 dark:text-white mb-8 leading-tight bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
							{destination.title}
						</h1>
						
						<div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
									<BiMap className="text-2xl text-white" />
								</div>
								<span className="font-bold text-xl">{destination.location}</span>
							</div>
							{destination.recommended && (
								<div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-2xl animate-pulse">
									<BiStar className="text-2xl" style={{ animationDuration: '3s' }} />
									<span>Direkomendasikan</span>
								</div>
							)}
						</div>

						{/* Enhanced Action Buttons */}
						<div className="flex items-center justify-center gap-6">
							<button 
								onClick={() => setIsLiked(!isLiked)}
								className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${
									isLiked 
										? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25' 
										: 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 backdrop-blur-sm'
								}`}
							>
								<BiHeart className={`text-2xl ${isLiked ? 'fill-current' : ''}`} />
								<span className="font-bold text-lg">{isLiked ? 'Disukai' : 'Sukai'}</span>
							</button>
							
							<button className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/80 backdrop-blur-sm shadow-xl">
								<BiShare className="text-2xl" />
								<span className="font-bold text-lg">Bagikan</span>
							</button>
						</div>
					</div>
						</div>
					</div>

					{/* Enhanced Main Content */}
					<div className="container mx-auto px-4 pb-16">
						<div className="max-w-7xl mx-auto">
							<div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
								{/* Left Column - Gallery & Map */}
								<div className="xl:col-span-2 space-y-10">
									{/* Enhanced Photo Gallery */}
									<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
										<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl"></div>
										<div className="relative">
											<div className="flex items-center gap-4 mb-8">
												<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
													<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
												</div>
												<div>
													<h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Galeri Foto</h3>
													<div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
												</div>
											</div>
											<PhotoGallery
												images={[destination.img_lg, destination.img_sm, ...(destination.gallery || [])].filter(Boolean)}
												title={destination.title}
											/>
										</div>
									</div>

							{/* Description Section */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tentang Desa Wisata</h2>
								</div>
								
								<div className="prose prose-lg max-w-none">
									<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
										{destination.description || destination.short_description || "Deskripsi desa wisata tidak tersedia"}
									</p>
								</div>

								{/* Jam Operasional */}
								{destination.operating_hours && (
									<div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
										<div className="flex items-center gap-2 mb-2">
											<BiTime className="text-xl text-green-600" />
											<h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Jam Operasional</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
											<div className="flex items-center gap-2">
												<span className="text-green-600">🕒</span>
												<span className="text-green-700 dark:text-green-300">
													{destination.operating_hours.open} - {destination.operating_hours.close}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-green-600">📅</span>
												<span className="text-green-700 dark:text-green-300">
													{destination.operating_hours.days}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-green-600">💡</span>
												<span className="text-green-700 dark:text-green-300">
													Buka setiap hari
												</span>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Paket Wisata Section */}
							{destination.packages && destination.packages.length > 0 && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
											</svg>
										</div>
										<h3 className="text-2xl font-bold text-gray-800 dark:text-white">Paket Wisata</h3>
									</div>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{destination.packages.map((pkg, index) => (
											<div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
														<span className="text-white text-sm font-bold">{index + 1}</span>
													</div>
													<span className="text-blue-700 dark:text-blue-300 font-medium">{pkg}</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Aktivitas Section */}
							{destination.activities && destination.activities.length > 0 && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4a1 1 0 001-1v-4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1" />
											</svg>
										</div>
										<h3 className="text-2xl font-bold text-gray-800 dark:text-white">Aktivitas & Event</h3>
									</div>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{destination.activities.map((activity, index) => (
											<div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
														<span className="text-white">🎨</span>
													</div>
													<span className="text-purple-700 dark:text-purple-300 font-medium">{activity}</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Transportasi Section */}
							{destination.transportation && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
										<h3 className="text-xl font-bold text-gray-800 dark:text-white">Informasi Transportasi</h3>
									</div>
									
									<div className="prose prose-lg max-w-none">
										<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
											{destination.transportation}
										</p>
									</div>
								</div>
							)}

							{/* Akomodasi Section */}
							{destination.accommodation && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
											</svg>
										</div>
										<h3 className="text-xl font-bold text-gray-800 dark:text-white">Akomodasi Terdekat</h3>
									</div>
									
									<div className="prose prose-lg max-w-none">
										<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
											{destination.accommodation}
										</p>
									</div>
								</div>
							)}

							{/* Pengelola Desa Wisata Section */}
							<TourismManager destination={destination} contactInfo={contactInfo} />

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
								<div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 mb-6 text-white">
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
								<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informasi Desa Wisata</h3>
								
								{/* Price Section */}
								{destination.price_range && (
									<div className="mb-6">
										<div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white text-center mb-4">
											<div className="text-sm opacity-90 mb-1">Biaya Kunjungan</div>
											<div className="text-2xl font-bold">{destination.price_range}</div>
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
													href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan desa wisata ${destination.title}`}
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
											<BiMap className="text-xl text-green-500 mt-1 flex-shrink-0" />
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

							{/* Weather Info Section */}
							{destination.weather_info && destination.location && (
								<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
									<WeatherInfo location={destination.location} />
								</div>
							)}

							{/* Rating & Reviews Section */}
							<Rating 
								destinationId={destination.id} 
								initialRating={destination.rating || 4.5} 
								initialReviews={destination.reviews || []}
							/>

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

							{/* Quick Actions */}
							<div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-6 text-white text-center">
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
											href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan desa wisata ${destination.title}`}
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
								<div className="text-green-100 text-sm">
									<p>Pilih aksi yang ingin Anda lakukan</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Daftar Harga & Layanan Section */}
			<DesaWisataMenuSection 
				destinationTitle={destination.title}
				destinationId={destination.id}
				destinationSlug={destination.slug}
			/>
		</div>
	);
};

export default DesaWisataDetail;
