import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Play, RotateCcw } from 'lucide-react';
import { ToolShell, ToolButton } from './ToolShell';

const COLS = 18;
const CELL = 20;
const SIZE = COLS * CELL;
type Point = { x: number; y: number };
type Status = 'idle' | 'running' | 'over';

const opposite = (a: Point, b: Point) => a.x === -b.x && a.y === -b.y;
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export const SnakeGame: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useRef<Point[]>([{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }]);
  const dir = useRef<Point>({ x: 1, y: 0 });
  const food = useRef<Point>({ x: 13, y: 9 });
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('ww_snake_best') || 0));
  const [status, setStatus] = useState<Status>('idle');
  const statusRef = useRef<Status>('idle');
  statusRef.current = status;

  const spawnFood = () => {
    let next: Point;
    do {
      next = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * COLS) };
    } while (snake.current.some((s) => same(s, next)));
    food.current = next;
  };

  const reset = useCallback(() => {
    snake.current = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
    dir.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    spawnFood();
    setStatus('running');
  }, []);

  const turn = useCallback((next: Point) => {
    if (statusRef.current !== 'running' || opposite(next, dir.current)) return;
    dir.current = next;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (next) { e.preventDefault(); turn(next); }
      if (e.key === ' ') { e.preventDefault(); statusRef.current === 'running' ? setStatus('idle') : reset(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [turn, reset]);

  useEffect(() => {
    if (status !== 'running') return;
    let raf = 0;
    let last = 0;
    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#0b0b10';
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      for (let i = 1; i < COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke();
      }
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(food.current.x * CELL + CELL / 2, food.current.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
      ctx.fill();
      snake.current.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? '#a78bfa' : `rgba(167,139,250,${Math.max(0.28, 0.9 - i * 0.025)})`;
        ctx.beginPath();
        ctx.roundRect(part.x * CELL + 2, part.y * CELL + 2, CELL - 4, CELL - 4, 5);
        ctx.fill();
      });
    };
    const step = (now: number) => {
      if (!last) last = now;
      if (now - last > 130) {
        last = now;
        const head = { x: snake.current[0].x + dir.current.x, y: snake.current[0].y + dir.current.y };
        const hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= COLS;
        const hitSelf = snake.current.some((s) => same(s, head));
        if (hitWall || hitSelf) {
          setStatus('over');
          const final = scoreRef.current;
          setBest((b) => {
            const next = Math.max(b, final);
            localStorage.setItem('ww_snake_best', String(next));
            return next;
          });
          if (final > 0) onAward?.(10 + final * 2, `Snake run of ${final} bites`);
          draw();
          return;
        }
        snake.current.unshift(head);
        if (same(head, food.current)) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          spawnFood();
        } else {
          snake.current.pop();
        }
        draw();
      }
      raf = requestAnimationFrame(step);
    };
    draw();
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status, onAward]);

  return (
    <ToolShell
      eyebrow="JavaScript · canvas game"
      title="Snake, but polite"
      blurb="Arrow keys / WASD. Space pauses. The only hostile thing here is your own reflexes."
      accent="#22c55e"
      action={<span className="chip">SCORE {score} · BEST {best}</span>}
    >
      <div className="snake-wrap">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="snake-canvas" aria-label="Snake game board" />
        {status !== 'running' && (
          <div className="snake-overlay">
            <strong className="h4">{status === 'over' ? `Bitten at ${score}` : 'Ready?'}</strong>
            <p className="body-m muted">{status === 'over' ? 'Best score is safe in localStorage.' : 'Eat the yellow dots. Do not eat yourself.'}</p>
            <ToolButton onClick={reset}><Play size={14} /> {status === 'over' ? 'Again' : 'Start'}</ToolButton>
          </div>
        )}
      </div>
      <div className="snake-pad" aria-label="Touch controls">
        <button onClick={() => turn({ x: 0, y: -1 })} aria-label="Up"><ChevronUp size={18} /></button>
        <div>
          <button onClick={() => turn({ x: -1, y: 0 })} aria-label="Left"><ChevronLeft size={18} /></button>
          <button onClick={() => setStatus(statusRef.current === 'running' ? 'idle' : 'running')} aria-label="Pause"><RotateCcw size={15} /></button>
          <button onClick={() => turn({ x: 1, y: 0 })} aria-label="Right"><ChevronRight size={18} /></button>
        </div>
        <button onClick={() => turn({ x: 0, y: 1 })} aria-label="Down"><ChevronDown size={18} /></button>
      </div>
    </ToolShell>
  );
};
