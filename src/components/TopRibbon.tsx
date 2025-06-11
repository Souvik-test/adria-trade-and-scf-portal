
import { Moon, Sun, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const TopRibbon = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            TextCorp Ltd - Trade Finance Portal
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNotificationsToggle}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 relative"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Welcome to Trade Finance Portal
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Your account is now active and ready to use.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      System Status: All services operational
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      All trade finance services are running normally.
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    Mark all as read
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                title={`User: ${user?.user_id || 'Guest'}`}
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{user?.full_name || 'User'}</span>
                  <span className="text-xs text-gray-500">{user?.user_id || 'Guest'}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
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
  );
};

export default TopRibbon;
