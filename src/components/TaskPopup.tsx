import React from 'react';
import './TaskPopup.css';

interface TaskPopupProps {
  taskTitle: string;
  taskDescription: string;
  onComplete: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ taskTitle, taskDescription, onComplete }) => {
  return (
    <div className="popup-container">
      <div className="popup-card">
        <h2>{taskTitle}</h2>
        <p>{taskDescription}</p>
        <button onClick={onComplete}>Concluir</button>
      </div>
    </div>
  );
};

export default TaskPopup;
