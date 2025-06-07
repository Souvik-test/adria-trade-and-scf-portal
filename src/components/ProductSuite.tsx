import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Banknote, Ship, DollarSign, ArrowLeft, Globe, ShoppingCart } from 'lucide-react';
import BillsModal from './BillsModal';
import BillsForm from './BillsForm';
import ProductOptionsModal from './ProductOptionsModal';
import { Button } from '@/components/ui/button';

interface ProductSuiteProps {
  onBack: () => void;
}

const ProductSuite: React.FC<ProductSuiteProps> = ({ onBack }) => {
  const [showBillsModal, setShowBillsModal] = useState(false);
  const [showBillsForm, setShowBillsForm] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const products = [
    {
      id: 'lc',
      title: 'Letter of Credit',
      icon: FileText,
      description: 'Manage import and export letters of credit',
      flipOptions: ['Import Letter of Credit', 'Export Letter of Credit'],
      optionDetails: {
        'Import Letter of Credit': {
          options: ['Request Issuance', 'Request Amendments', 'Request Cancellation'],
          methods: {
            'Request Issuance': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Amendments': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Cancellation': ['Manual', 'Upload', 'Contextual Assistance']
          }
        },
        'Export Letter of Credit': {
          options: ['Approve/Reject Pre-Advised LC', 'Record Amendment Response', 'Request Transfer', 'Request Assignment'],
          methods: {
            'Approve/Reject Pre-Advised LC': ['Manual', 'Contextual Assistance'],
            'Record Amendment Response': ['Manual', 'Contextual Assistance'],
            'Request Transfer': ['Manual', 'Contextual Assistance'],
            'Request Assignment': ['Manual', 'Contextual Assistance']
          }
        }
      }
    },
    {
      id: 'guarantee',
      title: 'Bank Guarantee/SBLC',
      icon: Shield,
      description: 'Handle bank guarantees and standby letters of credit',
      flipOptions: ['Outward Bank Guarantee/SBLC', 'Inward Bank Guarantee/SBLC'],
      optionDetails: {
        'Outward Bank Guarantee/SBLC': {
          options: ['Request Issuance', 'Request Amendments', 'Request Cancellation', 'Request Reduction/Release'],
          methods: {
            'Request Issuance': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Amendments': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Cancellation': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Reduction/Release': ['Manual', 'Contextual Assistance']
          }
        },
        'Inward Bank Guarantee/SBLC': {
          options: ['Record Amendment Response', 'Demand Submission'],
          methods: {
            'Record Amendment Response': ['Manual', 'Contextual Assistance'],
            'Demand Submission': ['Manual', 'Upload', 'Contextual Assistance']
          }
        }
      }
    },
    {
      id: 'bills',
      title: 'Bills',
      icon: Banknote,
      description: 'Process trade bills and collections',
      flipOptions: ['LC Bills', 'Collection Bills'],
      optionDetails: {
        'LC Bills': {
          options: ['Import LC Bills', 'Export LC Bills'],
          methods: {
            'Import LC Bills': ['Accept/Refuse', 'Process Bill Settlement'],
            'Export LC Bills': ['Pre-Check Bills', 'Resolve Discrepancies', 'Request Finance']
          },
          subMethods: {
            'Accept/Refuse': ['Manual', 'Contextual Assistance'],
            'Process Bill Settlement': ['Manual', 'Contextual Assistance'],
            'Pre-Check Bills': ['Manual', 'Upload'],
            'Resolve Discrepancies': ['Manual'],
            'Request Finance': ['Manual', 'Contextual Assistance']
          }
        },
        'Collection Bills': {
          options: ['Outward Documentary Collection', 'Inward Documentary Collection'],
          methods: {
            'Outward Documentary Collection': ['Present Bills', 'Request Finance'],
            'Inward Documentary Collection': ['Present Bills(On Behalf Of)', 'Bill Payment', 'Bill Acceptance/Refusal']
          },
          subMethods: {
            'Present Bills': ['Manual', 'Upload'],
            'Request Finance': ['Manual', 'Contextual Assistance'],
            'Present Bills(On Behalf Of)': ['Manual', 'Upload'],
            'Bill Payment': ['Manual', 'Contextual Assistance'],
            'Bill Acceptance/Refusal': ['Manual', 'Contextual Assistance']
          }
        }
      }
    },
    {
      id: 'shipping',
      title: 'Shipping Guarantee',
      icon: Ship,
      description: 'Manage shipping guarantees and delivery orders',
      flipOptions: ['Request Issuance', 'Request Link/Delink'],
      optionDetails: {
        'Request Issuance': {
          options: [],
          methods: {
            'Request Issuance': ['Manual', 'Upload', 'Contextual Assistance']
          }
        },
        'Request Link/Delink': {
          options: [],
          methods: {
            'Request Link/Delink': ['Manual', 'Contextual Assistance']
          }
        }
      }
    },
    {
      id: 'trade-loan',
      title: 'Trade Loan',
      icon: DollarSign,
      description: 'Handle trade financing and loans',
      flipOptions: ['Import Loan', 'Export Loan'],
      optionDetails: {
        'Import Loan': {
          options: ['Request Loan', 'Request Loan Update'],
          methods: {
            'Request Loan': ['Manual', 'Upload'],
            'Request Loan Update': ['Manual', 'Upload']
          }
        },
        'Export Loan': {
          options: ['Request Loan', 'Request Loan Update'],
          methods: {
            'Request Loan': ['Manual', 'Upload'],
            'Request Loan Update': ['Manual', 'Upload']
          }
        }
      }
    },
    {
      id: 'e-enablers',
      title: 'e-Enablers',
      icon: Globe,
      description: 'Digital trade enablement solutions',
      flipOptions: ['e-Bill of Lading (e-B/L)', 'e-Warehouse Receipt (e-W/R)', 'e-Certificate of Origin (e-COO)', 'e-Bill of Exchange (e-B/E)'],
      optionDetails: {}
    },
    {
      id: 'purchase-order',
      title: 'Purchase Order and Invoices',
      icon: ShoppingCart,
      description: 'Manage purchase orders and invoices',
      flipOptions: ['Manage Purchase Order', 'Manage Invoices'],
      optionDetails: {
        'Manage Purchase Order': {
          options: ['Request Issuance', 'Request Update', 'Request Cancel'],
          methods: {
            'Request Issuance': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Update': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Cancel': ['Manual', 'Upload', 'Contextual Assistance']
          }
        },
        'Manage Invoices': {
          options: ['Request Issuance', 'Request Update', 'Request Cancel'],
          methods: {
            'Request Issuance': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Update': ['Manual', 'Upload', 'Contextual Assistance'],
            'Request Cancel': ['Manual', 'Upload', 'Contextual Assistance']
          }
        }
      }
    }
  ];

  const handleCardHover = (productId: string) => {
    setHoveredCard(productId);
    setFlippedCard(productId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    setFlippedCard(null);
  };

  const handleOptionClick = (productId: string, option: string) => {
    setSelectedProduct(productId);
    setSelectedOption(option);
    
    if (productId === 'bills' && option === 'LC Bills') {
      setShowBillsModal(true);
    } else {
      setShowProductModal(true);
    }
  };

  const handleProductOptionClick = (option: string) => {
    // Handle clicks on product options in the modal
    if (selectedProduct === 'bills' && selectedOption === 'Export LC Bills' && option === 'Present Bills') {
      setShowProductModal(false);
      setShowBillsForm(true);
    }
    console.log('Product option clicked:', option);
  };

  const handleMethodClick = (method: string) => {
    // Handle clicks on processing methods
    if (selectedProduct === 'bills' && method === 'Manual') {
      setShowProductModal(false);
      setShowBillsForm(true);
    }
    console.log('Processing method clicked:', method);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setSelectedOption(null);
  };

  const getCurrentOptions = () => {
    if (!selectedProduct || !selectedOption) return [];
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return [];
    
    const details = product.optionDetails[selectedOption];
    return details?.options || [];
  };

  const getCurrentMethods = () => {
    if (!selectedProduct || !selectedOption) return [];
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return [];
    
    const details = product.optionDetails[selectedOption];
    if (!details) return [];
    
    // Get all unique methods for this option
    const allMethods = new Set<string>();
    
    Object.values(details.methods).forEach((methodArray) => {
      if (Array.isArray(methodArray)) {
        methodArray.forEach(method => allMethods.add(method));
      }
    });
    
    // If there are subMethods, include those too
    if (details.subMethods) {
      Object.values(details.subMethods).forEach((methodArray) => {
        if (Array.isArray(methodArray)) {
          methodArray.forEach(method => allMethods.add(method));
        }
      });
    }
    
    return Array.from(allMethods);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Suite</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="relative h-48 perspective-1000"
            onMouseEnter={() => handleCardHover(product.id)}
            onMouseLeave={handleCardLeave}
          >
            <div 
              className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                flippedCard === product.id ? 'rotate-y-180' : ''
              }`}
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

              {/* Back of card */}
              <Card className="absolute inset-0 backface-hidden rotate-y-180 cursor-pointer">
                <CardContent className="p-4 flex flex-col justify-center h-full overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 text-center">
                    {product.title}
                  </h3>
                  <div className="space-y-2 overflow-auto flex-1">
                    {product.flipOptions?.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(product.id, option)}
                        className="w-full p-2 text-left bg-corporate-peach-100 hover:bg-corporate-peach-200 dark:bg-corporate-peach-500/20 dark:hover:bg-corporate-peach-500/30 rounded-lg transition-colors"
                      >
                        <span className="text-xs font-medium text-corporate-peach-700 dark:text-corporate-peach-300">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Product Options Modal */}
      <ProductOptionsModal
        isOpen={showProductModal}
        onClose={handleCloseModal}
        title={selectedOption || ''}
        options={getCurrentOptions()}
        methods={getCurrentMethods()}
        onOptionClick={handleProductOptionClick}
        onMethodClick={handleMethodClick}
      />

      {showBillsModal && (
        <BillsModal onClose={() => setShowBillsModal(false)} />
      )}

      {showBillsForm && (
        <BillsForm 
          onBack={() => setShowBillsForm(false)} 
          onClose={() => setShowBillsForm(false)} 
        />
      )}
    </div>
  );
};

export default ProductSuite;
