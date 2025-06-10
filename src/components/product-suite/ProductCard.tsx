
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
    <div className="relative h-48 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onMouseEnter={hasFlip ? onMouseEnter : undefined}
        onMouseLeave={hasFlip ? onMouseLeave : undefined}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 backface-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <Icon className="w-12 h-12 text-corporate-blue mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
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
