import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback, hasMore, loading) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      );

      if (node) observerRef.current.observe(node);
    },
    [callback, hasMore, loading]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return lastElementRef;
}
