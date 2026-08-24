import type { Config, Context } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import { db, articles, isAdminRequest } from './_shared/articles.ts';

export default async (req: Request, context: Context) => {
  if (!isAdminRequest(req, context)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = context.params.slug;
  if (!slug) return Response.json({ error: 'Missing slug' }, { status: 400 });

  try {
    const [deleted] = await db.delete(articles).where(eq(articles.slug, slug)).returning({ slug: articles.slug });
    if (!deleted) return Response.json({ error: 'Article not found' }, { status: 404 });
    return Response.json({ ok: true, slug: deleted.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete article';
    return Response.json({ error: message }, { status: 400 });
  }
};

export const config: Config = {
  path: '/api/articles/:slug',
  method: 'DELETE',
};
