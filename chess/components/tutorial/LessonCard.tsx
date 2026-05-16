'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Lock, PlayCircle, Clock, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Lesson, LessonStatus } from '@/types/tutorial';
import { cn } from '@/utils/cn';
import Badge from '@/components/ui/Badge';

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  index?: number;
}

const difficultyColors = ['', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'];
const difficultyLabels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];

export default function LessonCard({ lesson, status, index = 0 }: LessonCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={isLocked ? '#' : `/tutorial/${lesson.id}`}
        className={cn(isLocked && 'pointer-events-none')}
      >
        <motion.div
          whileHover={!isLocked ? { y: -4, scale: 1.01 } : {}}
          transition={{ duration: 0.2 }}
          className={cn(
            'relative rounded-2xl border p-5 transition-all duration-300',
            isLocked
              ? 'bg-gray-900/30 border-gray-800/50 opacity-50 cursor-not-allowed'
              : isCompleted
                ? 'bg-gray-800/60 border-primary-500/30 hover:border-primary-500/60 cursor-pointer'
                : 'bg-gray-800/60 border-gray-700/50 hover:border-gray-600 cursor-pointer',
          )}
        >
          {/* Completion glow */}
          {isCompleted && (
            <div className="absolute inset-0 rounded-2xl bg-primary-500/5 pointer-events-none" />
          )}

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
              isCompleted ? 'bg-primary-500/20' : 'bg-gray-700/50'
            )}>
              {lesson.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={cn(
                  'font-bold text-base',
                  isLocked ? 'text-gray-500' : 'text-white'
                )}>
                  {lesson.title}
                </h3>
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {isCompleted && <CheckCircle size={18} className="text-primary-400" />}
                  {isLocked && <Lock size={16} className="text-gray-600" />}
                  {!isCompleted && !isLocked && <PlayCircle size={18} className="text-gray-500" />}
                </div>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{lesson.description}</p>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{lesson.estimatedMinutes}m</span>
                </div>
                <div className={cn('flex items-center gap-1 text-xs', difficultyColors[lesson.difficulty])}>
                  <Star size={12} />
                  <span>{difficultyLabels[lesson.difficulty]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Zap size={12} />
                  <span>+{lesson.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar for in-progress */}
          {status === 'in-progress' && (
            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>In Progress</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
