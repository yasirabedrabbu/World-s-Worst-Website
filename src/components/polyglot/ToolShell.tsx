import React from 'react';
import { motion } from 'motion/react';

type Props = {
  eyebrow: string;
  title: string;
  blurb?: string;
  accent?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

/** Shared chrome for every polyglot tool. Keeps the museum calm outside, playful inside. */
export const ToolShell: React.FC<Props> = ({ eyebrow, title, blurb, accent = '#6366f1', children, action }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="tool-card"
    style={{ ['--tool-accent' as string]: accent }}
  >
    <header className="tool-head">
      <div>
        <p className="eyebrow" style={{ color: 'var(--tool-accent)' }}>{eyebrow}</p>
        <h3 className="h4" style={{ marginTop: 6 }}>{title}</h3>
        {blurb && <p className="body-m muted" style={{ marginTop: 6, maxWidth: 460 }}>{blurb}</p>}
      </div>
      {action}
    </header>
    <div className="tool-body">{children}</div>
  </motion.section>
);

export const ToolButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'solid' | 'ghost' }
> = ({ tone = 'solid', className = '', ...rest }) => (
  <button {...rest} className={`tool-btn tool-btn-${tone} ${className}`} />
);

export const Swatch: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div className="swatch">
    <span className="swatch-chip" style={{ background: value }} />
    <div>
      <span className="mono" style={{ display: 'block' }}>{label}</span>
      <span className="mono muted" style={{ fontSize: 10 }}>{hint || value}</span>
    </div>
  </div>
);
