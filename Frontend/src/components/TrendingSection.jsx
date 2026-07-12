import { useTrending } from '../hooks/useNews';
import { motion } from 'framer-motion';

export default function TrendingSection() {
  const { articles, loading } = useTrending();

  if (!loading && articles.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-bg/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-4xl">🔥</span>
          <h2 className="text-3xl font-black">Trending Now</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 md:px-0 md:mx-0">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[300px] md:min-w-[350px] aspect-[4/3] skeleton-box rounded-2xl" />
            ))
          ) : (
            articles.map((article, index) => (
              <motion.a
                key={`${article.url}-${index}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="relative min-w-[300px] md:min-w-[350px] aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg"
              >
                <img
                  src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f7c?auto=format&fit=crop&q=80&w=600'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-2 py-0.5 rounded bg-orange-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                    {article.source.name}
                  </span>
                  <h3 className="text-lg font-bold leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </motion.a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
