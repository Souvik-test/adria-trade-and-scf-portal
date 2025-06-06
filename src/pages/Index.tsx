
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import LoginPage from '@/components/LoginPage';
import { AppSidebar } from '@/components/AppSidebar';
import TopRibbon from '@/components/TopRibbon';
import Footer from '@/components/Footer';
import DashboardWidgets from '@/components/DashboardWidgets';
import ProductSuite from '@/components/ProductSuite';
import InquiryFunction from '@/components/InquiryFunction';
import Configuration from '@/components/Configuration';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Set dark mode as default
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loginTime, setLoginTime] = useState('');
  
  useEffect(() => {
    // Apply dark mode as default when component mounts
    document.documentElement.classList.add('dark');
    
    // Watch for changes in darkMode state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setLoginTime(new Date().toLocaleString());
    console.log('User logged in successfully');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveMenu('dashboard');
    setLoginTime('');
    console.log('User logged out successfully');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    console.log('Menu clicked:', menuId);
  };

  const isUploadActive = activeMenu !== 'dashboard';

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'product-suite':
        return <ProductSuite onBack={() => setActiveMenu('dashboard')} />;
      case 'inquiry':
        return <InquiryFunction onBack={() => setActiveMenu('dashboard')} />;
      case 'correspondence':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Secured Correspondence</h2>
            <p className="text-gray-600 dark:text-gray-400">Secured correspondence module coming soon...</p>
          </div>
        );
      case 'configuration':
        return <Configuration onBack={() => setActiveMenu('dashboard')} />;
      case 'administration':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Administration</h2>
            <p className="text-gray-600 dark:text-gray-400">Administration panel coming soon...</p>
          </div>
        );
      default:
        return <DashboardWidgets />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
            <SidebarTrigger className="text-corporate-blue hover:bg-corporate-blue/10" />
            <div className="flex-1">
              <TopRibbon 
                darkMode={darkMode} 
                onToggleDarkMode={handleToggleDarkMode} 
                onLogout={handleLogout}
                isUploadActive={isUploadActive}
              />
            </div>
          </div>
          
          <main className="flex-1 overflow-auto bg-white dark:bg-gray-800">
            {renderMainContent()}
          </main>
          
          <Footer loginTime={loginTime} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
