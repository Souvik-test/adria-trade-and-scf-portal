
import React, { useState, useEffect } from 'react';
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
import { Package, Search, Shield, Settings, User } from 'lucide-react';

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
  const [collapseTimeout, setCollapseTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle mouse enter event
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isCollapsed) {
      setOpen(true);
    }
    
    // Clear any existing timeout
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Set timeout to collapse sidebar after delay
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 300); // Small delay to make the animation smoother
    
    setCollapseTimeout(timeout);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (collapseTimeout) {
        clearTimeout(collapseTimeout);
      }
    };
  }, [collapseTimeout]);

  // Set initial collapsed state after component mount
  useEffect(() => {
    // Wait a moment before collapsing to let initial render complete
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [setOpen]);

  return (
    <Sidebar 
      className="border-r border-gray-200 transition-all duration-300"
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
