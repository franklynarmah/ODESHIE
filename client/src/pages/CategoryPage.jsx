import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

const ITEMS_PER_PAGE = 12;

const categoryLabels = {
  Tops: 'Tops',
  Trousers: 'Trousers',
  Dresses: 'Dresses',
  Footwear: 'Footwear',
  Jewelry: 'Jewelry',
  Accessories: 'Accessories',
  all: 'All Products'
};

const SortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' }
];

function FilterPanel({ priceRange, setPriceRange, selectedSizes, toggleSize, onClear, isMobile, onClose }) {
  const sizes = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'One Size'];

  return (
    <div className={`${isMobile ? '' : ''} space-y-6`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="text-xs text-odeshie-gold hover:underline">Clear all</button>
          {isMobile && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-odeshie-brown"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>GHC 0</span>
            <span className="font-semibold text-gray-900 dark:text-white">Up to GHC {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedSizes.includes(size)
                  ? 'border-odeshie-dark bg-odeshie-dark text-white dark:border-odeshie-gold dark:bg-odeshie-gold'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-odeshie-brown'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(star => (
            <label key={star} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="rating" className="accent-odeshie-brown" />
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={s <= star ? 'text-odeshie-gold text-sm' : 'text-gray-300 text-sm'}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">& up</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ filter }) {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isNewArrival = filter === 'new_arrival';
  const isSale = filter === 'sale';

  const pageTitle = isNewArrival
    ? 'New In'
    : isSale
    ? 'Sale'
    : searchQuery
    ? `Search: "${searchQuery}"`
    : categoryLabels[category] || category;

  const fetchProducts = useCallback(() => {
    setLoading(true);

    let url = '/api/products?';
    const params = new URLSearchParams();

    if (isNewArrival) params.append('is_new_arrival', 'true');
    else if (isSale) params.append('is_on_sale', 'true');
    else if (category && category !== 'all') params.append('category', category);

    if (searchQuery) params.append('search', searchQuery);

    api.get(`/api/products?${params.toString()}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [category, filter, searchQuery, isNewArrival, isSale]);

  useEffect(() => {
    setPage(1);
    fetchProducts();
  }, [fetchProducts]);

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedSizes([]);
    setSort('default');
    setPage(1);
  };

  // Apply client-side filters and sort
  const filteredProducts = products
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => {
      if (selectedSizes.length === 0) return true;
      return selectedSizes.some(size => p.sizes?.includes(size));
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div
        className="py-12"
        style={{ background: 'linear-gradient(135deg, #3B1F0D 0%, #7B4A2D 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">{pageTitle}</span>
          </nav>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white">
            {pageTitle}
          </h1>
          {!loading && (
            <p className="text-white/60 mt-2 text-sm">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-odeshie-brown lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {(selectedSizes.length > 0 || priceRange[1] < 500) && (
                <span className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center" style={{ backgroundColor: '#C4952A' }}>
                  {selectedSizes.length + (priceRange[1] < 500 ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <label className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Sort by:</label>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-odeshie-brown"
            >
              {SortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <FilterPanel
                priceRange={priceRange}
                setPriceRange={(val) => { setPriceRange(val); setPage(1); }}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                onClear={clearFilters}
                isMobile={false}
              />
            </div>
          </aside>

          {/* Mobile Filter panel */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 p-6 overflow-y-auto shadow-xl">
                <FilterPanel
                  priceRange={priceRange}
                  setPriceRange={(val) => { setPriceRange(val); setPage(1); }}
                  selectedSizes={selectedSizes}
                  toggleSize={toggleSize}
                  onClear={clearFilters}
                  isMobile={true}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {[...Array(8)].map((_, i) => (
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
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? `No products match "${searchQuery}".`
                    : 'No products match your current filters.'
                  }
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-full font-semibold text-white text-sm"
                  style={{ backgroundColor: '#C4952A' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-odeshie-brown disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 || pageNum === totalPages ||
                        Math.abs(pageNum - page) <= 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-all ${
                              page === pageNum
                                ? 'border-odeshie-dark bg-odeshie-dark text-white dark:border-odeshie-gold dark:bg-odeshie-gold'
                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-odeshie-brown'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (Math.abs(pageNum - page) === 2) {
                        return <span key={pageNum} className="text-gray-400">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-odeshie-brown disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} products
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
