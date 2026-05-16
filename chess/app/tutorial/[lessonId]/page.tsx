'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { ArrowLeft, ChevronRight, RotateCcw, Lightbulb, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { getLessonById, LESSONS } from '@/features/tutorial/lessons';
import { TutorialEngine } from '@/services/tutorialEngine';
import TutorialCoach from '@/components/tutorial/TutorialCoach';
import LessonComplete from '@/components/tutorial/LessonComplete';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useTutorialStore } from '@/store/tutorialStore';
import { useUserStore } from '@/store/userStore';
import type { Square } from 'chess.js';
import type { SquareHighlight } from '@/types/chess';
import toast from 'react-hot-toast';

type CoachState = 'idle' | 'correct' | 'incorrect' | 'hint' | 'explanation';

function buildSquareStyles(highlights: SquareHighlight[]): Record<string, React.CSSProperties> {
  const styles: Record<string, React.CSSProperties> = {};
  for (const h of highlights) {
    switch (h.type) {
      case 'tutorial':
        styles[h.square] = { backgroundColor: h.color ?? 'rgba(251,191,36,0.45)' };
        break;
      case 'move':
        styles[h.square] = { background: 'radial-gradient(circle, rgba(20,85,30,0.55) 36%, transparent 40%)' };
        break;
      case 'hint':
        styles[h.square] = { backgroundColor: 'rgba(168,85,247,0.45)' };
        break;
      case 'selected':
        styles[h.square] = { backgroundColor: 'rgba(186,202,68,0.8)' };
        break;
    }
  }
  return styles;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const lesson = getLessonById(lessonId);

  const { startLesson, completeStep, completeLesson, getLessonProgress } = useTutorialStore();
  const { addXp } = useUserStore();

  const engineRef = useRef<TutorialEngine | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [highlights, setHighlights] = useState<SquareHighlight[]>([]);
  const [arrows, setArrows] = useState<[Square, Square, string][]>([]);
  const [coachState, setCoachState] = useState<CoachState>('idle');
  const [coachMessage, setCoachMessage] = useState('');
  const [coachHint, setCoachHint] = useState<string | undefined>();
  const [coachExplanation, setCoachExplanation] = useState<string | undefined>();
  const [isComplete, setIsComplete] = useState(false);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const currentStep = lesson?.steps[stepIndex];
  const progress = (stepIndex / (lesson?.steps.length ?? 1)) * 100;

  // Next lesson
  const lessonIndex = LESSONS.findIndex((l) => l.id === lessonId);
  const nextLesson = LESSONS[lessonIndex + 1];

  useEffect(() => {
    if (!lesson) return;
    const engine = new TutorialEngine(lesson);
    engineRef.current = engine;
    startLesson(lessonId);
    loadStep(0, engine);
  }, [lessonId]);

  const loadStep = useCallback((index: number, engine?: TutorialEngine) => {
    const eng = engine ?? engineRef.current;
    if (!eng || !lesson) return;

    eng.loadStep(index);
    const step = lesson.steps[index];
    if (!step) return;

    setStepIndex(index);
    setFen(step.fen ?? eng.getCurrentFen());
    setQuizSelected(null);
    setSelectedSquare(null);
    setCoachHint(undefined);
    setCoachExplanation(undefined);

    // Set highlights from step
    const stepHighlights: SquareHighlight[] = (step.highlightSquares ?? []).map((sq) => ({
      square: sq as Square,
      type: 'tutorial' as const,
    }));
    setHighlights(stepHighlights);

    // Set arrows
    const stepArrows: [Square, Square, string][] = (step.arrows ?? []).map((a) => [
      a.from as Square,
      a.to as Square,
      a.color ?? '#a855f7',
    ]);
    setArrows(stepArrows);

    if (step.type === 'explanation') {
      setCoachState('idle');
      setCoachMessage(step.description);
    } else if (step.type === 'move') {
      setCoachState('idle');
      setCoachMessage(step.description);
    } else if (step.type === 'quiz') {
      setCoachState('idle');
      setCoachMessage(step.description);
    }
  }, [lesson]);

  const handleContinue = useCallback(() => {
    const eng = engineRef.current;
    if (!eng || !lesson) return;

    const nextIndex = stepIndex + 1;
    if (nextIndex >= lesson.steps.length) {
      // Lesson complete
      completeLesson(lessonId, lesson.xpReward);
      addXp(lesson.xpReward);
      toast.success(`+${lesson.xpReward} XP earned!`);
      setIsComplete(true);
    } else {
      completeStep(lessonId, currentStep?.id ?? '');
      loadStep(nextIndex);
    }
  }, [stepIndex, lesson, lessonId, currentStep, completeLesson, completeStep, addXp, loadStep]);

  const handleSquareClick = useCallback((square: string) => {
    const eng = engineRef.current;
    if (!eng || !currentStep) return;
    if (currentStep.type !== 'move') return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        loadStep(stepIndex);
        return;
      }

      const result = eng.validateMove({ from: selectedSquare as Square, to: square as Square });
      if (result.isCorrect) {
        setFen(eng.getCurrentFen());
        setCoachState('correct');
        setCoachMessage(result.message);
        setCoachExplanation(result.explanation);
        setHighlights([]);
        setArrows([]);
        setSelectedSquare(null);
      } else {
        setCoachState('incorrect');
        setCoachMessage(result.message);
        setCoachHint(result.hint);
        setSelectedSquare(null);
      }
    } else {
      // Try to select piece
      const legalTargets = eng.getLegalMoves(square);
      if (legalTargets.length > 0) {
        setSelectedSquare(square);
        const newHighlights: SquareHighlight[] = [
          { square: square as Square, type: 'selected' },
          ...legalTargets.map((sq) => ({ square: sq as Square, type: 'move' as const })),
        ];
        setHighlights(newHighlights);
      }
    }
  }, [selectedSquare, currentStep, stepIndex, loadStep]);

  const handlePieceDrop = useCallback((from: string, to: string): boolean => {
    const eng = engineRef.current;
    if (!eng || !currentStep || currentStep.type !== 'move') return false;

    const result = eng.validateMove({ from: from as Square, to: to as Square });
    if (result.isCorrect) {
      setFen(eng.getCurrentFen());
      setCoachState('correct');
      setCoachMessage(result.message);
      setCoachExplanation(result.explanation);
      setHighlights([]);
      setArrows([]);
      setSelectedSquare(null);
      return true;
    } else {
      setCoachState('incorrect');
      setCoachMessage(result.message);
      setCoachHint(result.hint);
      return false;
    }
  }, [currentStep]);

  const handleQuizSelect = useCallback((optionId: string) => {
    const eng = engineRef.current;
    if (!eng || !currentStep || currentStep.type !== 'quiz') return;
    setQuizSelected(optionId);
    const result = eng.validateQuizAnswer(optionId);
    if (result.isCorrect) {
      setCoachState('correct');
      setCoachMessage(result.message);
      setCoachExplanation(result.explanation);
    } else {
      setCoachState('incorrect');
      setCoachMessage(result.message);
      setCoachExplanation(result.explanation);
    }
  }, [currentStep]);

  const handleHint = useCallback(() => {
    const step = currentStep;
    if (!step?.hints?.length) return;
    const eng = engineRef.current;
    if (!eng) return;
    const hintText = step.hints[0];
    setCoachState('hint');
    setCoachHint(hintText);
    setCoachMessage('Here\'s a hint to help you:');

    // Show hint highlight
    if (step.expectedMove) {
      const from = step.expectedMove.slice(0, 2) as Square;
      setHighlights([{ square: from, type: 'hint' }]);
    }
  }, [currentStep]);

  const handleRetry = useCallback(() => {
    setIsComplete(false);
    const eng = new TutorialEngine(lesson!);
    engineRef.current = eng;
    startLesson(lessonId);
    loadStep(0, eng);
  }, [lesson, lessonId, loadStep, startLesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Lesson not found</p>
          <Link href="/tutorial">
            <Button variant="primary">Back to Lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LessonComplete
            lessonTitle={lesson.title}
            xpEarned={lesson.xpReward}
            onRetry={handleRetry}
            nextLessonId={nextLesson?.id}
            nextLessonTitle={nextLesson?.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <div className="border-b border-gray-800/50 bg-gray-900/50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 py-3">
            <Link href="/tutorial">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
                Lessons
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm">{lesson.title}</span>
                <Badge variant={
                  lesson.category === 'beginner' ? 'success' :
                    lesson.category === 'intermediate' ? 'info' : 'warning'
                }>
                  {lesson.category}
                </Badge>
              </div>
              <ProgressBar value={progress} color="green" size="sm" animated={false} />
            </div>
            <span className="text-gray-500 text-sm whitespace-nowrap">
              {stepIndex + 1} / {lesson.steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Chess Board */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md aspect-square">
              <Chessboard
                id="tutorial-board"
                position={fen}
                onSquareClick={handleSquareClick}
                onPieceDrop={handlePieceDrop}
                customSquareStyles={buildSquareStyles(highlights)}
                customArrows={arrows}
                animationDuration={200}
                boardWidth={480}
                customBoardStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                showBoardNotation={true}
              />
            </div>
          </div>

          {/* Lesson Panel */}
          <div className="space-y-4">
            {/* Step title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white">
                    {stepIndex + 1}
                  </div>
                  <h2 className="text-white font-bold text-lg">{currentStep?.title}</h2>
                </div>

                {/* Quiz options */}
                {currentStep?.type === 'quiz' && currentStep.quizOptions && (
                  <div className="space-y-2 mt-4">
                    {currentStep.quizOptions.map((opt) => {
                      const isSelected = quizSelected === opt.id;
                      const showResult = quizSelected !== null;
                      return (
                        <motion.button
                          key={opt.id}
                          whileTap={!quizSelected ? { scale: 0.98 } : {}}
                          onClick={() => !quizSelected && handleQuizSelect(opt.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                            !quizSelected
                              ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300'
                              : isSelected && opt.isCorrect
                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                                : isSelected && !opt.isCorrect
                                  ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                  : showResult && opt.isCorrect
                                    ? 'bg-primary-500/10 border-primary-500/20 text-primary-400'
                                    : 'bg-gray-800/50 border-gray-700/30 text-gray-500'
                          }`}
                        >
                          <span className="font-medium mr-2">{opt.id.toUpperCase()}.</span>
                          {opt.text}
                          {isSelected && (
                            <span className="ml-2">
                              {opt.isCorrect ? '✓' : '✗'}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Coach feedback */}
            <TutorialCoach
              state={coachState}
              message={coachMessage || currentStep?.description || ''}
              hint={coachHint}
              explanation={coachExplanation}
              onContinue={
                (coachState === 'correct' || currentStep?.type === 'explanation')
                  ? handleContinue
                  : undefined
              }
              onHint={currentStep?.hints?.length ? handleHint : undefined}
              showContinue={coachState === 'correct' || currentStep?.type === 'explanation'}
              showHint={currentStep?.type === 'move' && coachState !== 'correct' && !!(currentStep.hints?.length)}
            />

            {/* Step objectives */}
            {stepIndex === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-4"
              >
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Lesson Objectives</h4>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Reset button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadStep(stepIndex)}
              leftIcon={<RotateCcw size={14} />}
              className="text-gray-500"
            >
              Reset position
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
