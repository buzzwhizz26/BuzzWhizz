import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrending } from '../hooks/useNews';
import { useNewsContext } from '../context/NewsContext';

export default function Hero() {
  const { t } = useNewsContext();
  const { articles, loading } = useTrending();
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredArticles = articles.slice(0, 5);

  useEffect(() => {
    if (featuredArticles.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [featuredArticles.length]);

  const scrollToFeed = () => {
    const feed = document.getElementById('news-feed');
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentArticle = featuredArticles[currentIndex];

  const calculateReadingTime = (text) => {
    const words = text?.split(/\s+/)?.length || 0;
    const time = Math.ceil(words / 200);
    return time < 1 ? '< 1 min' : `${time} min`;
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-24 lg:pt-32 overflow-hidden bg-white dark:bg-dark-bg">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/30 dark:bg-orange-900/5 -z-10" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-100/50 dark:bg-orange-800/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Copy & CTA */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                LIVE UPDATES ⚡
              </span>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6">
                {t('hero.headline')} <span className="text-gradient">{t('hero.headline_gradient')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-light-muted dark:text-dark-muted mb-8 leading-relaxed max-w-xl">
                {t('hero.subheadline')}
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={scrollToFeed}
                  className="btn-primary px-12 py-5 text-lg shadow-2xl shadow-orange-primary/30 hover:-translate-y-1 transition-all duration-300"
                >
                  {t('hero.cta_start')}
                </button>
                <button 
                  onClick={() => window.location.href = '/shorts'}
                  className="px-10 py-5 text-lg font-bold rounded-xl border-2 border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {t('hero.cta_shorts')}
                </button>
              </div>

              {/* Stats */}
              <div className="mt-16 flex items-center gap-10 text-sm font-bold opacity-40">
                <div className="flex flex-col">
                  <span className="text-3xl text-orange-primary">100+</span>
                  <span className="uppercase tracking-widest text-[10px]">{t('hero.stats_stories')}</span>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                <div className="flex flex-col">
                  <span className="text-3xl text-orange-primary">50k+</span>
                  <span className="uppercase tracking-widest text-[10px]">{t('hero.stats_readers')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Featured Cards (Rotating) */}
          <div className="lg:w-5/12 w-full lg:ml-auto">
            {!loading && currentArticle && (
              <div className="relative group cursor-pointer" onClick={() => window.open(currentArticle.url, '_blank')}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.1, x: -50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative aspect-[4/5] md:aspect-video lg:aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-primary/10 border-4 border-white dark:border-dark-card"
                  >
                    <img 
                      src={currentArticle.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f7c?auto=format&fit=crop&q=80&w=1000'} 
                      alt={currentArticle.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating Info Badges */}
                    <div className="absolute top-8 left-8 flex flex-col gap-3">
                      <span className="px-5 py-2 rounded-xl bg-orange-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                        {t('hero.top_story')}
                      </span>
                      <span className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        ⏱ {calculateReadingTime(currentArticle.description)} {t('hero.read_time')}
                      </span>
                    </div>

                    {/* Gradient & Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent pt-32">
                      <div className="flex items-center gap-3 text-orange-400 text-xs font-black uppercase tracking-widest mb-4">
                        <span>{currentArticle.source.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="text-white/60">{t('hero.just_now')}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-orange-primary transition-colors duration-300 line-clamp-2">
                        {currentArticle.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2 mb-6 font-medium">
                        {currentArticle.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group/more">
                        {t('hero.read_full')}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                  {featuredArticles.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-10 bg-orange-primary' : 'w-2 bg-gray-200 dark:bg-dark-card hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {loading && (
              <div className="aspect-[4/5] rounded-[2.5rem] skeleton-box" />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
