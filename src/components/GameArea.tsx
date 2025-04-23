
import React from "react";
import Task, { TaskType } from "./Task";
import TaskQueuePanel from "./TaskQueuePanel";
import { TaskInQueue } from "@/hooks/useTaskQueue";

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

interface GameAreaProps {
  gameAreaRef: React.RefObject<HTMLDivElement>;
  activeTasks: ActiveTask[];
  handleTaskClick: (taskId: string, taskType: TaskType) => void;
  handleTaskTimeout: (taskId: string) => void;
  taskQueue: TaskInQueue[];
  onTaskStart: (queueTask: TaskInQueue) => void;
  queueTaskToExec: TaskInQueue | null;
  queuePopupOpen: boolean;
  getQueueTaskTimeLeft: (queueTask: TaskInQueue) => number;
  handleQueuePopupComplete: (success: boolean) => void;
  className?: string;
}

const GameArea: React.FC<GameAreaProps> = ({
  gameAreaRef,
  activeTasks,
  handleTaskClick,
  handleTaskTimeout,
  taskQueue,
  onTaskStart,
  queueTaskToExec,
  queuePopupOpen,
  getQueueTaskTimeLeft,
  handleQueuePopupComplete,
  className
}) => (
  <div 
    ref={gameAreaRef} 
    className={`relative bg-[url('https://via.placeholder.com/1000x800?text=Office+Background')] bg-cover bg-center overflow-hidden w-full h-full min-h-[100px] ${className || ''}`}
  >
    {activeTasks.map(task => (
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
    <TaskQueuePanel 
      taskQueue={taskQueue} 
      onTaskStart={onTaskStart} 
      queueTaskToExecId={queueTaskToExec ? queueTaskToExec.id : null} 
      queuePopupOpen={queuePopupOpen} 
      getQueueTaskTimeLeft={getQueueTaskTimeLeft}
    />
  </div>
);

export default GameArea;
