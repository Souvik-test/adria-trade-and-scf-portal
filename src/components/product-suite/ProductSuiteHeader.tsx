
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProductSuiteHeaderProps {
  onBack: () => void;
}

const ProductSuiteHeader: React.FC<ProductSuiteHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button 
        onClick={onBack}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Suite</h2>
    </div>
  );
};

export default ProductSuiteHeader;
