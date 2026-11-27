import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Shuffle, Trophy } from 'lucide-react';
import { ToolShell, ToolButton } from './ToolShell';

type Frame = { array: number[]; compare: [number, number]; swaps: number };
type Algo = 'bubble' | 'insertion';

const randomArray = (n: number) => Array.from({ length: n }, () => 8 + Math.floor(Math.random() * 92));

const buildFrames = (input: number[], algo: Algo): Frame[] => {
  const frames: Frame[] = [];
  const array = [...input];
  let swaps = 0;
  const push = (compare: [number, number]) => frames.push({ array: [...array], compare, swaps });
  if (algo === 'bubble') {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        push([j, j + 1]);
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swaps++;
          push([j, j + 1]);
        }
      }
    }
  } else {
    for (let i = 1; i < array.length; i++) {
      let j = i;
      while (j > 0 && array[j - 1] > array[j]) {
        push([j - 1, j]);
        [array[j - 1], array[j]] = [array[j], array[j - 1]];
        swaps++;
        push([j - 1, j]);
        j--;
      }
    }
  }
  frames.push({ array: [...array], compare: [-1, -1], swaps });
  return frames;
};

export const SortRace: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const [size, setSize] = useState(18);
  const [algo, setAlgo] = useState<Algo>('bubble');
  const [speed, setSpeed] = useState(55);
  const [input, setInput] = useState(() => randomArray(18));
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const awarded = useRef(false);
  const frames = useMemo(() => buildFrames(input, algo), [input, algo]);
  const current = frames[Math.min(frame, frames.length - 1)];
  const done = frame >= frames.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (frame >= frames.length - 1) {
      setPlaying(false);
      if (!awarded.current) {
        awarded.current = true;
        onAward?.(15, `Sorted ${size} bars with ${algo}`);
      }
      return;
    }
    const id = window.setTimeout(() => setFrame((f) => f + 1), Math.max(8, 100 - speed));
    return () => window.clearTimeout(id);
  }, [playing, frame, frames.length, speed, size, algo, onAward]);

  const shuffle = () => {
    const next = randomArray(size);
    setInput(next);
    setFrame(0);
    setPlaying(false);
    awarded.current = false;
  };

  const changeSize = (n: number) => {
    setSize(n);
    setInput(randomArray(n));
    setFrame(0);
    setPlaying(false);
    awarded.current = false;
  };

  const max = Math.max(...current.array);
  return (
    <ToolShell
      eyebrow="JavaScript · algorithm theatre"
      title="Sort Race"
      blurb="Bubble vs insertion, live. Crank the speed and watch order crawl out of entropy."
      accent="#f97316"
      action={<span className="chip">{done ? <><Trophy size={13} /> sorted</> : `${frame}/${frames.length - 1} steps`}</span>}
    >
      <div className="sort-stage" role="img" aria-label={`Bars sorted with ${algo}`}>
        {current.array.map((value, i) => {
          const active = current.compare.includes(i);
          return (
            <span
              key={i}
              className={`sort-bar ${active ? 'is-active' : ''}`}
              style={{ height: `${(value / max) * 100}%`, transitionDuration: `${Math.max(20, 110 - speed)}ms` }}
            />
          );
        })}
      </div>
      <div className="tool-row" style={{ marginTop: 14 }}>
        <div className="segmented">
          {(['bubble', 'insertion'] as Algo[]).map((a) => (
            <button key={a} className={algo === a ? 'is-active' : ''} onClick={() => { setAlgo(a); setFrame(0); setPlaying(false); awarded.current = false; }}>
              {a}
            </button>
          ))}
        </div>
        <ToolButton onClick={() => { if (done) { setFrame(0); awarded.current = false; } setPlaying((p) => !p); }}>
          {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : done ? 'Replay' : 'Race'}
        </ToolButton>
        <ToolButton tone="ghost" onClick={shuffle}><Shuffle size={14} /> New array</ToolButton>
        <span className="chip">swaps {current.swaps}</span>
      </div>
      <div className="tool-grid-2" style={{ marginTop: 12 }}>
        <label className="tool-field">
          <span className="mono muted">Bars · {size}</span>
          <input className="tool-range" type="range" min={6} max={36} value={size} onChange={(e) => changeSize(Number(e.target.value))} />
        </label>
        <label className="tool-field">
          <span className="mono muted">Speed · {speed}%</span>
          <input className="tool-range" type="range" min={0} max={94} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
      </div>
    </ToolShell>
  );
};
