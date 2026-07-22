import { type ReactElement, useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { PAGE_LINKS, QUICK_LINKS, SITE_META } from '@/content/portfolioContent';
import { useEasterEggs } from '@/features/easter-eggs/EasterEggProvider';
import { trackMarketingLinkClick } from '@/lib/marketingAnalytics';

function QuickActionLink({
  href,
  label,
  download = false,
  downloadFileName,
}: {
  href: string;
  label: string;
  download?: boolean;
  downloadFileName?: string;
}): ReactElement {
  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      download={download ? (downloadFileName ?? true) : undefined}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      onClick={() => trackMarketingLinkClick(href)}
      className="hidden items-center gap-2 border border-[color:var(--color-line-strong)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] xl:inline-flex"
    >
      {label}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

export default function TopNavBar(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { openEgg } = useEasterEggs();
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape' || !isMenuOpen) return;

      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-raised)]">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0 shrink-0">
          <button
            type="button"
            className="after-hours-hotspot block text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]"
            aria-label="Open Build Ship from the 2026 Draft Desk"
            data-easter-egg="build-ship"
            onClick={(event) => openEgg('build-ship', event.currentTarget)}
          >
            2026 Draft Desk
          </button>
          <NavLink
            to="/"
            className="block text-2xl font-black uppercase tracking-[-0.02em] text-[color:var(--color-ink)]"
            aria-label="Front Office Amos home"
          >
            {SITE_META.brand}
          </NavLink>
        </div>

        <nav className="hidden min-w-0 items-center gap-4 xl:flex xl:gap-5" aria-label="Primary">
          {PAGE_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] xl:text-[13px] ${
                  isActive
                    ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                    : 'border-transparent text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-primary)]'
                }`
              }
            >
              {'shortLabel' in link ? link.shortLabel : link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <QuickActionLink
            href={QUICK_LINKS[0].href}
            label={QUICK_LINKS[0].label}
            download={QUICK_LINKS[0].download}
            downloadFileName={QUICK_LINKS[0].downloadFileName}
          />
          <QuickActionLink href={QUICK_LINKS[3].href} label={QUICK_LINKS[3].label} />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] xl:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id={menuId}
          className="border-t border-[color:var(--color-line)] bg-[color:var(--color-surface-raised)] px-4 py-6 sm:px-6 xl:hidden"
        >
          <nav className="mx-auto grid max-w-[1440px] gap-1" aria-label="Mobile primary">
            {PAGE_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `border-b px-1 py-3 text-base font-bold uppercase tracking-[0.14em] ${
                    isActive
                      ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)]'
                      : 'border-[color:var(--color-line)] text-[color:var(--color-ink)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mx-auto mt-6 grid max-w-[1440px] gap-3 border-t border-[color:var(--color-line)] pt-6 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => {
              const isExternal = link.href.startsWith('http');

              return (
                <a
                  key={link.label}
                  href={link.href}
                  download={link.download ? (link.downloadFileName ?? true) : undefined}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  onClick={() => trackMarketingLinkClick(link.href)}
                  className="flex items-center justify-between border border-[color:var(--color-line)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--color-ink)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  {link.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
