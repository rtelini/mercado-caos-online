import React from 'react';
import { Button } from '@/components/ui/button';
import { Package2, Truck, X, MessageSquare, Tag, Monitor, ChartBar, PackageCheck } from 'lucide-react';

interface HowToPlayScreenProps {
  onBack: () => void;
}

const HowToPlayScreen = ({ onBack }: HowToPlayScreenProps) => {
  const tasks = [
    { icon: <Package2 className="text-game-blue" />, description: "Cliente não recebeu o pedido" },
    { icon: <Truck className="text-game-accent" />, description: "Produto com frete errado" },
    { icon: <X className="text-game-danger" />, description: "Venda cancelada por engano" },
    { icon: <MessageSquare className="text-game-primary" />, description: "Responder mensagem urgente" },
    { icon: <Tag className="text-yellow-500" />, description: "Cupom não aplicado" },
    { icon: <Monitor className="text-blue-500" />, description: "Sistema fora do ar! (3 cliques)" },
    { icon: <ChartBar className="text-game-danger" />, description: "Reputação caiu! (urgente)" },
    { icon: <PackageCheck className="text-green-500" />, description: "Pedido duplicado" },
  ];

  return (
    <div className="flex flex-col items-center p-6 min-h-[600px] bg-white">
      <h2 className="text-3xl font-bold mb-6 text-game-dark">Como Jogar</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 max-w-2xl">
        <p className="mb-4">
          Você é um funcionário do MercadoLivre trabalhando no suporte. O caos se instalou no escritório: 
          milhares de chamados, sistemas fora do ar e clientes furiosos!
        </p>
        <p className="mb-4">
          <strong>Objetivo:</strong> Resolver o máximo de tarefas possíveis clicando nelas antes que o tempo acabe
          ou sua barra de estresse estoure.
        </p>
        <p>
          <strong>Como jogar:</strong> Clique nas tarefas que aparecem na tela. Cada tarefa tem um tempo limite.
          Se você demorar ou ignorar muitas tarefas, sua barra de estresse encherá e o jogo acabará.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-center">Tipos de Tarefas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-white rounded-lg shadow text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                {task.icon}
              </div>
              <span className="text-sm">{task.description}</span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onBack} className="mt-auto bg-game-primary hover:bg-game-primary/80">
        Voltar ao Menu
      </Button>
    </div>
  );
};

export default HowToPlayScreen;
