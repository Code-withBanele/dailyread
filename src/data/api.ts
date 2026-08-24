import type { Article } from '../types/article';

const BASE = '/api';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export interface ListResponse {
  articles: Article[];
}

export interface OneResponse {
  article: Article;
}

export async function fetchArticles(category?: string): Promise<Article[]> {
  const url = category ? `${BASE}/articles?category=${encodeURIComponent(category)}` : `${BASE}/articles`;
  return handle<ListResponse>(await fetch(url)).then((r) => r.articles);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(`${BASE}/articles/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  return handle<OneResponse>(res).then((r) => r.article);
}

export function adminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export async function adminRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const token = adminToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('x-admin-token', token);
  return fetch(`${BASE}${path}`, { ...init, headers });
}

export interface AdminArticleInput {
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

export async function createArticle(input: AdminArticleInput): Promise<Article> {
  return handle<OneResponse>(
    await adminRequest('/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  ).then((r) => r.article);
}

export async function updateArticle(slug: string, input: AdminArticleInput): Promise<Article> {
  return handle<OneResponse>(
    await adminRequest(`/articles/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  ).then((r) => r.article);
}

export async function deleteArticle(slug: string): Promise<void> {
  const res = await adminRequest(`/articles/${encodeURIComponent(slug)}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Failed to delete (${res.status})`);
  }
}

export async function uploadImage(file: File): Promise<{ key: string; url: string }> {
  const form = new FormData();
  form.append('file', file);
  const res = await adminRequest('/images', { method: 'POST', body: form });
  return handle<{ key: string; url: string }>(res);
}

export async function seedArticlesFromRepo(): Promise<{ added: number; skipped: number }> {
  const res = await adminRequest('/seed', { method: 'POST' });
  return handle<{ added: number; skipped: number }>(res);
}
