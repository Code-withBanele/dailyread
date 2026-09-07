import type { StrapiMedia } from '../types/strapi';

export function resolveStrapiMediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media) {
    return '';
  }

  if (media.url) {
    if (/^https?:\/\//i.test(media.url)) {
      return media.url;
    }

    if (media.url.startsWith('/')) {
      return `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${media.url}`;
    }

    return media.url;
  }

  if (media.formats?.large?.url) {
    return resolveStrapiMediaUrl({ ...media, url: media.formats.large.url });
  }

  if (media.formats?.medium?.url) {
    return resolveStrapiMediaUrl({ ...media, url: media.formats.medium.url });
  }

  if (media.formats?.small?.url) {
    return resolveStrapiMediaUrl({ ...media, url: media.formats.small.url });
  }

  if (media.formats?.thumbnail?.url) {
    return resolveStrapiMediaUrl({ ...media, url: media.formats.thumbnail.url });
  }

  return '';
}
