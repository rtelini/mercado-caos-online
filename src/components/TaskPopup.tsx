
import React, { memo } from 'react';
import { TaskType } from './Task';
import { useTaskTimer } from '@/hooks/useTaskTimer';
import PackageMissingTask from './tasks/PackageMissingTask';
import CouponIssueTask from './tasks/CouponIssueTask';
import DuplicateOrderTask from './tasks/DuplicateOrderTask';
import UrgentMessageTask from './tasks/UrgentMessageTask';
import SystemDownTask from './tasks/SystemDownTask';
import CanceledSaleTask from './tasks/CanceledSaleTask';
import WrongShippingTask from './tasks/WrongShippingTask';
import ReputationDropTask from './tasks/ReputationDropTask';

interface TaskPopupProps {
  taskType: TaskType;
  onComplete: (success: boolean) => void;
}

const TaskPopup = memo(({ taskType, onComplete }: TaskPopupProps) => {
  const { timeLeft, isOpen, handleComplete } = useTaskTimer(10, onComplete);

  const renderTaskContent = () => {
    switch (taskType) {
      case 'package_missing':
        return <PackageMissingTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'coupon_issue':
        return <CouponIssueTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'duplicate_order':
        return <DuplicateOrderTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'urgent_message':
        return <UrgentMessageTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'system_down':
        return <SystemDownTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'canceled_sale':
        return <CanceledSaleTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'wrong_shipping':
        return <WrongShippingTask onComplete={handleComplete} timeLeft={timeLeft} />;
      case 'reputation_drop':
        return <ReputationDropTask onComplete={handleComplete} timeLeft={timeLeft} />;
      default:
        return <div>Tarefa desconhecida</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-gray-900 border-4 border-gray-700 rounded-lg scanlines crt-effect pixel-border shadow-2xl">
      {renderTaskContent()}
    </div>
  );
});

TaskPopup.displayName = 'TaskPopup';

export default TaskPopup;
