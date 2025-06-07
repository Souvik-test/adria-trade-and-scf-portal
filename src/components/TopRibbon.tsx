import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, HelpCircle, Sun, Moon, Bell, User, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch as SwitchComponent } from '@/components/ui/switch';

interface TopRibbonProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  isUploadActive?: boolean;
}

interface Notification {
  id: string;
  reference: string;
  description: string;
  time: string;
  isRead: boolean;
  isArchived: boolean;
}

const TopRibbon: React.FC<TopRibbonProps> = ({ darkMode, onToggleDarkMode, onLogout, isUploadActive = false }) => {
  const [selectedModule, setSelectedModule] = useState('trade-finance');
  const [notificationsTab, setNotificationsTab] = useState('new');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      reference: 'ARAMPETRO199',
      description: 'LC Issuance Notification received',
      time: '2h ago',
      isRead: false,
      isArchived: false
    },
    {
      id: '2',
      reference: 'CIMBILCO123',
      description: 'Amendment request approved',
      time: '5h ago',
      isRead: false,
      isArchived: false
    },
    {
      id: '3',
      reference: 'SHELLPETREU17',
      description: 'Payment confirmation received',
      time: '1d ago',
      isRead: true,
      isArchived: false
    },
    {
      id: '4',
      reference: 'BUFOPETR003',
      description: 'Document discrepancy identified',
      time: '2d ago',
      isRead: true,
      isArchived: true
    }
  ]);

  const modules = [
    { value: 'trade-finance', label: 'Trade Finance' },
    { value: 'supply-chain', label: 'Supply Chain Finance' },
    { value: 'cash-management', label: 'Cash Management' },
    { value: 'corporate-lending', label: 'Corporate Lending' }
  ];

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true, isArchived: true }
          : notification
      )
    );
  };

  const handleArchive = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isArchived: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const newNotifications = notifications.filter(n => !n.isArchived);
  const archivedNotifications = notifications.filter(n => n.isArchived);

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
            className="text-corporate-peach-700 dark:text-gray-300 hover:text-corporate-peach-800 hover:bg-corporate-peach-200/50 dark:hover:bg-gray-600 transition-all duration-200"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 transition-transform duration-300" />
            )}
          </Button>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-corporate-peach-700 dark:text-gray-300 hover:text-corporate-peach-800 hover:bg-corporate-peach-200/50 dark:hover:bg-gray-600 relative transition-all duration-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Tabs defaultValue="new" value={notificationsTab} onValueChange={setNotificationsTab}>
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <TabsList className="bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="new" className="text-xs">New ({newNotifications.length})</TabsTrigger>
                  <TabsTrigger value="archived" className="text-xs">Archived ({archivedNotifications.length})</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="new" className="max-h-[300px] overflow-y-auto">
                {newNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-700">
                    {newNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-corporate-peach-50 dark:bg-corporate-peach-900/10' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex justify-between">
                          <a className="text-sm font-medium text-corporate-peach-600 dark:text-corporate-peach-300 hover:underline">
                            {notification.reference}
                          </a>
                          <button 
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            onClick={(e) => handleArchive(notification.id, e)}
                          >
                            Archive
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-4 right-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="archived" className="max-h-[300px] overflow-y-auto">
                {archivedNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No archived notifications
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-700">
                    {archivedNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between">
                          <a className="text-sm font-medium text-corporate-peach-600 dark:text-corporate-peach-300 hover:underline">
                            {notification.reference}
                          </a>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        
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
