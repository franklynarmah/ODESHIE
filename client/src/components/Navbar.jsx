import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navCategories = [
  { label: 'Home', path: '/' },
  { label: 'New In', path: '/new-in' },
  { label: 'Sale', path: '/sale' },
  { label: 'Tops', path: '/category/Tops' },
  { label: 'Trousers', path: '/category/Trousers' },
  { label: 'Dresses', path: '/category/Dresses' },
  { label: 'Footwear', path: '/category/Footwear' },
  { label: 'Jewelry', path: '/category/Jewelry' },
  { label: 'Accessories', path: '/category/Accessories' }
];

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}
      style={{ backgroundColor: '#3B1F0D' }}
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-display text-2xl font-bold text-white tracking-wide hover:text-odeshie-gold transition-colors">
              ƆDESHIƐ
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navCategories.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === cat.path
                    ? 'text-odeshie-gold underline underline-offset-4'
                    : 'text-white/80 hover:text-white hover:underline underline-offset-4'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* Wishlist */}
            <button className="text-white/80 hover:text-white transition-colors p-1" aria-label="Wishlist">
              <HeartIcon />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative text-white/80 hover:text-white transition-colors p-1" aria-label="Cart">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-odeshie-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-white/70 text-sm hidden md:block">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-xs text-white/70 hover:text-white border border-white/30 rounded-full px-3 py-1 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs text-white/80 hover:text-white border border-white/30 rounded-full px-3 py-1 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs text-white rounded-full px-3 py-1 transition-colors"
                  style={{ backgroundColor: '#C4952A' }}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-1"
              aria-label="Menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search African fashion..."
                className="flex-1 px-4 py-2 rounded-l-full text-gray-900 bg-odeshie-cream text-sm focus:outline-none focus:ring-2 focus:ring-odeshie-gold"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-r-full text-white text-sm font-medium"
                style={{ backgroundColor: '#C4952A' }}
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10" style={{ backgroundColor: '#4a2810' }}>
          <div className="px-4 py-3 space-y-1">
            {navCategories.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className="block py-2 px-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2">
              {user ? (
                <div className="space-y-1">
                  <p className="px-3 py-1 text-white/60 text-sm">Signed in as {user.name}</p>
                  <button
                    onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                    className="block w-full text-left py-2 px-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2 px-3 py-2">
                  <Link to="/login" className="flex-1 text-center py-2 text-sm text-white border border-white/30 rounded-full">Login</Link>
                  <Link to="/register" className="flex-1 text-center py-2 text-sm text-white rounded-full" style={{ backgroundColor: '#C4952A' }}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
