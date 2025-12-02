
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopRibbon, { ModuleType } from '@/components/TopRibbon';
import Footer from '@/components/Footer';
import DashboardWidgets from '@/components/DashboardWidgets';
import ProductSuite from '@/components/ProductSuite';
import SCFDashboard from '@/components/SCFDashboard';
import SCFProductSuite from '@/components/SCFProductSuite';
import SCFMasterSetup from '@/components/SCFMasterSetup';
import SCFProductDefinition from '@/components/SCFProductDefinition';
import { SCFProgramConfiguration } from '@/components/scf-program/SCFProgramConfiguration';
import SCFTransactionInquiry from '@/components/SCFTransactionInquiry';
import { DocumentInquiry } from '@/components/DocumentInquiry';
import { ProductEventMapping } from '@/components/control-centre/ProductEventMapping';
import ManagePanesAndSections from '@/components/control-centre/ManagePanesAndSections';


const Index = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loginTime, setLoginTime] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleType>('trade-finance');

  useEffect(() => {
    // Set login time when component mounts (user is authenticated)
    setLoginTime(new Date().toLocaleString());
  }, []);

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    console.log('Menu clicked:', menuId);
  };

  const handleModuleChange = (module: ModuleType) => {
    setSelectedModule(module);
    // Reset to dashboard when switching modules
    setActiveMenu('dashboard');
    console.log('Module changed:', module);
  };

  const renderMainContent = () => {
    // Render based on selected module
    if (selectedModule === 'supply-chain-finance') {
      switch (activeMenu) {
        case 'product-suite':
          return <SCFProductSuite onBack={() => setActiveMenu('dashboard')} />;
        case 'product-definition':
          return <SCFProductDefinition 
            onBack={() => setActiveMenu('dashboard')} 
            onNavigateToProgramConfig={() => setActiveMenu('program-configuration')}
          />;
        case 'program-configuration':
          return <SCFProgramConfiguration onBack={() => setActiveMenu('dashboard')} />;
        case 'counter-party-onboarding':
          return (
            <div className="p-8 animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-4">Counter Party On-Boarding</h2>
                <div className="bg-card rounded-lg p-6 professional-shadow">
                  <p className="text-muted-foreground text-lg">Counter party on-boarding feature coming soon...</p>
                </div>
              </div>
            </div>
          );
        case 'master-setup':
          return <SCFMasterSetup onBack={() => setActiveMenu('dashboard')} />;
        case 'transaction-inquiry':
          return <SCFTransactionInquiry />;
        case 'document-inquiry':
          return <DocumentInquiry />;
        case 'inquiry':
        case 'correspondence':
        case 'configuration':
        case 'administration':
          return (
            <div className="p-8 animate-fade-in">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
                </h2>
                <div className="bg-card rounded-lg p-6 professional-shadow">
                  <p className="text-muted-foreground text-lg">This feature is coming soon for Supply Chain Finance...</p>
                </div>
              </div>
            </div>
          );
        default:
          return <SCFDashboard />;
      }
    } else if (selectedModule === 'corporate-lending' || selectedModule === 'cash-management') {
      return (
        <div className="p-8 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {selectedModule === 'corporate-lending' ? 'Corporate Lending' : 'Cash Management'}
            </h2>
            <div className="bg-card rounded-lg p-6 professional-shadow">
              <p className="text-muted-foreground text-lg">This module is coming soon...</p>
            </div>
          </div>
        </div>
      );
    }

    // Default to Trade Finance module
    switch (activeMenu) {
      case 'product-suite':
        return <ProductSuite onBack={() => setActiveMenu('dashboard')} />;
      case 'product-event-mapping':
        return <ProductEventMapping />;
      case 'manage-panes-sections':
        return <ManagePanesAndSections />;
      case 'field-definition':
        return (
          <div className="p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Field Definition</h2>
              <div className="bg-card rounded-lg p-6 professional-shadow">
                <p className="text-muted-foreground text-lg">Field definition functionality coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'nextgen-workflow-configurator':
        return (
          <div className="p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">NextGen Workflow Configurator</h2>
              <div className="bg-card rounded-lg p-6 professional-shadow">
                <p className="text-muted-foreground text-lg">Workflow configurator functionality coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'document-inquiry':
        return <DocumentInquiry />;
      case 'inquiry':
        return (
          <div className="p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Inquiry Function</h2>
              <div className="bg-card rounded-lg p-6 professional-shadow">
                <p className="text-muted-foreground text-lg">Inquiry functionality coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'correspondence':
        return (
          <div className="p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Secured Correspondence</h2>
              <div className="bg-card rounded-lg p-6 professional-shadow">
                <p className="text-muted-foreground text-lg">Secured correspondence module coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'configuration':
        return (
          <div className="p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Configuration</h2>
              <div className="bg-card rounded-lg p-6 professional-shadow">
                <p className="text-muted-foreground text-lg">Configuration settings coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'administration':
        return (
          <div className="p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Administration</h2>
              <div className="bg-card rounded-lg p-6 professional-shadow">
                <p className="text-muted-foreground text-lg">Administration panel coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardWidgets />;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeMenu={activeMenu} 
          onMenuClick={handleMenuClick}
          selectedModule={selectedModule}
        />
        <div className="flex-1 flex flex-col">
          <TopRibbon 
            selectedModule={selectedModule}
            onModuleChange={handleModuleChange}
          />
          
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-muted/20">
            {renderMainContent()}
          </main>
          
          <Footer loginTime={loginTime} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
