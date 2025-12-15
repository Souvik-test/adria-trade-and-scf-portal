import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Search, Shield, Users, Save, Loader2, KeyRound, Layout, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ManagedUser {
  id: string;
  user_id: string;
  user_login_id: string;
  full_name: string;
  business_applications: string[];
  is_super_user: boolean;
  created_at: string;
}

interface PermissionRow {
  module_code: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
  stage_name: string;
  is_maker: boolean;
  is_viewer: boolean;
  is_checker: boolean;
}

interface ProductEventOption {
  module_code: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
}

const BUSINESS_APPLICATIONS = [
  'Adria TSCF Client',
  'Adria Process Orchestrator',
  'Adria TSCF Bank'
];

const WORKFLOW_STAGES = ['Data Entry', 'Limit Check', 'Approval', '__ALL__'];

// Screen access configuration
const SCREEN_ACCESS_CONFIG = {
  dashboard: { label: 'Dashboard', items: ['Home Dashboard', 'Analytics Dashboard'] },
  controlCentre: { 
    label: 'Control Centre', 
    items: [
      'Dynamic Form Engine',
      'Product Event Mapping',
      'Manage Panes and Sections',
      'Field Definition',
      'NextGen Workflow Configurator',
      'Posting Configuration',
      'Business Validation Engine',
      'Fee Engine',
      'Document Template Engine',
      'Notification Configuration',
      'Exchange Rate Maintenance'
    ]
  },
  administration: { 
    label: 'Administration', 
    items: ['User Access Management', 'Customer On-boarding', 'Holiday Maintenance', 'Platform Configuration']
  },
  foundationalData: {
    label: 'Foundational Data Library',
    items: ['Country Master', 'State Master', 'City Master', 'Currency', 'Bank Directory', 'Incoterms', 'Goods/Commodity', 'Ports', 'Pre-Defined Narrations', 'Tax Codes']
  },
  inquiryReports: { 
    label: 'Inquiry & Reports', 
    items: ['Transaction Inquiry', 'Audit Reports', 'User Activity Logs', 'System Reports']
  }
};

interface ScreenPermission {
  category: string;
  screen: string;
  can_access: boolean;
}

