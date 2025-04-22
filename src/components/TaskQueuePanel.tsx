
import React from "react";
import { TaskInQueue } from "@/hooks/useTaskQueue";

interface TaskQueuePanelProps {
  taskQueue: TaskInQueue[];
  onTaskStart: (task: TaskInQueue) => void;
  queueTaskToExecId: string | null;
  queuePopupOpen: boolean;
  getQueueTaskTimeLeft: (queueTask: TaskInQueue) => number;
}

const TaskQueuePanel: React.FC<TaskQueuePanelProps> = ({
  taskQueue,
  onTaskStart,
  queueTaskToExecId,
  queuePopupOpen,
  getQueueTaskTimeLeft,
}) => {
  return (
    <div className="absolute top-4 right-4 z-40 min-w-[280px] bg-gray-900 bg-opacity-80 rounded-xl p-3 border-4 border-gray-600 pixel-border shadow-xl animate-fade-in">
      <h4 className="font-pixel text-sm text-gray-100 mb-2 text-center">Fila de Tarefas</h4>
      {taskQueue.length === 0 && (
        <div className="text-gray-400 font-pixel text-xs text-center py-3">Nenhuma tarefa na fila</div>
      )}
      {taskQueue.map((qt) => {
        const timeLeft = getQueueTaskTimeLeft(qt);
        const inExec = queueTaskToExecId === qt.id;
        return (
          <div
            key={qt.id}
            className={`rounded-lg mb-2 px-3 py-2 flex flex-col gap-0.5 ${
              inExec ? 'bg-gray-700' : 'bg-gray-800'
            } border border-gray-500 hover:bg-gray-700 transition cursor-pointer pixel-border`}
            onClick={() => !queuePopupOpen && onTaskStart(qt)}
          >
            <span className="font-pixel text-xs text-gray-200">
              [{qt.type.replace("_", " ").toUpperCase()}]
            </span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <div className="w-full h-1.5 bg-gray-900 rounded-full">
                  <div
                    className={`h-1.5 rounded-full ${
                      timeLeft < 6 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(timeLeft / qt.timeLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="font-mono ml-2 text-[10px] text-gray-300">{timeLeft.toFixed(0)}s</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskQueuePanel;
