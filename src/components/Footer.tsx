import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Africa Heritage News Network</h3>
            <p></p>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/about">About</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Africa Heritage News Network. All rights reserved.</p>
          <p>Designed by: <a href="https://www.banele.dev" target="_blank" className='banele' >www.banele.dev</a></p>
        </div>
      </div>
    </footer>
  );
}
