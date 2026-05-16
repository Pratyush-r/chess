'use client';

import { motion } from 'framer-motion';
import { RotateCcw, SkipBack, ChevronLeft, ChevronRight, SkipForward, Flag, Handshake, Lightbulb } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { PlayerColor } from '@/types/chess';
import { cn } from '@/utils/cn';

interface GameControlsProps {
  playerColor: PlayerColor;
  onResign: () => void;
  onOfferDraw: () => void;
  onHint?: () => void;
  showHint?: boolean;
  className?: string;
}

export default function GameControls({ playerColor, onResign, onOfferDraw, onHint, showHint = false, className }: GameControlsProps) {
  const { gameState, jumpToMove, undoMove } = useGameStore();
  const { moveHistory, currentMoveIndex, status } = gameState;
  const isPlaying = status === 'playing' || status === 'check';

  const canGoBack = currentMoveIndex > 0;
  const canGoForward = currentMoveIndex < moveHistory.length - 1;

  const ControlBtn = ({ onClick, disabled, title, children }: {
    onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode;
  }) => (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-lg transition-colors',
        disabled
          ? 'text-gray-600 cursor-not-allowed'
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
      )}
    >
      {children}
    </motion.button>
  );

  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      {/* Navigation controls */}
      <div className="flex items-center gap-1">
        <ControlBtn onClick={() => jumpToMove(-1)} disabled={!canGoBack} title="Go to start">
          <SkipBack size={16} />
        </ControlBtn>
        <ControlBtn onClick={() => jumpToMove(currentMoveIndex - 1)} disabled={!canGoBack} title="Previous move">
          <ChevronLeft size={16} />
        </ControlBtn>
        <ControlBtn onClick={() => jumpToMove(currentMoveIndex + 1)} disabled={!canGoForward} title="Next move">
          <ChevronRight size={16} />
        </ControlBtn>
        <ControlBtn onClick={() => jumpToMove(moveHistory.length - 1)} disabled={!canGoForward} title="Go to end">
          <SkipForward size={16} />
        </ControlBtn>
      </div>

      {/* Game action controls */}
      <div className="flex items-center gap-1">
        {showHint && onHint && (
          <ControlBtn onClick={onHint} title="Get a hint" disabled={!isPlaying}>
            <Lightbulb size={16} />
          </ControlBtn>
        )}
        <ControlBtn onClick={undoMove} disabled={!isPlaying || moveHistory.length === 0} title="Undo move">
          <RotateCcw size={16} />
        </ControlBtn>
        <ControlBtn onClick={onOfferDraw} disabled={!isPlaying} title="Offer draw">
          <Handshake size={16} />
        </ControlBtn>
        <motion.button
          whileHover={!isPlaying ? {} : { scale: 1.05 }}
          onClick={onResign}
          disabled={!isPlaying}
          title="Resign"
          className={cn(
            'p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1',
            isPlaying
              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
              : 'text-gray-600 cursor-not-allowed'
          )}
        >
          <Flag size={16} />
        </motion.button>
      </div>
    </div>
  );
}
