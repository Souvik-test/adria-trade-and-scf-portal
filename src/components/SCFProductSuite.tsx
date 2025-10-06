import React, { useState } from 'react';
import { TrendingUp, Package, Receipt, Users, FileCheck, ArrowLeftRight } from 'lucide-react';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';

interface SCFProductSuiteProps {
  onBack: () => void;
}

const SCFProductSuite: React.FC<SCFProductSuiteProps> = ({ onBack }) => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const scfProducts = [
    {
      id: 'payables-finance',
      title: 'Payables Finance',
      icon: Receipt,
      description: 'Optimize working capital through early payment programs',
      hasFlip: true,
      flipOptions: ['Approved Payables Finance', 'Dynamic Discounting', 'Reverse Factoring']
    },
    {
      id: 'receivables-finance',
      title: 'Receivables Finance',
      icon: TrendingUp,
      description: 'Accelerate cash flow by financing outstanding invoices',
      hasFlip: true,
      flipOptions: ['Invoice Discounting', 'Factoring', 'Invoice Purchase']
    },
    {
      id: 'inventory-finance',
      title: 'Inventory Finance',
      icon: Package,
      description: 'Finance inventory and goods in transit',
      hasFlip: true,
      flipOptions: ['Warehouse Receipt Finance', 'Distributor Finance', 'Dealer Finance']
    },
    {
      id: 'po-finance',
      title: 'Purchase Order Finance',
      icon: FileCheck,
      description: 'Finance purchase orders to fulfill customer orders',
      hasFlip: true,
      flipOptions: ['Pre-shipment Finance', 'Post-shipment Finance']
    },
    {
      id: 'supplier-finance',
      title: 'Supplier Finance Programs',
      icon: Users,
      description: 'Comprehensive supplier financing solutions',
      hasFlip: true,
      flipOptions: ['Supplier Onboarding', 'Program Management', 'Supplier Portal']
    },
    {
      id: 'trade-settlement',
      title: 'Trade Settlement',
      icon: ArrowLeftRight,
      description: 'Efficient payment and settlement solutions',
      hasFlip: true,
      flipOptions: ['Payment Automation', 'Settlement Tracking', 'Reconciliation']
    }
  ];

  const handleCardHover = (productId: string) => {
    setFlippedCard(productId);
  };

  const handleCardLeave = () => {
    setFlippedCard(null);
  };

  const handleOptionClick = (productId: string, option: string) => {
    console.log('SCF Product option clicked:', productId, option);
    // TODO: Implement modal handlers for SCF products
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <ProductSuiteHeader onBack={onBack} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Supply Chain Finance Solutions</h3>
          <p className="text-muted-foreground">Comprehensive financing solutions to optimize your supply chain working capital</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scfProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              icon={product.icon}
              description={product.description}
              hasFlip={product.hasFlip}
              flipOptions={product.flipOptions}
              isFlipped={flippedCard === product.id}
              onMouseEnter={() => handleCardHover(product.id)}
              onMouseLeave={handleCardLeave}
              onOptionClick={handleOptionClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SCFProductSuite;
