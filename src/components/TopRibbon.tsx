
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, HelpCircle, Sun, Moon, Bell, User, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TopRibbonProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  isUploadActive?: boolean;
}

const TopRibbon: React.FC<TopRibbonProps> = ({ darkMode, onToggleDarkMode, onLogout, isUploadActive = false }) => {
  const [selectedModule, setSelectedModule] = useState('trade-finance');

  const modules = [
    { value: 'trade-finance', label: 'Trade Finance' },
    { value: 'supply-chain', label: 'Supply Chain Finance' },
    { value: 'cash-management', label: 'Cash Management' },
    { value: 'corporate-lending', label: 'Corporate Lending' }
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {/* Left side - can be used for breadcrumbs or page title later */}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Right side ribbon with icons */}
        <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-corporate-peach-100 to-corporate-peach-200 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm border border-corporate-peach-300 dark:border-gray-600">
          <Button
            variant="ghost"
            size="sm"
            className={`text-corporate-peach-700 dark:text-gray-300 hover:text-corporate-peach-800 hover:bg-corporate-peach-200/50 dark:hover:bg-gray-600 transition-all duration-200 ${
              !isUploadActive ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Document Upload"
            disabled={!isUploadActive}
          >
            <Upload className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-corporate-peach-700 dark:text-gray-300 hover:text-corporate-peach-800 hover:bg-corporate-peach-200/50 dark:hover:bg-gray-600 transition-all duration-200"
            title="AI Assistance"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="text-corporate-peach-700 dark:text-gray-300 hover:text-corporate-peach-800 hover:bg-corporate-peach-200/50 dark:hover:bg-gray-600 transition-all duration-200 relative group"
            title="Toggle Dark/Light Mode"
          >
            <div className="relative">
              {darkMode ? (
                <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </div>
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-corporate-peach-700 dark:text-gray-300 hover:text-corporate-peach-800 hover:bg-corporate-peach-200/50 dark:hover:bg-gray-600 relative transition-all duration-200"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </Button>
        
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-48 border-corporate-peach-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-corporate-peach-400 dark:hover:border-gray-500 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-corporate-peach-300 dark:border-gray-600">
            {modules.map((module) => (
              <SelectItem key={module.value} value={module.value} className="hover:bg-corporate-peach-100 dark:hover:bg-gray-700">
                {module.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 bg-gradient-to-br from-corporate-peach-500 to-corporate-peach-600 rounded-full flex items-center justify-center text-white font-bold text-sm hover:from-corporate-peach-600 hover:to-corporate-peach-700 transition-all duration-200 shadow-md">
              TCU
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-corporate-peach-300 dark:border-gray-600">
            <DropdownMenuItem className="hover:bg-corporate-peach-100 dark:hover:bg-gray-700">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout} className="hover:bg-corporate-peach-100 dark:hover:bg-gray-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopRibbon;
