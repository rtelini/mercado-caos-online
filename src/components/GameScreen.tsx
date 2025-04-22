import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Task, { TaskType } from './Task';
import { PauseIcon } from 'lucide-react';
import TaskPopup from './TaskPopup';
import { useTaskQueue, TaskInQueue } from "@/hooks/useTaskQueue";
import TaskQueuePanel from "./TaskQueuePanel";

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onPause: () => void;
}

interface ActiveTask {
  id: string;
  type: TaskType;
  position: { x: number; y: number };
  timeLimit: number;
  isUrgent: boolean;
  clicksRequired: number;
  createdAt: number;
}

interface TaskInQueue {
  id: string;
  type: TaskType;
  timeLimit: number; // tempo para realizar a tarefa NA FILA
  addedToQueueAt: number; // quando entra na fila
}

const STRESS_MAX = 100;
const STRESS_INCREASE_ON_FAIL = 15;
const STRESS_INCREASE_ON_REPUTATION_FAIL = 25;
const STRESS_DECREASE_ON_SUCCESS = 2;
const GAME_DURATION_PER_DAY = 60; // 60 segundos por dia
const MAX_DAYS = 90; // 90 dias de experiência
const QUEUE_TASK_TIME = 12; // tempo máximo (segundos) para realizar cada tarefa na fila