const UserAccessManagement: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // User management state
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // User form state
  const [formUserId, setFormUserId] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formBusinessApps, setFormBusinessApps] = useState<string[]>([]);
  const [formIsSuperUser, setFormIsSuperUser] = useState(false);
  
  // Permission matrix state
  const [productEvents, setProductEvents] = useState<ProductEventOption[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');
  const [screenPermissions, setScreenPermissions] = useState<ScreenPermission[]>([]);
  
  // Collapsible states
  const [userSectionOpen, setUserSectionOpen] = useState(true);
  const [permissionSectionOpen, setPermissionSectionOpen] = useState(true);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      const session = customAuth.getSession();
      if (!session?.user?.id) {
        toast({ title: 'Error', description: 'Not authenticated', variant: 'destructive' });
        return;
      }

      // Use session user ID directly (RLS may block direct query)
      setCurrentUserId(session.user.id);
      setIsSuperUser(true); // All users who can access Control Centre have full access

      // Load users and product-event mappings for all authorized users
      await Promise.all([loadUsers(), loadProductEvents()]);
    } catch (error) {
      console.error('Error initializing:', error);
      toast({ title: 'Error', description: 'Failed to initialize', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    // Use security definer function to bypass RLS
    const { data, error } = await supabase.rpc('get_all_custom_users');

    if (error) {
      console.error('Error loading users:', error);
      return;
    }

    setUsers((data as any[])?.map(u => ({
      ...u,
      business_applications: u.business_applications || []
    })) || []);
  };

  const loadProductEvents = async () => {
    const { data, error } = await (supabase
      .from('product_event_mapping') as any)
      .select('module_code, product_code, product_name, event_code, event_name')
      .order('module_code');

    if (error) {
      console.error('Error loading product events:', error);
      return;
    }

    console.log('Loaded product events:', data);
    setProductEvents(data || []);
  };

  const initializeScreenPermissions = (user: ManagedUser) => {
    const permissions: ScreenPermission[] = [];
    Object.entries(SCREEN_ACCESS_CONFIG).forEach(([category, config]) => {
      config.items.forEach(screen => {
        permissions.push({
          category: config.label,
          screen,
          can_access: user.is_super_user || false
        });
      });
    });
    setScreenPermissions(permissions);
  };

  const loadUserPermissions = async (userId: string) => {
    if (!currentUserId) return;

    const { data, error } = await supabase.rpc('get_user_permission_matrix', {
      p_requesting_user_id: currentUserId,
      p_target_user_id: userId
    }) as { data: any[] | null; error: any };

    if (error) {
      console.error('Error loading permissions:', error);
      return;
    }

    // Build full permission matrix with all product-event-stage combinations
    const fullMatrix: PermissionRow[] = [];
    
    productEvents.forEach(pe => {
      WORKFLOW_STAGES.forEach(stage => {
        const existing = data?.find(
          (p: any) => p.product_code === pe.product_code && 
                p.event_code === pe.event_code && 
                p.stage_name === stage
        );
        
        fullMatrix.push({
          module_code: pe.module_code,
          product_code: pe.product_code,
          product_name: pe.product_name,
          event_code: pe.event_code,
          event_name: pe.event_name,
          stage_name: stage,
          is_maker: existing?.is_maker || false,
          is_viewer: existing?.is_viewer || false,
          is_checker: existing?.is_checker || false
        });
      });
    });

    setPermissions(fullMatrix);
  };

  const handleUserSelect = async (user: ManagedUser) => {
    setSelectedUser(user);
    await loadUserPermissions(user.id);
    initializeScreenPermissions(user);
    setPermissionSectionOpen(true);
  };

  const openPermissionDialog = async (user: ManagedUser) => {
    setSelectedUser(user);
    await loadUserPermissions(user.id);
    initializeScreenPermissions(user);
    setPermissionDialogOpen(true);
  };

  const toggleScreenPermission = (index: number) => {
    if (selectedUser?.is_super_user) return;
    const updated = [...screenPermissions];
    updated[index] = { ...updated[index], can_access: !updated[index].can_access };
    setScreenPermissions(updated);
  };

  const selectAllScreenCategory = (category: string, value: boolean) => {
    if (selectedUser?.is_super_user) return;
    setScreenPermissions(screenPermissions.map(sp => 
      sp.category === category ? { ...sp, can_access: value } : sp
    ));
  };

  const openCreateUserDialog = () => {
    setEditingUser(null);
    setFormUserId('');
    setFormFullName('');
    setFormPassword('');
    setFormBusinessApps([]);
    setFormIsSuperUser(false);
    setUserDialogOpen(true);
  };

  const openEditUserDialog = (user: ManagedUser) => {
    setEditingUser(user);
    setFormUserId(user.user_id);
    setFormFullName(user.full_name);
    setFormPassword('');
    setFormBusinessApps(user.business_applications || []);
    setFormIsSuperUser(user.is_super_user || false);
    setUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!currentUserId) return;

    if (!formUserId.trim() || !formFullName.trim()) {
      toast({ title: 'Validation Error', description: 'User ID and Full Name are required', variant: 'destructive' });
      return;
    }

    if (!editingUser && !formPassword.trim()) {
      toast({ title: 'Validation Error', description: 'Password is required for new users', variant: 'destructive' });
      return;
    }

    try {
      setSavingUser(true);

      if (editingUser) {
        // Update existing user
        const { error } = await supabase.rpc('update_custom_user', {
          p_requesting_user_id: currentUserId,
          p_target_user_id: editingUser.id,
          p_full_name: formFullName,
          p_business_applications: formBusinessApps,
          p_is_super_user: formIsSuperUser,
          p_password_hash: formPassword.trim() ? formPassword : null
        });

        if (error) throw error;
        toast({ title: 'Success', description: 'User updated successfully' });
      } else {
        // Create new user
        const { error } = await supabase.rpc('create_custom_user', {
          p_requesting_user_id: currentUserId,
          p_user_id: formUserId,
          p_user_login_id: formUserId,
          p_full_name: formFullName,
          p_password_hash: formPassword,
          p_business_applications: formBusinessApps,
          p_is_super_user: formIsSuperUser
        });

        if (error) throw error;
        toast({ title: 'Success', description: 'User created successfully' });
      }

      setUserDialogOpen(false);
      await loadUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save user', variant: 'destructive' });
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    if (!currentUserId) return;
    if (!confirm(`Are you sure you want to delete user "${user.full_name}"?`)) return;

    try {
      const { error } = await supabase.rpc('delete_custom_user', {
        p_requesting_user_id: currentUserId,
        p_target_user_id: user.id
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'User deleted successfully' });
      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
        setPermissions([]);
      }
      await loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({ title: 'Error', description: error.message || 'Failed to delete user', variant: 'destructive' });
    }
  };

  const togglePermission = (index: number, field: 'is_maker' | 'is_viewer' | 'is_checker') => {
    if (selectedUser?.is_super_user) return;
    
    const updated = [...permissions];
    updated[index] = { ...updated[index], [field]: !updated[index][field] };
    setPermissions(updated);
  };

  const selectAllColumn = (field: 'is_maker' | 'is_viewer' | 'is_checker') => {
    if (selectedUser?.is_super_user) return;
    
    const allChecked = permissions.every(p => p[field]);
    setPermissions(permissions.map(p => ({ ...p, [field]: !allChecked })));
  };

  const handleSavePermissions = async () => {
    if (!currentUserId || !selectedUser) return;

    try {
      setSavingPermissions(true);

      // Filter only permissions that have at least one role checked
      const activePermissions = permissions
        .filter(p => p.is_maker || p.is_viewer || p.is_checker)
        .map(p => ({
          module_code: p.module_code,
          product_code: p.product_code,
          event_code: p.event_code,
          stage_name: p.stage_name,
          is_maker: p.is_maker,
          is_viewer: p.is_viewer,
          is_checker: p.is_checker
        }));

      const { error } = await supabase.rpc('bulk_upsert_user_permissions', {
        p_requesting_user_id: currentUserId,
        p_target_user_id: selectedUser.id,
        p_permissions: activePermissions
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Permissions saved successfully' });
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save permissions', variant: 'destructive' });
    } finally {
      setSavingPermissions(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.user_id.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredPermissions = permissions.filter(p =>
    p.product_name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
    p.event_name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
    p.product_code.toLowerCase().includes(permissionSearchTerm.toLowerCase())
  );

  const getBusinessAppsDisplay = (apps: string[]) => {
    if (!apps || apps.length === 0) return 'None';
    if (apps.length === BUSINESS_APPLICATIONS.length) return 'All';
    return apps.map(a => a.replace('Adria ', '').replace('TSCF ', '')).join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">User Access Management</h1>
          <p className="text-muted-foreground">Manage users and role assignments</p>
        </div>
      </div>

      {/* Section 1: User Management */}
      <Collapsible open={userSectionOpen} onOpenChange={setUserSectionOpen}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {userSectionOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <CardTitle className="text-lg">User Management</CardTitle>
              </div>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); openCreateUserDialog(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Business Applications</TableHead>
                      <TableHead>Super User</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id} 
                        className={`cursor-pointer ${selectedUser?.id === user.id ? 'bg-accent' : ''}`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <TableCell className="font-medium">{user.user_id}</TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {getBusinessAppsDisplay(user.business_applications)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.is_super_user && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                              Super User
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); openPermissionDialog(user); }}
                            title="Manage Permissions"
                          >
                            <KeyRound className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditUserDialog(user); }} title="Edit User">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }} title="Delete User">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Permission Management Dialog */}
      <Dialog open={permissionDialogOpen} onOpenChange={setPermissionDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Manage Permissions: {selectedUser?.full_name}
            </DialogTitle>
            <DialogDescription>
              Configure product-event and screen access permissions for this user
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={selectedUser?.is_super_user || false}
                disabled
              />
              <Label className="text-sm">
                Super User {selectedUser?.is_super_user && '(All permissions granted)'}
              </Label>
            </div>
          </div>

          <Tabs defaultValue="product-events" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="product-events" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Product-Event Permissions
              </TabsTrigger>
              <TabsTrigger value="screen-access" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Screen Access
              </TabsTrigger>
            </TabsList>
            
            {/* Tab 1: Product-Event Permissions */}
            <TabsContent value="product-events" className="flex-1 min-h-0 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product or event..."
                    value={permissionSearchTerm}
                    onChange={(e) => setPermissionSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                
                {!selectedUser?.is_super_user && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Select All:</span>
                    <Button variant="outline" size="sm" onClick={() => selectAllColumn('is_maker')}>
                      Maker
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => selectAllColumn('is_viewer')}>
                      Viewer
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => selectAllColumn('is_checker')}>
                      Checker
                    </Button>
                  </div>
                )}
              </div>

              <ScrollArea className="h-[350px] border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[100px]">Module</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-center w-[80px]">Maker</TableHead>
                      <TableHead className="text-center w-[80px]">Viewer</TableHead>
                      <TableHead className="text-center w-[80px]">Checker</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((perm, index) => (
                      <TableRow key={`${perm.product_code}-${perm.event_code}-${perm.stage_name}`}>
                        <TableCell>
                          <Badge variant="outline">{perm.module_code}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{perm.product_name}</TableCell>
                        <TableCell>{perm.event_name}</TableCell>
                        <TableCell>
                          <span className={perm.stage_name === '__ALL__' ? 'font-semibold text-primary' : ''}>
                            {perm.stage_name === '__ALL__' ? 'All Stages' : perm.stage_name}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedUser?.is_super_user || perm.is_maker}
                            disabled={selectedUser?.is_super_user}
                            onCheckedChange={() => togglePermission(index, 'is_maker')}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedUser?.is_super_user || perm.is_viewer}
                            disabled={selectedUser?.is_super_user}
                            onCheckedChange={() => togglePermission(index, 'is_viewer')}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedUser?.is_super_user || perm.is_checker}
                            disabled={selectedUser?.is_super_user}
                            onCheckedChange={() => togglePermission(index, 'is_checker')}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPermissions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          {productEvents.length === 0 
                            ? 'No product-event mappings configured' 
                            : 'No matching permissions found'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            
            {/* Tab 2: Screen Access Permissions */}
            <TabsContent value="screen-access" className="flex-1 min-h-0">
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  {Object.entries(SCREEN_ACCESS_CONFIG).map(([key, config]) => {
                    const categoryPermissions = screenPermissions.filter(sp => sp.category === config.label);
                    const allChecked = categoryPermissions.every(sp => sp.can_access);
                    
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            {key === 'dashboard' && <Layout className="h-4 w-4" />}
                            {key === 'controlCentre' && <Settings className="h-4 w-4" />}
                            {key === 'administration' && <Users className="h-4 w-4" />}
                            {key === 'foundationalData' && <Shield className="h-4 w-4" />}
                            {key === 'inquiryReports' && <Search className="h-4 w-4" />}
                            {config.label}
                          </h4>
                          {!selectedUser?.is_super_user && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => selectAllScreenCategory(config.label, !allChecked)}
                            >
                              {allChecked ? 'Deselect All' : 'Select All'}
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {config.items.map((screen) => {
                            const permIndex = screenPermissions.findIndex(
                              sp => sp.category === config.label && sp.screen === screen
                            );
                            const perm = screenPermissions[permIndex];
                            
                            return (
                              <div key={screen} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
                                <Checkbox
                                  id={`screen-${key}-${screen}`}
                                  checked={selectedUser?.is_super_user || perm?.can_access || false}
                                  disabled={selectedUser?.is_super_user}
                                  onCheckedChange={() => permIndex >= 0 && toggleScreenPermission(permIndex)}
                                />
                                <Label 
                                  htmlFor={`screen-${key}-${screen}`} 
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {screen}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setPermissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={savingPermissions || selectedUser?.is_super_user}>
              {savingPermissions ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user details and access' : 'Create a new user with access credentials'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID *</Label>
              <Input
                id="userId"
                value={formUserId}
                onChange={(e) => setFormUserId(e.target.value)}
                placeholder="e.g., USR001"
                disabled={!!editingUser}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formFullName}
                onChange={(e) => setFormFullName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingUser ? '(leave blank to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Business Applications</Label>
              <div className="space-y-2 pt-1">
                {BUSINESS_APPLICATIONS.map((app) => (
                  <div key={app} className="flex items-center gap-2">
                    <Checkbox
                      id={app}
                      checked={formBusinessApps.includes(app)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormBusinessApps([...formBusinessApps, app]);
                        } else {
                          setFormBusinessApps(formBusinessApps.filter(a => a !== app));
                        }
                      }}
                    />
                    <Label htmlFor={app} className="text-sm font-normal cursor-pointer">
                      {app}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Switch
                id="superUser"
                checked={formIsSuperUser}
                onCheckedChange={setFormIsSuperUser}
              />
              <Label htmlFor="superUser" className="cursor-pointer">
                Super User (grants all permissions)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={savingUser}>
              {savingUser ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAccessManagement;
