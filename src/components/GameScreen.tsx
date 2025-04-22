import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameHUD from './GameHUD';
import StressBar from './StressBar';
import GameArea from './GameArea';
import { TaskType } from './Task'; // Added this import for TaskType
import TaskPopup from './TaskPopup'; // Added this import for TaskPopup
import { useTaskQueue, TaskInQueue } from "@/hooks/useTaskQueue";
interface GameScreenProps {
  onGameOver: (score: number) => void;
  onPause: () => void;
}
interface ActiveTask {
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
const STRESS_MAX = 100;
const STRESS_INCREASE_ON_FAIL = 15;
const STRESS_INCREASE_ON_REPUTATION_FAIL = 25;
const STRESS_DECREASE_ON_SUCCESS = 2;
const GAME_DURATION_PER_DAY = 60; // 60 segundos por dia
const MAX_DAYS = 90; // 90 dias de experiência
const QUEUE_TASK_TIME = 12; // tempo máximo (segundos) para realizar cada tarefa na fila

const GameScreen = ({
  onGameOver,
  onPause
}: GameScreenProps) => {
  const [score, setScore] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [taskCounter, setTaskCounter] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [taskQueue, setTaskQueue] = useState<TaskInQueue[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [showDayComplete, setShowDayComplete] = useState(false);
  const [dayScore, setDayScore] = useState(0);
  const [queuePopupOpen, setQueuePopupOpen] = useState(false);
  const [queueTaskToExec, setQueueTaskToExec] = useState<TaskInQueue | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const taskGeneratorRef = useRef<NodeJS.Timeout | null>(null);
  const taskTypes: TaskType[] = ['package_missing', 'wrong_shipping', 'canceled_sale', 'urgent_message', 'coupon_issue', 'system_down', 'reputation_drop', 'duplicate_order'];
  const handleQueueTaskTimeout = useCallback((taskId: string, taskType: TaskType) => {
    setScore(prev => prev - 2);
    setStressLevel(prev => prev + 8);
    removeTaskFromQueue(taskId, setTaskQueue);
    if (queueTaskToExec && queueTaskToExec.id === taskId) {
      setQueuePopupOpen(false);
      setQueueTaskToExec(null);
    }
  }, [queueTaskToExec]);
  const {
    addTaskToQueue,
    removeTaskFromQueue,
    clearAllQueueTimers,
    getQueueTaskTimeLeft
  } = useTaskQueue({
    onTimeout: handleQueueTaskTimeout,
    timePerQueueTask: QUEUE_TASK_TIME
  });
  useEffect(() => {
    startGame();
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      clearAllQueueTimers();
    };
  }, [clearAllQueueTimers]);
  const startGame = () => {
    setScore(0);
    setStressLevel(0);
    setGameTime(0);
    setActiveTasks([]);
    setChaosMode(false);
    setCurrentDay(1);
    setDayScore(0);
    setTaskQueue([]);
    setQueuePopupOpen(false);
    setQueueTaskToExec(null);
    setGameOver(false);
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
    generateTasks();
  };
  const completeDay = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
    clearAllQueueTimers();
    setDayScore(score);
    setShowDayComplete(true);
    setActiveTasks([]);
    setChaosMode(false);
    if (score < 0) {
      setTimeout(() => {
        setGameOver(true);
        onGameOver(score);
      }, 1400);
    }
  };
  const startNextDay = () => {
    if (currentDay >= MAX_DAYS) {
      setGameOver(true);
      onGameOver(score);
      return;
    }
    setCurrentDay(prev => prev + 1);
    setGameTime(0);
    setShowDayComplete(false);
    setActiveTasks([]);
    setTaskQueue([]);
    setQueuePopupOpen(false);
    setQueueTaskToExec(null);
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
    generateTasks();
  };
  const generateTasks = () => {
    taskGeneratorRef.current = setInterval(() => {
      const baseRate = chaosMode ? 800 : 1600;
      const adjustedRate = Math.max(baseRate - gameTime * 10, chaosMode ? 400 : 800);
      if (Math.random() * adjustedRate < 100) {
        createNewTask();
      }
    }, 100);
  };
  const createNewTask = () => {
    if (!gameAreaRef.current) return;
    const safeMargin = 15;
    const posX = Math.random() * (100 - 2 * safeMargin) + safeMargin;
    const posY = Math.random() * (100 - 2 * safeMargin) + safeMargin;
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const isUrgent = Math.random() < (chaosMode ? 0.3 : 0.1);
    let timeLimit = Math.random() * 5 + 3; // 3-8s
    if (isUrgent) timeLimit *= 0.7;
    if (chaosMode) timeLimit *= 0.8;
    const clicksRequired = taskType === 'system_down' ? 3 : 1;
    const newTask: ActiveTask = {
      id: `task-${taskCounter}`,
      type: taskType,
      position: {
        x: posX,
        y: posY
      },
      timeLimit,
      isUrgent,
      clicksRequired,
      createdAt: Date.now()
    };
    setActiveTasks(prev => [...prev, newTask]);
    setTaskCounter(prev => prev + 1);
  };
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
  }, [activeTasks]);
  const handleQueueTaskStart = (queueTask: TaskInQueue) => {
    if (!queuePopupOpen) {
      setQueueTaskToExec(queueTask);
      setQueuePopupOpen(true);
    }
  };
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
  }, [queueTaskToExec, removeTaskFromQueue]);
  useEffect(() => {
    if (score < 0 && showDayComplete && !gameOver) {
      setGameOver(true);
      onGameOver(score);
    }
  }, [score, showDayComplete, onGameOver, gameOver]);
  useEffect(() => {
    if (stressLevel >= STRESS_MAX && !gameOver) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      clearAllQueueTimers();
      setGameOver(true);
      onGameOver(score);
    }
  }, [stressLevel, score, onGameOver, gameOver, clearAllQueueTimers]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  return <div className="relative flex flex-col w-full h-screen max-h-[80vh] my-0 bg-stone-50 rounded-full">
      <GameHUD currentDay={currentDay} maxDays={MAX_DAYS} gameTime={gameTime} chaosMode={chaosMode} score={score} onPause={onPause} formatTime={formatTime} />
      <StressBar stressLevel={stressLevel} />
      <GameArea gameAreaRef={gameAreaRef} activeTasks={activeTasks} handleTaskClick={handleTaskClick} handleTaskTimeout={handleTaskTimeout} taskQueue={taskQueue} onTaskStart={handleQueueTaskStart} queueTaskToExec={queueTaskToExec} queuePopupOpen={queuePopupOpen} getQueueTaskTimeLeft={getQueueTaskTimeLeft} handleQueuePopupComplete={handleQueuePopupComplete} className="mx-0 py-[240px]" />
      {/* Novo painel para o pop-up, fora do tabuleiro */}
      {queueTaskToExec && queuePopupOpen && <div className="w-full flex justify-center mt-6">
          <div className="max-w-xl w-full">
            <TaskPopup taskType={queueTaskToExec.type} onComplete={handleQueuePopupComplete} />
          </div>
        </div>}
    </div>;
};
export default GameScreen;