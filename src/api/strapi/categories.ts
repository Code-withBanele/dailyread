import { articles as legacyArticles } from '../../data/articles';
import type { Article } from '../../types/article';
import type { StrapiCategory, StrapiListResponse } from '../../types/strapi';
import { strapiRequest, HAS_STRAPI_CONFIG } from './client';
import { getArticles } from './articles';

export async function getCategories(): Promise<string[]> {
  if (!HAS_STRAPI_CONFIG) {
    return Array.from(new Set(legacyArticles.map((article) => article.category))).sort();
  }

  const response = await strapiRequest<StrapiListResponse<StrapiCategory>>('categories', {
    populate: '*',
  });

  return response.data.map((category) => category.name ?? 'Uncategorized').filter(Boolean);
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
  if (!HAS_STRAPI_CONFIG) {
    return legacyArticles.filter((article) => article.category === categoryName);
  }

  const articles = await getArticles();
  return articles.filter((article) => article.category === categoryName);
}
