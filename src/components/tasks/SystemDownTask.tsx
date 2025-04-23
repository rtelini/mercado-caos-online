
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, ZapIcon } from 'lucide-react';

interface SystemDownTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const SystemDownTask = ({ onComplete, timeLeft }: SystemDownTaskProps) => {
  const [clickedButtons, setClickedButtons] = useState<string[]>([]);
  const allButtonsClicked = clickedButtons.length === 3;

  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Reiniciar Sistema
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-between items-center w-full mb-6">
          <Button
            variant="outline"
            className={`p-6 ${clickedButtons.includes('reiniciar') ? 'bg-gray-800 opacity-50' : 'bg-blue-900 animate-pulse'} text-white font-pixel pixel-border`}
            onClick={() => {
              if (!clickedButtons.includes('reiniciar')) {
                setClickedButtons(prev => [...prev, 'reiniciar']);
              }
            }}
            disabled={clickedButtons.includes('reiniciar')}
          >
            <div className="flex flex-col items-center">
              <RefreshCw size={24} />
              <span className="mt-2">Reiniciar</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className={`p-6 ${clickedButtons.includes('testar') ? 'bg-gray-800 opacity-50' : 'bg-green-900 animate-pulse'} text-white font-pixel pixel-border`}
            onClick={() => {
              if (!clickedButtons.includes('testar')) {
                setClickedButtons(prev => [...prev, 'testar']);
              }
            }}
            disabled={clickedButtons.includes('testar')}
          >
            <div className="flex flex-col items-center">
              <CheckCircle size={24} />
              <span className="mt-2">Testar</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className={`p-6 ${clickedButtons.includes('conectar') ? 'bg-gray-800 opacity-50' : 'bg-purple-900 animate-pulse'} text-white font-pixel pixel-border`}
            onClick={() => {
              if (!clickedButtons.includes('conectar')) {
                setClickedButtons(prev => [...prev, 'conectar']);
              }
            }}
            disabled={clickedButtons.includes('conectar')}
          >
            <div className="flex flex-col items-center">
              <ZapIcon size={24} />
              <span className="mt-2">Conectar</span>
            </div>
          </Button>
        </div>
        
        {allButtonsClicked && (
          <Button
            onClick={() => onComplete(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel pixel-border"
          >
            Concluir
          </Button>
        )}
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

export default SystemDownTask;
