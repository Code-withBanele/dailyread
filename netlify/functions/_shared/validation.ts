import type { ArticleRow } from './articles.ts';

export interface ArticleInput {
  slug?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  readingTime?: string;
  featured?: boolean;
  image?: string;
  originalUrl?: string;
  content?: unknown[];
}

export type ValidatedArticle = Omit<ArticleRow, 'id' | 'createdAt' | 'updatedAt'>;

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'article';
}

export function validateArticle(input: ArticleInput, requireAll = true): ValidatedArticle {
  const errors: string[] = [];

  const title = (input.title ?? '').trim();
  const slug = (input.slug ?? slugify(title)).trim() || slugify(title);
  const excerpt = (input.excerpt ?? '').trim();
  const category = (input.category ?? '').trim();
  const author = (input.author ?? '').trim();
  const publishedAt = (input.publishedAt ?? '').trim();
  const readingTime = (input.readingTime ?? '').trim();
  const featured = Boolean(input.featured);
  const image = (input.image ?? '').trim();
  const originalUrl = input.originalUrl?.trim() || null;
  const content = Array.isArray(input.content) ? input.content : [];

  if (!title) errors.push('title is required');
  if (!slug) errors.push('slug is required');
  if (!category) errors.push('category is required');
  if (requireAll && !publishedAt) errors.push('publishedAt is required');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) && publishedAt) {
    errors.push('publishedAt must be a YYYY-MM-DD date');
  }

  if (errors.length) {
    throw new Error(`Invalid article: ${errors.join('; ')}`);
  }

  return {
    slug,
    title,
    excerpt,
    category,
    author,
    publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
    readingTime: readingTime || '1 min read',
    featured,
    image,
    originalUrl,
    content,
  };
}
