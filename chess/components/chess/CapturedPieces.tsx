'use client';

import { useGameStore } from '@/store/gameStore';
import { PIECE_UNICODE, PIECE_VALUES } from '@/utils/chess';
import type { PieceSymbol } from 'chess.js';

interface CapturedPiecesProps {
  color: 'white' | 'black';
  className?: string;
}

export default function CapturedPieces({ color, className }: CapturedPiecesProps) {
  const { gameState } = useGameStore();
  const pieces = gameState.capturedPieces[color];

  const materialValue = pieces.reduce((sum, p) => sum + PIECE_VALUES[p], 0);
  const opponentPieces = gameState.capturedPieces[color === 'white' ? 'black' : 'white'];
  const opponentValue = opponentPieces.reduce((sum, p) => sum + PIECE_VALUES[p], 0);
  const advantage = materialValue - opponentValue;

  // Sort by value descending
  const sorted = [...pieces].sort((a, b) => PIECE_VALUES[b] - PIECE_VALUES[a]);
  const prefix = color === 'white' ? 'w' : 'b';

  return (
    <div className={`flex items-center gap-1 min-h-6 ${className ?? ''}`}>
      <div className="flex flex-wrap gap-0.5">
        {sorted.map((piece, i) => (
          <span key={i} className="text-lg leading-none" title={piece.toUpperCase()}>
            {PIECE_UNICODE[`${prefix}${piece.toUpperCase()}`] ?? piece}
          </span>
        ))}
      </div>
      {advantage > 0 && (
        <span className="text-xs text-primary-400 font-bold ml-1">+{advantage}</span>
      )}
    </div>
  );
}
