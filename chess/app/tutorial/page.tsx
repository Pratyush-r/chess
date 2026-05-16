'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, CheckCircle, Lock } from 'lucide-react';
import { LESSON_MODULES, LESSONS } from '@/features/tutorial/lessons';
import LessonCard from '@/components/tutorial/LessonCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { useTutorialStore } from '@/store/tutorialStore';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/utils/cn';

export default function TutorialPage() {
  const { progress, getLessonStatus } = useTutorialStore();
  const { initGuestProfile } = useUserStore();

  useEffect(() => { initGuestProfile(); }, [initGuestProfile]);

  const totalLessons = LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const completionPct = Math.round((completedCount / totalLessons) * 100);

  const moduleAccents = {
    beginner:     { ring: 'ring-emerald-500/20', dot: 'bg-emerald-400', label: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', bar: 'green' as const },
    intermediate: { ring: 'ring-blue-500/20',    dot: 'bg-blue-400',    label: 'bg-blue-500/10 text-blue-400 border-blue-500/20',         bar: 'blue' as const },
    advanced:     { ring: 'ring-violet-500/20',  dot: 'bg-violet-400',  label: 'bg-violet-500/10 text-violet-400 border-violet-500/20',   bar: 'purple' as const },
  };

  return (
    <div className="min-h-screen bg-[#080b14]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.04] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={15} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-widest">Chess Academy</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Interactive Lessons</h1>
            <p className="text-gray-400 max-w-xl">
              Master chess from basics to advanced strategy with guided, interactive lessons.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 bg-[#0e1422] border border-white/[0.06] rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-white font-bold text-lg">{completedCount} <span className="text-gray-500 font-normal text-base">/ {totalLessons} lessons</span></p>
                <p className="text-gray-500 text-sm mt-0.5">
                  {completedCount === 0 ? 'Start your first lesson below.' : `${completionPct}% complete — keep going!`}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-amber-400 font-black text-lg tabular-nums">
                    <Zap size={16} />
                    {progress.totalXp}
                  </div>
                  <p className="text-gray-600 text-[11px]">Total XP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-emerald-400 font-black text-lg tabular-nums">
                    <CheckCircle size={16} />
                    {completedCount}
                  </div>
                  <p className="text-gray-600 text-[11px]">Completed</p>
                </div>
              </div>
            </div>
            <ProgressBar value={completionPct} color="green" showLabel animated />
          </motion.div>
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {LESSON_MODULES.map((module, mi) => {
          const acc = moduleAccents[module.category];
          const moduleLessons = module.lessons;
          const moduleDone = moduleLessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const isLocked = !module.isUnlocked &&
            mi > 0 &&
            LESSON_MODULES[mi - 1].lessons.some(l => !progress.completedLessons.includes(l.id));

          return (
            <motion.section
              key={module.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: mi * 0.08 }}
            >
              {/* Module header */}
              <div className={cn('rounded-2xl p-5 mb-5 ring-1 bg-[#0e1422]', acc.ring)}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-2xl">{module.icon}</span>
                      {isLocked && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0e1422] border border-white/10 flex items-center justify-center">
                          <Lock size={9} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold text-base">{module.title}</h2>
                        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize', acc.label)}>
                          {module.category}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{module.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold tabular-nums text-sm">{moduleDone}/{moduleLessons.length}</p>
                    <p className="text-gray-600 text-[11px]">complete</p>
                  </div>
                </div>
                {moduleDone > 0 && (
                  <div className="mt-3">
                    <ProgressBar value={moduleDone} max={moduleLessons.length} color={acc.bar} size="sm" animated />
                  </div>
                )}
              </div>

              {/* Lessons grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {moduleLessons.map((lesson, li) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    status={isLocked ? 'locked' : getLessonStatus(lesson.id, lesson.prerequisites)}
                    index={li}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
