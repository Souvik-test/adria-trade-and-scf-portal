import React from 'react';
import { cn } from '@/lib/utils';

interface ProductSolutionToggleProps {
  selectedSolution: 'conventional' | 'custom';
  onToggle: (solution: 'conventional' | 'custom') => void;
}

const ProductSolutionToggle: React.FC<ProductSolutionToggleProps> = ({
  selectedSolution,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex items-center rounded-lg bg-muted p-1 text-muted-foreground">
        <button
          onClick={() => onToggle('conventional')}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selectedSolution === 'conventional'
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50"
          )}
        >
          Conventional Solutions
        </button>
        <button
          onClick={() => onToggle('custom')}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selectedSolution === 'custom'
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50"
          )}
        >
          Custom Solutions
        </button>
      </div>
    </div>
  );
};

export default ProductSolutionToggle;