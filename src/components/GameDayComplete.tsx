
import React from 'react';

interface GameDayCompleteProps {
  currentDay: number;
  dayScore: number;
  score: number;
}

const GameDayComplete: React.FC<GameDayCompleteProps> = ({
  currentDay,
  dayScore,
  score
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-3">Dia {currentDay} Concluído!</h2>
        <p className="text-xl mb-4">Pontuação: {dayScore}</p>
        {score < 0 ? (
          <p className="text-red-500 font-bold">Fim de Jogo - Pontuação Negativa!</p>
        ) : (
          <p className="text-blue-500">Preparando próximo dia...</p>
        )}
      </div>
    </div>
  );
};

export default GameDayComplete;
