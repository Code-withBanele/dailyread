import { useState, useMemo } from 'react';
import { articles } from '../data/articles';
import { SearchBar } from '../components/SearchBar';
import { ArticleGrid } from '../components/ArticleGrid';
import './Search.css';

export function Search() {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowercaseQuery = query.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.category.toLowerCase().includes(lowercaseQuery) ||
        article.author.toLowerCase().includes(lowercaseQuery)
    );
  }, [query]);

  return (
    <div className="search-page">
      <section className="search-header">
        <h1>Search The Daily Read</h1>
      </section>

      <section className="search-bar-section">
        <SearchBar onSearch={setQuery} />
      </section>

      <section className="search-results">
        {query.trim() ? (
          <>
            {searchResults.length > 0 ? (
              <>
                <p className="results-count">
                  Found {searchResults.length} {searchResults.length === 1 ? 'article' : 'articles'} matching "{query}"
                </p>
                <ArticleGrid articles={searchResults} />
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
