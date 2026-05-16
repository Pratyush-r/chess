'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Puzzle, ChevronRight, RotateCcw, Lightbulb, CheckCircle, XCircle, Zap, Trophy, Flame } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { useTutorialStore } from '@/store/tutorialStore';
import { useUserStore } from '@/store/userStore';
import type { Square } from 'chess.js';
import type { SquareHighlight } from '@/types/chess';
import toast from 'react-hot-toast';

interface PuzzleData {
  id: string;
  fen: string;
  solution: string[];
  title: string;
  description: string;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
}

const DAILY_PUZZLES: PuzzleData[] = [
  {
    id: 'p1',
    title: 'Fork the King and Rook',
    description: 'Find the knight move that forks the king and rook.',
    fen: '8/8/8/3k4/5r2/4N3/8/4K3 w - - 0 1',
    solution: ['e3c4'],
    theme: 'fork',
    difficulty: 'easy',
    rating: 1200,
  },
  {
    id: 'p2',
    title: 'Back Rank Mate',
    description: 'Deliver checkmate on the back rank.',
    fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
    solution: ['a1a8'],
    theme: 'back-rank',
    difficulty: 'easy',
    rating: 1100,
  },
  {
    id: 'p3',
    title: 'Queen Sacrifice Mate',
    description: 'Sacrifice the queen for a forced checkmate.',
    fen: '5rk1/pbp3pp/1p6/3Pq3/2B1N3/2Q3P1/PP3P1P/R5K1 w - - 0 1',
    solution: ['c3g7'],
    theme: 'sacrifice',
    difficulty: 'medium',
    rating: 1500,
  },
  {
    id: 'p4',
    title: 'Discovered Check',
    description: 'Move a piece to reveal a devastating discovered check.',
    fen: '8/8/8/3q4/4B3/8/8/4K1k1 w - - 0 1',
    solution: ['e4f3'],
    theme: 'discovered-check',
    difficulty: 'medium',
    rating: 1400,
  },
  {
    id: 'p5',
    title: 'Smothered Mate',
    description: 'The classic knight smothered mate pattern.',
    fen: '6rk/6pp/8/8/8/8/8/5NQK w - - 0 1',
    solution: ['g1g6'],
    theme: 'smothered-mate',
    difficulty: 'hard',
    rating: 1800,
  },
  {
    id: 'p6',
    title: 'Pin to Win',
    description: 'Use a pin to win material.',
    fen: '8/8/4k3/8/8/4R3/4K3/8 w - - 0 1',
    solution: ['e3e6'],
    theme: 'pin',
    difficulty: 'easy',
    rating: 1150,
  },
];

type PuzzleState = 'idle' | 'correct' | 'incorrect' | 'hint';

function buildHighlights(squares: string[], type: SquareHighlight['type']): SquareHighlight[] {
  return squares.map((sq) => ({ square: sq as Square, type }));
}

