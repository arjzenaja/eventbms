"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiHeart, BiShare, BiArrowBack } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import RatingReviews from "../../../../components/RatingReviews";

import SimpleMenuSection from "../../../../components/SimpleMenuSection";
import FloatingCartButton from "../../../../components/FloatingCartButton";
import { useCulinaryCart } from "../../../../context/CulinaryCartContext";

const FloatingCartButtonWrapper = () => {
	const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, destination } = useCulinaryCart();
	return (
		<FloatingCartButton 
			items={items}
			totalItems={totalItems} 
			totalPrice={totalPrice}
			updateQuantity={updateQuantity}
			removeFromCart={removeFromCart}
			clearCart={clearCart}
			destination={destination}
		/>
	);
};

const KulinerContent = () => {
	const { id } = useParams();
	const [destination, setDestination] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mapDistance, setMapDistance] = useState(null);
	const [isLiked, setIsLiked] = useState(false);
	const { setDestination: setCartDestination } = useCulinaryCart();

	useEffect(() => {
		const fetchDestination = async () => {
			try {
				setIsLoading(true);
				const res = await fetch(`/api/kuliner/${id}`);
				if (!res.ok) {
					throw new Error("Failed to fetch destination");
				}
				const data = await res.json();
				const destData = data.kuliner || data.destination || data;
				setDestination(destData);
				setCartDestination(destData);
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
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
					<div className="text-red-600 dark:text-red-400 text-xl">Memuat Kuliner...</div>
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
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Kuliner Tidak Ditemukan</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">Kuliner yang Anda cari tidak tersedia.</p>
					<button 
						onClick={() => window.history.back()} 
						className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
	
	// Prioritize individual fields over contact field
	const finalContactInfo = {
		phone: destination.phone || contactInfo.phone,
		whatsapp: destination.whatsapp || contactInfo.whatsapp,
		email: destination.email || contactInfo.email,
		website: destination.website || contactInfo.website
	};

	// Parse features if it's a string JSON
	const parseFeatures = (features) => {
		if (!features) return [];
		if (Array.isArray(features)) {
			return features.map(feature => {
				// If feature is a string that looks like JSON array, parse it
				if (typeof feature === 'string' && feature.startsWith('[') && feature.endsWith(']')) {
					try {
						const parsed = JSON.parse(feature);
						return Array.isArray(parsed) ? parsed : [parsed];
					} catch {
						return feature;
					}
				}
				return feature;
			}).flat();
		}
		return features;
	};

	// Function to shorten URL for display
	const shortenUrl = (url) => {
		if (!url) return '';
		try {
			const urlObj = new URL(url);
			// Remove www. prefix and show only domain + path (max 30 chars)
			let displayUrl = urlObj.hostname.replace(/^www\./, '');
			if (urlObj.pathname !== '/') {
				displayUrl += urlObj.pathname;
			}
			// Truncate if too long
			if (displayUrl.length > 30) {
				displayUrl = displayUrl.substring(0, 27) + '...';
			}
			return displayUrl;
		} catch {
			// If URL parsing fails, return truncated original
			return url.length > 30 ? url.substring(0, 27) + '...' : url;
		}
	};

	const parsedFeatures = parseFeatures(destination.features);

		return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
		{/* Hero Section */}
		<div className="relative pt-24 pb-12 overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse"></div>
				<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
				{/* Floating Elements */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-orange-300/20 rounded-full blur-xl animate-bounce"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-red-300/20 rounded-full blur-xl animate-bounce delay-1000"></div>
				<div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-300/20 rounded-full blur-xl animate-bounce delay-2000"></div>
			</div>
			
			<div className="relative container mx-auto px-4">
				{/* Back Button */}
				<button 
					onClick={() => window.history.back()} 
					className="group mt-12 mb-8 inline-flex items-center gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 transform hover:-translate-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl"
				>
					<BiArrowBack className="text-xl group-hover:scale-110 transition-transform" />
					<span className="font-medium">Kembali ke Dolan Banyumas</span>
				</button>

				{/* Main Header */}
				<div className="max-w-5xl mx-auto text-center mb-12">
					<div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-800 dark:text-orange-300 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-orange-200 dark:border-orange-700 shadow-lg">
						<BiStar className="text-lg animate-pulse" />
						<span>Kuliner Terbaik Banyumas</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight bg-gradient-to-r from-gray-900 via-red-600 to-orange-600 dark:from-white dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent">
						{destination.title}
					</h1>
					
					{/* Rating Display */}
					{destination.rating && (
						<div className="flex items-center justify-center gap-4 mb-8">
							<div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 px-6 py-3 rounded-full border border-yellow-200 dark:border-yellow-700 shadow-lg">
									<div className="flex items-center gap-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<BiStar
												key={star}
												className={`text-xl transition-all duration-1000 ${
													star <= Math.floor(parseFloat(destination.rating))
														? 'text-yellow-400 fill-current animate-pulse'
														: star === Math.ceil(parseFloat(destination.rating)) && parseFloat(destination.rating) % 1 !== 0
														? 'text-yellow-400 fill-current opacity-50'
														: 'text-gray-300 dark:text-gray-600'
												}`}
												style={{
													animationDuration: '3s',
													animationIterationCount: 'infinite'
												}}
											/>
										))}
									</div>
								<span className="text-yellow-800 dark:text-yellow-200 font-bold text-xl">
									{parseFloat(destination.rating).toFixed(1)}
								</span>
							</div>
							<div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
								<span>Rating Terpercaya</span>
							</div>
						</div>
					)}
					
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
						{destination.short_description || destination.description || "Temukan kelezatan kuliner khas Banyumas yang menggugah selera"}
					</p>
				</div>

				{/* Enhanced Quick Stats */}
				<div className="flex justify-center">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
						{destination.rating && (
						<div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 text-center border border-white/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
								<div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">
									{parseFloat(destination.rating).toFixed(1)}
								</div>
							<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rating</div>
						</div>
						)}
						<div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 text-center border border-white/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
							<div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">500+</div>
							<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pengunjung</div>
						</div>
						<div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 text-center border border-white/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
							<div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">
								{destination.menu ? destination.menu.length : 0}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Menu</div>
						</div>
						<div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 text-center border border-white/60 dark:border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
							<div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">
								{destination.opening_hours ? 'Buka' : '24/7'}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jam Buka</div>
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
						<div className="xl:col-span-2 space-y-8">
							{/* Enhanced Photo Gallery */}
							<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 mb-8 mt-8">
								<div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-yellow-500/5 rounded-3xl"></div>
								<div className="relative">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
											<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
										<h3 className="text-2xl font-bold text-gray-800 dark:text-white">Galeri Foto</h3>
									</div>
									<PhotoGallery
										images={[destination.img_lg, destination.img_sm, ...(destination.gallery || [])].filter(Boolean)}
										title={destination.title}
									/>
								</div>
							</div>

							{/* Enhanced Description Section */}
							<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
								<div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5 rounded-3xl"></div>
								<div className="relative">
									<div className="flex items-center gap-4 mb-6">
										<div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
											<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</div>
										<div>
											<h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Tentang Kuliner</h2>
											<div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
										</div>
									</div>
									
									<div className="prose prose-lg max-w-none">
										<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-800 dark:to-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
											{destination.description || destination.short_description || "Deskripsi kuliner tidak tersedia"}
										</p>
									</div>
								</div>
							</div>

							{/* Enhanced Pengelola Kuliner Section */}
							<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
								<div className="relative">
									{/* Header */}
									<div className="text-center mb-8">
										<div className="inline-flex items-center gap-4 mb-6">
											<div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
												<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
												</svg>
											</div>
											<div>
												<h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Pengelola Kuliner</h2>
												<p className="text-gray-600 dark:text-gray-300 text-lg">Tim profesional yang siap melayani</p>
												<div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-3"></div>
											</div>
										</div>
									</div>

									{/* Enhanced Tim Pengelola Card */}
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-8 mb-8 border border-blue-200 dark:border-blue-700 shadow-xl">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-6">
												<div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
													<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
													</svg>
												</div>
												<div>
													<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{destination.manager || 'Tim Pengelola Kuliner'}</h3>
													<p className="text-gray-600 dark:text-gray-300 text-lg mb-3">Pengelola Kuliner Profesional</p>
													<div className="flex items-center gap-3">
													<div className="flex gap-1">
														{[...Array(5)].map((_, i) => (
															<BiStar 
																key={i} 
																className="text-yellow-400 text-xl animate-pulse" 
																style={{
																	animationDuration: '3s',
																	animationIterationCount: 'infinite'
																}}
															/>
														))}
													</div>
														<span className="text-sm text-gray-600 dark:text-gray-400 font-medium bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">5.0 Terpercaya</span>
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="flex items-center gap-3 mb-3">
													<div 
														className="w-4 h-4 bg-green-500 rounded-full animate-pulse"
														style={{
															animationDuration: '3s',
															animationIterationCount: 'infinite'
														}}
													></div>
													<span className="text-lg font-semibold text-green-600 dark:text-green-400">Online</span>
												</div>
												<p className="text-sm text-gray-600 dark:text-gray-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">Siap melayani 24/7</p>
											</div>
										</div>
									</div>


									{/* Enhanced Aksi Cepat */}
									<div className="mb-8">
										<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Aksi Cepat</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Telepon Button */}
											{finalContactInfo.phone ? (
												<a 
													href={`tel:${finalContactInfo.phone}`}
													className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center gap-4"
												>
													<BiPhone className="text-2xl group-hover:scale-110 transition-transform" />
													<span className="text-lg">Telepon Sekarang</span>
												</a>
											) : (
												<button className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-4 cursor-not-allowed">
												<BiPhone className="text-2xl" />
												<span className="text-lg">Telepon</span>
											</button>
											)}

											{/* WhatsApp Button */}
											{finalContactInfo.whatsapp ? (
												<a 
													href={`https://wa.me/${finalContactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan kuliner ${destination.title}`}
													target="_blank"
													rel="noopener noreferrer"
													className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center gap-4"
												>
													<FaWhatsapp className="text-2xl group-hover:scale-110 transition-transform" />
													<span className="text-lg">WhatsApp</span>
												</a>
											) : (
												<button className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-4 cursor-not-allowed">
												<FaWhatsapp className="text-2xl" />
												<span className="text-lg">WhatsApp</span>
											</button>
											)}
										</div>
									</div>

									{/* Enhanced Menu Info Card */}
									<div className="mb-8">
										<div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
											{/* Background Pattern */}
											<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
											<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
											<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
											
											<div className="relative">
												<div className="flex items-center justify-center gap-6 mb-6">
													<div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
														<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
														</svg>
													</div>
													<div className="text-center">
														<h3 className="text-3xl font-bold mb-2">Menu Tersedia</h3>
														<p className="text-orange-100 text-lg">Menu lengkap ada di bawah halaman ini</p>
													</div>
												</div>
												
												{/* Enhanced Menu Preview Cards */}
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
													<div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
														<div className="w-12 h-12 bg-yellow-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
															<svg className="w-6 h-6 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														</div>
														<p className="text-sm font-semibold">Siap Saji</p>
													</div>
													
													<div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
														<div className="w-12 h-12 bg-green-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
															<svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														</div>
														<p className="text-sm font-semibold">Halal</p>
													</div>
													
													<div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
														<div className="w-12 h-12 bg-blue-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
															<svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
															</svg>
														</div>
														<p className="text-sm font-semibold">Fresh</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Enhanced Jam Operasional */}
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
										<div className="flex items-center gap-4">
											<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
												<BiTime className="text-white text-xl" />
											</div>
											<div>
												<h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Jam Operasional</h4>
												<p className="text-gray-600 dark:text-gray-300 text-lg">{destination.opening_hours || 'Senin - Minggu: 08:00 - 17:00 WIB'}</p>
												<p className="text-xs text-gray-500 dark:text-gray-400 mt-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">*Jam operasional dapat berubah sesuai kondisi</p>
											</div>
										</div>
									</div>

									{/* Enhanced Footer Tags */}
									<div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
										<div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded-full text-sm font-semibold border border-yellow-200 dark:border-yellow-700 shadow-lg">
											<BiStar 
												className="text-lg animate-pulse" 
												style={{
													animationDuration: '3s',
													animationIterationCount: 'infinite'
												}}
											/>
											<span>Terpercaya</span>
										</div>
										<div className="flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-700 shadow-lg">
											<BiTime className="text-lg" />
											<span>Respon Cepat</span>
										</div>
										<div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 px-4 py-3 rounded-full text-sm font-semibold border border-green-200 dark:border-green-700 shadow-lg">
											<BiMap className="text-lg" />
											<span>Lokal</span>
										</div>
									</div>
								</div>
							</div>

							{/* Enhanced Informasi Kontak Section */}
							<div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
								<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl"></div>
								<div className="relative">
									<div className="flex items-center gap-4 mb-8">
										<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
											<BiPhone className="text-white text-xl" />
										</div>
										<div>
											<h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Informasi Kontak</h3>
											<div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Enhanced Telepon Card */}
										<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
														<BiPhone className="text-white text-xl" />
													</div>
													<div>
														<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Telepon</p>
														<p className="font-bold text-gray-900 dark:text-white text-lg">{finalContactInfo.phone || '+62 812-3456-7890'}</p>
													</div>
												</div>
												{finalContactInfo.phone ? (
													<a 
														href={`tel:${finalContactInfo.phone}`}
														className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
													>
														<BiPhone className="text-white text-lg" />
													</a>
												) : (
													<button className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center cursor-not-allowed shadow-lg">
														<BiPhone className="text-white text-lg" />
													</button>
												)}
											</div>
										</div>

										{/* Enhanced WhatsApp Card */}
										<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
														<FaWhatsapp className="text-white text-xl" />
													</div>
													<div>
														<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">WhatsApp</p>
														<p className="font-bold text-gray-900 dark:text-white text-lg">{finalContactInfo.whatsapp || '+62 812-3456-7890'}</p>
													</div>
												</div>
												{finalContactInfo.whatsapp ? (
													<a 
														href={`https://wa.me/${finalContactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan kuliner ${destination.title}`}
														target="_blank"
														rel="noopener noreferrer"
														className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
													>
														<FaWhatsapp className="text-white text-lg" />
													</a>
												) : (
													<button className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center cursor-not-allowed shadow-lg">
														<FaWhatsapp className="text-white text-lg" />
													</button>
												)}
											</div>
										</div>
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



						</div>

						{/* Enhanced Right Column - Info & Actions */}
						<div className="space-y-8">
							{/* Enhanced Contact & Info Card */}
							<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
								<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-red-500/5 rounded-3xl"></div>
								<div className="relative">
									<div className="flex items-center gap-4 mb-8">
										<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
											<BiPhone className="text-white text-xl" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Informasi Lengkap</h3>
											<div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
										</div>
									</div>
									
									<div className="space-y-6">
										{/* Enhanced Phone */}
										{finalContactInfo.phone && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<BiPhone className="text-white text-lg" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Telepon</p>
													<p className="font-bold text-gray-900 dark:text-white text-lg">{finalContactInfo.phone}</p>
												</div>
											</div>
										)}

										{/* Enhanced WhatsApp */}
										{finalContactInfo.whatsapp && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<FaWhatsapp className="text-white text-lg" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">WhatsApp</p>
													<p className="font-bold text-gray-900 dark:text-white text-lg">{finalContactInfo.whatsapp}</p>
												</div>
											</div>
										)}

										{/* Enhanced Website */}
										{finalContactInfo.website && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<FaGlobe className="text-white text-lg" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Website</p>
													<a 
														href={finalContactInfo.website} 
														target="_blank" 
														rel="noopener noreferrer"
														className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-lg"
														title={finalContactInfo.website}
													>
														{shortenUrl(finalContactInfo.website)}
													</a>
												</div>
											</div>
										)}

										{/* Enhanced Cuisine Type */}
										{destination.cuisine && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jenis Masakan</p>
													<p className="font-bold text-gray-900 dark:text-white text-lg">{destination.cuisine}</p>
												</div>
											</div>
										)}

										{/* Enhanced Address */}
										{destination.address && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<BiMap className="text-white text-lg" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Alamat</p>
													<p className="font-bold text-gray-900 dark:text-white text-lg">{destination.address}</p>
												</div>
											</div>
										)}

										{/* Enhanced Opening Hours */}
										{destination.opening_hours && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<BiTime className="text-white text-lg" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jam Buka</p>
													<p className="font-bold text-gray-900 dark:text-white text-lg">{destination.opening_hours}</p>
												</div>
											</div>
										)}

										{/* Enhanced Price Range */}
										{destination.price_range && (
											<div className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
													<BiMoney className="text-white text-lg" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Kisaran Harga</p>
													<p className="font-bold text-gray-900 dark:text-white text-lg">{destination.price_range}</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Enhanced Rating & Reviews Section */}
							<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
								<div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 rounded-3xl"></div>
								<div className="relative">
									<div className="flex items-center gap-4 mb-6">
										<div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
											<BiStar className="text-white text-xl" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Rating & Ulasan</h3>
											<div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
										</div>
									</div>
									<RatingReviews 
										rating={parseFloat(destination.rating) || 4.5}
										reviewCount={0}
										onWriteReview={(reviewData) => {
											// Handle review submission
											console.log('Review submitted:', reviewData);
										}}
										storageKey={`reviews:kuliner:${destination?.id || params?.id || 'unknown'}`}
									/>
								</div>
							</div>

							{/* Enhanced Features Section */}
							{parsedFeatures && parsedFeatures.length > 0 && (
								<div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
									<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-red-500/5 rounded-3xl"></div>
									<div className="relative">
										<div className="flex items-center gap-4 mb-8">
											<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
												<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
												</svg>
											</div>
											<div>
												<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Fitur & Fasilitas</h3>
												<div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
											</div>
										</div>
										
										<div className="space-y-4">
											{parsedFeatures.map((feature, index) => (
												<div key={index} className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
													<div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full group-hover/item:scale-125 transition-transform"></div>
													<span className="text-lg text-purple-700 dark:text-purple-300 font-medium">{feature}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							)}

							{/* Enhanced Quick Actions */}
							<div className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-2xl">
								{/* Background Pattern */}
								<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
								<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
								
								<div className="relative">
									<div className="flex items-center justify-center gap-4 mb-8">
										<div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
											<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
										</div>
										<div>
											<h3 className="text-3xl font-bold mb-2">Aksi Cepat</h3>
											<p className="text-orange-100 text-lg">Pilih aksi yang ingin Anda lakukan</p>
										</div>
									</div>
									
									{/* Enhanced Main Action Buttons - 3x2 Grid Layout */}
									<div className="grid grid-cols-3 gap-4 mb-6">
										{/* Telepon Button */}
										{finalContactInfo.phone ? (
											<a 
												href={`tel:${finalContactInfo.phone}`}
												className="group/btn flex flex-col items-center justify-center gap-3 bg-amber-600/90 hover:bg-amber-500 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
											>
												<BiPhone className="text-3xl group-hover/btn:scale-110 transition-transform" />
												<span className="text-sm font-bold">Telepon</span>
											</a>
										) : (
											<button className="flex flex-col items-center justify-center gap-3 bg-amber-600/90 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 shadow-xl cursor-not-allowed">
												<BiPhone className="text-3xl" />
												<span className="text-sm font-bold">Telepon</span>
											</button>
										)}
										
										{/* WhatsApp Button */}
										{finalContactInfo.whatsapp ? (
											<a 
												href={`https://wa.me/${finalContactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan kuliner ${destination.title}`}
												target="_blank"
												rel="noopener noreferrer"
												className="group/btn flex flex-col items-center justify-center gap-3 bg-green-600/90 hover:bg-green-500 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
											>
												<FaWhatsapp className="text-3xl group-hover/btn:scale-110 transition-transform" />
												<span className="text-sm font-bold">WhatsApp</span>
											</a>
										) : (
											<button className="flex flex-col items-center justify-center gap-3 bg-green-600/90 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 shadow-xl cursor-not-allowed">
												<FaWhatsapp className="text-3xl" />
												<span className="text-sm font-bold">WhatsApp</span>
											</button>
										)}
										
										{/* Website Button */}
										{finalContactInfo.website ? (
											<a 
												href={finalContactInfo.website}
												target="_blank"
												rel="noopener noreferrer"
												className="group/btn flex flex-col items-center justify-center gap-3 bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
											>
												<FaGlobe className="text-3xl group-hover/btn:scale-110 transition-transform" />
												<span className="text-sm font-bold">Website</span>
											</a>
										) : (
											<button className="flex flex-col items-center justify-center gap-3 bg-gray-400/90 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 shadow-xl cursor-not-allowed">
												<FaGlobe className="text-3xl" />
												<span className="text-sm font-bold">Website</span>
											</button>
										)}
										
										{/* Arahkan Button */}
										<button className="group/btn flex flex-col items-center justify-center gap-3 bg-purple-600/90 hover:bg-purple-500 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
											<BiMap className="text-3xl group-hover/btn:scale-110 transition-transform" />
											<span className="text-sm font-bold">Arahkan</span>
										</button>
										
										{/* Bagikan Button */}
										<button className="group/btn flex flex-col items-center justify-center gap-3 bg-red-600/90 hover:bg-red-500 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
											<BiShare className="text-3xl group-hover/btn:scale-110 transition-transform" />
											<span className="text-sm font-bold">Bagikan</span>
										</button>
										
										{/* Favorit Button */}
										<button className="group/btn flex flex-col items-center justify-center gap-3 bg-pink-600/90 hover:bg-pink-500 text-white font-semibold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
											<BiHeart className="text-3xl group-hover/btn:scale-110 transition-transform" />
											<span className="text-sm font-bold">Favorit</span>
										</button>
									</div>

									{/* Additional Info */}
									<div className="text-orange-100 text-lg font-medium">
										<p>Pilih aksi yang ingin Anda lakukan</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			

			{/* Menu Section */}
			<SimpleMenuSection 
				destinationTitle={destination.title} 
				destinationId={id}
				destinationSlug={destination.slug || ''}
			/>
			
			{/* Floating Cart Button */}
			<FloatingCartButtonWrapper />
		</div>
	);
};

export default KulinerContent;
