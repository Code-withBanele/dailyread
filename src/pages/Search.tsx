import { useState, useMemo, useEffect } from 'react';
import { articles as legacyArticles } from '../data/articles';
import { getArticles, searchArticles } from '../api/strapi/articles';
import type { Article } from '../types/article';
import { SearchBar } from '../components/SearchBar';
import { ArticleGrid } from '../components/ArticleGrid';
import './Search.css';

export function Search() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(legacyArticles);
  const [liveSearchResults, setLiveSearchResults] = useState<Article[]>([]);

  useEffect(() => {
    let isMounted = true;

    getArticles()
      .then((data) => {
        if (isMounted) {
          setArticles(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setArticles(legacyArticles);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setLiveSearchResults([]);
      return;
    }

    let isMounted = true;

    searchArticles(query)
      .then((results) => {
        if (isMounted) {
          setLiveSearchResults(results);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLiveSearchResults([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowered = query.trim().toLowerCase();
    return articles.filter((article) => {
      const haystacks = [
        article.title,
        article.excerpt,
        article.category,
        article.author,
        ...article.content.map((block) => {
          if (typeof block === 'string') {
            return block;
          }

          if ('content' in block && typeof block.content === 'string') {
            return block.content;
          }

          if ('value' in block && typeof block.value === 'string') {
            return block.value;
          }

          return '';
        }),
      ];

      return haystacks.some((text) => text.toLowerCase().includes(lowered));
    });
  }, [articles, query]);

  const resultsToRender = liveSearchResults.length > 0 ? liveSearchResults : searchResults;

  return (
    <div className="search-page">
      <section className="search-header">
        <h1>Search AHNN</h1>
      </section>

      <section className="search-bar-section">
        <SearchBar onSearch={setQuery} />
      </section>

      <section className="search-results">
        {query.trim() ? (
          <>
            {resultsToRender.length > 0 ? (
              <>
                <p className="results-count">
                  Found {resultsToRender.length} {resultsToRender.length === 1 ? 'article' : 'articles'} matching "{query}"
                </p>
                <ArticleGrid articles={resultsToRender} />
              </>
            ) : (
              <div className="no-results">
                <p>No articles found</p>
                <p className="results-hint">Try another search term.</p>
              </div>
            )}
          </>
        ) : (
          <p className="search-hint">Enter a search term to find articles</p>
        )}
      </section>
    </div>
  );
}
