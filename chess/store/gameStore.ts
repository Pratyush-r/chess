'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Chess } from 'chess.js';
import type {
  GameState, GameConfig, Player, EvaluationData,
  MoveHistoryEntry, ChessMove, SquareHighlight, MoveArrow, PlayerColor,
} from '@/types/chess';

interface GameStore {
  // Core game state
  game: Chess;
  gameState: GameState;
  config: GameConfig | null;
  players: { white: Player | null; black: Player | null };

  // UI state
  selectedSquare: string | null;
  highlights: SquareHighlight[];
  arrows: MoveArrow[];
  evaluation: EvaluationData;
  isThinking: boolean;
  showPromotion: boolean;
  pendingPromotion: { from: string; to: string } | null;

  // Clocks
  whiteTime: number;
  blackTime: number;
  activeTimer: 'white' | 'black' | null;

  // Actions
  initGame: (config: GameConfig, players: { white: Player; black: Player }) => void;
  makeMove: (move: ChessMove) => boolean;
  undoMove: () => void;
  resetGame: () => void;
  setSelectedSquare: (square: string | null) => void;
  setHighlights: (highlights: SquareHighlight[]) => void;
  setArrows: (arrows: MoveArrow[]) => void;
  setEvaluation: (evaluation: EvaluationData) => void;
  setIsThinking: (thinking: boolean) => void;
  setShowPromotion: (show: boolean, pending?: { from: string; to: string } | null) => void;
  jumpToMove: (index: number) => void;
  tickTimer: (color: 'white' | 'black') => void;
  pauseTimer: () => void;
  resign: (color: PlayerColor) => void;
  offerDraw: () => void;
  acceptDraw: () => void;
}

