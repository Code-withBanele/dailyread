import { Link } from 'react-router-dom';
import type { Article } from '../data/articles';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/article/${article.slug}`} className="article-card-link">
      <article className="article-card">
        <div className="article-card-image">
          <img src={article.image} alt={article.title} />
        </div>
        <div className="article-card-content">
          <p className="article-category">{article.category}</p>
          <h3 className="article-card-title">{article.title}</h3>
          <p className="article-excerpt">{article.excerpt}</p>
          <div className="article-metadata">
            <span className="article-author">By {article.author}</span>
            <span className="article-reading-time">{article.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
