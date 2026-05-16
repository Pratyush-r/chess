'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserStats, Achievement, GameRecord, UserPreferences } from '@/types/user';
import { getLevelTitle, getXpForLevel, XP_PER_LEVEL } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  boardTheme: 'classic',
  pieceSet: 'standard',
  soundEnabled: true,
  animationsEnabled: true,
  showCoordinates: true,
  autoPromoteQueen: false,
  showLegalMoves: true,
  showLastMove: true,
  language: 'en',
};

const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  rating: 800,
  peakRating: 800,
  winRate: 0,
  averageAccuracy: 0,
  totalMoves: 0,
  puzzlesSolved: 0,
  lessonsCompleted: 0,
  streak: 0,
  longestStreak: 0,
};

interface UserStore {
  profile: UserProfile | null;
  gameHistory: GameRecord[];
  isGuest: boolean;

  initGuestProfile: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addXp: (amount: number) => void;
  recordGame: (record: Omit<GameRecord, 'id'>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  updateStreak: () => void;
}

function createGuestProfile(): UserProfile {
  return {
    id: uuidv4(),
    username: 'Guest',
    displayName: 'Guest Player',
    joinedAt: Date.now(),
    stats: { ...DEFAULT_STATS },
    achievements: [],
    xp: 0,
    level: 1,
    title: 'Pawn',
    preferences: { ...DEFAULT_PREFERENCES },
  };
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      gameHistory: [],
      isGuest: true,

      initGuestProfile: () => {
        if (!get().profile) {
          set({ profile: createGuestProfile(), isGuest: true });
        }
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, preferences: { ...state.profile.preferences, ...prefs } }
            : state.profile,
        }));
      },

      addXp: (amount) => {
        set((state) => {
          if (!state.profile) return state;
          const newXp = state.profile.xp + amount;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          const title = getLevelTitle(newLevel) as UserProfile['title'];
          return {
            profile: { ...state.profile, xp: newXp, level: newLevel, title },
          };
        });
      },

      recordGame: (record) => {
        const fullRecord: GameRecord = { ...record, id: uuidv4() };
        set((state) => {
          const newHistory = [fullRecord, ...state.gameHistory].slice(0, 100);
          if (!state.profile) return { gameHistory: newHistory };

          const stats = { ...state.profile.stats };
          stats.gamesPlayed += 1;
          if (record.result === 'win') stats.wins += 1;
          else if (record.result === 'loss') stats.losses += 1;
          else stats.draws += 1;
          stats.winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0;

          return {
            gameHistory: newHistory,
            profile: { ...state.profile, stats },
          };
        });
      },

      unlockAchievement: (achievement) => {
        set((state) => {
          if (!state.profile) return state;
          const already = state.profile.achievements.some((a) => a.id === achievement.id);
          if (already) return state;
          return {
            profile: {
              ...state.profile,
              achievements: [...state.profile.achievements, { ...achievement, unlockedAt: Date.now() }],
            },
          };
        });
      },

      updateStats: (updates) => {
        set((state) => {
          if (!state.profile) return state;
          return {
            profile: {
              ...state.profile,
              stats: { ...state.profile.stats, ...updates },
            },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          if (!state.profile) return state;
          const today = new Date().toDateString();
          const lastActive = state.profile.stats.streak > 0 ? 'recent' : 'none';
          const stats = { ...state.profile.stats };
          stats.streak = (stats.streak || 0) + 1;
          stats.longestStreak = Math.max(stats.longestStreak, stats.streak);
          return { profile: { ...state.profile, stats } };
        });
      },
    }),
    {
      name: 'chessmaster-user',
      partialize: (state) => ({
        profile: state.profile,
        gameHistory: state.gameHistory,
        isGuest: state.isGuest,
      }),
    }
  )
);
