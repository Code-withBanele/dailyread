import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { isAdminRequest } from './_shared/articles.ts';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

function randomKey(ext: string): string {
  const id = crypto.randomUUID();
  return `uploads/${id}.${ext}`;
}

export default async (req: Request, context: Context) => {
  if (!isAdminRequest(req, context)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = (req.headers.get('content-type') ?? '').toLowerCase();
  if (!contentType.startsWith('multipart/form-data')) {
    return Response.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return Response.json({ error: 'Missing "file" field' }, { status: 400 });
    }

    if (file.type && !ALLOWED.has(file.type)) {
      return Response.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    const ext = EXT_BY_TYPE[file.type] ?? 'jpg';
    const key = randomKey(ext);
    const arrayBuffer = await file.arrayBuffer();

    const store = getStore('article-images');
    await store.set(key, new Uint8Array(arrayBuffer), {
      metadata: { contentType: file.type || 'image/jpeg', name: file.name },
    });

    return Response.json({ key, url: `/api/images/${key}` }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: ['/api/images', '/api/images/'],
  method: 'POST',
};
