import type { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { QUICK_LINKS, SITE_META } from '@/content/portfolioContent';

export default function Footer(): ReactElement {
  const location = useLocation();
  const showSideNavOffset = location.pathname !== '/';

  return (
    <footer
      className={`mt-16 border-t border-[color:var(--color-line-strong)] bg-[color:var(--color-surface-raised)] px-4 py-12 sm:px-6 ${
        showSideNavOffset ? 'lg:ml-72' : ''
      }`}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
              Final Buzzer
            </div>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none text-[color:var(--color-ink)]">
              {SITE_META.brand}
            </h2>
          </div>

          <div className="grid gap-3">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                download={link.download ? (link.downloadFileName ?? true) : undefined}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="flex items-center justify-between border border-[color:var(--color-line)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                <span>{link.label}</span>
                <span>{link.detail}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[color:var(--color-line)] pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 Front Office // Amos</span>
          <span>
            {SITE_META.role} | {SITE_META.location}
          </span>
        </div>
      </div>
    </footer>
  );
}
