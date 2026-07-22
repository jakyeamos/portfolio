import type { ReactElement } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound(): ReactElement {
  return (
    <main className="page-wrap py-10 md:py-16">
      <section className="off-the-board-card">
        <div className="section-kicker">Off the Board</div>
        <h1 className="mt-4 max-w-3xl text-6xl font-black uppercase leading-[0.86] tracking-[-0.03em] text-[color:var(--color-ink)] md:text-8xl">
          That play is not in the dossier.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--color-ink-soft)] md:text-xl">
          The route missed the board, but the useful files are still here. Start at the front page
          or jump straight to the work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Front page
          </Link>
          <Link className="btn-secondary" to="/film-room">
            Film Room
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
