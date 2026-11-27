import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Brain, Flame, RotateCcw, Trophy } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { ToolShell, ToolButton } from './ToolShell';

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export const PolyglotQuiz: React.FC<{ onAward?: (xp: number, why: string) => void }> = ({ onAward }) => {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const questions = useMemo(() => shuffle(QUIZ_QUESTIONS), [round]);
  const current = questions[index];
  const finished = index >= questions.length;

  const pick = (option: string) => {
    if (picked || finished) return;
    setPicked(option);
    const correct = option === current.a;
    const nextStreak = correct ? streak + 1 : 0;
    const nextScore = score + (correct ? 1 + Math.floor(nextStreak / 3) : 0);
    if (correct) {
      setScore(nextScore);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
    } else {
      setStreak(0);
    }
    window.setTimeout(() => {
      setPicked(null);
      setIndex((i) => {
        const nextIndex = i + 1;
        if (nextIndex >= questions.length) onAward?.(20 + nextScore * 3, `Polyglot quiz: ${nextScore}/${questions.length}`);
        return nextIndex;
      });
    }, 900);
  };

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
  };

  const progress = Math.round((index / questions.length) * 100);

  return (
    <ToolShell
      eyebrow="General knowledge · game"
      title="Strict Typing"
      blurb="Seven questions. No Googling. The compiler is watching."
      accent="#eab308"
      action={
        <div className="tool-row">
          <span className="chip"><Flame size={13} /> streak {streak}</span>
          <span className="chip"><Trophy size={13} /> {score}</span>
        </div>
      }
    >
      <div className="quiz-progress" aria-hidden><i style={{ width: `${finished ? 100 : progress}%` }} /></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={finished ? 'done' : `${round}-${index}`}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.24 }}
          className="quiz-card"
        >
          {finished ? (
            <div className="quiz-done">
              <Brain size={34} />
              <h4 className="h3">{score}/{questions.length} correct</h4>
              <p className="body-m muted">Best streak: {bestStreak}. Your XP has been wired to the museum ledger.</p>
              <ToolButton onClick={restart}><RotateCcw size={14} /> Run it back</ToolButton>
            </div>
          ) : (
            <>
              <p className="eyebrow muted">Question {index + 1} / {questions.length}</p>
              <h4 className="h4" style={{ margin: '10px 0 18px' }}>{current.q}</h4>
              <div className="quiz-options">
                {current.options.map((option) => {
                  const isRight = option === current.a;
                  const state = picked ? (isRight ? 'right' : option === picked ? 'wrong' : 'faded') : '';
                  return (
                    <button key={option} onClick={() => pick(option)} className={state} disabled={Boolean(picked)}>
                      <span>{option}</span>
                      {picked && isRight && <em>✓</em>}
                      {picked === option && !isRight && <em>✕</em>}
                    </button>
                  );
                })}
              </div>
              <p className="mono muted" style={{ marginTop: 14 }}>
                {picked ? (picked === current.a ? current.fact : `Nope — ${current.a}. ${current.fact}`) : 'Choose carefully.'}
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </ToolShell>
  );
};
