'use client';

import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, BarChart2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import type { PlayerColor } from '@/types/chess';

interface GameResultModalProps {
  playerColor: PlayerColor;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function GameResultModal({ playerColor, onPlayAgain, onGoHome }: GameResultModalProps) {
  const { gameState } = useGameStore();
  const { status, winner, drawReason, moveHistory } = gameState;

  const isOpen = ['checkmate', 'stalemate', 'draw', 'resigned', 'timeout'].includes(status);
  if (!isOpen) return null;

  const playerWon = winner === playerColor;
  const isDraw = !winner;

  const title = isDraw ? "It's a Draw!" :
    playerWon ? '🎉 You Win!' : '😞 You Lose';

  const subtitle = (() => {
    if (status === 'checkmate') return playerWon ? 'Checkmate!' : 'You\'ve been checkmated.';
    if (status === 'stalemate') return 'Stalemate — no legal moves.';
    if (status === 'resigned') return playerWon ? 'Opponent resigned.' : 'You resigned.';
    if (status === 'timeout') return playerWon ? 'Opponent ran out of time.' : 'You ran out of time.';
    if (drawReason === 'threefold') return 'Threefold repetition.';
    if (drawReason === 'fifty-move') return '50-move rule draw.';
    if (drawReason === 'insufficient-material') return 'Insufficient material.';
    if (drawReason === 'agreement') return 'Draw by agreement.';
    return '';
  })();

  const emoji = isDraw ? '🤝' : playerWon ? '🏆' : '🎭';

  return (
    <Modal isOpen={true} onClose={undefined} showClose={false} size="md">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="text-6xl"
        >
          {emoji}
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold mb-2 ${
              playerWon ? 'text-primary-400' : isDraw ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            {title}
          </motion.h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        <div className="bg-gray-800/60 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">Moves</p>
            <p className="text-white font-bold text-xl">{moveHistory.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Result</p>
            <p className={`font-bold text-xl ${playerWon ? 'text-primary-400' : isDraw ? 'text-yellow-400' : 'text-red-400'}`}>
              {playerWon ? '+10 XP' : isDraw ? '+3 XP' : '+1 XP'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" onClick={onPlayAgain} leftIcon={<RotateCcw size={18} />}>
            Play Again
          </Button>
          <Button variant="secondary" size="md" className="w-full" onClick={onGoHome} leftIcon={<Home size={18} />}>
            Back to Home
          </Button>
        </div>
      </div>
    </Modal>
  );
}
