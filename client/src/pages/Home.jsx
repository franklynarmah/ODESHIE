import React from 'react';
import Hero from '../components/Hero.jsx';
import NewArrivals from '../components/NewArrivals.jsx';
import BrowseByCategory from '../components/BrowseByCategory.jsx';
import SalesSection from '../components/SalesSection.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Newsletter from '../components/Newsletter.jsx';

export default function Home() {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <BrowseByCategory />
      <SalesSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
