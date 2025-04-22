
import React, { useState, useEffect, memo } from 'react';
import { TaskType } from './Task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package2, 
  Tag, 
  MessageSquare, 
  Monitor, 
  X, 
  Truck, 
  TrendingDown, 
  PackageCheck,
  Send,
  RefreshCw,
  ZapIcon,
  CheckCircle
} from 'lucide-react';

interface TaskPopupProps {
  taskType: TaskType;
  onComplete: (success: boolean) => void;
}

const TaskPopup = memo(({ taskType, onComplete }: TaskPopupProps) => {
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds to complete the popup task
  const [isOpen, setIsOpen] = useState(true);
  
  // Task-specific states
  // Package missing task
  const [packageDeliveryStep, setPackageDeliveryStep] = useState<'package' | 'customer' | null>(null);
  
  // Coupon task
  const [couponCode, setCouponCode] = useState('DESCONTO10');
  const [discountValue, setDiscountValue] = useState(10);
  
  // Duplicate order task
  const [selectedOrder, setSelectedOrder] = useState<'first' | 'second' | null>(null);
  
  // Message task
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // System down task
  const [clickedButtons, setClickedButtons] = useState<string[]>([]);
  
  // Canceled sale task
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  
  // Shipping task
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  
  // Reputation task
  const [improvedAreas, setImprovedAreas] = useState<string[]>([]);

  useEffect(() => {
    // Set a timer for the task
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleComplete(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleComplete = (success: boolean) => {
    setIsOpen(false);
    onComplete(success);
  };

  const renderTaskContent = () => {
    switch (taskType) {
      case 'package_missing':
        return renderPackageMissingTask();
      case 'coupon_issue':
        return renderCouponIssueTask();
      case 'duplicate_order':
        return renderDuplicateOrderTask();
      case 'urgent_message':
        return renderUrgentMessageTask();
      case 'system_down':
        return renderSystemDownTask();
      case 'canceled_sale':
        return renderCanceledSaleTask();
      case 'wrong_shipping':
        return renderWrongShippingTask();
      case 'reputation_drop':
        return renderReputationDropTask();
      default:
        return <div>Tarefa desconhecida</div>;
    }
  };

  // Package Missing Task UI
  const renderPackageMissingTask = () => (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Abrir Reclamação
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="w-full bg-gray-800 p-3 rounded-lg mb-4 pixel-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-pixel text-white text-xs mb-2">Rastreio: BR45872301</p>
              <p className="font-pixel text-gray-400 text-xs">Última atualização: 7 dias atrás</p>
            </div>
            <div className="bg-red-600 text-white text-xs p-1 rounded font-pixel">
              Sem atualização
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => handleComplete(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-pixel mb-3 pixel-border"
        >
          Abrir Reclamação no sistema
        </Button>
      </div>
      
      <div className="w-full bg-gray-900 h-2 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Coupon Issue Task UI
  const renderCouponIssueTask = () => (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Criar novo cupom
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Tag size={40} className="text-gray-300 mr-2" />
        </div>
        
        <div className="w-full mb-4">
          <label className="block text-gray-300 font-pixel text-xs mb-2">Nome do cupom</label>
          <Input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full p-2 bg-gray-800 border-2 border-gray-600 text-white font-pixel rounded pixel-border placeholder-gray-500"
          />
        </div>
        
        <div className="w-full mb-4">
          <label className="block text-gray-300 font-pixel text-xs mb-2">Valor do desconto: {discountValue}%</label>
          <div className="flex gap-2">
            <Button 
              onClick={() => setDiscountValue(prev => Math.max(5, prev - 5))}
              className="flex-1 bg-gray-700 hover:bg-gray-600 font-pixel"
            >
              -5%
            </Button>
            <Button 
              onClick={() => setDiscountValue(prev => Math.min(50, prev + 5))}
              className="flex-1 bg-gray-700 hover:bg-gray-600 font-pixel"
            >
              +5%
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={() => couponCode.length >= 4 ? handleComplete(true) : null} 
          className="bg-green-600 hover:bg-green-700 text-white font-pixel w-full"
          disabled={couponCode.length < 4}
        >
          Concluir
        </Button>
      </div>
      
      <div className="w-full bg-gray-900 h-2 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Duplicate Order Task UI
  const renderDuplicateOrderTask = () => (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Cancelar pedido duplicado
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center gap-6 mb-4">
          <div 
            className={`p-4 bg-gray-800 rounded-lg cursor-pointer ${selectedOrder === 'first' ? 'border-4 border-red-500' : 'border-4 border-gray-600'} pixel-border`}
            onClick={() => setSelectedOrder('first')}
          >
            <PackageCheck size={48} className="text-gray-300" />
            <span className="block mt-2 font-pixel text-white text-center">Pedido #12345</span>
          </div>
          
          <div 
            className={`p-4 bg-gray-800 rounded-lg cursor-pointer ${selectedOrder === 'second' ? 'border-4 border-red-500' : 'border-4 border-gray-600'} pixel-border`}
            onClick={() => setSelectedOrder('second')}
          >
            <PackageCheck size={48} className="text-gray-300" />
            <span className="block mt-2 font-pixel text-white text-center">Pedido #12346</span>
          </div>
        </div>
        
        <Button 
          onClick={() => selectedOrder ? handleComplete(true) : null} 
          className="bg-red-500 hover:bg-red-600 text-white font-pixel w-full pixel-border"
          disabled={!selectedOrder}
        >
          Cancelar Pedido
        </Button>
      </div>
      
      <div className="w-full bg-gray-900 h-2 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Urgent Message Task UI
  const renderUrgentMessageTask = () => (
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
        <div 
          className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedMessage === 'Seu pedido está a caminho!' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
          onClick={() => {
            setSelectedMessage('Seu pedido está a caminho!');
            setMessageText('Seu pedido está a caminho!');
          }}
        >
          <p className="text-white font-pixel text-xs">Seu pedido está a caminho!</p>
        </div>
        
        <div 
          className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedMessage === 'Estamos verificando seu problema' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
          onClick={() => {
            setSelectedMessage('Estamos verificando seu problema');
            setMessageText('Estamos verificando seu problema');
          }}
        >
          <p className="text-white font-pixel text-xs">Estamos verificando seu problema</p>
        </div>
        
        <div 
          className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedMessage === 'Pedimos desculpas pela falha!' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
          onClick={() => {
            setSelectedMessage('Pedimos desculpas pela falha!');
            setMessageText('Pedimos desculpas pela falha!');
          }}
        >
          <p className="text-white font-pixel text-xs">Pedimos desculpas pela falha!</p>
        </div>
      </div>
      
      <Button 
        onClick={() => selectedMessage ? handleComplete(true) : null}
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

  // System Down Task UI
  const renderSystemDownTask = () => {
    const allButtonsClicked = clickedButtons.length === 3;
    
    return (
      <div className="p-4">
        <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
          Reiniciar Sistema
        </h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="flex justify-between items-center w-full mb-6">
            <Button
              variant="outline"
              className={`p-6 ${clickedButtons.includes('reiniciar') ? 'bg-gray-800 opacity-50' : 'bg-blue-900 animate-pulse'} text-white font-pixel pixel-border`}
              onClick={() => {
                if (!clickedButtons.includes('reiniciar')) {
                  setClickedButtons(prev => [...prev, 'reiniciar']);
                }
              }}
              disabled={clickedButtons.includes('reiniciar')}
            >
              <div className="flex flex-col items-center">
                <RefreshCw size={24} />
                <span className="mt-2">Reiniciar</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={`p-6 ${clickedButtons.includes('testar') ? 'bg-gray-800 opacity-50' : 'bg-green-900 animate-pulse'} text-white font-pixel pixel-border`}
              onClick={() => {
                if (!clickedButtons.includes('testar')) {
                  setClickedButtons(prev => [...prev, 'testar']);
                }
              }}
              disabled={clickedButtons.includes('testar')}
            >
              <div className="flex flex-col items-center">
                <CheckCircle size={24} />
                <span className="mt-2">Testar</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className={`p-6 ${clickedButtons.includes('conectar') ? 'bg-gray-800 opacity-50' : 'bg-purple-900 animate-pulse'} text-white font-pixel pixel-border`}
              onClick={() => {
                if (!clickedButtons.includes('conectar')) {
                  setClickedButtons(prev => [...prev, 'conectar']);
                }
              }}
              disabled={clickedButtons.includes('conectar')}
            >
              <div className="flex flex-col items-center">
                <ZapIcon size={24} />
                <span className="mt-2">Conectar</span>
              </div>
            </Button>
          </div>
          
          {allButtonsClicked && (
            <Button
              onClick={() => handleComplete(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel pixel-border"
            >
              Concluir
            </Button>
          )}
        </div>
        
        <div className="w-full bg-gray-900 h-2 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Canceled Sale Task UI
  const renderCanceledSaleTask = () => (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Reativar venda
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gray-800 p-3 rounded-lg mb-4 w-full pixel-border">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <h3 className="font-pixel text-white text-sm">Smartphone XYZ</h3>
              <p className="font-pixel text-gray-400 text-xs">R$ 1.299,00</p>
              <p className="font-pixel text-red-400 text-xs">VENDA CANCELADA</p>
            </div>
          </div>
        </div>
        
        <div className="w-full mb-4">
          <label className="block text-gray-300 font-pixel text-xs mb-2">Motivo:</label>
          <div className="flex flex-col gap-2">
            <div 
              className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedReason === 'cancelamento_indevido' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
              onClick={() => setSelectedReason('cancelamento_indevido')}
            >
              <p className="text-white font-pixel text-xs">Cancelamento indevido</p>
            </div>
            
            <div 
              className={`p-2 bg-gray-800 rounded cursor-pointer ${selectedReason === 'erro_sistema' ? 'border-2 border-green-500' : 'border-2 border-gray-600'}`}
              onClick={() => setSelectedReason('erro_sistema')}
            >
              <p className="text-white font-pixel text-xs">Erro do sistema</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => selectedReason ? handleComplete(true) : null}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel pixel-border"
          disabled={!selectedReason}
        >
          Restaurar venda
        </Button>
      </div>
      
      <div className="w-full bg-gray-900 h-2 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Wrong Shipping Task UI
  const renderWrongShippingTask = () => (
    <div className="p-4">
      <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
        Corrigir frete
      </h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col gap-3 w-full">
          <div 
            className={`bg-gray-800 p-3 rounded-lg cursor-pointer pixel-border flex items-center justify-between ${selectedShipping === 'economico' ? 'border-green-500 border-2' : ''}`}
            onClick={() => setSelectedShipping('economico')}
          >
            <div className="flex items-center">
              <Truck className="mr-3 text-gray-300" />
              <div>
                <p className="font-pixel text-white text-sm">Econômico</p>
                <p className="font-pixel text-gray-400 text-xs">7-10 dias úteis</p>
              </div>
            </div>
            <div className="font-pixel text-white">R$ 9,90</div>
          </div>
          
          <div 
            className={`bg-gray-800 p-3 rounded-lg cursor-pointer pixel-border flex items-center justify-between ${selectedShipping === 'rapido' ? 'border-green-500 border-2' : ''}`}
            onClick={() => setSelectedShipping('rapido')}
          >
            <div className="flex items-center">
              <Truck className="mr-3 text-gray-300" />
              <div>
                <p className="font-pixel text-white text-sm">Rápido ← Correto</p>
                <p className="font-pixel text-gray-400 text-xs">3-5 dias úteis</p>
              </div>
            </div>
            <div className="font-pixel text-white">R$ 19,90</div>
          </div>
          
          <div 
            className={`bg-gray-800 p-3 rounded-lg cursor-pointer pixel-border flex items-center justify-between ${selectedShipping === 'expresso' ? 'border-green-500 border-2' : ''}`}
            onClick={() => setSelectedShipping('expresso')}
          >
            <div className="flex items-center">
              <Truck className="mr-3 text-gray-300" />
              <div>
                <p className="font-pixel text-white text-sm">Expresso</p>
                <p className="font-pixel text-gray-400 text-xs">1-2 dias úteis</p>
              </div>
            </div>
            <div className="font-pixel text-white">R$ 29,90</div>
          </div>
        </div>
        
        <Button 
          onClick={() => selectedShipping === 'rapido' ? handleComplete(true) : handleComplete(false)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel mt-4 pixel-border"
          disabled={!selectedShipping}
        >
          Concluir
        </Button>
      </div>
      
      <div className="w-full bg-gray-900 h-2 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Reputation Drop Task UI
  const renderReputationDropTask = () => {
    const canComplete = improvedAreas.length >= 2;
    
    return (
      <div className="p-4">
        <h2 className="text-center font-pixel text-xl mb-4 text-gray-200 arcade-text-shadow">
          Ajustar indicadores
        </h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="flex flex-col gap-3 w-full">
            <div className="bg-gray-800 p-3 rounded-lg pixel-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingDown className="mr-3 text-red-500" />
                  <div>
                    <p className="font-pixel text-white text-sm">Prazo de entrega</p>
                    <div className="w-24 bg-gray-700 h-2 rounded-full mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
                <Button 
                  className={`${improvedAreas.includes('prazo') ? 'bg-green-600 opacity-50' : 'bg-blue-600 hover:bg-blue-700'} text-white font-pixel text-xs`}
                  onClick={() => {
                    if (!improvedAreas.includes('prazo')) {
                      setImprovedAreas(prev => [...prev, 'prazo']);
                    }
                  }}
                  disabled={improvedAreas.includes('prazo')}
                >
                  {improvedAreas.includes('prazo') ? 'Melhorado' : 'Melhorar'}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg pixel-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingDown className="mr-3 text-red-500" />
                  <div>
                    <p className="font-pixel text-white text-sm">Qualidade</p>
                    <div className="w-24 bg-gray-700 h-2 rounded-full mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
                <Button 
                  className={`${improvedAreas.includes('qualidade') ? 'bg-green-600 opacity-50' : 'bg-blue-600 hover:bg-blue-700'} text-white font-pixel text-xs`}
                  onClick={() => {
                    if (!improvedAreas.includes('qualidade')) {
                      setImprovedAreas(prev => [...prev, 'qualidade']);
                    }
                  }}
                  disabled={improvedAreas.includes('qualidade')}
                >
                  {improvedAreas.includes('qualidade') ? 'Melhorado' : 'Melhorar'}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg pixel-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingDown className="mr-3 text-red-500" />
                  <div>
                    <p className="font-pixel text-white text-sm">Atendimento</p>
                    <div className="w-24 bg-gray-700 h-2 rounded-full mt-1">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
                <Button 
                  className={`${improvedAreas.includes('atendimento') ? 'bg-green-600 opacity-50' : 'bg-blue-600 hover:bg-blue-700'} text-white font-pixel text-xs`}
                  onClick={() => {
                    if (!improvedAreas.includes('atendimento')) {
                      setImprovedAreas(prev => [...prev, 'atendimento']);
                    }
                  }}
                  disabled={improvedAreas.includes('atendimento')}
                >
                  {improvedAreas.includes('atendimento') ? 'Melhorado' : 'Melhorar'}
                </Button>
              </div>
            </div>
          </div>
          
          {canComplete && (
            <Button 
              onClick={() => handleComplete(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel mt-4 pixel-border"
            >
              Concluir
            </Button>
          )}
        </div>
        
        <div className="w-full bg-gray-900 h-2 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-gray-900 border-4 border-gray-700 rounded-lg scanlines crt-effect pixel-border shadow-2xl">
      {renderTaskContent()}
    </div>
  );
});

TaskPopup.displayName = 'TaskPopup';

export default TaskPopup;
