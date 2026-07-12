import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrending } from '../hooks/useNews';
import { Link } from 'react-router-dom';
import { useNewsContext } from '../context/NewsContext';

export default function ShortsPage() {
  const { t } = useNewsContext();
  const { articles, loading } = useTrending();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [buzzedArticles, setBuzzedArticles] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const index = Math.round(
          scrollContainerRef.current.scrollTop / window.innerHeight
        );
        setActiveIndex(index);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleBuzz = (url) => {
    setBuzzedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) newSet.delete(url);
      else newSet.add(url);
      return newSet;
    });
  };

  const handleShare = async (article) => {
    const shareData = {
      title: article.title,
      text: article.description || article.title,
      url: article.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      const text = encodeURIComponent(article.title + ' ' + article.url);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-black tracking-widest animate-pulse">{t('feed.loading_shorts') || 'LOADING SHORTS...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-6 z-[110] flex items-center justify-between">
        <Link to="/" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-2xl">
          ✕
        </Link>
        <div className="px-4 py-2 rounded-full bg-orange-primary text-white text-[10px] font-black tracking-[0.2em]">
          {t('entertainment.trending') || 'BUZZ MEMES 🔥'}
        </div>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {articles.map((article, index) => (
          <div 
            key={index} 
            className="h-full w-full snap-start relative flex flex-col justify-end p-8 pb-24 lg:p-12 lg:pb-32"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f7c?auto=format&fit=crop&q=80&w=1000'} 
                alt={article.title} 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-2xl"
            >
              <div className="flex items-center gap-3 text-orange-primary text-xs font-black tracking-widest mb-6">
                <span>{article.source.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="text-white/60 uppercase">{t('hero.just_now')}</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
                {article.title}
              </h2>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-12 line-clamp-4">
                {article.description || "BuzzWhizz delivering news in meme form with extreme clarity and speed. No fluff, just vibes."}
              </p>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleSpeak(article.title + '. ' + (article.description || ''))}
                  className={`flex-1 lg:flex-none px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${
                    isSpeaking 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white text-black hover:bg-orange-primary hover:text-white'
                  }`}
                >
                  {isSpeaking ? (t('shorts.stop') || '🛑 STOP') : (t('shorts.listen') || '🔊 LISTEN')}
                </button>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 lg:flex-none px-8 py-4 rounded-2xl bg-orange-primary text-white font-black text-xs tracking-widest text-center"
                >
                  {t('hero.read_full')}
                </a>
              </div>
            </motion.div>

            {/* Interactions Overlay */}
            <div className="absolute right-6 bottom-32 flex flex-col gap-6 z-20">
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleBuzz(article.url)}
                  className={`w-14 h-14 rounded-full backdrop-blur-md flex flex-col items-center justify-center text-white border transition-colors ${
                    buzzedArticles.has(article.url) 
                      ? 'bg-orange-primary border-orange-primary' 
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  <motion.span 
                    animate={buzzedArticles.has(article.url) ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
                    className="text-2xl"
                  >
                    ⚡
                  </motion.span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleShare(article)}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
                >
                  <span className="text-2xl">📱</span>
                </motion.button>
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Navigation Bar */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-[110]">
        {articles.map((_, i) => (
          <div 
            key={i}
            className={`w-1 transition-all duration-300 ${
              i === activeIndex ? 'h-10 bg-orange-primary' : 'h-3 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
