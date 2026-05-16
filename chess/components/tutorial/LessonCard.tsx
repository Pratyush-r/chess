'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Lock, Play, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Lesson, LessonStatus } from '@/types/tutorial';
import { cn } from '@/utils/cn';

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  index?: number;
}

const difficultyDots = (d: number) =>
  Array.from({ length: 5 }, (_, i) => i < d);

const difficultyColor = ['', 'bg-emerald-400', 'bg-blue-400', 'bg-amber-400', 'bg-orange-400', 'bg-red-400'];

export default function LessonCard({ lesson, status, index = 0 }: LessonCardProps) {
  const locked = status === 'locked';
  const done   = status === 'completed';
  const active = status === 'in-progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.21, 1.02, 0.73, 1] }}
    >
      <Link href={locked ? '#' : `/tutorial/${lesson.id}`} className={locked ? 'pointer-events-none' : ''}>
        <motion.div
          whileHover={!locked ? { y: -3, transition: { duration: 0.15 } } : {}}
          className={cn(
            'relative rounded-2xl border p-5 transition-all duration-200 overflow-hidden',
            locked
              ? 'bg-[#0a0d18] border-white/[0.04] opacity-40 cursor-not-allowed'
              : done
                ? 'bg-[#0c1a12] border-emerald-500/25 hover:border-emerald-500/40 hover:shadow-[0_8px_32px_rgba(34,197,94,0.08)] cursor-pointer'
                : active
                  ? 'bg-[#0e1422] border-blue-500/25 hover:border-blue-500/40 cursor-pointer'
                  : 'bg-[#0e1422] border-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-pointer'
          )}
        >
          {/* Subtle top gradient for completed */}
          {done && (
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          )}

          <div className="flex items-start gap-3.5">
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl',
              done ? 'bg-emerald-500/15' : 'bg-white/[0.04]'
            )}>
              {lesson.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={cn(
                  'font-semibold text-sm leading-snug',
                  locked ? 'text-gray-600' : 'text-white'
                )}>
                  {lesson.title}
                </h3>
                <div className="flex-shrink-0 mt-0.5">
                  {done   && <CheckCircle size={15} className="text-emerald-400" />}
                  {locked && <Lock size={13} className="text-gray-700" />}
                  {!done && !locked && <Play size={14} className="text-gray-600" />}
                </div>
              </div>

              <p className="text-[12px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                {lesson.description}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[11px] text-gray-600">
                  <Clock size={10} />
                  <span>{lesson.estimatedMinutes}m</span>
                </div>

                {/* Difficulty dots */}
                <div className="flex items-center gap-0.5">
                  {difficultyDots(lesson.difficulty).map((filled, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-colors',
                        filled ? difficultyColor[lesson.difficulty] : 'bg-gray-700'
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-0.5 text-[11px] text-amber-400/70 ml-auto">
                  <Zap size={10} />
                  <span>+{lesson.xpReward}</span>
                </div>
              </div>
            </div>
          </div>

          {/* In-progress bar */}
          {active && (
            <div className="mt-3 pt-3 border-t border-white/[0.04]">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-blue-500 rounded-full" />
              </div>
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
