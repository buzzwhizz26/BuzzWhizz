import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'buzzwhizz-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (articleUrl) => bookmarks.some((b) => b.url === articleUrl),
    [bookmarks]
  );

  const toggleBookmark = useCallback((article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === article.url);
      if (exists) {
        return prev.filter((b) => b.url !== article.url);
      }
      return [...prev, { ...article, bookmarkedAt: new Date().toISOString() }];
    });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark };
}
