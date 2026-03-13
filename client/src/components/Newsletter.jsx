import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-odeshie-cream dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#3B1F0D' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-odeshie-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-semibold text-gray-900 dark:text-odeshie-cream mb-3">
          Stay Up To Date On Our Latest Offers
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">
          Subscribe to our newsletter and get exclusive deals, new arrivals, and African fashion inspiration delivered to your inbox.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold" style={{ backgroundColor: '#3B1F0D' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-odeshie-gold" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
            </svg>
            Thank you for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3.5 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-odeshie-brown text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 shadow-md flex-shrink-0"
              style={{ backgroundColor: '#C4952A' }}
            >
              Subscribe
            </button>
          </form>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        {!submitted && (
          <p className="text-gray-400 text-xs mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        )}
      </div>
    </section>
  );
}
