import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNewsContext } from '../context/NewsContext';

const languages = [
  { name: 'English', code: 'en', flag: '🇺🇸' },
  { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
];

const categories = [
  { name: 'Tech', slug: 'technology' },
  { name: 'Business', slug: 'business' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Startups', slug: 'startups' },
];

export default function Navbar({ onCategoryChange }) {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, searchQuery, setSearchQuery, customer, t } = useNewsContext();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (slug) => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    if (onCategoryChange) {
      onCategoryChange(slug);
    }
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      if (location.pathname !== '/') {
        navigate('/');
      }
      setTimeout(() => {
        const feed = document.getElementById('news-feed');
        if (feed) feed.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 dark:bg-dark-bg/90 glass-navbar py-3 shadow-2xl border-b border-gray-100 dark:border-dark-border' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img 
            src="/logo.png" 
            alt="BuzzWhizz Logo" 
            className="h-11 md:h-12 w-auto object-contain rounded-xl shadow-lg shadow-orange-primary/20 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-2xl md:text-3xl font-black text-orange-primary tracking-tight">
            BuzzWhizz
          </span>
        </Link>

        {/* Global Search Bar (Center - Desktop) */}
        {!isSearchOpen ? (
          <div className="hidden lg:flex flex-grow max-w-md">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-12 px-6 rounded-2xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-left text-light-muted dark:text-dark-muted text-sm font-medium flex items-center gap-3 hover:border-orange-primary/30 transition-colors"
            >
              <span>🔍</span> {t('nav.search_placeholder')}
            </button>
          </div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSearch}
            className="hidden lg:flex flex-grow max-w-md relative"
          >
            <input 
              autoFocus
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
              className="w-full h-12 px-6 rounded-2xl bg-white dark:bg-dark-bg border-2 border-orange-primary outline-none text-sm font-bold shadow-xl shadow-orange-primary/10"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-primary font-black text-xs">GO →</button>
          </motion.form>
        )}

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className={`text-sm font-black uppercase tracking-widest transition-colors relative pb-1 ${location.pathname === '/' ? 'text-orange-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-primary after:rounded-full' : 'hover:text-orange-primary'}`}>{t('nav.home')}</Link>
          <Link to="/about" className={`text-sm font-black uppercase tracking-widest transition-colors relative pb-1 ${location.pathname === '/about' ? 'text-orange-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-primary after:rounded-full' : 'hover:text-orange-primary'}`}>{t('nav.about')}</Link>
          <Link to="/contact" className={`text-sm font-black uppercase tracking-widest transition-colors relative pb-1 ${location.pathname === '/contact' ? 'text-orange-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-primary after:rounded-full' : 'hover:text-orange-primary'}`}>{t('nav.contact')}</Link>
          <Link 
            to="/shorts" 
            className="px-4 py-2 rounded-xl bg-orange-primary/10 text-orange-primary text-xs font-black uppercase tracking-widest hover:bg-orange-primary hover:text-white transition-all whitespace-nowrap"
          >
            {t('nav.shorts')}
          </Link>
          
          <div className="w-px h-6 bg-gray-200 dark:bg-dark-border mx-2" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 dark:bg-dark-card rounded-xl px-1 py-1 gap-0">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    language === lang.code
                      ? 'bg-orange-primary text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-orange-primary'
                  }`}
                  title={lang.name}
                >
                  {lang.flag} {lang.code}
                </button>
              ))}
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gray-50 dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme"
            >
              <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
            </button>
            <button
              onClick={() => {
                const event = new CustomEvent('toggle-focus-mode');
                window.dispatchEvent(event);
              }}
              className="px-5 py-3 rounded-xl bg-orange-primary text-white hover:bg-orange-dark transition-all active:scale-95 font-black text-[10px] tracking-widest shadow-lg shadow-orange-primary/20 whitespace-nowrap"
            >
              {t('nav.focus_mode')}
            </button>

            <Link
              to="/login"
              className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 ${
                location.pathname === '/login'
                  ? 'bg-orange-primary text-white shadow-md'
                  : customer
                  ? 'bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-orange-primary border border-orange-primary/30 hover:bg-orange-primary hover:text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-dark-card text-light-muted dark:text-dark-muted hover:bg-orange-primary hover:text-white border border-gray-200/60 dark:border-dark-border shadow-sm'
              }`}
            >
              <span>{customer ? customer.avatar || '👤' : '⚡'}</span>
              <span>{customer ? customer.name.split(' ')[0] : t('nav.login', 'Sign In')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to="/login"
            className={`p-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
              location.pathname === '/login'
                ? 'bg-orange-primary text-white shadow-sm'
                : 'bg-gray-50 dark:bg-dark-card text-orange-primary'
            }`}
            title="Customer Portal"
          >
            {customer ? customer.avatar || '👤' : '👤'}
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gray-50 dark:bg-dark-card"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button 
            className="p-3 text-orange-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-dark-bg shadow-2xl z-[60] p-8 lg:hidden flex flex-col overflow-y-auto scrollbar-hide"
            >
              <div className="flex flex-col gap-10 mt-12 pb-12">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 mb-2">
                  <img src="/logo.png" alt="BuzzWhizz" className="h-10 w-auto rounded-xl shadow-md" />
                  <span className="text-2xl font-black text-orange-primary tracking-tight">BuzzWhizz</span>
                </Link>
                
                <div className="space-y-6">
                  <form onSubmit={handleSearch} className="relative">
                    <input 
                      type="text" 
                      placeholder="Search news..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 px-5 rounded-xl bg-gray-50 dark:bg-dark-card outline-none font-bold text-sm border border-gray-100 dark:border-dark-border" 
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">🔍</button>
                  </form>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">LANGUAGE</p>
                  <div className="flex gap-2">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                          language === lang.code
                            ? 'bg-orange-primary text-white shadow-lg shadow-orange-primary/20'
                            : 'bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-orange-primary/30'
                        }`}
                      >
                        {lang.flag} {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('nav.categories')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button 
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-card text-xs font-black hover:bg-orange-primary hover:text-white transition-all text-left uppercase tracking-tighter"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('nav.company')}</p>
                  <Link to="/about" onClick={() => setIsOpen(false)} className={`block text-2xl font-black transition-all ${location.pathname === '/about' ? 'text-orange-primary' : 'hover:text-orange-primary'}`}>{t('nav.about')}</Link>
                  <Link to="/contact" onClick={() => setIsOpen(false)} className={`block text-2xl font-black transition-all ${location.pathname === '/contact' ? 'text-orange-primary' : 'hover:text-orange-primary'}`}>{t('nav.contact')}</Link>
                  <Link to="/shorts" onClick={() => setIsOpen(false)} className={`block text-2xl font-black transition-all ${location.pathname === '/shorts' ? 'text-orange-primary' : 'hover:text-orange-primary'}`}>{t('nav.shorts')}</Link>
                  <Link to="/login" onClick={() => setIsOpen(false)} className={`block text-2xl font-black transition-all flex items-center gap-2 ${location.pathname === '/login' ? 'text-orange-primary' : 'hover:text-orange-primary'}`}>
                    <span>{customer ? customer.avatar || '👤' : '⚡'}</span>
                    <span>{customer ? `${customer.name} (Account)` : t('nav.login', 'Sign In')}</span>
                  </Link>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  className="w-full py-5 rounded-2xl bg-orange-primary text-white font-black uppercase tracking-widest text-xs active:scale-95 transition-transform"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.cta')}
                </button>
              </div>
            </motion.div>
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]" 
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
