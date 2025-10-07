import React, { useState } from 'react';
import { TrendingUp, Package, Receipt, Users, FileCheck, ArrowLeftRight } from 'lucide-react';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';
import POPIModal from './POPIModal';
import InvoiceModal from './InvoiceModal';
import { Separator } from '@/components/ui/separator';

interface SCFProductSuiteProps {
  onBack: () => void;
}

const SCFProductSuite: React.FC<SCFProductSuiteProps> = ({ onBack }) => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [showPOPIModal, setShowPOPIModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const invoiceCard = {
    id: 'underlying-docs',
    title: 'Underlying Invoice Management',
    icon: Receipt,
    description: 'Manage Commercial Invoices, Credit and Debit Notes',
    hasFlip: true,
    flipOptions: ['Commercial Invoice', 'Credit Note', 'Debit Note']
  };

  const sellerAnchoredPrograms = [
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
    }
  ];

  const buyerAnchoredPrograms = [
    {
      id: 'payables-finance',
      title: 'Payables Finance',
      icon: Receipt,
      description: 'Optimize working capital through early payment programs',
      hasFlip: true,
      flipOptions: ['Approved Payables Finance', 'Dynamic Discounting', 'Reverse Factoring']
    },
    {
      id: 'po-finance',
      title: 'Purchase Order Finance',
      icon: FileCheck,
      description: 'Finance purchase orders to fulfill customer orders',
      hasFlip: true,
      flipOptions: ['Pre-shipment Finance', 'Post-shipment Finance']
    }
  ];

  const handleCardHover = (productId: string) => {
    setFlippedCard(productId);
  };

  const handleCardLeave = () => {
    setFlippedCard(null);
  };

  const handleUnderlyingDocsClick = (option: string) => {
    if (option === 'Commercial Invoice') {
      setShowInvoiceModal(true);
    } else if (option === 'Credit Note' || option === 'Debit Note') {
      console.log('Credit/Debit Note clicked:', option);
      // TODO: Implement Credit/Debit Note modals
    }
  };

  const handleOptionClick = (productId: string, option: string) => {
    if (productId === 'underlying-docs') {
      handleUnderlyingDocsClick(option);
    } else {
      console.log('SCF Product option clicked:', productId, option);
      // TODO: Implement modal handlers for SCF products
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <ProductSuiteHeader onBack={onBack} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Supply Chain Finance Solutions</h3>
          <p className="text-muted-foreground">Comprehensive financing solutions to optimize your supply chain working capital</p>
        </div>

        {/* Invoice Management Card */}
        <div className="mb-8">
          <ProductCard
            key={invoiceCard.id}
            id={invoiceCard.id}
            title={invoiceCard.title}
            icon={invoiceCard.icon}
            description={invoiceCard.description}
            hasFlip={invoiceCard.hasFlip}
            flipOptions={invoiceCard.flipOptions}
            isFlipped={flippedCard === invoiceCard.id}
            onMouseEnter={() => handleCardHover(invoiceCard.id)}
            onMouseLeave={handleCardLeave}
            onOptionClick={handleOptionClick}
          />
        </div>

        {/* Separator */}
        <Separator className="my-12" />

        {/* Two Column Layout for Anchored Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Seller/Supplier Anchored Program */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Seller/Supplier Anchored Program</h4>
            <div className="space-y-6">
              {sellerAnchoredPrograms.map((product) => (
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

          {/* Buyer Anchored Program */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Buyer Anchored Program</h4>
            <div className="space-y-6">
              {buyerAnchoredPrograms.map((product) => (
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
      </div>

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

export default SCFProductSuite;
