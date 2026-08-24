import type { Config, Context } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import { db, articles, isAdminRequest, toArticleRow } from './_shared/articles.ts';
import { validateArticle, type ArticleInput } from './_shared/validation.ts';

export default async (req: Request, context: Context) => {
  if (!isAdminRequest(req, context)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = context.params.slug;
  if (!slug) return Response.json({ error: 'Missing slug' }, { status: 400 });

  let input: ArticleInput;
  try {
    input = (await req.json()) as ArticleInput;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const payload = validateArticle(input, false);

    const [updated] = await db
      .update(articles)
      .set({
        title: payload.title,
        excerpt: payload.excerpt,
        category: payload.category,
        author: payload.author,
        publishedAt: payload.publishedAt,
        readingTime: payload.readingTime,
        featured: payload.featured,
        image: payload.image,
        originalUrl: payload.originalUrl ?? null,
        content: payload.content,
        updatedAt: new Date(),
      })
      .where(eq(articles.slug, slug))
      .returning();

    if (!updated) return Response.json({ error: 'Article not found' }, { status: 404 });
    return Response.json({ article: toArticleRow(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update article';
    return Response.json({ error: message }, { status: 400 });
  }
};

export const config: Config = {
  path: '/api/articles/:slug',
  method: 'PUT',
};
