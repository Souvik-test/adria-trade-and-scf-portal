import React, { useState } from 'react';
import { TrendingUp, Package, Receipt, Users, FileCheck, ArrowLeftRight } from 'lucide-react';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';
import POPIModal from './POPIModal';
import InvoiceModal from './InvoiceModal';
import { Separator } from '@/components/ui/separator';
import ProductSolutionToggle from './scf-suite/ProductSolutionToggle';
import FinanceDisbursementModal from './finance-disbursement/FinanceDisbursementModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SCFProductSuiteProps {
  onBack: () => void;
}

const SCFProductSuite: React.FC<SCFProductSuiteProps> = ({ onBack }) => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [showPOPIModal, setShowPOPIModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [solutionType, setSolutionType] = useState<'conventional' | 'custom'>('conventional');
  const [disbursementModal, setDisbursementModal] = useState<{ isOpen: boolean; productCode?: string; productName?: string }>({ isOpen: false });

  const { data: customProducts } = useQuery({
    queryKey: ['custom-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data: customUser } = await supabase.from('custom_users').select('user_id').eq('id', user.id).single();
      if (!customUser) return [];
      const { data } = await supabase.from('scf_product_definitions').select('*').eq('user_id', customUser.user_id).eq('is_active', true);
      return data || [];
    }
  });

  const invoiceCard = {
    id: 'underlying-docs',
    title: 'Invoice / Credit and Debit Notes',
    icon: Receipt,
    description: 'Manage Commercial Invoices, Credit and Debit Notes',
    hasFlip: true,
    flipOptions: ['Commercial Invoice']
  };

  const sellerAnchoredPrograms = [
    { id: 'receivable-finance', title: 'Receivable Finance', icon: TrendingUp, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'dealer-distributor-finance', title: 'Dealer/Distributor Finance', icon: Users, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'invoice-discounting', title: 'Invoice Discounting', icon: Receipt, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'factoring', title: 'Factoring', icon: FileCheck, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'forfaiting', title: 'Forfaiting', icon: ArrowLeftRight, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'inventory-finance', title: 'Inventory Finance', icon: Package, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] }
  ];

  const buyerAnchoredPrograms = [
    { id: 'approved-payable-finance', title: 'Approved Payable Finance', icon: Receipt, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'dynamic-discounting', title: 'Dynamic Discounting', icon: TrendingUp, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'vendor-finance', title: 'Vendor Finance', icon: Users, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] },
    { id: 'po-financing', title: 'Purchase Order Financing', icon: FileCheck, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'] }
  ];

  const customSellerProducts = customProducts?.filter((p: any) => p.anchor_role?.toUpperCase().includes('SELLER') || p.anchor_role?.toUpperCase().includes('SUPPLIER')).map((p: any) => ({ 
    id: p.product_code, title: p.product_name, icon: TrendingUp, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'], description: p.product_description 
  })) || [];

  const customBuyerProducts = customProducts?.filter((p: any) => p.anchor_role?.toUpperCase().includes('BUYER')).map((p: any) => ({ 
    id: p.product_code, title: p.product_name, icon: Receipt, hasFlip: true, flipOptions: ['Disburse', 'Repay', 'Transfer'], description: p.product_description 
  })) || [];

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
    } else if (option === 'Disburse') {
      setDisbursementModal({ isOpen: true, productCode: productId, productName: productId });
    } else {
      console.log('SCF Product option clicked:', productId, option);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <ProductSuiteHeader 
        onBack={onBack} 
        title="Adria SCF Studio"
        subtitle="Comprehensive supply chain finance solutions"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Supply Chain Finance Solutions</h3>
          <p className="text-muted-foreground">Comprehensive financing solutions to optimize your supply chain working capital</p>
        </div>

        {/* Invoice Management Card */}
        <div className="mb-8 max-w-md">
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

        {/* Solution Toggle */}
        <ProductSolutionToggle selectedSolution={solutionType} onToggle={setSolutionType} />

        {/* Two Column Layout for Anchored Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-start">
          {/* Seller/Supplier Anchored Program */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Seller/Supplier Anchored Program</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(solutionType === 'conventional' ? sellerAnchoredPrograms : customSellerProducts).map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  icon={product.icon}
                  description={product.description || ""}
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

          {/* Vertical Separator */}
          <Separator orientation="vertical" className="hidden lg:block h-auto min-h-[400px]" />

          {/* Buyer Anchored Program */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">Buyer Anchored Program</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(solutionType === 'conventional' ? buyerAnchoredPrograms : customBuyerProducts).map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  icon={product.icon}
                  description={product.description || ""}
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

      <FinanceDisbursementModal
        isOpen={disbursementModal.isOpen}
        onClose={() => setDisbursementModal({ isOpen: false })}
        productCode={disbursementModal.productCode}
        productName={disbursementModal.productName}
      />
    </div>
  );
};

export default SCFProductSuite;
