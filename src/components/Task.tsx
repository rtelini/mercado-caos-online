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
    if (type === 'system_down') {
      // For system_down which requires multiple clicks
      if (clicks + 1 >= clicksRequired) {
        onClick(id, type);
      } else {
        setClicks(clicks + 1);
      }
    } else {
      // For all other tasks, just trigger onClick immediately
      onClick(id, type);
    }
  };
  
  const getTaskIcon = () => {
    switch(type) {
      case 'package_missing':
        return <Package2 size={28} className="pixel-effect" />;
      case 'wrong_shipping':
        return <Truck size={28} className="pixel-effect" />;
      case 'canceled_sale':
        return <X size={28} className="pixel-effect" />;
      case 'urgent_message':
        return <MessageSquare size={28} className="pixel-effect" />;
      case 'coupon_issue':
        return <Tag size={28} className="pixel-effect" />;
      case 'system_down':
        return <Monitor size={28} className="pixel-effect" />;
      case 'reputation_drop':
        return <ChartBar size={28} className="pixel-effect" />;
      case 'duplicate_order':
        return <PackageCheck size={28} className="pixel-effect" />;
      default:
        return <Package2 size={28} className="pixel-effect" />;
    }
  };

  const getTaskLabel = () => {
    switch(type) {
      case 'package_missing':
        return "Cliente não recebeu o pedido";
      case 'wrong_shipping':
        return "Erro no frete";
      case 'canceled_sale':
        return "Venda cancelada por engano";
      case 'urgent_message':
        return "Mensagem urgente no chat";
      case 'coupon_issue':
        return "Cupom não aplicado";
      case 'system_down':
        return "Sistema fora do ar!";
      case 'reputation_drop':
        return "Reputação caiu!";
      case 'duplicate_order':
        return "Pedido duplicado";
      default:
        return "";
    }
  };
  
  const getTaskColor = () => {
    // All tasks have the same gray style now
    return 'text-gray-700 bg-opacity-80 bg-gray-200 border-[3px] border-gray-700';
  };
  
  const progressPercentage = (timeLeft / timeLimit) * 100;
  
  const taskStyles = isUrgent 
    ? "animate-pulse-task shadow-lg" 
    : "shadow-md";
  
  return (
    <div 
      className={`absolute cursor-pointer rounded-lg p-3 ${getTaskColor()} ${taskStyles} animate-fade-in pixel-border`} 
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`, 
        transform: 'translate(-50%, -50%)',
        zIndex: isUrgent ? 10 : 1
      }}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center mb-1">
          {getTaskIcon()}
        </div>
        
        <span className="text-xs font-pixel text-center mb-1 max-w-[100px] line-clamp-2">
          {getTaskLabel()}
        </span>
        
        {type === 'system_down' && (
          <span className="text-xs font-pixel mt-0.5 mb-1">
            {clicks}/{clicksRequired} cliques
          </span>
        )}
      </div>
      
      <div className="w-full mt-1 bg-gray-900 rounded-full h-1">
        <div 
          className={`h-1 rounded-full ${progressPercentage < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Task;
