
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardBackProps {
  productId: string;
  title: string;
  options: string[];
  onOptionClick: (productId: string, option: string) => void;
}

const ProductCardBack: React.FC<ProductCardBackProps> = ({
  productId,
  title,
  options,
  onOptionClick
}) => {
  const getOptionsTitle = (id: string) => {
    switch (id) {
      case 'lc': return 'LC Options';
      case 'bills': return 'Bills Options';
      case 'underlying-docs': return 'Instrument Options';
      default: return 'e-Enabler Options';
    }
  };

  return (
    <Card className="absolute inset-0 backface-hidden rotate-y-180 cursor-pointer">
      <CardContent className="p-6 flex flex-col justify-center h-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
          {getOptionsTitle(productId)}
        </h3>
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onOptionClick(productId, option)}
              className="w-full p-3 text-left bg-corporate-blue/10 hover:bg-corporate-blue/20 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-corporate-blue">{option}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardBack;
