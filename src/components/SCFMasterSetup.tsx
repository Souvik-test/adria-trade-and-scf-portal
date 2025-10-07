import React, { useState } from 'react';
import { Database, Package } from 'lucide-react';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';

interface SCFMasterSetupProps {
  onBack: () => void;
}

const SCFMasterSetup: React.FC<SCFMasterSetupProps> = ({ onBack }) => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const masterSetupItems = [
    {
      id: 'product',
      title: 'Product',
      icon: Package,
      description: 'View product configurations and definitions',
      hasFlip: true,
      flipOptions: ['View'] // Only View for Corporates
    },
    {
      id: 'program',
      title: 'Program',
      icon: Database,
      description: 'Manage program setup and configurations',
      hasFlip: true,
      flipOptions: ['View', 'Create', 'Update']
    }
  ];

  const handleCardHover = (itemId: string) => {
    setFlippedCard(itemId);
  };

  const handleCardLeave = () => {
    setFlippedCard(null);
  };

  const handleOptionClick = (itemId: string, option: string) => {
    console.log('Master Setup option clicked:', itemId, option);
    // TODO: Implement modal handlers for Product/Program actions
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <ProductSuiteHeader onBack={onBack} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Master Set-up</h3>
          <p className="text-muted-foreground">Configure and manage products and programs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masterSetupItems.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              icon={item.icon}
              description={item.description}
              hasFlip={item.hasFlip}
              flipOptions={item.flipOptions}
              isFlipped={flippedCard === item.id}
              onMouseEnter={() => handleCardHover(item.id)}
              onMouseLeave={handleCardLeave}
              onOptionClick={handleOptionClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SCFMasterSetup;
