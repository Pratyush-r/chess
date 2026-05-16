'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { formatTime, isLowTime, isCriticalTime } from '@/utils/chess';
import { cn } from '@/utils/cn';

interface GameTimerProps {
  color: 'white' | 'black';
  className?: string;
}

export default function GameTimer({ color, className }: GameTimerProps) {
  const { whiteTime, blackTime, activeTimer, gameState } = useGameStore();
  const seconds = color === 'white' ? whiteTime : blackTime;
  const isActive = activeTimer === color && (gameState.status === 'playing' || gameState.status === 'check');
  const timeStr = formatTime(seconds);
  const lowTime = isLowTime(seconds);
  const criticalTime = isCriticalTime(seconds);

  return (
    <motion.div
      animate={criticalTime && isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.5, repeat: criticalTime && isActive ? Infinity : 0 }}
      className={cn(
        'flex items-center justify-center rounded-xl font-mono font-bold transition-all duration-300',
        isActive ? 'bg-gray-700 border-2' : 'bg-gray-800/60 border border-gray-700/50',
        criticalTime && isActive ? 'border-red-500 text-red-400' :
          lowTime && isActive ? 'border-yellow-500 text-yellow-400' :
            isActive ? 'border-primary-500 text-white' : 'text-gray-400',
        className
      )}
    >
      <span className="text-2xl tabular-nums">{timeStr}</span>
    </motion.div>
  );
}
