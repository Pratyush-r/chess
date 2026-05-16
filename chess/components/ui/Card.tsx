'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  glow?: 'green' | 'purple' | 'gold' | 'none';
  onClick?: () => void;
}

export default function Card({ className, children, hover = false, glass = false, glow = 'none', onClick }: CardProps) {
  const glowClasses = {
    green: 'hover:shadow-glow-green',
    purple: 'hover:shadow-glow-purple',
    gold: 'hover:shadow-glow-gold',
    none: '',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'bg-white/5 border-white/10 backdrop-blur-md'
          : 'bg-gray-800/60 border-gray-700/50',
        hover && 'cursor-pointer',
        glow !== 'none' && glowClasses[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
