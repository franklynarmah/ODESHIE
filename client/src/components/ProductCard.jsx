import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function StarRating({ rating, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'text-odeshie-gold' : 'text-gray-300'}>
          {star <= Math.round(rating) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlist(w => !w);
  };

  const placeholderUrl = `https://via.placeholder.com/400x400/${encodeURIComponent('7B4A2D')}/${encodeURIComponent('FFFFFF')}?text=${encodeURIComponent(product.name)}`;

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden cursor-pointer product-card-hover shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-odeshie-cream dark:bg-gray-800" style={{ paddingBottom: '100%' }}>
        <img
          src={imgError ? placeholderUrl : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new_arrival && (
            <span className="bg-odeshie-dark text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              New
            </span>
          )}
          {product.is_on_sale && product.discount_percent > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              -{product.discount_percent}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 ${
            wishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
          aria-label="Add to wishlist"
        >
          <HeartIcon filled={wishlist} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-colors"
            style={{ backgroundColor: adding ? '#9d7521' : '#C4952A' }}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>

        {product.rating > 0 ? (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.review_count})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <span key={s} className="text-sm text-gray-300">☆</span>)}
            </div>
            <span className="text-xs text-gray-400">No reviews yet</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            GHC {product.price.toFixed(2)}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              GHC {product.original_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
