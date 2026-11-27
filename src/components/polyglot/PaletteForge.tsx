import React, { useMemo, useState } from 'react';
import { Copy, Dices, Paintbrush, RotateCcw, Check } from 'lucide-react';
import { ToolShell, ToolButton, Swatch } from './ToolShell';

type Mood = 'museum' | 'brutal' | 'pastel';

const makePalette = (hue: number, mood: Mood) => {
  const pop = mood === 'brutal' ? 22 : mood === 'pastel' ? 2 : 10;
  const sat = mood === 'pastel' ? 52 : mood === 'brutal' ? 96 : 82;
  return {
    base: `hsl(${hue} 26% 96%)`,
    surface: `hsl(${hue} 22% 90%)`,
    ink: `hsl(${hue} 24% 12%)`,
    accent: `hsl(${(hue + pop) % 360} ${sat}% 54%)`,
    accent2: `hsl(${(hue + 180) % 360} ${Math.round(sat * 0.72)}% 62%)`,
  };
};

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const PaletteForge: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const [hue, setHue] = useState<number>(() => Number(localStorage.getItem('ww_hue') || 262));
  const [mood, setMood] = useState<Mood>('museum');
  const [copied, setCopied] = useState<string | null>(null);
  const palette = useMemo(() => makePalette(hue, mood), [hue, mood]);

  const apply = () => {
    const root = document.documentElement;
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--accent-2', palette.accent2);
    root.style.setProperty('--hue', String(hue));
    localStorage.setItem('ww_hue', String(hue));
    localStorage.setItem('ww_accent', palette.accent);
    onAward?.(10, 'Painted the museum with a fresh accent');
  };

  const reset = () => {
    const root = document.documentElement;
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-2');
    root.style.removeProperty('--hue');
    localStorage.removeItem('ww_accent');
    localStorage.removeItem('ww_hue');
  };

  const save = async (key: string, value: string) => {
    if (await copy(value)) {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1200);
    }
  };

  return (
    <ToolShell
      eyebrow="JavaScript · colour maths"
      title="Palette Forge"
      blurb="Generate a strict 60 / 30 / 10 palette, then graft it onto the whole museum."
      accent={palette.accent}
      action={
        <div className="tool-row">
          <ToolButton tone="ghost" onClick={() => { setHue(Math.floor(Math.random() * 360)); onAward?.(5, 'Rolled the colour dice'); }} aria-label="Random hue">
            <Dices size={15} /> Random
          </ToolButton>
          <ToolButton onClick={apply}><Paintbrush size={15} /> Apply</ToolButton>
          <ToolButton tone="ghost" onClick={reset} aria-label="Reset accent"><RotateCcw size={15} /></ToolButton>
        </div>
      }
    >
      <div className="palette-preview" style={{ background: palette.base, color: palette.ink }}>
        <div className="palette-60" style={{ background: palette.base }}>
          <span className="mono">60% · base</span>
          <strong style={{ fontSize: 26 }}>A calm room for chaos.</strong>
          <p className="mono" style={{ opacity: 0.65 }}>Backgrounds, breathing room, typography.</p>
        </div>
        <div className="palette-30" style={{ background: palette.surface }}>
          <span className="mono">30% · surface</span>
          <div className="palette-cards">
            <i style={{ background: palette.surface }} />
            <i style={{ background: palette.ink, opacity: 0.08 }} />
            <i style={{ background: palette.ink, opacity: 0.14 }} />
          </div>
        </div>
        <div className="palette-10" style={{ background: palette.accent, color: '#fff' }}>
          <span className="mono">10% · accent</span>
          <strong>CLICK</strong>
        </div>
      </div>

      <div className="tool-grid-2" style={{ marginTop: 16 }}>
        <label className="tool-field">
          <span className="mono muted">Hue · {hue}°</span>
          <input
            className="tool-range"
            type="range"
            min={0}
            max={359}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            style={{ accentColor: palette.accent }}
          />
        </label>
        <div className="tool-field">
          <span className="mono muted">Mood</span>
          <div className="segmented">
            {(['museum', 'brutal', 'pastel'] as Mood[]).map((m) => (
              <button key={m} onClick={() => setMood(m)} className={mood === m ? 'is-active' : ''}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="swatch-grid">
        {Object.entries(palette).map(([name, value]) => (
          <button key={name} onClick={() => save(name, value)} className="swatch-btn" title={`Copy ${value}`}>
            <Swatch label={name} value={value} />
            {copied === name ? <Check size={13} /> : <Copy size={13} />}
          </button>
        ))}
      </div>
      <p className="mono muted" style={{ marginTop: 12 }}>
        Ratio lock: 60 base · 30 surface · 10 accent. Saved to localStorage when applied.
      </p>
    </ToolShell>
  );
};
