import { getDatabase } from '@netlify/database';

let applied = false;

export async function ensureSchema(): Promise<void> {
  if (applied) return;
  const { sql } = getDatabase();
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text NOT NULL UNIQUE,
      title text NOT NULL,
      excerpt text NOT NULL DEFAULT '',
      category text NOT NULL,
      author text NOT NULL DEFAULT '',
      published_at date NOT NULL,
      reading_time text NOT NULL DEFAULT '',
      featured boolean NOT NULL DEFAULT false,
      image text NOT NULL DEFAULT '',
      original_url text,
      content jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  applied = true;
}
