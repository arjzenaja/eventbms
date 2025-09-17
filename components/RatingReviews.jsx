"use client";

import { useState, useEffect } from "react";
import { BiStar } from "react-icons/bi";
import ReviewModal from "./ReviewModal";
import ReviewList from "./ReviewList";
import RatingBreakdown from "./RatingBreakdown";
import SuccessToast from "./SuccessToast";

const RatingReviews = ({ 
  rating = 4.5, 
  reviewCount = 0, 
  reviews = [],
  onWriteReview,
  className = "",
  showWriteButton = true,
  storageKey,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState([
    ...reviews,
    // Sample reviews for demonstration
    {
      id: 1,
      name: "Ahmad Rizki",
      rating: 5,
      review: "Tempat yang sangat bagus! Pelayanan ramah dan fasilitas lengkap. Sangat recommended untuk liburan keluarga.",
      date: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      rating: 4,
      review: "Pengalaman yang menyenangkan. Harga terjangkau dan lokasi strategis. Hanya saja parkir agak terbatas.",
      date: "2024-01-10T14:20:00Z"
    },
    {
      id: 3,
      name: "Budi Santoso",
      rating: 5,
      review: "Excellent! Tempatnya bersih, staff friendly, dan makanan enak. Pasti akan kembali lagi.",
      date: "2024-01-08T09:15:00Z"
    },
    {
      id: 4,
      name: "Maya Sari",
      rating: 3,
      review: "Lokasi bagus tapi fasilitas perlu diperbaiki. Toilet kurang bersih dan AC tidak dingin.",
      date: "2024-01-05T16:45:00Z"
    },
    {
      id: 5,
      name: "Rudi Hermawan",
      rating: 4,
      review: "Overall bagus, harga reasonable. Tapi perlu perbaikan di area parkir dan keamanan.",
      date: "2024-01-03T11:20:00Z"
    },
    {
      id: 6,
      name: "Dewi Kartika",
      rating: 5,
      review: "Perfect! Semua sesuai ekspektasi. Staff sangat membantu dan responsif. Highly recommended!",
      date: "2024-01-01T13:30:00Z"
    }
  ]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1
  const [searchQuery, setSearchQuery] = useState('');

  // Derive a stable storage key per page if not provided
  const getStorageKey = () => {
    if (storageKey) return storageKey;
    if (typeof window !== 'undefined') {
      return `reviews:${window.location.pathname}`;
    }
    return 'reviews:default';
  };

  // Load saved reviews on mount
  useEffect(() => {
    try {
      const key = getStorageKey();
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLocalReviews((prev) => {
            // Merge and de-duplicate by content+date
            const combined = [...parsed, ...prev];
            const seen = new Set();
            return combined.filter((r) => {
              const sig = `${r.name || ''}|${r.rating}|${r.review}|${r.date}`;
              if (seen.has(sig)) return false;
              seen.add(sig);
              return true;
            });
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load saved reviews', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save reviews whenever they change
  useEffect(() => {
    try {
      const key = getStorageKey();
      if (typeof window !== 'undefined') {
        // Only persist user-submitted reviews (exclude seeded ones by simple heuristic: presence of id)
        const toSave = localReviews.filter((r) => !r.id || typeof r.id !== 'number');
        window.localStorage.setItem(key, JSON.stringify(toSave));
      }
    } catch (e) {
      console.warn('Failed to persist reviews', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localReviews]);

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Sangat Baik";
    if (rating >= 4.0) return "Baik";
    if (rating >= 3.0) return "Cukup";
    if (rating >= 2.0) return "Kurang";
    return "Buruk";
  };

  const getFilteredAndSortedReviews = () => {
    // Filter reviews by rating
    let filteredReviews = localReviews;
    if (filterRating !== 'all') {
      filteredReviews = localReviews.filter(review => review.rating === parseInt(filterRating));
    }
    
    // Filter reviews by search query
    if (searchQuery.trim()) {
      filteredReviews = filteredReviews.filter(review => 
        review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Show limited or all reviews
    const reviewsToShow = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);
    
    // Sort reviews
    switch (sortBy) {
      case 'newest':
        return [...reviewsToShow].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return [...reviewsToShow].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return [...reviewsToShow].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviewsToShow].sort((a, b) => a.rating - b.rating);
      default:
        return reviewsToShow;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <BiStar 
            key={i} 
            className="w-5 h-5 text-yellow-400 fill-current" 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <BiStar className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <BiStar className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <BiStar 
            key={i} 
            className="w-5 h-5 text-gray-300" 
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className={`bg-white/85 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
          <BiStar className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Rating & Ulasan</h3>
      </div>

      {/* Rating Summary */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 mb-6 border border-yellow-200 dark:border-yellow-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Rating Number */}
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              {rating.toFixed(1)}
            </div>
            
            {/* Stars */}
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
          </div>
          
          <div className="text-right">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Berdasarkan {localReviews.length} ulasan
        </div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {getRatingText(rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {showWriteButton && (
        <button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Tulis Ulasan
        </button>
      )}

      {/* Rating Breakdown */}
      {localReviews.length > 0 && (
        <div className="mt-6">
          <RatingBreakdown reviews={localReviews} />
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-6">
        {/* Filter and Sort Options */}
        {localReviews.length > 0 && (
          <div className="mb-4 space-y-3">
            {/* Search Reviews */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari ulasan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Filter by Rating */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Semua Rating</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Bintang</option>
                <option value="4">⭐⭐⭐⭐ 4 Bintang</option>
                <option value="3">⭐⭐⭐ 3 Bintang</option>
                <option value="2">⭐⭐ 2 Bintang</option>
                <option value="1">⭐ 1 Bintang</option>
              </select>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="highest">Rating Tertinggi</option>
                <option value="lowest">Rating Terendah</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        {localReviews.length > 0 && (
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {getFilteredAndSortedReviews().length} dari {localReviews.length} ulasan
            {(searchQuery.trim() || filterRating !== 'all') && (
              <span className="ml-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRating('all');
                  }}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Reset Filter
                </button>
              </span>
            )}
          </div>
        )}
        
        {/* Show message if no reviews after filtering */}
        {localReviews.length > 0 && getFilteredAndSortedReviews().length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-600 dark:text-gray-400">
              <p className="text-lg font-medium mb-1">Tidak ada ulasan yang sesuai filter</p>
              <p className="text-sm">Coba ubah filter atau reset untuk melihat semua ulasan</p>
            </div>
          </div>
        )}
        
        <ReviewList
          reviews={getFilteredAndSortedReviews()}
          onMarkHelpful={(idx) => {
            setLocalReviews((prev) => {
              const copy = [...prev];
              const review = copy[idx];
              if (!review) return prev;
              const count = typeof review.helpfulCount === 'number' ? review.helpfulCount + 1 : 1;
              copy[idx] = { ...review, helpfulCount: count };
              return copy;
            });
          }}
          onAddReply={(idx, text) => {
            setLocalReviews((prev) => {
              const copy = [...prev];
              const review = copy[idx];
              if (!review) return prev;
              const replies = Array.isArray(review.replies) ? review.replies.slice() : [];
              replies.push({ text, date: new Date().toISOString(), name: 'Anda' });
              copy[idx] = { ...review, replies };
              return copy;
            });
          }}
        />
        
        {/* Debug Info - Remove this after fixing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
            <div>Total Reviews: {localReviews.length}</div>
            <div>Filtered Reviews: {getFilteredAndSortedReviews().length}</div>
            <div>Show All: {showAllReviews ? 'Yes' : 'No'}</div>
            <div>Filter Rating: {filterRating}</div>
            <div>Search Query: "{searchQuery}"</div>
          </div>
        )}
        
        {/* Show More/Less Button */}
        {localReviews.length > 3 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              {showAllReviews ? 'Lihat Lebih Sedikit' : `Lihat Semua ${localReviews.length} Ulasan`}
            </button>
          </div>
        )}
        
        {/* Force show reviews if none are showing */}
        {localReviews.length > 0 && getFilteredAndSortedReviews().length === 0 && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterRating('all');
                setShowAllReviews(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Tampilkan Semua Ulasan
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(reviewData) => {
          // Handle review submission
          console.log('Review submitted:', reviewData);
          
          // Add new review to local state
          setLocalReviews(prev => [reviewData, ...prev]);
          
          // Show success toast
          setShowSuccessToast(true);
          
          if (onWriteReview) onWriteReview(reviewData);
        }}
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message="Terima kasih! Ulasan Anda telah berhasil dikirim."
      />
    </div>
  );
};

export default RatingReviews;
