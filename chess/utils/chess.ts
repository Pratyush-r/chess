import type { PieceSymbol } from 'chess.js';

export function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function isLowTime(seconds: number): boolean {
  return seconds < 30;
}

export function isCriticalTime(seconds: number): boolean {
  return seconds < 10;
}

export const PIECE_UNICODE: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

export const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0,
};

export function getPieceName(symbol: PieceSymbol): string {
  const names: Record<PieceSymbol, string> = {
    p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King',
  };
  return names[symbol];
}

export function evaluationToWinProbability(evaluation: number): number {
  return 1 / (1 + Math.exp(-0.37 * evaluation));
}

export function formatEvaluation(score: number, mate?: number | null): string {
  if (mate !== null && mate !== undefined) {
    return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`;
  }
  if (score > 0) return `+${score.toFixed(1)}`;
  return score.toFixed(1);
}

export function getMoveQuality(evaluation: number, previousEvaluation: number, isWhite: boolean): 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' {
  const delta = isWhite
    ? evaluation - previousEvaluation
    : previousEvaluation - evaluation;

  if (delta >= -0.1) return 'best';
  if (delta >= -0.3) return 'good';
  if (delta >= -0.8) return 'inaccuracy';
  if (delta >= -2.0) return 'mistake';
  return 'blunder';
}

export function parsePgn(pgn: string): string[] {
  const moves: string[] = [];
  const tokens = pgn.split(/\s+/);
  for (const token of tokens) {
    if (!token.match(/^\d+\./) && token !== '*' && token !== '1-0' && token !== '0-1' && token !== '1/2-1/2') {
      moves.push(token);
    }
  }
  return moves;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getOpeningName(moves: string[]): string {
  const openings: Record<string, string> = {
    'e4 e5': 'Open Game',
    'e4 e5 Nf3': 'King\'s Knight Opening',
    'e4 e5 Nf3 Nc6 Bb5': 'Ruy López',
    'e4 e5 Nf3 Nc6 Bc4': 'Italian Game',
    'd4 d5': 'Queen\'s Pawn Game',
    'd4 d5 c4': 'Queen\'s Gambit',
    'd4 Nf6': 'Indian Defense',
    'e4 c5': 'Sicilian Defense',
    'e4 e6': 'French Defense',
    'e4 c6': 'Caro-Kann Defense',
    'e4 d6': 'Pirc Defense',
  };

  for (let i = moves.length; i > 0; i--) {
    const key = moves.slice(0, i).join(' ');
    if (openings[key]) return openings[key];
  }
  return 'Unknown Opening';
}
