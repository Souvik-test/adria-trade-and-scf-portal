
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductSuiteHeaderProps {
  onBack: () => void;
  title?: string;
  subtitle?: string;
}

const ProductSuiteHeader: React.FC<ProductSuiteHeaderProps> = ({ 
  onBack, 
  title = "Product Suite",
  subtitle = "Comprehensive trade finance solutions"
}) => {
  return (
    <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg professional-shadow">
      <Button 
        onClick={onBack}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-primary/10 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5 text-primary" />
      </Button>
      <div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default ProductSuiteHeader;
