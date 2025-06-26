
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import ProductCardBack from './ProductCardBack';

interface ProductCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  hasFlip?: boolean;
  flipOptions?: string[];
  isFlipped: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOptionClick: (productId: string, option: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  icon: Icon,
  description,
  hasFlip = false,
  flipOptions = [],
  isFlipped,
  onMouseEnter,
  onMouseLeave,
  onOptionClick
}) => {
  return (
    <div className="relative h-56 perspective-1000 group">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onMouseEnter={hasFlip ? onMouseEnter : undefined}
        onMouseLeave={hasFlip ? onMouseLeave : undefined}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 backface-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-0 professional-shadow hover:professional-shadow-lg group-hover:scale-105">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/80 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 text-center tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {description}
            </p>
          </CardContent>
        </Card>

        {/* Back of card (for products with flip options) */}
        {hasFlip && (
          <ProductCardBack
            productId={id}
            title={title}
            options={flipOptions}
            onOptionClick={onOptionClick}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
