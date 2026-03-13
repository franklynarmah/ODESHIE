import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Dresses',
    path: '/category/Dresses',
    color: '#7B4A2D',
    img: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&h=350&fit=crop',
    description: 'Boubou, Takchita & more'
  },
  {
    name: 'Tops',
    path: '/category/Tops',
    color: '#3B1F0D',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d05?w=300&h=350&fit=crop',
    description: 'Ankara, Buba & more'
  },
  {
    name: 'Accessories',
    path: '/category/Accessories',
    color: '#C4952A',
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300&h=350&fit=crop',
    description: 'Beads, bags & crafts'
  },
  {
    name: 'Jewelry',
    path: '/category/Jewelry',
    color: '#8B5A2B',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=350&fit=crop',
    description: 'Gold, beads & gems'
  },
  {
    name: 'Footwear',
    path: '/category/Footwear',
    color: '#5C3317',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=350&fit=crop',
    description: 'Sandals & leather shoes'
  },
  {
    name: 'Trousers',
    path: '/category/Trousers',
    color: '#4A2810',
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=350&fit=crop',
    description: 'Traditional bottoms'
  }
];

export default function BrowseByCategory() {
  return (
    <section className="py-16" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div
          className="rounded-2xl p-8 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #3B1F0D 0%, #7B4A2D 100%)' }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-3">
            Browse By Category
          </h2>
          <p className="text-white/70 text-base">
            Explore authentic African fashion across all styles
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group flex flex-col items-center"
            >
              {/* Arch-shaped card */}
              <div
                className="w-full overflow-hidden relative group-hover:shadow-xl transition-all duration-300"
                style={{
                  borderRadius: '50% 50% 10px 10px / 25% 25% 10px 10px',
                  paddingBottom: '120%',
                  position: 'relative'
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.backgroundColor = cat.color;
                  }}
                />
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity"
                  style={{ background: `linear-gradient(to bottom, transparent 40%, ${cat.color})` }}
                />
              </div>

              {/* Label */}
              <div className="mt-3 text-center">
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-odeshie-brown dark:group-hover:text-odeshie-gold transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
