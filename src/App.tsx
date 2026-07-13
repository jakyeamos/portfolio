import { lazy, Suspense, type ReactElement, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import TopNavBar from '@/components/TopNavBar';
import Home from '@/pages/Home';

const Blog = lazy(() => import('@/pages/Blog'));
const BlogWrite = import.meta.env.DEV ? lazy(() => import('@/pages/BlogWrite')) : null;
const CurrentProjects = lazy(() => import('@/pages/CurrentProjects'));
const FilmRoom = lazy(() => import('@/pages/FilmRoom'));
const ImpactReport = lazy(() => import('@/pages/ImpactReport'));
const PlayerComps = lazy(() => import('@/pages/PlayerComps'));
const ScoutingReport = lazy(() => import('@/pages/ScoutingReport'));

function ScrollToTop(): null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function AppContent(): ReactElement {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <ScrollToTop />
      <TopNavBar />
      <div className="relative flex-1">
        <Suspense
          fallback={
            <main className="page-wrap py-8" aria-live="polite">
              <div className="editorial-card p-6 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                Loading dossier…
              </div>
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scouting-report" element={<ScoutingReport />} />
            <Route path="/film-room" element={<FilmRoom />} />
            <Route path="/blog" element={<Blog />} />
            {BlogWrite ? <Route path="/blog/write" element={<BlogWrite />} /> : null}
            <Route path="/projects" element={<CurrentProjects />} />
            <Route path="/player-comps" element={<PlayerComps />} />
            <Route path="/impact-report" element={<ImpactReport />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
