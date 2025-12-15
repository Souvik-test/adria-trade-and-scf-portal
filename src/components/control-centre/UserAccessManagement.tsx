import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { Search, Plus, Edit, Trash2, Shield, Users, Settings, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ManagedUser {
  id: string;
  user_id: string;
  full_name: string;
  user_login_id: string;
  corporate_id: string;
  role_type: string | null;
  scf_role: string | null;
  is_super_user: boolean;
  created_at: string;
}

interface UserPermission {
  id: string;
  user_id: string;
  module_code: string;
  product_code: string;
  event_code: string;
  stage_name: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
}

interface ProductEventOption {
  module_code: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
}

const UserAccessManagement: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [productEvents, setProductEvents] = useState<ProductEventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [usersExpanded, setUsersExpanded] = useState(true);
  const [permissionsExpanded, setPermissionsExpanded] = useState(true);

  // New permission form state
  const [newPermission, setNewPermission] = useState({
    module_code: '',
    product_code: '',
    event_code: '',
    stage_name: '__ALL__',
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_approve: false,
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    const session = customAuth.getSession();
    if (!session?.user?.id) {
      toast.error('Please login to access this feature');
      setLoading(false);
      return;
    }

    setCurrentUserId(session.user.id);

    // Check if current user is super user
    const { data: userData } = await supabase
      .from('custom_users')
      .select('is_super_user')
      .eq('id', session.user.id)
      .single();

    if (userData?.is_super_user) {
      setIsSuperUser(true);
      await loadUsers(session.user.id);
      await loadProductEvents();
    } else {
      setIsSuperUser(false);
      toast.error('Super user privileges required to access this feature');
    }

    setLoading(false);
  };

  const loadUsers = async (requestingUserId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_all_managed_users', {
        p_requesting_user_id: requestingUserId
      });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users: ' + error.message);
    }
  };

  const loadProductEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('product_event_mapping')
        .select('module_code, product_code, product_name, event_code, event_name')
        .order('module_code')
        .order('product_code')
        .order('event_code');

      if (error) throw error;
      setProductEvents(data || []);
    } catch (error: any) {
      console.error('Error loading product events:', error);
    }
  };

  const loadUserPermissions = async (targetUserId: string) => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        p_requesting_user_id: currentUserId,
        p_target_user_id: targetUserId
      });

      if (error) throw error;
      setUserPermissions(data || []);
    } catch (error: any) {
      console.error('Error loading permissions:', error);
      toast.error('Failed to load permissions: ' + error.message);
    }
  };

  const handleUserSelect = async (user: ManagedUser) => {
    setSelectedUser(user);
    await loadUserPermissions(user.id);
  };

  const handleToggleSuperUser = async (user: ManagedUser) => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase.rpc('update_super_user_status', {
        p_requesting_user_id: currentUserId,
        p_target_user_id: user.id,
        p_is_super_user: !user.is_super_user
      });

      if (error) throw error;

      toast.success(`Super user status ${!user.is_super_user ? 'granted' : 'revoked'} for ${user.full_name}`);
      await loadUsers(currentUserId);
    } catch (error: any) {
      console.error('Error updating super user status:', error);
      toast.error('Failed to update super user status: ' + error.message);
    }
  };

  const handleAddPermission = async () => {
    if (!currentUserId || !selectedUser) return;

    if (!newPermission.module_code || !newPermission.product_code || !newPermission.event_code) {
      toast.error('Please select module, product, and event');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('upsert_user_permission', {
        p_requesting_user_id: currentUserId,
        p_target_user_id: selectedUser.id,
        p_module_code: newPermission.module_code,
        p_product_code: newPermission.product_code,
        p_event_code: newPermission.event_code,
        p_stage_name: newPermission.stage_name || '__ALL__',
        p_can_view: newPermission.can_view,
        p_can_create: newPermission.can_create,
        p_can_edit: newPermission.can_edit,
        p_can_delete: newPermission.can_delete,
        p_can_approve: newPermission.can_approve
      });

      if (error) throw error;

      toast.success('Permission added successfully');
      setIsPermissionDialogOpen(false);
      resetNewPermission();
      await loadUserPermissions(selectedUser.id);
    } catch (error: any) {
      console.error('Error adding permission:', error);
      toast.error('Failed to add permission: ' + error.message);
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!currentUserId || !selectedUser) return;

    try {
      const { data, error } = await supabase.rpc('delete_user_permissions', {
        p_requesting_user_id: currentUserId,
        p_permission_ids: [permissionId]
      });

      if (error) throw error;

      toast.success('Permission deleted');
      await loadUserPermissions(selectedUser.id);
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      toast.error('Failed to delete permission: ' + error.message);
    }
  };

  const resetNewPermission = () => {
    setNewPermission({
      module_code: '',
      product_code: '',
      event_code: '',
      stage_name: '__ALL__',
      can_view: false,
      can_create: false,
      can_edit: false,
      can_delete: false,
      can_approve: false,
    });
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_login_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueModules = [...new Set(productEvents.map(pe => pe.module_code))];
  const filteredProducts = productEvents.filter(pe => pe.module_code === newPermission.module_code);
  const uniqueProducts = [...new Map(filteredProducts.map(pe => [pe.product_code, pe])).values()];
  const filteredEvents = productEvents.filter(
    pe => pe.module_code === newPermission.module_code && pe.product_code === newPermission.product_code
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSuperUser) {
    return (
      <div className="p-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              Super user privileges are required to access User Access Management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Access Management</h1>
          <p className="text-muted-foreground">Manage user permissions for modules, products, and events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <Collapsible open={usersExpanded} onOpenChange={setUsersExpanded}>
            <Card>
              <CardHeader className="pb-3">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Users
                  </CardTitle>
                  {usersExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">{user.user_login_id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.is_super_user && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Super
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        {/* Permissions Panel */}
        <div className="lg:col-span-2">
          <Collapsible open={permissionsExpanded} onOpenChange={setPermissionsExpanded}>
            <Card>
              <CardHeader>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Permissions
                    </CardTitle>
                    {selectedUser && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Managing permissions for: <span className="font-medium">{selectedUser.full_name}</span>
                      </p>
                    )}
                  </div>
                  {permissionsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  {selectedUser ? (
                    <Tabs defaultValue="permissions" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        <TabsTrigger value="settings">User Settings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="permissions" className="space-y-4">
                        <div className="flex justify-end">
                          <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Permission
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Add Permission</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Module</Label>
                                  <Select
                                    value={newPermission.module_code}
                                    onValueChange={(value) => setNewPermission(prev => ({
                                      ...prev,
                                      module_code: value,
                                      product_code: '',
                                      event_code: ''
                                    }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {uniqueModules.map((module) => (
                                        <SelectItem key={module} value={module}>
                                          {module === 'TF' ? 'Trade Finance' : module === 'SCF' ? 'Supply Chain Finance' : module}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Product</Label>
                                  <Select
                                    value={newPermission.product_code}
                                    onValueChange={(value) => setNewPermission(prev => ({
                                      ...prev,
                                      product_code: value,
                                      event_code: ''
                                    }))}
                                    disabled={!newPermission.module_code}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {uniqueProducts.map((pe) => (
                                        <SelectItem key={pe.product_code} value={pe.product_code}>
                                          {pe.product_name} ({pe.product_code})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Event</Label>
                                  <Select
                                    value={newPermission.event_code}
                                    onValueChange={(value) => setNewPermission(prev => ({
                                      ...prev,
                                      event_code: value
                                    }))}
                                    disabled={!newPermission.product_code}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {filteredEvents.map((pe) => (
                                        <SelectItem key={pe.event_code} value={pe.event_code}>
                                          {pe.event_name} ({pe.event_code})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Stage (Optional)</Label>
                                  <Input
                                    value={newPermission.stage_name}
                                    onChange={(e) => setNewPermission(prev => ({
                                      ...prev,
                                      stage_name: e.target.value || '__ALL__'
                                    }))}
                                    placeholder="Leave blank for all stages"
                                  />
                                </div>

                                <div className="space-y-3">
                                  <Label>Permissions</Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {['view', 'create', 'edit', 'delete', 'approve'].map((perm) => (
                                      <div key={perm} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`perm-${perm}`}
                                          checked={newPermission[`can_${perm}` as keyof typeof newPermission] as boolean}
                                          onCheckedChange={(checked) => setNewPermission(prev => ({
                                            ...prev,
                                            [`can_${perm}`]: checked
                                          }))}
                                        />
                                        <Label htmlFor={`perm-${perm}`} className="capitalize text-sm">
                                          {perm}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddPermission}>
                                  Add Permission
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {userPermissions.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Module</TableHead>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Event</TableHead>
                                  <TableHead>Stage</TableHead>
                                  <TableHead>Permissions</TableHead>
                                  <TableHead className="w-12"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userPermissions.map((perm) => (
                                  <TableRow key={perm.id}>
                                    <TableCell className="font-medium">{perm.module_code}</TableCell>
                                    <TableCell>{perm.product_code}</TableCell>
                                    <TableCell>{perm.event_code}</TableCell>
                                    <TableCell>{perm.stage_name === '__ALL__' ? 'All' : perm.stage_name}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {perm.can_view && <Badge variant="outline" className="text-xs">View</Badge>}
                                        {perm.can_create && <Badge variant="outline" className="text-xs">Create</Badge>}
                                        {perm.can_edit && <Badge variant="outline" className="text-xs">Edit</Badge>}
                                        {perm.can_delete && <Badge variant="outline" className="text-xs">Delete</Badge>}
                                        {perm.can_approve && <Badge variant="outline" className="text-xs">Approve</Badge>}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeletePermission(perm.id)}
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No permissions configured for this user</p>
                            <p className="text-sm">Click "Add Permission" to get started</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="settings" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                              <Label className="text-base">Super User Status</Label>
                              <p className="text-sm text-muted-foreground">
                                Grant full access to all features and user management
                              </p>
                            </div>
                            <Switch
                              checked={selectedUser.is_super_user}
                              onCheckedChange={() => handleToggleSuperUser(selectedUser)}
                              disabled={selectedUser.id === currentUserId}
                            />
                          </div>

                          <div className="p-4 rounded-lg border space-y-2">
                            <Label className="text-base">User Details</Label>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">User ID</p>
                                <p className="font-medium">{selectedUser.user_id}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Login ID</p>
                                <p className="font-medium">{selectedUser.user_login_id}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Corporate ID</p>
                                <p className="font-medium">{selectedUser.corporate_id || '-'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Role Type</p>
                                <p className="font-medium">{selectedUser.role_type || '-'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Select a user to manage permissions</p>
                      <p className="text-sm">Choose a user from the list on the left</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default UserAccessManagement;
