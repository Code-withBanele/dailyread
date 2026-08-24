import { articles } from '../data/articles';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { ArticleGrid } from '../components/ArticleGrid';
import './Home.css';

export function Home() {
  const featuredArticle = articles.find((a) => a.featured);
  const latestArticles = articles.slice(0, 6);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-tagline">Read Something Worth Your Time.</p>
        </div>
      </section>

      {featuredArticle && (
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
