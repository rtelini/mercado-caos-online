import React, { useState, useEffect } from 'react';
import { Package2, Truck, X, MessageSquare, Tag, Monitor, ChartBar, PackageCheck } from 'lucide-react';

export type TaskType = 
  | 'package_missing' 
  | 'wrong_shipping' 
  | 'canceled_sale' 
  | 'urgent_message'
  | 'coupon_issue'
  | 'system_down'
  | 'reputation_drop'
  | 'duplicate_order';

interface TaskProps {
  id: string;
  type: TaskType;
  position: { x: number; y: number };
  timeLimit: number;
  onClick: (id: string, type: TaskType) => void;
  onTimeout: (id: string) => void;
  isUrgent?: boolean;
  clicksRequired?: number;
}

const Task = ({ 
  id, 
  type, 
  position, 
  timeLimit, 
  onClick, 
  onTimeout,
  isUrgent = false,
  clicksRequired = 1
}: TaskProps) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeout(id);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [id, onTimeout, timeLimit]);
  
  const handleClick = () => {
    if (clicks + 1 >= clicksRequired) {
      onClick(id, type);
    } else {
      setClicks(clicks + 1);
    }
  };
  
  const getTaskIcon = () => {
    switch(type) {
      case 'package_missing':
        return <Package2 size={32} />;
      case 'wrong_shipping':
        return <Truck size={32} />;
      case 'canceled_sale':
        return <X size={32} />;
      case 'urgent_message':
        return <MessageSquare size={32} />;
      case 'coupon_issue':
        return <Tag size={32} />;
      case 'system_down':
        return <Monitor size={32} />;
      case 'reputation_drop':
        return <ChartBar size={32} />;
      case 'duplicate_order':
        return <PackageCheck size={32} />;
      default:
        return <Package2 size={32} />;
    }
  };
  
  const getTaskColor = () => {
    switch(type) {
      case 'package_missing':
        return 'text-game-blue bg-game-light-blue';
      case 'wrong_shipping':
        return 'text-game-accent bg-orange-100';
      case 'canceled_sale':
        return 'text-game-danger bg-red-100';
      case 'urgent_message':
        return 'text-game-primary bg-purple-100';
      case 'coupon_issue':
        return 'text-yellow-500 bg-game-yellow';
      case 'system_down':
        return 'text-blue-600 bg-blue-100';
      case 'reputation_drop':
        return 'text-game-danger bg-red-100';
      case 'duplicate_order':
        return 'text-green-500 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };
  
  const progressPercentage = (timeLeft / timeLimit) * 100;
  
  const taskStyles = isUrgent 
    ? "animate-pulse-task shadow-md" 
    : "shadow-sm";
  
  return (
    <div 
      className={`absolute cursor-pointer rounded-lg p-3 ${getTaskColor()} ${taskStyles} animate-fade-in`} 
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`, 
        transform: 'translate(-50%, -50%)',
        zIndex: isUrgent ? 10 : 1
      }}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        {getTaskIcon()}
        {clicksRequired > 1 && (
          <span className="text-xs mt-1">
            {clicks}/{clicksRequired} cliques
          </span>
        )}
      </div>
      <div className="w-full mt-1 bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full ${progressPercentage < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Task;
