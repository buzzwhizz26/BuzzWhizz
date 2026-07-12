import { useTrending } from '../hooks/useNews';
import { motion } from 'framer-motion';

export default function DailyFlash() {
  const { articles, loading } = useTrending();
  const displayArticles = articles.slice(0, 6);

  if (loading) {
    return (
      <div className="w-full bg-orange-primary/5 py-3 overflow-hidden">
        <div className="animate-pulse flex gap-8 px-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-orange-primary dark:bg-orange-primary/10 py-3 relative overflow-hidden group">
      {/* Ticker Container */}
      <div className="flex gap-16 whitespace-nowrap animate-ticker hover:[animation-play-state:paused]">
        {/* Doubled for seamless loop */}
        {[...displayArticles, ...displayArticles].map((article, i) => (
          <a 
            key={`${article.url}-${i}`}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white dark:text-orange-primary"
          >
            <span className="px-2 py-0.5 rounded bg-white dark:bg-orange-primary text-orange-primary dark:text-white text-[8px] font-black uppercase tracking-widest">
              DAILY FLASH
            </span>
            <span className="text-xs font-bold tracking-tight">
              {article.title}
            </span>
            <span className="text-[10px] opacity-60 font-black">⚡ JUST NOW</span>
          </a>
        ))}
      </div>

      {/* Fade Gradients */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-orange-primary dark:from-dark-bg to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-orange-primary dark:from-dark-bg to-transparent pointer-events-none" />
    </div>
  );
}
