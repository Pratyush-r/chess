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
    green: 'hover:glow-green hover:border-emerald-500/30',
    purple: 'hover:glow-purple hover:border-violet-500/30',
    gold: 'hover:glow-gold hover:border-amber-500/30',
    none: '',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -3, scale: 1.005 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all duration-200',
        glass
          ? 'glass-md'
          : 'bg-[#0e1422] border border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]',
        hover && 'cursor-pointer',
        glow !== 'none' && glowClasses[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
