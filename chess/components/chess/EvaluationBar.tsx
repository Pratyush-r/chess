'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { evaluationToWinProbability, formatEvaluation } from '@/utils/chess';

interface EvaluationBarProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export default function EvaluationBar({ orientation = 'vertical', className }: EvaluationBarProps) {
  const { evaluation } = useGameStore();
  const { score, mate, isLoading } = evaluation;

  const whitePct = evaluationToWinProbability(score) * 100;
  const blackPct = 100 - whitePct;
  const label = formatEvaluation(score, mate);

  if (orientation === 'horizontal') {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ''}`}>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Black advantage</span>
          <span className={score > 0 ? 'text-white font-bold' : 'text-gray-400'}>{label}</span>
          <span>White advantage</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden bg-gray-900 flex">
          <motion.div
            className="bg-gray-800 h-full"
            animate={{ width: `${blackPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <motion.div
            className="bg-white h-full"
            animate={{ width: `${whitePct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 w-6 ${className ?? ''}`}>
      <span className={`text-xs font-bold ${score < 0 ? 'text-white' : 'text-gray-400'}`}>
        {score < 0 ? label.replace('+', '') : ''}
      </span>
      <div className="flex-1 w-full rounded-full overflow-hidden bg-white flex flex-col" style={{ minHeight: 200 }}>
        <motion.div
          className="bg-gray-900 w-full"
          animate={{ height: `${blackPct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <span className={`text-xs font-bold ${score > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
        {score > 0 ? label : ''}
      </span>
    </div>
  );
}
