import { Link } from 'react-router-dom';
import type { Article } from '../types/article';
import './Admin.css';

interface AdminListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
}

export function AdminList({ articles, loading, error, onReload }: AdminListProps) {
  return (
    <div className="admin-page admin-list">
      <div className="admin-list-header">
        <h1>Articles</h1>
        <div className="admin-list-actions">
          <button type="button" onClick={onReload} disabled={loading} className="link-button">
            {loading ? 'Loading…' : 'Reload'}
          </button>
          <Link to="/admin/articles/new" className="primary-button">+ New article</Link>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="loading-message">Loading articles…</p>}

      {!loading && articles.length === 0 && !error && (
        <div className="admin-empty">
          <p>No articles yet.</p>
          <Link to="/admin/articles/new" className="primary-button">Create your first article</Link>
        </div>
      )}

      {articles.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="admin-table-title">{article.title}</td>
                <td>{article.category}</td>
                <td>{article.author}</td>
                <td>{article.publishedAt}</td>
                <td>{article.featured ? 'Yes' : '—'}</td>
                <td className="admin-table-actions">
                  <Link to={`/admin/articles/${article.slug}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
