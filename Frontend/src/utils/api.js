const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchNews(category = 'general', page = 1, pageSize = 12, language = 'en', country = 'in') {
  try {
    const response = await fetch(
      `${API_BASE}/api/news?category=${category}&page=${page}&pageSize=${pageSize}&language=${language}&country=${country}`
    );
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.warn('API fetch failed, using mock data:', error.message);
    return null;
  }
}

export async function fetchTrending(language = 'en', country = 'in') {
  try {
    const response = await fetch(`${API_BASE}/api/trending?language=${language}&country=${country}`);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.warn('Trending fetch failed, using mock data:', error.message);
    return null;
  }
}

export async function searchNews(query, page = 1, language = 'en', country = '', sortBy = 'relevancy') {
  try {
    const countryParam = country ? `&country=${country}` : '';
    const sortByParam = `&sortBy=${sortBy}`;
    const response = await fetch(
      `${API_BASE}/api/search?q=${encodeURIComponent(query)}&page=${page}&language=${language}${countryParam}${sortByParam}`
    );
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.warn('Search failed:', error.message);
    return null;
  }
}
