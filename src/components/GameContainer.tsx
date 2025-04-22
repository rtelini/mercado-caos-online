
import React, { useState } from 'react';
import StartMenu from './StartMenu';
import GameScreen from './GameScreen';
import GameOverScreen from './GameOverScreen';
import HowToPlayScreen from './HowToPlayScreen';
import PauseScreen from './PauseScreen';

export type GameState = 'start' | 'game' | 'pause' | 'gameover' | 'howtoplay';

const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);

  const handleStartGame = () => {
    setScore(0);
    setGameState('game');
  };

  const handlePauseGame = () => {
    setGameState('pause');
  };

  const handleResumeGame = () => {
    setGameState('game');
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState('gameover');
  };

  const handleBackToMenu = () => {
    setGameState('start');
  };

  const handleHowToPlay = () => {
    setGameState('howtoplay');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {gameState === 'start' && (
          <StartMenu onStartGame={handleStartGame} onHowToPlay={handleHowToPlay} />
        )}
        {gameState === 'game' && (
          <GameScreen onGameOver={handleGameOver} onPause={handlePauseGame} />
        )}
        {gameState === 'pause' && (
          <PauseScreen onResume={handleResumeGame} onQuit={handleBackToMenu} />
        )}
        {gameState === 'gameover' && (
          <GameOverScreen score={score} onRestart={handleStartGame} onBackToMenu={handleBackToMenu} />
        )}
        {gameState === 'howtoplay' && (
          <HowToPlayScreen onBack={handleBackToMenu} />
        )}
      </div>
    </div>
  );
};

export default GameContainer;
