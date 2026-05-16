'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Trophy, TrendingUp, Lock } from 'lucide-react';
import { LESSON_MODULES, LESSONS } from '@/features/tutorial/lessons';
import LessonCard from '@/components/tutorial/LessonCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { useTutorialStore } from '@/store/tutorialStore';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/utils/cn';

export default function TutorialPage() {
  const { progress, getLessonStatus } = useTutorialStore();
  const { profile, initGuestProfile } = useUserStore();

  useEffect(() => {
    initGuestProfile();
  }, [initGuestProfile]);

  const totalLessons = LESSONS.length;
  const completedCount = progress.completedLessons.length;
  const completionPct = Math.round((completedCount / totalLessons) * 100);

  const categoryColors = {
    beginner: 'border-green-500/30 from-green-900/20',
    intermediate: 'border-blue-500/30 from-blue-900/20',
    advanced: 'border-purple-500/30 from-purple-900/20',
  };

  const categoryBadgeVariants: Record<string, 'success' | 'info' | 'warning'> = {
    beginner: 'success',
    intermediate: 'info',
    advanced: 'warning',
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={20} className="text-primary-400" />
              <span className="text-primary-400 font-medium text-sm">Chess Academy</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Interactive Lessons</h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Master chess from the basics to advanced strategy with guided, interactive lessons.
            </p>
          </motion.div>

          {/* Progress overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-white font-bold text-xl">{completedCount} / {totalLessons} Lessons</p>
                <p className="text-gray-400 text-sm">Keep going! You're making great progress.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                    <Zap size={18} />
                    {progress.totalXp}
                  </div>
                  <p className="text-gray-500 text-xs">Total XP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-primary-400 font-bold text-lg">
                    <Trophy size={18} />
                    {completedCount}
                  </div>
                  <p className="text-gray-500 text-xs">Completed</p>
                </div>
              </div>
            </div>
            <ProgressBar value={completionPct} color="green" showLabel animated />
          </motion.div>
        </div>
      </div>

      {/* Lesson Modules */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {LESSON_MODULES.map((module, moduleIndex) => {
          const moduleLessons = module.lessons;
          const moduleCompleted = moduleLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
          const moduleTotal = moduleLessons.length;
          const isModuleLocked = !module.isUnlocked &&
            moduleIndex > 0 &&
            LESSON_MODULES[moduleIndex - 1].lessons.some((l) => !progress.completedLessons.includes(l.id));

          return (
            <motion.section
              key={module.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: moduleIndex * 0.1 }}
            >
              {/* Module Header */}
              <div className={cn(
                'rounded-2xl border bg-gradient-to-r to-transparent p-6 mb-6',
                categoryColors[module.category]
              )}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{module.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-white">{module.title}</h2>
                        <Badge variant={categoryBadgeVariants[module.category]}>
                          {module.category}
                        </Badge>
                        {isModuleLocked && (
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Lock size={14} />
                            <span>Complete previous module to unlock</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{moduleCompleted}/{moduleTotal}</p>
                    <p className="text-gray-500 text-xs">lessons done</p>
                  </div>
                </div>
                {moduleCompleted > 0 && (
                  <div className="mt-4">
                    <ProgressBar value={moduleCompleted} max={moduleTotal} color={
                      module.category === 'beginner' ? 'green' :
                        module.category === 'intermediate' ? 'blue' : 'purple'
                    } size="sm" animated />
                  </div>
                )}
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduleLessons.map((lesson, lessonIndex) => {
                  const status = isModuleLocked
                    ? 'locked'
                    : getLessonStatus(lesson.id, lesson.prerequisites);
                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      status={status}
                      index={lessonIndex}
                    />
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
