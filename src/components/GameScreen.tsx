
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Task, { TaskType } from './Task';
import { PauseIcon } from 'lucide-react';
import TaskPopup from './TaskPopup';

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

const STRESS_MAX = 100;
const STRESS_INCREASE_ON_FAIL = 15;
const STRESS_INCREASE_ON_REPUTATION_FAIL = 25;
const STRESS_DECREASE_ON_SUCCESS = 2;
const GAME_DURATION = 60; // 60 seconds for normal mode, then chaos mode

const GameScreen = ({ onGameOver, onPause }: GameScreenProps) => {
  const [score, setScore] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [taskCounter, setTaskCounter] = useState(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [currentPopupTask, setCurrentPopupTask] = useState<{ id: string; type: TaskType } | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const taskGeneratorRef = useRef<NodeJS.Timeout | null>(null);

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

  // Initialize game time and task generator
  useEffect(() => {
    startGame();
    
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = () => {
    // Reset game state
    setScore(0);
    setStressLevel(0);
    setGameTime(0);
    setActiveTasks([]);
    setChaosMode(false);
    setCurrentPopupTask(null);
    
    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setGameTime(prev => {
        const newTime = prev + 1;
        
        // Enter chaos mode after GAME_DURATION
        if (newTime === GAME_DURATION) {
          setChaosMode(true);
        }
        
        return newTime;
      });
    }, 1000);
    
    // Start task generator
    generateTasks();
  };

  const generateTasks = () => {
    taskGeneratorRef.current = setInterval(() => {
      // Calculate task generation rate based on game time and chaos mode
      const baseRate = chaosMode ? 800 : 1600;
      const adjustedRate = Math.max(baseRate - (gameTime * 10), chaosMode ? 400 : 800);
      
      // Generate a new task if no popup is currently active
      if (Math.random() * adjustedRate < 100) {
        createNewTask();
      }
    }, 100);
  };

  const createNewTask = () => {
    if (!gameAreaRef.current) return;
    
    const areaWidth = gameAreaRef.current.clientWidth;
    const areaHeight = gameAreaRef.current.clientHeight;
    
    // Ensure tasks aren't placed too close to the edges
    const safeMargin = 15;
    const posX = Math.random() * (100 - 2 * safeMargin) + safeMargin;
    const posY = Math.random() * (100 - 2 * safeMargin) + safeMargin;
    
    // Select a random task type
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
    // Determine if this is an urgent task (more likely in chaos mode)
    const isUrgent = Math.random() < (chaosMode ? 0.3 : 0.1);
    
    // Determine time limit based on task type and urgency
    let timeLimit = Math.random() * 5 + 3; // Base: 3-8 seconds
    if (isUrgent) timeLimit *= 0.7; // Urgent tasks have less time
    if (chaosMode) timeLimit *= 0.8; // Less time in chaos mode
    
    // Special case for system_down (needs multiple clicks)
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

  const handleTaskClick = useCallback((taskId: string, taskType: TaskType) => {
    // For tasks that require popup interaction
    const popupTasks: TaskType[] = [
      'package_missing', 
      'coupon_issue', 
      'duplicate_order', 
      'urgent_message'
    ];
    
    if (popupTasks.includes(taskType)) {
      setCurrentPopupTask({ id: taskId, type: taskType });
      // Don't remove the task from activeTasks until the popup is completed
    } else {
      // For simple tasks that complete with a single click
      handleTaskComplete(taskId, taskType);
    }
  }, []);

  const handlePopupComplete = useCallback((success: boolean) => {
    if (currentPopupTask && success) {
      handleTaskComplete(currentPopupTask.id, currentPopupTask.type);
    } else if (currentPopupTask) {
      handleTaskTimeout(currentPopupTask.id);
    }
    
    setCurrentPopupTask(null);
  }, [currentPopupTask]);

  const handleTaskComplete = useCallback((taskId: string, taskType: TaskType) => {
    // Update score
    setScore(prev => prev + 1);
    
    // Decrease stress (success relieves stress a bit)
    setStressLevel(prev => Math.max(0, prev - STRESS_DECREASE_ON_SUCCESS));
    
    // Remove completed task
    setActiveTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Play sound effect (would be implemented with actual sounds)
    console.log('Task completed sound');
  }, []);

  const handleTaskTimeout = useCallback((taskId: string) => {
    // Find the task to determine its type
    const task = activeTasks.find(t => t.id === taskId);
    
    // Increase stress based on task type
    if (task) {
      const stressIncrease = 
        task.type === 'reputation_drop' 
          ? STRESS_INCREASE_ON_REPUTATION_FAIL 
          : STRESS_INCREASE_ON_FAIL;
      
      setStressLevel(prev => {
        const newStress = prev + stressIncrease;
        return newStress;
      });
    }
    
    // Remove timed-out task
    setActiveTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Play failure sound effect
    console.log('Task failed sound');
  }, [activeTasks]);

  // Check for game over condition
  useEffect(() => {
    if (stressLevel >= STRESS_MAX) {
      // Game over due to stress
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskGeneratorRef.current) clearInterval(taskGeneratorRef.current);
      onGameOver(score);
    }
  }, [stressLevel, score, onGameOver]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative flex flex-col w-full h-screen max-h-[80vh]">
      {/* Game HUD */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-medium mr-1 text-gray-200">Tempo:</span>
            <span className="text-lg font-bold text-gray-100">{formatTime(gameTime)}</span>
            {chaosMode && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">
                MODO CAOS
              </span>
            )}
          </div>
          
          <div>
            <span className="text-sm font-medium mr-1 text-gray-200">Pontos:</span>
            <span className="text-lg font-bold text-gray-100">{score}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPause} 
          className="text-gray-300 hover:text-gray-100"
        >
          <PauseIcon size={20} />
        </Button>
      </div>
      
      {/* Stress bar */}
      <div className="w-full h-3 bg-gray-600">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-300" 
          style={{ width: `${stressLevel}%` }}
        ></div>
      </div>
      
      {/* Game area */}
      <div 
        ref={gameAreaRef} 
        className="flex-1 relative bg-[url('https://via.placeholder.com/1000x800?text=Office+Background')] bg-cover bg-center overflow-hidden"
      >
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

        {/* Task popup */}
        {currentPopupTask && (
          <TaskPopup
            taskType={currentPopupTask.type}
            onComplete={handlePopupComplete}
          />
        )}
      </div>
    </div>
  );
};

export default GameScreen;
