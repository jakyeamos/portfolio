import type { ReactElement } from 'react';
import { BarChart3, ClipboardList, Newspaper, NotebookText, Radar, Target, Tv } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { PAGE_LINKS, QUICK_LINKS, SCOUTING_FACTS, SITE_META } from '@/content/portfolioContent';

const SIDE_ICONS = [Newspaper, ClipboardList, Tv, NotebookText, Target, Radar, BarChart3] as const;

export default function SideNavBar(): ReactElement {
  return (
    <aside className="fixed top-[73px] hidden h-[calc(100vh-73px)] w-72 flex-col gap-8 overflow-y-auto border-r border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] px-6 py-8 lg:flex">
      <div className="space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
          Prospect Coverage
        </div>
        <div className="text-3xl font-black uppercase leading-none text-[color:var(--color-ink)]">
          Draft Board
        </div>
      </div>

      <nav className="grid gap-2">
        {PAGE_LINKS.map((link, index) => {
          const Icon = SIDE_ICONS[index];

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 border px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] transition ${
                  isActive
                    ? 'border-[color:var(--color-primary)] bg-white text-[color:var(--color-primary)]'
                    : 'border-transparent bg-transparent text-[color:var(--color-ink)] hover:border-[color:var(--color-line-strong)] hover:bg-white'
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border border-[color:var(--color-line-strong)] bg-white p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-secondary)]">
          Quick Facts
        </div>
        <div className="mt-4 grid gap-4">
          {SCOUTING_FACTS.map((fact) => (
            <div key={fact.label}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                {fact.label}
              </div>
              <div className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--color-ink)]">
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[color:var(--color-line)] bg-[color:var(--color-navy)] p-5 text-white">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
          Availability
        </div>
        <p className="mt-3 text-xl font-black uppercase leading-tight">
          {SITE_META.opportunityStatus}
        </p>
        <a
          href={QUICK_LINKS[3].href}
          className="mt-4 inline-flex items-center justify-center bg-[color:var(--color-primary)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[color:var(--color-primary-deep)]"
        >
          Contact Desk
        </a>
      </div>
    </aside>
  );
}
