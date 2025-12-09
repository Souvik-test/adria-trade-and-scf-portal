import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Upload, Download, Edit, Trash2, Search, ArrowRight } from 'lucide-react';

interface State {
  id: string;
  state_code_iso: string;
  state_name: string;
  country_code_iso2: string;
  status: boolean;
  created_by: string | null;
  created_at: string;
  modified_by: string | null;
  modified_at: string | null;
}

interface Country {
  id: string;
  country_code_iso2: string;
  country_name: string;
  status: boolean;
}

interface StateFormData {
  state_name: string;
  state_code_iso: string;
  country_code_iso2: string;
  status: boolean;
}

interface StateMasterProps {
  onNavigateToCity?: (stateCode: string, countryCode: string) => void;
  preSelectedCountry?: string;
}

const initialFormData: StateFormData = {
  state_name: '',
  state_code_iso: '',
  country_code_iso2: '',
  status: true
};

const StateMaster: React.FC<StateMasterProps> = ({ onNavigateToCity, preSelectedCountry }) => {
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StateFormData>(initialFormData);
  const [filterCountry, setFilterCountry] = useState<string>('all');

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (preSelectedCountry) {
      setFormData(prev => ({ ...prev, country_code_iso2: preSelectedCountry }));
    }
  }, [preSelectedCountry]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('state_master')
        .select('*')
        .order('state_name', { ascending: true });

      if (error) throw error;
      setStates((data as State[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch states',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('country_master')
        .select('id, country_code_iso2, country_name, status')
        .eq('status', true)
        .order('country_name', { ascending: true });

      if (error) throw error;
      setCountries((data as Country[]) || []);
    } catch (error: any) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      ...initialFormData,
      country_code_iso2: preSelectedCountry || ''
    });
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (state: State) => {
    setFormData({
      state_name: state.state_name,
      state_code_iso: state.state_code_iso,
      country_code_iso2: state.country_code_iso2,
      status: state.status
    });
    setIsEditing(true);
    setEditingId(state.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this state?')) return;
    
    try {
      const { error } = await supabase
        .from('state_master')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'State deleted successfully'
      });
      fetchStates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete state',
        variant: 'destructive'
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const session = customAuth.getSession();
      const userId = session?.user?.user_id;
      const { error } = await supabase
        .from('state_master')
        .update({ 
          status: !currentStatus,
          modified_by: userId || 'system',
          modified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `State ${!currentStatus ? 'enabled' : 'disabled'} successfully`
      });
      fetchStates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.state_name || !formData.state_code_iso || !formData.country_code_iso2) {
      toast({
        title: 'Validation Error',
        description: 'State name, state code, and country are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      const session = customAuth.getSession();
      const userId = session?.user?.id;
      const userDisplayId = session?.user?.user_id;

      if (isEditing && editingId) {
        const { error } = await supabase
          .from('state_master')
          .update({
            state_name: formData.state_name,
            state_code_iso: formData.state_code_iso.toUpperCase(),
            country_code_iso2: formData.country_code_iso2.toUpperCase(),
            status: formData.status,
            modified_by: userDisplayId || 'system',
            modified_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'State updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('state_master')
          .insert({
            state_name: formData.state_name,
            state_code_iso: formData.state_code_iso.toUpperCase(),
            country_code_iso2: formData.country_code_iso2.toUpperCase(),
            status: formData.status,
            user_id: userId || '',
            created_by: userDisplayId || 'system'
          });

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'State created successfully'
        });
      }

      setIsDialogOpen(false);
      fetchStates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save state',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadTemplate = () => {
    const template = 'state_name,state_code_iso,country_code_iso2,status\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state_master_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Template Downloaded',
      description: 'Use this template to upload states in bulk'
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const session = customAuth.getSession();
        const userId = session?.user?.id;
        const userDisplayId = session?.user?.user_id;
        
        const records = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const record: any = {};
          headers.forEach((header, index) => {
            record[header] = values[index] || null;
          });
          record.status = record.status === 'true' || record.status === '1' || record.status === 'enabled';
          record.user_id = userId || '';
          record.created_by = userDisplayId || 'system';
          if (record.state_code_iso) {
            record.state_code_iso = record.state_code_iso.toUpperCase();
          }
          if (record.country_code_iso2) {
            record.country_code_iso2 = record.country_code_iso2.toUpperCase();
          }
          return record;
        });

        const { error } = await supabase
          .from('state_master')
          .insert(records);

        if (error) throw error;

        toast({
          title: 'Upload Successful',
          description: `${records.length} states uploaded successfully`
        });
        fetchStates();
      } catch (error: any) {
        toast({
          title: 'Upload Failed',
          description: error.message || 'Failed to upload states',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.country_code_iso2 === countryCode);
    return country?.country_name || countryCode;
  };

  const filteredStates = states.filter(state => {
    const matchesSearch = 
      state.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.state_code_iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.country_code_iso2.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = filterCountry === 'all' || state.country_code_iso2 === filterCountry;
    
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.country_code_iso2}>
                  {country.country_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label htmlFor="state-file-upload">
            <input
              id="state-file-upload"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload .csv/.txt/.xls
              </span>
            </Button>
          </label>
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {/* States Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>State Code</TableHead>
              <TableHead>Country Code</TableHead>
              <TableHead>Country Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredStates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No states found. Create your first state or upload a CSV file.
                </TableCell>
              </TableRow>
            ) : (
              filteredStates.map((state) => (
                <TableRow key={state.id}>
                  <TableCell className="font-medium">{state.state_name}</TableCell>
                  <TableCell>{state.state_code_iso}</TableCell>
                  <TableCell>{state.country_code_iso2}</TableCell>
                  <TableCell>{getCountryName(state.country_code_iso2)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={state.status}
                      onCheckedChange={() => handleToggleStatus(state.id, state.status)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onNavigateToCity && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigateToCity(state.state_code_iso, state.country_code_iso2)}
                          className="text-primary"
                        >
                          Map City
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(state)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(state.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit State' : 'Create State'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country_code_iso2}
                onValueChange={(value) => setFormData({ ...formData, country_code_iso2: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.country_code_iso2}>
                      {country.country_name} ({country.country_code_iso2})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state_name">State Name *</Label>
              <Input
                id="state_name"
                value={formData.state_name}
                onChange={(e) => setFormData({ ...formData, state_name: e.target.value })}
                placeholder="e.g., Maharashtra"
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state_code_iso">State Code (ISO 3166-2) *</Label>
              <Input
                id="state_code_iso"
                value={formData.state_code_iso}
                onChange={(e) => setFormData({ ...formData, state_code_iso: e.target.value.toUpperCase() })}
                placeholder="e.g., IN-MH"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">Format: [CountryCode]-[SubdivisionCode]</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
              <Label htmlFor="status">Enabled</Label>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
            {!isEditing && onNavigateToCity && formData.state_code_iso && formData.country_code_iso2 && (
              <Button 
                variant="link" 
                onClick={() => {
                  handleSubmit();
                  onNavigateToCity(formData.state_code_iso, formData.country_code_iso2);
                }}
              >
                Map City <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StateMaster;
