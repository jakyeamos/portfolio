import { lazy, Suspense, type ReactElement, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import MarketingInstrumentation from '@/components/MarketingInstrumentation';
import TopNavBar from '@/components/TopNavBar';
import { EasterEggProvider, useEasterEggs } from '@/features/easter-eggs/EasterEggProvider';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

const Blog = lazy(() => import('@/pages/Blog'));
const BlogWrite = import.meta.env.DEV ? lazy(() => import('@/pages/BlogWrite')) : null;
const CurrentProjects = lazy(() => import('@/pages/CurrentProjects'));
const Demos = lazy(() => import('@/pages/Demos'));
const FilmRoom = lazy(() => import('@/pages/FilmRoom'));
const ClipReview = import.meta.env.DEV ? lazy(() => import('@/pages/ClipReview')) : null;
const ImpactReport = lazy(() => import('@/pages/ImpactReport'));
const PlayerComps = lazy(() => import('@/pages/PlayerComps'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const ScoutingReport = lazy(() => import('@/pages/ScoutingReport'));

function ScrollToTop(): null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function AppContent(): ReactElement {
  const { isNightShift } = useEasterEggs();
  const location = useLocation();
  const taskState =
    {
      '/': 'home_ready',
      '/film-room': 'film_room_ready',
      '/projects': 'project_roster_ready',
      '/scouting-report': 'scouting_report_ready',
      '/impact-report': 'impact_report_ready',
    }[location.pathname] ?? 'route_ready';

  return (
    <div
      className={`site-shell min-h-screen flex flex-col ${isNightShift ? 'night-shift' : ''}`}
      data-mac-control-id="portfolio.app"
      data-task-state={taskState}
    >
      <ScrollToTop />
      <MarketingInstrumentation />
      <TopNavBar />
      <div className="relative flex-1">
        <Suspense
          fallback={
            <main
              className="page-wrap py-8"
              aria-live="polite"
              data-mac-control-id="portfolio.route.loading"
              data-task-state="loading"
            >
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
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/demos" element={<Demos />} />
            {ClipReview ? <Route path="/__clip-review" element={<ClipReview />} /> : null}
            <Route path="/player-comps" element={<PlayerComps />} />
            <Route path="/impact-report" element={<ImpactReport />} />
            <Route path="*" element={<NotFound />} />
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
      <EasterEggProvider>
        <AppContent />
      </EasterEggProvider>
    </BrowserRouter>
  );
}
