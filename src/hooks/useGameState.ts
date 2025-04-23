
import { useState, useCallback } from 'react';
import { TaskType } from '@/components/Task';

export interface ActiveTask {
  id: string;
  type: TaskType;
  position: {
    x: number;
    y: number;
  };
  timeLimit: number;
  isUrgent: boolean;
  clicksRequired: number;
  createdAt: number;
}

export const useGameState = (onGameOver: (score: number) => void) => {
  const [score, setScore] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [taskCounter, setTaskCounter] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [showDayComplete, setShowDayComplete] = useState(false);
  const [dayScore, setDayScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    onGameOver(score);
  }, [score, onGameOver]);

  return {
    score,
    setScore,
    stressLevel,
    setStressLevel,
    gameTime,
    setGameTime,
    activeTasks,
    setActiveTasks,
    taskCounter,
    setTaskCounter,
    chaosMode,
    setChaosMode,
    currentDay,
    setCurrentDay,
    showDayComplete,
    setShowDayComplete,
    dayScore,
    setDayScore,
    gameOver,
    setGameOver,
    handleGameOver
  };
};
