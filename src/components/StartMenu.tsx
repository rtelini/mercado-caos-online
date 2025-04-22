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
        <span className="block text-game-accent">MercadoLivre Edition</span>
      </h1>
      
      <div className="my-8">
        <img alt="Office Chaos" className="rounded-lg shadow-lg max-w-full h-auto" src="https://sdmntprwestus.oaiusercontent.com/files/00000000-ccfc-6230-b6e6-e1ea67c38a4e/raw?se=2025-04-22T19%3A12%3A39Z&sp=r&sv=2024-08-04&sr=b&scid=b5a38154-77b6-5b6d-b593-395d6884fdc7&skoid=51916beb-8d6a-49b8-8b29-ca48ed86557e&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-22T04%3A30%3A18Z&ske=2025-04-23T04%3A30%3A18Z&sks=b&skv=2024-08-04&sig=R5YoToniGg/PEFh6Z8AVlHkORFGp17EhoQiUqK3zhFM%3D" />
      </div>
      
      <div className="flex flex-col gap-4 w-64">
        <Button onClick={onStartGame} className="bg-game-primary hover:bg-game-primary/80 text-white py-6 text-lg">
          Iniciar Caos
        </Button>
        <Button onClick={onHowToPlay} variant="outline" className="border-game-primary text-game-primary hover:bg-game-primary/10">
          Como Jogar
        </Button>
      </div>
    </div>;
};
export default StartMenu;