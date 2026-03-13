import React from 'react';

const testimonials = [
  {
    name: 'Tina K.',
    initials: 'TK',
    rating: 5,
    text: 'We are very pleased with the customer service, and shipping was a smooth process',
    location: 'Accra, Ghana'
  },
  {
    name: 'Maria Nelson',
    initials: 'MN',
    rating: 5,
    text: 'I love the jewelries I bought, their of such high quality.',
    location: 'Lagos, Nigeria'
  },
  {
    name: 'Ellie',
    initials: 'E',
    rating: 5,
    text: 'I was soo skeptical at first but after recieving my first package, I\'m literally amazed',
    location: 'Nairobi, Kenya'
  }
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= count ? 'text-odeshie-gold' : 'text-white/30'}>★</span>
      ))}
    </div>
  );
}

const QuoteIcon = () => (
  <svg className="h-8 w-8 opacity-30" fill="currentColor" viewBox="0 0 32 32">
    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="py-16" style={{ background: 'linear-gradient(135deg, #3B1F0D 0%, #7B4A2D 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Our Happy Customers
          </h2>
          <p className="text-white/60 text-base max-w-md mx-auto">
            Join thousands of satisfied customers who have discovered the beauty of African fashion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 border border-white/10 hover:border-white/20 transition-all duration-300"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
            >
              {/* Quote icon */}
              <div className="text-odeshie-gold mb-4">
                <QuoteIcon />
              </div>

              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Review text */}
              <p className="text-white/80 mt-4 mb-6 text-sm leading-relaxed italic">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: '#C4952A' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.location}</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-odeshie-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
