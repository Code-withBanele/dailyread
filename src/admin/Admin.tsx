import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Article } from '../types/article';
import { fetchArticles, fetchArticleBySlug } from '../data/api';
import { clearStoredToken, isAuthenticated } from './auth';
import { AdminLogin } from './AdminLogin';
import { AdminList } from './AdminList';
import { AdminEditor } from './AdminEditor';
import './Admin.css';

export function Admin() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchArticles();
      setArticles(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadList();
  }, [authed]);

  if (!authed) {
    return <AdminLogin onAuthed={() => setAuthed(true)} />;
  }

  const logout = () => {
    clearStoredToken();
    setAuthed(false);
    navigate('/admin');
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link to="/admin/articles" className="admin-topbar-title">Daily Read · Admin</Link>
        <nav className="admin-topbar-nav">
          <Link to="/admin/articles">Articles</Link>
          <Link to="/admin/articles/new">New</Link>
          <button type="button" className="link-button" onClick={logout}>Sign out</button>
        </nav>
      </header>

      <Routes>
        <Route path="articles" element={
          <AdminList
            articles={articles}
            loading={loading}
            error={error}
            onReload={loadList}
          />
        } />
        <Route path="articles/new" element={
          <AdminEditor
            onSaved={(saved) => {
              setArticles((prev) => {
                const i = prev.findIndex((a) => a.id === saved.id);
                if (i === -1) return [saved, ...prev];
                const next = prev.slice();
                next[i] = saved;
                return next;
              });
              loadList();
            }}
          />
        } />
        <Route path="articles/:slug" element={<AdminEditLoader articles={articles} onChanged={loadList} />} />
        <Route path="*" element={<Navigate to="/admin/articles" replace />} />
      </Routes>
    </div>
  );
}

function AdminEditLoader({ articles, onChanged }: { articles: Article[]; onChanged: () => void }) {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      return;
    }
    const cached = articles.find((a) => a.slug === slug);
    if (cached) {
      setArticle(cached);
      return;
    }
    let active = true;
    setArticle(undefined);
    fetchArticleBySlug(slug)
      .then((a) => {
        if (active) setArticle(a ?? null);
      })
      .catch(() => {
        if (active) setArticle(null);
      });
    return () => {
      active = false;
    };
  }, [slug, articles]);

  if (article === undefined) return <p className="loading-message">Loading article…</p>;
  if (article === null) return <Navigate to="/admin/articles" replace />;

  return (
    <AdminEditor
      article={article}
      onSaved={() => {
        onChanged();
        navigate('/admin/articles');
      }}
      onDeleted={() => {
        onChanged();
      }}
    />
  );
}
