
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
    <Card className="absolute inset-0 backface-hidden rotate-y-180 cursor-pointer border-0 shadow-xl">
      <CardContent className="p-6 flex flex-col justify-center h-full bg-gradient-to-br from-background to-muted/30">
        <h3 className="text-lg font-semibold text-foreground mb-6 text-center tracking-tight">
          {getOptionsTitle(productId)}
        </h3>
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={option}
              onClick={() => onOptionClick(productId, option)}
              className={`w-full p-4 text-left rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md border-2 ${
                index % 2 === 0 
                  ? 'bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/50' 
                  : 'bg-accent/10 hover:bg-accent/20 border-accent/30 hover:border-accent/50'
              }`}
            >
              <span className="text-sm font-medium text-foreground block">
                {option}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardBack;
