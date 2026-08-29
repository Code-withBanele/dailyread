import { Link } from 'react-router-dom';
import type { Article } from '../data/articles';
import './FeaturedArticle.css';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Link to={`/article/${article.slug}`} className="featured-article-link">
      <article className="featured-article">
        <div className="featured-article-image">
          <img src={article.image} alt={article.title} width={1200} height={700} loading="eager" decoding="async" />
        </div>
        <div className="featured-article-content">
          <p className="featured-category">{article.category}</p>
          <h1 className="featured-title">{article.title}</h1>
          <p className="featured-excerpt">{article.excerpt}</p>
          <div className="featured-metadata">
            <span className="featured-author">By {article.author}</span>
            <span className="featured-date">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="featured-reading-time">{article.readingTime}</span>
          </div>
          <div className="featured-cta">
            <span>Read Article →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
