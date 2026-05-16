import { Chess } from 'chess.js';
import type { LessonStep, Lesson } from '@/types/tutorial';
import type { ChessMove } from '@/types/chess';

export interface MoveResult {
  isCorrect: boolean;
  message: string;
  hint?: string;
  explanation?: string;
  shouldAdvance: boolean;
}

export interface TutorialEngineState {
  game: Chess;
  currentStep: LessonStep;
  attempts: number;
  hintsUsed: number;
}

export class TutorialEngine {
  private game: Chess;
  private lesson: Lesson;
  private stepIndex: number;
  private attempts: number;
  private hintsUsed: number;

  constructor(lesson: Lesson) {
    this.lesson = lesson;
    this.stepIndex = 0;
    this.attempts = 0;
    this.hintsUsed = 0;
    this.game = new Chess();
  }

  loadStep(stepIndex: number): void {
    this.stepIndex = stepIndex;
    const step = this.lesson.steps[stepIndex];
    if (step?.fen) {
      try {
        this.game = new Chess(step.fen);
      } catch {
        this.game = new Chess();
      }
    }
    this.attempts = 0;
  }

  getCurrentStep(): LessonStep | null {
    return this.lesson.steps[this.stepIndex] ?? null;
  }

  validateMove(move: ChessMove): MoveResult {
    const step = this.getCurrentStep();
    if (!step) return { isCorrect: false, message: 'No active step', shouldAdvance: false };

    if (step.type === 'explanation') {
      return { isCorrect: true, message: 'Click continue to proceed', shouldAdvance: true };
    }

    if (step.type === 'quiz') {
      return { isCorrect: false, message: 'This is a quiz step', shouldAdvance: false };
    }

    // Move validation step
    const expectedMove = step.expectedMove;
    this.attempts++;

    try {
      const result = this.game.move({ from: move.from, to: move.to, promotion: move.promotion ?? 'q' });
      if (!result) {
        return {
          isCorrect: false,
          message: 'That move is not legal.',
          hint: this.getHint(step),
          shouldAdvance: false,
        };
      }

      const moveSan = result.san;
      const moveLan = `${result.from}${result.to}${result.promotion ?? ''}`;

      const isExpected =
        !expectedMove ||
        moveSan === expectedMove ||
        moveLan === expectedMove ||
        moveLan.startsWith(expectedMove);

      if (isExpected) {
        return {
          isCorrect: true,
          message: this.getSuccessMessage(step),
          explanation: step.explanation,
          shouldAdvance: true,
        };
      } else {
        // Undo incorrect move
        this.game.undo();
        return {
          isCorrect: false,
          message: this.getIncorrectMessage(step, this.attempts),
          hint: this.attempts >= 2 ? this.getHint(step) : undefined,
          shouldAdvance: false,
        };
      }
    } catch {
      return {
        isCorrect: false,
        message: 'That move is not legal in this position.',
        hint: this.getHint(step),
        shouldAdvance: false,
      };
    }
  }

  validateQuizAnswer(optionId: string): MoveResult {
    const step = this.getCurrentStep();
    if (!step || step.type !== 'quiz') {
      return { isCorrect: false, message: 'Not a quiz step', shouldAdvance: false };
    }

    const option = step.quizOptions?.find((o) => o.id === optionId);
    if (!option) return { isCorrect: false, message: 'Invalid option', shouldAdvance: false };

    return {
      isCorrect: option.isCorrect,
      message: option.isCorrect ? 'Correct!' : 'Not quite right.',
      explanation: option.explanation,
      shouldAdvance: option.isCorrect,
    };
  }

  private getSuccessMessage(step: LessonStep): string {
    const messages = [
      'Excellent! That\'s the right move!',
      'Perfect! Well done!',
      'Great job! You\'ve got it!',
      'Correct! That\'s exactly right!',
      'Brilliant move!',
    ];
    return step.explanation ? messages[0] : messages[Math.floor(Math.random() * messages.length)];
  }

  private getIncorrectMessage(step: LessonStep, attempts: number): string {
    if (attempts === 1) return 'Not quite right. Try again!';
    if (attempts === 2) return 'Almost! Think about which piece to move.';
    return 'Keep trying! Check the highlighted squares for a hint.';
  }

  private getHint(step: LessonStep): string {
    this.hintsUsed++;
    if (step.hints && step.hints.length > 0) {
      return step.hints[Math.min(this.hintsUsed - 1, step.hints.length - 1)];
    }
    if (step.expectedMove) {
      const from = step.expectedMove.slice(0, 2);
      return `Try moving the piece on ${from}`;
    }
    return 'Look for a piece that can move to an highlighted square.';
  }

  getLegalMoves(square: string): string[] {
    return this.game
      .moves({ square: square as any, verbose: true })
      .map((m) => m.to);
  }

  getCurrentFen(): string {
    return this.game.fen();
  }

  getAttemptsForStep(): number {
    return this.attempts;
  }

  isLastStep(): boolean {
    return this.stepIndex >= this.lesson.steps.length - 1;
  }

  nextStep(): boolean {
    if (this.isLastStep()) return false;
    this.stepIndex++;
    this.loadStep(this.stepIndex);
    return true;
  }
}
