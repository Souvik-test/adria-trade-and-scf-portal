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
import { Plus, Upload, Download, Edit, Trash2, Search } from 'lucide-react';

interface City {
  id: string;
  city_code: string;
  city_name: string;
  state_code_iso: string;
  country_code_iso2: string;
  latitude: number | null;
  longitude: number | null;
  status: boolean;
  created_by: string | null;
  created_at: string;
  modified_by: string | null;
  modified_at: string | null;
}

interface State {
  id: string;
  state_code_iso: string;
  state_name: string;
  country_code_iso2: string;
  status: boolean;
}

interface CityFormData {
  city_name: string;
  city_code: string;
  state_code_iso: string;
  country_code_iso2: string;
  latitude: string;
  longitude: string;
  status: boolean;
}

interface CityMasterProps {
  preSelectedState?: string;
  preSelectedCountry?: string;
}

const initialFormData: CityFormData = {
  city_name: '',
  city_code: '',
  state_code_iso: '',
  country_code_iso2: '',
  latitude: '',
  longitude: '',
  status: true
};

const CityMaster: React.FC<CityMasterProps> = ({ preSelectedState, preSelectedCountry }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CityFormData>(initialFormData);
  const [filterState, setFilterState] = useState<string>('all');

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  useEffect(() => {
    if (preSelectedState && preSelectedCountry) {
      setFormData(prev => ({
        ...prev,
        state_code_iso: preSelectedState,
        country_code_iso2: preSelectedCountry
      }));
      setFilterState(preSelectedState);
    }
  }, [preSelectedState, preSelectedCountry]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('city_master')
        .select('*')
        .order('city_name', { ascending: true });

      if (error) throw error;
      setCities((data as City[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch cities',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const { data, error } = await supabase
        .from('state_master')
        .select('id, state_code_iso, state_name, country_code_iso2, status')
        .eq('status', true)
        .order('state_name', { ascending: true });

      if (error) throw error;
      setStates((data as State[]) || []);
    } catch (error: any) {
      console.error('Failed to fetch states:', error);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      ...initialFormData,
      state_code_iso: preSelectedState || '',
      country_code_iso2: preSelectedCountry || ''
    });
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (city: City) => {
    setFormData({
      city_name: city.city_name,
      city_code: city.city_code,
      state_code_iso: city.state_code_iso,
      country_code_iso2: city.country_code_iso2,
      latitude: city.latitude?.toString() || '',
      longitude: city.longitude?.toString() || '',
      status: city.status
    });
    setIsEditing(true);
    setEditingId(city.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;
    
    try {
      const { error } = await supabase
        .from('city_master')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'City deleted successfully'
      });
      fetchCities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete city',
        variant: 'destructive'
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const session = customAuth.getSession();
      const userId = session?.user?.user_id;
      const { error } = await supabase
        .from('city_master')
        .update({ 
          status: !currentStatus,
          modified_by: userId || 'system',
          modified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `City ${!currentStatus ? 'enabled' : 'disabled'} successfully`
      });
      fetchCities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleStateChange = (stateCode: string) => {
    const selectedState = states.find(s => s.state_code_iso === stateCode);
    setFormData({
      ...formData,
      state_code_iso: stateCode,
      country_code_iso2: selectedState?.country_code_iso2 || ''
    });
  };

  const handleSubmit = async () => {
    if (!formData.city_name || !formData.city_code || !formData.state_code_iso) {
      toast({
        title: 'Validation Error',
        description: 'City name, city code, and state are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      const session = customAuth.getSession();
      const userId = session?.user?.id;
      const userDisplayId = session?.user?.user_id;

      const cityData = {
        city_name: formData.city_name,
        city_code: formData.city_code.toUpperCase(),
        state_code_iso: formData.state_code_iso.toUpperCase(),
        country_code_iso2: formData.country_code_iso2.toUpperCase(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        status: formData.status
      };

      if (isEditing && editingId) {
        const { error } = await supabase
          .from('city_master')
          .update({
            ...cityData,
            modified_by: userDisplayId || 'system',
            modified_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'City updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('city_master')
          .insert({
            ...cityData,
            user_id: userId || '',
            created_by: userDisplayId || 'system'
          });

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'City created successfully'
        });
      }

      setIsDialogOpen(false);
      fetchCities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save city',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadTemplate = () => {
    const template = 'city_name,city_code,state_code_iso,country_code_iso2,latitude,longitude,status\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'city_master_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Template Downloaded',
      description: 'Use this template to upload cities in bulk'
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
          if (record.city_code) {
            record.city_code = record.city_code.toUpperCase();
          }
          if (record.state_code_iso) {
            record.state_code_iso = record.state_code_iso.toUpperCase();
          }
          if (record.country_code_iso2) {
            record.country_code_iso2 = record.country_code_iso2.toUpperCase();
          }
          if (record.latitude) {
            record.latitude = parseFloat(record.latitude);
          }
          if (record.longitude) {
            record.longitude = parseFloat(record.longitude);
          }
          return record;
        });

        const { error } = await supabase
          .from('city_master')
          .insert(records);

        if (error) throw error;

        toast({
          title: 'Upload Successful',
          description: `${records.length} cities uploaded successfully`
        });
        fetchCities();
      } catch (error: any) {
        toast({
          title: 'Upload Failed',
          description: error.message || 'Failed to upload cities',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getStateName = (stateCode: string) => {
    const state = states.find(s => s.state_code_iso === stateCode);
    return state?.state_name || stateCode;
  };

  const filteredCities = cities.filter(city => {
    const matchesSearch = 
      city.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.city_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state_code_iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country_code_iso2.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = filterState === 'all' || city.state_code_iso === filterState;
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.state_code_iso}>
                  {state.state_name} ({state.country_code_iso2})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label htmlFor="city-file-upload">
            <input
              id="city-file-upload"
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

      {/* Cities Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>City Code</TableHead>
              <TableHead>State Code</TableHead>
              <TableHead>State Name</TableHead>
              <TableHead>Country Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No cities found. Create your first city or upload a CSV file.
                </TableCell>
              </TableRow>
            ) : (
              filteredCities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.city_name}</TableCell>
                  <TableCell>{city.city_code}</TableCell>
                  <TableCell>{city.state_code_iso}</TableCell>
                  <TableCell>{getStateName(city.state_code_iso)}</TableCell>
                  <TableCell>{city.country_code_iso2}</TableCell>
                  <TableCell>
                    <Switch
                      checked={city.status}
                      onCheckedChange={() => handleToggleStatus(city.id, city.status)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(city.id)}
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
            <DialogTitle>{isEditing ? 'Edit City' : 'Create City'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state_code_iso}
                onValueChange={handleStateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search states..." />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.state_code_iso}>
                      {state.state_name} ({state.state_code_iso})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country_code">Country Code (Derived)</Label>
              <Input
                id="country_code"
                value={formData.country_code_iso2}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city_name">City Name *</Label>
              <Input
                id="city_name"
                value={formData.city_name}
                onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
                placeholder="e.g., Mumbai"
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city_code">City Code *</Label>
              <Input
                id="city_code"
                value={formData.city_code}
                onChange={(e) => setFormData({ ...formData, city_code: e.target.value.toUpperCase() })}
                placeholder="e.g., MUM"
                maxLength={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 19.0760"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., 72.8777"
                />
              </div>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CityMaster;
