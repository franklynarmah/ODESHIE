import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

function StarRating({ rating, size = 'md', interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <span className={
            star <= (interactive ? (hovered || rating) : Math.round(rating))
              ? 'text-odeshie-gold'
              : 'text-gray-300 dark:text-gray-600'
          }>
            {star <= (interactive ? (hovered || rating) : Math.round(rating)) ? '★' : '☆'}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setImgError(false);
    setSelectedImage(0);
    setSelectedColor('');
    setSelectedSize('');
    setQuantity(1);

    Promise.all([
      api.get(`/api/products/${id}`),
      api.get(`/api/reviews/${id}`)
    ])
      .then(([productRes, reviewsRes]) => {
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        if (productRes.data.colors?.length > 0) setSelectedColor(productRes.data.colors[0]);
        if (productRes.data.sizes?.length > 0) setSelectedSize(productRes.data.sizes[0]);

        // Fetch related products
        return api.get(`/api/products?category=${productRes.data.category}&limit=6`);
      })
      .then(relatedRes => {
        setRelated(relatedRes.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 404) navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product, quantity, selectedColor, selectedSize);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reviewForm.rating) {
      setReviewError('Please select a star rating.');
      return;
    }
    try {
      setSubmittingReview(true);
      await api.post('/api/reviews', {
        product_id: parseInt(id),
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewSuccess(true);
      setReviewForm({ rating: 0, comment: '' });
      // Reload reviews
      const reviewsRes = await api.get(`/api/reviews/${id}`);
      setReviews(reviewsRes.data);
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const placeholderUrl = product
    ? `https://via.placeholder.com/600x600/${encodeURIComponent('7B4A2D')}/${encodeURIComponent('FFFFFF')}?text=${encodeURIComponent(product.name)}`
    : '';

  // Multiple mock thumbnails based on main image
  const thumbnails = product ? [
    product.image_url,
    product.image_url + '&sat=-50',
    product.image_url + '&bri=20',
    product.image_url + '&con=30'
  ] : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="skeleton aspect-square rounded-2xl w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-5 pt-4">
            <div className="skeleton h-6 w-1/2 rounded" />
            <div className="skeleton h-10 w-3/4 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-8 w-24 rounded" />
            <div className="skeleton h-24 w-full rounded" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-odeshie-brown transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-odeshie-brown transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-odeshie-cream dark:bg-gray-800 aspect-square">
              <img
                src={imgError ? placeholderUrl : thumbnails[selectedImage] || product.image_url}
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
              {product.is_on_sale && product.discount_percent > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{product.discount_percent}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedImage === i ? 'border-odeshie-brown shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imgError ? placeholderUrl : thumb}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => {}}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-odeshie-brown bg-odeshie-beige px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.is_new_arrival && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-white bg-odeshie-dark px-3 py-1 rounded-full">New</span>
                )}
              </div>

              <h1 className="font-display text-4xl font-semibold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size="lg" />
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {product.rating > 0 ? `${product.rating}/5` : 'No rating'}
              </span>
              <span className="text-gray-400 text-sm">
                ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                GHC {product.price.toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    GHC {product.original_price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                    Save {product.discount_percent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Color:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                        selectedColor === color
                          ? 'border-odeshie-dark bg-odeshie-dark text-white'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-odeshie-brown'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Size:</span>
                  <button className="text-xs text-odeshie-gold hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedSize === size
                          ? 'border-odeshie-dark bg-odeshie-dark text-white'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-odeshie-brown'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-3">Quantity:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 text-gray-900 dark:text-white font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-2.5 text-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.stock} in stock
                </span>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || addedFeedback}
                className={`flex-1 py-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  addedFeedback
                    ? 'bg-green-600 text-white'
                    : 'text-white hover:shadow-xl'
                }`}
                style={{ backgroundColor: addedFeedback ? undefined : (adding ? '#9d7521' : '#C4952A') }}
              >
                {addedFeedback ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Added to Cart!
                  </>
                ) : adding ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button className="p-4 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-400 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              {[
                { icon: '🚚', label: 'Free Shipping', sub: 'On orders over GHC 300' },
                { icon: '↩', label: 'Easy Returns', sub: '30-day return policy' },
                { icon: '🔒', label: 'Secure Payment', sub: 'SSL encrypted checkout' }
              ].map((badge, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{badge.label}</div>
                  <div className="text-xs text-gray-400">{badge.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { key: 'details', label: 'Product Details' },
              { key: 'reviews', label: `Ratings & Reviews (${reviews.length})` },
              { key: 'faqs', label: 'FAQs' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-none px-6 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-odeshie-dark text-odeshie-dark dark:border-odeshie-gold dark:text-odeshie-gold'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-16 max-w-4xl">
          {activeTab === 'details' && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Stock', value: `${product.stock} available` },
                  { label: 'Colors', value: product.colors?.join(', ') || 'See options above' },
                  { label: 'Sizes', value: product.sizes?.join(', ') || 'See options above' }
                ].map((item, i) => (
                  <div key={i} className="bg-odeshie-cream dark:bg-gray-900 rounded-xl p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-8 p-6 bg-odeshie-cream dark:bg-gray-900 rounded-2xl">
                  <div className="text-center">
                    <div className="font-display text-5xl font-bold text-gray-900 dark:text-white">
                      {product.rating}
                    </div>
                    <StarRating rating={product.rating} size="md" />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {product.review_count} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-3">{star}</span>
                          <span className="text-odeshie-gold text-sm">★</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: '#C4952A' }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write review */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                {!user && (
                  <p className="text-sm text-gray-500 mb-4">
                    Please{' '}
                    <Link to="/login" className="text-odeshie-gold hover:underline font-medium">sign in</Link>
                    {' '}to leave a review.
                  </p>
                )}
                {reviewSuccess && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm">
                    Your review has been submitted!
                  </div>
                )}
                {reviewError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {reviewError}
                  </div>
                )}
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Your Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      size="lg"
                      interactive
                      onRate={r => { setReviewForm(prev => ({ ...prev, rating: r })); setReviewError(''); }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      placeholder="Share your experience with this product..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-odeshie-brown resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview || !user}
                    className="px-6 py-2.5 rounded-full font-semibold text-white text-sm transition-all"
                    style={{ backgroundColor: submittingReview || !user ? '#9d7521' : '#C4952A' }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review this product!
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: '#7B4A2D' }}
                          >
                            {review.reviewer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{review.reviewer_name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-4">
              {[
                {
                  q: 'What is the delivery time?',
                  a: 'Standard delivery takes 3-7 business days within Ghana. International shipping takes 7-14 business days depending on your location.'
                },
                {
                  q: 'Can I return or exchange this product?',
                  a: 'Yes, we accept returns within 30 days of delivery. Items must be unused, unwashed, and in original packaging. Contact our customer support to initiate a return.'
                },
                {
                  q: 'How do I care for this product?',
                  a: 'Care instructions vary by product. Generally, we recommend hand washing or gentle machine wash in cold water. Avoid bleach and tumble drying. Iron on low heat if needed.'
                },
                {
                  q: 'Is this product authentically African-made?',
                  a: 'Yes! All our products are sourced directly from verified African artisans, producers, and sellers. We work closely with our network to ensure authenticity and fair trade practices.'
                }
              ].map((faq, i) => (
                <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{faq.q}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* You Might Also Like */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
