import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '50,000+', label: 'Happy Customers' },
  { value: '20,000+', label: 'High Quality Products' },
  { value: '1,000+', label: 'Brand Deals' }
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex flex-col justify-between">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a0a04 0%, #3B1F0D 30%, #7B4A2D 65%, #C4952A 100%)'
        }}
      />

      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Decorative kente-inspired border at top */}
      <div className="relative z-10 h-2 flex">
        {['#C4952A', '#3B1F0D', '#C4952A', '#7B4A2D', '#C4952A', '#3B1F0D', '#C4952A', '#7B4A2D'].map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-odeshie-gold animate-pulse" />
              <span className="text-white/80 text-sm font-medium">New Collection Available</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Discover{' '}
              <span style={{ color: '#C4952A' }}>Africa's</span>
              {' '}finest{' '}
              <span className="italic">collection</span>
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-4 max-w-lg">
              Embrace the legacy of African craftsmanship, meticulously curated for the modern connoisseur.
            </p>

            <p className="text-white/60 text-base leading-relaxed mb-10 max-w-xl">
              From vibrant Ankara fabrics to handcrafted jewellery — experience the rich diversity of African style, delivered to your door.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/new-in"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg hover:shadow-odeshie-gold/30"
                style={{ backgroundColor: '#C4952A' }}
              >
                Shop New Arrivals
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/sale"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all hover:bg-white/10"
              >
                View Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/10" style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <div key={i} className="py-6 text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1" style={{ color: '#C4952A' }}>
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs sm:text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
