import React, { useMemo, useState } from 'react';
import { AlertTriangle, Regex } from 'lucide-react';
import { ToolShell, ToolButton } from './ToolShell';

const PRESETS = [
  { label: 'emails', pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.]+', flags: 'gi', text: 'ping rabuu@worst.dev or karen9000@support.void for help.' },
  { label: 'hex colours', pattern: '#(?:[0-9a-f]{3}|[0-9a-f]{6})\\b', flags: 'gi', text: '60% #EDEDED, 30% #D9D9D9, 10% #6366F1.' },
  { label: 'numbers', pattern: '-?\\d+(?:\\.\\d+)?', flags: 'g', text: 'XP: 420, rage 99.5%, level -7.' },
  { label: 'bangla', pattern: '[\\u0980-\\u09FF]+', flags: 'g', text: 'সতর্কবার্তা and chaos mixed together.' },
];

type Part = { text: string; hit: boolean };

export const RegexLab: React.FC = () => {
  const [pattern, setPattern] = useState(PRESETS[0].pattern);
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState(PRESETS[0].text);

  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const parts: Part[] = [];
      let cursor = 0;
      let guard = 0;
      for (const match of text.matchAll(re)) {
        if (guard++ > 500) break;
        const index = match.index ?? 0;
        if (index > cursor) parts.push({ text: text.slice(cursor, index), hit: false });
        parts.push({ text: match[0] || '∅', hit: true });
        cursor = index + match[0].length;
        if (match[0].length === 0) cursor++;
      }
      if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
      const matches = [...text.matchAll(re)].slice(0, 500).map((m) => m[0] || '(empty)');
      return { ok: true, parts, matches };
    } catch (error) {
      return { ok: false, parts: [] as Part[], matches: [] as string[], error: (error as Error).message };
    }
  }, [pattern, flags, text]);

  return (
    <ToolShell
      eyebrow="JavaScript · RegExp engine"
      title="Regex Surgery"
      blurb="Live match highlighting with real browser regex semantics. Catastrophic backtracking is your problem."
      accent="#0ea5e9"
      action={<span className="chip"><Regex size={13} /> {result.matches.length} hits</span>}
    >
      <div className="tool-grid-2">
        <label className="tool-field">
          <span className="mono muted">Pattern</span>
          <input className="tool-input mono" value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} />
        </label>
        <label className="tool-field">
          <span className="mono muted">Flags</span>
          <input className="tool-input mono" value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^dgimsuvy]/g, ''))} maxLength={8} />
        </label>
      </div>

      <div className="tool-row" style={{ marginTop: 12 }}>
        {PRESETS.map((p) => (
          <ToolButton key={p.label} tone="ghost" onClick={() => { setPattern(p.pattern); setFlags(p.flags); setText(p.text); }}>
            {p.label}
          </ToolButton>
        ))}
      </div>

      <label className="tool-field" style={{ marginTop: 14 }}>
        <span className="mono muted">Test string</span>
        <textarea className="tool-input mono" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      {!result.ok ? (
        <p className="tool-error"><AlertTriangle size={14} /> {result.error}</p>
      ) : (
        <>
          <div className="regex-preview mono" aria-live="polite">
            {result.parts.map((part, i) => (
              <mark key={i} className={part.hit ? 'hit' : undefined}>{part.text}</mark>
            ))}
          </div>
          <div className="tool-row" style={{ marginTop: 12 }}>
            {result.matches.slice(0, 24).map((m, i) => (
              <span key={i} className="chip">{m.length > 24 ? m.slice(0, 24) + '…' : m}</span>
            ))}
          </div>
        </>
      )}
    </ToolShell>
  );
};
