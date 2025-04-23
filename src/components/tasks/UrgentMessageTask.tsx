
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface UrgentMessageTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const UrgentMessageTask = ({ onComplete, timeLeft }: UrgentMessageTaskProps) => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Responder cliente
      </h2>
      
      <div className="bg-gray-800 p-3 rounded-lg mb-4 pixel-border">
        <div className="flex items-start mb-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full mr-2 flex items-center justify-center">
            <span>👤</span>
          </div>
          <div className="bg-gray-700 rounded-lg p-2 text-white font-pixel text-xs">
            Olá, meu produto não chegou ainda! Preciso dele com urgência!
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        {['Seu pedido está a caminho!', 'Estamos verificando seu problema', 'Pedimos desculpas pela falha!'].map((message) => (
          <div 
            key={message}
            className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedMessage === message ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
            onClick={() => setSelectedMessage(message)}
          >
            <p className="text-white font-pixel text-xs">{message}</p>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={() => selectedMessage ? onComplete(true) : null}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-pixel pixel-border flex items-center justify-center gap-2"
        disabled={!selectedMessage}
      >
        <span>Enviar</span>
        <Send size={16} />
      </Button>
      
      <div className="w-full bg-gray-900 h-2 rounded-full mt-4">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default UrgentMessageTask;
