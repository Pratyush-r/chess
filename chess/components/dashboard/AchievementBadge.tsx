'use client';

import { motion } from 'framer-motion';
import type { Achievement } from '@/types/user';
import { cn } from '@/utils/cn';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  locked?: boolean;
}

const rarityColors = {
  common: 'border-gray-500/50 bg-gray-700/50',
  rare: 'border-blue-500/50 bg-blue-900/30',
  epic: 'border-purple-500/50 bg-purple-900/30',
  legendary: 'border-gold-500/50 bg-gold-900/30',
};

const rarityGlow = {
  common: '',
  rare: 'hover:shadow-blue-500/20',
  epic: 'hover:shadow-purple-500/30',
  legendary: 'hover:shadow-gold-500/30',
};

const sizes = {
  sm: { container: 'w-12 h-12', icon: 'text-xl' },
  md: { container: 'w-16 h-16', icon: 'text-2xl' },
  lg: { container: 'w-20 h-20', icon: 'text-3xl' },
};

export default function AchievementBadge({ achievement, size = 'md', locked = false }: AchievementBadgeProps) {
  const sz = sizes[size];

  return (
    <motion.div
      whileHover={!locked ? { scale: 1.1, y: -2 } : {}}
      title={`${achievement.title}: ${achievement.description}`}
      className={cn(
        sz.container,
        'rounded-2xl border-2 flex items-center justify-center relative transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl',
        rarityColors[achievement.rarity],
        rarityGlow[achievement.rarity],
        locked && 'opacity-40 grayscale'
      )}
    >
      <span className={sz.icon}>{achievement.icon}</span>
      {!locked && achievement.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-400/20 to-transparent pointer-events-none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
