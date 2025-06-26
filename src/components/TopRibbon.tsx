
import { Moon, Sun, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NotificationsPanel from "@/components/NotificationsPanel";
import { fetchNotifications } from '@/services/notificationService';

const TopRibbon = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
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

  return (
    <>
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              TextCorp Ltd - Trade Finance Portal
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
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
              className="text-muted-foreground hover:text-foreground hover:bg-accent relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
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
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                  title={`User: ${user?.user_id || 'Guest'}`}
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{user?.full_name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{user?.user_id || 'Guest'}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-400 focus:text-red-300"
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
