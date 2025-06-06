
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, HelpCircle, Sun, Moon, Bell } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TopRibbonProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const TopRibbon: React.FC<TopRibbonProps> = ({ darkMode, onToggleDarkMode }) => {
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
        {/* Left side actions */}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Right side ribbon */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-corporate-blue"
          title="Document Upload"
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
        
        <div className="w-8 h-8 bg-corporate-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
          TCU
        </div>
      </div>
    </div>
  );
};

export default TopRibbon;
