import React, { useState } from 'react';
import { PageType } from '../types';
import { playSound } from '../utils/audioSynth';

interface WorstNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onDialUp: () => void;
  onOpenWarning?: () => void;
  onOpenFeedback?: () => void;
  onOpenGamification?: () => void;
  onTriggerLoading?: () => void;
  xp?: number;
}

const NAV_ITEMS: { id: PageType; label: string; sub: string }[] = [
  { id: 'home', label: 'Pain hub', sub: '01' },
  { id: 'halftone', label: 'Halftone', sub: '02' },
  { id: 'viral', label: 'Viral BD', sub: '03' },
  { id: 'pinterest', label: 'Pinterest', sub: '04' },
  { id: 'shop', label: 'Scam store', sub: '05' },
  { id: 'support', label: 'Support', sub: '06' },
  { id: 'unsubscribe', label: 'Unsubscribe', sub: '07' },
  { id: 'records', label: 'Guinness hall', sub: '08' },
  { id: 'polyglot', label: 'Tools + games', sub: '09' },
];

export const WorstNav: React.FC<WorstNavProps> = ({
  currentPage,
  onNavigate,
  onDialUp,
  onOpenWarning,
  onOpenFeedback,
  onOpenGamification,
  onTriggerLoading,
  xp = 120,
}) => {
  // The museum guard: links occasionally step aside (subtle, still clickable)
  const [dodge, setDodge] = useState<Record<string, number>>({});
  const [ping, setPing] = useState(9421);

  const handleHover = (id: string) => {
    if (Math.random() > 0.65) {
      setDodge((prev) => ({ ...prev, [id]: (Math.random() > 0.5 ? 1 : -1) * 6 }));
    }
  };

  return (
    <header className="glass sticky top-0 z-[9990]" style={{ borderWidth: '0 0 1px 0' }}>
      <div className="container-x flex items-center justify-between gap-5" style={{ height: 64 }}>
        <button
          onClick={() => onNavigate('home')}
          className="flex items-baseline gap-2 shrink-0 cursor-pointer"
          aria-label="World's Worst Website, home"
        >
          <span className="h6">World's Worst</span>
          <span className="mono muted">Museum of atrocities</span>
        </button>

        <nav aria-label="Exhibits" className="flex-1 min-w-0">
          <ul className="flex items-center gap-1 overflow-x-auto justify-center">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onMouseEnter={() => handleHover(item.id)}
                    onClick={() => {
                      playSound('coin');
                      onNavigate(item.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      transform: `translateX(${dodge[item.id] || 0}px)`,
                      transition: 'transform 450ms var(--ease-out), background-color 200ms var(--ease-out)',
                      borderRadius: 'var(--r-full)',
                    }}
                    className={`mono flex items-center gap-1.5 whitespace-nowrap px-2.5 cursor-pointer ${
                      isActive ? 'bg-[var(--tone-strong)] text-[var(--light-100)]' : 'hover:bg-[var(--bg-lift)]'
                    }`}
                  >
                    <span style={{ height: 30, display: 'inline-flex', alignItems: 'center' }}>{item.label}</span>
                    <span className={isActive ? 'opacity-60' : 'muted'}>{item.sub}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <span className="chip" aria-label={`Fake ping ${ping} milliseconds`}>
            Ping {ping}ms
          </span>

          <button
            className="btn btn-ghost"
            onClick={() => {
              playSound('dialup');
              onDialUp();
              setPing((p) => p + Math.floor(Math.random() * 2000));
            }}
          >
            56k
          </button>

          {onOpenWarning && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                playSound('beep');
                onOpenWarning();
              }}
            >
              সতর্কবার্তা
            </button>
          )}

          {onOpenFeedback && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                playSound('coin');
                onOpenFeedback();
              }}
            >
              মতামত
            </button>
          )}

          {onTriggerLoading && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                playSound('beep');
                onTriggerLoading();
              }}
            >
              Reboot
            </button>
          )}

          {onOpenGamification && (
            <button
              className="btn btn-primary"
              onClick={() => {
                playSound('win');
                onOpenGamification();
              }}
            >
              {xp} XP
            </button>
          )}
        </div>
      </div>
    </header>
  );
};