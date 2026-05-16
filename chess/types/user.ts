export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
  peakRating: number;
  winRate: number;
  averageAccuracy: number;
  totalMoves: number;
  puzzlesSolved: number;
  lessonsCompleted: number;
  streak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'games' | 'puzzles' | 'lessons' | 'streaks' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  country?: string;
  joinedAt: number;
  stats: UserStats;
  achievements: Achievement[];
  xp: number;
  level: number;
  title?: 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King';
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  boardTheme: string;
  pieceSet: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showCoordinates: boolean;
  autoPromoteQueen: boolean;
  showLegalMoves: boolean;
  showLastMove: boolean;
  language: string;
}

export interface GameRecord {
  id: string;
  playedAt: number;
  opponent: string;
  opponentRating: number;
  result: 'win' | 'loss' | 'draw';
  mode: string;
  opening?: string;
  moves: number;
  accuracy?: number;
  pgn: string;
  timeControl: string;
}

export const XP_PER_LEVEL = 500;
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Pawn',
  5: 'Knight',
  10: 'Bishop',
  20: 'Rook',
  35: 'Queen',
  50: 'King',
};

export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) return LEVEL_TITLES[threshold];
  }
  return 'Pawn';
}

export function getXpForLevel(level: number): number {
  return level * XP_PER_LEVEL;
}
