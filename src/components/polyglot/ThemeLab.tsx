import React, { useEffect, useState } from 'react';
import { Gauge, RotateCcw, Settings2, Sparkles } from 'lucide-react';
import { ToolShell, ToolButton } from './ToolShell';

type Prefs = { radius: number; motion: number; type: number; grain: number };

const DEFAULTS: Prefs = { radius: 10, motion: 100, type: 15, grain: 0 };
const KEY = 'ww_prefs';

const readPrefs = (): Prefs => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return DEFAULTS;
  }
};

const applyPrefs = (p: Prefs) => {
  const root = document.documentElement;
  root.style.setProperty('--r-card', `${p.radius}px`);
  root.style.setProperty('--r-button', `${Math.max(4, p.radius - 2)}px`);
  root.style.setProperty('--dur-1', `${Math.round(200 * (100 / p.motion))}ms`);
  root.style.setProperty('--dur-2', `${Math.round(450 * (100 / p.motion))}ms`);
  root.style.setProperty('--dur-3', `${Math.round(800 * (100 / p.motion))}ms`);
  root.style.setProperty('--body-size', `${p.type}px`);
  root.style.setProperty('--grain-opacity', String(p.grain / 100));
  root.style.setProperty('--anim-speed', String(100 / p.motion));
  localStorage.setItem(KEY, JSON.stringify(p));
};

export const ThemeLab: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const [prefs, setPrefs] = useState<Prefs>(readPrefs);

  useEffect(() => { applyPrefs(prefs); }, [prefs]);

  const set = (key: keyof Prefs, value: number) => setPrefs((p) => ({ ...p, [key]: value }));

  const reset = () => {
    localStorage.removeItem(KEY);
    setPrefs(DEFAULTS);
    onAward?.(5, 'Restored factory settings');
  };

  const sliders: { key: keyof Prefs; label: string; min: number; max: number; unit: string }[] = [
    { key: 'radius', label: 'Corner radius', min: 0, max: 24, unit: 'px' },
    { key: 'motion', label: 'Animation energy', min: 10, max: 200, unit: '%' },
    { key: 'type', label: 'Body size', min: 14, max: 19, unit: 'px' },
    { key: 'grain', label: 'Museum grain', min: 0, max: 100, unit: '%' },
  ];

  return (
    <ToolShell
      eyebrow="CSS variables · live"
      title="Museum Settings"
      blurb="Tune the whole site without a rebuild. Preferences persist in localStorage."
      accent="var(--accent, #6366f1)"
      action={
        <div className="tool-row">
          <span className="chip"><Settings2 size={13} /> live</span>
          <ToolButton tone="ghost" onClick={reset}><RotateCcw size={14} /> Reset</ToolButton>
        </div>
      }
    >
      <div className="settings-preview" style={{ borderRadius: prefs.radius }}>
        <div className="settings-dot" />
        <div>
          <strong style={{ fontSize: prefs.type }}>The room adapts to you.</strong>
          <p className="mono muted">radius {prefs.radius}px · motion {prefs.motion}% · grain {prefs.grain}%</p>
        </div>
        <Sparkles size={18} />
      </div>

      <div className="settings-grid">
        {sliders.map((s) => (
          <label key={s.key} className="tool-field">
            <span className="mono muted">{s.label} · {prefs[s.key]}{s.unit}</span>
            <input
              className="tool-range"
              type="range"
              min={s.min}
              max={s.max}
              value={prefs[s.key]}
              onChange={(e) => set(s.key, Number(e.target.value))}
              style={{ accentColor: 'var(--accent, #6366f1)' }}
            />
          </label>
        ))}
      </div>

      <div className="tool-row" style={{ marginTop: 14 }}>
        <span className="mono muted"><Gauge size={13} /> applied to :root</span>
        <ToolButton tone="ghost" onClick={() => { applyPrefs(prefs); onAward?.(5, 'Re-applied the museum settings'); }}>
          Re-apply
        </ToolButton>
      </div>
    </ToolShell>
  );
};
