
import React, { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Package, Search, Shield, Settings, User, MapPin } from 'lucide-react';

const menuItems = [
  {
    title: 'Product Suite',
    icon: Package,
    id: 'product-suite'
  },
  {
    title: 'Inquiry Function',
    icon: Search,
    id: 'inquiry'
  },
  {
    title: 'Market Place',
    icon: MapPin,
    id: 'marketplace'
  },
  {
    title: 'Secured Correspondence',
    icon: Shield,
    id: 'correspondence'
  },
  {
    title: 'Configuration',
    icon: Settings,
    id: 'configuration'
  },
  {
    title: 'Administration',
    icon: User,
    id: 'administration'
  }
];

interface AppSidebarProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export function AppSidebar({ activeMenu, onMenuClick }: AppSidebarProps) {
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [isHovering, setIsHovering] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter event
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Clear any existing leave timeout to prevent trembling
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    
    if (isCollapsed) {
      setOpen(true);
    }
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Set a longer timeout to prevent trembling
    leaveTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 800); // Increased timeout to 800ms for smoother experience
  };

  // Set initial collapsed state after component mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [setOpen]);

  // Cleanup timeouts on component unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Sidebar 
      className="border-r border-gray-200 dark:border-gray-700 transition-all duration-300"
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-corporate-peach-500 font-semibold">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`cursor-pointer hover:bg-corporate-peach-100 dark:hover:bg-corporate-peach-500/20 transition-colors ${
                      activeMenu === item.id ? 'bg-corporate-peach-200 dark:bg-corporate-peach-500/30 text-corporate-peach-700 dark:text-corporate-peach-300' : ''
                    }`}
                    onClick={() => onMenuClick(item.id)}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
