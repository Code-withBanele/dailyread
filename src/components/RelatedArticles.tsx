import type { Article } from '../data/articles';
import { ArticleCard } from './ArticleCard';
import './RelatedArticles.css';

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="related-articles">
      <h2>You Might Also Like</h2>
      <div className="related-grid">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
