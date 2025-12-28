// Build timestamp: 2024-12-04T17:20:00Z - Force fresh deployment
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Copy, ChevronDown, ChevronRight, Save, Upload, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Textarea } from '@/components/ui/textarea';
import { customAuth } from '@/services/customAuth';
import FieldActionsTab from './FieldActionsTab';
import { FieldActions } from '@/types/dynamicForm';

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
  field_row: number;
  field_column: number;
  ui_row_span: number;
  ui_column_span: number;
  group_id: string;
  group_repetition_flag: boolean;
  ui_display_type: string;
  data_type: string;
  lookup_code: string;
  dropdown_values: string;
  length_min: number;
  length_max: number;
  decimal_places: number;
  default_value: string;
  size_standard_source: string;
  is_mandatory_portal: boolean;
  is_mandatory_mo: boolean;
  is_mandatory_bo: boolean;
  conditional_visibility_expr: string;
  conditional_mandatory_expr: string;
  channel_customer_portal_flag: boolean;
  channel_middle_office_flag: boolean;
  channel_back_office_flag: boolean;
  swift_mt_type: string;
  swift_sequence: string;
  swift_tag: string;
  swift_subfield_qualifier: string;
  swift_tag_display_flag: boolean;
  swift_format_pattern: string;
  sanction_check_required_flag: boolean;
  sanction_engine_field_map: string;
  limit_check_required_flag: boolean;
  error_message_key: string;
  help_content_type: string;
  iso20022_element_code: string;
  iso_data_format_pattern: string;
  ai_mapping_key: string;
  is_active_flag: boolean;
  effective_from_date: string;
  field_actions?: FieldActions | null;
  mapped_from_field_code: string;
}

const UI_DISPLAY_TYPES = [
  'TEXTBOX', 'TEXTAREA', 'DROPDOWN', 'DATEPICKER', 'NUMBER', 
  'CHECKBOX', 'RADIO', 'FILE_UPLOAD', 'GRID'
];

const DATA_TYPES = [
  'STRING', 'NUMERIC', 'DATE', 'BOOLEAN', 'CURRENCY', 'PERCENT', 'ENUM'
];

const SIZE_STANDARD_SOURCES = ['SWIFT', 'CUSTOM', 'ISO'];

const HELP_CONTENT_TYPES = ['INLINE_TEXT', 'LINK', 'DOC_ID'];

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
  field_row: 1,
  field_column: 1,
  ui_row_span: 1,
  ui_column_span: 1,
  group_id: '',
  group_repetition_flag: false,
  ui_display_type: 'TEXTBOX',
  data_type: 'STRING',
  lookup_code: '',
  dropdown_values: '',
  length_min: 0,
  length_max: 255,
  decimal_places: 0,
  default_value: '',
  size_standard_source: 'CUSTOM',
  is_mandatory_portal: false,
  is_mandatory_mo: false,
  is_mandatory_bo: false,
  conditional_visibility_expr: '',
  conditional_mandatory_expr: '',
  channel_customer_portal_flag: true,
  channel_middle_office_flag: true,
  channel_back_office_flag: true,
  swift_mt_type: '',
  swift_sequence: '',
  swift_tag: '',
  swift_subfield_qualifier: '',
  swift_tag_display_flag: false,
  swift_format_pattern: '',
  sanction_check_required_flag: false,
  sanction_engine_field_map: '',
  limit_check_required_flag: false,
  error_message_key: '',
  help_content_type: 'INLINE_TEXT',
  iso20022_element_code: '',
  iso_data_format_pattern: '',
  ai_mapping_key: '',
  is_active_flag: true,
  effective_from_date: new Date().toISOString().split('T')[0],
  field_actions: null,
  mapped_from_field_code: '',
});

// Utility function to generate field_code from field_label_key (UPPER_SNAKE_CASE)
const generateFieldCode = (fieldName: string): string => {
  return fieldName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_');        // Replace spaces with underscores
};

