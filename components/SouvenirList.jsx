'use client';

import React, { useMemo, useState } from 'react';
import { BiSearch, BiFilter } from 'react-icons/bi';
import SouvenirCard from './SouvenirCard';

const SouvenirList = ({ items = [], destinationTitle = 'Oleh-Oleh' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Buat daftar kategori dari data
  const categories = useMemo(() => {
    const map = new Map();
    items.forEach((m) => {
      const c = (m.category || 'Lainnya').toString();
      map.set(c, (map.get(c) || 0) + 1);
    });
    return [
      { id: 'all', name: 'Semua', count: items.length }, 
      ...Array.from(map.entries()).map(([k, v]) => ({ 
        id: k.toLowerCase(), 
        name: k, 
        count: v 
      }))
    ];
  }, [items]);

  // Filter dan urutkan data
  const filtered = useMemo(() => {
    let list = items;
    
    // Filter berdasarkan kategori
    if (activeCategory !== 'all') {
      list = list.filter((m) => (m.category || '').toLowerCase() === activeCategory);
    }
    
    // Filter berdasarkan pencarian
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => 
        m.name.toLowerCase().includes(q) || 
        (m.description || '').toLowerCase().includes(q)
      );
    }
    
    // Urutkan data
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        default:
          return 0;
      }
    });
    return list;
  }, [items, activeCategory, searchQuery, sortBy]);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oleh-Oleh</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Jelajahi berbagai oleh-oleh dari {destinationTitle}. Pilih favorit Anda dan pesan langsung!
            </p>
          </div>

          {/* Bar Pencarian dan Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pencarian */}
              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari oleh-oleh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Filter Kategori */}
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.count})
                  </option>
                ))}
              </select>
              
              {/* Urutkan */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="name">Nama</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="popular">Populer</option>
              </select>
              
              {/* Indikator Filter */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <BiFilter className="text-lg" />
                <span>Filter Aktif</span>
              </div>
            </div>
          </div>

          {/* Grid Produk */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <SouvenirCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pesan Kosong */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tidak ada oleh-oleh</h3>
              <p className="text-gray-600 dark:text-gray-400">Coba ubah kata kunci atau kategori pencarian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SouvenirList;
