import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Copy, ChevronDown, ChevronRight, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';

interface ProductEventMapping {
  product_code: string;
  event_code: string;
  business_application: string[];
  target_audience: string[];
}

interface PaneSection {
  id: string;
  name: string;
  sequence: number;
  rows?: number;
  columns?: number;
}

interface Pane {
  id: string;
  name: string;
  sequence: number;
  sections: PaneSection[];
}

interface PaneSectionMapping {
  id: string;
  product_code: string;
  event_code: string;
  business_application: string[];
  customer_segment: string[];
  panes: Pane[];
  is_active: boolean;
}

interface FieldData {
  id?: string;
  field_id: string;
  field_code: string;
  field_label_key: string;
  field_tooltip_key: string;
  product_code: string;
  event_type: string;
  pane_code: string;
  section_code: string;
  field_display_sequence: number;
  ui_display_type: string;
  data_type: string;
  lookup_code: string;
  length_min: number;
  length_max: number;
  decimal_places: number;
  is_mandatory_portal: boolean;
  is_mandatory_mo: boolean;
  is_mandatory_bo: boolean;
  input_allowed_flag: boolean;
  edit_allowed_flag: boolean;
  view_allowed_flag: boolean;
  read_only_flag: boolean;
  default_value: string;
  swift_mt_type: string;
  swift_sequence: string;
  swift_tag: string;
  swift_subfield_qualifier: string;
  swift_tag_required_flag: boolean;
  swift_tag_display_flag: boolean;
  swift_format_pattern: string;
  sanction_check_required_flag: boolean;
  sanction_field_category: string;
  sanction_party_role: string;
  sanction_engine_field_map: string;
  limit_check_required_flag: boolean;
  limit_dimension_type: string;
  validation_rule_set_id: string;
  conditional_visibility_expr: string;
  conditional_mandatory_expr: string;
  computed_expression: string;
  error_message_key: string;
  is_active_flag: boolean;
  effective_from_date: string;
}

const UI_DISPLAY_TYPES = [
  'TEXTBOX', 'TEXTAREA', 'DROPDOWN', 'DATEPICKER', 'NUMBER', 
  'CHECKBOX', 'RADIO', 'FILE_UPLOAD', 'CURRENCY', 'AMOUNT'
];

const DATA_TYPES = [
  'STRING', 'NUMERIC', 'DATE', 'BOOLEAN', 'CURRENCY', 'PERCENT', 'ENUM', 'DECIMAL'
];

const SANCTION_CATEGORIES = [
  'PARTY_NAME', 'PARTY_ADDRESS', 'COUNTRY', 'AMOUNT', 'VESSEL', 'GOODS', 'BIC'
];

const PARTY_ROLES = [
  'APPLICANT', 'BENEFICIARY', 'APPLICANT_BANK', 'ADVISING_BANK', 'ISSUING_BANK', 'CONFIRMING_BANK'
];

const LIMIT_DIMENSION_TYPES = [
  'AMOUNT', 'TENOR', 'COUNTRY', 'COUNTERPARTY', 'PRODUCT', 'CURRENCY'
];

const getInitialFieldData = (): FieldData => ({
  field_id: '',
  field_code: '',
  field_label_key: '',
  field_tooltip_key: '',
  product_code: '',
  event_type: '',
  pane_code: '',
  section_code: '',
  field_display_sequence: 1,
  ui_display_type: 'TEXTBOX',
  data_type: 'STRING',
  lookup_code: '',
  length_min: 0,
  length_max: 255,
  decimal_places: 0,
  is_mandatory_portal: false,
  is_mandatory_mo: false,
  is_mandatory_bo: false,
  input_allowed_flag: true,
  edit_allowed_flag: true,
  view_allowed_flag: true,
  read_only_flag: false,
  default_value: '',
  swift_mt_type: '',
  swift_sequence: '',
  swift_tag: '',
  swift_subfield_qualifier: '',
  swift_tag_required_flag: false,
  swift_tag_display_flag: false,
  swift_format_pattern: '',
  sanction_check_required_flag: false,
  sanction_field_category: '',
  sanction_party_role: '',
  sanction_engine_field_map: '',
  limit_check_required_flag: false,
  limit_dimension_type: '',
  validation_rule_set_id: '',
  conditional_visibility_expr: '',
  conditional_mandatory_expr: '',
  computed_expression: '',
  error_message_key: '',
  is_active_flag: true,
  effective_from_date: new Date().toISOString().split('T')[0],
});

