export type ArticleBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; level: 2 | 3; content: string }
  | { type: 'image'; src?: string; value?: string; alt?: string; caption?: string }
  | { type: 'quote'; content: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'heading2' | 'heading3' | 'bold' | 'italic' | 'blockquote'; value: string }
  | { type: 'list'; items: string[]; ordered?: boolean };

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  image: string;
  originalUrl?: string;
  content: (string | ArticleBlock)[];
}
