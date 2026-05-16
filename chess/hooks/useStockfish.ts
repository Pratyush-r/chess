'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { Difficulty } from '@/types/chess';

export function useStockfish(difficulty: Difficulty, isPlayerColor: 'white' | 'black') {
  const { gameState, makeMove, setEvaluation, setIsThinking } = useGameStore();
  const [isReady, setIsReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const isCalculating = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const worker = new Worker('/stockfish/stockfish.js');
    workerRef.current = worker;

    const depthMap: Record<Difficulty, number> = {
      beginner: 2, easy: 5, medium: 8, hard: 15, expert: 20,
    };
    const skillMap: Record<Difficulty, number> = {
      beginner: 1, easy: 5, medium: 10, hard: 16, expert: 20,
    };
    const eloMap: Record<Difficulty, number> = {
      beginner: 400, easy: 800, medium: 1200, hard: 1800, expert: 2500,
    };

    let initialized = false;

    worker.onmessage = (e: MessageEvent<string>) => {
      const msg = e.data;

      if (msg === 'uciok' && !initialized) {
        worker.postMessage('isready');
      } else if (msg === 'readyok' && !initialized) {
        initialized = true;
        worker.postMessage(`setoption name Skill Level value ${skillMap[difficulty]}`);
        if (difficulty === 'beginner' || difficulty === 'easy') {
          worker.postMessage('setoption name UCI_LimitStrength value true');
          worker.postMessage(`setoption name UCI_Elo value ${eloMap[difficulty]}`);
        }
        worker.postMessage('ucinewgame');
        setIsReady(true);
      } else if (msg.startsWith('info depth')) {
        const scoreMatch = msg.match(/score (cp|mate) (-?\d+)/);
        const depthMatch = msg.match(/depth (\d+)/);
        const pvMatch = msg.match(/pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (scoreMatch && depthMatch) {
          const type = scoreMatch[1];
          const val = parseInt(scoreMatch[2]);
          const score = type === 'cp' ? val / 100 : (val > 0 ? 10 : -10);
          const mate = type === 'mate' ? val : null;
          setEvaluation({
            score: gameState.activeColor === 'w' ? score : -score,
            depth: parseInt(depthMatch[1]),
            bestMove: pvMatch?.[1],
            mate,
            isLoading: false,
          });
        }
      } else if (msg.startsWith('bestmove') && isCalculating.current) {
        isCalculating.current = false;
        setIsThinking(false);
        const parts = msg.split(' ');
        const bestMove = parts[1];
        if (bestMove && bestMove !== '(none)' && bestMove.length >= 4) {
          const from = bestMove.slice(0, 2);
          const to = bestMove.slice(2, 4);
          const promotion = bestMove.length === 5 ? bestMove[4] : undefined;
          makeMove({ from: from as any, to: to as any, promotion: promotion as any });
        }
      }
    };

    worker.postMessage('uci');

    return () => {
      worker.postMessage('quit');
      worker.terminate();
      workerRef.current = null;
      setIsReady(false);
    };
  }, [difficulty]);

  const requestMove = useCallback((fen: string) => {
    const worker = workerRef.current;
    if (!worker || !isReady || isCalculating.current) return;

    const depthMap: Record<Difficulty, number> = {
      beginner: 2, easy: 5, medium: 8, hard: 15, expert: 20,
    };

    isCalculating.current = true;
    setIsThinking(true);
    setEvaluation({ score: 0, depth: 0, isLoading: true });

    worker.postMessage('stop');
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depthMap[difficulty]} movetime 800`);
  }, [isReady, difficulty, setIsThinking, setEvaluation]);

  // Auto-trigger when it's the AI's turn
  useEffect(() => {
    const { status, activeColor, fen } = gameState;
    if (!isReady) return;
    if (status !== 'playing' && status !== 'check') return;

    const aiColor = isPlayerColor === 'white' ? 'b' : 'w';
    if (activeColor === aiColor) {
      // Small delay for better UX
      const timer = setTimeout(() => requestMove(fen), 300);
      return () => clearTimeout(timer);
    }
  }, [gameState.activeColor, gameState.status, isReady, isPlayerColor, requestMove]);

  return { isReady, requestMove };
}