const FieldDefinition = () => {
  const { user } = useAuth();
  const [productMappings, setProductMappings] = useState<ProductEventMapping[]>([]);
  const [paneSectionMappings, setPaneSectionMappings] = useState<PaneSectionMapping[]>([]);
  const [existingFields, setExistingFields] = useState<FieldData[]>([]);
  
  // Header selectors state
  const [selectedBusinessApp, setSelectedBusinessApp] = useState('');
  const [selectedCustomerSegment, setSelectedCustomerSegment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedPane, setSelectedPane] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  // Form state
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingField, setEditingField] = useState<FieldData | null>(null);
  const [fieldData, setFieldData] = useState<FieldData>(getInitialFieldData());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Collapsible states
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [isFieldsTableOpen, setIsFieldsTableOpen] = useState(true);

  useEffect(() => {
    fetchProductMappings();
    fetchPaneSectionMappings();
  }, []);

  // Fetch fields when selection changes
  useEffect(() => {
    if (selectedProduct && selectedEvent && selectedPane && selectedSection) {
      fetchExistingFields();
    } else {
      setExistingFields([]);
    }
  }, [selectedProduct, selectedEvent, selectedPane, selectedSection]);

  const fetchProductMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('product_event_mapping')
        .select('product_code, event_code, business_application, target_audience');

      if (error) throw error;
      setProductMappings(data || []);
    } catch (error: any) {
      toast.error('Failed to load product mappings', { description: error.message });
    }
  };

  const fetchPaneSectionMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('pane_section_mappings')
        .select('*');

      if (error) throw error;
      setPaneSectionMappings((data || []) as unknown as PaneSectionMapping[]);
    } catch (error: any) {
      toast.error('Failed to load pane/section mappings', { description: error.message });
    }
  };

  const fetchExistingFields = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_repository')
        .select('*')
        .eq('product_code', selectedProduct)
        .eq('event_type', selectedEvent)
        .eq('pane_code', selectedPane)
        .eq('section_code', selectedSection)
        .eq('user_id', user.id)
        .order('field_display_sequence', { ascending: true });

      if (error) throw error;
      setExistingFields((data || []) as unknown as FieldData[]);
    } catch (error: any) {
      toast.error('Failed to load fields', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Cascading filter logic
  const uniqueBusinessApps = Array.from(
    new Set(productMappings.flatMap(m => m.business_application))
  ).sort();

  const availableCustomerSegments = selectedBusinessApp
    ? Array.from(
        new Set(
          productMappings
            .filter(m => m.business_application.includes(selectedBusinessApp))
            .flatMap(m => m.target_audience)
        )
      ).sort()
    : [];

  const availableProducts = selectedBusinessApp && selectedCustomerSegment
    ? Array.from(
        new Set(
          productMappings
            .filter(
              m =>
                m.business_application.includes(selectedBusinessApp) &&
                m.target_audience.includes(selectedCustomerSegment)
            )
            .map(m => m.product_code)
        )
      ).sort()
    : [];

  const availableEvents = selectedBusinessApp && selectedCustomerSegment && selectedProduct
    ? Array.from(
        new Set(
          productMappings
            .filter(
              m =>
                m.business_application.includes(selectedBusinessApp) &&
                m.target_audience.includes(selectedCustomerSegment) &&
                m.product_code === selectedProduct
            )
            .map(m => m.event_code)
        )
      ).sort()
    : [];

  // Get panes from pane_section_mappings for selected combination
  const availablePanes = selectedBusinessApp && selectedCustomerSegment && selectedProduct && selectedEvent
    ? paneSectionMappings
        .filter(
          psm =>
            psm.business_application?.includes(selectedBusinessApp) &&
            psm.customer_segment?.includes(selectedCustomerSegment) &&
            psm.product_code === selectedProduct &&
            psm.event_code === selectedEvent
        )
        .flatMap(psm => psm.panes || [])
    : [];

  // Get sections for selected pane
  const availableSections = selectedPane
    ? availablePanes.find(p => p.name === selectedPane)?.sections || []
    : [];

  const handleBusinessAppChange = (value: string) => {
    setSelectedBusinessApp(value);
    setSelectedCustomerSegment('');
    setSelectedProduct('');
    setSelectedEvent('');
    setSelectedPane('');
    setSelectedSection('');
  };

  const handleCustomerSegmentChange = (value: string) => {
    setSelectedCustomerSegment(value);
    setSelectedProduct('');
    setSelectedEvent('');
    setSelectedPane('');
    setSelectedSection('');
  };

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    setSelectedEvent('');
    setSelectedPane('');
    setSelectedSection('');
  };

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    setSelectedPane('');
    setSelectedSection('');
  };

  const handlePaneChange = (value: string) => {
    setSelectedPane(value);
    setSelectedSection('');
  };

  const handleAddField = () => {
    setEditingField(null);
    setFieldData({
      ...getInitialFieldData(),
      product_code: selectedProduct,
      event_type: selectedEvent,
      pane_code: selectedPane,
      section_code: selectedSection,
      field_display_sequence: existingFields.length + 1,
    });
    setShowFieldForm(true);
  };

  const handleEditField = (field: FieldData) => {
    setEditingField(field);
    setFieldData(field);
    setShowFieldForm(true);
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    
    try {
      const { error } = await supabase
        .from('field_repository')
        .delete()
        .eq('id', fieldId)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Field deleted successfully');
      fetchExistingFields();
    } catch (error: any) {
      toast.error('Failed to delete field', { description: error.message });
    }
  };

  const handleCopyField = (field: FieldData) => {
    setEditingField(null);
    setFieldData({
      ...field,
      id: undefined,
      field_id: `${field.field_id}_COPY`,
      field_code: `${field.field_code}_COPY`,
      field_display_sequence: existingFields.length + 1,
    });
    setShowFieldForm(true);
  };

  const handleSaveField = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save fields');
      return;
    }

    if (!fieldData.field_code || !fieldData.field_label_key) {
      toast.error('Field Code and Field Label are required');
      return;
    }

    setSaving(true);
    try {
      const fieldId = fieldData.field_id || `FLD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const saveData = {
        ...fieldData,
        field_id: fieldId,
        user_id: user.id,
      };

      if (editingField?.id) {
        const { error } = await supabase
          .from('field_repository')
          .update(saveData)
          .eq('id', editingField.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Field updated successfully');
      } else {
        const { error } = await supabase
          .from('field_repository')
          .insert([saveData]);

        if (error) throw error;
        toast.success('Field created successfully');
      }

      setShowFieldForm(false);
      setEditingField(null);
      setFieldData(getInitialFieldData());
      fetchExistingFields();
    } catch (error: any) {
      toast.error('Failed to save field', { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updateFieldData = (field: keyof FieldData, value: any) => {
    setFieldData(prev => ({ ...prev, [field]: value }));
  };

  const isSelectionComplete = selectedBusinessApp && selectedCustomerSegment && 
    selectedProduct && selectedEvent && selectedPane && selectedSection;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Field Definition</h1>
          <p className="text-muted-foreground mt-2">
            Define and manage fields for product events
          </p>
        </div>
      </div>

      {/* Header Selection Section */}
      <Collapsible open={isHeaderOpen} onOpenChange={setIsHeaderOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                {isHeaderOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <CardTitle>Select Configuration</CardTitle>
              </div>
            </CollapsibleTrigger>
            <CardDescription className="ml-7">
              Select Business Application, Customer Segment, Product, Event, Pane, and Section to manage fields
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Business Application */}
                <div className="space-y-2">
                  <Label>Business Application</Label>
                  <Select value={selectedBusinessApp} onValueChange={handleBusinessAppChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueBusinessApps.map(app => (
                        <SelectItem key={app} value={app}>{app}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Segment */}
                <div className="space-y-2">
                  <Label>Customer Segment</Label>
                  <Select 
                    value={selectedCustomerSegment} 
                    onValueChange={handleCustomerSegmentChange}
                    disabled={!selectedBusinessApp}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCustomerSegments.map(seg => (
                        <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product */}
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select 
                    value={selectedProduct} 
                    onValueChange={handleProductChange}
                    disabled={!selectedCustomerSegment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map(prod => (
                        <SelectItem key={prod} value={prod}>{prod}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event */}
                <div className="space-y-2">
                  <Label>Event</Label>
                  <Select 
                    value={selectedEvent} 
                    onValueChange={handleEventChange}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEvents.map(evt => (
                        <SelectItem key={evt} value={evt}>{evt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pane */}
                <div className="space-y-2">
                  <Label>Pane</Label>
                  <Select 
                    value={selectedPane} 
                    onValueChange={handlePaneChange}
                    disabled={!selectedEvent || availablePanes.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePanes.map(pane => (
                        <SelectItem key={pane.id} value={pane.name}>{pane.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                    disabled={!selectedPane || availableSections.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map(sec => (
                        <SelectItem key={sec.id} value={sec.name}>{sec.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selection Summary */}
              {isSelectionComplete && (
                <div className="mt-4 p-3 bg-muted rounded-lg flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedBusinessApp}</Badge>
                  <Badge variant="secondary">{selectedCustomerSegment}</Badge>
                  <Badge variant="outline">{selectedProduct}</Badge>
                  <Badge variant="outline">{selectedEvent}</Badge>
                  <Badge>{selectedPane}</Badge>
                  <Badge>{selectedSection}</Badge>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Fields Table */}
      {isSelectionComplete && (
        <Collapsible open={isFieldsTableOpen} onOpenChange={setIsFieldsTableOpen}>
          <Card>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    {isFieldsTableOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    <CardTitle>Fields</CardTitle>
                    <Badge variant="outline" className="ml-2">{existingFields.length}</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleAddField(); }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-4">Loading fields...</p>
                ) : existingFields.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No fields defined for this section. Click "Add Field" to create one.
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Seq</TableHead>
                          <TableHead>Field Code</TableHead>
                          <TableHead>Label Key</TableHead>
                          <TableHead>UI Type</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>SWIFT Tag</TableHead>
                          <TableHead className="w-20">Active</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {existingFields.map((field) => (
                          <TableRow key={field.id}>
                            <TableCell>{field.field_display_sequence}</TableCell>
                            <TableCell className="font-mono text-sm">{field.field_code}</TableCell>
                            <TableCell>{field.field_label_key}</TableCell>
                            <TableCell><Badge variant="outline">{field.ui_display_type}</Badge></TableCell>
                            <TableCell><Badge variant="secondary">{field.data_type}</Badge></TableCell>
                            <TableCell>{field.swift_tag || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={field.is_active_flag ? 'default' : 'secondary'}>
                                {field.is_active_flag ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEditField(field)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleCopyField(field)}>
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteField(field.id!)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Field Form - Three Sections */}
      {showFieldForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingField ? 'Edit Field' : 'Add New Field'}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowFieldForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveField} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Field'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signature" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signature">Field Signature</TabsTrigger>
                <TabsTrigger value="swift">SWIFT Details</TabsTrigger>
                <TabsTrigger value="other">Other Details</TabsTrigger>
              </TabsList>

              {/* Field Signature Tab */}
              <TabsContent value="signature" className="space-y-6 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Field Code *</Label>
                    <Input
                      value={fieldData.field_code}
                      onChange={(e) => updateFieldData('field_code', e.target.value)}
                      placeholder="e.g., APPLICANT_NAME"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field Label Key *</Label>
                    <Input
                      value={fieldData.field_label_key}
                      onChange={(e) => updateFieldData('field_label_key', e.target.value)}
                      placeholder="e.g., lbl.applicantName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field Tooltip Key</Label>
                    <Input
                      value={fieldData.field_tooltip_key}
                      onChange={(e) => updateFieldData('field_tooltip_key', e.target.value)}
                      placeholder="e.g., tip.applicantName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Sequence</Label>
                    <Input
                      type="number"
                      value={fieldData.field_display_sequence}
                      onChange={(e) => updateFieldData('field_display_sequence', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>UI Display Type</Label>
                    <Select 
                      value={fieldData.ui_display_type} 
                      onValueChange={(v) => updateFieldData('ui_display_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UI_DISPLAY_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Type</Label>
                    <Select 
                      value={fieldData.data_type} 
                      onValueChange={(v) => updateFieldData('data_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DATA_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lookup Code</Label>
                    <Input
                      value={fieldData.lookup_code}
                      onChange={(e) => updateFieldData('lookup_code', e.target.value)}
                      placeholder="e.g., COUNTRY_LIST"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Length</Label>
                    <Input
                      type="number"
                      value={fieldData.length_min}
                      onChange={(e) => updateFieldData('length_min', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Length</Label>
                    <Input
                      type="number"
                      value={fieldData.length_max}
                      onChange={(e) => updateFieldData('length_max', parseInt(e.target.value) || 255)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Decimal Places</Label>
                    <Input
                      type="number"
                      value={fieldData.decimal_places}
                      onChange={(e) => updateFieldData('decimal_places', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Value</Label>
                    <Input
                      value={fieldData.default_value}
                      onChange={(e) => updateFieldData('default_value', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Effective From Date</Label>
                    <Input
                      type="date"
                      value={fieldData.effective_from_date}
                      onChange={(e) => updateFieldData('effective_from_date', e.target.value)}
                    />
                  </div>
                </div>

                {/* Flags Section */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Field Flags</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_mandatory_portal}
                        onCheckedChange={(v) => updateFieldData('is_mandatory_portal', v)}
                      />
                      <Label>Mandatory (Portal)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_mandatory_mo}
                        onCheckedChange={(v) => updateFieldData('is_mandatory_mo', v)}
                      />
                      <Label>Mandatory (MO)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_mandatory_bo}
                        onCheckedChange={(v) => updateFieldData('is_mandatory_bo', v)}
                      />
                      <Label>Mandatory (BO)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.input_allowed_flag}
                        onCheckedChange={(v) => updateFieldData('input_allowed_flag', v)}
                      />
                      <Label>Input Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.edit_allowed_flag}
                        onCheckedChange={(v) => updateFieldData('edit_allowed_flag', v)}
                      />
                      <Label>Edit Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.view_allowed_flag}
                        onCheckedChange={(v) => updateFieldData('view_allowed_flag', v)}
                      />
                      <Label>View Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.read_only_flag}
                        onCheckedChange={(v) => updateFieldData('read_only_flag', v)}
                      />
                      <Label>Read Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_active_flag}
                        onCheckedChange={(v) => updateFieldData('is_active_flag', v)}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SWIFT Details Tab */}
              <TabsContent value="swift" className="space-y-6 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>SWIFT MT Type</Label>
                    <Input
                      value={fieldData.swift_mt_type}
                      onChange={(e) => updateFieldData('swift_mt_type', e.target.value)}
                      placeholder="e.g., MT700, MT707"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT Sequence</Label>
                    <Input
                      value={fieldData.swift_sequence}
                      onChange={(e) => updateFieldData('swift_sequence', e.target.value)}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT Tag</Label>
                    <Input
                      value={fieldData.swift_tag}
                      onChange={(e) => updateFieldData('swift_tag', e.target.value)}
                      placeholder="e.g., 50, 59, 32B"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subfield Qualifier</Label>
                    <Input
                      value={fieldData.swift_subfield_qualifier}
                      onChange={(e) => updateFieldData('swift_subfield_qualifier', e.target.value)}
                      placeholder="e.g., NAME, ADDRESS"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT Format Pattern</Label>
                    <Input
                      value={fieldData.swift_format_pattern}
                      onChange={(e) => updateFieldData('swift_format_pattern', e.target.value)}
                      placeholder="e.g., 3!a15d"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={fieldData.swift_tag_required_flag}
                          onCheckedChange={(v) => updateFieldData('swift_tag_required_flag', v)}
                        />
                        <Label>SWIFT Required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={fieldData.swift_tag_display_flag}
                          onCheckedChange={(v) => updateFieldData('swift_tag_display_flag', v)}
                        />
                        <Label>Display Tag</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Other Details Tab */}
              <TabsContent value="other" className="space-y-6 mt-4">
                {/* Sanction Details */}
                <div>
                  <h4 className="font-medium mb-4">Sanction Check Configuration</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.sanction_check_required_flag}
                        onCheckedChange={(v) => updateFieldData('sanction_check_required_flag', v)}
                      />
                      <Label>Sanction Check Required</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Sanction Field Category</Label>
                      <Select 
                        value={fieldData.sanction_field_category} 
                        onValueChange={(v) => updateFieldData('sanction_field_category', v)}
                        disabled={!fieldData.sanction_check_required_flag}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {SANCTION_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sanction Party Role</Label>
                      <Select 
                        value={fieldData.sanction_party_role} 
                        onValueChange={(v) => updateFieldData('sanction_party_role', v)}
                        disabled={!fieldData.sanction_check_required_flag}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PARTY_ROLES.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-3">
                      <Label>Sanction Engine Field Map</Label>
                      <Input
                        value={fieldData.sanction_engine_field_map}
                        onChange={(e) => updateFieldData('sanction_engine_field_map', e.target.value)}
                        placeholder="e.g., sanc.applicant.name"
                        disabled={!fieldData.sanction_check_required_flag}
                      />
                    </div>
                  </div>
                </div>

                {/* Limit Check */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Limit Check Configuration</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.limit_check_required_flag}
                        onCheckedChange={(v) => updateFieldData('limit_check_required_flag', v)}
                      />
                      <Label>Limit Check Required</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Limit Dimension Type</Label>
                      <Select 
                        value={fieldData.limit_dimension_type} 
                        onValueChange={(v) => updateFieldData('limit_dimension_type', v)}
                        disabled={!fieldData.limit_check_required_flag}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LIMIT_DIMENSION_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Validation & Expressions */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Validation & Expressions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Validation Rule Set ID</Label>
                      <Input
                        value={fieldData.validation_rule_set_id}
                        onChange={(e) => updateFieldData('validation_rule_set_id', e.target.value)}
                        placeholder="e.g., VAL_ILC_APPLICANT"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Error Message Key</Label>
                      <Input
                        value={fieldData.error_message_key}
                        onChange={(e) => updateFieldData('error_message_key', e.target.value)}
                        placeholder="e.g., err.applicantName.required"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Conditional Visibility Expression</Label>
                      <Textarea
                        value={fieldData.conditional_visibility_expr}
                        onChange={(e) => updateFieldData('conditional_visibility_expr', e.target.value)}
                        placeholder="e.g., IF(SHIPMENT_PARTIAL='Y')"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Conditional Mandatory Expression</Label>
                      <Textarea
                        value={fieldData.conditional_mandatory_expr}
                        onChange={(e) => updateFieldData('conditional_mandatory_expr', e.target.value)}
                        placeholder="e.g., IF(LC_TYPE='REVOLVING')"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Computed Expression</Label>
                      <Textarea
                        value={fieldData.computed_expression}
                        onChange={(e) => updateFieldData('computed_expression', e.target.value)}
                        placeholder="e.g., RULE:CALC_EXPIRY_DATE"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FieldDefinition;