export default function PuzzlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [puzzleState, setPuzzleState] = useState<PuzzleState>('idle');
  const [message, setMessage] = useState('');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<SquareHighlight[]>([]);
  const [solutionStep, setSolutionStep] = useState(0);
  const [fen, setFen] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const gameRef = useRef(new Chess());

  const { addXp } = useUserStore();

  const puzzle = DAILY_PUZZLES[currentIndex];

  useEffect(() => {
    loadPuzzle(puzzle);
  }, [currentIndex]);

  const loadPuzzle = useCallback((p: PuzzleData) => {
    const g = new Chess(p.fen);
    gameRef.current = g;
    setFen(p.fen);
    setPuzzleState('idle');
    setMessage(p.description);
    setSelectedSquare(null);
    setHighlights([]);
    setSolutionStep(0);
    setHintsUsed(0);
  }, []);

  const handleSquareClick = useCallback((square: string) => {
    if (puzzleState === 'correct') return;
    const game = gameRef.current;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setHighlights([]);
        return;
      }

      const expectedUci = puzzle.solution[solutionStep];
      const attemptedUci = `${selectedSquare}${square}`;

      if (attemptedUci === expectedUci || attemptedUci + 'q' === expectedUci) {
        // Correct
        try {
          game.move({ from: selectedSquare as Square, to: square as Square, promotion: 'q' });
          setFen(game.fen());

          const nextStep = solutionStep + 1;
          if (nextStep >= puzzle.solution.length) {
            // Puzzle solved!
            setPuzzleState('correct');
            setMessage('Excellent! Puzzle solved! 🎉');
            setHighlights([]);
            setSolved((prev) => [...prev, puzzle.id]);
            setStreak((s) => s + 1);
            const xp = puzzle.difficulty === 'easy' ? 20 : puzzle.difficulty === 'medium' ? 40 : 60;
            addXp(xp);
            toast.success(`+${xp} XP! Puzzle solved!`);
          } else {
            // Play opponent's response
            setSolutionStep(nextStep);
            setTimeout(() => {
              const oppMove = puzzle.solution[nextStep];
              if (oppMove) {
                const from = oppMove.slice(0, 2) as Square;
                const to = oppMove.slice(2, 4) as Square;
                game.move({ from, to, promotion: 'q' });
                setFen(game.fen());
                setSolutionStep(nextStep + 1);
              }
            }, 500);
            setMessage('Good! Keep going...');
          }
        } catch {
          setPuzzleState('incorrect');
          setMessage('That\'s not legal. Try again!');
        }
      } else {
        // Wrong move
        setPuzzleState('incorrect');
        setMessage('Not the right move. Think about the pattern!');
        setTimeout(() => {
          setPuzzleState('idle');
          setMessage(puzzle.description);
        }, 1500);
      }

      setSelectedSquare(null);
      setHighlights([]);
    } else {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square: square as Square, verbose: true });
        const hl: SquareHighlight[] = [
          { square: square as Square, type: 'selected' },
          ...moves.map((m) => ({ square: m.to as Square, type: 'move' as const })),
        ];
        setHighlights(hl);
      }
    }
  }, [puzzle, puzzleState, selectedSquare, solutionStep, addXp]);

  const handlePieceDrop = useCallback((from: string, to: string): boolean => {
    handleSquareClick(from);
    handleSquareClick(to);
    return false; // let our logic handle position update
  }, [handleSquareClick]);

  const handleHint = useCallback(() => {
    const expectedUci = puzzle.solution[solutionStep];
    const from = expectedUci.slice(0, 2);
    setHintsUsed((h) => h + 1);
    setPuzzleState('hint');
    setHighlights([{ square: from as Square, type: 'hint' }]);
    setMessage(`Hint: Move the piece on ${from}`);
  }, [puzzle, solutionStep]);

  const handleRetry = useCallback(() => {
    loadPuzzle(puzzle);
    setStreak(0);
  }, [puzzle, loadPuzzle]);

  const handleNext = useCallback(() => {
    if (currentIndex < DAILY_PUZZLES.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      toast('You\'ve completed all puzzles for today! Come back tomorrow.');
    }
  }, [currentIndex]);

  const squareStyles: Record<string, React.CSSProperties> = {};
  for (const h of highlights) {
    if (h.type === 'selected') squareStyles[h.square] = { backgroundColor: 'rgba(186,202,68,0.8)' };
    else if (h.type === 'move') squareStyles[h.square] = { background: 'radial-gradient(circle, rgba(20,85,30,0.55) 36%, transparent 40%)' };
    else if (h.type === 'hint') squareStyles[h.square] = { backgroundColor: 'rgba(168,85,247,0.5)' };
  }

  const difficultyVariant = { easy: 'success' as const, medium: 'warning' as const, hard: 'danger' as const };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Puzzle size={20} className="text-purple-400" />
                <span className="text-purple-400 font-medium text-sm">Daily Puzzles</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Chess Puzzles</h1>
              <p className="text-gray-400 text-sm mt-1">Sharpen your tactics with daily challenges</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-orange-400 font-bold text-xl">
                  <Flame size={20} />
                  {streak}
                </div>
                <p className="text-gray-500 text-xs">Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-primary-400 font-bold text-xl">
                  <CheckCircle size={20} />
                  {solved.length}
                </div>
                <p className="text-gray-500 text-xs">Solved today</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Board */}
          <div className="flex flex-col items-center">
            {/* Puzzle info bar */}
            <div className="w-full max-w-[520px] mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm font-medium">Puzzle {currentIndex + 1}/{DAILY_PUZZLES.length}</span>
                <Badge variant={difficultyVariant[puzzle.difficulty]}>{puzzle.difficulty}</Badge>
                <Badge variant="default">★ {puzzle.rating}</Badge>
              </div>
              <div className="flex items-center gap-1 text-purple-400 text-sm">
                <span>Theme: {puzzle.theme}</span>
              </div>
            </div>

            <div className="w-full max-w-[520px]">
              <Chessboard
                id="puzzle-board"
                position={fen}
                onSquareClick={handleSquareClick}
                onPieceDrop={handlePieceDrop}
                customSquareStyles={squareStyles}
                animationDuration={200}
                customBoardStyle={{ borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                boardOrientation={gameRef.current.turn() === 'w' ? 'white' : 'black'}
              />
            </div>

            {/* Puzzle index navigation */}
            <div className="flex gap-2 mt-4">
              {DAILY_PUZZLES.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    i === currentIndex ? 'bg-primary-500 text-white' :
                      solved.includes(p.id) ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                        'bg-gray-800 text-gray-500 hover:bg-gray-700'
                  }`}
                >
                  {solved.includes(p.id) ? '✓' : i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Puzzle panel */}
          <div className="space-y-4">
            {/* Status */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${puzzleState}-${message.slice(0, 20)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-2xl border p-5 ${
                  puzzleState === 'correct' ? 'bg-primary-500/10 border-primary-500/30' :
                    puzzleState === 'incorrect' ? 'bg-red-500/10 border-red-500/30' :
                      puzzleState === 'hint' ? 'bg-purple-500/10 border-purple-500/30' :
                        'bg-gray-800/60 border-gray-700/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {puzzleState === 'correct' && <CheckCircle size={20} className="text-primary-400" />}
                    {puzzleState === 'incorrect' && <XCircle size={20} className="text-red-400" />}
                    {puzzleState === 'hint' && <Lightbulb size={20} className="text-purple-400" />}
                    {puzzleState === 'idle' && <Puzzle size={20} className="text-gray-400" />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{puzzle.title}</h3>
                    <p className="text-gray-300 text-sm">{message}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Whose turn */}
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 ${gameRef.current.turn() === 'w' ? 'bg-white border-gray-300' : 'bg-gray-900 border-gray-600'}`} />
              <span className="text-gray-300 text-sm">
                {gameRef.current.turn() === 'w' ? 'White' : 'Black'} to move
              </span>
            </div>

            {/* XP reward */}
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-4 flex items-center justify-between">
              <span className="text-gray-400 text-sm">XP reward</span>
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Zap size={16} />
                +{puzzle.difficulty === 'easy' ? 20 : puzzle.difficulty === 'medium' ? 40 : 60}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {puzzleState !== 'correct' && (
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={handleHint}
                  leftIcon={<Lightbulb size={16} />}
                  disabled={hintsUsed >= 2}
                >
                  Hint ({2 - hintsUsed} left)
                </Button>
              )}
              {puzzleState !== 'correct' ? (
                <Button variant="ghost" size="md" onClick={handleRetry} leftIcon={<RotateCcw size={16} />}>
                  Retry
                </Button>
              ) : (
                <Button variant="primary" size="md" className="flex-1" onClick={handleNext} rightIcon={<ChevronRight size={16} />}>
                  Next Puzzle
                </Button>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-4">
              <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">Tip</h4>
              <p className="text-gray-500 text-sm">
                Look for pieces that are undefended or overloaded. Check for forcing moves: checks, captures, and threats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
