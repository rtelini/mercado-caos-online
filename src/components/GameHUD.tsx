
import React from "react";
import { Button } from "@/components/ui/button";
import { PauseIcon } from "lucide-react";

interface GameHUDProps {
  currentDay: number;
  maxDays: number;
  gameTime: number;
  chaosMode: boolean;
  score: number;
  onPause: () => void;
  formatTime: (seconds: number) => string;
}

const GameHUD: React.FC<GameHUDProps> = ({
  currentDay,
  maxDays,
  gameTime,
  chaosMode,
  score,
  onPause,
  formatTime
}) => (
  <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div>
        <span className="text-sm font-medium mr-1 text-gray-200">Dia:</span>
        <span className="text-lg font-bold text-gray-100">{currentDay}/{maxDays}</span>
      </div>
      <div>
        <span className="text-sm font-medium mr-1 text-gray-200">Tempo:</span>
        <span className="text-lg font-bold text-gray-100">{formatTime(gameTime)}</span>
        {chaosMode && (
          <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">MODO CAOS</span>
        )}
      </div>
      <div>
        <span className="text-sm font-medium mr-1 text-gray-200">Pontos:</span>
        <span className="text-lg font-bold text-gray-100">{score}</span>
      </div>
    </div>
    <Button variant="ghost" size="sm" onClick={onPause} className="text-gray-300 hover:text-gray-100">
      <PauseIcon size={20} />
    </Button>
  </div>
);

export default GameHUD;
