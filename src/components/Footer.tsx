import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>THE DAILY READ</h3>
            <p>Read Something Worth Your Time.</p>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/about">About</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 The Daily Read. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
