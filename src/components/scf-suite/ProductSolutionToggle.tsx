import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductSolutionToggleProps {
  selectedSolution: 'conventional' | 'custom';
  onToggle: (solution: 'conventional' | 'custom') => void;
}

const ProductSolutionToggle: React.FC<ProductSolutionToggleProps> = ({
  selectedSolution,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <Button
        variant={selectedSolution === 'conventional' ? 'default' : 'outline'}
        onClick={() => onToggle('conventional')}
        className="min-w-[180px]"
      >
        Conventional Solutions
      </Button>
      <Button
        variant={selectedSolution === 'custom' ? 'default' : 'outline'}
        onClick={() => onToggle('custom')}
        className="min-w-[180px]"
      >
        Custom Solutions
      </Button>
    </div>
  );
};

export default ProductSolutionToggle;