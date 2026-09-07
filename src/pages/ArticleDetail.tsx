import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { articles as legacyArticles } from '../data/articles';
import { getArticleBySlug, getArticles } from '../api/strapi/articles';
import type { Article } from '../types/article';
import { ArticleContent } from '../components/ArticleContent';
import { RelatedArticles } from '../components/RelatedArticles';
import { ShareArticle } from '../components/ShareArticle';
import './ArticleDetail.css';

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadArticle() {
      try {
        const result = slug ? await getArticleBySlug(slug) : null;
        const nextArticle = result ?? legacyArticles.find((item) => item.slug === slug) ?? null;

        if (isMounted) {
          setArticle(nextArticle);
        }

        if (nextArticle) {
          const allArticles = await getArticles();
          if (isMounted) {
            setRelatedArticles(
              allArticles.filter((item) => item.category === nextArticle.category && item.id !== nextArticle.id).slice(0, 3)
            );
          }
        }
      } catch {
        const fallback = legacyArticles.find((item) => item.slug === slug) ?? null;
        if (isMounted) {
          setArticle(fallback);
          setRelatedArticles(
            fallback ? legacyArticles.filter((item) => item.category === fallback.category && item.id !== fallback.id).slice(0, 3) : []
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return <div className="route-loading">Loading article…</div>;
  }

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

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
          <img src={article.image} alt={article.title} width={1200} height={700} loading="eager" decoding="async" />
        </div>

        <ArticleContent content={article.content} />
        <ShareArticle title={article.title} text={article.excerpt} />
      </article>

      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}
