import type { Context } from '@netlify/functions';
import { eq, desc } from 'drizzle-orm';
import { db } from './database/client.ts';
import { articles } from './database/schema.ts';
import type { DbArticle } from './database/schema.ts';
import { ensureSchema } from './database/migrate.ts';

export { db, articles, ensureSchema };
export type { DbArticle, Context };

export type ArticleRow = Omit<DbArticle, 'publishedAt' | 'content'> & {
  publishedAt: string;
  content: unknown[];
};

export function toArticleRow(row: DbArticle): ArticleRow {
  return {
    ...row,
    publishedAt: row.publishedAt
      ? typeof row.publishedAt === 'string'
        ? row.publishedAt
        : (row.publishedAt as Date).toISOString().slice(0, 10)
      : '',
    content: Array.isArray(row.content) ? (row.content as unknown[]) : [],
  };
}

export async function listArticles(): Promise<ArticleRow[]> {
  await ensureSchema();
  const rows = await db.select().from(articles).orderBy(desc(articles.publishedAt));
  return rows.map(toArticleRow);
}

export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  await ensureSchema();
  const rows = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return rows.length ? toArticleRow(rows[0]!) : null;
}

export async function getArticlesByCategory(category: string): Promise<ArticleRow[]> {
  await ensureSchema();
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.category, category))
    .orderBy(desc(articles.publishedAt));
  return rows.map(toArticleRow);
}

const ADMIN_TOKEN = Netlify.env.get('ADMIN_TOKEN');
const AUTH_HEADER = 'x-admin-token';

export function isAdminRequest(req: Request, context: Context): boolean {
  if (ADMIN_TOKEN && req.headers.get(AUTH_HEADER) === ADMIN_TOKEN) return true;
  if (ADMIN_TOKEN && context?.cookies?.get?.(AUTH_HEADER) === ADMIN_TOKEN) return true;
  return false;
}
