import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white py-3 px-4 flex items-center justify-center gap-3 shadow-xl"
        >
          <span className="text-xl">⚠️</span>
          <p className="font-bold text-sm uppercase tracking-widest">
            You are currently offline. Some features may be limited.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
