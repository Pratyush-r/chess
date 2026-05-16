'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';

export default function MoveList() {
  const { gameState, jumpToMove } = useGameStore();
  const { moveHistory, currentMoveIndex } = gameState;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (white + black)
  const movePairs: Array<{ number: number; white?: typeof moveHistory[0]; black?: typeof moveHistory[0]; whiteIndex: number; blackIndex: number }> = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
      whiteIndex: i,
      blackIndex: i + 1,
    });
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory.length]);

  if (moveHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
        No moves yet
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto pr-1 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-700">
      {movePairs.map((pair) => (
        <div key={pair.number} className="flex items-stretch gap-1 text-sm">
          <span className="w-8 text-gray-500 text-xs flex items-center px-1 shrink-0">
            {pair.number}.
          </span>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => jumpToMove(pair.whiteIndex)}
            className={cn(
              'flex-1 text-left px-2 py-1 rounded-md font-mono transition-colors text-sm',
              currentMoveIndex === pair.whiteIndex
                ? 'bg-primary-500 text-white font-bold'
                : 'text-gray-300 hover:bg-gray-700/50'
            )}
          >
            {pair.white?.san}
          </motion.button>
          {pair.black ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => jumpToMove(pair.blackIndex)}
              className={cn(
                'flex-1 text-left px-2 py-1 rounded-md font-mono transition-colors text-sm',
                currentMoveIndex === pair.blackIndex
                  ? 'bg-primary-500 text-white font-bold'
                  : 'text-gray-300 hover:bg-gray-700/50'
              )}
            >
              {pair.black?.san}
            </motion.button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      ))}
    </div>
  );
}
