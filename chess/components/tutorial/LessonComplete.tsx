'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Zap, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface LessonCompleteProps {
  lessonTitle: string;
  xpEarned: number;
  onRetry: () => void;
  nextLessonId?: string;
  nextLessonTitle?: string;
}

export default function LessonComplete({ lessonTitle, xpEarned, onRetry, nextLessonId, nextLessonTitle }: LessonCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-full bg-primary-500/20 border-2 border-primary-500/50 flex items-center justify-center">
          <Trophy size={40} className="text-primary-400" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center"
        >
          <Star size={16} className="text-black" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
        <p className="text-gray-400">{lessonTitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-6 py-3"
      >
        <Zap size={20} className="text-yellow-400" />
        <span className="text-yellow-300 font-bold text-xl">+{xpEarned} XP</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Button variant="secondary" onClick={onRetry} leftIcon={<RotateCcw size={16} />} className="flex-1">
          Play Again
        </Button>
        {nextLessonId ? (
          <Link href={`/tutorial/${nextLessonId}`} className="flex-1">
            <Button variant="primary" className="w-full" rightIcon={<ArrowRight size={16} />}>
              Next Lesson
            </Button>
          </Link>
        ) : (
          <Link href="/tutorial" className="flex-1">
            <Button variant="primary" className="w-full" rightIcon={<ArrowRight size={16} />}>
              More Lessons
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
