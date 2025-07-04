
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  // Determine if this is the Bills card with 4 options
  const isBillsCard = productId === 'bills' && options.length === 4;
  
  return (
    <Card className="absolute inset-0 backface-hidden rotate-y-180 cursor-pointer hover:shadow-xl transition-all duration-300 border-0 professional-shadow hover:professional-shadow-lg">
      <CardContent className="p-4 flex flex-col justify-center h-full bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg">
        <h3 className="text-sm font-semibold text-primary mb-3 text-center tracking-tight">
          {title}
        </h3>
        <div className={`space-y-2 ${isBillsCard ? 'space-y-1.5' : 'space-y-2'}`}>
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onOptionClick(productId, option)}
              variant="outline"
              size={isBillsCard ? "sm" : "default"}
              className={`w-full justify-center text-center border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 font-medium ${
                isBillsCard ? 'text-xs py-1.5 px-2 h-auto min-h-[28px]' : 'text-sm'
              }`}
            >
              <span className="leading-tight">{option}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardBack;
