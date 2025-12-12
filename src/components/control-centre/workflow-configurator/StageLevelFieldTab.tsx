import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Search, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WorkflowTemplate, WorkflowStage, WorkflowStageField } from '../NextGenWorkflowConfigurator';

interface StageLevelFieldTabProps {
  stage: WorkflowStage | null;
  template: WorkflowTemplate | null;
  onBack: () => void;
  viewOnly?: boolean;
}

interface AvailableField {
  field_id: string;
  field_code: string;
  field_label_key: string;
  pane_code: string;
  section_code: string;
  ui_display_type: string;
}

export function StageLevelFieldTab({ stage, template, onBack, viewOnly = false }: StageLevelFieldTabProps) {
  const [stageFields, setStageFields] = useState<WorkflowStageField[]>([]);
  const [availableFields, setAvailableFields] = useState<AvailableField[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allVisible, setAllVisible] = useState(false);
  const [allEditable, setAllEditable] = useState(false);
  const [allMandatory, setAllMandatory] = useState(false);

  useEffect(() => {
    if (stage) {
      fetchData();
    }
  }, [stage]);

  const fetchData = async () => {
    if (!stage) return;

    try {
      // Fetch existing stage fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('workflow_stage_fields')
        .select('*')
        .eq('stage_id', stage.id)
        .order('field_order', { ascending: true });

      if (fieldsError) throw fieldsError;
      setStageFields((fieldsData || []) as WorkflowStageField[]);

      // Fetch available fields from field_repository filtered by template's product and event
      let query = supabase
        .from('field_repository')
        .select('field_id, field_code, field_label_key, pane_code, section_code, ui_display_type')
        .eq('is_active_flag', true);

      // Filter by product_code and event_type from the template
      if (template?.product_code) {
        query = query.eq('product_code', template.product_code);
      }
      if (template?.event_code) {
        query = query.eq('event_type', template.event_code);
      }

      const { data: repoData, error: repoError } = await query.limit(500);

      if (repoError) throw repoError;
      console.log('Fetched fields for', template?.product_code, template?.event_code, ':', repoData?.length);
      setAvailableFields((repoData || []) as AvailableField[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = async (field: AvailableField) => {
    if (!stage) return;

    // Check if field already added
    if (stageFields.some(sf => sf.field_id === field.field_id)) {
      toast.error('Field already added');
      return;
    }

    const newOrder = stageFields.length + 1;

    try {
      const { data, error } = await supabase
        .from('workflow_stage_fields')
        .insert({
          stage_id: stage.id,
          field_id: field.field_id,
          field_name: field.field_code || field.field_id,
          pane: field.pane_code || '',
          section: field.section_code || '',
          ui_label: field.field_label_key || field.field_code || field.field_id,
          ui_display_type: field.ui_display_type || 'text',
          is_visible: true,
          is_editable: true,
          is_mandatory: false,
          field_order: newOrder,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Field added');
      setStageFields(prev => [...prev, data as WorkflowStageField]);
    } catch (error) {
      console.error('Error adding field:', error);
      toast.error('Failed to add field');
    }
  };

  const handleAddAllFields = async () => {
    if (!stage) return;

    const fieldsToAdd = filteredAvailableFields.filter(
      af => !stageFields.some(sf => sf.field_id === af.field_id)
    );

    if (fieldsToAdd.length === 0) {
      toast.info('All available fields are already added');
      return;
    }

    let startOrder = stageFields.length + 1;

    try {
      const insertData = fieldsToAdd.map((field, idx) => ({
        stage_id: stage.id,
        field_id: field.field_id,
        field_name: field.field_code || field.field_id,
        pane: field.pane_code || '',
        section: field.section_code || '',
        ui_label: field.field_label_key || field.field_code || field.field_id,
        ui_display_type: field.ui_display_type || 'text',
        is_visible: true,
        is_editable: true,
        is_mandatory: false,
        field_order: startOrder + idx,
      }));

      const { data, error } = await supabase
        .from('workflow_stage_fields')
        .insert(insertData)
        .select();

      if (error) throw error;

      toast.success(`Added ${fieldsToAdd.length} fields`);
      setStageFields(prev => [...prev, ...(data as WorkflowStageField[])]);
    } catch (error) {
      console.error('Error adding fields:', error);
      toast.error('Failed to add fields');
    }
  };

  const handleUpdateField = async (fieldId: string, updates: Partial<WorkflowStageField>) => {
    try {
      const { error } = await supabase
        .from('workflow_stage_fields')
        .update(updates)
        .eq('id', fieldId);

      if (error) throw error;

      setStageFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Failed to update field');
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('workflow_stage_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      toast.success('Field removed');
      setStageFields(prev => prev.filter(f => f.id !== fieldId));
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error('Failed to remove field');
    }
  };

  const handleToggleAllVisible = async () => {
    const newValue = !allVisible;
    setAllVisible(newValue);
    
    for (const field of stageFields) {
      await handleUpdateField(field.id, { is_visible: newValue });
    }
  };

  const handleToggleAllEditable = async () => {
    const newValue = !allEditable;
    setAllEditable(newValue);
    
    for (const field of stageFields) {
      await handleUpdateField(field.id, { is_editable: newValue });
    }
  };

  const handleToggleAllMandatory = async () => {
    const newValue = !allMandatory;
    setAllMandatory(newValue);
    
    for (const field of stageFields) {
      await handleUpdateField(field.id, { is_mandatory: newValue });
    }
  };

  const handleSave = () => {
    toast.success('Field configuration saved');
  };

  const filteredAvailableFields = availableFields.filter(f =>
    (f.field_code || f.field_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.field_label_key || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!stage || !template) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Please select a stage first
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stages
          </Button>
          <div className="border-l border-border h-6" />
          <div>
            <h2 className="font-semibold text-foreground">{stage.stage_name}</h2>
            <p className="text-sm text-muted-foreground">
              {template.template_name} • {stage.actor_type}
            </p>
          </div>
        </div>
        {!viewOnly && (
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Field Configuration
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Available Fields (hidden in view-only mode) */}
        {!viewOnly && (
          <Card className="w-80 flex-shrink-0 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Available Fields</CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddAllFields}>
                  Add All
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : filteredAvailableFields.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No fields found
                </div>
              ) : (
                filteredAvailableFields.map((field) => (
                  <div
                    key={field.field_id}
                    className={`flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors ${
                      stageFields.some(sf => sf.field_id === field.field_id) ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{field.field_code || field.field_id}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {field.pane_code} • {field.section_code}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddField(field)}
                      disabled={stageFields.some(sf => sf.field_id === field.field_id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Right Panel - Field Configuration Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!viewOnly && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={allVisible} onCheckedChange={handleToggleAllVisible} />
                <label className="text-sm">All Visible</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={allEditable} onCheckedChange={handleToggleAllEditable} />
                <label className="text-sm">All Editable</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={allMandatory} onCheckedChange={handleToggleAllMandatory} />
                <label className="text-sm">All Mandatory</label>
              </div>
            </div>
          )}
          {viewOnly && (
            <div className="text-sm text-muted-foreground mb-4">
              View-only mode - field configuration is read-only
            </div>
          )}

          <Card className="flex-1 overflow-hidden">
            <div className="overflow-auto h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Pane</TableHead>
                    <TableHead className="w-32">Section</TableHead>
                    <TableHead>Field Name</TableHead>
                    <TableHead>UI Label</TableHead>
                    <TableHead className="w-32">Display Type</TableHead>
                    <TableHead className="w-20 text-center">Visible</TableHead>
                    <TableHead className="w-20 text-center">Editable</TableHead>
                    <TableHead className="w-20 text-center">Mandatory</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stageFields.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        Add fields from the left panel
                      </TableCell>
                    </TableRow>
                  ) : (
                    stageFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Input
                            value={field.pane}
                            onChange={(e) => handleUpdateField(field.id, { pane: e.target.value })}
                            className="h-8"
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={field.section}
                            onChange={(e) => handleUpdateField(field.id, { section: e.target.value })}
                            className="h-8"
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{field.field_name}</TableCell>
                        <TableCell>
                          <Input
                            value={field.ui_label}
                            onChange={(e) => handleUpdateField(field.id, { ui_label: e.target.value })}
                            className="h-8"
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={field.ui_display_type}
                            onChange={(e) => handleUpdateField(field.id, { ui_display_type: e.target.value })}
                            className="h-8"
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={field.is_visible}
                            onCheckedChange={(checked) => handleUpdateField(field.id, { is_visible: !!checked })}
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={field.is_editable}
                            onCheckedChange={(checked) => handleUpdateField(field.id, { is_editable: !!checked })}
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={field.is_mandatory}
                            onCheckedChange={(checked) => handleUpdateField(field.id, { is_mandatory: !!checked })}
                            disabled={viewOnly}
                          />
                        </TableCell>
                        <TableCell>
                          {!viewOnly && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteField(field.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
