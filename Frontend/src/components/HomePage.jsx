import { useState } from 'react';
import Hero from './Hero';
import Features from './Features';
import CategoryFilter from './CategoryFilter';
import NewsFeed from './NewsFeed';
import TrendingSection from './TrendingSection';
import DailyFlash from './DailyFlash';
import LocalNewsSection from './LocalNewsSection';
import EntertainmentSection from './EntertainmentSection';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('general');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Smooth scroll to news feed when category changes on mobile
    if (window.innerWidth < 768) {
      const feed = document.getElementById('news-feed');
      if (feed) {
        feed.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Hero />
      <DailyFlash />
      
      <Features />

      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      <NewsFeed category={activeCategory} />
      
      <EntertainmentSection />
      
      <LocalNewsSection />

      <TrendingSection />
    </>
  );
}
