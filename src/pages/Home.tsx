import { useArticles } from '../hooks/useArticles';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { ArticleGrid } from '../components/ArticleGrid';
import './Home.css';

export function Home() {
  const { articles, loading, error } = useArticles();

  const featuredArticle = articles.find((a) => a.featured) ?? null;
  const latestArticles = articles.slice(0, 6);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-tagline">Read Something Worth Your Time.</p>
        </div>
      </section>

      {error && (
        <section className="featured-section">
          <p className="error-message">Couldn’t load articles: {error}</p>
        </section>
      )}

      {loading && (
        <section className="featured-section">
          <p className="loading-message">Loading articles…</p>
        </section>
      )}

      {!loading && featuredArticle && (
        <section className="featured-section">
          <FeaturedArticle article={featuredArticle} />
        </section>
      )}

      <section className="latest-section">
        <h2 className="section-heading">Latest Reads</h2>
        <p className="section-subheading">Stories, ideas and perspectives worth spending a few minutes with.</p>
        <ArticleGrid articles={latestArticles} />
      </section>
    </div>
  );
}
