import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const TYPE_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const key = url.pathname.replace(/^\/api\/images\//, '');
  if (!key) return new Response('Not found', { status: 404 });

  try {
    const store = getStore('article-images');
    const blob = await store.get(key, { type: 'blob' });
    if (!blob) return new Response('Not found', { status: 404 });

    const ext = key.split('.').pop()?.toLowerCase() ?? '';
    const type = TYPE_BY_EXT[ext] ?? 'application/octet-stream';

    let metadata: { contentType?: string } | null = null;
    try {
      metadata = await store.getMetadata(key);
    } catch {
      metadata = null;
    }

    return new Response(blob, {
      headers: {
        'Content-Type': metadata?.contentType ?? type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load image';
    return new Response(message, { status: 500 });
  }
};

export const config: Config = {
  path: '/api/images/*',
  method: 'GET',
};
