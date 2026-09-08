import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AHNN
        </Link>
        <p className="navbar-tagline">Stories that Move The Continent.</p>

        <button
          type="button"
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/search" className="search-icon desktop-search" aria-label="Search">
          ⌕
        </Link>
      </div>

      <div className="navbar-links-container">
        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/articles"
            className={`nav-link ${isActive('/articles')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Articles
          </Link>
          <Link
            to="/categories"
            className={`nav-link ${isActive('/categories')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/search"
            className="nav-link mobile-search"
            onClick={() => setMobileMenuOpen(false)}
          >
            ⌕ Search
          </Link>
        </div>
      </div>
    </nav>
  );
}
