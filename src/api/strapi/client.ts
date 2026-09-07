export const STRAPI_BASE_URL = (import.meta.env.VITE_STRAPI_URL ?? '').replace(/\/$/, '');
const STRAPI_API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN ?? '';
export const HAS_STRAPI_CONFIG = Boolean(STRAPI_BASE_URL);

export interface StrapiQueryParams {
  [key: string]: string | number | boolean | undefined;
}

export async function strapiRequest<T>(path: string, query: StrapiQueryParams = {}): Promise<T> {
  if (!HAS_STRAPI_CONFIG) {
    throw new Error('Missing VITE_STRAPI_URL. Configure the Strapi base URL in your environment.');
  }

  const url = new URL(`/api/${path.replace(/^\/+/, '')}`, `${STRAPI_BASE_URL}/`);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed for ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}