const initialGameState = (): GameState => ({
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn: '',
  moveHistory: [],
  currentMoveIndex: -1,
  status: 'idle',
  activeColor: 'w',
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  isDraw: false,
  capturedPieces: { white: [], black: [] },
});

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    game: new Chess(),
    gameState: initialGameState(),
    config: null,
    players: { white: null, black: null },
    selectedSquare: null,
    highlights: [],
    arrows: [],
    evaluation: { score: 0, depth: 0, isLoading: false },
    isThinking: false,
    showPromotion: false,
    pendingPromotion: null,
    whiteTime: 600,
    blackTime: 600,
    activeTimer: null,

    initGame: (config, players) => {
      const game = new Chess();
      const timeControl = config.timeControl?.initial ?? 600;
      set({
        game,
        config,
        players,
        gameState: { ...initialGameState(), status: 'playing' },
        selectedSquare: null,
        highlights: [],
        arrows: [],
        evaluation: { score: 0, depth: 0, isLoading: false },
        isThinking: false,
        whiteTime: timeControl,
        blackTime: timeControl,
        activeTimer: 'white',
      });
    },

    makeMove: (moveData) => {
      const { game, gameState, config } = get();
      try {
        const result = game.move({
          from: moveData.from,
          to: moveData.to,
          promotion: moveData.promotion ?? 'q',
        });
        if (!result) return false;

        const capturedPieces = { ...gameState.capturedPieces };
        if (result.captured) {
          if (result.color === 'w') {
            capturedPieces.white = [...capturedPieces.white, result.captured];
          } else {
            capturedPieces.black = [...capturedPieces.black, result.captured];
          }
        }

        const newEntry: MoveHistoryEntry = {
          move: { from: result.from as any, to: result.to as any, promotion: result.promotion, san: result.san },
          fen: game.fen(),
          san: result.san,
          moveNumber: Math.ceil(game.history().length / 2),
          color: result.color,
          timestamp: Date.now(),
        };

        let status: GameState['status'] = 'playing';
        let winner: PlayerColor | undefined;
        let drawReason: GameState['drawReason'];

        if (game.isCheckmate()) {
          status = 'checkmate';
          winner = result.color === 'w' ? 'white' : 'black';
        } else if (game.isStalemate()) {
          status = 'stalemate';
        } else if (game.isThreefoldRepetition()) {
          status = 'draw';
          drawReason = 'threefold';
        } else if (game.isInsufficientMaterial()) {
          status = 'draw';
          drawReason = 'insufficient-material';
        } else if (game.isDraw()) {
          status = 'draw';
          drawReason = 'fifty-move';
        } else if (game.inCheck()) {
          status = 'check';
        }

        const newHistory = [...gameState.moveHistory, newEntry];
        const newIndex = newHistory.length - 1;

        // Switch timer
        const nextActive = result.color === 'w' ? 'black' : 'white';
        const increment = config?.timeControl?.increment ?? 0;

        set((state) => ({
          gameState: {
            ...state.gameState,
            fen: game.fen(),
            pgn: game.pgn(),
            moveHistory: newHistory,
            currentMoveIndex: newIndex,
            status,
            activeColor: game.turn(),
            isCheck: game.inCheck(),
            isCheckmate: game.isCheckmate(),
            isStalemate: game.isStalemate(),
            isDraw: game.isDraw(),
            drawReason,
            winner,
            lastMove: { from: result.from as any, to: result.to as any },
            capturedPieces,
          },
          selectedSquare: null,
          highlights: [],
          activeTimer: status === 'playing' || status === 'check' ? nextActive : null,
          // Add increment to the player who just moved
          whiteTime: result.color === 'w' ? state.whiteTime + increment : state.whiteTime,
          blackTime: result.color === 'b' ? state.blackTime + increment : state.blackTime,
        }));

        return true;
      } catch {
        return false;
      }
    },

    undoMove: () => {
      const { game, gameState } = get();
      if (gameState.moveHistory.length === 0) return;

      // Undo twice if playing vs computer (undo both AI and player move)
      game.undo();
      const newHistory = gameState.moveHistory.slice(0, -1);

      set((state) => ({
        game,
        gameState: {
          ...state.gameState,
          fen: game.fen(),
          pgn: game.pgn(),
          moveHistory: newHistory,
          currentMoveIndex: newHistory.length - 1,
          status: 'playing',
          activeColor: game.turn(),
          isCheck: game.inCheck(),
          isCheckmate: false,
          isStalemate: false,
          isDraw: false,
          lastMove: newHistory.length > 0 ? newHistory[newHistory.length - 1].move : undefined,
        },
        selectedSquare: null,
      }));
    },

    resetGame: () => {
      const game = new Chess();
      set({
        game,
        gameState: initialGameState(),
        selectedSquare: null,
        highlights: [],
        arrows: [],
        isThinking: false,
        activeTimer: null,
      });
    },

    setSelectedSquare: (square) => set({ selectedSquare: square }),
    setHighlights: (highlights) => set({ highlights }),
    setArrows: (arrows) => set({ arrows }),
    setEvaluation: (evaluation) => set({ evaluation }),
    setIsThinking: (isThinking) => set({ isThinking }),

    setShowPromotion: (show, pending = null) =>
      set({ showPromotion: show, pendingPromotion: pending }),

    jumpToMove: (index) => {
      const { gameState } = get();
      const game = new Chess();

      if (index < 0) {
        set({ game, gameState: { ...gameState, fen: game.fen(), currentMoveIndex: -1 } });
        return;
      }

      const movesToReplay = gameState.moveHistory.slice(0, index + 1);
      for (const entry of movesToReplay) {
        game.move({ from: entry.move.from, to: entry.move.to, promotion: entry.move.promotion });
      }

      set({ game, gameState: { ...gameState, fen: game.fen(), currentMoveIndex: index } });
    },

    tickTimer: (color) => {
      set((state) => {
        const timeKey = color === 'white' ? 'whiteTime' : 'blackTime';
        const newTime = Math.max(0, state[timeKey] - 1);
        if (newTime === 0) {
          return {
            [timeKey]: 0,
            activeTimer: null,
            gameState: {
              ...state.gameState,
              status: 'timeout',
              winner: color === 'white' ? 'black' : 'white',
            },
          };
        }
        return { [timeKey]: newTime };
      });
    },

    pauseTimer: () => set({ activeTimer: null }),

    resign: (color) => {
      set((state) => ({
        activeTimer: null,
        gameState: {
          ...state.gameState,
          status: 'resigned',
          winner: color === 'white' ? 'black' : 'white',
        },
      }));
    },

    offerDraw: () => {},

    acceptDraw: () => {
      set((state) => ({
        activeTimer: null,
        gameState: {
          ...state.gameState,
          status: 'draw',
          drawReason: 'agreement',
        },
      }));
    },
  }))
);