const FieldDefinition = () => {
  const [customUser, setCustomUser] = useState<any>(null);
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
  
  // Upload dialog state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFieldsData, setUploadedFieldsData] = useState<FieldData[]>([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [uploadFileName, setUploadFileName] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [gridWarnings, setGridWarnings] = useState<string[]>([]);
  const [existingFieldsForDeletion, setExistingFieldsForDeletion] = useState<FieldData[]>([]);
  const [loadingExistingFields, setLoadingExistingFields] = useState(false);
  
  // State for "Mapped From" dropdown - all fields for the product-event
  const [allFieldsForMapping, setAllFieldsForMapping] = useState<FieldData[]>([]);

  // Get custom auth user on mount
  useEffect(() => {
    const session = customAuth.getSession();
    if (session?.user) {
      setCustomUser(session.user);
    }
  }, []);

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
      const customSession = customAuth.getSession();
      if (!customSession?.user?.id) {
        console.warn('No custom session found for fetching pane section mappings');
        return;
      }

      // Use security definer function to bypass RLS
      const { data, error } = await supabase.rpc('get_pane_section_mappings', {
        p_user_id: customSession.user.id
      });

      if (error) throw error;
      setPaneSectionMappings((data || []) as unknown as PaneSectionMapping[]);
    } catch (error: any) {
      toast.error('Failed to load pane/section mappings', { description: error.message });
    }
  };

  const fetchExistingFields = async () => {
    if (!customUser?.id) return;
    setLoading(true);
    try {
      // Use security definer function to bypass RLS
      const { data, error } = await supabase.rpc('get_fields_by_config', {
        p_user_id: customUser.id,
        p_product_code: selectedProduct,
        p_event_type: selectedEvent,
        p_pane_code: selectedPane,
        p_section_code: selectedSection
      });

      if (error) throw error;
      setExistingFields((data || []) as unknown as FieldData[]);
    } catch (error: any) {
      toast.error('Failed to load fields', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all existing fields for product-event (for deletion preview)
  const fetchExistingFieldsForProductEvent = async () => {
    if (!customUser?.id || !selectedProduct || !selectedEvent) return;
    
    setLoadingExistingFields(true);
    try {
      // Query all fields for this product-event combination
      const { data, error } = await supabase
        .from('field_repository')
        .select('*')
        .eq('product_code', selectedProduct)
        .eq('event_type', selectedEvent);

      if (error) throw error;
      setExistingFieldsForDeletion((data || []) as unknown as FieldData[]);
    } catch (error: any) {
      console.error('Failed to fetch existing fields for deletion preview', error);
      setExistingFieldsForDeletion([]);
    } finally {
      setLoadingExistingFields(false);
    }
  };

  // Fetch ALL fields for product-event (for Mapped From dropdown)
  const fetchAllFieldsForMapping = async () => {
    if (!selectedProduct || !selectedEvent) {
      setAllFieldsForMapping([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('field_repository')
        .select('*')
        .eq('product_code', selectedProduct)
        .eq('event_type', selectedEvent)
        .eq('is_active_flag', true)
        .order('pane_display_sequence', { ascending: true })
        .order('section_display_sequence', { ascending: true })
        .order('field_display_sequence', { ascending: true });

      if (error) throw error;
      setAllFieldsForMapping((data || []) as unknown as FieldData[]);
    } catch (error: any) {
      console.error('Failed to fetch fields for mapping', error);
      setAllFieldsForMapping([]);
    }
  };

  // Fetch all fields for mapping when product/event changes
  React.useEffect(() => {
    if (selectedProduct && selectedEvent) {
      fetchAllFieldsForMapping();
    } else {
      setAllFieldsForMapping([]);
    }
  }, [selectedProduct, selectedEvent]);

  // Fetch existing fields when replaceExisting is checked and dialog is open
  React.useEffect(() => {
    if (showUploadDialog && replaceExisting && selectedProduct && selectedEvent) {
      fetchExistingFieldsForProductEvent();
    } else {
      setExistingFieldsForDeletion([]);
    }
  }, [showUploadDialog, replaceExisting, selectedProduct, selectedEvent]);

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

  // Get sections for selected pane - merge from all matching panes with the same name
  const availableSections = selectedPane
    ? availablePanes
        .filter(p => p.name === selectedPane)
        .flatMap(p => p.sections || [])
        // De-duplicate sections by id or name
        .filter((section, index, self) => 
          index === self.findIndex(s => s.id === section.id || s.name === section.name)
        )
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
    // Convert dropdown_values from array to comma-separated string for display
    const dropdownValuesString = Array.isArray(field.dropdown_values) 
      ? (field.dropdown_values as unknown as string[]).join(', ')
      : (field.dropdown_values || '');
    setFieldData({
      ...field,
      dropdown_values: dropdownValuesString
    });
    setShowFieldForm(true);
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    if (!customUser?.id) {
      toast.error('You must be logged in to delete fields');
      return;
    }
    
    try {
      // Use security definer function to bypass RLS
      const { error } = await supabase.rpc('delete_field_repository', {
        p_user_id: customUser.id,
        p_field_id: fieldId
      });

      if (error) throw error;
      toast.success('Field deleted successfully');
      fetchExistingFields();
    } catch (error: any) {
      toast.error('Failed to delete field', { description: error.message });
    }
  };

  const handleCopyField = (field: FieldData) => {
    setEditingField(null);
    // Convert dropdown_values from array to comma-separated string for display
    const dropdownValuesString = Array.isArray(field.dropdown_values) 
      ? (field.dropdown_values as unknown as string[]).join(', ')
      : (field.dropdown_values || '');
    setFieldData({
      ...field,
      id: undefined,
      field_id: `${field.field_id}_COPY`,
      field_code: `${field.field_code}_COPY`,
      field_display_sequence: existingFields.length + 1,
      dropdown_values: dropdownValuesString
    });
    setShowFieldForm(true);
  };

  // Move field up in the sequence
  const handleMoveFieldUp = async (fieldId: string, currentIndex: number) => {
    if (currentIndex === 0 || !customUser?.id) return;
    
    const fieldsToUpdate = [...existingFields];
    const currentField = fieldsToUpdate[currentIndex];
    const previousField = fieldsToUpdate[currentIndex - 1];
    
    // Swap sequences
    const currentSeq = currentField.field_display_sequence;
    const previousSeq = previousField.field_display_sequence;
    
    try {
      // Update current field
      await supabase.rpc('update_field_repository', {
        p_user_id: customUser.id,
        p_field_id: currentField.id,
        p_field_data: { field_display_sequence: previousSeq }
      });
      
      // Update previous field
      await supabase.rpc('update_field_repository', {
        p_user_id: customUser.id,
        p_field_id: previousField.id,
        p_field_data: { field_display_sequence: currentSeq }
      });
      
      fetchExistingFields();
      toast.success('Field moved up');
    } catch (error: any) {
      toast.error('Failed to reorder field', { description: error.message });
    }
  };

  // Move field down in the sequence
  const handleMoveFieldDown = async (fieldId: string, currentIndex: number) => {
    if (currentIndex >= existingFields.length - 1 || !customUser?.id) return;
    
    const fieldsToUpdate = [...existingFields];
    const currentField = fieldsToUpdate[currentIndex];
    const nextField = fieldsToUpdate[currentIndex + 1];
    
    // Swap sequences
    const currentSeq = currentField.field_display_sequence;
    const nextSeq = nextField.field_display_sequence;
    
    try {
      // Update current field
      await supabase.rpc('update_field_repository', {
        p_user_id: customUser.id,
        p_field_id: currentField.id,
        p_field_data: { field_display_sequence: nextSeq }
      });
      
      // Update next field
      await supabase.rpc('update_field_repository', {
        p_user_id: customUser.id,
        p_field_id: nextField.id,
        p_field_data: { field_display_sequence: currentSeq }
      });
      
      fetchExistingFields();
      toast.success('Field moved down');
    } catch (error: any) {
      toast.error('Failed to reorder field', { description: error.message });
    }
  };
  const parseExcelRowToField = (headers: string[], values: any[], index: number): FieldData => {
    const excelData: Record<string, any> = {};
    headers.forEach((header, idx) => {
      if (header && values[idx] !== undefined) {
        // Normalize header: lowercase, replace spaces/hyphens with underscore, collapse multiple underscores
        const normalizedHeader = header.toLowerCase()
          .replace(/[\s-]+/g, '_')
          .replace(/_+/g, '_')  // Collapse multiple underscores to single
          .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
        excelData[normalizedHeader] = values[idx];
      }
    });

    // Parse field coordinates with optional group prefix
    // Supports formats: "PartyGrid.R1C1", "R1C1", "PartyDetails.R2C3"
    const parseCoordinates = (coord: string): { groupId: string; row: number; col: number; isRepeatable: boolean } => {
      if (!coord) return { groupId: '', row: 1, col: 1, isRepeatable: false };
      
      // Check for group prefix format: "GroupName.R1C1"
      const groupMatch = coord.match(/^([A-Za-z_][A-Za-z0-9_]*)\.R(\d+)C(\d+)$/i);
      if (groupMatch) {
        return { 
          groupId: groupMatch[1], 
          row: parseInt(groupMatch[2]), 
          col: parseInt(groupMatch[3]),
          isRepeatable: true // Groups are repeatable by default
        };
      }
      
      // Simple coordinate format: "R1C1"
      const simpleMatch = coord.match(/^R(\d+)C(\d+)$/i);
      if (simpleMatch) {
        return { 
          groupId: '', 
          row: parseInt(simpleMatch[1]), 
          col: parseInt(simpleMatch[2]),
          isRepeatable: false 
        };
      }
      
      return { groupId: '', row: 1, col: 1, isRepeatable: false };
    };

    const coordsRaw = excelData['field_co-ordinates'] || excelData['field_coordinates'] || '';
    const coords = parseCoordinates(coordsRaw);
    
    // Get pane and section from Excel data
    const pane = excelData['pane'] || selectedPane;
    const section = excelData['section'] || selectedSection;
    
    // Parse row span and column span (default to 1)
    const rowSpan = parseInt(excelData['ui_row_span'] || excelData['row_span'] || '1') || 1;
    const colSpan = parseInt(excelData['ui_column_span'] || excelData['col_span'] || excelData['column_span'] || '1') || 1;

    return {
      ...getInitialFieldData(),
      product_code: selectedProduct,
      event_type: selectedEvent,
      pane_code: pane,
      section_code: section,
      field_code: excelData['field_code'] || excelData['field_name'] || '',
      field_label_key: excelData['field_label_key'] || excelData['field_name'] || excelData['label'] || '',
      field_tooltip_key: excelData['field_tooltip_key'] || excelData['field_tooltip_text'] || excelData['tooltip'] || '',
      group_id: coords.groupId,
      group_repetition_flag: coords.isRepeatable || excelData['group_repetition_flag'] === 'Y' || excelData['group_repetition_flag'] === 'Yes' || excelData['is_repeatable'] === 'Y',
      field_row: coords.row,
      field_column: coords.col,
      ui_row_span: rowSpan,
      ui_column_span: colSpan,
      ui_display_type: excelData['ui_display_type'] || excelData['display_type'] || 'TEXTBOX',
      data_type: excelData['data_type'] || 'STRING',
      lookup_code: excelData['lookup_code'] || '',
      dropdown_values: excelData['dropdown_values'] || '',
      length_min: parseInt(excelData['length_min'] || excelData['min_length'] || '0') || 0,
      length_max: parseInt(excelData['length_max'] || excelData['max_length'] || '255') || 255,
      decimal_places: parseInt(excelData['decimal_places'] || '0') || 0,
      default_value: excelData['default_value'] || excelData['default_value'] || '',
      size_standard_source: excelData['size_standard_source'] || 'CUSTOM',
      is_mandatory_portal: excelData['is_mandatory_portal'] === 'Y' || excelData['is_mandatory_portal'] === 'Yes' || excelData['is_mandatory_portal'] === true,
      is_mandatory_mo: excelData['is_mandatory_mo'] === 'Y' || excelData['is_mandatory_mo'] === 'Yes' || excelData['is_mandatory_mo'] === true,
      is_mandatory_bo: excelData['is_mandatory_bo'] === 'Y' || excelData['is_mandatory_bo'] === 'Yes' || excelData['is_mandatory_bo'] === true,
      conditional_visibility_expr: excelData['conditional_visibility_expr'] || excelData['visibility_expression'] || '',
      conditional_mandatory_expr: excelData['conditional_mandatory_expr'] || excelData['mandatory_expression'] || '',
      channel_customer_portal_flag: excelData['is_visible_fo'] === 'Y' || excelData['is_visible_fo'] === 'Yes' || excelData['channel_customer_portal_flag'] !== 'N',
      channel_middle_office_flag: excelData['is_visible_mo'] === 'Y' || excelData['is_visible_mo'] === 'Yes' || excelData['channel_middle_office_flag'] !== 'N',
      channel_back_office_flag: excelData['is_visible_bo'] === 'Y' || excelData['is_visible_bo'] === 'Yes' || excelData['channel_back_office_flag'] !== 'N',
      swift_mt_type: excelData['swift_mt_type'] || '',
      swift_sequence: excelData['swift_sequence'] || '',
      swift_tag: excelData['swift_tag'] || '',
      swift_subfield_qualifier: excelData['swift_subfield_qualifier'] || '',
      swift_tag_display_flag: excelData['swift_tag_display_flag'] === 'Y' || excelData['swift_tag_display_flag'] === 'Yes' || excelData['swift_tag_display_flag'] === true,
      swift_format_pattern: excelData['swift_format_pattern'] || '',
      sanction_check_required_flag: excelData['sanction_check_required_flag'] === 'Y' || excelData['sanction_check_required_flag'] === 'Yes' || excelData['sanction_check_required_flag'] === true,
      sanction_engine_field_map: excelData['sanction_engine_field_map'] || '',
      limit_check_required_flag: excelData['limit_check_required_flag'] === 'Y' || excelData['limit_check_required_flag'] === 'Yes' || excelData['limit_check_required_flag'] === true,
      error_message_key: excelData['error_message_key'] || '',
      help_content_type: excelData['help_content_type'] || 'INLINE_TEXT',
      iso20022_element_code: excelData['iso20022_element_code'] || '',
      iso_data_format_pattern: excelData['iso_data_format_pattern'] || '',
      ai_mapping_key: excelData['ai_mapping_key'] || '',
      is_active_flag: excelData['is_active_flag'] !== 'N' && excelData['is_active'] !== 'No',
      field_display_sequence: existingFields.length + index + 1,
    };
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          toast.error('Excel file must have at least a header row and one data row');
          return;
        }

        const headers = jsonData[0] as string[];
        
        // Parse ALL data rows (starting from row index 1)
        const parsedFields: FieldData[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const values = jsonData[i] as any[];
          // Skip empty rows
          if (values && values.some(v => v !== undefined && v !== null && v !== '')) {
            const parsedField = parseExcelRowToField(headers, values, i);
            parsedFields.push(parsedField);
          }
        }

        if (parsedFields.length === 0) {
          toast.error('No valid data rows found in Excel file');
          return;
        }

        // Validate grid dimensions against pane/section mappings
        const warnings: string[] = [];
        
        // Group fields by pane and section
        const fieldsByPaneSection = new Map<string, FieldData[]>();
        parsedFields.forEach(field => {
          const key = `${field.pane_code}::${field.section_code}`;
          if (!fieldsByPaneSection.has(key)) {
            fieldsByPaneSection.set(key, []);
          }
          fieldsByPaneSection.get(key)!.push(field);
        });

        // Check against pane/section mappings
        fieldsByPaneSection.forEach((fields, key) => {
          const [paneCode, sectionCode] = key.split('::');
          
          // Find the matching pane/section mapping
          const mapping = paneSectionMappings.find(
            psm =>
              psm.product_code === selectedProduct &&
              psm.event_code === selectedEvent &&
              psm.business_application?.includes(selectedBusinessApp) &&
              psm.customer_segment?.includes(selectedCustomerSegment)
          );

          if (mapping && mapping.panes) {
            const pane = mapping.panes.find(p => p.name === paneCode);
            if (pane) {
              const section = pane.sections?.find(s => s.name === sectionCode);
              if (section) {
                const gridCapacity = (section.rows || 1) * (section.columns || 2);
                const fieldCount = fields.length;
                
                // Calculate max grid position used by fields
                let maxRow = 0;
                let maxCol = 0;
                fields.forEach(f => {
                  const endRow = f.field_row + (f.ui_row_span || 1) - 1;
                  const endCol = f.field_column + (f.ui_column_span || 1) - 1;
                  maxRow = Math.max(maxRow, endRow);
                  maxCol = Math.max(maxCol, endCol);
                });

                const requiredRows = maxRow;
                const requiredCols = maxCol;
                const configuredRows = section.rows || 1;
                const configuredCols = section.columns || 2;

                if (fieldCount > gridCapacity || requiredRows > configuredRows || requiredCols > configuredCols) {
                  warnings.push(
                    `For Pane "${paneCode}" and For Section "${sectionCode}", No. of Rows and No. of Columns are to be updated to match the no. of Fields. (Found ${fieldCount} fields, max position R${requiredRows}C${requiredCols}, but grid is ${configuredRows}x${configuredCols})`
                  );
                }
              }
            }
          }
        });

        setGridWarnings(warnings);
        setUploadedFieldsData(parsedFields);
        setCurrentUploadIndex(0);
        toast.success(`Excel file parsed successfully. Found ${parsedFields.length} fields to import.${warnings.length > 0 ? ` ${warnings.length} warning(s) detected.` : ''}`);
      } catch (error: any) {
        toast.error('Failed to parse Excel file', { description: error.message });
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleConfirmUpload = () => {
    if (uploadedFieldsData.length > 0) {
      // Set the first field for editing
      setFieldData(uploadedFieldsData[0]);
      setCurrentUploadIndex(0);
      setEditingField(null);
      setShowFieldForm(true);
      setShowUploadDialog(false);
      toast.info(`Field 1 of ${uploadedFieldsData.length} loaded. Review and save each field.`);
    }
  };

  const handleSaveAndNext = async () => {
    // Save current field first
    await handleSaveField();
    
    // Move to next field if available
    if (currentUploadIndex < uploadedFieldsData.length - 1) {
      const nextIndex = currentUploadIndex + 1;
      setCurrentUploadIndex(nextIndex);
      setFieldData(uploadedFieldsData[nextIndex]);
      setEditingField(null);
      toast.info(`Field ${nextIndex + 1} of ${uploadedFieldsData.length} loaded.`);
    } else {
      // All fields saved
      setUploadedFieldsData([]);
      setCurrentUploadIndex(0);
      toast.success('All fields imported successfully!');
    }
  };

  const handleSaveAllFields = async () => {
    if (!customUser?.id) {
      toast.error('You must be logged in to save fields');
      return;
    }

    setSaving(true);
    try {
      // If "Clear & Replace" is selected, delete existing fields first
      if (replaceExisting && selectedProduct && selectedEvent) {
        // Detect if upload spans multiple panes/sections
        const uniquePaneSections = new Set(
          uploadedFieldsData.map(f => `${f.pane_code}::${f.section_code}`)
        );
        const isMultiPaneSectionUpload = uniquePaneSections.size > 1 || !selectedPane || !selectedSection;

        if (isMultiPaneSectionUpload) {
          // Clear ALL fields for this product-event (across all panes/sections)
          const { data: deletedCount, error: deleteError } = await supabase.rpc('delete_fields_by_product_event', {
            p_user_id: customUser.id,
            p_product_code: selectedProduct,
            p_event_type: selectedEvent
          });

          if (deleteError) throw deleteError;
          
          if (deletedCount && deletedCount > 0) {
            toast.info(`Cleared ${deletedCount} existing fields for ${selectedProduct}/${selectedEvent}`);
          }
        } else if (selectedPane && selectedSection) {
          // Clear only specific pane-section
          const { data: deletedCount, error: deleteError } = await supabase.rpc('delete_fields_by_config', {
            p_user_id: customUser.id,
            p_product_code: selectedProduct,
            p_event_type: selectedEvent,
            p_pane_code: selectedPane,
            p_section_code: selectedSection
          });

          if (deleteError) throw deleteError;
          
          if (deletedCount && deletedCount > 0) {
            toast.info(`Cleared ${deletedCount} existing fields`);
          }
        }
      }

      const fieldsToSave = uploadedFieldsData.map((field, index) => {
        const { id, dropdown_values, ...fieldWithoutIdAndDropdown } = field;
        // Handle dropdown_values - could be string or array
        let dropdownValuesArray = null;
        if (dropdown_values) {
          if (Array.isArray(dropdown_values)) {
            dropdownValuesArray = dropdown_values;
          } else if (typeof dropdown_values === 'string') {
            dropdownValuesArray = dropdown_values.split(',').map((v: string) => v.trim()).filter((v: string) => v);
          }
        }
        // Auto-generate field_code from field_label_key if not provided
        const autoFieldCode = field.field_code || generateFieldCode(field.field_label_key || '');
        return {
          ...fieldWithoutIdAndDropdown,
          field_id: `FLD_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          field_code: autoFieldCode,
          dropdown_values: dropdownValuesArray,
          field_actions: field.field_actions as any,
        };
      });

      // Use security definer function to bypass RLS
      const { error } = await supabase.rpc('insert_field_repository', {
        p_user_id: customUser.id,
        p_fields: fieldsToSave
      });

      if (error) throw error;
      
      toast.success(`${fieldsToSave.length} fields saved successfully!`);
      setShowFieldForm(false);
      setUploadedFieldsData([]);
      setCurrentUploadIndex(0);
      setUploadFileName('');
      setReplaceExisting(false);
      setGridWarnings([]);
      fetchExistingFields();
    } catch (error: any) {
      toast.error('Failed to save fields', { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelUpload = () => {
    setShowUploadDialog(false);
    setUploadedFieldsData([]);
    setCurrentUploadIndex(0);
    setUploadFileName('');
    setReplaceExisting(false);
    setGridWarnings([]);
  };


  const handleSaveField = async () => {
    if (!customUser?.id) {
      toast.error('You must be logged in to save fields');
      return;
    }

    // Only require Field Name (field_label_key)
    if (!fieldData.field_label_key) {
      toast.error('Field Name is required');
      return;
    }

    setSaving(true);
    try {
      const fieldId = fieldData.field_id || `FLD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Auto-generate field_code from field_label_key if not provided
      const autoFieldCode = fieldData.field_code || generateFieldCode(fieldData.field_label_key);
      
      // Handle dropdown_values - could be string or array
      let dropdownValuesArray = null;
      if (fieldData.dropdown_values) {
        if (Array.isArray(fieldData.dropdown_values)) {
          dropdownValuesArray = fieldData.dropdown_values;
        } else if (typeof fieldData.dropdown_values === 'string') {
          dropdownValuesArray = fieldData.dropdown_values.split(',').map((v: string) => v.trim()).filter((v: string) => v);
        }
      }
      
      const { id, dropdown_values, ...fieldDataWithoutIdAndDropdown } = fieldData;
      
      const saveData = {
        ...fieldDataWithoutIdAndDropdown,
        field_id: fieldId,
        field_code: autoFieldCode,
        dropdown_values: dropdownValuesArray,
        field_actions: fieldData.field_actions as any,
      };

      if (editingField?.id) {
        // Use security definer function to bypass RLS
        const { data, error } = await supabase.rpc('update_field_repository', {
          p_user_id: customUser.id,
          p_field_id: editingField.id,
          p_field_data: saveData
        });

        if (error) throw error;
        if (!data) {
          toast.error('Update failed - field may not exist or no changes were made');
          return;
        }
        toast.success('Field updated successfully');
      } else {
        // Use security definer function to bypass RLS
        const { error } = await supabase.rpc('insert_field_repository', {
          p_user_id: customUser.id,
          p_fields: [saveData]
        });

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
  
  // New: Check if Product+Event are selected (for bulk upload without Pane/Section)
  const isProductEventSelected = selectedBusinessApp && selectedCustomerSegment && 
    selectedProduct && selectedEvent;

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
                  <Label>Pane <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Select 
                    value={selectedPane} 
                    onValueChange={(value) => handlePaneChange(value === '_none_' ? '' : value)}
                    disabled={!selectedEvent || availablePanes.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none_" className="text-muted-foreground italic">-- None (Bulk Upload) --</SelectItem>
                      {availablePanes.map(pane => (
                        <SelectItem key={pane.id} value={pane.name}>{pane.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <Label>Section <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={(value) => setSelectedSection(value === '_none_' ? '' : value)}
                    disabled={!selectedPane || availableSections.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none_" className="text-muted-foreground italic">-- None (Bulk Upload) --</SelectItem>
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

      {/* Bulk Upload Section - Available when Product+Event are selected */}
      {isProductEventSelected && !isSelectionComplete && (
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Bulk Upload for {selectedProduct} - {selectedEvent}
            </CardTitle>
            <CardDescription>
              Upload an Excel file containing fields for all panes and sections of this Product-Event combination.
              <br />
              <span className="text-xs text-muted-foreground">
                (Select a specific Pane and Section above to view/manage individual fields)
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Excel File
            </Button>
          </CardContent>
        </Card>
      )}

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
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); setShowUploadDialog(true); }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); handleAddField(); }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
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
                          <TableHead className="w-16">Move</TableHead>
                          <TableHead>Field Name</TableHead>
                          <TableHead>UI Type</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>SWIFT Tag</TableHead>
                          <TableHead className="w-20">Active</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {existingFields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>{field.field_display_sequence}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoveFieldUp(field.id!, index)}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoveFieldDown(field.id!, index)}
                                  disabled={index === existingFields.length - 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{field.field_label_key || '-'}</TableCell>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="signature">Field Signature</TabsTrigger>
                <TabsTrigger value="swift">SWIFT Details</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="other">Other Details</TabsTrigger>
              </TabsList>

              {/* Field Signature Tab */}
              <TabsContent value="signature" className="space-y-6 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* 1. Field Name */}
                  <div className="space-y-2">
                    <Label tooltip="Unique label name for the field">Field Name *</Label>
                    <Input
                      value={fieldData.field_label_key}
                      onChange={(e) => updateFieldData('field_label_key', e.target.value)}
                      placeholder="e.g., Applicant Name"
                    />
                  </div>
                  
                  {/* 2. Field Tooltip Text */}
                  <div className="space-y-2">
                    <Label tooltip="Help/tooltip text to understand what this field is about">Field Tooltip Text</Label>
                    <Input
                      value={fieldData.field_tooltip_key}
                      onChange={(e) => updateFieldData('field_tooltip_key', e.target.value)}
                      placeholder="e.g., Enter the applicant's full name"
                    />
                  </div>
                  
                  {/* 3. Field Coordinates */}
                  <div className="space-y-2">
                    <Label tooltip="Order of field inside section based on Row and Column numbers (e.g., R1, C1)">Field Coordinates</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select
                          value={`R${fieldData.field_row}`}
                          onValueChange={(val) => updateFieldData('field_row', parseInt(val.replace('R', '')) || 1)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Row" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={`R${num}`}>R{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Select
                          value={`C${fieldData.field_column}`}
                          onValueChange={(val) => updateFieldData('field_column', parseInt(val.replace('C', '')) || 1)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Column" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={`C${num}`}>C{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* 4. UI Display Type */}
                  <div className="space-y-2">
                    <Label tooltip="UI control type for this field">UI Display Type</Label>
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
                  
                  {/* 5. Data Type */}
                  <div className="space-y-2">
                    <Label tooltip="Underlying data type for the field value">Data Type</Label>
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
                  
                  {/* 6. Lookup Code */}
                  <div className="space-y-2">
                    <Label tooltip="Reference/lookup list code if DROPDOWN/RADIO type">Lookup Code</Label>
                    <Input
                      value={fieldData.lookup_code}
                      onChange={(e) => updateFieldData('lookup_code', e.target.value)}
                      placeholder="e.g., COUNTRY_LIST, CURRENCY_LIST"
                    />
                  </div>
                  
                  {/* 7. Dropdown Values */}
                  <div className="space-y-2">
                    <Label tooltip="Optional if Lookup_Code is not available. Enter comma-separated values">Dropdown Values</Label>
                    <Input
                      value={fieldData.dropdown_values}
                      onChange={(e) => updateFieldData('dropdown_values', e.target.value)}
                      placeholder="e.g., Irrevocable, Irrevocable Transferable"
                    />
                  </div>
                  
                  {/* 8. Length Min */}
                  <div className="space-y-2">
                    <Label tooltip="Minimum allowable length (characters) or digits">Length Min</Label>
                    <Input
                      type="number"
                      value={fieldData.length_min}
                      onChange={(e) => updateFieldData('length_min', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* 9. Length Max */}
                  <div className="space-y-2">
                    <Label tooltip="Maximum allowable length (aligned with SWIFT or internal rule)">Length Max</Label>
                    <Input
                      type="number"
                      value={fieldData.length_max}
                      onChange={(e) => updateFieldData('length_max', parseInt(e.target.value) || 255)}
                    />
                  </div>
                  
                  {/* 10. Decimal Places */}
                  <div className="space-y-2">
                    <Label tooltip="Number of decimal places for numeric/amount fields">Decimal Places</Label>
                    <Input
                      type="number"
                      value={fieldData.decimal_places}
                      onChange={(e) => updateFieldData('decimal_places', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* 11. Default Value */}
                  <div className="space-y-2">
                    <Label tooltip="Default value to populate in the text field">Default Value</Label>
                    <Input
                      value={fieldData.default_value}
                      onChange={(e) => updateFieldData('default_value', e.target.value)}
                    />
                  </div>
                  
                  {/* 12. Size Standard Source */}
                  <div className="space-y-2">
                    <Label tooltip="Whether size is from SWIFT, Custom, or ISO 20022">Size Standard Source</Label>
                    <Select 
                      value={fieldData.size_standard_source} 
                      onValueChange={(v) => updateFieldData('size_standard_source', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZE_STANDARD_SOURCES.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 12a. Mapped From (Auto-populate from another field) */}
                  <div className="space-y-2">
                    <Label tooltip="Select a field from any pane/section whose value should auto-populate this field during transaction processing">Mapped From</Label>
                    <Select 
                      value={fieldData.mapped_from_field_code || '_none_'} 
                      onValueChange={(v) => updateFieldData('mapped_from_field_code', v === '_none_' ? '' : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source field..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="_none_" className="text-muted-foreground italic">-- None --</SelectItem>
                        {allFieldsForMapping
                          .filter(f => f.field_code !== fieldData.field_code) // Exclude current field
                          .map(f => (
                            <SelectItem key={f.id || f.field_id} value={f.field_code}>
                              {f.field_label_key} ({f.pane_code} → {f.section_code})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {fieldData.mapped_from_field_code && (
                      <p className="text-xs text-muted-foreground">
                        Value will auto-populate from: <span className="font-medium">{fieldData.mapped_from_field_code}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Mandatory Flags */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Mandatory Settings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* 13. Is Mandatory Portal */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_mandatory_portal}
                        onCheckedChange={(v) => updateFieldData('is_mandatory_portal', v)}
                      />
                      <Label tooltip="Y/N – mandatory in Corporate Portal for this event + stage">Is Mandatory (Portal)</Label>
                    </div>
                    
                    {/* 14. Is Mandatory MO */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_mandatory_mo}
                        onCheckedChange={(v) => updateFieldData('is_mandatory_mo', v)}
                      />
                      <Label tooltip="Y/N – mandatory in Middle Office">Is Mandatory (MO)</Label>
                    </div>
                    
                    {/* 15. Is Mandatory BO */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_mandatory_bo}
                        onCheckedChange={(v) => updateFieldData('is_mandatory_bo', v)}
                      />
                      <Label tooltip="Y/N – mandatory in Back Office">Is Mandatory (BO)</Label>
                    </div>
                  </div>
                </div>

                {/* Conditional Expressions */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Conditional Expressions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* 16. Conditional Visibility Expression */}
                    <div className="space-y-2">
                      <Label tooltip="Expression for dynamic show/hide based on other fields">Conditional Visibility Expr</Label>
                      <Textarea
                        value={fieldData.conditional_visibility_expr}
                        onChange={(e) => updateFieldData('conditional_visibility_expr', e.target.value)}
                        placeholder="e.g., IF(SHIPMENT_PARTIAL='Y')"
                        rows={2}
                      />
                    </div>
                    
                    {/* 17. Conditional Mandatory Expression */}
                    <div className="space-y-2">
                      <Label tooltip="Expression to dynamically make field mandatory">Conditional Mandatory Expr</Label>
                      <Textarea
                        value={fieldData.conditional_mandatory_expr}
                        onChange={(e) => updateFieldData('conditional_mandatory_expr', e.target.value)}
                        placeholder="e.g., IF(LC_TYPE='REVOLVING')"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Visibility Flags */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Visibility Settings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* 18. Is Visible FO (Portal) */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.channel_customer_portal_flag}
                        onCheckedChange={(v) => updateFieldData('channel_customer_portal_flag', v)}
                      />
                      <Label tooltip="Y/N – whether field should be made visible in Portal">Is Visible (Portal)</Label>
                    </div>
                    
                    {/* 19. Is Visible MO */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.channel_middle_office_flag}
                        onCheckedChange={(v) => updateFieldData('channel_middle_office_flag', v)}
                      />
                      <Label tooltip="Y/N – whether field should be made visible in Middle Office">Is Visible (MO)</Label>
                    </div>
                    
                    {/* 20. Is Visible BO */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.channel_back_office_flag}
                        onCheckedChange={(v) => updateFieldData('channel_back_office_flag', v)}
                      />
                      <Label tooltip="Y/N – whether field should be made visible in Back Office">Is Visible (BO)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.is_active_flag}
                        onCheckedChange={(v) => updateFieldData('is_active_flag', v)}
                      />
                      <Label tooltip="Whether this field configuration is active">Active</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SWIFT Details Tab */}
              <TabsContent value="swift" className="space-y-6 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* 21. SWIFT MT Type */}
                  <div className="space-y-2">
                    <Label tooltip="Related MT type(s) for mapping (e.g., MT700, MT707)">SWIFT MT Type</Label>
                    <Input
                      value={fieldData.swift_mt_type}
                      onChange={(e) => updateFieldData('swift_mt_type', e.target.value)}
                      placeholder="e.g., MT700, MT707"
                    />
                  </div>
                  
                  {/* 22. SWIFT Sequence */}
                  <div className="space-y-2">
                    <Label tooltip="SWIFT sequence (A/B/C etc.) if applicable">SWIFT Sequence</Label>
                    <Input
                      value={fieldData.swift_sequence}
                      onChange={(e) => updateFieldData('swift_sequence', e.target.value)}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                  
                  {/* 23. SWIFT Tag */}
                  <div className="space-y-2">
                    <Label tooltip="SWIFT tag number for mapping">SWIFT Tag</Label>
                    <Input
                      value={fieldData.swift_tag}
                      onChange={(e) => updateFieldData('swift_tag', e.target.value)}
                      placeholder="e.g., 50, 59, 32B"
                    />
                  </div>
                  
                  {/* 24. SWIFT Subfield Qualifier */}
                  <div className="space-y-2">
                    <Label tooltip="Qualifier/sub-field within the tag">SWIFT Subfield Qualifier</Label>
                    <Input
                      value={fieldData.swift_subfield_qualifier}
                      onChange={(e) => updateFieldData('swift_subfield_qualifier', e.target.value)}
                      placeholder="e.g., NAME, ADDRESS, CURRENCY"
                    />
                  </div>
                  
                  {/* 25. SWIFT Tag Display Flag */}
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        checked={fieldData.swift_tag_display_flag}
                        onCheckedChange={(v) => updateFieldData('swift_tag_display_flag', v)}
                      />
                      <Label tooltip="Y/N – whether to show SWIFT tag near label in UI">SWIFT Tag Display Flag</Label>
                    </div>
                  </div>
                  
                  {/* 26. SWIFT Format Pattern */}
                  <div className="space-y-2">
                    <Label tooltip="Pattern as per SWIFT (e.g., 3!a15d)">SWIFT Format Pattern</Label>
                    <Input
                      value={fieldData.swift_format_pattern}
                      onChange={(e) => updateFieldData('swift_format_pattern', e.target.value)}
                      placeholder="e.g., 3!a15d"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Other Details Tab */}
              <TabsContent value="other" className="space-y-6 mt-4">
                {/* Sanction & Limit Checks */}
                <div>
                  <h4 className="font-medium mb-4">Sanction & Limit Configuration</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* 27. Sanction Check Required Flag */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.sanction_check_required_flag}
                        onCheckedChange={(v) => updateFieldData('sanction_check_required_flag', v)}
                      />
                      <Label tooltip="Y/N – this field feeds sanction screening">Sanction Check Required</Label>
                    </div>
                    
                    {/* 28. Sanction Engine Field Map */}
                    <div className="space-y-2 col-span-2">
                      <Label tooltip="Mapping key used in sanction engine payload">Sanction Engine Field Map</Label>
                      <Input
                        value={fieldData.sanction_engine_field_map}
                        onChange={(e) => updateFieldData('sanction_engine_field_map', e.target.value)}
                        placeholder="e.g., sanc.applicant.name"
                        disabled={!fieldData.sanction_check_required_flag}
                      />
                    </div>
                    
                    {/* 29. Limit Check Required Flag */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={fieldData.limit_check_required_flag}
                        onCheckedChange={(v) => updateFieldData('limit_check_required_flag', v)}
                      />
                      <Label tooltip="Y/N – field used for limit exposure calculation">Limit Check Required</Label>
                    </div>
                    
                    {/* 30. Error Message Key */}
                    <div className="space-y-2 col-span-2">
                      <Label tooltip="Default validation error message key">Error Message Key</Label>
                      <Input
                        value={fieldData.error_message_key}
                        onChange={(e) => updateFieldData('error_message_key', e.target.value)}
                        placeholder="e.g., err.applicantName.required"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Mappings */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Additional Mappings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* 31. Help Content Type */}
                    <div className="space-y-2">
                      <Label tooltip="Type of help content: INLINE_TEXT, LINK, or DOC_ID">Help Content Type</Label>
                      <Select 
                        value={fieldData.help_content_type} 
                        onValueChange={(v) => updateFieldData('help_content_type', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HELP_CONTENT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* 32. ISO20022 Element Code */}
                    <div className="space-y-2">
                      <Label tooltip="Mapping to camt., trax., tsmt., and Bank's Trade API schemas">ISO20022 Element Code</Label>
                      <Input
                        value={fieldData.iso20022_element_code}
                        onChange={(e) => updateFieldData('iso20022_element_code', e.target.value)}
                        placeholder="e.g., ApplcntDtls/Nm"
                      />
                    </div>
                    
                    {/* 33. ISO Data Format Pattern */}
                    <div className="space-y-2">
                      <Label tooltip="To validate IBAN, BIC, structured addresses, currency formats, and Party identifiers">ISO Data Format Pattern</Label>
                      <Input
                        value={fieldData.iso_data_format_pattern}
                        onChange={(e) => updateFieldData('iso_data_format_pattern', e.target.value)}
                        placeholder="e.g., [A-Z]{2}[0-9]{2}..."
                      />
                    </div>
                    
                    {/* 34. AI Mapping Key */}
                    <div className="space-y-2">
                      <Label tooltip="Links field to NLP/OCR token mapping for autonomous extraction">AI Mapping Key</Label>
                      <Input
                        value={fieldData.ai_mapping_key}
                        onChange={(e) => updateFieldData('ai_mapping_key', e.target.value)}
                        placeholder="e.g., applicant.name"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="mt-4">
                <FieldActionsTab
                  fieldActions={fieldData.field_actions || null}
                  onChange={(actions) => updateFieldData('field_actions', actions)}
                  isReadOnly={false}
                  availableFields={existingFields.map(f => ({
                    code: f.field_code || '',
                    label: f.field_label_key || ''
                  })).filter(f => f.code)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Upload Excel Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Field Definition</DialogTitle>
            <DialogDescription>
              Upload an Excel file containing field definition data. The system will auto-populate the form fields.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Upload Scope Information */}
            <div className="p-3 border rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-2">Upload Scope</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{selectedProduct || 'No Product'}</Badge>
                <Badge variant="outline">{selectedEvent || 'No Event'}</Badge>
                {selectedPane && <Badge>{selectedPane}</Badge>}
                {selectedSection && <Badge>{selectedSection}</Badge>}
                {!selectedPane && !selectedSection && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">All Panes & Sections</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Excel File (.xlsx, .xls)</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="cursor-pointer"
              />
              {uploadFileName && (
                <p className="text-sm text-muted-foreground">Selected: {uploadFileName}</p>
              )}
            </div>

            {/* Clear & Replace Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/30">
              <Checkbox 
                id="replaceExisting" 
                checked={replaceExisting}
                onCheckedChange={(checked) => setReplaceExisting(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="replaceExisting"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Clear & Replace Existing Fields
                </label>
                <p className="text-xs text-muted-foreground">
                  {(!selectedPane || !selectedSection) 
                    ? `Delete ALL existing fields for ${selectedProduct}/${selectedEvent} before importing`
                    : `Delete existing fields for ${selectedPane}/${selectedSection} before importing`
                  }
                </p>
              </div>
            </div>

            {/* Multi-pane/section warning when Clear & Replace is selected */}
            {replaceExisting && (
              (() => {
                const uniquePaneSections = uploadedFieldsData.length > 0 
                  ? new Set(uploadedFieldsData.map(f => `${f.pane_code}::${f.section_code}`))
                  : new Set<string>();
                const isMultiPaneSection = uniquePaneSections.size > 1 || !selectedPane || !selectedSection;
                
                // Group existing fields by pane-section for display
                const existingByPaneSection = existingFieldsForDeletion.reduce((acc, field) => {
                  const key = `${field.pane_code}::${field.section_code}`;
                  if (!acc[key]) {
                    acc[key] = { pane: field.pane_code, section: field.section_code, count: 0, fields: [] as string[] };
                  }
                  acc[key].count++;
                  acc[key].fields.push(field.field_label_key || field.field_code || 'Unnamed');
                  return acc;
                }, {} as Record<string, { pane: string; section: string; count: number; fields: string[] }>);
                
                const paneSectionGroups = Object.values(existingByPaneSection);
                
                if (isMultiPaneSection || existingFieldsForDeletion.length > 0) {
                  return (
                    <div className="p-3 border rounded-lg bg-destructive/10 border-destructive/30 space-y-3">
                      <p className="text-sm text-destructive font-medium">
                        ⚠️ Bulk Clear Warning
                      </p>
                      {uploadedFieldsData.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          This upload contains fields for {uniquePaneSections.size} pane-section combination(s). 
                          Enabling "Clear & Replace" will delete <strong>ALL</strong> existing fields for {selectedProduct}/{selectedEvent} before importing.
                        </p>
                      )}
                      
                      {/* Show existing fields that will be deleted */}
                      {loadingExistingFields ? (
                        <p className="text-xs text-muted-foreground">Loading existing fields...</p>
                      ) : existingFieldsForDeletion.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-destructive">
                            {existingFieldsForDeletion.length} existing field(s) will be deleted:
                          </p>
                          <div className="max-h-40 overflow-y-auto space-y-2 bg-background/50 rounded p-2">
                            {paneSectionGroups.map((group, idx) => (
                              <div key={idx} className="text-xs border-b border-destructive/20 pb-2 last:border-b-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    {group.pane}
                                  </Badge>
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {group.section}
                                  </Badge>
                                  <span className="text-muted-foreground">({group.count} fields)</span>
                                </div>
                                <div className="pl-2 text-muted-foreground">
                                  {group.fields.slice(0, 5).join(', ')}
                                  {group.fields.length > 5 && ` ... +${group.fields.length - 5} more`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No existing fields found for {selectedProduct}/{selectedEvent}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()
            )}
            {/* Grid Warnings */}
            {gridWarnings.length > 0 && (
              <div className="space-y-2 p-4 border rounded-lg bg-amber-500/10 border-amber-500/30">
                <h4 className="font-medium text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  ⚠️ Grid Configuration Warnings ({gridWarnings.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {gridWarnings.map((warning, index) => (
                    <div key={index} className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fields will still be uploaded, but you should update the Pane and Section grid dimensions in "Manage Panes and Sections" to match.
                </p>
              </div>
            )}

            {uploadedFieldsData.length > 0 && (
              <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium text-sm">Parsed Data Preview ({uploadedFieldsData.length} fields):</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {uploadedFieldsData.map((field, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-xs border-b pb-2">
                      <div>
                        <span className="text-muted-foreground">#{index + 1} Pane:</span>
                        <p className="font-mono truncate">{field.pane_code || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Section:</span>
                        <p className="truncate">{field.section_code || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Field:</span>
                        <p className="truncate">{field.field_code || field.field_label_key || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p>{field.ui_display_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Click "Save All Fields" to import all fields at once, or "Review One by One" to review each field.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelUpload}>Cancel</Button>
            <Button variant="secondary" onClick={handleConfirmUpload} disabled={uploadedFieldsData.length === 0}>
              Review One by One
            </Button>
            <Button onClick={handleSaveAllFields} disabled={uploadedFieldsData.length === 0 || saving}>
              {saving ? 'Saving...' : `Save All ${uploadedFieldsData.length} Fields`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FieldDefinition;
