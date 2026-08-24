import { pgTable, uuid, text, boolean, date, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull().default(''),
  category: text('category').notNull(),
  author: text('author').notNull().default(''),
  publishedAt: date('published_at').notNull(),
  readingTime: text('reading_time').notNull().default(''),
  featured: boolean('featured').notNull().default(false),
  image: text('image').notNull().default(''),
  originalUrl: text('original_url'),
  content: jsonb('content').notNull().$type<unknown[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type DbArticle = typeof articles.$inferSelect;
export type NewDbArticle = typeof articles.$inferInsert;
