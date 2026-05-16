'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings2, BarChart2, List, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChessBoardWrapper from '@/components/chess/ChessBoardWrapper';
import MoveList from '@/components/chess/MoveList';
import EvaluationBar from '@/components/chess/EvaluationBar';
import GameTimer from '@/components/chess/GameTimer';
import GameControls from '@/components/chess/GameControls';
import GameResultModal from '@/components/chess/GameResultModal';
import CapturedPieces from '@/components/chess/CapturedPieces';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useGameStore } from '@/store/gameStore';
import { useChessGame } from '@/hooks/useChessGame';
import { useStockfish } from '@/hooks/useStockfish';
import { useTimer } from '@/hooks/useTimer';
import type { Difficulty, PlayerColor, TimeControl } from '@/types/chess';
import { DIFFICULTY_SETTINGS, TIME_CONTROLS } from '@/types/chess';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

type GamePhase = 'setup' | 'playing' | 'ended';

export default function PlayComputerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS[4]); // 5+0
  const [activeTab, setActiveTab] = useState<'moves' | 'eval'>('moves');
  const [enableEvalBar, setEnableEvalBar] = useState(true);

  const { initGame, resign, acceptDraw, resetGame } = useGameStore();
  const { onSquareClick, onPieceDrop } = useChessGame();

  useTimer();
  useStockfish(difficulty, playerColor);

  const handleStartGame = useCallback(() => {
    initGame(
      {
        mode: 'vs-computer',
        timeControl,
        playerColor,
        difficulty,
        enableEvalBar,
      },
      {
        white: {
          id: 'player',
          name: 'You',
          rating: 800,
          color: 'white',
          isAI: playerColor !== 'white',
          difficulty: playerColor !== 'white' ? difficulty : undefined,
        },
        black: {
          id: 'ai',
          name: `Stockfish (${DIFFICULTY_SETTINGS[difficulty].label})`,
          rating: DIFFICULTY_SETTINGS[difficulty].elo,
          color: 'black',
          isAI: playerColor !== 'black',
          difficulty: playerColor !== 'black' ? difficulty : undefined,
        },
      }
    );
    setPhase('playing');
  }, [initGame, difficulty, playerColor, timeControl, enableEvalBar]);

  const handleResign = useCallback(() => {
    if (confirm('Are you sure you want to resign?')) {
      resign(playerColor);
    }
  }, [resign, playerColor]);

  const handlePlayAgain = useCallback(() => {
    resetGame();
    setPhase('setup');
  }, [resetGame]);

  const handleGoHome = useCallback(() => {
    resetGame();
    router.push('/');
  }, [resetGame, router]);

  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>Back</Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Play vs Computer</h1>
                <p className="text-gray-400 text-sm">Choose your settings</p>
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Difficulty</label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      'py-2 px-1 rounded-xl text-xs font-medium border transition-all',
                      difficulty === d
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    )}
                  >
                    {DIFFICULTY_SETTINGS[d].label}
                    <div className="text-gray-400 text-xs mt-0.5" style={{ fontSize: 9 }}>
                      ~{DIFFICULTY_SETTINGS[d].elo}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Play as</label>
              <div className="grid grid-cols-3 gap-3">
                {(['white', 'black'] as PlayerColor[]).concat().map((c) => (
                  <button
                    key={c}
                    onClick={() => setPlayerColor(c)}
                    className={cn(
                      'py-3 rounded-xl font-medium border transition-all flex flex-col items-center gap-1',
                      playerColor === c
                        ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    )}
                  >
                    <span className="text-2xl">{c === 'white' ? '♔' : '♚'}</span>
                    <span className="text-sm capitalize">{c}</span>
                  </button>
                ))}
                <button
                  onClick={() => setPlayerColor(Math.random() > 0.5 ? 'white' : 'black')}
                  className="py-3 rounded-xl font-medium border border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 transition-all flex flex-col items-center gap-1"
                >
                  <span className="text-2xl">🎲</span>
                  <span className="text-sm">Random</span>
                </button>
              </div>
            </div>

            {/* Time control */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">Time Control</label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_CONTROLS.map((tc) => (
                  <button
                    key={tc.label}
                    onClick={() => setTimeControl(tc)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-medium border transition-all',
                      timeControl.label === tc.label
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    )}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="mb-8 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={cn(
                    'w-10 h-5 rounded-full transition-colors relative',
                    enableEvalBar ? 'bg-primary-500' : 'bg-gray-700'
                  )}
                  onClick={() => setEnableEvalBar(!enableEvalBar)}
                >
                  <div className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                    enableEvalBar ? 'left-5' : 'left-0.5'
                  )} />
                </div>
                <span className="text-sm text-gray-400">Show evaluation bar</span>
              </label>
            </div>

            <Button variant="primary" size="xl" className="w-full" onClick={handleStartGame}>
              Start Game
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const orientation = playerColor;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={handlePlayAgain}>
              New Game
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">vs Stockfish</span>
              <Badge variant="info">{DIFFICULTY_SETTINGS[difficulty].label}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<BarChart2 size={16} />}
              onClick={() => setActiveTab('eval')}
              className={activeTab === 'eval' ? 'text-primary-400' : ''}
            >
              Analysis
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<List size={16} />}
              onClick={() => setActiveTab('moves')}
              className={activeTab === 'moves' ? 'text-primary-400' : ''}
            >
              Moves
            </Button>
          </div>
        </div>

        {/* Game Layout */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Evaluation bar - vertical on desktop */}
          {enableEvalBar && (
            <div className="hidden lg:flex items-stretch">
              <EvaluationBar orientation="vertical" className="w-6 min-h-0" />
            </div>
          )}

          {/* Board */}
          <div className="flex-1 flex flex-col items-center">
            {/* Opponent info */}
            <div className="w-full max-w-[560px] mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">🤖</div>
                <div>
                  <p className="text-white text-sm font-medium">Stockfish</p>
                  <p className="text-gray-500 text-xs">{DIFFICULTY_SETTINGS[difficulty].elo} rated</p>
                </div>
              </div>
              <CapturedPieces color={orientation === 'white' ? 'black' : 'white'} />
              <GameTimer color={orientation === 'white' ? 'black' : 'white'} className="w-24 h-12" />
            </div>

            {/* Eval bar horizontal on mobile */}
            {enableEvalBar && (
              <div className="w-full max-w-[560px] mb-2 lg:hidden">
                <EvaluationBar orientation="horizontal" />
              </div>
            )}

            <ChessBoardWrapper
              orientation={orientation}
              interactive={true}
              onSquareClick={onSquareClick}
              onPieceDrop={onPieceDrop}
              className="w-full max-w-[560px]"
            />

            {/* Player info */}
            <div className="w-full max-w-[560px] mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-sm">
                  {orientation === 'white' ? '♔' : '♚'}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">You</p>
                  <p className="text-gray-500 text-xs">Player</p>
                </div>
              </div>
              <CapturedPieces color={orientation} />
              <GameTimer color={orientation} className="w-24 h-12" />
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-72 space-y-4">
            {/* Tab content */}
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
              <div className="flex gap-1 mb-4">
                {(['moves', 'eval'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      activeTab === tab
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {tab === 'moves' ? 'Moves' : 'Analysis'}
                  </button>
                ))}
              </div>
              <div className="h-60">
                {activeTab === 'moves' ? (
                  <MoveList />
                ) : (
                  <div className="space-y-3">
                    <EvaluationBar orientation="horizontal" />
                    <p className="text-gray-500 text-xs text-center">
                      Depth: {useGameStore.getState().evaluation.depth}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
              <GameControls
                playerColor={playerColor}
                onResign={handleResign}
                onOfferDraw={() => toast('Draw offer not available vs AI')}
              />
            </div>
          </div>
        </div>
      </div>

      <GameResultModal
        playerColor={playerColor}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    </div>
  );
}
