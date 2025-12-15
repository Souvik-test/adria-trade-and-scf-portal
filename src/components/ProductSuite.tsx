import React, { useState, useMemo } from 'react';
import { FileText, Shield, Banknote, Ship, DollarSign, Globe, Receipt } from 'lucide-react';
import BillsModal from './BillsModal';
import LetterOfCreditModal from './LetterOfCreditModal';
import BankGuaranteeModal from './bank-guarantee/BankGuaranteeModal';
import POPIModal from './POPIModal';
import InvoiceModal from './InvoiceModal';
import DocumentaryCollectionModal from './documentary-collection/DocumentaryCollectionModal';
import InwardDocumentaryCollectionModal from './documentary-collection/InwardDocumentaryCollectionModal';
import ShippingGuaranteeModal from './shipping-guarantee/ShippingGuaranteeModal';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';
import { useProductEventMappings } from '@/hooks/useProductEventMappings';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Loader2 } from 'lucide-react';

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
  const [showInwardDocumentaryCollectionModal, setShowInwardDocumentaryCollectionModal] = useState(false);
  const [showShippingGuaranteeModal, setShowShippingGuaranteeModal] = useState(false);
  const [lcModalType, setLcModalType] = useState<'import' | 'export'>('import');
  const [billsModalType, setBillsModalType] = useState<'import' | 'export'>('import');
  const [guaranteeModalType, setGuaranteeModalType] = useState<'outward' | 'inward'>('outward');
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const { getProductName, loading } = useProductEventMappings();
  const { 
    isSuperUser, 
    hasProductAccess, 
    hasAnyProductCardAccess, 
    getAccessibleFlipOptions,
    loading: permissionsLoading 
  } = useUserPermissions();

  // Map display names to internal product codes for click handling
  const productNameToCodeMap = useMemo(() => ({
    [getProductName('ILC')]: 'ILC',
    [getProductName('ELC')]: 'ELC',
    [getProductName('OBG')]: 'OBG',
    [getProductName('IBG')]: 'IBG',
    [getProductName('ODC')]: 'ODC',
    [getProductName('IDC')]: 'IDC',
    [getProductName('ILB')]: 'ILB',
    [getProductName('ELB')]: 'ELB',
    [getProductName('OSB')]: 'OSB',
    [getProductName('ISB')]: 'ISB',
    [getProductName('SHG')]: 'SHG',
    // Fallback mappings for hardcoded defaults
    'Import Letter of Credit': 'ILC',
    'Export Letter of Credit': 'ELC',
    'Outward Bank Guarantee/SBLC': 'OBG',
    'Inward Bank Guarantee/SBLC': 'IBG',
    'Outward Documentary Collection Bills': 'OSB',
    'Inward Documentary Collection Bills': 'ISB',
    'Import LC Bills': 'ILB',
    'Export LC Bills': 'ELB'
  }), [getProductName]);

  // Product code to card ID mapping
  const productCodeToCard: Record<string, string> = {
    'ILC': 'lc',
    'ELC': 'lc',
    'OBG': 'guarantee',
    'IBG': 'guarantee',
    'ILB': 'bills',
    'ELB': 'bills',
    'ODC': 'bills',
    'IDC': 'bills',
    'SHG': 'shipping',
  };

  // Filter flip options based on permissions
  const filterFlipOptions = (cardId: string, allOptions: string[]): string[] => {
    if (isSuperUser()) return allOptions;
    
    return allOptions.filter(option => {
      const productCode = productNameToCodeMap[option];
      if (!productCode) return true; // Keep non-product options like e-enablers
      return hasProductAccess(productCode);
    });
  };

  const products = useMemo(() => {
    const allProducts = [
      {
        id: 'lc',
        title: 'Letter of Credit',
        icon: FileText,
        description: 'Manage import and export letters of credit',
        hasFlip: true,
        flipOptions: [getProductName('ILC'), getProductName('ELC')]
      },
      {
        id: 'guarantee',
        title: 'Bank Guarantee/SBLC',
        icon: Shield,
        description: 'Handle bank guarantees and standby letters of credit',
        hasFlip: true,
        flipOptions: [getProductName('OBG'), getProductName('IBG')]
      },
      {
        id: 'bills',
        title: 'Bills',
        icon: Banknote,
        description: 'Process trade bills and collections',
        hasFlip: true,
        flipOptions: [getProductName('ILB'), getProductName('ELB'), getProductName('ODC'), getProductName('IDC')]
      },
      {
        id: 'shipping',
        title: getProductName('SHG'),
        icon: Ship,
        description: 'Manage shipping guarantees and delivery orders',
        onClick: () => setShowShippingGuaranteeModal(true),
        productCode: 'SHG'
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

    // If super user, show all products
    if (isSuperUser()) return allProducts;

    // Filter products based on permissions
    return allProducts.filter(product => {
      // For products with flip options that map to product codes
      if (product.id === 'lc') {
        return hasProductAccess('ILC') || hasProductAccess('ELC');
      }
      if (product.id === 'guarantee') {
        return hasProductAccess('OBG') || hasProductAccess('IBG');
      }
      if (product.id === 'bills') {
        return hasProductAccess('ILB') || hasProductAccess('ELB') || hasProductAccess('ODC') || hasProductAccess('IDC');
      }
      if (product.id === 'shipping') {
        return hasProductAccess('SHG');
      }
      // Show other products (trade-loan, e-enablers, underlying-docs) to all for now
      return true;
    }).map(product => {
      // Filter flip options based on permissions
      if (product.flipOptions && product.hasFlip) {
        const filteredOptions = filterFlipOptions(product.id, product.flipOptions);
        return { ...product, flipOptions: filteredOptions };
      }
      return product;
    });
  }, [getProductName, isSuperUser, hasProductAccess]);

  const handleBillsClick = (option: string) => {
    const productCode = productNameToCodeMap[option];
    if (productCode === 'ILB') {
      setBillsModalType('import');
      setShowBillsModal(true);
    } else if (productCode === 'ELB') {
      setBillsModalType('export');
      setShowBillsModal(true);
    } else if (productCode === 'ODC') {
      setShowDocumentaryCollectionModal(true);
    } else if (productCode === 'IDC') {
      setShowInwardDocumentaryCollectionModal(true);
    }
  };

  const handleLcClick = (option: string) => {
    const productCode = productNameToCodeMap[option];
    if (productCode === 'ILC') {
      setLcModalType('import');
      setShowLcModal(true);
    } else if (productCode === 'ELC') {
      setLcModalType('export');
      setShowLcModal(true);
    }
  };

  const handleGuaranteeClick = (option: string) => {
    const productCode = productNameToCodeMap[option];
    if (productCode === 'OBG') {
      setGuaranteeModalType('outward');
      setShowGuaranteeModal(true);
    } else if (productCode === 'IBG') {
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
    } else if (productId === 'shipping') {
      setShowShippingGuaranteeModal(true);
    }
  };

  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              onClick={(product as any).onClick}
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

      {showInwardDocumentaryCollectionModal && (
        <InwardDocumentaryCollectionModal
          open={showInwardDocumentaryCollectionModal}
          onClose={() => setShowInwardDocumentaryCollectionModal(false)}
        />
      )}

      {showShippingGuaranteeModal && (
        <ShippingGuaranteeModal
          isOpen={showShippingGuaranteeModal}
          onClose={() => setShowShippingGuaranteeModal(false)}
          onBack={() => setShowShippingGuaranteeModal(false)}
        />
      )}
    </div>
  );
};

export default ProductSuite;
