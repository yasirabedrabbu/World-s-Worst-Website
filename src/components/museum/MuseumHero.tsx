import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import heroImage from '../../assets/images/bd_viral_padma_bridge_1788758522959.jpg';

interface MuseumHeroProps {
  verdict: string;
  onOpenCertificate: () => void;
  onEnter: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const MuseumHero: React.FC<MuseumHeroProps> = ({ verdict, onOpenCertificate, onEnter }) => {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      id="section-01-hero"
      className="relative overflow-hidden"
      style={{ borderRadius: 'var(--r-card)', minHeight: 'min(80vh, 720px)' }}
    >
      <motion.img
        src={heroImage}
        alt="Crowded selfie scene on the Padma Bridge, the museum's founding artefact"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(1) contrast(1.05)' }}
        initial={reduce ? undefined : { scale: 1.08 }}
        animate={reduce ? undefined : { scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      {/* Vignettes — text on photos always sits on one */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(21,21,21,0.88) 0%, rgba(21,21,21,0.2) 55%, rgba(21,21,21,0.5) 100%)' }}
      />

      <div className="relative flex flex-col justify-between h-full" style={{ minHeight: 'inherit', padding: 'var(--margin)' }}>
        <motion.div {...rise(0.1)} className="flex items-center justify-between gap-5" style={{ color: 'var(--light-100)' }}>
          <span className="eyebrow">Guinness world record nomination</span>
          <span className="eyebrow" style={{ opacity: 0.64 }}>
            Est. 1996 · Dhaka
          </span>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-5 items-end" style={{ color: 'var(--light-100)', marginTop: 96 }}>
          <div className="md:col-span-8">
            <motion.h1 {...rise(0.2)} className="h2" style={{ maxWidth: 720 }}>
              The museum of the world's worst website.
            </motion.h1>
            <motion.p {...rise(0.32)} className="body-m" style={{ marginTop: 20, maxWidth: 520, opacity: 0.8 }}>
              {verdict}
            </motion.p>
            <motion.div {...rise(0.44)} className="flex flex-wrap gap-2" style={{ marginTop: 32 }}>
              <button
                onClick={onEnter}
                className="btn"
                style={{ background: 'var(--light-100)', color: 'var(--tone-strong)' }}
              >
                Enter the exhibits ↓
              </button>
              <button
                onClick={onOpenCertificate}
                className="btn"
                style={{
                  background: 'var(--light-16)',
                  color: 'var(--light-100)',
                  backdropFilter: 'var(--blur-glass)',
                  WebkitBackdropFilter: 'var(--blur-glass)',
                }}
              >
                View certificate
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};