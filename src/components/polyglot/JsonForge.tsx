import React, { useMemo, useState } from 'react';
import { Braces, Copy, Minimize2, Sparkles, Wand2 } from 'lucide-react';
import { ToolShell, ToolButton } from './ToolShell';

const SAMPLE = JSON.stringify({
  exhibition: "World's Worst Website",
  visitors: 94812,
  ratio: { base: 60, surface: 30, accent: 10 },
  atrocities: ['slippery reject', 'hydra ads', 'karen-9000'],
  nested: { chaos: true, patience: null, xp: 420 },
}, null, 2);

const size = (value: string) => `${new Blob([value]).size} B`;

export const JsonForge: React.FC = () => {
  const [raw, setRaw] = useState(SAMPLE);
  const [tab, setTab] = useState<'pretty' | 'compact'>('pretty');
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    if (!raw.trim()) return { ok: false as const, error: 'Nothing to parse. Feed me JSON.' };
    try {
      return { ok: true as const, value: JSON.parse(raw), size: size(raw) };
    } catch (error) {
      return { ok: false as const, error: (error as Error).message };
    }
  }, [raw]);

  const output = useMemo(() => {
    if (!parsed.ok) return '';
    return tab === 'pretty' ? JSON.stringify(parsed.value, null, 2) : JSON.stringify(parsed.value);
  }, [parsed, tab]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <ToolShell
      eyebrow="JavaScript · JSON.parse"
      title="JSON Forge"
      blurb="Validate, beautify and crush payloads. One less thing to cry about."
      accent="#8b5cf6"
      action={
        <div className="tool-row">
          <ToolButton tone="ghost" onClick={() => setRaw(SAMPLE)}><Wand2 size={14} /> Sample</ToolButton>
          <ToolButton tone="ghost" onClick={() => setRaw('')}><Braces size={14} /> Clear</ToolButton>
        </div>
      }
    >
      <textarea
        className="tool-input mono tool-code"
        rows={9}
        value={raw}
        spellCheck={false}
        onChange={(e) => setRaw(e.target.value)}
        aria-label="JSON input"
      />
      <div className="tool-row" style={{ marginTop: 12 }}>
        <ToolButton onClick={() => setTab('pretty')} tone={tab === 'pretty' ? 'solid' : 'ghost'}>
          <Sparkles size={14} /> Beautify
        </ToolButton>
        <ToolButton onClick={() => setTab('compact')} tone={tab === 'compact' ? 'solid' : 'ghost'}>
          <Minimize2 size={14} /> Minify
        </ToolButton>
        <ToolButton tone="ghost" onClick={copy} disabled={!parsed.ok}>
          <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
        </ToolButton>
        <span className={`chip ${parsed.ok ? 'chip-ok' : 'chip-bad'}`}>
          {parsed.ok ? `valid · ${parsed.size}` : 'invalid'}
        </span>
      </div>
      {parsed.ok ? (
        <pre className="tool-output mono" aria-live="polite">{output}</pre>
      ) : (
        <p className="tool-error">{parsed.error}</p>
      )}
    </ToolShell>
  );
};
