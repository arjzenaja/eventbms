"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiHeart, BiShare, BiArrowBack } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import LocationInfo from "../../../../components/LocationInfo";

import SimpleSouvenirSection from "../../../../components/SimpleSouvenirSection";

const OlehOlehDetail = () => {
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
				const res = await fetch(`/api/oleh_oleh/${id}`);
				if (!res.ok) {
					throw new Error("Failed to fetch destination");
				}
				const data = await res.json();
				setDestination(data.oleh_oleh || data.destination || data);
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
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
					<div className="text-emerald-600 dark:text-emerald-400 text-xl">Memuat Oleh-Oleh...</div>
				</div>
			</div>
		);
	}

	if (error || !destination) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
						<BiStar className="text-4xl text-red-500" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Oleh-Oleh Tidak Ditemukan</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">Oleh-oleh yang Anda cari tidak tersedia.</p>
					<button 
						onClick={() => window.history.back()} 
						className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Section */}
			<div className="relative pt-24 pb-8 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
				<div className="relative container mx-auto px-4">
					{/* Back Button */}
					<button 
						onClick={() => window.history.back()} 
						className="group mb-6 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 transform hover:-translate-x-1"
					>
						<BiArrowBack className="text-xl group-hover:scale-110 transition-transform" />
						<span className="font-medium">Kembali ke Dolan Banyumas</span>
					</button>

					{/* Main Header */}
					<div className="max-w-4xl mx-auto text-center mb-8">
						<div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
							<BiStar className="text-lg" />
							<span>Oleh-Oleh</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
							{destination.title}
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							{destination.short_description || destination.description || "Temukan oleh-oleh khas Banyumas yang menarik"}
						</p>
					</div>

					{/* Quick Stats */}
					<div className="flex justify-center">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700/50">
								<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4.8</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
							</div>
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700/50">
								<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">500+</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Pengunjung</div>
							</div>
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700/50">
								<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">25</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Produk</div>
							</div>
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 dark:border-gray-700/50">
								<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Jam Buka</div>
							</div>
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
									images={[destination.img_lg, destination.img_sm, ...(destination.gallery || [])].filter(Boolean)}
									title={destination.title}
								/>
							</div>

							{/* Description Section */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tentang Oleh-Oleh</h2>
								</div>
								
								<div className="prose prose-lg max-w-none">
									<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
										{destination.description || destination.short_description || "Deskripsi oleh-oleh tidak tersedia"}
									</p>
								</div>
							</div>

							{/* Pengelola Oleh-Oleh Section */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-xl">
								{/* Header */}
								<div className="text-center mb-8">
									<div className="inline-flex items-center gap-3 mb-4">
										<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
											<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
											</svg>
										</div>
										<div>
											<h2 className="text-3xl font-bold text-gray-800 dark:text-white">Pengelola Oleh-Oleh</h2>
											<p className="text-gray-600 dark:text-gray-300">Tim pengelola destinasi oleh-oleh</p>
										</div>
									</div>
								</div>

								{/* Tim Pengelola Card */}
								<div className="bg-blue-900/20 dark:bg-blue-800/30 rounded-2xl p-6 mb-8">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
												<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
											</div>
											<div>
												<h3 className="text-xl font-bold text-gray-800 dark:text-white">Tim Pengelola Oleh-Oleh</h3>
												<p className="text-gray-600 dark:text-gray-300">Pengelola Destinasi</p>
												<div className="flex items-center gap-2 mt-2">
													<div className="flex gap-1">
														{[...Array(5)].map((_, i) => (
															<BiStar key={i} className="text-yellow-400 text-lg" />
														))}
													</div>
													<span className="text-sm text-gray-600 dark:text-gray-400">5.0 (Terpercaya)</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="flex items-center gap-2 mb-2">
												<div className="w-3 h-3 bg-green-500 rounded-full"></div>
												<span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400">Siap melayani</p>
										</div>
									</div>
								</div>

								{/* Informasi Kontak */}
								<div className="mb-8">
									<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informasi Kontak</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Telepon Card */}
										<div className="bg-blue-900/20 dark:bg-blue-800/30 rounded-xl p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
														<BiPhone className="text-white text-lg" />
													</div>
													<div>
														<p className="text-sm text-gray-600 dark:text-gray-400">Telepon</p>
														<p className="font-semibold text-gray-900 dark:text-white">+62 812-3456-7890</p>
													</div>
												</div>
												<button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
													<BiPhone className="text-white text-sm" />
												</button>
											</div>
										</div>

										{/* WhatsApp Card */}
										<div className="bg-green-900/20 dark:bg-green-800/30 rounded-xl p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
														<FaWhatsapp className="text-white text-lg" />
													</div>
													<div>
														<p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
														<p className="font-semibold text-gray-900 dark:text-white">+62 812-3456-7890</p>
													</div>
												</div>
												<button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
													<FaWhatsapp className="text-white text-sm" />
												</button>
											</div>
										</div>
									</div>
								</div>

								{/* Aksi Cepat */}
								<div className="mb-8">
									<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Aksi Cepat</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Telepon Button */}
										<button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3">
											<BiPhone className="text-xl" />
											<span>Telepon</span>
										</button>

										{/* WhatsApp Button */}
										<button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3">
											<FaWhatsapp className="text-xl" />
											<span>WhatsApp</span>
										</button>
									</div>
								</div>

								{/* Produk Info Card */}
								<div className="mb-8">
									<div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
										<div className="flex items-center justify-center gap-4 mb-4">
											<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
												<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
												</svg>
											</div>
											<div className="text-center">
												<h3 className="text-2xl font-bold mb-1">Produk Tersedia</h3>
												<p className="text-emerald-100 text-base">Produk lengkap ada di bawah halaman ini</p>
											</div>
										</div>
										
										{/* Produk Preview Cards */}
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
											<div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/30">
												<div className="w-8 h-8 bg-yellow-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
													<svg className="w-4 h-4 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
												</div>
												<p className="text-xs font-medium">Siap Kirim</p>
											</div>
											
											<div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/30">
												<div className="w-8 h-8 bg-green-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
													<svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
												</div>
												<p className="text-xs font-medium">Asli</p>
											</div>
											
											<div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/30">
												<div className="w-8 h-8 bg-blue-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
													<svg className="w-4 h-4 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
													</svg>
												</div>
												<p className="text-xs font-medium">Fresh</p>
											</div>
										</div>
									</div>
								</div>

								{/* Jam Operasional */}
								<div className="bg-blue-900/20 dark:bg-blue-800/30 rounded-xl p-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<BiTime className="text-blue-500 text-lg" />
										</div>
										<div>
											<h4 className="font-semibold text-gray-800 dark:text-white">Jam Operasional</h4>
											<p className="text-gray-600 dark:text-gray-300">Senin - Minggu: 08:00 - 17:00 WIB</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">*Jam operasional dapat berubah sesuai kondisi</p>
										</div>
									</div>
								</div>

								{/* Footer Tags */}
								<div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
									<div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-2 rounded-full text-sm">
										<BiStar className="text-sm" />
										<span>Terpercaya</span>
									</div>
									<div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-full text-sm">
										<BiTime className="text-sm" />
										<span>Respon Cepat</span>
									</div>
									<div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-2 rounded-full text-sm">
										<BiMap className="text-sm" />
										<span>Lokal</span>
									</div>
								</div>
							</div>

							{/* Smart Map */}
							<ErrorBoundary>
								<SmartMap
									destination={destination}
									onDistanceCalculated={setMapDistance}
								/>
							</ErrorBoundary>

							{/* Location Info */}
							<LocationInfo destination={destination} />
						</div>

						{/* Right Column - Info & Actions */}
						<div className="space-y-6">
							{/* Contact & Info Card */}
							<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
								<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informasi Kontak</h3>
								
								<div className="space-y-4">
									{/* Phone */}
									{contactInfo.phone && (
										<div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
											<div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
												<BiPhone className="text-white text-lg" />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Telepon</p>
												<p className="font-semibold text-gray-900 dark:text-white">{contactInfo.phone}</p>
											</div>
										</div>
									)}

									{/* WhatsApp */}
									{contactInfo.whatsapp && (
										<div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
											<div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
												<FaWhatsapp className="text-white text-lg" />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
												<p className="font-semibold text-gray-900 dark:text-white">{contactInfo.whatsapp}</p>
											</div>
										</div>
									)}

									{/* Address */}
									{destination.address && (
										<div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
											<div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
												<BiMap className="text-white text-lg" />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Alamat</p>
												<p className="font-semibold text-gray-900 dark:text-white">{destination.address}</p>
											</div>
										</div>
									)}

									{/* Opening Hours */}
									{destination.opening_hours && (
										<div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
											<div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
												<BiTime className="text-white text-lg" />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Jam Buka</p>
												<p className="font-semibold text-gray-900 dark:text-white">{destination.opening_hours}</p>
											</div>
										</div>
									)}

									{/* Price Range */}
									{destination.price_range && (
										<div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
											<div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
												<BiMoney className="text-white text-lg" />
											</div>
											<div>
												<p className="text-sm text-gray-600 dark:text-gray-400">Kisaran Harga</p>
												<p className="font-semibold text-gray-900 dark:text-white">{destination.price_range}</p>
											</div>
										</div>
									)}
								</div>
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

							{/* Quick Actions */}
							<div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 text-white text-center">
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
											href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan oleh-oleh ${destination.title}`}
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
								<div className="text-emerald-100 text-sm">
									<p>Pilih aksi yang ingin Anda lakukan</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Oleh-Oleh Section */}
			<SimpleSouvenirSection 
				destinationTitle={destination.title} 
				destinationId={id}
				destinationSlug={destination.slug || destination.title?.toLowerCase().replace(/\s+/g, '-')}
			/>
		</div>
	);
};

export default OlehOlehDetail;
