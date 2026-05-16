'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function useTimer() {
  const { activeTimer, gameState, tickTimer } = useGameStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (activeTimer && (gameState.status === 'playing' || gameState.status === 'check')) {
      intervalRef.current = setInterval(() => {
        tickTimer(activeTimer);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer, gameState.status, tickTimer]);
}
