import React, { useState } from 'react';
import { Database, Package, Settings, UserPlus, Landmark, Link, FileText, FileType } from 'lucide-react';
import ProductSuiteHeader from './product-suite/ProductSuiteHeader';
import ProductCard from './product-suite/ProductCard';
import SCFProductDefinition from './SCFProductDefinition';
import { SCFProgramConfiguration } from './scf-program/SCFProgramConfiguration';

interface SCFMasterSetupProps {
  onBack: () => void;
}

const SCFMasterSetup: React.FC<SCFMasterSetupProps> = ({ onBack }) => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"main" | "productDefinition" | "programConfiguration">("main");
  const [openProgramInAddMode, setOpenProgramInAddMode] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string | undefined>();

  // Define the callback at component level to ensure it's always available
  const handleNavigateToProgramConfig = React.useCallback((productCode?: string) => {
    setSelectedProductCode(productCode);
    setOpenProgramInAddMode(true);
    setCurrentView("programConfiguration");
  }, []);

  if (currentView === "productDefinition") {
    return <SCFProductDefinition 
      key="product-definition"
      onBack={() => setCurrentView("main")} 
      onNavigateToProgramConfig={handleNavigateToProgramConfig}
    />;
  }

  const handleNavigateToProductDefinition = () => {
    setCurrentView("productDefinition");
    setOpenProgramInAddMode(false);
    setSelectedProductCode(undefined);
  };

  if (currentView === "programConfiguration") {
    return <SCFProgramConfiguration 
      key={openProgramInAddMode ? `add-${selectedProductCode}` : 'view'}
      onBack={() => {
        setCurrentView("main");
        setOpenProgramInAddMode(false);
        setSelectedProductCode(undefined);
      }} 
      initialMode={openProgramInAddMode ? "add" : undefined}
      selectedProductCode={selectedProductCode}
      onNavigateToProductDefinition={handleNavigateToProductDefinition}
    />;
  }

  const masterSetupItems = [
    {
      id: 'product',
      title: 'Product',
      icon: Package,
      description: 'View product configurations and definitions',
      hasFlip: true,
      flipOptions: ['View'] // Only View for Corporates
    },
    {
      id: 'program-configuration',
      title: 'Program Configuration',
      icon: Settings,
      description: 'Define eligibility, discount rates, limits',
      hasFlip: true,
      flipOptions: ['View', 'Create', 'Update']
    },
    {
      id: 'counter-party-onboarding',
      title: 'Counter-Party Onboarding',
      icon: UserPlus,
      description: 'Manage supplier and buyer onboarding',
      hasFlip: true,
      flipOptions: ['View', 'Create', 'Update']
    },
    {
      id: 'bank-account-master',
      title: 'Bank Account Master',
      icon: Landmark,
      description: 'Accounts used for disbursement or repayment',
      hasFlip: true,
      flipOptions: ['View', 'Create', 'Update']
    },
    {
      id: 'bank-integrations',
      title: 'Bank Integrations',
      icon: Link,
      description: 'Link with multiple financiers for multi-banking setup',
      hasFlip: true,
      flipOptions: ['View', 'Create', 'Update']
    },
    {
      id: 'document-repository',
      title: 'Document Repository',
      icon: FileText,
      description: 'Agreements, policies, mandates',
      hasFlip: true,
      flipOptions: ['View', 'Upload', 'Update']
    },
    {
      id: 'document-master',
      title: 'Document Master',
      icon: FileType,
      description: 'Standard templates for invoices',
      hasFlip: true,
      flipOptions: ['View', 'Create', 'Update']
    }
  ];

  const handleCardHover = (itemId: string) => {
    setFlippedCard(itemId);
  };

  const handleCardLeave = () => {
    setFlippedCard(null);
  };

  const handleOptionClick = (itemId: string, option: string) => {
    console.log('Master Setup option clicked:', itemId, option);
    
    if (itemId === 'product' && option === 'View') {
      setCurrentView("productDefinition");
    } else if (itemId === 'program-configuration') {
      // Reset filters when navigating directly to program configuration
      setSelectedProductCode(undefined);
      setOpenProgramInAddMode(false);
      setCurrentView("programConfiguration");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      <ProductSuiteHeader onBack={onBack} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Master Set-up</h3>
          <p className="text-muted-foreground">Configure and manage products and programs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masterSetupItems.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              icon={item.icon}
              description={item.description}
              hasFlip={item.hasFlip}
              flipOptions={item.flipOptions}
              isFlipped={flippedCard === item.id}
              onMouseEnter={() => handleCardHover(item.id)}
              onMouseLeave={handleCardLeave}
              onOptionClick={handleOptionClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SCFMasterSetup;
