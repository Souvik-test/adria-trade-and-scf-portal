
import { Moon, Sun, Bell, User, LogOut, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import NotificationsPanel from "@/components/NotificationsPanel";
import { fetchNotifications } from '@/services/notificationService';

export type ModuleType = 'trade-finance' | 'supply-chain-finance' | 'corporate-lending' | 'cash-management';

interface TopRibbonProps {
  selectedModule?: ModuleType;
  onModuleChange?: (module: ModuleType) => void;
}

const TopRibbon: React.FC<TopRibbonProps> = ({ selectedModule = 'trade-finance', onModuleChange }) => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [corporateName, setCorporateName] = useState('Client aDria Ltd');
  const [corporateLogo, setCorporateLogo] = useState<string>('');

  useEffect(() => {
    loadUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load saved values from localStorage
    const savedName = localStorage.getItem('corporateName');
    const savedLogo = localStorage.getItem('corporateLogo');
    if (savedName) setCorporateName(savedName);
    if (savedLogo) setCorporateLogo(savedLogo);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const notifications = await fetchNotifications();
      const unread = notifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  const handleThemeToggle = () => {
    console.log('Toggling theme from:', theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    console.log('Theme changed to:', newTheme);
  };

  const handleNotificationsToggle = () => {
    console.log('Toggling notifications panel');
    setNotificationsOpen(!notificationsOpen);
  };

  const handleSignOut = async () => {
    console.log('TopRibbon: Initiating sign out');
    try {
      await signOut();
      console.log('TopRibbon: Sign out successful');
    } catch (error) {
      console.error('TopRibbon: Sign out error:', error);
    }
  };

  const getModuleLabel = (module: ModuleType) => {
    const labels = {
      'trade-finance': 'Trade Finance',
      'supply-chain-finance': 'Supply Chain Finance',
      'corporate-lending': 'Corporate Lending',
      'cash-management': 'Cash Management'
    };
    return labels[module];
  };

  return (
    <>
      <div className="bg-white dark:bg-professional-navy border-b border-border px-6 py-4 professional-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {corporateLogo ? (
                <img src={corporateLogo} alt="Corporate Logo" className="w-8 h-8 rounded-md object-contain" />
              ) : (
                <div className="w-8 h-8 professional-gradient rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TC</span>
                </div>
              )}
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {corporateName}
              </h1>
              <span className="text-muted-foreground text-sm font-medium px-3 py-1 bg-muted rounded-full">
                {selectedModule === 'supply-chain-finance' ? 'SCF Studio' : 'Trade Finance Portal'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Module Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200"
                  title="Select Module"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg">
                <DropdownMenuLabel className="text-muted-foreground">Select Module</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={`cursor-pointer ${selectedModule === 'trade-finance' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                  onClick={() => onModuleChange?.('trade-finance')}
                >
                  Trade Finance
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer ${selectedModule === 'supply-chain-finance' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                  onClick={() => onModuleChange?.('supply-chain-finance')}
                >
                  Supply Chain Finance
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer ${selectedModule === 'corporate-lending' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                  onClick={() => onModuleChange?.('corporate-lending')}
                >
                  Corporate Lending
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer ${selectedModule === 'cash-management' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                  onClick={() => onModuleChange?.('cash-management')}
                >
                  Cash Management
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNotificationsToggle}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 relative rounded-full transition-all duration-200"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full transition-all duration-200"
                  title={`User: ${user?.email || 'Guest'}`}
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border shadow-lg w-64">
                <DropdownMenuItem className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{user?.user_metadata?.full_name || user?.email || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{user?.email || 'Guest'}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <NotificationsPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </>
  );
};

export default TopRibbon;
