import type { Config, Context } from '@netlify/functions';
import { getArticleBySlug } from './_shared/articles.ts';

export default async (req: Request, context: Context) => {
  const slug = context.params.slug;

  try {
    if (!slug) return Response.json({ error: 'Missing slug' }, { status: 400 });
    const article = await getArticleBySlug(slug);
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });
    return Response.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load article';
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/articles/:slug',
  method: 'GET',
};
