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
import RatingReviews from "../../../../components/RatingReviews";
import LoadingToast from "../../../../components/LoadingToast";
import ExploreNotification from "../../../../components/ExploreNotification";

const BiroPerjalananDetail = () => {
	const { id } = useParams();
	const [destination, setDestination] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mapDistance, setMapDistance] = useState(null);
	const [isLiked, setIsLiked] = useState(false);
	const [showLoadingToast, setShowLoadingToast] = useState(false);
	const [showExploreNotification, setShowExploreNotification] = useState(false);
	const [notificationType, setNotificationType] = useState('loading');

	useEffect(() => {
		const fetchDestination = async () => {
		try {
			setIsLoading(true);
			setShowLoadingToast(true);
			setShowExploreNotification(true);
			setNotificationType('loading');
			const res = await fetch(`/api/biro_perjalanan/${id}`);
			if (!res.ok) {
				throw new Error("Failed to fetch destination");
			}
			const data = await res.json();
			setDestination(data.biro_perjalanan || data.destination || data);
			
			// Show success notification
			setNotificationType('success');
			setTimeout(() => {
				setShowExploreNotification(false);
			}, 2000);
		} catch (err) {
			setError(err.message);
			setNotificationType('error');
			setTimeout(() => {
				setShowExploreNotification(false);
			}, 3000);
		} finally {
			setIsLoading(false);
			setShowLoadingToast(false);
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

	// Handle share functionality
	const handleShare = async () => {
		const shareData = {
			title: destination.title,
			text: `Lihat biro perjalanan ${destination.title} di Dolan Banyumas`,
			url: window.location.href
		};

		try {
			if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
				await navigator.share(shareData);
			} else {
				// Fallback: copy to clipboard
				await navigator.clipboard.writeText(window.location.href);
				alert('Link berhasil disalin ke clipboard!');
			}
		} catch (error) {
			console.error('Error sharing:', error);
			// Fallback: copy to clipboard
			try {
				await navigator.clipboard.writeText(window.location.href);
				alert('Link berhasil disalin ke clipboard!');
			} catch (clipboardError) {
				console.error('Error copying to clipboard:', clipboardError);
				alert('Gagal membagikan. Silakan salin URL secara manual.');
			}
		}
	};

	// Prepare gallery images
	const galleryImages = [
		destination.img_lg,
		destination.img_sm,
		...(destination.gallery || [])
	].filter(Boolean);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Enhanced Hero Section */}
			<div className="relative pt-24 pb-16 overflow-hidden">
				{/* Enhanced Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-rose-500/30"></div>
				<div className="absolute inset-0 bg-[url('/pattern_bg.png')] opacity-10"></div>
				
				{/* Floating Elements */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-purple-300/20 rounded-full blur-xl animate-bounce"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-pink-300/20 rounded-full blur-xl animate-bounce delay-1000"></div>
				<div className="absolute bottom-20 left-1/4 w-12 h-12 bg-rose-300/20 rounded-full blur-xl animate-bounce delay-2000"></div>
				<div className="absolute top-60 right-1/3 w-14 h-14 bg-violet-300/20 rounded-full blur-xl animate-bounce delay-3000"></div>
				
				<div className="relative container mx-auto px-4">
					{/* Enhanced Back Button */}
					<button 
						onClick={() => window.history.back()} 
						className="group mt-16 mb-8 inline-flex items-center gap-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 transform hover:-translate-x-1"
					>
						<div className="w-12 h-12 bg-purple-500/30 group-hover:bg-purple-500/40 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl">
							<BiArrowBack className="text-2xl group-hover:scale-110 transition-transform" />
						</div>
						<span className="font-bold text-lg">Kembali ke Dolan Banyumas</span>
					</button>

					{/* Enhanced Main Header */}
					<div className="max-w-5xl mx-auto text-center mb-12">
						{/* Enhanced Type Badge */}
						<div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-bold mb-6 shadow-2xl">
							<BiStar className="text-2xl" style={{ animationDuration: '3s' }} />
							<span>Biro Perjalanan</span>
						</div>
						
						{/* Enhanced Title */}
						<h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 mb-6 leading-tight">
							{destination.title}
						</h1>
						
						{/* Enhanced Location & Recommendation */}
						<div className="flex items-center justify-center gap-6 text-gray-700 dark:text-gray-300 mb-6">
							<div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-purple-200 dark:border-purple-700">
								<BiMap className="text-2xl text-purple-500" />
								<span className="font-bold text-lg">{destination.location}</span>
							</div>
							{destination.recommended && (
								<div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-2xl animate-pulse">
									<BiStar className="text-2xl" style={{ animationDuration: '3s' }} />
									<span>Direkomendasikan</span>
								</div>
							)}
							{destination.rating && (
								<div className="flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-2xl">
									<BiStar className="text-2xl" />
									<span>{destination.rating}/5</span>
								</div>
							)}
						</div>

						{/* Enhanced Action Buttons */}
						<div className="flex items-center justify-center gap-6">
							<button 
								onClick={() => setIsLiked(!isLiked)}
								className={`group flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${
									isLiked 
										? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl' 
										: 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-700'
								}`}
							>
								<BiHeart className={`text-2xl group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
								<span className="font-bold text-lg">{isLiked ? 'Disukai' : 'Suka'}</span>
							</button>
							
							<button 
								onClick={handleShare}
								className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 transform hover:scale-105 shadow-xl backdrop-blur-sm border border-blue-200 dark:border-blue-700"
							>
								<BiShare className="text-2xl group-hover:scale-110 transition-transform" />
								<span className="font-bold text-lg">Bagikan</span>
							</button>
						</div>
						
						{/* Enhanced Description */}
						<p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium mt-8">
							{destination.description}
						</p>
					</div>
				</div>
			</div>

			{/* Enhanced Main Content */}
			<div className="container mx-auto px-4 pb-16">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
						{/* Left Column - Gallery & Map */}
						<div className="xl:col-span-2 space-y-12">
							{/* Enhanced Photo Gallery */}
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl mb-8 mt-8">
								<PhotoGallery
									images={galleryImages}
									title={destination.title}
								/>
							</div>

							{/* Enhanced Description Section */}
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
										<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<h2 className="text-3xl font-black text-gray-800 dark:text-white">Tentang Biro Perjalanan</h2>
								</div>
								
								<div className="prose prose-lg max-w-none">
									<p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
										{destination.description || destination.short_description || "Deskripsi biro perjalanan tidak tersedia"}
									</p>
								</div>
							</div>

							{/* Pengelola Biro Perjalanan Section */}
							<TravelAgencyManager destination={destination} contactInfo={contactInfo} />

							{/* Enhanced Map Section */}
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
										<BiMap className="text-white text-2xl" />
									</div>
									<h2 className="text-3xl font-black text-gray-800 dark:text-white">Lokasi</h2>
								</div>
								<ErrorBoundary>
									<SmartMap destination={destination} onDistanceCalculated={setMapDistance} />
								</ErrorBoundary>
							</div>

						{/* Enhanced Distance & Travel Time Section removed by request */}
						</div>

						{/* Enhanced Right Sidebar */}
						<div className="space-y-8">
							{/* Enhanced Price & Contact Card */}
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl mt-8">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
										<BiMoney className="text-white text-2xl" />
									</div>
									<h3 className="text-2xl font-black text-gray-800 dark:text-white">Informasi Biro Perjalanan</h3>
								</div>
								
								{/* Enhanced Price Section */}
								{destination.price_range && (
									<div className="mb-8">
										<div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white text-center shadow-2xl">
											<div className="text-lg opacity-90 mb-2 font-medium">Kisaran Harga</div>
											<div className="text-3xl font-black">{destination.price_range}</div>
										</div>
									</div>
								)}

								{/* Enhanced Opening Hours */}
								{destination.opening_hours && (
									<div className="mb-8">
										<h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Jam Operasional</h4>
										<div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700">
											<BiTime className="text-2xl text-amber-500" />
											<span className="text-lg text-amber-700 dark:text-amber-300 font-medium">{destination.opening_hours}</span>
										</div>
									</div>
								)}

								{/* Enhanced Contact Section */}
								{contactInfo && Object.keys(contactInfo).length > 0 && (
									<div className="mb-8">
										<h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Kontak</h4>
										<div className="space-y-4">
											{contactInfo.phone && (
												<a 
													href={`tel:${contactInfo.phone}`}
													className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-200 dark:border-blue-700"
												>
													<BiPhone className="text-2xl text-blue-500 group-hover:scale-110 transition-transform" />
													<span className="text-lg text-blue-700 dark:text-blue-300 font-medium">{contactInfo.phone}</span>
												</a>
											)}
											
											{contactInfo.whatsapp && (
												<a 
													href={`https://wa.me/${cleanPhoneNumber(contactInfo.whatsapp)}?text=Halo, saya tertarik dengan biro perjalanan ${destination.title}`}
													target="_blank"
													rel="noopener noreferrer"
													className="group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-green-200 dark:border-green-700"
												>
													<FaWhatsapp className="text-2xl text-green-500 group-hover:scale-110 transition-transform" />
													<span className="text-lg text-green-700 dark:text-green-300 font-medium">WhatsApp</span>
												</a>
											)}
											
											{contactInfo.instagram && (
												<a 
													href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
													target="_blank"
													rel="noopener noreferrer"
													className="group flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/50 dark:hover:to-rose-900/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-pink-200 dark:border-pink-700"
												>
													<FaInstagram className="text-2xl text-pink-500 group-hover:scale-110 transition-transform" />
													<span className="text-lg text-pink-700 dark:text-pink-300 font-medium">Instagram</span>
												</a>
											)}
											
											{contactInfo.website && (
												<a 
													href={contactInfo.website}
													target="_blank"
													rel="noopener noreferrer"
													className="group flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-900/50 dark:hover:to-violet-900/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-purple-200 dark:border-purple-700"
												>
													<FaGlobe className="text-2xl text-purple-500 group-hover:scale-110 transition-transform" />
													<span className="text-lg text-purple-700 dark:text-purple-300 font-medium">Website</span>
												</a>
											)}
										</div>
									</div>
								)}

								{/* Enhanced Address Section */}
								{destination.address && (
									<div className="mb-8">
										<h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Alamat</h4>
										<div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl border border-gray-200 dark:border-gray-600">
											<BiMap className="text-2xl text-purple-500 mt-1 flex-shrink-0" />
											<span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{destination.address}</span>
										</div>
									</div>
								)}

								{/* Enhanced Created Date */}
								{destination.created_at && (
									<div>
										<h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Ditambahkan</h4>
										<div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700">
											<BiTime className="text-2xl text-amber-500" />
											<span className="text-lg text-amber-700 dark:text-amber-300 font-medium">
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

							{/* Enhanced Rating & Reviews Section */}
							<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
										<BiStar className="text-white text-2xl" />
									</div>
									<h3 className="text-2xl font-black text-gray-800 dark:text-white">Rating & Ulasan</h3>
								</div>
								<RatingReviews 
									rating={parseFloat(destination.rating) || 4.5}
									reviewCount={0}
									onWriteReview={(reviewData) => {
										// Handle review submission
										console.log('Review submitted:', reviewData);
									}}
									storageKey={`reviews:biro-perjalanan:${destination?.id || params?.id || 'unknown'}`}
								/>
							</div>

							{/* Enhanced Features Section */}
							{destination.features && destination.features.length > 0 && (
								<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
									<div className="flex items-center gap-4 mb-6">
										<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
											<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
											</svg>
										</div>
										<h3 className="text-2xl font-black text-gray-800 dark:text-white">Fitur & Fasilitas</h3>
									</div>
									
									<div className="space-y-4">
										{destination.features.map((feature, index) => (
											<div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
												<span className="text-lg text-purple-700 dark:text-purple-300 font-medium">{feature}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Enhanced Services Section */}
							{destination.services && destination.services.length > 0 && (
								<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
									<div className="flex items-center gap-4 mb-6">
										<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
											<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
											</svg>
										</div>
										<h3 className="text-2xl font-black text-gray-800 dark:text-white">Layanan</h3>
									</div>
									
									<div className="space-y-4">
										{destination.services.map((service, index) => (
											<div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
												<div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
												<span className="text-lg text-blue-700 dark:text-blue-300 font-medium">{service}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Enhanced Quick Actions */}
							<div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
								<h3 className="text-2xl font-black mb-6">Aksi Cepat</h3>
								
								{/* Enhanced Main Action Buttons - Horizontal Layout */}
								<div className="grid grid-cols-4 gap-4 mb-6">
									{/* Enhanced Telepon Button */}
									{contactInfo.phone ? (
										<a 
											href={`tel:${contactInfo.phone}`}
											className="group flex flex-col items-center justify-center gap-3 bg-amber-600/80 hover:bg-amber-500 text-white font-bold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
										>
											<BiPhone className="text-3xl group-hover:scale-110 transition-transform" />
											<span className="text-sm">Telepon</span>
										</a>
									) : (
										<button className="group flex flex-col items-center justify-center gap-3 bg-amber-600/80 hover:bg-amber-500 text-white font-bold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
											<BiPhone className="text-3xl group-hover:scale-110 transition-transform" />
											<span className="text-sm">Telepon</span>
										</button>
									)}
									
									{/* Enhanced WhatsApp Button */}
									{contactInfo.whatsapp ? (
										<a 
											href={`https://wa.me/${cleanPhoneNumber(contactInfo.whatsapp)}?text=Halo, saya tertarik dengan biro perjalanan ${destination.title}`}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex flex-col items-center justify-center gap-3 bg-green-600/80 hover:bg-green-500 text-white font-bold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
										>
											<FaWhatsapp className="text-3xl group-hover:scale-110 transition-transform" />
											<span className="text-sm">WhatsApp</span>
										</a>
									) : (
										<button className="group flex flex-col items-center justify-center gap-3 bg-green-600/80 hover:bg-green-500 text-white font-bold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
											<FaWhatsapp className="text-3xl group-hover:scale-110 transition-transform" />
											<span className="text-sm">WhatsApp</span>
										</button>
									)}
									
									{/* Enhanced Arahkan Button */}
									<button className="group flex flex-col items-center justify-center gap-3 bg-purple-600/80 hover:bg-purple-500 text-white font-bold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
										<BiMap className="text-3xl group-hover:scale-110 transition-transform" />
										<span className="text-sm">Arahkan</span>
									</button>
									
									{/* Enhanced Bagikan Button */}
									<button 
										onClick={handleShare}
										className="group flex flex-col items-center justify-center gap-3 bg-red-600/80 hover:bg-red-500 text-white font-bold py-4 px-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
									>
										<BiShare className="text-3xl group-hover:scale-110 transition-transform" />
										<span className="text-sm">Bagikan</span>
									</button>
								</div>
								
								{/* Enhanced Additional Info */}
								<div className="text-purple-100 text-lg font-medium">
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
			
			{/* Loading Toast */}
			<LoadingToast 
				show={showLoadingToast}
				title="Memuat konten biro perjalanan..."
				message="Mohon tunggu sebentar"
				onClose={() => setShowLoadingToast(false)}
			/>
			
			{/* Explore Notification */}
			<ExploreNotification 
				show={showExploreNotification}
				title={notificationType === 'loading' ? 'Memuat Konten Biro Perjalanan...' : 
				       notificationType === 'success' ? 'Konten Berhasil Dimuat!' : 
				       'Gagal Memuat Konten'}
				message={notificationType === 'loading' ? 'Mohon tunggu sebentar' : 
				         notificationType === 'success' ? 'Informasi biro perjalanan telah siap untuk dilihat' : 
				         'Terjadi kesalahan saat memuat konten'}
				type={notificationType}
				onClose={() => setShowExploreNotification(false)}
				onRefresh={() => window.location.reload()}
				autoClose={notificationType !== 'loading'}
				autoCloseDelay={notificationType === 'success' ? 2000 : 3000}
			/>
		</div>
	);
};

export default BiroPerjalananDetail;
