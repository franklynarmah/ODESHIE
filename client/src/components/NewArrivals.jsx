import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import ProductCard from './ProductCard.jsx';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.get('/api/products?is_new_arrival=true')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load new arrivals:', err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-odeshie-cream">
              New Arrivals
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
              Fresh additions to our curated African collection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-odeshie-brown dark:hover:border-odeshie-brown text-gray-600 dark:text-gray-300 hover:text-odeshie-brown transition-all"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-odeshie-brown dark:hover:border-odeshie-brown text-gray-600 dark:text-gray-300 hover:text-odeshie-brown transition-all"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product scroll area */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
          >
            {products.map(product => (
              <div key={product.id} className="flex-none w-56 sm:w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            to="/new-in"
            className="inline-flex items-center gap-2 border-2 border-odeshie-dark dark:border-odeshie-cream text-odeshie-dark dark:text-odeshie-cream font-semibold px-8 py-3 rounded-full hover:bg-odeshie-dark hover:text-white dark:hover:bg-odeshie-cream dark:hover:text-odeshie-dark transition-all"
          >
            View All New Arrivals
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
