'use client';

import { useMemo } from 'react';
import useSouvenirData from '@/hooks/useSouvenirData';
import SouvenirList from './SouvenirList';
import LoadingSpinner from './LoadingSpinner';

const OlehOlehMenuSection = ({ destinationTitle = 'Dolan Banyumas', destinationId, destinationSlug }) => {
  const { souvenirs, isLoading, error } = useSouvenirData(destinationId, destinationSlug);

  const title = useMemo(() => 'Oleh-Oleh', []);

  // Tampilan loading
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Memuat oleh-oleh dari {destinationTitle}...</p>
          </div>
          <LoadingSpinner message="Memuat oleh-oleh..." />
        </div>
      </div>
    );
  }

  // Tampilan error
  if (error) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                <p className="font-medium">Gagal memuat oleh-oleh</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan utama dengan daftar oleh-oleh
  return <SouvenirList items={souvenirs} destinationTitle={destinationTitle} />;
};

export default OlehOlehMenuSection;
