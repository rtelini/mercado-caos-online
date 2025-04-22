
import React from 'react';
import { Button } from '@/components/ui/button';

interface StartMenuProps {
  onStartGame: () => void;
  onHowToPlay: () => void;
}

const StartMenu = ({ onStartGame, onHowToPlay }: StartMenuProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-gradient-to-b from-game-primary/10 to-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-game-dark leading-tight">
        Caos no Escritório
        <span className="block text-game-accent">MercadoLivre Edition</span>
      </h1>
      
      <div className="my-8">
        <img 
          src="https://via.placeholder.com/300x200?text=Office+Chaos" 
          alt="Office Chaos" 
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>
      
      <div className="flex flex-col gap-4 w-64">
        <Button 
          onClick={onStartGame} 
          className="bg-game-primary hover:bg-game-primary/80 text-white py-6 text-lg"
        >
          Iniciar Caos
        </Button>
        <Button 
          onClick={onHowToPlay} 
          variant="outline" 
          className="border-game-primary text-game-primary hover:bg-game-primary/10"
        >
          Como Jogar
        </Button>
      </div>
    </div>
  );
};

export default StartMenu;
