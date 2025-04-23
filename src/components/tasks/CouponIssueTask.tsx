
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

interface CouponIssueTaskProps {
  onComplete: (success: boolean) => void;
  timeLeft: number;
}

const CouponIssueTask = ({ onComplete, timeLeft }: CouponIssueTaskProps) => {
  const [couponCode, setCouponCode] = useState('DESCONTO10');
  const [discountValue, setDiscountValue] = useState(10);

  return (
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
          onClick={() => couponCode.length >= 4 ? onComplete(true) : null} 
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
};

export default CouponIssueTask;
