import { useState, useMemo } from 'react';
import { useArticles } from '../hooks/useArticles';
import { ArticleGrid } from '../components/ArticleGrid';
import { CategoryFilter } from '../components/CategoryFilter';
import './Categories.css';

export function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { articles, loading, error } = useArticles();

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

  const categoryDescription: Record<string, string> = {
    Culture: 'Explore stories about society, art, and human connection.',
    Technology: 'Insights into the digital world and technological innovation.',
    Business: 'Ideas about enterprise, economics, and organizational thinking.',
    Lifestyle: 'Perspectives on living well and making intentional choices.',
    Ideas: 'Deep dives into concepts that shape how we think.',
    Opinion: 'Thoughtful perspectives on current issues.',
    World: 'Stories from around the globe and beyond our borders.',
  };

  return (
    <div className="categories-page">
      <section className="categories-header">
        <h1>Categories</h1>
        <p>Explore articles by topic.</p>
      </section>

      {error && <p className="error-message">Couldn’t load articles: {error}</p>}
      {loading && <p className="loading-message">Loading articles…</p>}

      <section className="categories-filter">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {selectedCategory !== 'All' && categoryDescription[selectedCategory] && (
        <section className="category-description">
          <p>{categoryDescription[selectedCategory]}</p>
        </section>
      )}

      <section className="categories-content">
        <ArticleGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
