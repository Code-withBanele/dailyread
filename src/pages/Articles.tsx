import { useState, useMemo, useEffect } from 'react';
import { articles as legacyArticles } from '../data/articles';
import { getArticles } from '../api/strapi/articles';
import type { Article } from '../types/article';
import { ArticleGrid } from '../components/ArticleGrid';
import { CategoryFilter } from '../components/CategoryFilter';
import './Articles.css';

export function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState<Article[]>(legacyArticles);

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

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category))).sort();
    return cats;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') {
      return articles;
    }
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div className="articles-page">
      <section className="articles-header">
        <h1>All Articles</h1>
        <p>Stories, ideas and perspectives worth spending a few minutes with.</p>
      </section>

      <section className="articles-filter">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      <section className="articles-content">
        <ArticleGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
