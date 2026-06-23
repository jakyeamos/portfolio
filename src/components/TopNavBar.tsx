import { type ReactElement, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { PAGE_LINKS, QUICK_LINKS, SITE_META } from '@/content/portfolioContent';

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
  return (
    <a
      href={href}
      download={download ? (downloadFileName ?? true) : undefined}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="hidden items-center gap-2 border border-[color:var(--color-line-strong)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] lg:inline-flex"
    >
      {label}
      <ArrowUpRight size={14} />
    </a>
  );
}

export default function TopNavBar(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-line)] bg-[rgba(252,248,241,0.95)] backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="min-w-0 shrink-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-primary)]">
            2026 Draft Desk
          </div>
          <div className="text-2xl font-black uppercase tracking-tight text-[color:var(--color-ink)]">
            {SITE_META.brand}
          </div>
        </NavLink>

        <nav className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-5">
          {PAGE_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 pb-1 text-[12px] font-bold uppercase tracking-[0.14em] transition xl:text-[13px] ${
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
            type="button"
            aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--color-line-strong)] bg-white text-[color:var(--color-ink)] lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[color:var(--color-line)] bg-[color:var(--color-surface-raised)] p-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {PAGE_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-base font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-6 grid gap-3 border-t border-[color:var(--color-line)] pt-6">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                download={link.download ? (link.downloadFileName ?? true) : undefined}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="flex items-center justify-between border border-[color:var(--color-line)] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-ink)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-[color:var(--color-ink-soft)]">
            {SITE_META.role} | {SITE_META.location}
          </p>
        </div>
      )}
    </header>
  );
}
