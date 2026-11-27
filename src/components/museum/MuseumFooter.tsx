import React from 'react';
import { PageType } from '../../types';

interface MuseumFooterProps {
  webringText: string;
  xp: number;
  onNavigate: (page: PageType) => void;
  onOpenCookies: () => void;
  onOpenWarning: () => void;
  onOpenFeedback: () => void;
  onOpenGamification: () => void;
  onOpenCertificate: () => void;
  onSpawnAd: () => void;
}

export const MuseumFooter: React.FC<MuseumFooterProps> = ({
  webringText,
  xp,
  onNavigate,
  onOpenCookies,
  onOpenWarning,
  onOpenFeedback,
  onOpenGamification,
  onOpenCertificate,
  onSpawnAd,
}) => {
  const link = 'body-m text-left cursor-pointer underline-offset-4 hover:underline';

  return (
    <footer
      style={{
        marginTop: 'var(--section-pad)',
        background: 'var(--tone-strong)',
        color: 'var(--light-100)',
        borderRadius: 'var(--r-card)',
        padding: 'var(--margin)',
      }}
    >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow" style={{ opacity: 0.64, marginBottom: 10 }}>
            Museum of atrocities
          </p>
          <p className="h4" style={{ maxWidth: 400 }}>
            Engineered with maximum comedic malice to show why UX design exists.
          </p>
        </div>

        <nav aria-label="Visitor services" className="md:col-span-3">
          <p className="eyebrow" style={{ opacity: 0.64, marginBottom: 15 }}>
            Visitor services
          </p>
          <ul className="flex flex-col gap-2.5">
            <li><button className={link} onClick={onOpenCookies}>Cookie nightmare</button></li>
            <li><button className={link} onClick={onOpenWarning}>চরম সতর্কবার্তা (Warning)</button></li>
            <li><button className={link} onClick={onOpenFeedback}>মতামত ও ফিচার রিকোয়েস্ট</button></li>
            <li><button className={link} onClick={onOpenGamification}>কষ্টের গেমিফিকেশন ({xp} XP)</button></li>
          </ul>
        </nav>

        <nav aria-label="Collections" className="md:col-span-4">
          <p className="eyebrow" style={{ opacity: 0.64, marginBottom: 15 }}>
            Collections
          </p>
          <ul className="flex flex-col gap-2.5">
            <li><button className={link} onClick={onOpenCertificate}>Claim Guinness certificate</button></li>
            <li><button className={link} onClick={onSpawnAd}>Summon spam ad</button></li>
            <li><button className={link} onClick={() => onNavigate('records')}>Hall of atrocities</button></li>
            <li><button className={link} onClick={() => onNavigate('pinterest')}>Cursed Pinterest pins</button></li>
          </ul>
        </nav>
      </div>

      <div
        className="flex flex-wrap justify-between gap-5"
        style={{ marginTop: 56, paddingTop: 20, borderTop: '1px solid rgba(237,237,237,0.16)' }}
      >
        <span className="mono" style={{ opacity: 0.64 }}>{webringText}</span>
        <span className="mono" style={{ opacity: 0.64 }}>Curated by Yasir Abed Rabbu</span>
      </div>
    </footer>
  );
};