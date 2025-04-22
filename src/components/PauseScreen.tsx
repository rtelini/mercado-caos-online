
import React from 'react';
import { Button } from '@/components/ui/button';

interface PauseScreenProps {
  onResume: () => void;
  onQuit: () => void;
}

const PauseScreen = ({ onResume, onQuit }: PauseScreenProps) => {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-game-dark">Jogo Pausado</h2>
        
        <p className="text-gray-600 mb-8">
          O caos do escritório está em pausa! Respire fundo, mas não demore muito. Os chamados estão se acumulando...
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onResume} 
            className="bg-game-primary hover:bg-game-primary/80 text-white"
          >
            Continuar
          </Button>
          <Button 
            onClick={onQuit} 
            variant="outline"
            className="border-game-primary text-game-primary hover:bg-game-primary/10"
          >
            Sair do Jogo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
