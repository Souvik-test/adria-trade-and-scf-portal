
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
      className="border-r border-gray-200 transition-all duration-300"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-corporate-blue font-semibold">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`cursor-pointer hover:bg-corporate-blue/10 transition-colors ${
                      activeMenu === item.id ? 'bg-corporate-blue/20 text-corporate-blue' : ''
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
