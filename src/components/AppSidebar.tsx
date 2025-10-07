
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
import { Package, Search, Shield, Settings, User, LayoutDashboard, UserPlus, Database } from 'lucide-react';
import { ModuleType } from './TopRibbon';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    id: 'dashboard'
  },
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
  selectedModule?: ModuleType;
}

export function AppSidebar({ activeMenu, onMenuClick, selectedModule = 'trade-finance' }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Define menu items based on selected module
  const getMenuItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        id: 'dashboard'
      },
      {
        title: 'Product Suite',
        icon: Package,
        id: 'product-suite'
      }
    ];

    // Add SCF-specific menu items
    if (selectedModule === 'supply-chain-finance') {
      baseItems.push(
        {
          title: 'Master Set-up',
          icon: Database,
          id: 'master-setup'
        }
      );
    }

    // Add common items
    baseItems.push(
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
    );

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar 
      className="border-r border-sidebar-border transition-all duration-300 bg-sidebar shadow-lg"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <SidebarTrigger className="text-sidebar-primary hover:text-sidebar-primary/80 hover:bg-sidebar-accent/50 rounded-md transition-all duration-200" />
            {!isCollapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground font-semibold text-sm tracking-wide ml-2">
                Main Navigation
              </SidebarGroupLabel>
            )}
          </div>
          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`cursor-pointer transition-all duration-200 rounded-lg p-3 ${
                      activeMenu === item.id 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md transform scale-105' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm'
                    }`}
                    onClick={() => onMenuClick(item.id)}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm tracking-wide">
                        {item.title}
                      </span>
                    )}
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
