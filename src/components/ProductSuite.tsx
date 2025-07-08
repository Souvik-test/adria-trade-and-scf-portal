import React, { useState } from 'react';
import { FileText, Shield, Banknote, Ship, DollarSign, Globe, Receipt } from 'lucide-react';
import BillsModal from './BillsModal';
import LetterOfCreditModal from './LetterOfCreditModal';
import BankGuaranteeModal from './bank-guarantee/BankGuaranteeModal';
import POPIModal from './POPIModal';
import InvoiceModal from './InvoiceModal';
import DocumentaryCollectionModal from './documentary-collection/DocumentaryCollectionModal';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';

interface ProductSuiteProps {
  onBack: () => void;
}

const ProductSuite: React.FC<ProductSuiteProps> = ({ onBack }) => {
  const [showBillsModal, setShowBillsModal] = useState(false);
  const [showLcModal, setShowLcModal] = useState(false);
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(false);
  const [showPOPIModal, setShowPOPIModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDocumentaryCollectionModal, setShowDocumentaryCollectionModal] = useState(false);
  const [lcModalType, setLcModalType] = useState<'import' | 'export'>('import');
  const [billsModalType, setBillsModalType] = useState<'import' | 'export'>('import');
  const [guaranteeModalType, setGuaranteeModalType] = useState<'outward' | 'inward'>('outward');
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
      description: 'Handle bank guarantees and standby letters of credit',
      hasFlip: true,
      flipOptions: ['Outward Bank Guarantee/SBLC', 'Inward Bank Guarantee/SBLC']
    },
    {
      id: 'bills',
      title: 'Bills',
      icon: Banknote,
      description: 'Process trade bills and collections',
      hasFlip: true,
      flipOptions: ['Import LC Bills', 'Export LC Bills', 'Outward Documentary Collection Bills', 'Inward Documentary Collection Bills']
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
    } else if (option === 'Outward Documentary Collection Bills') {
      setShowDocumentaryCollectionModal(true);
    } else if (option === 'Inward Documentary Collection Bills') {
      console.log('Inward Documentary Collection Bills clicked');
      // TODO: Implement when ready
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

  const handleGuaranteeClick = (option: string) => {
    if (option === 'Outward Bank Guarantee/SBLC') {
      setGuaranteeModalType('outward');
      setShowGuaranteeModal(true);
    } else if (option === 'Inward Bank Guarantee/SBLC') {
      setGuaranteeModalType('inward');
      setShowGuaranteeModal(true);
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
    } else if (productId === 'guarantee') {
      handleGuaranteeClick(option);
    } else if (productId === 'e-enablers') {
      handleEEnablerClick(option);
    } else if (productId === 'underlying-docs') {
      handleUnderlyingDocsClick(option);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <ProductSuiteHeader onBack={onBack} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {showGuaranteeModal && (
        <BankGuaranteeModal 
          isOpen={showGuaranteeModal}
          onClose={() => setShowGuaranteeModal(false)}
          type={guaranteeModalType}
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

      {showDocumentaryCollectionModal && (
        <DocumentaryCollectionModal
          open={showDocumentaryCollectionModal}
          onClose={() => setShowDocumentaryCollectionModal(false)}
        />
      )}
    </div>
  );
};

export default ProductSuite;
