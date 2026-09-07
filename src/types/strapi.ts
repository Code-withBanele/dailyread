export interface StrapiImageFormat {
  url?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface StrapiMedia {
  id?: number;
  documentId?: string;
  url?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiAuthor {
  id?: number;
  documentId?: string;
  name?: string;
  displayName?: string;
  bio?: string;
  role?: string;
  profileImage?: StrapiMedia | null;
  expertise?: string[];
  socialLinks?: Array<{ label?: string; url?: string }>;
  slug?: string;
}

export interface StrapiCategory {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
  description?: string;
}

export interface StrapiTag {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
}

export interface StrapiArticle {
  id?: number;
  documentId?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  content?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  status?: string;
  readTime?: string;
  readingTime?: string;
  seoTitle?: string;
  seoDescription?: string;
  heroImage?: StrapiMedia | null;
  image?: StrapiMedia | null;
  socialImage?: StrapiMedia | null;
  category?: StrapiCategory | null;
  tags?: StrapiTag[];
  author?: StrapiAuthor | null;
  contentType?: string;
  imageCaption?: string;
  imageCredit?: string;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page?: number;
      pageSize?: number;
      pageCount?: number;
      total?: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
}
