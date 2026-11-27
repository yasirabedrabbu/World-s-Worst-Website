import React, { useMemo, useState } from 'react';
import { Activity, Server, Sparkles } from 'lucide-react';
import { ToolShell, ToolButton } from './ToolShell';

type Report = {
  chars: number;
  words: number;
  unique: number;
  entropy: number;
  reading_seconds: number;
  top: [string, number][];
  source?: string;
};

const localAnalyse = (text: string): Report => {
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  const counts = new Map<string, number>();
  words.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  const total = Math.max(1, words.length);
  const entropy = -[...counts.values()].reduce((sum, n) => sum + (n / total) * Math.log2(n / total), 0);
  return {
    chars: text.length,
    words: words.length,
    unique: counts.size,
    entropy: Number(entropy.toFixed(2)),
    reading_seconds: Number((words.length / 3.3).toFixed(1)),
    top: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
  };
};

export const PyTextLab: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const [text, setText] = useState('The museum opens at midnight. Every button is a small betrayal, wrapped in a friendly shadow.');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const local = useMemo(() => localAnalyse(text), [text]);

  const analyse = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools/py-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('python offline');
      const data = (await res.json()) as Report;
      setReport({ ...data, source: 'python3' });
      onAward?.(10, 'Woke the real Python interpreter');
    } catch {
      setReport({ ...local, source: 'javascript fallback' });
      onAward?.(5, 'Analysed text with the JS fallback');
    } finally {
      setLoading(false);
    }
  };

  const shown = report || local;
  const metrics: [string, string | number][] = [
    ['words', shown.words],
    ['unique', shown.unique],
    ['chars', shown.chars],
    ['entropy', shown.entropy],
    ['read sec', shown.reading_seconds],
  ];

  return (
    <ToolShell
      eyebrow="Python · server bridge"
      title="Text Autopsy"
      blurb="Ships your text to a real Python process. If the snake is asleep, JavaScript quietly takes over."
      accent="#38bdf8"
      action={<span className="chip"><Server size={13} /> {report?.source || 'local preview'}</span>}
    >
      <textarea className="tool-input tool-code" rows={6} value={text} onChange={(e) => setText(e.target.value)} aria-label="Text to analyse" />
      <div className="tool-row" style={{ marginTop: 12 }}>
        <ToolButton onClick={analyse} disabled={loading || !text.trim()}>
          <Activity size={14} /> {loading ? 'Dissecting…' : 'Run Python'}
        </ToolButton>
        <ToolButton tone="ghost" onClick={() => { setText(''); setReport(null); }}><Sparkles size={14} /> Clear</ToolButton>
        <span className="chip">stdin → JSON → stdout</span>
      </div>
      <div className="stat-grid">
        {metrics.map(([label, value]) => (
          <div key={label} className="stat-tile">
            <strong>{value}</strong>
            <span className="mono muted">{label}</span>
          </div>
        ))}
      </div>
      <div className="tool-row" style={{ marginTop: 12 }}>
        <span className="mono muted">top tokens</span>
        {shown.top.map(([word, count]) => <span key={word} className="chip">{word} × {count}</span>)}
      </div>
    </ToolShell>
  );
};
