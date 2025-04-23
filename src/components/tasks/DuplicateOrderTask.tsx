
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PackageCheck } from 'lucide-react';

interface DuplicateOrderTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const DuplicateOrderTask = ({ onComplete, timeLeft }: DuplicateOrderTaskProps) => {
  const [selectedOrder, setSelectedOrder] = useState<'first' | 'second' | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Cancelar pedido duplicado
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center gap-6 mb-4">
          <div 
            className={`p-4 bg-gray-800 rounded-lg cursor-pointer ${selectedOrder === 'first' ? 'border-4 border-red-500' : 'border-4 border-gray-600'} pixel-border`}
            onClick={() => setSelectedOrder('first')}
          >
            <PackageCheck size={48} className="text-gray-300" />
            <span className="block mt-2 font-pixel text-white text-center">Pedido #12345</span>
          </div>
          
          <div 
            className={`p-4 bg-gray-800 rounded-lg cursor-pointer ${selectedOrder === 'second' ? 'border-4 border-red-500' : 'border-4 border-gray-600'} pixel-border`}
            onClick={() => setSelectedOrder('second')}
          >
            <PackageCheck size={48} className="text-gray-300" />
            <span className="block mt-2 font-pixel text-white text-center">Pedido #12346</span>
          </div>
        </div>
        
        <Button 
          onClick={() => selectedOrder ? onComplete(true) : null} 
          className="bg-red-500 hover:bg-red-600 text-white font-pixel w-full pixel-border"
          disabled={!selectedOrder}
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
};

export default DuplicateOrderTask;
