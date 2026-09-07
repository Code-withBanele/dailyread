import { useEffect, useState } from 'react';
import { articles as legacyArticles } from '../data/articles';
import { getArticles } from '../api/strapi/articles';
import type { Article } from '../types/article';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { ArticleGrid } from '../components/ArticleGrid';
import './Home.css';

export function Home() {
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

  const featuredArticles = articles.filter((article) => article.featured);
  const latestArticles = articles.slice(0, 6);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-tagline">Read Something Worth Your Time.</p>
        </div>
      </section>

      {featuredArticles.length > 0 && (
        <section className="featured-section" aria-label="Featured articles">
          <div className="featured-rail">
            {featuredArticles.map((article) => (
              <FeaturedArticle key={article.id} article={article} />
            ))}
          </div>
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
