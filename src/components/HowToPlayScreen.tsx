
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package2, Truck, X, MessageSquare, Tag, Monitor, ChartBar, PackageCheck } from 'lucide-react';

interface HowToPlayScreenProps {
  onBack: () => void;
}

const HowToPlayScreen = ({ onBack }: HowToPlayScreenProps) => {
  const tasks = [
    { icon: <Package2 className="text-game-blue pixel-effect" />, description: "Cliente não recebeu o pedido" },
    { icon: <Truck className="text-game-accent pixel-effect" />, description: "Produto com frete errado" },
    { icon: <X className="text-game-danger pixel-effect" />, description: "Venda cancelada por engano" },
    { icon: <MessageSquare className="text-game-primary pixel-effect" />, description: "Responder mensagem urgente" },
    { icon: <Tag className="text-yellow-500 pixel-effect" />, description: "Cupom não aplicado" },
    { icon: <Monitor className="text-blue-500 pixel-effect" />, description: "Sistema fora do ar! (3 cliques)" },
    { icon: <ChartBar className="text-game-danger pixel-effect" />, description: "Reputação caiu! (urgente)" },
    { icon: <PackageCheck className="text-green-500 pixel-effect" />, description: "Pedido duplicado" },
  ];

  return (
    <div className="flex flex-col items-center p-6 min-h-[600px] bg-gray-900 text-white scanlines crt-effect">
      <div className="arcade-border w-full h-full p-6">
        <h2 className="text-3xl font-pixel mb-6 text-game-primary arcade-text-shadow">Como Jogar</h2>
        
        <div className="bg-gray-800 p-4 rounded-lg mb-6 max-w-2xl pixel-border">
          <p className="mb-4 font-pixel text-sm">
            Você é um funcionário do MercadoLivre trabalhando no suporte. O caos se instalou no escritório: 
            milhares de chamados, sistemas fora do ar e clientes furiosos!
          </p>
          <p className="mb-4 font-pixel text-sm">
            <strong className="text-game-accent">Objetivo:</strong> Resolver o máximo de tarefas possíveis clicando nelas antes que o tempo acabe
            ou sua barra de estresse estoure.
          </p>
          <p className="font-pixel text-sm">
            <strong className="text-game-accent">Como jogar:</strong> Clique nas tarefas que aparecem na tela. Cada tarefa tem um tempo limite.
            Se você demorar ou ignorar muitas tarefas, sua barra de estresse encherá e o jogo acabará.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-pixel mb-2 text-center text-game-accent arcade-text-shadow">Tipos de Tarefas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tasks.map((task, index) => (
              <div key={index} className="flex flex-col items-center p-3 bg-gray-800 rounded-lg pixel-border text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  {task.icon}
                </div>
                <span className="text-xs font-pixel">{task.description}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={onBack} className="mt-auto bg-game-primary hover:bg-game-primary/80 font-pixel pixel-border">
          Voltar ao Menu
        </Button>
      </div>
    </div>
  );
};

export default HowToPlayScreen;