const GameScreen = ({ onGameOver, onPause }: GameScreenProps) => {
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
  const queueTimersRef = useRef<{ [id: string]: NodeJS.Timeout }>({}); // timers das tasks da fila

  // Task type pool
  const taskTypes: TaskType[] = [
    'package_missing',
    'wrong_shipping',
    'canceled_sale',
    'urgent_message',
    'coupon_issue',
    'system_down',
    'reputation_drop',
    'duplicate_order'
  ];

  // Inicialização do jogo
  useEffect(() => {
    startGame();
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      clearAllQueueTimers();
    };
  }, []);
  
  // Helper para limpar timers da fila
  const clearAllQueueTimers = () => {
    Object.values(queueTimersRef.current).forEach(timer => clearTimeout(timer));
    queueTimersRef.current = {};
  };

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

    // Demissão se score do dia < 0
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
      const adjustedRate = Math.max(baseRate - (gameTime * 10), chaosMode ? 400 : 800);
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
      position: { x: posX, y: posY },
      timeLimit,
      isUrgent,
      clicksRequired,
      createdAt: Date.now()
    };

    setActiveTasks(prev => [...prev, newTask]);
    setTaskCounter(prev => prev + 1);
  };

  const {
    addTaskToQueue,
    removeTaskFromQueue,
    clearAllQueueTimers,
    getQueueTaskTimeLeft,
  } = useTaskQueue({
    onTimeout: handleQueueTaskTimeout,
    timePerQueueTask: QUEUE_TASK_TIME,
  });

  // Change: Ao clicar em task do board, move para fila apenas (não executa pop-up aqui)
  const handleTaskClick = useCallback((taskId: string, taskType: TaskType) => {
    setActiveTasks(prevActive => {
      const found = prevActive.find(t => t.id === taskId);
      if (!found) return prevActive;
      setTaskQueue(prevQueue => {
        addTaskToQueue(prevQueue, {
          id: found.id,
          type: found.type,
          timeLimit: QUEUE_TASK_TIME,
          addedToQueueAt: Date.now(),
        }, setTaskQueue);
        return prevQueue; // retorna prevQueue pois setTaskQueue já é chamado dentro do hook!
      });
      return prevActive.filter(t => t.id !== taskId); // remove do board
    });
  }, [addTaskToQueue]);

  // Task do board desaparece se expirar, não pontua
  const handleTaskTimeout = useCallback((taskId: string) => {
    const task = activeTasks.find(t => t.id === taskId);
    if (task) {
      const stressIncrease = task.type === 'reputation_drop' ? STRESS_INCREASE_ON_REPUTATION_FAIL : STRESS_INCREASE_ON_FAIL;
      setStressLevel(prev => prev + stressIncrease);
    }
    setActiveTasks(prev => prev.filter(t => t.id !== taskId));
  }, [activeTasks]);

  // Quando abrir tarefa da fila
  const handleQueueTaskStart = (queueTask: TaskInQueue) => {
    setQueueTaskToExec(queueTask);
    setQueuePopupOpen(true);
  };

  // Quando concluir tarefa da fila (sucesso/falha)
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
      setQueuePopupOpen(false);
      setQueueTaskToExec(null);
    }
  }, [queueTaskToExec, removeTaskFromQueue]);

  // Quando a task da fila expira (não resolvida no tempo)
  const handleQueueTaskTimeout = (taskId: string, taskType: TaskType) => {
    setScore(prev => prev - 2);
    setStressLevel(prev => prev + 8);
    removeTaskFromQueue(taskId, setTaskQueue);
    if (queueTaskToExec && queueTaskToExec.id === taskId) {
      setQueuePopupOpen(false);
      setQueueTaskToExec(null);
    }
  };

  // Game over se o score negativo no fim do dia
  useEffect(() => {
    if (score < 0 && showDayComplete && !gameOver) {
      setGameOver(true);
      onGameOver(score);
    }
  }, [score, showDayComplete, onGameOver, gameOver]);
  
  // Checar estresse
  useEffect(() => {
    if (stressLevel >= STRESS_MAX && !gameOver) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      clearAllQueueTimers();
      setGameOver(true);
      onGameOver(score);
    }
  }, [stressLevel, score, onGameOver, gameOver]);

  // Timer das tasks da fila: barra de progresso
  const getQueueTaskTimeLeft = (queueTask: TaskInQueue) => {
    const now = Date.now();
    const elapsed = (now - queueTask.addedToQueueAt) / 1000;
    return Math.max(0, queueTask.timeLimit - elapsed);
  };

  // Formatação de tempo MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Visuais do novo painel cinza estilo pop-up "pixel"
  return (
    <div className="relative flex flex-col w-full h-screen max-h-[80vh]">
      {/* HUD */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-medium mr-1 text-gray-200">Dia:</span>
            <span className="text-lg font-bold text-gray-100">{currentDay}/{MAX_DAYS}</span>
          </div>
          <div>
            <span className="text-sm font-medium mr-1 text-gray-200">Tempo:</span>
            <span className="text-lg font-bold text-gray-100">{formatTime(gameTime)}</span>
            {chaosMode && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">MODO CAOS</span>
            )}
          </div>
          <div>
            <span className="text-sm font-medium mr-1 text-gray-200">Pontos:</span>
            <span className="text-lg font-bold text-gray-100">{score}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onPause} className="text-gray-300 hover:text-gray-100">
          <PauseIcon size={20} />
        </Button>
      </div>
      {/* Barra de estresse */}
      <div className="w-full h-3 bg-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-gray-400 to-red-500 transition-all duration-300" 
          style={{ width: `${stressLevel}%` }}
        ></div>
      </div>
      {/* Game area */}
      <div 
        ref={gameAreaRef} 
        className="flex-1 relative bg-[url('https://via.placeholder.com/1000x800?text=Office+Background')] bg-cover bg-center overflow-hidden"
      >
        {/* Tasks do tabuleiro */}
        {activeTasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            type={task.type}
            position={task.position}
            timeLimit={task.timeLimit}
            onClick={handleTaskClick}
            onTimeout={handleTaskTimeout}
            isUrgent={task.isUrgent}
            clicksRequired={task.clicksRequired}
          />
        ))}

        {/* Novo painel da fila de tarefas */}
        <TaskQueuePanel
          taskQueue={taskQueue}
          onTaskStart={handleQueueTaskStart}
          queueTaskToExecId={queueTaskToExec ? queueTaskToExec.id : null}
          queuePopupOpen={queuePopupOpen}
          getQueueTaskTimeLeft={getQueueTaskTimeLeft}
        />

        {/* Pop-up para execução da tarefa da fila */}
        {queueTaskToExec && queuePopupOpen && (
          <TaskPopup
            taskType={queueTaskToExec.type}
            onComplete={handleQueuePopupComplete}
          />
        )}

        {/* Overlay de fim de dia */}
        {showDayComplete && (
          <div className="absolute inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-gray-700 border-[6px] border-gray-600 rounded-lg p-8 max-w-md text-center pixel-border animate-fade-in">
              <h2 className="text-3xl font-pixel mb-4 text-gray-100">Dia {currentDay} Completo!</h2>
              <div className="my-6">
                <p className="text-2xl font-pixel text-gray-100">Pontos do dia: {dayScore}</p>
                <p className="text-2xl font-pixel text-gray-100">Pontos totais: {score}</p>
              </div>
              {score < 0 ? (
                <Button
                  disabled
                  className="bg-gray-600 text-white font-pixel border-[3px] border-gray-900 mt-4 w-full py-3 text-lg cursor-not-allowed opacity-60 pixel-border"
                >
                  VOCÊ FOI DEMITIDO
                </Button>
              ) : (
                <Button
                  onClick={startNextDay}
                  className="bg-gray-200 hover:bg-white text-gray-700 font-pixel border-[3px] border-gray-700 mt-4 w-full py-3 text-lg pixel-border"
                >
                  {currentDay >= MAX_DAYS ? "Ver Resultado Final" : "Próximo Dia"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
