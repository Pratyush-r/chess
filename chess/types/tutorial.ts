import type { Square } from './chess';

export type LessonCategory = 'beginner' | 'intermediate' | 'advanced';
export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';
export type StepType = 'explanation' | 'move' | 'quiz' | 'free-play';

export interface LessonStep {
  id: string;
  type: StepType;
  title: string;
  description: string;
  fen?: string;
  expectedMove?: string;
  highlightSquares?: Square[];
  arrows?: { from: Square; to: Square; color?: string }[];
  hints?: string[];
  explanation?: string;
  isOptional?: boolean;
  quizOptions?: QuizOption[];
  correctAnswer?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xpReward: number;
  estimatedMinutes: number;
  icon: string;
  steps: LessonStep[];
  prerequisites?: string[];
  tags: string[];
  objectives: string[];
}

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  completedSteps: string[];
  currentStepIndex: number;
  attempts: number;
  completedAt?: number;
  score?: number;
  xpEarned?: number;
}

export interface TutorialProgress {
  userId: string;
  completedLessons: string[];
  inProgressLessons: Record<string, LessonProgress>;
  totalXp: number;
  currentLevel: number;
  streak: number;
  lastActiveDate: string;
}

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  icon: string;
  lessons: Lesson[];
  isUnlocked: boolean;
}
