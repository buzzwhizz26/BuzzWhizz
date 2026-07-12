import { useNews } from '../hooks/useNews';
import { motion } from 'framer-motion';
import { useNewsContext } from '../context/NewsContext';

export default function EntertainmentSection() {
  const { t } = useNewsContext();
  const { articles, loading } = useNews('entertainment');
  const displayArticles = articles.slice(0, 4);

  if (loading && articles.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-dark-bg/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              {t('entertainment.trending')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              {t('entertainment.title')} <span className="text-gradient">{t('entertainment.title_gradient')}</span> {t('entertainment.title_end')}
            </h2>
          </div>
          <button 
            onClick={() => window.location.href = '#category-filter'} 
            className="text-sm font-black uppercase tracking-widest text-orange-primary hover:translate-x-2 transition-transform duration-300 flex items-center gap-2"
          >
            {t('entertainment.view_all')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayArticles.map((article, index) => (
            <motion.div
              key={article.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => window.open(article.url, '_blank')}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-xl shadow-gray-200/50 dark:shadow-none bg-gray-200">
                <img 
                  src={article.urlToImage || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600'} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">{article.source.name}</span>
                  <h3 className="text-white font-bold leading-snug line-clamp-2 text-lg">
                    {article.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
