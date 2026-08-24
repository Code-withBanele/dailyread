import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchArticleBySlug } from '../data/api';
import { useArticles } from '../hooks/useArticles';
import type { Article } from '../types/article';
import { ArticleContent } from '../components/ArticleContent';
import { RelatedArticles } from '../components/RelatedArticles';
import './ArticleDetail.css';

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setArticle(undefined);
    setNotFound(false);
    if (!slug) {
      setNotFound(true);
      return;
    }
    fetchArticleBySlug(slug)
      .then((a) => {
        if (!active) return;
        if (!a) setNotFound(true);
        else setArticle(a);
      })
      .catch(() => {
        if (active) setNotFound(true);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const { articles: all } = useArticles();

  if (notFound || article === null) {
    return <Navigate to="/articles" />;
  }

  if (article === undefined) {
    return (
      <div className="article-detail">
        <p className="loading-message">Loading article…</p>
      </div>
    );
  }

  const currentArticle: Article = article;
  const relatedArticles = all.filter(
    (a) => a.category === currentArticle.category && a.id !== currentArticle.id
  );

  const publishDate = new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="article-detail">
      <article className="article-wrapper">
        <section className="article-header">
          <p className="article-category-badge">{currentArticle.category}</p>
          <h1 className="article-title">{currentArticle.title}</h1>
          <p className="article-subtitle">{currentArticle.excerpt}</p>

          <div className="article-meta">
            <span className="article-author">By {currentArticle.author}</span>
            <span className="article-separator">·</span>
            <span className="article-date">{publishDate}</span>
            <span className="article-separator">·</span>
            <span className="article-time">{currentArticle.readingTime}</span>
          </div>
        </section>

        <div className="article-featured-image">
          <img src={currentArticle.image} alt={currentArticle.title} />
        </div>

        <ArticleContent content={currentArticle.content} />
      </article>

      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}
