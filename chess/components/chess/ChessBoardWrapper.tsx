'use client';

import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { Square } from 'chess.js';
import type { SquareHighlight, MoveArrow } from '@/types/chess';
import PromotionModal from './PromotionModal';

interface ChessBoardWrapperProps {
  orientation?: 'white' | 'black';
  interactive?: boolean;
  onSquareClick?: (square: string) => void;
  onPieceDrop?: (from: string, to: string) => boolean;
  className?: string;
  boardWidth?: number;
}

function buildCustomSquareStyles(
  highlights: SquareHighlight[],
  lastMove?: { from: string; to: string }
): Record<string, React.CSSProperties> {
  const styles: Record<string, React.CSSProperties> = {};

  if (lastMove) {
    styles[lastMove.from] = { backgroundColor: 'rgba(246, 246, 105, 0.4)' };
    styles[lastMove.to] = { backgroundColor: 'rgba(246, 246, 105, 0.4)' };
  }

  for (const h of highlights) {
    switch (h.type) {
      case 'selected':
        styles[h.square] = { backgroundColor: 'rgba(186, 202, 68, 0.8)' };
        break;
      case 'move':
        styles[h.square] = {
          background: 'radial-gradient(circle, rgba(20,85,30,0.5) 36%, transparent 40%)',
        };
        break;
      case 'capture':
        styles[h.square] = {
          background: 'radial-gradient(circle, transparent 60%, rgba(20,85,30,0.5) 64%)',
        };
        break;
      case 'check':
        styles[h.square] = {
          background: 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0.3) 60%, transparent 70%)',
        };
        break;
      case 'hint':
        styles[h.square] = { backgroundColor: h.color ?? 'rgba(168,85,247,0.4)' };
        break;
      case 'tutorial':
        styles[h.square] = { backgroundColor: h.color ?? 'rgba(251,191,36,0.4)' };
        break;
    }
  }

  return styles;
}

export default function ChessBoardWrapper({
  orientation = 'white',
  interactive = true,
  onSquareClick,
  onPieceDrop,
  className,
  boardWidth,
}: ChessBoardWrapperProps) {
  const { gameState, highlights, arrows, showPromotion, pendingPromotion, makeMove, setShowPromotion, isThinking } = useGameStore();

  const customSquareStyles = buildCustomSquareStyles(highlights, gameState.lastMove);

  const customArrows = arrows.map((a) => [
    a.from as Square,
    a.to as Square,
    a.color ?? '#a855f7',
  ] as [Square, Square, string]);

  const handlePromotion = (piece: string) => {
    if (pendingPromotion) {
      makeMove({
        from: pendingPromotion.from as Square,
        to: pendingPromotion.to as Square,
        promotion: piece as any,
      });
    }
    setShowPromotion(false, null);
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <Chessboard
        id="main-board"
        position={gameState.fen}
        onSquareClick={interactive ? onSquareClick : undefined}
        onPieceDrop={interactive ? onPieceDrop : undefined}
        boardOrientation={orientation}
        customSquareStyles={customSquareStyles}
        customArrows={customArrows}
        animationDuration={200}
        boardWidth={boardWidth ?? 520}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        customDarkSquareStyle={{ backgroundColor: '#b58863' }}
        customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        areArrowsAllowed={true}
        showBoardNotation={true}
      />

      {/* Check highlight overlay */}
      {gameState.isCheck && (
        <div className="absolute inset-0 pointer-events-none rounded-lg ring-2 ring-red-500/60 animate-pulse" />
      )}

      {/* Thinking overlay */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-lg"
          >
            <div className="absolute bottom-2 right-2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-300">Thinking...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PromotionModal
        isOpen={showPromotion}
        color={gameState.activeColor === 'w' ? 'white' : 'black'}
        onSelect={handlePromotion}
        onCancel={() => setShowPromotion(false, null)}
      />
    </div>
  );
}
