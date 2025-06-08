
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      className="border-r border-gray-200 transition-all duration-300 bg-white dark:bg-gray-900"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between p-2">
            <SidebarTrigger className="text-corporate-teal-500 hover:text-corporate-teal-600 hover:bg-corporate-teal-50 dark:text-corporate-teal-400 dark:hover:text-corporate-teal-300 dark:hover:bg-corporate-teal-800" />
            {!isCollapsed && (
              <SidebarGroupLabel className="text-corporate-teal-500 dark:text-corporate-teal-400 font-semibold ml-2">
                Main Menu
              </SidebarGroupLabel>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`cursor-pointer hover:bg-corporate-teal-50 dark:hover:bg-corporate-teal-800 transition-colors ${
                      activeMenu === item.id 
                        ? 'bg-corporate-teal-100 dark:bg-corporate-teal-700 text-corporate-teal-700 dark:text-corporate-teal-300' 
                        : 'text-gray-600 dark:text-gray-400'
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
