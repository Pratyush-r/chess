'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'green' | 'blue' | 'purple' | 'gold';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colors = {
  green: 'bg-primary-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  gold: 'bg-gold-500',
};

const trackColors = {
  green: 'bg-primary-500/20',
  blue: 'bg-blue-500/20',
  purple: 'bg-purple-500/20',
  gold: 'bg-gold-500/20',
};

const heights = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  className,
  color = 'green',
  showLabel = false,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full overflow-hidden', trackColors[color], heights[size])}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 mt-1 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}
