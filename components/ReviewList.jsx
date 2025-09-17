"use client";

import { BiStar, BiTime } from "react-icons/bi";

const ReviewList = ({ reviews = [], onMarkHelpful, onAddReply }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <BiStar className="w-16 h-16 text-gray-300 dark:text-gray-600" />
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          <p className="text-lg font-medium mb-1">Belum ada ulasan. Jadilah yang pertama</p>
          <p className="text-sm">memberikan ulasan!</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <BiStar 
          key={i} 
          className={`w-4 h-4 ${
            i < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 dark:text-gray-600'
          }`} 
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {review.name ? review.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {review.name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {review.rating}/5
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <BiTime className="w-4 h-4" />
              {formatDate(review.date)}
            </div>
          </div>

          {/* Review Content */}
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.review}
          </div>

          {/* Review Actions */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => onMarkHelpful && onMarkHelpful(index)}
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m2-13.586A2 2 0 0015.586 4H8.414A2 2 0 006 5.586L3 8.586V18a2 2 0 002 2h8a2 2 0 002-2V8.586L13 5.586z" />
              </svg>
              Berguna {review.helpfulCount ? `(${review.helpfulCount})` : ''}
            </button>
            <details className="group">
              <summary className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer list-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
                Balas
              </summary>
              <div className="mt-3 space-y-3">
                {/* Existing replies */}
                {Array.isArray(review.replies) && review.replies.length > 0 && (
                  <div className="space-y-2">
                    {review.replies.map((rep, i) => (
                      <div key={i} className="ml-8 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">{rep.name || 'Pengguna'}:</span> {rep.text}
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const el = form.elements.namedItem('reply');
                    const input = /** @type {HTMLInputElement} */ (el);
                    const text = (input && input.value ? input.value : '').trim();
                    if (!text) return;
                    onAddReply && onAddReply(index, text);
                    if (input) input.value = '';
                  }}
                  className="flex items-center gap-2 ml-8"
                >
                  <input
                    name="reply"
                    type="text"
                    placeholder="Tulis balasan..."
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button type="submit" className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                    Kirim
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
