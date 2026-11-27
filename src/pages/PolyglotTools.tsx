import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Braces, Code2, Gamepad2, Palette, Sparkles, Terminal, Wand2 } from 'lucide-react';
import { PaletteForge } from '../components/polyglot/PaletteForge';
import { RegexLab } from '../components/polyglot/RegexLab';
import { JsonForge } from '../components/polyglot/JsonForge';
import { SortRace } from '../components/polyglot/SortRace';
import { SnakeGame } from '../components/polyglot/SnakeGame';
import { PolyglotQuiz } from '../components/polyglot/PolyglotQuiz';
import { CodexSamples } from '../components/polyglot/CodexSamples';
import { PyTextLab } from '../components/polyglot/PyTextLab';
import { ThemeLab } from '../components/polyglot/ThemeLab';
import { PolyglotChaosLab } from '../components/PolyglotChaosLab';

type Filter = 'all' | 'tools' | 'games' | 'codex';
type Props = { onAwardXp: (xp: number, why: string) => void };

const FILTERS: { id: Filter; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'all', label: 'Everything', icon: Sparkles },
  { id: 'tools', label: 'Real tools', icon: Wand2 },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'codex', label: 'Codex', icon: Code2 },
];

const STATS = [
  ['6', 'languages'],
  ['9', 'live toys'],
  ['60/30/10', 'colour law'],
  ['0', 'build steps'],
];

export const PolyglotTools: React.FC<Props> = ({ onAwardXp }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const award = useMemo(() => (xp: number, why: string) => onAwardXp(xp, why), [onAwardXp]);
  const show = (group: Filter) => filter === 'all' || filter === group;

  return (
    <div className="poly-page">
      <motion.header
        className="poly-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="poly-orb poly-orb-a" aria-hidden />
        <div className="poly-orb poly-orb-b" aria-hidden />
        <div className="poly-hero-copy">
          <span className="tool-badge"><Terminal size={13} /> Exhibit 08 · polyglot wing</span>
          <h1 className="h0" style={{ marginTop: 18 }}>
            Nine tools.<br />
            <span className="poly-gradient">Six languages.</span><br />
            One polite catastrophe.
          </h1>
          <p className="body-m muted" style={{ maxWidth: 560, marginTop: 20 }}>
            Real JavaScript utilities, a Python server bridge, playable canvas games and a codex of
            Java, Rust, C, C# and Python specimens. Everything is interactive, keyboard friendly and
            tuned to a strict 60 / 30 / 10 visual ratio.
          </p>
          <div className="tool-row" style={{ marginTop: 26 }}>
            <a href="#tool-palette" className="tool-btn tool-btn-solid"><Palette size={15} /> Forge a palette</a>
            <a href="#tool-snake" className="tool-btn tool-btn-ghost"><Gamepad2 size={15} /> Play snake</a>
            <a href="#tool-codex" className="tool-btn tool-btn-ghost"><Braces size={15} /> Read the code</a>
          </div>
        </div>
        <div className="poly-hero-stats">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span className="mono muted">{label}</span>
            </div>
          ))}
        </div>
      </motion.header>

      <div className="poly-filters" role="tablist" aria-label="Filter polyglot content">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={filter === id} className={filter === id ? 'is-active' : ''} onClick={() => setFilter(id)}>
            <Icon size={14} /> {label}
          </button>
        ))}
        <span className="chip" style={{ marginLeft: 'auto' }}>auto-saved locally</span>
      </div>

      <div className="poly-grid">
        {show('tools') && <div id="tool-palette" className="poly-span-7"><PaletteForge onAward={award} /></div>}
        {show('tools') && <div id="tool-settings" className="poly-span-5"><ThemeLab onAward={award} /></div>}
        {show('tools') && <div id="tool-regex" className="poly-span-6"><RegexLab /></div>}
        {show('tools') && <div id="tool-json" className="poly-span-6"><JsonForge /></div>}
        {show('tools') && <div id="tool-python" className="poly-span-12"><PyTextLab onAward={award} /></div>}
        {show('games') && <div id="tool-sort" className="poly-span-6"><SortRace onAward={award} /></div>}
        {show('games') && <div id="tool-snake" className="poly-span-6"><SnakeGame onAward={award} /></div>}
        {show('games') && <div id="tool-quiz" className="poly-span-12"><PolyglotQuiz onAward={award} /></div>}
        {show('codex') && <div id="tool-codex" className="poly-span-12"><CodexSamples onAward={award} /></div>}
      </div>

      {filter === 'all' && (
        <section className="poly-legacy" aria-label="Legacy chaos lab">
          <div className="poly-legacy-head">
            <div>
              <p className="eyebrow muted">Bonus wing</p>
              <h2 className="h3">The original chaos lab</h2>
            </div>
            <span className="chip">WebAssembly · GLSL · fake compilers</span>
          </div>
          <PolyglotChaosLab onAwardXp={(gain) => award(gain, 'Survived the legacy chaos lab')} />
        </section>
      )}
    </div>
  );
};
