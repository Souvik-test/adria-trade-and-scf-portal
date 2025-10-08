
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
import { Package, Search, Shield, Settings, User, LayoutDashboard, Database, ChevronDown, Sliders, UserPlus, Landmark, Link, FileType, FileText, Cog, Calendar, FileSearch, FolderSearch, MessageSquareText, BarChart3, ShieldCheck, History, FileCheck, HelpCircle, Ticket, BookOpen, GraduationCap } from 'lucide-react';
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
  const [inquiryOpen, setInquiryOpen] = React.useState(false);
  const [auditComplianceOpen, setAuditComplianceOpen] = React.useState(false);
  const [supportOpen, setSupportOpen] = React.useState(false);

  // Define menu items based on selected module
  const getMenuItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        id: 'dashboard',
        tooltip: 'View key metrics and performance overview'
      },
      {
        title: 'Product Suite',
        icon: Package,
        id: 'product-suite',
        tooltip: 'Access all available trade finance products and services'
      },
      {
        title: 'Inquiry and Reports',
        icon: Search,
        id: 'inquiry',
        tooltip: 'Search transactions, documents, and generate reports',
        subMenus: [
          { id: 'transaction-inquiry', title: 'Transaction Inquiry', icon: FileSearch, tooltip: 'Search and view transaction history and details' },
          { id: 'document-inquiry', title: 'Document Inquiry', icon: FolderSearch, tooltip: 'Search and retrieve document records and archives' },
          { id: 'swift-message-inquiry', title: 'SWIFT / Message Inquiry', icon: MessageSquareText, tooltip: 'Query SWIFT messages and communication logs' },
          { id: 'custom-reports', title: 'Custom Reports', icon: BarChart3, tooltip: 'Generate and download customized reports' }
        ]
      },
      {
        title: 'Secured Correspondence',
        icon: Shield,
        id: 'correspondence',
        tooltip: 'Manage secure communications and encrypted messages'
      },
      {
        title: 'Audit & Compliance',
        icon: ShieldCheck,
        id: 'audit-compliance',
        tooltip: 'Access audit trails and compliance documentation',
        subMenus: [
          { id: 'audit-trail-inquiry', title: 'Audit Trail Inquiry', icon: History, tooltip: 'View detailed audit logs and system activity history' },
          { id: 'compliance-certificates', title: 'Compliance Certificates', icon: FileCheck, tooltip: 'Manage and download compliance certificates and reports' }
        ]
      },
      {
        title: 'Support & Assistance',
        icon: HelpCircle,
        id: 'support-assistance',
        tooltip: 'Get help and access learning resources',
        subMenus: [
          { id: 'helpdesk-raise-ticket', title: 'Helpdesk / Raise Ticket', icon: Ticket, tooltip: 'Submit support tickets and track resolution status' },
          { id: 'knowledge-base', title: 'Knowledge Base', icon: BookOpen, tooltip: 'Browse help articles and documentation' },
          { id: 'walkthrough-tutorials', title: 'Walkthrough & Tutorials', icon: GraduationCap, tooltip: 'Access step-by-step guides and video tutorials' }
        ]
      }
    ];

    return baseItems;
  };

  const menuItems = getMenuItems();

  const controlCenterSubMenus = [
    { id: 'product-definition', title: 'Product Definition', icon: Package, tooltip: 'Define SCF products based on your business needs' },
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
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      {!isCollapsed && (
                        <TooltipContent side="top" className="z-50">
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
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

                {/* Inquiry and Reports Menu */}
                <Collapsible open={inquiryOpen} onOpenChange={setInquiryOpen}>
                  <SidebarMenuItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={isCollapsed ? 'Inquiry and Reports' : undefined}
                            className="cursor-pointer transition-all duration-200 rounded-lg p-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm w-full"
                          >
                            <Search className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="font-medium text-sm tracking-wide flex-1">Inquiry and Reports</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${inquiryOpen ? 'rotate-180' : ''}`} />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </TooltipTrigger>
                      {!isCollapsed && (
                        <TooltipContent side="top" className="z-50">
                          <p>Search transactions, documents, and generate reports</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menuItems[2].subMenus?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton
                                  className={`cursor-pointer pl-4 whitespace-normal break-words min-w-0 ${
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
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Secured Correspondence */}
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={isCollapsed ? 'Secured Correspondence' : undefined}
                        className={`cursor-pointer transition-all duration-200 rounded-lg p-3 ${
                          activeMenu === 'correspondence' 
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md transform scale-105' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm'
                        }`}
                        onClick={() => onMenuClick('correspondence')}
                      >
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium text-sm tracking-wide">
                            Secured Correspondence
                          </span>
                        )}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {!isCollapsed && (
                      <TooltipContent side="top" className="z-50">
                        <p>Manage secure communications and encrypted messages</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>

                {/* Audit & Compliance Menu */}
                <Collapsible open={auditComplianceOpen} onOpenChange={setAuditComplianceOpen}>
                  <SidebarMenuItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={isCollapsed ? 'Audit & Compliance' : undefined}
                            className="cursor-pointer transition-all duration-200 rounded-lg p-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm w-full"
                          >
                            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="font-medium text-sm tracking-wide flex-1">Audit & Compliance</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${auditComplianceOpen ? 'rotate-180' : ''}`} />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </TooltipTrigger>
                      {!isCollapsed && (
                        <TooltipContent side="top" className="z-50">
                          <p>Access audit trails and compliance documentation</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menuItems[4].subMenus?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton
                                  className={`cursor-pointer pl-4 whitespace-normal break-words min-w-0 ${
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
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Support & Assistance Menu */}
                <Collapsible open={supportOpen} onOpenChange={setSupportOpen}>
                  <SidebarMenuItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={isCollapsed ? 'Support & Assistance' : undefined}
                            className="cursor-pointer transition-all duration-200 rounded-lg p-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm w-full"
                          >
                            <HelpCircle className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="font-medium text-sm tracking-wide flex-1">Support & Assistance</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${supportOpen ? 'rotate-180' : ''}`} />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </TooltipTrigger>
                      {!isCollapsed && (
                        <TooltipContent side="top" className="z-50">
                          <p>Get help and access learning resources</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menuItems[5].subMenus?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton
                                  className={`cursor-pointer pl-4 whitespace-normal break-words min-w-0 ${
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
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
