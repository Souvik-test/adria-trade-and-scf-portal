
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
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            className={`text-gray-600 hover:text-corporate-blue ${
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
            className="text-gray-600 hover:text-corporate-blue"
            title="AI Assistance"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="text-gray-600 hover:text-corporate-blue"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-corporate-blue relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
        
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-48 border-corporate-blue/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module.value} value={module.value}>
                {module.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 bg-corporate-blue rounded-full flex items-center justify-center text-white font-bold text-sm hover:bg-corporate-blue/90">
              TCU
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
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
