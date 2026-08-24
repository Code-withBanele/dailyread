import type { Article } from '../data/articles';
import { ArticleCard } from './ArticleCard';
import './ArticleGrid.css';

interface ArticleGridProps {
  articles: Article[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return <div className="no-articles">No articles found.</div>;
  }

  return (
    <div className="article-grid">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
