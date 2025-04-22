
import React, { useState, useEffect } from 'react';
import { TaskType } from './Task';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package2, Tag, MessageSquare, PackageCheck, Send } from 'lucide-react';

interface TaskPopupProps {
  taskType: TaskType;
  onComplete: (success: boolean) => void;
}

const TaskPopup = ({ taskType, onComplete }: TaskPopupProps) => {
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds to complete the popup task
  const [isOpen, setIsOpen] = useState(true);
  
  // Task-specific states
  const [packageDeliveryStep, setPackageDeliveryStep] = useState<'package' | 'customer' | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [duplicateSelected, setDuplicateSelected] = useState<'first' | 'second' | null>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Set a timer for the task
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleComplete(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleComplete = (success: boolean) => {
    setIsOpen(false);
    onComplete(success);
  };

  const renderTaskContent = () => {
    switch (taskType) {
      case 'package_missing':
        return (
          <div className="p-4">
            <DialogTitle className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
              Entregue o Pacote!
            </DialogTitle>
            
            <div className="flex flex-col items-center mb-6">
              <div className="flex justify-between items-center w-full mb-4">
                <div 
                  className={`p-4 bg-gray-800 rounded-lg ${packageDeliveryStep === 'package' ? 'border-4 border-green-500' : 'border-4 border-gray-600'} cursor-pointer pixel-border`}
                  onClick={() => setPackageDeliveryStep('package')}
                >
                  <Package2 size={48} className="text-gray-300" />
                  <span className="block mt-2 font-pixel text-white">Pacote</span>
                </div>
                
                <div className="font-pixel text-2xl text-white">→→→</div>
                
                <div 
                  className={`p-4 bg-gray-800 rounded-lg ${packageDeliveryStep === 'customer' ? 'border-4 border-green-500' : 'border-4 border-gray-600'} ${packageDeliveryStep === 'package' ? 'cursor-pointer' : 'opacity-50'} pixel-border`}
                  onClick={() => {
                    if (packageDeliveryStep === 'package') {
                      setPackageDeliveryStep('customer');
                      // If they clicked in the right order, complete the task
                      handleComplete(true);
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <span className="block mt-2 font-pixel text-white">Cliente</span>
                </div>
              </div>
              
              <p className="text-white font-pixel text-sm mt-2">
                {packageDeliveryStep === 'package' 
                  ? 'Agora clique no cliente para entregar!' 
                  : 'Clique no pacote primeiro, depois no cliente!'}
              </p>
            </div>
            
            <div className="w-full bg-gray-900 h-2 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        );
        
      case 'coupon_issue':
        return (
          <div className="p-4">
            <DialogTitle className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
              Crie um Cupom Novo!
            </DialogTitle>
            
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Tag size={40} className="text-gray-300 mr-2" />
              </div>
              
              <div className="w-full mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Digite o código do cupom"
                  className="w-full p-2 bg-gray-800 border-2 border-gray-600 text-white font-pixel rounded pixel-border placeholder-gray-500"
                />
              </div>
              
              <Button 
                onClick={() => couponCode.length >= 4 ? handleComplete(true) : null} 
                className="bg-gray-600 hover:bg-gray-700 text-white font-pixel pixel-border"
                disabled={couponCode.length < 4}
              >
                Criar Cupom
              </Button>
            </div>
            
            <div className="w-full bg-gray-900 h-2 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        );
        
      case 'duplicate_order':
        return (
          <div className="p-4">
            <DialogTitle className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
              Cancele o Pedido Duplicado!
            </DialogTitle>
            
            <div className="flex flex-col items-center mb-6">
              <div className="flex justify-center gap-6 mb-4">
                <div 
                  className={`p-4 bg-gray-800 rounded-lg cursor-pointer ${duplicateSelected === 'first' ? 'border-4 border-red-500' : 'border-4 border-gray-600'} pixel-border`}
                  onClick={() => setDuplicateSelected('first')}
                >
                  <PackageCheck size={48} className="text-gray-300" />
                  <span className="block mt-2 font-pixel text-white text-center">Pedido #1</span>
                </div>
                
                <div 
                  className={`p-4 bg-gray-800 rounded-lg cursor-pointer ${duplicateSelected === 'second' ? 'border-4 border-red-500' : 'border-4 border-gray-600'} pixel-border`}
                  onClick={() => setDuplicateSelected('second')}
                >
                  <PackageCheck size={48} className="text-gray-300" />
                  <span className="block mt-2 font-pixel text-white text-center">Pedido #2</span>
                </div>
              </div>
              
              <Button 
                onClick={() => duplicateSelected ? handleComplete(true) : null} 
                className="bg-red-500 hover:bg-red-600 text-white font-pixel pixel-border"
                disabled={!duplicateSelected}
              >
                Cancelar Pedido
              </Button>
            </div>
            
            <div className="w-full bg-gray-900 h-2 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        );
        
      case 'urgent_message':
        return (
          <div className="p-4">
            <DialogTitle className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
              Responda Rápido!
            </DialogTitle>
            
            <div className="bg-gray-800 p-3 rounded-lg mb-4 pixel-border">
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full mr-2 flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-2 text-white font-pixel text-xs">
                  Olá, meu produto não chegou ainda! Preciso dele com urgência!
                </div>
              </div>
            </div>
            
            <div className="flex mb-4">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex-1 p-2 bg-gray-800 border-2 border-gray-600 text-white font-pixel rounded-l pixel-border placeholder-gray-500"
              />
              
              <Button 
                onClick={() => messageText.length >= 5 ? handleComplete(true) : null} 
                className="bg-gray-600 hover:bg-gray-700 rounded-l-none"
                disabled={messageText.length < 5}
              >
                <Send size={18} />
              </Button>
            </div>
            
            <div className="w-full bg-gray-900 h-2 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        );
        
      default:
        return <div>Tarefa desconhecida</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-900 border-0 text-white max-w-md w-11/12 scanlines crt-effect pixel-border">
        {renderTaskContent()}
      </DialogContent>
    </Dialog>
  );
};

export default TaskPopup;
