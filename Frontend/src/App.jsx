import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ShortsPage from './components/ShortsPage';
import AdminMessages from './components/AdminMessages';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import OfflineBanner from './components/OfflineBanner';
import BackToTop from './components/BackToTop';
import { useNewsContext } from './context/NewsContext';

import ReadingProgressBar from './components/ReadingProgressBar';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function FocusModeOverlay() {
  const { focusMode, setFocusMode } = useNewsContext();
  const location = useLocation();

  if (!focusMode || location.pathname === '/') return null;

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md py-3.5 px-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between shadow-md">
      <span className="text-sm font-black uppercase tracking-widest text-orange-primary flex items-center gap-2">
        <img src="/logo.png" alt="BuzzWhizz" className="h-6 w-auto rounded" />
        <span>BuzzWhizz Focus Mode</span>
      </span>
      <button 
        onClick={() => setFocusMode(false)}
        className="px-4.5 py-2 rounded-xl bg-orange-primary text-white font-black text-xs tracking-widest hover:bg-orange-dark transition-all shadow-md shadow-orange-primary/20 flex items-center gap-1.5 active:scale-95"
      >
        <span>✕</span>
        <span>EXIT FOCUS</span>
      </button>
    </div>
  );
}

function App() {
  const { focusMode } = useNewsContext();

  return (
    <Router>
      <ScrollToTop />
      <ReadingProgressBar />
      <div className={`min-h-screen font-sans transition-all duration-700 ${focusMode ? 'bg-white dark:bg-dark-bg' : ''}`}>
        <OfflineBanner />
        
        {!focusMode && <Navbar />}
        <FocusModeOverlay />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shorts" element={<ShortsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
        </Routes>

        {!focusMode && <Footer />}
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
