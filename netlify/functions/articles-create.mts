import type { Config, Context } from '@netlify/functions';
import { eq } from 'drizzle-orm';
import { db, articles, ensureSchema, isAdminRequest, toArticleRow } from './_shared/articles.ts';
import { validateArticle, type ArticleInput } from './_shared/validation.ts';

export default async (req: Request, context: Context) => {
  if (!isAdminRequest(req, context)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let input: ArticleInput;
  try {
    input = (await req.json()) as ArticleInput;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const payload = validateArticle(input);

    const existing = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.slug, payload.slug)).limit(1);
    if (existing.length) {
      return Response.json({ error: 'An article with that slug already exists' }, { status: 409 });
    }

    await ensureSchema();
    const [created] = await db.insert(articles).values({
      slug: payload.slug,
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
    }).returning();

    return Response.json({ article: toArticleRow(created!) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create article';
    return Response.json({ error: message }, { status: 400 });
  }
};

export const config: Config = {
  path: ['/api/articles', '/api/articles/'],
  method: 'POST',
};
