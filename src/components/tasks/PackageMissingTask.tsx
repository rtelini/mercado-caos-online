
import React from 'react';
import { Button } from '@/components/ui/button';

interface PackageMissingTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const PackageMissingTask = ({ onComplete, timeLeft }: PackageMissingTaskProps) => {
  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Abrir Reclamação
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-gray-800 p-3 rounded-lg mb-4 pixel-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-pixel text-white text-xs mb-2">Rastreio: BR45872301</p>
              <p className="font-pixel text-gray-400 text-xs">Última atualização: 7 dias atrás</p>
            </div>
            <div className="bg-red-600 text-white text-xs p-1 rounded font-pixel">
              Sem atualização
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => onComplete(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-pixel mb-3 pixel-border"
        >
          Abrir Reclamação no sistema
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

export default PackageMissingTask;
