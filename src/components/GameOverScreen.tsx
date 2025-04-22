
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Frown, Skull } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameOverScreen = ({ score, onRestart, onBackToMenu }: GameOverScreenProps) => {
  // Get the message based on score
  const getMessage = () => {
    if (score <= 10) {
      return {
        text: "Você foi demitido antes do café.",
        icon: <Skull className="text-red-500 w-12 h-12" />
      };
    } else if (score <= 25) {
      return {
        text: "Você sobreviveu, mas perdeu metade do cabelo.",
        icon: <Frown className="text-yellow-500 w-12 h-12" />
      };
    } else {
      return {
        text: "Você é o herói do E-commerce. Promoção garantida!",
        icon: <Sparkles className="text-yellow-400 w-12 h-12" />
      };
    }
  };

  const message = getMessage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 bg-gradient-to-b from-game-pink to-white">
      <h2 className="text-4xl font-bold mb-4 text-game-danger">O Caos Te Venceu! 💥</h2>
      
      <div className="my-8 flex flex-col items-center">
        {message.icon}
        <p className="text-2xl mt-4 text-center font-bold">{message.text}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
        <p className="text-xl mb-2">Sua pontuação final:</p>
        <p className="text-5xl font-bold text-game-primary">{score}</p>
        <p className="text-sm mt-2 text-gray-500">Tarefas resolvidas</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onRestart} 
          className="bg-game-primary hover:bg-game-primary/80 text-white"
        >
          Tentar de Novo
        </Button>
        <Button 
          onClick={onBackToMenu} 
          variant="outline"
          className="border-game-primary text-game-primary hover:bg-game-primary/10"
        >
          Voltar ao Menu
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
