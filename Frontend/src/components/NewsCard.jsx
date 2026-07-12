import { motion } from 'framer-motion';
import { useBookmarks } from '../hooks/useBookmarks';
import { useNewsContext } from '../context/NewsContext';
import { useState } from 'react';

export default function NewsCard({ article, tag }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { language } = useNewsContext();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bookmarked = isBookmarked(article.url);

  const calculateReadingTime = (text) => {
    const words = text?.split(/\s+/)?.length || 0;
    const time = Math.ceil(words / 200);
    return time < 1 ? '< 1 min' : `${time} min`;
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + article.url)}`;
    window.open(shareUrl, '_blank');
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = `${article.title}. ${article.description || ''}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white dark:bg-dark-card rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-primary/10 border border-gray-100 dark:border-dark-border transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.urlToImage || 'https://images.unsplash.com/photo-1585829365234-78d9b818448c?w=800&q=80'}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 rounded-lg bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
            {article.source.name}
          </span>
        </div>

        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10">
            ⏱ {calculateReadingTime(article.description)} read
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-2 text-[10px] font-black text-orange-primary uppercase tracking-[0.2em] mb-4">
          <span>{tag || 'TRENDING'}</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <span className="text-light-muted dark:text-dark-muted font-bold">{formatDate(article.publishedAt)}</span>
        </div>


        <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-orange-primary transition-colors duration-300 line-clamp-2">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        <p className="text-sm text-light-muted dark:text-dark-muted line-clamp-3 mb-8 flex-grow leading-relaxed font-medium">
          {article.description || "No description available for this story. Click read more to view the full coverage."}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-dark-border mt-auto">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-black uppercase tracking-widest text-orange-primary hover:text-orange-dark flex items-center gap-2 group/btn"
          >
            Read More
            <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeak}
              className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${
                isSpeaking 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-400 hover:text-orange-primary text-xl'
              }`}
              title={isSpeaking ? 'Stop Listening' : 'Listen News'}
            >
              {isSpeaking ? '🛑' : '🔊'}
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-400 hover:text-orange-primary transition-all duration-300 active:scale-90"
              title="Share on WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button
              onClick={() => toggleBookmark(article)}
              className={`p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 active:scale-90 ${
                bookmarked ? 'text-orange-primary bg-orange-50 dark:bg-orange-900/20' : 'text-gray-400 hover:text-orange-primary'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
            >
              <svg className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
