'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, Target, Flame, BookOpen,
  Puzzle, Swords, Award, Star, Zap, Clock, BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { useTutorialStore } from '@/store/tutorialStore';
import { LESSONS } from '@/features/tutorial/lessons';
import StatsCard from '@/components/dashboard/StatsCard';
import AchievementBadge from '@/components/dashboard/AchievementBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getLevelTitle, XP_PER_LEVEL } from '@/types/user';
import { cn } from '@/utils/cn';

const MOCK_ACHIEVEMENTS = [
  { id: 'first-win', title: 'First Victory', description: 'Win your first game', icon: '🏆', category: 'games' as const, rarity: 'common' as const },
  { id: 'scholar-mate', title: 'Scholar\'s Mate', description: 'Win in 4 moves', icon: '⚡', category: 'games' as const, rarity: 'rare' as const },
  { id: 'puzzle-10', title: 'Puzzle Solver', description: 'Solve 10 puzzles', icon: '🧩', category: 'puzzles' as const, rarity: 'common' as const },
  { id: 'lesson-5', title: 'Student', description: 'Complete 5 lessons', icon: '📚', category: 'lessons' as const, rarity: 'common' as const },
  { id: 'streak-7', title: 'Weekly Warrior', description: '7-day streak', icon: '🔥', category: 'streaks' as const, rarity: 'epic' as const },
  { id: 'rating-1000', title: 'Four Digits', description: 'Reach 1000 rating', icon: '💎', category: 'games' as const, rarity: 'epic' as const },
  { id: 'endgame', title: 'Endgame Expert', description: 'Complete all endgame lessons', icon: '♟', category: 'lessons' as const, rarity: 'legendary' as const },
  { id: 'checkmate-queen', title: 'Royal Flush', description: 'Checkmate with a queen sacrifice', icon: '👑', category: 'special' as const, rarity: 'legendary' as const },
];

export default function DashboardPage() {
  const { profile, gameHistory, initGuestProfile } = useUserStore();
  const { progress } = useTutorialStore();

  useEffect(() => { initGuestProfile(); }, [initGuestProfile]);

  if (!profile) return null;

  const stats = profile.stats;
  const xpInLevel = profile.xp % XP_PER_LEVEL;
  const levelTitle = getLevelTitle(profile.level);
  const completedLessons = progress.completedLessons.length;
  const totalLessons = LESSONS.length;
  const lessonPct = Math.round((completedLessons / totalLessons) * 100);

  const unlockedAchievements = profile.achievements;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/30 to-purple-500/30 border border-primary-500/30 flex items-center justify-center text-4xl">
                ♛
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white">
                {profile.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
                <Badge variant="gold">{levelTitle}</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-3">Level {profile.level} • {profile.xp} total XP</p>

              {/* XP Progress */}
              <div className="max-w-xs">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{xpInLevel} XP</span>
                  <span>{XP_PER_LEVEL} XP to level {profile.level + 1}</span>
                </div>
                <ProgressBar value={xpInLevel} max={XP_PER_LEVEL} color="gold" size="sm" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 flex-wrap">
              <Link href="/tutorial"><Button variant="outline" size="sm" leftIcon={<BookOpen size={14} />}>Continue Learning</Button></Link>
              <Link href="/play/computer"><Button variant="primary" size="sm" leftIcon={<Swords size={14} />}>Quick Play</Button></Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Stats Grid */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard
              title="Games Played"
              value={stats.gamesPlayed}
              icon={<Swords size={18} />}
              color="green"
              index={0}
            />
            <StatsCard
              title="Win Rate"
              value={`${stats.winRate.toFixed(0)}%`}
              subtitle={`${stats.wins}W / ${stats.losses}L / ${stats.draws}D`}
              icon={<TrendingUp size={18} />}
              color="blue"
              index={1}
            />
            <StatsCard
              title="Rating"
              value={stats.rating}
              subtitle={`Peak: ${stats.peakRating}`}
              icon={<BarChart2 size={18} />}
              color="purple"
              index={2}
            />
            <StatsCard
              title="Day Streak"
              value={stats.streak}
              subtitle={`Best: ${stats.longestStreak} days`}
              icon={<Flame size={18} />}
              color="gold"
              index={3}
            />
          </div>
        </section>

        {/* Learning Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Learning Progress</h2>
            <Link href="/tutorial"><Button variant="ghost" size="sm">View All Lessons</Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5 col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-xl">{completedLessons} / {totalLessons}</p>
                  <p className="text-gray-400 text-sm">Lessons completed</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                  <BookOpen size={20} className="text-primary-400" />
                </div>
              </div>
              <ProgressBar value={lessonPct} color="green" showLabel animated />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['beginner', 'intermediate', 'advanced'].map((cat) => {
                  const catLessons = LESSONS.filter((l) => l.category === cat);
                  const catDone = catLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
                  return (
                    <div key={cat} className="text-center">
                      <p className="text-white font-bold">{catDone}/{catLessons.length}</p>
                      <p className="text-gray-500 text-xs capitalize">{cat}</p>
                      <ProgressBar value={catDone} max={catLessons.length} color={cat === 'beginner' ? 'green' : cat === 'intermediate' ? 'blue' : 'purple'} size="sm" className="mt-1" />
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-xl">{progress.totalXp}</p>
                  <p className="text-gray-400 text-sm">Total XP earned</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Zap size={20} className="text-yellow-400" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Puzzles solved</span>
                  <span className="text-white font-medium">{stats.puzzlesSolved}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Lessons done</span>
                  <span className="text-white font-medium">{completedLessons}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Accuracy avg</span>
                  <span className="text-white font-medium">{stats.averageAccuracy.toFixed(0)}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Achievements</h2>
              <p className="text-gray-500 text-sm">{unlockedAchievements.length} / {MOCK_ACHIEVEMENTS.length} unlocked</p>
            </div>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {MOCK_ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedAchievements.some((a) => a.id === achievement.id);
                return (
                  <div key={achievement.id} className="flex flex-col items-center gap-2">
                    <AchievementBadge achievement={achievement} size="md" locked={!isUnlocked} />
                    <p className="text-xs text-gray-500 text-center leading-tight">{achievement.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Games</h2>
          </div>
          {gameHistory.length === 0 ? (
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">♟</div>
              <p className="text-gray-400 mb-4">No games played yet</p>
              <Link href="/play/computer">
                <Button variant="primary" leftIcon={<Swords size={16} />}>Play Your First Game</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {gameHistory.slice(0, 5).map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm',
                    game.result === 'win' ? 'bg-primary-500/20 text-primary-400' :
                      game.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                  )}>
                    {game.result === 'win' ? 'W' : game.result === 'loss' ? 'L' : 'D'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">vs {game.opponent}</p>
                    <p className="text-gray-500 text-xs">{game.opening ?? 'Unknown Opening'} • {game.moves} moves</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{game.timeControl}</p>
                    <p className="text-gray-600 text-xs">{new Date(game.playedAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
