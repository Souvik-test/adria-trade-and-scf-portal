import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clearTemplateCache } from '@/services/workflowTemplateService';
import type { WorkflowTemplate, WorkflowCondition } from '../NextGenWorkflowConfigurator';

interface TemplateLevelConditionsTabProps {
  template: WorkflowTemplate | null;
  onBack: () => void;
  viewOnly?: boolean;
}

const OPERATORS = [
  'Equals',
  'Not Equals',
  'Greater Than',
  'Less Than',
  'Greater Than or Equal',
  'Less Than or Equal',
  'In List',
  'Not In List',
  'Contains',
  'Starts With',
  'Ends With',
  'Is Empty',
  'Is Not Empty',
];

const SAMPLE_FIELDS = [
  'lc_amount',
  'currency',
  'applicant_country',
  'beneficiary_country',
  'expiry_date',
  'tenor_days',
  'product_type',
  'is_transferable',
  'partial_shipments_allowed',
  'transshipment_allowed',
];

interface ConditionGroup {
  name: string;
  operator: 'AND' | 'OR';
  conditions: WorkflowCondition[];
}

export function TemplateLevelConditionsTab({ template, onBack, viewOnly = false }: TemplateLevelConditionsTabProps) {
  const [groups, setGroups] = useState<ConditionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (template) {
      fetchConditions();
    }
  }, [template]);

  const fetchConditions = async () => {
    if (!template) return;

    try {
      const { data, error } = await supabase
        .from('workflow_conditions')
        .select('*')
        .eq('template_id', template.id)
        .is('stage_id', null)
        .order('condition_order', { ascending: true });

      if (error) throw error;

      // Group conditions by group_name
      const conditionsData = (data || []) as WorkflowCondition[];
      const groupedConditions: Record<string, ConditionGroup> = {};

      conditionsData.forEach(condition => {
        if (!groupedConditions[condition.group_name]) {
          groupedConditions[condition.group_name] = {
            name: condition.group_name,
            operator: condition.group_operator as 'AND' | 'OR',
            conditions: [],
          };
        }
        groupedConditions[condition.group_name].conditions.push(condition);
      });

      setGroups(Object.values(groupedConditions));
    } catch (error) {
      console.error('Error fetching conditions:', error);
      toast.error('Failed to fetch conditions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    const newGroupName = `Group ${groups.length + 1}`;
    setGroups(prev => [...prev, {
      name: newGroupName,
      operator: 'AND',
      conditions: [],
    }]);
  };

  const handleAddCondition = async (groupIndex: number) => {
    if (!template) return;

    const group = groups[groupIndex];
    const conditionOrder = group.conditions.length;

    try {
      const { data, error } = await supabase
        .from('workflow_conditions')
        .insert({
          template_id: template.id,
          stage_id: null,
          group_name: group.name,
          group_operator: group.operator,
          condition_order: conditionOrder,
          field_name: SAMPLE_FIELDS[0],
          operator: 'Equals',
          compare_type: 'Value',
          compare_value: '',
        })
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => prev.map((g, idx) => 
        idx === groupIndex 
          ? { ...g, conditions: [...g.conditions, data as WorkflowCondition] }
          : g
      ));
    } catch (error) {
      console.error('Error adding condition:', error);
      toast.error('Failed to add condition');
    }
  };

  const handleUpdateCondition = async (groupIndex: number, conditionIndex: number, updates: Partial<WorkflowCondition>) => {
    const condition = groups[groupIndex].conditions[conditionIndex];

    try {
      const { error } = await supabase
        .from('workflow_conditions')
        .update(updates)
        .eq('id', condition.id);

      if (error) throw error;

      setGroups(prev => prev.map((g, gIdx) => 
        gIdx === groupIndex 
          ? {
              ...g,
              conditions: g.conditions.map((c, cIdx) => 
                cIdx === conditionIndex ? { ...c, ...updates } : c
              )
            }
          : g
      ));
    } catch (error) {
      console.error('Error updating condition:', error);
      toast.error('Failed to update condition');
    }
  };

  const handleDeleteCondition = async (groupIndex: number, conditionIndex: number) => {
    const condition = groups[groupIndex].conditions[conditionIndex];

    try {
      const { error } = await supabase
        .from('workflow_conditions')
        .delete()
        .eq('id', condition.id);

      if (error) throw error;

      setGroups(prev => prev.map((g, gIdx) => 
        gIdx === groupIndex 
          ? { ...g, conditions: g.conditions.filter((_, cIdx) => cIdx !== conditionIndex) }
          : g
      ));

      toast.success('Condition deleted');
    } catch (error) {
      console.error('Error deleting condition:', error);
      toast.error('Failed to delete condition');
    }
  };

  const handleDeleteGroup = async (groupIndex: number) => {
    const group = groups[groupIndex];

    try {
      // Delete all conditions in the group
      for (const condition of group.conditions) {
        await supabase
          .from('workflow_conditions')
          .delete()
          .eq('id', condition.id);
      }

      setGroups(prev => prev.filter((_, idx) => idx !== groupIndex));
      toast.success('Group deleted');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const handleUpdateGroupOperator = async (groupIndex: number, operator: 'AND' | 'OR') => {
    const group = groups[groupIndex];

    try {
      // Update all conditions in the group
      for (const condition of group.conditions) {
        await supabase
          .from('workflow_conditions')
          .update({ group_operator: operator })
          .eq('id', condition.id);
      }

      setGroups(prev => prev.map((g, idx) => 
        idx === groupIndex ? { ...g, operator } : g
      ));
    } catch (error) {
      console.error('Error updating group operator:', error);
      toast.error('Failed to update group');
    }
  };

  const handleSaveDraft = async () => {
    if (!template) return;

    try {
      await supabase
        .from('workflow_templates')
        .update({ status: 'draft' })
        .eq('id', template.id);

      clearTemplateCache();
      toast.success('Saved as draft');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const handleSubmitTemplate = async () => {
    if (!template) return;

    try {
      await supabase
        .from('workflow_templates')
        .update({ status: 'submitted' })
        .eq('id', template.id);

      clearTemplateCache();
      toast.success('Template submitted for approval');
    } catch (error) {
      console.error('Error submitting template:', error);
      toast.error('Failed to submit template');
    }
  };

  const generateConditionSummary = (): string => {
    if (groups.length === 0) return 'No conditions defined';

    const summaries = groups.map(group => {
      if (group.conditions.length === 0) return null;

      const conditionTexts = group.conditions.map(c => {
        const compareText = c.compare_type === 'Field' 
          ? `field "${c.compare_field}"`
          : `"${c.compare_value}"`;
        return `${c.field_name} ${c.operator} ${compareText}`;
      });

      return `(${conditionTexts.join(` ${group.operator} `)})`;
    }).filter(Boolean);

    return summaries.length > 0 ? summaries.join(' AND ') : 'No conditions defined';
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Please select a template first
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
            <h2 className="font-semibold text-foreground">{template.template_name}</h2>
            <p className="text-sm text-muted-foreground">
              Template Level Conditions
            </p>
          </div>
        </div>
        {!viewOnly && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSubmitTemplate}>
              <Send className="w-4 h-4 mr-2" />
              Submit Template
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Condition Builder */}
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Condition Groups</h3>
            {!viewOnly && (
              <Button variant="outline" size="sm" onClick={handleAddGroup}>
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            )}
          </div>
          {viewOnly && (
            <div className="text-sm text-muted-foreground">
              View-only mode - conditions are read-only
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : groups.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                <p>No condition groups defined</p>
                <p className="text-sm mt-1">Click "Add Group" to create your first condition group</p>
              </div>
            </Card>
          ) : (
            groups.map((group, groupIndex) => (
              <Card key={groupIndex}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <Select
                        value={group.operator}
                        onValueChange={(val) => handleUpdateGroupOperator(groupIndex, val as 'AND' | 'OR')}
                        disabled={viewOnly}
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {!viewOnly && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleAddCondition(groupIndex)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Condition
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteGroup(groupIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.conditions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No conditions in this group
                    </p>
                  ) : (
                      group.conditions.map((condition, conditionIndex) => (
                        <div key={condition.id} className="flex items-center gap-3">
                          <Select
                            value={condition.field_name}
                            onValueChange={(val) => handleUpdateCondition(groupIndex, conditionIndex, { field_name: val })}
                            disabled={viewOnly}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SAMPLE_FIELDS.map(field => (
                                <SelectItem key={field} value={field}>{field}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(val) => handleUpdateCondition(groupIndex, conditionIndex, { operator: val })}
                            disabled={viewOnly}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATORS.map(op => (
                                <SelectItem key={op} value={op}>{op}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.compare_type}
                            onValueChange={(val) => handleUpdateCondition(groupIndex, conditionIndex, { compare_type: val })}
                            disabled={viewOnly}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Value">Value</SelectItem>
                              <SelectItem value="Field">Field</SelectItem>
                            </SelectContent>
                          </Select>

                          {condition.compare_type === 'Value' ? (
                            <Input
                              placeholder="Enter value"
                              value={condition.compare_value || ''}
                              onChange={(e) => handleUpdateCondition(groupIndex, conditionIndex, { compare_value: e.target.value })}
                              className="flex-1"
                              disabled={viewOnly}
                            />
                          ) : (
                            <Select
                              value={condition.compare_field || ''}
                              onValueChange={(val) => handleUpdateCondition(groupIndex, conditionIndex, { compare_field: val })}
                              disabled={viewOnly}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {SAMPLE_FIELDS.map(field => (
                                  <SelectItem key={field} value={field}>{field}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {!viewOnly && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCondition(groupIndex, conditionIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Panel - Condition Summary */}
        <Card className="w-96 flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-lg">Condition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed font-mono">
                {generateConditionSummary()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              This summary shows the natural language interpretation of your conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
