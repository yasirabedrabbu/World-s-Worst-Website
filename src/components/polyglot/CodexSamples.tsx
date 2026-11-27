import React, { useState } from 'react';
import { Check, Copy, FileCode2, Terminal } from 'lucide-react';
import { CODE_SAMPLES } from '../../data/polyglotSamples';
import { ToolShell, ToolButton } from './ToolShell';

export const CodexSamples: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const [active, setActive] = useState(CODE_SAMPLES[0].id);
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState<string | null>(null);
  const sample = CODE_SAMPLES.find((s) => s.id === active) ?? CODE_SAMPLES[0];

  const copy = async () => {
    await navigator.clipboard.writeText(sample.code);
    setCopied(true);
    onAward?.(5, `Copied the ${sample.language} specimen`);
    window.setTimeout(() => setCopied(false), 1300);
  };

  const run = () => {
    setRan(null);
    window.setTimeout(() => setRan(sample.output), 450);
  };

  return (
    <ToolShell
      eyebrow="Java · Python · Rust · C · C# · JS"
      title="The Polyglot Codex"
      blurb="Six hand-written specimens, six runtimes, one museum. Copy them, compile them, break them."
      accent={sample.accent}
      action={<span className="chip"><FileCode2 size={13} /> {sample.file}</span>}
    >
      <div className="codex-tabs" role="tablist" aria-label="Languages">
        {CODE_SAMPLES.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === active}
            className={s.id === active ? 'is-active' : ''}
            style={{ ['--tab-accent' as string]: s.accent }}
            onClick={() => { setActive(s.id); setRan(null); }}
          >
            <span>{s.emoji}</span> {s.language}
          </button>
        ))}
      </div>

      <div className="codex-meta">
        <div>
          <h4 className="h6">{sample.title}</h4>
          <p className="body-m muted">{sample.blurb}</p>
        </div>
        <ToolButton tone="ghost" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</ToolButton>
      </div>

      <div className="codex-window">
        <div className="codex-bar"><span /><span /><span /><em className="mono">{sample.file}</em></div>
        <pre className="mono"><code>{sample.code}</code></pre>
      </div>

      <div className="codex-run">
        <code className="mono">$ {sample.runtime}</code>
        <ToolButton onClick={run}><Terminal size={14} /> Simulate output</ToolButton>
      </div>
      {ran && <pre className="tool-output mono codex-out" aria-live="polite">{ran}</pre>}
    </ToolShell>
  );
};
