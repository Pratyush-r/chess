'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { useGameStore } from '@/store/gameStore';
import type { Square } from 'chess.js';
import type { ChessMove, SquareHighlight } from '@/types/chess';

export function useChessGame() {
  const {
    game,
    gameState,
    config,
    selectedSquare,
    makeMove,
    setSelectedSquare,
    setHighlights,
  } = useGameStore();

  const getLegalMovesForSquare = useCallback((square: string): string[] => {
    const moves = game.moves({ square: square as Square, verbose: true });
    return moves.map((m) => m.to);
  }, [game]);

  const onSquareClick = useCallback((square: string) => {
    if (gameState.status !== 'playing' && gameState.status !== 'check') return;

    const piece = game.get(square as Square);
    const currentTurn = game.turn();

    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setHighlights([]);
        return;
      }

      const legalTargets = getLegalMovesForSquare(selectedSquare);
      if (legalTargets.includes(square)) {
        // Check for pawn promotion
        const movingPiece = game.get(selectedSquare as Square);
        const isPromotion =
          movingPiece?.type === 'p' &&
          ((movingPiece.color === 'w' && square[1] === '8') ||
            (movingPiece.color === 'b' && square[1] === '1'));

        if (isPromotion) {
          useGameStore.getState().setShowPromotion(true, { from: selectedSquare, to: square });
          return;
        }

        const success = makeMove({ from: selectedSquare as Square, to: square as Square });
        setSelectedSquare(null);
        setHighlights([]);
        if (!success) return;
      } else if (piece && piece.color === currentTurn) {
        // Select new piece
        setSelectedSquare(square);
        const targets = getLegalMovesForSquare(square);
        buildHighlights(square, targets);
      } else {
        setSelectedSquare(null);
        setHighlights([]);
      }
    } else {
      if (piece && piece.color === currentTurn) {
        setSelectedSquare(square);
        const targets = getLegalMovesForSquare(square);
        buildHighlights(square, targets);
      }
    }
  }, [game, gameState.status, selectedSquare, makeMove, setSelectedSquare, setHighlights, getLegalMovesForSquare]);

  const buildHighlights = useCallback((from: string, targets: string[]) => {
    const highlights: SquareHighlight[] = [
      { square: from as Square, type: 'selected' },
      ...targets.map((sq) => {
        const isCapture = !!game.get(sq as Square);
        return { square: sq as Square, type: isCapture ? 'capture' : 'move' } as SquareHighlight;
      }),
    ];
    setHighlights(highlights);
  }, [game, setHighlights]);

  const onPieceDrop = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    if (gameState.status !== 'playing' && gameState.status !== 'check') return false;

    const movingPiece = game.get(sourceSquare as Square);
    const isPromotion =
      movingPiece?.type === 'p' &&
      ((movingPiece.color === 'w' && targetSquare[1] === '8') ||
        (movingPiece.color === 'b' && targetSquare[1] === '1'));

    if (isPromotion) {
      useGameStore.getState().setShowPromotion(true, { from: sourceSquare, to: targetSquare });
      return false;
    }

    const success = makeMove({ from: sourceSquare as Square, to: targetSquare as Square });
    setSelectedSquare(null);
    setHighlights([]);
    return success;
  }, [game, gameState.status, makeMove, setSelectedSquare, setHighlights]);

  return {
    game,
    gameState,
    config,
    selectedSquare,
    onSquareClick,
    onPieceDrop,
    getLegalMovesForSquare,
  };
}
