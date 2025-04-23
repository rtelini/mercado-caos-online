
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

interface WrongShippingTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const WrongShippingTask = ({ onComplete, timeLeft }: WrongShippingTaskProps) => {
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Corrigir frete
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col gap-3 w-full">
          <div 
            className={`bg-gray-800 p-3 rounded-lg cursor-pointer pixel-border flex items-center justify-between ${selectedShipping === 'economico' ? 'border-green-500 border-2' : ''}`}
            onClick={() => setSelectedShipping('economico')}
          >
            <div className="flex items-center">
              <Truck className="mr-3 text-gray-300" />
              <div>
                <p className="font-pixel text-white text-sm">Econômico</p>
                <p className="font-pixel text-gray-400 text-xs">7-10 dias úteis</p>
              </div>
            </div>
            <div className="font-pixel text-white">R$ 9,90</div>
          </div>
          
          <div 
            className={`bg-gray-800 p-3 rounded-lg cursor-pointer pixel-border flex items-center justify-between ${selectedShipping === 'rapido' ? 'border-green-500 border-2' : ''}`}
            onClick={() => setSelectedShipping('rapido')}
          >
            <div className="flex items-center">
              <Truck className="mr-3 text-gray-300" />
              <div>
                <p className="font-pixel text-white text-sm">Rápido ← Correto</p>
                <p className="font-pixel text-gray-400 text-xs">3-5 dias úteis</p>
              </div>
            </div>
            <div className="font-pixel text-white">R$ 19,90</div>
          </div>
          
          <div 
            className={`bg-gray-800 p-3 rounded-lg cursor-pointer pixel-border flex items-center justify-between ${selectedShipping === 'expresso' ? 'border-green-500 border-2' : ''}`}
            onClick={() => setSelectedShipping('expresso')}
          >
            <div className="flex items-center">
              <Truck className="mr-3 text-gray-300" />
              <div>
                <p className="font-pixel text-white text-sm">Expresso</p>
                <p className="font-pixel text-gray-400 text-xs">1-2 dias úteis</p>
              </div>
            </div>
            <div className="font-pixel text-white">R$ 29,90</div>
          </div>
        </div>
        
        <Button 
          onClick={() => selectedShipping === 'rapido' ? onComplete(true) : onComplete(false)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel mt-4 pixel-border"
          disabled={!selectedShipping}
        >
          Concluir
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

export default WrongShippingTask;
