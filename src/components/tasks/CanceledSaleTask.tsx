
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CanceledSaleTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const CanceledSaleTask = ({ onComplete, timeLeft }: CanceledSaleTaskProps) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Reativar venda
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gray-800 p-3 rounded-lg mb-4 w-full pixel-border">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <h3 className="font-pixel text-white text-sm">Smartphone XYZ</h3>
              <p className="font-pixel text-gray-400 text-xs">R$ 1.299,00</p>
              <p className="font-pixel text-red-400 text-xs">VENDA CANCELADA</p>
            </div>
          </div>
        </div>
        
        <div className="w-full mb-4">
          <label className="block text-gray-300 font-pixel text-xs mb-2">Motivo:</label>
          <div className="flex flex-col gap-2">
            <div 
              className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedReason === 'cancelamento_indevido' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
              onClick={() => setSelectedReason('cancelamento_indevido')}
            >
              <p className="text-white font-pixel text-xs">Cancelamento indevido</p>
            </div>
            
            <div 
              className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedReason === 'erro_sistema' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
              onClick={() => setSelectedReason('erro_sistema')}
            >
              <p className="text-white font-pixel text-xs">Erro do sistema</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => selectedReason ? onComplete(true) : null}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel pixel-border"
          disabled={!selectedReason}
        >
          Restaurar venda
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

export default CanceledSaleTask;
