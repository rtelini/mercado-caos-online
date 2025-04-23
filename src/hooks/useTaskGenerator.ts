
import { useCallback } from 'react';
import { TaskType } from '@/components/Task';
import type { ActiveTask } from './useGameState';

const taskTypes: TaskType[] = ['package_missing', 'wrong_shipping', 'canceled_sale', 'urgent_message', 'coupon_issue', 'system_down', 'reputation_drop', 'duplicate_order'];

export const useTaskGenerator = (
  taskCounter: number,
  setTaskCounter: (value: React.SetStateAction<number>) => void,
  setActiveTasks: (value: React.SetStateAction<ActiveTask[]>) => void
) => {
  const createNewTask = useCallback(() => {
    const safeMargin = 15;
    const posX = Math.random() * (100 - 2 * safeMargin) + safeMargin;
    const posY = Math.random() * (100 - 2 * safeMargin) + safeMargin;
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const isUrgent = Math.random() < 0.3;
    let timeLimit = Math.random() * 5 + 3;
    if (isUrgent) timeLimit *= 0.7;

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
  }, [taskCounter, setTaskCounter, setActiveTasks]);

  return { createNewTask };
};
