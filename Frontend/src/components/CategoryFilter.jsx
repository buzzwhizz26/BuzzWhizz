import { motion } from 'framer-motion';
import { useNewsContext } from '../context/NewsContext';

const categories = [
  { name: 'All News', slug: 'general', icon: '🌎' },
  { name: 'Tech', slug: 'technology', icon: '📱' },
  { name: 'Business', slug: 'business', icon: '💼' },
  { name: 'Sports', slug: 'sports', icon: '⚽' },
  { name: 'Entertainment', slug: 'entertainment', icon: '🎬' },
  { name: 'Startups', slug: 'startups', icon: '🚀' },
];

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  const { focusMode, setFocusMode } = useNewsContext();

  return (
    <div className={`sticky ${focusMode ? 'top-0 z-50 py-3.5 shadow-md border-orange-primary/20' : 'top-[64px] lg:top-[72px] z-40 py-3'} bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border transition-all duration-300`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onCategoryChange(cat.slug)}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'text-white shadow-lg shadow-orange-primary/20'
                    : 'text-light-muted dark:text-dark-muted hover:text-orange-primary bg-gray-50/50 dark:bg-dark-card/50'
                }`}
              >
                {activeCategory === cat.slug && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-orange-primary rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {focusMode && (
            <button
              onClick={() => setFocusMode(false)}
              className="shrink-0 ml-2 px-4 py-2 rounded-xl bg-orange-primary text-white font-black text-xs tracking-widest hover:bg-orange-dark transition-all shadow-md shadow-orange-primary/20 flex items-center gap-1.5 active:scale-95"
              title="Exit Focus Mode"
            >
              <span>✕</span>
              <span className="hidden sm:inline">EXIT FOCUS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
