import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PROMO_CODES = {
  'ODESHIE20': 20,
  'AFRICA10': 10,
  'WELCOME15': 15
};

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const DELIVERY_FEE = 24;
  const discountPercent = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const discount = (cartTotal * discountPercent) / 100;
  const total = cartTotal - discount + DELIVERY_FEE;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try ODESHIE20 for 20% off!');
      setAppliedPromo(null);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setRemovingId(itemId);
      await removeFromCart(itemId);
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQty = async (itemId, qty) => {
    try {
      await updateQuantity(itemId, qty);
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (item) => {
    return item.image_url || `https://via.placeholder.com/100x100/7B4A2D/FFFFFF?text=${encodeURIComponent(item.name || 'Product')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-odeshie-brown transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Cart</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-8">
          YOUR CART
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="font-display text-3xl text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Discover our beautiful African collection and add items to your cart.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#C4952A' }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart container */}
              <div
                className="rounded-2xl p-4 sm:p-6 space-y-4"
                style={{ backgroundColor: '#E8D5B7' }}
              >
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 ${
                      index < cartItems.length - 1 ? 'pb-4 border-b border-odeshie-brown/20' : ''
                    } ${removingId === item.id ? 'opacity-50 transition-opacity' : ''}`}
                  >
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
                      <img
                        src={getImageUrl(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.src = `https://via.placeholder.com/100x100/7B4A2D/FFFFFF?text=Product`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="text-xs text-gray-600 mb-0.5">Size: <span className="font-medium">{item.size}</span></p>
                          )}
                          {item.color && (
                            <p className="text-xs text-gray-600">Color: <span className="font-medium">{item.color}</span></p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {/* Price + Quantity */}
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            GHC {item.price.toFixed(2)}
                          </span>
                          {item.original_price && item.original_price > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              GHC {item.original_price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center bg-white rounded-full border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                handleUpdateQty(item.id, item.quantity - 1);
                              } else {
                                handleRemove(item.id);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item subtotal */}
                      <p className="text-xs text-gray-500 mt-1">
                        Subtotal: GHC {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-odeshie-brown"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                    style={{ backgroundColor: '#3B1F0D' }}
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
                {appliedPromo && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-green-600 dark:text-green-400 text-xs font-medium">
                      Code "{appliedPromo}" applied — {PROMO_CODES[appliedPromo]}% off!
                    </p>
                    <button
                      onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                      className="text-xs text-red-400 hover:text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Continue shopping */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-odeshie-brown transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sticky top-24">
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-6">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      GHC {cartTotal.toFixed(2)}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Discount (-{discountPercent}%)
                      </span>
                      <span className="text-sm font-medium text-red-500">
                        -GHC {discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Delivery Fee</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      GHC {DELIVERY_FEE.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-xl text-gray-900 dark:text-white">
                        GHC {total.toFixed(2)}
                      </span>
                    </div>
                    {discountPercent > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-right">
                        You save GHC {discount.toFixed(2)}!
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else {
                      alert('Checkout coming soon! Thank you for shopping with ƆDESHIƐ.');
                    }
                  }}
                  className="w-full py-4 rounded-full font-bold text-white transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#C4952A' }}
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                {!user && (
                  <p className="text-xs text-gray-400 text-center mt-3">
                    <Link to="/register" className="text-odeshie-gold hover:underline">Create an account</Link>
                    {' '}to save your cart and get exclusive deals.
                  </p>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs">SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs">Safe Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
