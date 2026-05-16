import type { Square, PieceSymbol, Color } from 'chess.js';

export type { Square, PieceSymbol, Color };

export type GameMode = 'tutorial' | 'vs-computer' | 'vs-player' | 'puzzle' | 'analysis';
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
export type PlayerColor = 'white' | 'black';
export type GameStatus = 'idle' | 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw' | 'resigned' | 'timeout';
export type DrawReason = 'stalemate' | 'threefold' | 'fifty-move' | 'insufficient-material' | 'agreement';

export interface ChessMove {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
  san?: string;
  lan?: string;
  before?: string;
  after?: string;
  flags?: string;
  piece?: PieceSymbol;
  captured?: PieceSymbol;
}

export interface MoveHistoryEntry {
  move: ChessMove;
  fen: string;
  san: string;
  moveNumber: number;
  color: Color;
  timestamp: number;
  evaluation?: number;
  isBest?: boolean;
  isBlunder?: boolean;
  isMistake?: boolean;
}

export interface GameState {
  fen: string;
  pgn: string;
  moveHistory: MoveHistoryEntry[];
  currentMoveIndex: number;
  status: GameStatus;
  activeColor: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  drawReason?: DrawReason;
  winner?: PlayerColor;
  lastMove?: ChessMove;
  capturedPieces: { white: PieceSymbol[]; black: PieceSymbol[] };
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  color: PlayerColor;
  timeRemaining?: number;
  isAI?: boolean;
  difficulty?: Difficulty;
}

export interface GameConfig {
  mode: GameMode;
  timeControl?: TimeControl;
  playerColor?: PlayerColor;
  difficulty?: Difficulty;
  enableHints?: boolean;
  enableEvalBar?: boolean;
  boardTheme?: BoardTheme;
  pieceSet?: PieceSet;
}

export interface TimeControl {
  initial: number;
  increment: number;
  label: string;
}

export type BoardTheme = 'classic' | 'ocean' | 'forest' | 'midnight' | 'coral' | 'marble';
export type PieceSet = 'standard' | 'neo' | 'alpha' | 'merida' | 'tatiana';

export interface SquareHighlight {
  square: Square;
  type: 'selected' | 'move' | 'capture' | 'check' | 'hint' | 'arrow-start' | 'arrow-end' | 'tutorial';
  color?: string;
}

export interface MoveArrow {
  from: Square;
  to: Square;
  color?: string;
  label?: string;
}

export interface EvaluationData {
  score: number;
  depth: number;
  bestMove?: string;
  pv?: string[];
  mate?: number | null;
  isLoading?: boolean;
}

export const TIME_CONTROLS: TimeControl[] = [
  { initial: 60, increment: 0, label: '1+0 Bullet' },
  { initial: 120, increment: 1, label: '2+1 Bullet' },
  { initial: 180, increment: 0, label: '3+0 Blitz' },
  { initial: 180, increment: 2, label: '3+2 Blitz' },
  { initial: 300, increment: 0, label: '5+0 Blitz' },
  { initial: 600, increment: 0, label: '10+0 Rapid' },
  { initial: 600, increment: 5, label: '10+5 Rapid' },
  { initial: 1800, increment: 0, label: '30+0 Classical' },
];

export const DIFFICULTY_SETTINGS: Record<Difficulty, { depth: number; skillLevel: number; label: string; elo: number }> = {
  beginner: { depth: 1, skillLevel: 1, label: 'Beginner', elo: 400 },
  easy: { depth: 3, skillLevel: 5, label: 'Easy', elo: 800 },
  medium: { depth: 8, skillLevel: 10, label: 'Medium', elo: 1200 },
  hard: { depth: 15, skillLevel: 16, label: 'Hard', elo: 1800 },
  expert: { depth: 20, skillLevel: 20, label: 'Expert', elo: 2500 },
};
