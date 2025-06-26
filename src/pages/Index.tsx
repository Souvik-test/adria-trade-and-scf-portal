
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopRibbon from '@/components/TopRibbon';
import Footer from '@/components/Footer';
import DashboardWidgets from '@/components/DashboardWidgets';
import ProductSuite from '@/components/ProductSuite';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loginTime, setLoginTime] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Set login time when component mounts (user is authenticated)
    setLoginTime(new Date().toLocaleString());
  }, []);

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    console.log('Menu clicked:', menuId);
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'product-suite':
        return <ProductSuite onBack={() => setActiveMenu('dashboard')} />;
      case 'inquiry':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Inquiry Function</h2>
            <p className="text-muted-foreground">Inquiry functionality coming soon...</p>
          </div>
        );
      case 'correspondence':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Secured Correspondence</h2>
            <p className="text-muted-foreground">Secured correspondence module coming soon...</p>
          </div>
        );
      case 'configuration':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Configuration</h2>
            <p className="text-muted-foreground">Configuration settings coming soon...</p>
          </div>
        );
      case 'administration':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Administration</h2>
            <p className="text-muted-foreground">Administration panel coming soon...</p>
          </div>
        );
      default:
        return <DashboardWidgets />;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <div className="flex-1 flex flex-col">
          <TopRibbon />
          
          <main className="flex-1 overflow-auto bg-card">
            {renderMainContent()}
          </main>
          
          <Footer loginTime={loginTime} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
