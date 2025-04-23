
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingDown } from 'lucide-react';

interface ReputationDropTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const ReputationDropTask = ({ onComplete, timeLeft }: ReputationDropTaskProps) => {
  const [improvedAreas, setImprovedAreas] = useState<string[]>([]);
  const canComplete = improvedAreas.length >= 2;

  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Ajustar indicadores
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col gap-3 w-full">
          {[
            { id: 'prazo', label: 'Prazo de entrega' },
            { id: 'qualidade', label: 'Qualidade' },
            { id: 'atendimento', label: 'Atendimento' }
          ].map(area => (
            <div key={area.id} className="bg-gray-800 p-3 rounded-lg pixel-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingDown className="mr-3 text-red-500" />
                  <div>
                    <p className="font-pixel text-white text-sm">{area.label}</p>
                    <div className="w-24 bg-gray-700 h-2 rounded-full mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
                <Button 
                  className={`${improvedAreas.includes(area.id) ? 'bg-green-600 opacity-50' : 'bg-blue-600 hover:bg-blue-700'} text-white font-pixel text-xs`}
                  onClick={() => {
                    if (!improvedAreas.includes(area.id)) {
                      setImprovedAreas(prev => [...prev, area.id]);
                    }
                  }}
                  disabled={improvedAreas.includes(area.id)}
                >
                  {improvedAreas.includes(area.id) ? 'Melhorado' : 'Melhorar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {canComplete && (
          <Button 
            onClick={() => onComplete(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel mt-4 pixel-border"
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

export default ReputationDropTask;
