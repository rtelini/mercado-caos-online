
import React, { useEffect, useCallback, useRef } from 'react';
import GameHUD from './GameHUD';
import StressBar from './StressBar';
import GameArea from './GameArea';
import TaskManager from './TaskManager';
import GameDayComplete from './GameDayComplete';
import { useGameState } from '@/hooks/useGameState';
import { useTaskGenerator } from '@/hooks/useTaskGenerator';
import { useTaskQueue, TaskInQueue } from "@/hooks/useTaskQueue";

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onPause: () => void;
}

const STRESS_MAX = 100;
const STRESS_INCREASE_ON_FAIL = 15;
const STRESS_INCREASE_ON_REPUTATION_FAIL = 25;
const STRESS_DECREASE_ON_SUCCESS = 2;
const GAME_DURATION_PER_DAY = 90;
const MAX_DAYS = 90;
const QUEUE_TASK_TIME = 12;

const GameScreen = ({
  onGameOver,
  onPause
}: GameScreenProps) => {
  const {
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
    handleGameOver
  } = useGameState(onGameOver);

  const [taskQueue, setTaskQueue] = React.useState<TaskInQueue[]>([]);
  const [queuePopupOpen, setQueuePopupOpen] = React.useState(false);
  const [queueTaskToExec, setQueueTaskToExec] = React.useState<TaskInQueue | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const taskGeneratorRef = useRef<NodeJS.Timeout | null>(null);

  const { createNewTask } = useTaskGenerator(taskCounter, setTaskCounter, setActiveTasks);

  const handleQueueTaskTimeout = useCallback((taskId: string) => {
    setScore(prev => prev - 2);
    setStressLevel(prev => prev + 8);
    removeTaskFromQueue(taskId, setTaskQueue);
    if (queueTaskToExec && queueTaskToExec.id === taskId) {
      setQueuePopupOpen(false);
      setQueueTaskToExec(null);
    }
  }, [queueTaskToExec, setScore, setStressLevel]);

  const {
    addTaskToQueue,
    removeTaskFromQueue,
    clearAllQueueTimers,
    getQueueTaskTimeLeft
  } = useTaskQueue({
    onTimeout: handleQueueTaskTimeout,
    timePerQueueTask: QUEUE_TASK_TIME
  });

  const startGameTimer = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    
    gameTimerRef.current = setInterval(() => {
      setGameTime(prev => {
        const newTime = prev + 1;
        if (newTime === Math.floor(GAME_DURATION_PER_DAY * 0.7)) setChaosMode(true);
        if (newTime >= GAME_DURATION_PER_DAY) {
          completeDay();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [setGameTime, setChaosMode]);

  const generateTasks = useCallback(() => {
    if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
    
    taskGeneratorRef.current = setInterval(() => {
      const baseRate = chaosMode ? 800 : 1600;
      const adjustedRate = Math.max(baseRate - gameTime * 10, chaosMode ? 400 : 800);
      if (Math.random() * adjustedRate < 100) {
        createNewTask();
      }
    }, 100);
  }, [chaosMode, gameTime, createNewTask]);

  const completeDay = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
    clearAllQueueTimers();
    
    setDayScore(score);
    setShowDayComplete(true);
    setActiveTasks([]);
    setChaosMode(false);
    
    if (score < 0) {
      setTimeout(() => handleGameOver(), 1400);
      return;
    }
    
    setTimeout(() => startNextDay(), 3000);
  }, [score, clearAllQueueTimers, setChaosMode, setDayScore, setShowDayComplete, setActiveTasks, handleGameOver]);

  const startNextDay = useCallback(() => {
    if (currentDay >= MAX_DAYS) {
      handleGameOver();
      return;
    }
    
    setCurrentDay(prev => prev + 1);
    setGameTime(0);
    setShowDayComplete(false);
    setActiveTasks([]);
    setTaskQueue([]);
    setQueuePopupOpen(false);
    setQueueTaskToExec(null);
    
    startGameTimer();
    generateTasks();
  }, [currentDay, setCurrentDay, setGameTime, setShowDayComplete, setActiveTasks, startGameTimer, generateTasks, handleGameOver]);

  const handleTaskClick = useCallback((taskId: string, taskType: TaskType) => {
    setActiveTasks(prevActive => {
      const found = prevActive.find(t => t.id === taskId);
      if (!found) return prevActive;
      
      const newQueueTask = {
        id: found.id,
        type: found.type,
        timeLimit: QUEUE_TASK_TIME,
        addedToQueueAt: Date.now()
      };
      
      addTaskToQueue(taskQueue, newQueueTask, setTaskQueue);
      return prevActive.filter(t => t.id !== taskId);
    });
  }, [addTaskToQueue, taskQueue]);

  const handleTaskTimeout = useCallback((taskId: string) => {
    const task = activeTasks.find(t => t.id === taskId);
    if (task) {
      const stressIncrease = task.type === 'reputation_drop' ? STRESS_INCREASE_ON_REPUTATION_FAIL : STRESS_INCREASE_ON_FAIL;
      setStressLevel(prev => prev + stressIncrease);
    }
    setActiveTasks(prev => prev.filter(t => t.id !== taskId));
  }, [activeTasks, setStressLevel, setActiveTasks]);

  const handleQueueTaskStart = useCallback((queueTask: TaskInQueue) => {
    if (!queuePopupOpen) {
      setQueueTaskToExec(queueTask);
      setQueuePopupOpen(true);
    }
  }, [queuePopupOpen]);

  const handleQueuePopupComplete = useCallback((success: boolean) => {
    if (queueTaskToExec) {
      removeTaskFromQueue(queueTaskToExec.id, setTaskQueue);
      
      if (success) {
        setScore(prev => prev + 1);
        setStressLevel(prev => Math.max(0, prev - STRESS_DECREASE_ON_SUCCESS));
      } else {
        setScore(prev => prev - 2);
        setStressLevel(prev => prev + 8);
      }
      
      setQueueTaskToExec(null);
      setQueuePopupOpen(false);
    }
  }, [queueTaskToExec, removeTaskFromQueue, setScore, setStressLevel]);

  useEffect(() => {
    startGameTimer();
    generateTasks();
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      clearAllQueueTimers();
    };
  }, [startGameTimer, generateTasks, clearAllQueueTimers]);

  useEffect(() => {
    if (stressLevel >= STRESS_MAX && !gameOver) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      clearAllQueueTimers();
      handleGameOver();
    }
  }, [stressLevel, gameOver, clearAllQueueTimers, handleGameOver]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative flex flex-col w-full h-screen max-h-[80vh] my-0 bg-stone-50 rounded-full">
      <GameHUD 
        currentDay={currentDay} 
        maxDays={MAX_DAYS} 
        gameTime={gameTime} 
        chaosMode={chaosMode} 
        score={score} 
        onPause={onPause} 
        formatTime={formatTime} 
      />
      <StressBar stressLevel={stressLevel} />
      <GameArea 
        gameAreaRef={gameAreaRef} 
        activeTasks={activeTasks} 
        handleTaskClick={handleTaskClick} 
        handleTaskTimeout={handleTaskTimeout} 
        taskQueue={taskQueue} 
        onTaskStart={handleQueueTaskStart} 
        queueTaskToExec={queueTaskToExec} 
        queuePopupOpen={queuePopupOpen} 
        getQueueTaskTimeLeft={getQueueTaskTimeLeft} 
        handleQueuePopupComplete={handleQueuePopupComplete} 
        className="mx-0 py-[240px]" 
      />
      
      <TaskManager 
        queueTaskToExec={queueTaskToExec}
        queuePopupOpen={queuePopupOpen}
        handleQueuePopupComplete={handleQueuePopupComplete}
      />
      
      {showDayComplete && (
        <GameDayComplete 
          currentDay={currentDay}
          dayScore={dayScore}
          score={score}
        />
      )}
    </div>
  );
};

export default GameScreen;
