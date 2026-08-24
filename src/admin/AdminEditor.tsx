import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/article';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  seedArticlesFromRepo,
  type AdminArticleInput,
} from '../data/api';
import { BlockEditor, type ContentBlock } from './BlockEditor';
import { ImageUpload } from './ImageUpload';
import './Admin.css';

interface AdminEditorProps {
  article?: Article;
  onSaved?: (article: Article) => void;
  onDeleted?: (slug: string) => void;
}

const EMPTY: AdminArticleInput = {
  slug: '',
  title: '',
  excerpt: '',
  category: 'Opinion',
  author: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  readingTime: '5 min read',
  featured: false,
  image: '',
  originalUrl: '',
  content: [],
};

export function AdminEditor({ article, onSaved, onDeleted }: AdminEditorProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminArticleInput>(EMPTY);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setForm({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        author: article.author,
        publishedAt: article.publishedAt,
        readingTime: article.readingTime,
        featured: article.featured,
        image: article.image,
        originalUrl: article.originalUrl ?? '',
        content: article.content,
      });
      setBlocks(article.content);
    } else {
      setForm({ ...EMPTY, publishedAt: new Date().toISOString().slice(0, 10) });
      setBlocks([]);
    }
  }, [article]);

  const setField = <K extends keyof AdminArticleInput>(key: K, value: AdminArticleInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const slugify = (value: string) =>
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'article';

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload: AdminArticleInput = {
        ...form,
        slug: form.slug?.trim() || slugify(form.title ?? ''),
        content: blocks,
      };
      const saved = article
        ? await updateArticle(article.slug, payload)
        : await createArticle(payload);
      onSaved?.(saved);
      setMessage(article ? 'Article updated.' : 'Article created.');
      if (!article) navigate(`/admin/articles/${saved.slug}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!article) return;
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    try {
      await deleteArticle(article.slug);
      onDeleted?.(article.slug);
      navigate('/admin/articles', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setSaving(false);
    }
  };

  const seed = async () => {
    setSeeding(true);
    setError(null);
    setMessage(null);
    try {
      const result = await seedArticlesFromRepo();
      setMessage(`Seeded ${result.added} article(s); skipped ${result.skipped} that already existed.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-page admin-editor">
      <div className="admin-editor-header">
        <h1>{article ? 'Edit Article' : 'New Article'}</h1>
        <div className="admin-editor-actions">
          <button type="button" onClick={() => navigate('/admin/articles')} className="link-button">← Back to list</button>
          {article && <button type="button" onClick={remove} className="danger" disabled={saving}>Delete</button>}
        </div>
      </div>

      <form onSubmit={save} className="admin-form">
        <div className="admin-field">
          <label>Title</label>
          <input
            type="text"
            value={form.title ?? ''}
            onChange={(e) => setField('title', e.target.value)}
            required
          />
        </div>

        <div className="admin-field-row">
          <div className="admin-field">
            <label>Slug</label>
            <input
              type="text"
              value={form.slug ?? ''}
              onChange={(e) => setField('slug', e.target.value)}
              placeholder={form.title ? slugify(form.title) : 'auto-from-title'}
            />
          </div>
          <div className="admin-field">
            <label>Category</label>
            <input
              type="text"
              list="admin-categories"
              value={form.category ?? ''}
              onChange={(e) => setField('category', e.target.value)}
              required
            />
            <datalist id="admin-categories">
              <option value="Opinion" />
              <option value="Economy" />
              <option value="Culture" />
              <option value="Geopolitics" />
              <option value="Technology" />
              <option value="Business" />
              <option value="Lifestyle" />
              <option value="Ideas" />
              <option value="World" />
            </datalist>
          </div>
        </div>

        <div className="admin-field-row">
          <div className="admin-field">
            <label>Author</label>
            <input
              type="text"
              value={form.author ?? ''}
              onChange={(e) => setField('author', e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Published date</label>
            <input
              type="date"
              value={form.publishedAt ?? ''}
              onChange={(e) => setField('publishedAt', e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label>Reading time</label>
            <input
              type="text"
              value={form.readingTime ?? ''}
              onChange={(e) => setField('readingTime', e.target.value)}
              placeholder="5 min read"
            />
          </div>
        </div>

        <div className="admin-field">
          <label>Excerpt</label>
          <textarea
            value={form.excerpt ?? ''}
            onChange={(e) => setField('excerpt', e.target.value)}
            rows={2}
          />
        </div>

        <ImageUpload
          value={form.image ?? ''}
          onChange={(value) => setField('image', value)}
          label="Featured image"
        />

        <div className="admin-field">
          <label>Original URL (optional)</label>
          <input
            type="url"
            value={form.originalUrl ?? ''}
            onChange={(e) => setField('originalUrl', e.target.value)}
            placeholder="https://…"
          />
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => setField('featured', e.target.checked)}
          />
          Featured on home page
        </label>

        <div className="admin-field">
          <label>Content blocks</label>
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {error && <p className="admin-error">{error}</p>}
        {message && <p className="admin-message">{message}</p>}

        <div className="admin-form-actions">
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : article ? 'Save changes' : 'Create article'}</button>
          {!article && (
            <button type="button" onClick={seed} disabled={seeding}>
              {seeding ? 'Seeding existing articles…' : 'Seed existing articles into the database'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
