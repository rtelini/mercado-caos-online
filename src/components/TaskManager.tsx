
import React from 'react';
import { TaskType } from './Task';
import TaskPopup from './TaskPopup';
import type { TaskInQueue } from '@/hooks/useTaskQueue';

interface TaskManagerProps {
  queueTaskToExec: TaskInQueue | null;
  queuePopupOpen: boolean;
  handleQueuePopupComplete: (success: boolean) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  queueTaskToExec,
  queuePopupOpen,
  handleQueuePopupComplete,
}) => {
  if (!queueTaskToExec || !queuePopupOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="max-w-xl w-full">
        <TaskPopup 
          taskType={queueTaskToExec.type} 
          onComplete={handleQueuePopupComplete} 
        />
      </div>
    </div>
  );
};

export default TaskManager;
