import { useNews } from '../hooks/useNews';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';

import { useNewsContext } from '../context/NewsContext';

export default function NewsFeed({ category }) {
  const { searchQuery, setSearchQuery, t } = useNewsContext();
  const { articles, loading, hasMore, error, loadMore, usingMock } = useNews(category);
  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <div id="news-feed" className="py-12 bg-light-bg dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Feed Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2">
              {searchQuery ? (
                <>{t('feed.search_results')} <span className="text-orange-primary">"{searchQuery}"</span></>
              ) : (
                <>{t('feed.latest_in')} <span className="text-orange-primary capitalize">{category === 'general' ? t('feed.all_news') : category}</span></>
              )}
            </h2>
            <div className="h-1.5 w-20 bg-orange-primary rounded-full" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-orange-primary hover:underline flex items-center gap-1"
              >
                {t('feed.clear_search')}
              </button>
            )}
          </div>
          
          {usingMock && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-primary text-xs font-bold border border-orange-100 dark:border-orange-900/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              {t('feed.mock_active')}
            </div>
          )}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {articles.map((article, index) => {
              const isLast = articles.length === index + 1;
              return (
                <div key={`${article.url}-${index}`} ref={isLast ? lastElementRef : null}>
                  <NewsCard 
                    article={article} 
                    tag={searchQuery ? 'SEARCH' : (category === 'general' ? 'LATEST' : category.toUpperCase())} 
                  />
                </div>
              );
            })}
          </AnimatePresence>

          {/* Loading Skeletons */}
          {loading && (
            <>
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20 px-6 rounded-[2rem] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 max-w-2xl mx-auto">
            <div className="text-5xl mb-6">🛰️</div>
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mb-4 uppercase tracking-tighter">{t('feed.error_title')}</h3>
            <p className="text-red-500/70 mb-8 font-medium italic">"{error}"</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-xl bg-red-600 text-white font-black text-xs tracking-widest hover:scale-105 transition-transform"
            >
              {t('feed.error_retry')}
            </button>
          </div>
        )}

        {/* No Results Fallback */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-dark-border max-w-2xl mx-auto shadow-sm">
            <div className="text-7xl mb-6 grayscale opacity-50">🗞️</div>
            <h3 className="text-2xl font-black mb-4">{t('feed.empty_title')}</h3>
            <p className="text-light-muted dark:text-dark-muted mb-10 max-w-xs mx-auto">
              We couldn't find any breaking stories here. Try switching categories or checking back later.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 rounded-xl bg-orange-primary text-white font-black text-xs tracking-widest shadow-xl shadow-orange-primary/20"
            >
              {t('feed.empty_cta')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
