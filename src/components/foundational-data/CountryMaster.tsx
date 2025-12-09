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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus, Upload, Download, Edit, Trash2, Search, Globe, MapPin, Building, ArrowRight } from 'lucide-react';
import StateMaster from './StateMaster';
import CityMaster from './CityMaster';
interface Country {
  id: string;
  country_code_iso2: string;
  country_code_iso3: string;
  numeric_code: string | null;
  country_name: string;
  region: string | null;
  sub_region: string | null;
  phone_code: string | null;
  status: boolean;
  created_by: string | null;
  created_at: string;
  modified_by: string | null;
  modified_at: string | null;
}

interface CountryFormData {
  country_name: string;
  country_code_iso2: string;
  country_code_iso3: string;
  numeric_code: string;
  phone_code: string;
  region: string;
  sub_region: string;
  status: boolean;
}

const REGIONS = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania'
];

const SUB_REGIONS: Record<string, string[]> = {
  'Africa': ['Northern Africa', 'Eastern Africa', 'Middle Africa', 'Southern Africa', 'Western Africa'],
  'Americas': ['Caribbean', 'Central America', 'South America', 'Northern America'],
  'Asia': ['Central Asia', 'Eastern Asia', 'South-eastern Asia', 'Southern Asia', 'Western Asia'],
  'Europe': ['Eastern Europe', 'Northern Europe', 'Southern Europe', 'Western Europe'],
  'Oceania': ['Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia']
};

const initialFormData: CountryFormData = {
  country_name: '',
  country_code_iso2: '',
  country_code_iso3: '',
  numeric_code: '',
  phone_code: '',
  region: '',
  sub_region: '',
  status: true
};

