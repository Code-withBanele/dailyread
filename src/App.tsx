import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <Router>
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
      </div>
    </Router>
  );
}

export default App;
