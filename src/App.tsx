import { lazy, Suspense, useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import './App.css';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Articles = lazy(() => import('./pages/Articles').then((module) => ({ default: module.Articles })));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail').then((module) => ({ default: module.ArticleDetail })));
const Categories = lazy(() => import('./pages/Categories').then((module) => ({ default: module.Categories })));
const Search = lazy(() => import('./pages/Search').then((module) => ({ default: module.Search })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Africa Heritage News Network | AHNN',
    description:
      'Africa Heritage News Network delivers news, features, and insights focused on African stories, culture, and current affairs.',
  },
  '/articles': {
    title: 'Latest Articles | Africa Heritage News Network',
    description: 'Browse the latest articles, news, and commentary from Africa Heritage News Network.',
  },
  '/categories': {
    title: 'Categories | Africa Heritage News Network',
    description: 'Explore categories and topics covered by Africa Heritage News Network.',
  },
  '/search': {
    title: 'Search Articles | Africa Heritage News Network',
    description: 'Search Africa Heritage News Network for stories, insights, and analysis across topics.',
  },
  '/about': {
    title: 'About | Africa Heritage News Network',
    description: 'Learn more about Africa Heritage News Network and our mission to tell African stories.',
  },
};

function AppContent() {
  const [appReady, setAppReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://www.africaheritagenewsnetwork.com';
    const pathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');
    const metadata = routeMetadata[pathname] ?? routeMetadata['/articles'];

    document.title = metadata.title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', metadata.description);
    }

    const canonicalTag = document.querySelector('link[rel="canonical"]') ?? document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    canonicalTag.setAttribute('href', `${baseUrl}${pathname === '/' ? '' : pathname}`);
    if (!canonicalTag.parentNode) {
      document.head.appendChild(canonicalTag);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.setAttribute('content', metadata.title);
    if (ogDescription) ogDescription.setAttribute('content', metadata.description);
    if (ogUrl) ogUrl.setAttribute('content', `${baseUrl}${pathname === '/' ? '' : pathname}`);
  }, [location.pathname]);

  return (
    <>
      {!appReady && <Preloader onReady={() => setAppReady(true)} />}
      <div className="app" style={{ opacity: appReady ? 1 : 0 }}>
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<div className="route-loading">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/article/:slug" element={<ArticleDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/articles" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Analytics />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
