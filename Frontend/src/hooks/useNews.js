import { useState, useEffect, useCallback } from 'react';
import { fetchNews, fetchTrending, searchNews } from '../utils/api';
import { getMockNews, getMockTrending } from '../data/mockNews';
import { useNewsContext } from '../context/NewsContext';

export function useNews(category = 'general') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const { language, country, searchQuery } = useNewsContext();

  // Reset when category changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setUsingMock(false);
  }, [category, language, country, searchQuery]);

  // Fetch articles
  useEffect(() => {
    let cancelled = false;
    const loadArticles = async () => {
      setLoading(true);
      try {
        const apiCategory = category === 'startups' ? 'technology' : category;
        let data = searchQuery 
          ? await searchNews(searchQuery, page, language, country)
          : await fetchNews(apiCategory, page, 6, language, country);
        
        if (!cancelled) {
          if (!data || !data.articles || data.articles.length === 0) {
            // Live Search Fallback before any mock data
            const fallbackQuery = category === 'general' ? 'breaking OR latest OR India' : category;
            data = await searchNews(fallbackQuery, page, language, country, 'publishedAt');
          }

          if (data && data.articles && data.articles.length > 0) {
            setArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
            setHasMore(data.articles.length >= 6);
            setUsingMock(false);
          } else {
            // Fallback to mock data only if all live endpoints fail
            const mockData = getMockNews(category, page, 6);
            setArticles(prev => page === 1 ? mockData.articles : [...prev, ...mockData.articles]);
            setHasMore(mockData.articles.length >= 6);
            setUsingMock(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          const mockData = getMockNews(category, page, 6);
          setArticles(prev => page === 1 ? mockData.articles : [...prev, ...mockData.articles]);
          setHasMore(mockData.articles.length >= 6);
          setUsingMock(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadArticles();
    return () => { cancelled = true; };
  }, [category, page, language, country, searchQuery]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  return { articles, loading, hasMore, error, loadMore, usingMock, page };
}

export function useTrending() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, country } = useNewsContext();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data = await fetchTrending(language, country);
        
        if (!data || !data.articles || data.articles.length === 0) {
          // Live fallback 1: fetch general top news
          data = await fetchNews('general', 1, 15, language, country);
        }

        if (!data || !data.articles || data.articles.length === 0) {
          // Live fallback 2: search breaking news sorted by latest
          const q = country === 'in' ? 'India OR breaking OR viral OR tech' : 'breaking OR trending OR viral';
          data = await searchNews(q, 1, language, country, 'publishedAt');
        }

        if (data && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        } else {
          // API returned no results across all live endpoints — use mock data
          const mock = getMockTrending();
          setArticles(mock.articles);
        }
      } catch (err) {
        console.warn('Trending fetch failed, using mock data:', err.message);
        const mock = getMockTrending();
        setArticles(mock.articles);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [language, country]);

  return { articles, loading };
}

