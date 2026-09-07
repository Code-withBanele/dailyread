import { articles as legacyArticles } from '../../data/articles';
import type { Article } from '../../types/article';
import type { StrapiArticle, StrapiListResponse } from '../../types/strapi';
import { strapiRequest, HAS_STRAPI_CONFIG } from './client';
import { normalizeStrapiArticle } from '../../utils/transform';

export async function getArticles(): Promise<Article[]> {
  if (!HAS_STRAPI_CONFIG) {
    return legacyArticles;
  }

  const response = await strapiRequest<StrapiListResponse<StrapiArticle>>('articles', {
    populate: '*',
  });

  return response.data
    .map((item) => normalizeStrapiArticle(item))
    .filter((item): item is Article => Boolean(item));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!HAS_STRAPI_CONFIG) {
    return legacyArticles.find((article) => article.slug === slug) ?? null;
  }

  const response = await strapiRequest<StrapiListResponse<StrapiArticle>>('articles', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });

  const article = response.data[0] ?? null;
  return normalizeStrapiArticle(article);
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!HAS_STRAPI_CONFIG || !query.trim()) {
    return legacyArticles.filter((article) =>
      [article.title, article.excerpt, article.author, article.category]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );
  }

  const response = await strapiRequest<StrapiListResponse<StrapiArticle>>('articles', {
    populate: '*',
    'filters[$or][0][title][$containsi]': query,
    'filters[$or][1][excerpt][$containsi]': query,
    'filters[$or][2][author][displayName][$containsi]': query,
    'filters[$or][3][category][name][$containsi]': query,
    'filters[$or][4][tags][name][$containsi]': query,
  });

  return response.data
    .map((item) => normalizeStrapiArticle(item))
    .filter((item): item is Article => Boolean(item));
}
