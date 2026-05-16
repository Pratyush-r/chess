'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Info } from 'lucide-react';
import Button from '@/components/ui/Button';

type CoachState = 'idle' | 'correct' | 'incorrect' | 'hint' | 'explanation';

interface TutorialCoachProps {
  state: CoachState;
  message: string;
  hint?: string;
  explanation?: string;
  onContinue?: () => void;
  onHint?: () => void;
  showContinue?: boolean;
  showHint?: boolean;
}

const stateConfig = {
  idle: {
    bg: 'bg-gray-800/60 border-gray-700/50',
    icon: <Info size={18} className="text-blue-400" />,
    iconBg: 'bg-blue-500/10',
  },
  correct: {
    bg: 'bg-primary-500/10 border-primary-500/30',
    icon: <CheckCircle size={18} className="text-primary-400" />,
    iconBg: 'bg-primary-500/10',
  },
  incorrect: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: <XCircle size={18} className="text-red-400" />,
    iconBg: 'bg-red-500/10',
  },
  hint: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: <Lightbulb size={18} className="text-yellow-400" />,
    iconBg: 'bg-yellow-500/10',
  },
  explanation: {
    bg: 'bg-purple-500/10 border-purple-500/30',
    icon: <Info size={18} className="text-purple-400" />,
    iconBg: 'bg-purple-500/10',
  },
};

export default function TutorialCoach({
  state,
  message,
  hint,
  explanation,
  onContinue,
  onHint,
  showContinue = false,
  showHint = false,
}: TutorialCoachProps) {
  const config = stateConfig[state];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${state}-${message.slice(0, 20)}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border p-4 ${config.bg}`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="text-white text-sm leading-relaxed">{message}</p>
            {hint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-yellow-300/80 text-xs mt-2 italic"
              >
                💡 {hint}
              </motion.p>
            )}
            {explanation && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-gray-300 text-xs mt-2 leading-relaxed border-t border-white/10 pt-2"
              >
                {explanation}
              </motion.p>
            )}
          </div>
        </div>

        {(showContinue || showHint) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            {showHint && onHint && (
              <Button variant="ghost" size="sm" onClick={onHint} leftIcon={<Lightbulb size={14} />}>
                Hint
              </Button>
            )}
            {showContinue && onContinue && (
              <Button variant="primary" size="sm" className="ml-auto" onClick={onContinue} rightIcon={<ArrowRight size={14} />}>
                Continue
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
