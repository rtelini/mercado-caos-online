
import { useRef, useCallback } from "react";
import { TaskType } from "@/components/Task";

export interface TaskInQueue {
  id: string;
  type: TaskType;
  timeLimit: number; // tempo para realizar a tarefa NA FILA
  addedToQueueAt: number; // quando entra na fila
}

interface UseTaskQueueOptions {
  onTimeout: (id: string, type: TaskType) => void;
  timePerQueueTask: number;
}

export function useTaskQueue({ onTimeout, timePerQueueTask }: UseTaskQueueOptions) {
  const timers = useRef<{ [id: string]: NodeJS.Timeout }>({});

  const addTaskToQueue = useCallback(
    (queue: TaskInQueue[], task: TaskInQueue, setQueue: (q: TaskInQueue[]) => void) => {
      // Não pode duplicar
      if (queue.find((t) => t.id === task.id)) return queue;

      const timeout = setTimeout(() => {
        onTimeout(task.id, task.type);
      }, timePerQueueTask * 1000);
      timers.current[task.id] = timeout;
      setQueue([...queue, { ...task, timeLimit: timePerQueueTask, addedToQueueAt: Date.now() }]);
      return [...queue, task];
    },
    [onTimeout, timePerQueueTask]
  );

  const removeTaskFromQueue = useCallback((taskId: string, setQueue: (q: TaskInQueue[]) => void) => {
    clearTimeout(timers.current[taskId]);
    delete timers.current[taskId];
    // Fix: Properly type the callback function to return TaskInQueue[]
    setQueue((prev: TaskInQueue[]) => prev.filter((q) => q.id !== taskId));
  }, []);

  const clearAllQueueTimers = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
  }, []);

  const getQueueTaskTimeLeft = (queueTask: TaskInQueue) => {
    const now = Date.now();
    const elapsed = (now - queueTask.addedToQueueAt) / 1000;
    return Math.max(0, queueTask.timeLimit - elapsed);
  };

  return {
    addTaskToQueue,
    removeTaskFromQueue,
    clearAllQueueTimers,
    getQueueTaskTimeLeft,
  };
}
