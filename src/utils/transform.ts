import type { Article, ArticleBlock } from '../types/article';
import type { StrapiArticle } from '../types/strapi';
import { resolveStrapiMediaUrl } from './media';

export function normalizeStrapiArticle(item: StrapiArticle | null | undefined): Article | null {
  if (!item) {
    return null;
  }

  const title = item.title ?? 'Untitled article';
  const excerpt = item.excerpt ?? '';
  const body = item.body ?? item.content ?? '';
  const resolvedImage = resolveStrapiMediaUrl(item.heroImage ?? item.image ?? item.socialImage ?? null);
  const heroMedia = item.heroImage ?? item.image ?? item.socialImage ?? null;

  const content: Array<string | ArticleBlock> = body
    ? [
        {
          type: 'paragraph',
          content: body,
        },
      ]
    : [
        {
          type: 'paragraph',
          content: excerpt,
        },
      ];

  return {
    id: String(item.id ?? item.documentId ?? title),
    slug: item.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    excerpt,
    category: item.category?.name ?? 'Ideas',
    author: item.author?.displayName ?? item.author?.name ?? 'AHNN Editorial',
    publishedAt: item.publishedAt ?? new Date().toISOString(),
    readingTime: item.readingTime ?? item.readTime ?? '5 min read',
    featured: Boolean(item.featured),
    image: resolvedImage,
    imageAlt: heroMedia?.alternativeText ?? title,
    imageCaption: heroMedia?.caption ?? item.imageCaption ?? '',
    imageCredit: item.imageCredit ?? '',
    content,
  };
}