const CountryMaster: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CountryFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'countries' | 'states' | 'cities'>('countries');
  const [preSelectedCountry, setPreSelectedCountry] = useState<string>('');
  const [preSelectedState, setPreSelectedState] = useState<string>('');
  const [preSelectedCountryForCity, setPreSelectedCountryForCity] = useState<string>('');
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('country_master')
        .select('*')
        .order('country_name', { ascending: true });

      if (error) throw error;
      setCountries((data as Country[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch countries',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (country: Country) => {
    setFormData({
      country_name: country.country_name,
      country_code_iso2: country.country_code_iso2,
      country_code_iso3: country.country_code_iso3,
      numeric_code: country.numeric_code || '',
      phone_code: country.phone_code || '',
      region: country.region || '',
      sub_region: country.sub_region || '',
      status: country.status
    });
    setIsEditing(true);
    setEditingId(country.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return;
    
    try {
      const { error } = await supabase
        .from('country_master')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Country deleted successfully'
      });
      fetchCountries();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete country',
        variant: 'destructive'
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const session = customAuth.getSession();
      const userId = session?.user?.user_id;
      const { error } = await supabase
        .from('country_master')
        .update({ 
          status: !currentStatus,
          modified_by: userId || 'system',
          modified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Country ${!currentStatus ? 'enabled' : 'disabled'} successfully`
      });
      fetchCountries();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.country_name || !formData.country_code_iso2 || !formData.country_code_iso3) {
      toast({
        title: 'Validation Error',
        description: 'Name, ISO2, and ISO3 codes are required',
        variant: 'destructive'
      });
      return;
    }

    if (formData.country_code_iso2.length !== 2) {
      toast({
        title: 'Validation Error',
        description: 'ISO2 code must be exactly 2 characters',
        variant: 'destructive'
      });
      return;
    }

    if (formData.country_code_iso3.length !== 3) {
      toast({
        title: 'Validation Error',
        description: 'ISO3 code must be exactly 3 characters',
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
          .from('country_master')
          .update({
            country_name: formData.country_name,
            country_code_iso2: formData.country_code_iso2.toUpperCase(),
            country_code_iso3: formData.country_code_iso3.toUpperCase(),
            numeric_code: formData.numeric_code || null,
            phone_code: formData.phone_code || null,
            region: formData.region || null,
            sub_region: formData.sub_region || null,
            status: formData.status,
            modified_by: userDisplayId || 'system',
            modified_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Country updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('country_master')
          .insert({
            country_name: formData.country_name,
            country_code_iso2: formData.country_code_iso2.toUpperCase(),
            country_code_iso3: formData.country_code_iso3.toUpperCase(),
            numeric_code: formData.numeric_code || null,
            phone_code: formData.phone_code || null,
            region: formData.region || null,
            sub_region: formData.sub_region || null,
            status: formData.status,
            user_id: userId || '',
            created_by: userDisplayId || 'system'
          });

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Country created successfully'
        });
      }

      setIsDialogOpen(false);
      fetchCountries();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save country',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadTemplate = () => {
    const template = 'country_name,country_code_iso2,country_code_iso3,numeric_code,phone_code,region,sub_region,status\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'country_master_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Template Downloaded',
      description: 'Use this template to upload countries in bulk'
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
          if (record.country_code_iso2) {
            record.country_code_iso2 = record.country_code_iso2.toUpperCase();
          }
          if (record.country_code_iso3) {
            record.country_code_iso3 = record.country_code_iso3.toUpperCase();
          }
          return record;
        });

        const { error } = await supabase
          .from('country_master')
          .insert(records);

        if (error) throw error;

        toast({
          title: 'Upload Successful',
          description: `${records.length} countries uploaded successfully`
        });
        fetchCountries();
      } catch (error: any) {
        toast({
          title: 'Upload Failed',
          description: error.message || 'Failed to upload countries',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const filteredCountries = countries.filter(country =>
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.country_code_iso2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.country_code_iso3.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Country Management Dashboard</CardTitle>
              <CardDescription>Upload and manage your location data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b">
            <Button
              variant={activeTab === 'countries' ? 'default' : 'ghost'}
              className="rounded-b-none"
              onClick={() => setActiveTab('countries')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Countries
            </Button>
            <Button
              variant={activeTab === 'states' ? 'default' : 'ghost'}
              className="rounded-b-none"
              onClick={() => setActiveTab('states')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              States
            </Button>
            <Button
              variant={activeTab === 'cities' ? 'default' : 'ghost'}
              className="rounded-b-none"
              onClick={() => setActiveTab('cities')}
            >
              <Building className="h-4 w-4 mr-2" />
              Cities
            </Button>
          </div>

          {activeTab === 'countries' && (
            <>
              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="file-upload">
                    <input
                      id="file-upload"
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

              {/* Countries Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Name</TableHead>
                      <TableHead>ISO2</TableHead>
                      <TableHead>ISO3</TableHead>
                      <TableHead>Numeric Code</TableHead>
                      <TableHead>Phone Code</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Subregion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredCountries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No countries found. Create your first country or upload a CSV file.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCountries.map((country) => (
                        <TableRow key={country.id}>
                          <TableCell className="font-medium">{country.country_name}</TableCell>
                          <TableCell>{country.country_code_iso2}</TableCell>
                          <TableCell>{country.country_code_iso3}</TableCell>
                          <TableCell>{country.numeric_code || '-'}</TableCell>
                          <TableCell>{country.phone_code ? `+${country.phone_code}` : '-'}</TableCell>
                          <TableCell>{country.region || '-'}</TableCell>
                          <TableCell>{country.sub_region || '-'}</TableCell>
                          <TableCell>
                            <Switch
                              checked={country.status}
                              onCheckedChange={() => handleToggleStatus(country.id, country.status)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(country)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(country.id)}
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
            </>
          )}

          {activeTab === 'states' && (
            <StateMaster 
              preSelectedCountry={preSelectedCountry}
              onNavigateToCity={(stateCode, countryCode) => {
                setPreSelectedState(stateCode);
                setPreSelectedCountryForCity(countryCode);
                setActiveTab('cities');
              }}
            />
          )}

          {activeTab === 'cities' && (
            <CityMaster 
              preSelectedState={preSelectedState}
              preSelectedCountry={preSelectedCountryForCity}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Country' : 'Create Country'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="country_name">Name *</Label>
              <Input
                id="country_name"
                value={formData.country_name}
                onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
                placeholder="e.g., United States"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country_code_iso2">ISO2 Code *</Label>
              <Input
                id="country_code_iso2"
                value={formData.country_code_iso2}
                onChange={(e) => setFormData({ ...formData, country_code_iso2: e.target.value.toUpperCase().slice(0, 2) })}
                placeholder="e.g., US"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country_code_iso3">ISO3 Code *</Label>
              <Input
                id="country_code_iso3"
                value={formData.country_code_iso3}
                onChange={(e) => setFormData({ ...formData, country_code_iso3: e.target.value.toUpperCase().slice(0, 3) })}
                placeholder="e.g., USA"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeric_code">Numeric Code</Label>
              <Input
                id="numeric_code"
                value={formData.numeric_code}
                onChange={(e) => setFormData({ ...formData, numeric_code: e.target.value.slice(0, 3) })}
                placeholder="e.g., 840"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_code">Phone Code</Label>
              <Input
                id="phone_code"
                value={formData.phone_code}
                onChange={(e) => setFormData({ ...formData, phone_code: e.target.value.slice(0, 5) })}
                placeholder="e.g., 1"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value, sub_region: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub_region">Subregion</Label>
              <Select
                value={formData.sub_region}
                onValueChange={(value) => setFormData({ ...formData, sub_region: value })}
                disabled={!formData.region}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subregion" />
                </SelectTrigger>
                <SelectContent>
                  {formData.region && SUB_REGIONS[formData.region]?.map(subRegion => (
                    <SelectItem key={subRegion} value={subRegion}>{subRegion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
              <Label htmlFor="status">Enabled</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
              {!isEditing && formData.country_code_iso2 && (
                <Button variant="secondary" onClick={() => {
                  handleSubmit();
                  setPreSelectedCountry(formData.country_code_iso2.toUpperCase());
                  setActiveTab('states');
                }}>
                  Map State <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountryMaster;
