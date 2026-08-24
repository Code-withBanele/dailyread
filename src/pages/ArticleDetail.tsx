import { useParams, Navigate } from 'react-router-dom';
import { articles } from '../data/articles';
import { ArticleContent } from '../components/ArticleContent';
import { RelatedArticles } from '../components/RelatedArticles';
import './ArticleDetail.css';

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/articles" />;
  }

  const relatedArticles = articles.filter(
    (a) => a.category === article.category && a.id !== article.id
  );

  const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="article-detail">
      <article className="article-wrapper">
        <section className="article-header">
          <p className="article-category-badge">{article.category}</p>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.excerpt}</p>

          <div className="article-meta">
            <span className="article-author">By {article.author}</span>
            <span className="article-separator">·</span>
            <span className="article-date">{publishDate}</span>
            <span className="article-separator">·</span>
            <span className="article-time">{article.readingTime}</span>
          </div>
        </section>

        <div className="article-featured-image">
          <img src={article.image} alt={article.title} />
        </div>

        <ArticleContent content={article.content} />
      </article>

      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}
