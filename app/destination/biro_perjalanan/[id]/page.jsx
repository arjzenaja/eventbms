"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BiMap, BiArrowBack } from "react-icons/bi";
import DetailSkeleton from "@/components/DetailSkeleton";
import ErrorState from "@/components/ErrorState";
import DestinationInfo from "@/components/DestinationInfo";
import DestinationGallery from "@/components/DestinationGallery";
import KeyboardNavigation from "@/components/KeyboardNavigation";

const BiroPerjalananDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestination = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/biro_perjalanan/${id}`);
      if (!res.ok) {
        throw new Error("Gagal memuat data biro perjalanan");
      }
      const data = await res.json();
      setDestination(data.biro_perjalanan || data.destination || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !destination) {
    return (
      <ErrorState
        title="Biro Perjalanan Tidak Ditemukan"
        message="Biro perjalanan yang Anda cari tidak ditemukan atau telah dihapus."
        onRetry={fetchDestination}
        onBack={handleBack}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-sky-900/20">
      <KeyboardNavigation onBack={handleBack} onRetry={fetchDestination} />
      
      <div className="container mx-auto py-8 sm:py-12">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Header */}
          <header className="mb-8">
            <button 
              onClick={handleBack}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 flex items-center gap-2 transition-colors duration-200 font-medium"
              aria-label="Kembali ke halaman destinasi"
            >
              <BiArrowBack className="text-xl" />
              Kembali ke Destinasi
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {destination.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
              <BiMap className="text-xl" aria-hidden="true" />
              <span>{destination.location}</span>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <DestinationGallery 
              images={[destination.img_lg, destination.img_sm]} 
              title={destination.title} 
            />

            {/* Info Section */}
            <DestinationInfo 
              destination={destination} 
              theme="purple" 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default BiroPerjalananDetail;
