'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonProgress, TutorialProgress, LessonStatus } from '@/types/tutorial';

interface TutorialStore {
  progress: TutorialProgress;
  activeLessonId: string | null;
  activeStepIndex: number;
  isLessonComplete: boolean;

  startLesson: (lessonId: string) => void;
  completeStep: (lessonId: string, stepId: string) => void;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  getLessonStatus: (lessonId: string, prerequisites?: string[]) => LessonStatus;
  setActiveStep: (index: number) => void;
  resetLesson: (lessonId: string) => void;
}

const createInitialProgress = (): TutorialProgress => ({
  userId: 'guest',
  completedLessons: [],
  inProgressLessons: {},
  totalXp: 0,
  currentLevel: 1,
  streak: 0,
  lastActiveDate: new Date().toDateString(),
});

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      progress: createInitialProgress(),
      activeLessonId: null,
      activeStepIndex: 0,
      isLessonComplete: false,

      startLesson: (lessonId) => {
        set((state) => {
          const existing = state.progress.inProgressLessons[lessonId];
          return {
            activeLessonId: lessonId,
            activeStepIndex: existing?.currentStepIndex ?? 0,
            isLessonComplete: false,
            progress: {
              ...state.progress,
              inProgressLessons: {
                ...state.progress.inProgressLessons,
                [lessonId]: existing ?? {
                  lessonId,
                  status: 'in-progress',
                  completedSteps: [],
                  currentStepIndex: 0,
                  attempts: 0,
                },
              },
            },
          };
        });
      },

      completeStep: (lessonId, stepId) => {
        set((state) => {
          const lessonProg = state.progress.inProgressLessons[lessonId];
          if (!lessonProg) return state;
          const completedSteps = lessonProg.completedSteps.includes(stepId)
            ? lessonProg.completedSteps
            : [...lessonProg.completedSteps, stepId];
          const newIndex = state.activeStepIndex + 1;
          return {
            activeStepIndex: newIndex,
            progress: {
              ...state.progress,
              inProgressLessons: {
                ...state.progress.inProgressLessons,
                [lessonId]: { ...lessonProg, completedSteps, currentStepIndex: newIndex },
              },
            },
          };
        });
      },

      completeLesson: (lessonId, xpEarned) => {
        set((state) => {
          const completedLessons = state.progress.completedLessons.includes(lessonId)
            ? state.progress.completedLessons
            : [...state.progress.completedLessons, lessonId];

          const inProgress = { ...state.progress.inProgressLessons };
          if (inProgress[lessonId]) {
            inProgress[lessonId] = {
              ...inProgress[lessonId],
              status: 'completed',
              completedAt: Date.now(),
              xpEarned,
            };
          }

          return {
            isLessonComplete: true,
            progress: {
              ...state.progress,
              completedLessons,
              inProgressLessons: inProgress,
              totalXp: state.progress.totalXp + xpEarned,
            },
          };
        });
      },

      getLessonProgress: (lessonId) => {
        return get().progress.inProgressLessons[lessonId] ?? null;
      },

      getLessonStatus: (lessonId, prerequisites = []) => {
        const { progress } = get();
        if (progress.completedLessons.includes(lessonId)) return 'completed';
        if (progress.inProgressLessons[lessonId]) return 'in-progress';
        const prereqsMet = prerequisites.every((p) => progress.completedLessons.includes(p));
        if (!prereqsMet) return 'locked';
        return 'available';
      },

      setActiveStep: (index) => set({ activeStepIndex: index }),

      resetLesson: (lessonId) => {
        set((state) => {
          const inProgress = { ...state.progress.inProgressLessons };
          delete inProgress[lessonId];
          return {
            progress: { ...state.progress, inProgressLessons: inProgress },
            activeStepIndex: 0,
            isLessonComplete: false,
          };
        });
      },
    }),
    {
      name: 'chessmaster-tutorial',
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
