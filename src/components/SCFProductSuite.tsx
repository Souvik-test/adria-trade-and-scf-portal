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
    { id: 'receivable-finance', title: 'Receivable Finance', icon: TrendingUp },
    { id: 'dealer-distributor-finance', title: 'Dealer/Distributor Finance', icon: Users },
    { id: 'invoice-discounting', title: 'Invoice Discounting', icon: Receipt },
    { id: 'factoring', title: 'Factoring', icon: FileCheck },
    { id: 'forfaiting', title: 'Forfaiting', icon: ArrowLeftRight },
    { id: 'inventory-finance', title: 'Inventory Finance', icon: Package }
  ];

  const buyerAnchoredPrograms = [
    { id: 'approved-payable-finance', title: 'Approved Payable Finance', icon: Receipt },
    { id: 'dynamic-discounting', title: 'Dynamic Discounting', icon: TrendingUp },
    { id: 'vendor-finance', title: 'Vendor Finance', icon: Users },
    { id: 'po-financing', title: 'Purchase Order Financing', icon: FileCheck }
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-start">
          {/* Seller/Supplier Anchored Program */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Seller/Supplier Anchored Program</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sellerAnchoredPrograms.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  icon={product.icon}
                  description=""
                  hasFlip={false}
                  isFlipped={false}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onOptionClick={() => {}}
                />
              ))}
            </div>
          </div>

          {/* Vertical Separator */}
          <Separator orientation="vertical" className="hidden lg:block h-auto min-h-[400px]" />

          {/* Buyer Anchored Program */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Buyer Anchored Program</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buyerAnchoredPrograms.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  icon={product.icon}
                  description=""
                  hasFlip={false}
                  isFlipped={false}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onOptionClick={() => {}}
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
