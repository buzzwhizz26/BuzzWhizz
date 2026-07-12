import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchNews } from '../utils/api';
import { useNewsContext } from '../context/NewsContext';
import NewsCard from './NewsCard';

export default function LocalNewsSection() {
  const { language, country, t } = useNewsContext();
  const [city, setCity] = useState(localStorage.getItem('buzzwhizz_city') || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e, customCity, nextPage = 1) => {
    if (e) e.preventDefault();
    const searchCity = customCity || city;
    if (!searchCity) return;

    setLoading(true);
    setError(null);
    if (nextPage === 1) {
      setArticles([]);
      setPage(1);
    }
    
    localStorage.setItem('buzzwhizz_city', searchCity);

    try {
      const locationQuery = searchCity;
        
      const data = await searchNews(locationQuery, nextPage, language, country, 'relevancy');
      
      if (data?.articles?.length > 0) {
        if (nextPage === 1) {
          setArticles(data.articles);
        } else {
          setArticles(prev => [...prev, ...data.articles]);
        }
        setHasMore(data.articles.length >= 6);
        setPage(nextPage);
      } else {
        if (nextPage === 1) setArticles([]);
        setHasMore(false);
      }
    } catch (err) {
      if (nextPage === 1) {
        setError("Couldn't find news for this location. Try a state or bigger city.");
        setArticles([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    handleSearch(null, city, page + 1);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
        const data = await response.json();
        
        const addr = data.address;
        let detectedCity = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.state || "";
        
        detectedCity = detectedCity
          .replace(/\s*(Municipal Corporation|District|Tehsil|Division|Panchayat)$/i, '')
          .trim();
        
        if (detectedCity) {
          setCity(detectedCity);
          handleSearch(null, detectedCity, 1);
        }
      } catch (err) {
        console.error("Location detection failed:", err);
      } finally {
        setDetecting(false);
      }
    }, () => {
      setDetecting(false);
      alert("Please enable location access to see news from your current city!");
    });
  };

  useEffect(() => {
    if (city) handleSearch(null, city, 1);
  }, []);

  return (
    <section id="local-news" className="py-24 bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-xs font-black uppercase tracking-widest mb-6">
              {t('local.title')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {city ? (
                <>{t('local.heading')} <span className="text-gradient capitalize">{(city || '').toLowerCase()}</span></>
              ) : (
                <>{t('local.default_heading')}</>
              )}
            </h2>
            <p className="text-light-muted dark:text-dark-muted font-medium">
              {t('local.subheading')}
            </p>
          </div>

          <form onSubmit={(e) => handleSearch(e, city, 1)} className="flex gap-3 w-full lg:max-w-md relative">
            <div className="relative flex-grow group">
              <input 
                type="text" 
                placeholder={t('local.input_placeholder')}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-14 pl-6 pr-14 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border outline-none focus:border-orange-primary font-bold transition-all text-sm"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={detecting}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${detecting ? 'animate-spin' : ''}`}
                title="Detect My Location"
              >
                {detecting ? '⏳' : '📍'}
              </button>
            </div>
            <button 
              type="submit" 
              className="h-14 px-8 rounded-2xl bg-orange-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-primary/20 active:scale-95 transition-transform shrink-0"
            >
              GO
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {articles.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <NewsCard 
                    key={`${article.url}-${index}`} 
                    article={article} 
                    tag={`${(city || 'Local').toUpperCase()} ${language === 'hi' ? 'समाचार' : 'NEWS'}`} 
                  />
                ))}
                
                {loading && [...Array(3)].map((_, i) => (
                  <div key={`loading-${i}`} className="aspect-[4/3] rounded-3xl bg-gray-100 dark:bg-dark-card animate-pulse" />
                ))}
              </div>

              {hasMore && !loading && (
                <div className="flex justify-center">
                  <button 
                    onClick={loadMore}
                    className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-gray-100 dark:bg-dark-card hover:bg-orange-primary hover:text-white transition-all duration-300 shadow-xl shadow-gray-200/50 dark:shadow-none"
                  >
                    <span className="text-sm font-black uppercase tracking-widest">{t('local.see_more')}</span>
                    <span className="group-hover:translate-y-1 transition-transform">↓</span>
                  </button>
                </div>
              )}
            </div>
          ) : loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-3xl bg-gray-100 dark:bg-dark-card animate-pulse" />
              ))}
            </div>
          ) : city && !loading ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-dark-border"
            >
              <p className="text-xl font-bold opacity-40">{t('local.no_results')} "{city}". ⚡</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
