import type { Config, Context } from '@netlify/functions';
import { listArticles, getArticlesByCategory } from './_shared/articles.ts';

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');

  try {
    const rows = category
      ? await getArticlesByCategory(category)
      : await listArticles();
    return Response.json({ articles: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load articles';
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: ['/api/articles', '/api/articles/'],
  method: 'GET',
};
