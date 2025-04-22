import React from 'react';
import { Button } from '@/components/ui/button';
interface StartMenuProps {
  onStartGame: () => void;
  onHowToPlay: () => void;
}
const StartMenu = ({
  onStartGame,
  onHowToPlay
}: StartMenuProps) => {
  return <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-gradient-to-b from-game-primary/10 to-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-game-dark leading-tight">
        Caos no Escritório
        <span className="block text-game-primary text-[game-neon-yellow]">MercadoLivre Edition</span>
      </h1>
      
      <div className="my-8">
        <img alt="Office Chaos" className="rounded-lg shadow-lg max-w-full h-auto" src="https://sdmntprwestus.oaiusercontent.com/files/00000000-ccfc-6230-b6e6-e1ea67c38a4e/raw?se=2025-04-22T20%3A25%3A32Z&sp=r&sv=2024-08-04&sr=b&scid=bd1494d2-9cc1-57eb-a87e-5e5265d7cff2&skoid=f0c3f613-0f9b-4a8a-a29a-c1a910343ad7&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-22T10%3A42%3A19Z&ske=2025-04-23T10%3A42%3A19Z&sks=b&skv=2024-08-04&sig=qbnm1YuU41jWSuxT9t4UiMcY1iDTR6I7JZlZ%2BedJbcU%3D" />
      </div>
      
      <div className="flex flex-col gap-4 w-64">
        <Button onClick={onStartGame} className="py-6 text-lg bg-[#ffeb00] text-zinc-950">
          Iniciar Caos
        </Button>
        <Button onClick={onHowToPlay} variant="outline" className="border-game-primary bg-[#ffee00] text-zinc-950">
          Como Jogar
        </Button>
      </div>
    </div>;
};
export default StartMenu;