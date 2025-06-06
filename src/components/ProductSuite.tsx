
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Banknote, Ship, DollarSign, ArrowLeft, Globe } from 'lucide-react';
import BillsModal from './BillsModal';

interface ProductSuiteProps {
  onBack: () => void;
}

const ProductSuite: React.FC<ProductSuiteProps> = ({ onBack }) => {
  const [showBillsModal, setShowBillsModal] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const products = [
    {
      id: 'lc',
      title: 'Letter of Credit',
      icon: FileText,
      description: 'Manage import and export letters of credit'
    },
    {
      id: 'guarantee',
      title: 'Bank Guarantee/SBLC',
      icon: Shield,
      description: 'Handle bank guarantees and standby letters of credit'
    },
    {
      id: 'bills',
      title: 'Bills',
      icon: Banknote,
      description: 'Process trade bills and collections',
      hasFlip: true,
      flipOptions: ['LC Bills', 'Collection Bills']
    },
    {
      id: 'shipping',
      title: 'Shipping Guarantee',
      icon: Ship,
      description: 'Manage shipping guarantees and delivery orders'
    },
    {
      id: 'trade-loan',
      title: 'Trade Loan',
      icon: DollarSign,
      description: 'Handle trade financing and loans'
    },
    {
      id: 'e-enablers',
      title: 'e-Enablers',
      icon: Globe,
      description: 'Digital trade enablement solutions',
      hasFlip: true,
      flipOptions: ['e-B/L', 'e-Warehouse Receipt (e-W/R)', 'e-Certificate of Origin (e-COO)']
    }
  ];

  const handleBillsClick = (option: string) => {
    if (option === 'LC Bills') {
      setShowBillsModal(true);
    }
  };

  const handleEEnablerClick = (option: string) => {
    console.log('e-Enabler option clicked:', option);
    // Handle e-enabler options here
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Suite</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative h-48 perspective-1000">
            <div 
              className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                flippedCard === product.id ? 'rotate-y-180' : ''
              }`}
              onMouseEnter={() => product.hasFlip && setFlippedCard(product.id)}
              onMouseLeave={() => setFlippedCard(null)}
            >
              {/* Front of card */}
              <Card className="absolute inset-0 backface-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <product.icon className="w-12 h-12 text-corporate-blue mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              {/* Back of card (for Bills and e-Enablers) */}
              {product.hasFlip && (
                <Card className="absolute inset-0 backface-hidden rotate-y-180 cursor-pointer">
                  <CardContent className="p-6 flex flex-col justify-center h-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
                      {product.id === 'bills' ? 'Bill Options' : 'e-Enabler Options'}
                    </h3>
                    <div className="space-y-3">
                      {product.flipOptions?.map((option) => (
                        <button
                          key={option}
                          onClick={() => product.id === 'bills' ? handleBillsClick(option) : handleEEnablerClick(option)}
                          className="w-full p-3 text-left bg-corporate-blue/10 hover:bg-corporate-blue/20 rounded-lg transition-colors"
                        >
                          <span className="text-sm font-medium text-corporate-blue">{option}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>

      {showBillsModal && (
        <BillsModal onClose={() => setShowBillsModal(false)} />
      )}
    </div>
  );
};

export default ProductSuite;
