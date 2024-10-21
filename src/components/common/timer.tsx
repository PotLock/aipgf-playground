'use client';

import React, { useEffect, useRef } from 'react';

interface ITimerProps {
  disabled?: boolean;
  countDownValue?: number;
  onTick?: (value: number) => void;
  onComplete?: () => void;
}

const Timer: React.FC<ITimerProps> = ({ disabled = false, countDownValue, onTick, onComplete }) => {
  const timeHandle = useRef<NodeJS.Timeout>();
  const timeRef = useRef(countDownValue || 0);
  const isPaused = useRef(true);

  function pause() {
    if (!isPaused.current) {
      clearInterval(timeHandle.current);
      isPaused.current = true;
    }
  }

  function update() {
    if (timeRef.current === 0) {
      onComplete?.();
      pause();
    }
    if (timeRef.current > 0) onTick?.(--timeRef.current);
  }

  function start() {
    if (isPaused.current) {
      isPaused.current = false;
      timeHandle.current = setInterval(update, 1000);
    }
  }

  function reset() {
    clearInterval(timeHandle.current);
    isPaused.current = true;
    timeRef.current = countDownValue || 0;
  }

  useEffect(() => {
    reset();
    start();
    if (disabled) {
      pause();
    }
  }, [disabled, countDownValue]);

  return null;
};

export default Timer;
