'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Share2, Copy, CheckCircle, Wifi } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChessBoardWrapper from '@/components/chess/ChessBoardWrapper';
import MoveList from '@/components/chess/MoveList';
import GameTimer from '@/components/chess/GameTimer';
import GameControls from '@/components/chess/GameControls';
import GameResultModal from '@/components/chess/GameResultModal';
import CapturedPieces from '@/components/chess/CapturedPieces';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useGameStore } from '@/store/gameStore';
import { useChessGame } from '@/hooks/useChessGame';
import { useTimer } from '@/hooks/useTimer';
import type { PlayerColor, TimeControl } from '@/types/chess';
import { TIME_CONTROLS } from '@/types/chess';
import { cn } from '@/utils/cn';
import { generateRoomCode } from '@/utils/chess';
import toast from 'react-hot-toast';

type MultiplayerMode = 'local' | 'online-host' | 'online-join';
type GamePhase = 'setup' | 'playing';

export default function PlayPlayerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [mpMode, setMpMode] = useState<MultiplayerMode>('local');
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS[4]);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  const { initGame, resign, resetGame } = useGameStore();
  const { onSquareClick, onPieceDrop, gameState } = useChessGame();
  useTimer();

  const currentTurnColor: PlayerColor = gameState.activeColor === 'w' ? 'white' : 'black';

  const handleStartLocal = useCallback(() => {
    initGame(
      { mode: 'vs-player', timeControl },
      {
        white: { id: 'p1', name: 'Player 1', rating: 800, color: 'white' },
        black: { id: 'p2', name: 'Player 2', rating: 800, color: 'black' },
      }
    );
    setPhase('playing');
  }, [initGame, timeControl]);

  const handleCreateRoom = useCallback(() => {
    const code = generateRoomCode();
    setRoomCode(code);
    toast.success(`Room created! Share code: ${code}`);
  }, []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Room code copied!');
  }, [roomCode]);

  const handleJoinRoom = useCallback(() => {
    if (joinCode.length !== 4) {
      toast.error('Enter a 4-character room code');
      return;
    }
    toast('Connecting to room... (mock — backend not configured)', { icon: 'ℹ️' });
  }, [joinCode]);

  const handleResign = useCallback(() => {
    if (confirm('Resign?')) resign(currentTurnColor);
  }, [resign, currentTurnColor]);

  const handlePlayAgain = useCallback(() => {
    resetGame();
    setPhase('setup');
  }, [resetGame]);

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
              <Link href="/"><Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>Back</Button></Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Play vs Player</h1>
                <p className="text-gray-400 text-sm">Local or online multiplayer</p>
              </div>
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {([
                { id: 'local', label: 'Local', icon: '🏠', desc: 'Same device' },
                { id: 'online-host', label: 'Host', icon: '📡', desc: 'Create room' },
                { id: 'online-join', label: 'Join', icon: '🔗', desc: 'Enter code' },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMpMode(m.id)}
                  className={cn(
                    'py-3 px-2 rounded-xl border text-center transition-all',
                    mpMode === m.id
                      ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  )}
                >
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div className="font-medium text-sm">{m.label}</div>
                  <div className="text-xs text-gray-500">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Time control */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Time Control</label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_CONTROLS.slice(0, 8).map((tc) => (
                  <button
                    key={tc.label}
                    onClick={() => setTimeControl(tc)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-medium border transition-all',
                      timeControl.label === tc.label
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    )}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode-specific UI */}
            <AnimatePresence mode="wait">
              {mpMode === 'local' && (
                <motion.div key="local" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Button variant="primary" size="xl" className="w-full" onClick={handleStartLocal} leftIcon={<Users size={20} />}>
                    Start Local Game
                  </Button>
                </motion.div>
              )}

              {mpMode === 'online-host' && (
                <motion.div key="host" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  {!roomCode ? (
                    <Button variant="primary" size="xl" className="w-full" onClick={handleCreateRoom} leftIcon={<Wifi size={20} />}>
                      Create Room
                    </Button>
                  ) : (
                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 text-center space-y-3">
                      <p className="text-gray-400 text-sm">Share this code with your friend</p>
                      <div className="text-4xl font-bold text-white tracking-[0.3em] font-mono">{roomCode}</div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyCode}
                        leftIcon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        className="mx-auto"
                      >
                        {copied ? 'Copied!' : 'Copy Code'}
                      </Button>
                      <p className="text-gray-500 text-xs">Waiting for opponent to join...</p>
                      <div className="flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {mpMode === 'online-join' && (
                <motion.div key="join" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter 4-letter room code"
                    maxLength={4}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold font-mono tracking-widest focus:outline-none focus:border-primary-500 uppercase placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal"
                  />
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full"
                    onClick={handleJoinRoom}
                    disabled={joinCode.length !== 4}
                    leftIcon={<Share2 size={20} />}
                  >
                    Join Room
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  // Local game board — both players share the screen, board auto-flips
  const orientation = currentTurnColor;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={handlePlayAgain}>New Game</Button>
          <div className="flex items-center gap-2">
            <Badge variant={currentTurnColor === 'white' ? 'default' : 'info'}>
              {currentTurnColor === 'white' ? '♔' : '♚'} {currentTurnColor === 'white' ? 'Player 1' : 'Player 2'}'s turn
            </Badge>
          </div>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col items-center">
            {/* Opponent info (top) */}
            <div className="w-full max-w-[560px] mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {orientation === 'white' ? '♚' : '♔'}
                </div>
                <p className="text-white text-sm font-medium">
                  {orientation === 'white' ? 'Player 2 (Black)' : 'Player 1 (White)'}
                </p>
              </div>
              <CapturedPieces color={orientation === 'white' ? 'black' : 'white'} />
              <GameTimer color={orientation === 'white' ? 'black' : 'white'} className="w-24 h-12" />
            </div>

            <ChessBoardWrapper
              orientation={orientation}
              interactive={true}
              onSquareClick={onSquareClick}
              onPieceDrop={onPieceDrop}
              className="w-full max-w-[560px]"
            />

            {/* Current player info (bottom) */}
            <div className="w-full max-w-[560px] mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                  {orientation === 'white' ? '♔' : '♚'}
                </div>
                <p className="text-white text-sm font-medium">
                  {orientation === 'white' ? 'Player 1 (White)' : 'Player 2 (Black)'}
                </p>
              </div>
              <CapturedPieces color={orientation} />
              <GameTimer color={orientation} className="w-24 h-12" />
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-64 space-y-4">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Move History</h3>
              <div className="h-64"><MoveList /></div>
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
              <GameControls
                playerColor={currentTurnColor}
                onResign={handleResign}
                onOfferDraw={() => toast('Draw offer sent!')}
              />
            </div>
          </div>
        </div>
      </div>

      <GameResultModal playerColor={currentTurnColor} onPlayAgain={handlePlayAgain} onGoHome={() => { resetGame(); router.push('/'); }} />
    </div>
  );
}
