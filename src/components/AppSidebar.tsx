
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Package, Search, Shield, Settings, User, LayoutDashboard, Database, ChevronDown, Sliders, UserPlus, Landmark, Link, FileType, FileText, Cog, Calendar } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [controlCenterOpen, setControlCenterOpen] = React.useState(false);
  const [administrationOpen, setAdministrationOpen] = React.useState(false);

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
      }
    ];

    return baseItems;
  };

  const menuItems = getMenuItems();

  const controlCenterSubMenus = [
    { id: 'program-configuration', title: 'Program Configuration', icon: Sliders, tooltip: 'Define eligibility, discount rates, and limits for financing programs' },
    { id: 'counter-party-onboarding', title: 'Counter-Party Onboarding', icon: UserPlus, tooltip: 'Manage supplier and buyer onboarding processes' },
    { id: 'bank-account-master', title: 'Bank Account Master', icon: Landmark, tooltip: 'Manage bank accounts used for disbursement or repayment' },
    { id: 'bank-integrations', title: 'Bank Integrations', icon: Link, tooltip: 'Link with multiple financiers for multi-banking setup' },
    { id: 'document-master', title: 'Document Master', icon: FileType, tooltip: 'Manage standard templates for invoices and documents' },
    { id: 'document-repository', title: 'Document Repository', icon: FileText, tooltip: 'Store and manage agreements, policies, and mandates' },
    { id: 'platform-configuration', title: 'Platform Configuration', icon: Cog, tooltip: 'Configure platform-wide settings and preferences' },
    { 
      id: 'administration', 
      title: 'Administration', 
      icon: User, 
      tooltip: 'Manage system administration and user settings',
      subMenus: [
        { id: 'user-management', title: 'User Management', icon: User, tooltip: 'Manage user accounts, roles, and permissions' },
        { id: 'holiday-maintenance', title: 'Holiday Maintenance', icon: Calendar, tooltip: 'Configure business holidays and non-working days' }
      ]
    }
  ];

  return (
    <TooltipProvider>
      <Sidebar 
        className={`border-r border-sidebar-border transition-all duration-300 bg-sidebar shadow-lg ${
          isCollapsed ? 'w-16' : 'w-80'
        }`}
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
                {menuItems.slice(0, 2).map((item) => (
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

                {/* Control Center Menu - Only for SCF - Place after Product Suite */}
                {selectedModule === 'supply-chain-finance' && (
                  <Collapsible open={controlCenterOpen} onOpenChange={setControlCenterOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={isCollapsed ? 'Control Center' : undefined}
                          className="cursor-pointer transition-all duration-200 rounded-lg p-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm w-full"
                        >
                          <Sliders className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="font-medium text-sm tracking-wide flex-1">Control Center</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${controlCenterOpen ? 'rotate-180' : ''}`} />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {controlCenterSubMenus.map((subItem) => (
                            <React.Fragment key={subItem.id}>
                              {subItem.subMenus ? (
                                <Collapsible open={administrationOpen} onOpenChange={setAdministrationOpen}>
                                  <SidebarMenuSubItem>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <CollapsibleTrigger asChild>
                                          <SidebarMenuSubButton className="cursor-pointer w-full">
                                            <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                            {!isCollapsed && <span className="flex-1">{subItem.title}</span>}
                                            {!isCollapsed && <ChevronDown className={`w-3 h-3 transition-transform ${administrationOpen ? 'rotate-180' : ''}`} />}
                                          </SidebarMenuSubButton>
                                        </CollapsibleTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="z-50">
                                        <p>{subItem.tooltip}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <CollapsibleContent>
                                       <SidebarMenuSub>
                                        {subItem.subMenus.map((nestedItem) => (
                                           <SidebarMenuSubItem key={nestedItem.id}>
                                             <Tooltip>
                                               <TooltipTrigger asChild>
                                                  <SidebarMenuSubButton
                                                    className={`cursor-pointer pl-4 whitespace-normal break-words min-w-0 ${
                                                      activeMenu === nestedItem.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                                    }`}
                                                    onClick={() => onMenuClick(nestedItem.id)}
                                                  >
                                                    <nestedItem.icon className="w-4 h-4 flex-shrink-0" />
                                                    {!isCollapsed && <span className="flex-1 whitespace-normal break-words overflow-wrap-anywhere">{nestedItem.title}</span>}
                                                  </SidebarMenuSubButton>
                                               </TooltipTrigger>
                                                <TooltipContent side="top" className="z-50">
                                                  <p>{nestedItem.tooltip}</p>
                                                </TooltipContent>
                                             </Tooltip>
                                           </SidebarMenuSubItem>
                                        ))}
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                  </SidebarMenuSubItem>
                                </Collapsible>
                              ) : (
                                <SidebarMenuSubItem>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SidebarMenuSubButton
                                        className={`cursor-pointer whitespace-normal break-words min-w-0 ${
                                          activeMenu === subItem.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                        }`}
                                        onClick={() => onMenuClick(subItem.id)}
                                      >
                                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                        {!isCollapsed && <span className="flex-1 whitespace-normal break-words overflow-wrap-anywhere">{subItem.title}</span>}
                                      </SidebarMenuSubButton>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="z-50">
                                      <p>{subItem.tooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </SidebarMenuSubItem>
                              )}
                            </React.Fragment>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )}

                {/* Remaining menu items after Control Center */}
                {menuItems.slice(2).map((item) => (
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
    </TooltipProvider>
  );
}
