import type { Config, Context } from '@netlify/functions';
import { db, articles, ensureSchema, isAdminRequest } from './_shared/articles.ts';
import seedData from './_shared/seed.json' with { type: 'json' };

type SeedArticle = {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  author?: string;
  publishedAt: string;
  readingTime?: string;
  featured?: boolean;
  image?: string;
  originalUrl?: string;
  content?: unknown[];
};

const seedArticles = seedData as SeedArticle[];

function toInsert(a: SeedArticle) {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    author: a.author ?? '',
    publishedAt: a.publishedAt,
    readingTime: a.readingTime ?? '',
    featured: Boolean(a.featured),
    image: a.image ?? '',
    originalUrl: a.originalUrl ?? null,
    content: Array.isArray(a.content) ? (a.content as unknown[]) : [],
  };
}

export default async (req: Request, context: Context) => {
  if (!isAdminRequest(req, context)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureSchema();

    const existingSlugs = await db.select({ slug: articles.slug }).from(articles);
    const existing = new Set(existingSlugs.map((r) => r.slug));

    const toAdd = seedArticles.filter((a) => !existing.has(a.slug));
    if (!toAdd.length) {
      return Response.json({ ok: true, added: 0, skipped: seedArticles.length, message: 'All seed articles already present' });
    }

    const rows = toAdd.map(toInsert);
    await db.insert(articles).values(rows);

    return Response.json({ ok: true, added: rows.length, skipped: existing.size });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to seed articles';
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/seed',
  method: 'POST',
};
