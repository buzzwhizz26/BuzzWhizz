import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../data/translations';

const NewsContext = createContext();

const langToCountry = {
  en: 'in',
  hi: 'in',
};

export function NewsProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('buzzwhizz_lang') || 'en';
  });
  
  const [country, setCountry] = useState(() => {
    return langToCountry[language] || 'in';
  });
  
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('buzzwhizz_location') || '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const handleFocusToggle = () => setFocusMode(prev => !prev);
    window.addEventListener('toggle-focus-mode', handleFocusToggle);
    return () => window.removeEventListener('toggle-focus-mode', handleFocusToggle);
  }, []);

  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('buzzwhizz_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const loginCustomer = (userData) => {
    setCustomer(userData);
    localStorage.setItem('buzzwhizz_customer', JSON.stringify(userData));
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('buzzwhizz_customer');
  };

  const t = useCallback((path, defaultValue) => {
    const keys = path.split('.');
    let result = translations[language] || translations['en'];
    
    for (const key of keys) {
      if (result?.[key]) {
        result = result[key];
      } else {
        // Fallback to English if key missing in current language
        let fallback = translations['en'];
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
        }
        return fallback || defaultValue || path;
      }
    }
    return result || defaultValue || path;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('buzzwhizz_lang', language);
    // Only update country automatically if user hasn't set one manually?
    // Actually, let's keep them independent once the user changes them.
  }, [language]);

  // removed country localStorage effect

  useEffect(() => {
    localStorage.setItem('buzzwhizz_location', location);
  }, [location]);

  return (
    <NewsContext.Provider value={{ 
      language, setLanguage, 
      country, setCountry,
      location, setLocation,
      searchQuery, setSearchQuery,
      customer, loginCustomer, logoutCustomer,
      focusMode, setFocusMode,
      t
    }}>
      {children}
    </NewsContext.Provider>
  );
}

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNewsContext must be used within a NewsProvider');
  }
  return context;
};
