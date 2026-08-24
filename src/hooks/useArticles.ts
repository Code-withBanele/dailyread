import { useEffect, useState } from 'react';
import type { Article } from '../types/article';
import { fetchArticles } from '../data/api';

interface ArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useArticles(category?: string): ArticlesState {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchArticles(category)
      .then((rows) => {
        if (active) setArticles(rows);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load articles');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, nonce]);

  return { articles, loading, error, reload: () => setNonce((n) => n + 1) };
}
