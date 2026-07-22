import { type ReactElement, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ensurePlausibleQueue,
  plausibleConfigured,
  trackMarketingPageview,
} from '@/lib/marketingAnalytics';

function isPublicMarketingPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/projects' ||
    pathname.startsWith('/projects/') ||
    pathname === '/scouting-report' ||
    pathname === '/film-room' ||
    pathname === '/blog' ||
    pathname === '/player-comps' ||
    pathname === '/impact-report'
  );
}

export default function MarketingInstrumentation(): ReactElement | null {
  const location = useLocation();
  const enabled = plausibleConfigured() && isPublicMarketingPath(location.pathname);

  useEffect(() => {
    if (!enabled) return;
    ensurePlausibleQueue();
    trackMarketingPageview();
  }, [enabled, location.pathname]);

  if (!enabled) return null;

  return (
    <script
      defer
      data-domain={import.meta.env.VITE_PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.manual.js"
    />
  );
}
