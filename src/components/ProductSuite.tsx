
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const products = [
    {
      id: 'lc',
      title: 'Letter of Credit',
      icon: FileText,
      description: 'Manage import and export letters of credit',
      options: [
        { label: 'Import Letter of Credit', operations: ['Request Issuance', 'Request Amendment', 'Request Cancellation'] },
        { label: 'Export Letter of Credit', operations: ['Approve/Reject Pre-Advised LC', 'Record Amendment Response', 'Request Transfer', 'Request Assignment'] }
      ]
    },
    {
      id: 'guarantee',
      title: 'Bank Guarantee/SBLC',
      icon: Shield,
      description: 'Handle bank guarantees and standby letters of credit',
      options: [
        { label: 'Outward Bank Guarantee/SBLC', operations: ['Request Issuance', 'Request Amendment', 'Request Cancellation', 'Request Reduction/Release'] },
        { label: 'Inward Bank Guarantee/SBLC', operations: ['Record Amendment Response', 'Demand Submission'] }
      ]
    },
    {
      id: 'bills',
      title: 'Bills',
      icon: Banknote,
      description: 'Process trade bills and collections',
      hasFlip: true,
      flipOptions: ['LC Bills', 'Collection Bills'],
      options: [
        { label: 'Bills under Import LC', operations: ['Accept/Refuse', 'Process Bill Settlement'] },
        { label: 'Bills under Export LC', operations: ['Present Bills', 'Resolve Discrepancies', 'Request Finance'] },
        { label: 'Bills under Outward Collection', operations: ['Present Bills', 'Request Finance'] },
        { label: 'Bills under Inward Collection', operations: ['Bill Payment', 'Bill Acceptance/Refusal', 'Present Bills (On behalf of)'] }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping Guarantee',
      icon: Ship,
      description: 'Manage shipping guarantees and delivery orders',
      options: [
        { label: 'Shipping Guarantee', operations: ['Request Issuance'] }
      ]
    },
    {
      id: 'trade-loan',
      title: 'Trade Loan',
      icon: DollarSign,
      description: 'Handle trade financing and loans',
      options: [
        { label: 'Import Loan', operations: ['Request Loan', 'Request Loan Update'] },
        { label: 'Export Loan', operations: ['Request Loan', 'Request Loan Update'] }
      ]
    },
    {
      id: 'e-enablers',
      title: 'e-Enablers',
      icon: Globe,
      description: 'Digital trade enablement solutions',
      hasFlip: true,
      flipOptions: ['e-B/L', 'e-W/R', 'e-COO'],
      options: [
        { label: 'e-Bill of Lading (e-B/L)', operations: [] },
        { label: 'e-Warehouse Receipt (e-W/R)', operations: [] },
        { label: 'e-Certificate of Origin (e-COO)', operations: [] },
        { label: 'e-Bill of Exchange (e-B/E)', operations: [] }
      ]
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
          <div 
            key={product.id} 
            className="relative h-48 perspective-1000"
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                flippedCard === product.id ? 'animate-flip' : ''
              }`}
              onMouseEnter={() => product.hasFlip && setFlippedCard(product.id)}
              onMouseLeave={() => setFlippedCard(null)}
            >
              {/* Front of card */}
              <Card className="absolute inset-0 backface-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <product.icon className="w-12 h-12 text-corporate-peach-500 mb-4" />
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
                <Card className="absolute inset-0 backface-hidden rotate-y-180 cursor-pointer overflow-hidden">
                  <CardContent className="p-6 flex flex-col justify-center h-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
                      {product.id === 'bills' ? 'Bill Options' : 'e-Enabler Options'}
                    </h3>
                    <div className="space-y-3 overflow-auto max-h-[120px]">
                      {product.flipOptions?.map((option) => (
                        <button
                          key={option}
                          onClick={() => product.id === 'bills' ? handleBillsClick(option) : handleEEnablerClick(option)}
                          className="w-full p-2 text-left bg-corporate-peach-100 hover:bg-corporate-peach-200 dark:bg-corporate-peach-500/20 dark:hover:bg-corporate-peach-500/30 rounded-lg transition-colors"
                        >
                          <span className="text-sm font-medium text-corporate-peach-700 dark:text-corporate-peach-300">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Product options and methods overlay */}
            {hoveredCard === product.id && !flippedCard && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 z-10 p-4 overflow-auto animate-fade-in">
                <h4 className="font-semibold text-corporate-peach-700 dark:text-corporate-peach-300 mb-2">{product.title}</h4>
                <div className="space-y-3 text-sm">
                  {product.options.map((option, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-medium">{option.label}</p>
                      <ul className="pl-3 space-y-1">
                        {option.operations.map((operation, opIdx) => (
                          <li key={opIdx} className="flex items-center gap-2">
                            <span>• {operation}</span>
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-xs px-1 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 rounded">M</span>
                              {operation !== "Record Amendment Response" && 
                               operation !== "Approve/Reject Pre-Advised LC" && 
                               operation !== "Request Transfer" &&
                               operation !== "Request Assignment" && 
                               operation !== "Request Reduction/Release" && 
                               operation !== "Resolve Discrepancies" && (
                                <span className="text-xs px-1 bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 rounded">U</span>
                              )}
                              <span className="text-xs px-1 bg-purple-100 dark:bg-purple-800/30 text-purple-800 dark:text-purple-300 rounded">I</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
