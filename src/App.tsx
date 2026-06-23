import { type ReactElement, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import SideNavBar from '@/components/SideNavBar';
import TopNavBar from '@/components/TopNavBar';
import Blog from '@/pages/Blog';
import BlogWrite from '@/pages/BlogWrite';
import CurrentProjects from '@/pages/CurrentProjects';
import FilmRoom from '@/pages/FilmRoom';
import Home from '@/pages/Home';
import ImpactReport from '@/pages/ImpactReport';
import PlayerComps from '@/pages/PlayerComps';
import ScoutingReport from '@/pages/ScoutingReport';

function ScrollToTop(): null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function AppContent(): ReactElement {
  const location = useLocation();
  const showSideNav = location.pathname !== '/';

  return (
    <div className="site-shell min-h-screen flex flex-col">
      <ScrollToTop />
      <TopNavBar />
      <div className="relative flex-1">
        {showSideNav && <SideNavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scouting-report" element={<ScoutingReport />} />
          <Route path="/film-room" element={<FilmRoom />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/write" element={<BlogWrite />} />
          <Route path="/projects" element={<CurrentProjects />} />
          <Route path="/player-comps" element={<PlayerComps />} />
          <Route path="/impact-report" element={<ImpactReport />} />
          <Route path="*" element={<Home />} />
        </Routes>
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
