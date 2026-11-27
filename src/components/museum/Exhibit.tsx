import React from 'react';

interface ExhibitProps {
  id: string;
  number: string;
  title: string;
  tech: string;
  note?: string;
  children: React.ReactNode;
}

/**
 * Calm editorial frame around a chaotic exhibit.
 * The frame follows Editorial Taste; everything inside .exhibit-inner keeps its original chaos.
 */
export const Exhibit: React.FC<ExhibitProps> = ({ id, number, title, tech, note, children }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="reveal" style={{ paddingTop: 'var(--section-pad)' }}>
    <div
      className="grid gap-5 md:grid-cols-12 items-end hairline"
      style={{ paddingTop: 20, marginBottom: 'var(--title-gap)' }}
    >
      <div className="md:col-span-7">
        <p className="eyebrow muted" style={{ marginBottom: 10 }}>
          Exhibit {number}
        </p>
        <h2 id={`${id}-title`} className="h3">
          {title}
        </h2>
      </div>
      <div className="md:col-span-5 md:text-right">
        <span className="chip">{tech}</span>
        {note && (
          <p className="body-m muted" style={{ marginTop: 10 }}>
            {note}
          </p>
        )}
      </div>
    </div>

    <figure className="exhibit" style={{ margin: 0 }}>
      <div className="exhibit-inner">{children}</div>
      <figcaption className="exhibit-label">
        <span>Do not touch the glass</span>
        <span>Cat. {number}</span>
      </figcaption>
    </figure>
  </section>
);