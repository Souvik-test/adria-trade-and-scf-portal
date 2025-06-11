import React, { useState } from 'react';
import { FileText, Shield, Banknote, Ship, DollarSign, Globe, Receipt } from 'lucide-react';
import BillsModal from './BillsModal';
import LetterOfCreditModal from './LetterOfCreditModal';
import POPIModal from './POPIModal';
import InvoiceModal from './InvoiceModal';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';

interface ProductSuiteProps {
  onBack: () => void;
}

const ProductSuite: React.FC<ProductSuiteProps> = ({ onBack }) => {
  const [showBillsModal, setShowBillsModal] = useState(false);
  const [showLcModal, setShowLcModal] = useState(false);
  const [showPOPIModal, setShowPOPIModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lcModalType, setLcModalType] = useState<'import' | 'export'>('import');
  const [billsModalType, setBillsModalType] = useState<'import' | 'export'>('import');
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const products = [
    {
      id: 'lc',
      title: 'Letter of Credit',
      icon: FileText,
      description: 'Manage import and export letters of credit',
      hasFlip: true,
      flipOptions: ['Import Letter of Credit', 'Export Letter of Credit']
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
      flipOptions: ['Import LC Bills', 'Export LC Bills']
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
    },
    {
      id: 'underlying-docs',
      title: 'Underlying PO/PI/Invoice Management',
      icon: Receipt,
      description: 'Manage purchase orders, proforma invoices and commercial invoices',
      hasFlip: true,
      flipOptions: ['PO-PI', 'Invoice']
    }
  ];

  const handleBillsClick = (option: string) => {
    if (option === 'Import LC Bills') {
      setBillsModalType('import');
      setShowBillsModal(true);
    } else if (option === 'Export LC Bills') {
      setBillsModalType('export');
      setShowBillsModal(true);
    }
  };

  const handleLcClick = (option: string) => {
    if (option === 'Import Letter of Credit') {
      setLcModalType('import');
      setShowLcModal(true);
    } else if (option === 'Export Letter of Credit') {
      setLcModalType('export');
      setShowLcModal(true);
    }
  };

  const handleEEnablerClick = (option: string) => {
    console.log('e-Enabler option clicked:', option);
  };

  const handleUnderlyingDocsClick = (option: string) => {
    console.log('Underlying Documents option clicked:', option);
    if (option === 'PO-PI') {
      setShowPOPIModal(true);
    } else if (option === 'Invoice') {
      setShowInvoiceModal(true);
    }
  };

  const handleCardHover = (productId: string) => {
    setFlippedCard(productId);
  };

  const handleCardLeave = () => {
    setFlippedCard(null);
  };

  const handleOptionClick = (productId: string, option: string) => {
    if (productId === 'lc') {
      handleLcClick(option);
    } else if (productId === 'bills') {
      handleBillsClick(option);
    } else if (productId === 'e-enablers') {
      handleEEnablerClick(option);
    } else if (productId === 'underlying-docs') {
      handleUnderlyingDocsClick(option);
    }
  };

  return (
    <div className="p-6">
      <ProductSuiteHeader onBack={onBack} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
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

      {showBillsModal && (
        <BillsModal 
          onClose={() => setShowBillsModal(false)} 
          onBack={() => setShowBillsModal(false)}
          type={billsModalType}
        />
      )}

      {showLcModal && (
        <LetterOfCreditModal 
          isOpen={showLcModal}
          onClose={() => setShowLcModal(false)}
          type={lcModalType}
        />
      )}

      {showPOPIModal && (
        <POPIModal 
          onClose={() => setShowPOPIModal(false)} 
          onBack={() => setShowPOPIModal(false)}
        />
      )}

      {showInvoiceModal && (
        <InvoiceModal 
          onClose={() => setShowInvoiceModal(false)} 
          onBack={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default ProductSuite;
