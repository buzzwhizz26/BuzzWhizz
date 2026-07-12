import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setWidth(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[110] pointer-events-none">
      <div 
        className="h-full bg-orange-primary transition-all duration-150 ease-out shadow-[0_0_10px_rgba(255,107,0,0.5)]" 
        style={{ width: `${width}%` }} 
      />
    </div>
  );
}
