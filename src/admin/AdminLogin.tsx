import { useState } from 'react';
import { setStoredToken } from './auth';
import './Admin.css';

interface AdminLoginProps {
  onAuthed: () => void;
}

export function AdminLogin({ onAuthed }: AdminLoginProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Enter the admin token.');
      return;
    }
    setSubmitting(true);
    setStoredToken(token.trim());
    setError(null);
    setSubmitting(false);
    onAuthed();
  };

  return (
    <div className="admin-page admin-login">
      <h1>Admin Sign In</h1>
      <p className="admin-hint">Enter the admin token to manage articles.</p>
      <form onSubmit={submit} className="admin-form">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          autoComplete="current-password"
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={submitting}>Sign in</button>
      </form>
    </div>
  );
}
