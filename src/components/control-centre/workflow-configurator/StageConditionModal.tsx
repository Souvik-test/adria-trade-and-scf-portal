import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WorkflowStage, WorkflowCondition } from '../NextGenWorkflowConfigurator';

interface StageConditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: WorkflowStage | null;
  templateId: string;
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
  'Contains',
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
];

export function StageConditionModal({ open, onOpenChange, stage, templateId, viewOnly = false }: StageConditionModalProps) {
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupOperator, setGroupOperator] = useState<'' | 'AND' | 'OR'>('');

  useEffect(() => {
    if (open && stage) {
      fetchConditions();
    }
  }, [open, stage]);

  const fetchConditions = async () => {
    if (!stage) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('workflow_conditions')
        .select('*')
        .eq('stage_id', stage.id)
        .order('condition_order', { ascending: true });

      if (error) throw error;
      setConditions((data || []) as WorkflowCondition[]);
      if (data && data.length > 0) {
        setGroupOperator(data[0].group_operator as '' | 'AND' | 'OR');
      } else {
        setGroupOperator('');
      }
    } catch (error) {
      console.error('Error fetching conditions:', error);
      toast.error('Failed to fetch conditions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCondition = async () => {
    if (!stage) return;

    try {
      const { data, error } = await supabase
        .from('workflow_conditions')
        .insert({
          template_id: templateId,
          stage_id: stage.id,
          group_name: 'Stage Conditions',
          group_operator: groupOperator || 'AND',
          condition_order: conditions.length,
          field_name: SAMPLE_FIELDS[0],
          operator: 'Equals',
          compare_type: 'Value',
          compare_value: '',
        })
        .select()
        .single();

      if (error) throw error;
      setConditions(prev => [...prev, data as WorkflowCondition]);
    } catch (error) {
      console.error('Error adding condition:', error);
      toast.error('Failed to add condition');
    }
  };

  const handleUpdateCondition = async (index: number, updates: Partial<WorkflowCondition>) => {
    const condition = conditions[index];

    try {
      const { error } = await supabase
        .from('workflow_conditions')
        .update(updates)
        .eq('id', condition.id);

      if (error) throw error;
      setConditions(prev => prev.map((c, i) => i === index ? { ...c, ...updates } : c));
    } catch (error) {
      console.error('Error updating condition:', error);
      toast.error('Failed to update condition');
    }
  };

  const handleDeleteCondition = async (index: number) => {
    const condition = conditions[index];

    try {
      const { error } = await supabase
        .from('workflow_conditions')
        .delete()
        .eq('id', condition.id);

      if (error) throw error;
      setConditions(prev => prev.filter((_, i) => i !== index));
      toast.success('Condition deleted');
    } catch (error) {
      console.error('Error deleting condition:', error);
      toast.error('Failed to delete condition');
    }
  };

  const handleUpdateGroupOperator = async (operator: '' | 'AND' | 'OR') => {
    setGroupOperator(operator);

    if (operator && conditions.length > 0) {
      try {
        for (const condition of conditions) {
          await supabase
            .from('workflow_conditions')
            .update({ group_operator: operator })
            .eq('id', condition.id);
        }
      } catch (error) {
        console.error('Error updating group operator:', error);
      }
    }
  };

  const handleSave = () => {
    toast.success('Stage conditions saved');
    onOpenChange(false);
  };

  const generateConditionSummary = (): string => {
    if (conditions.length === 0) {
      return 'No conditions defined for this stage.';
    }

    const conditionStrings = conditions.map(condition => {
      const fieldLabel = condition.field_name.replace(/_/g, ' ');
      const operatorLabel = condition.operator.toLowerCase();
      
      let compareLabel = '';
      if (condition.compare_type === 'Value') {
        compareLabel = condition.compare_value ? `"${condition.compare_value}"` : '(empty)';
      } else {
        compareLabel = condition.compare_field ? `field "${condition.compare_field.replace(/_/g, ' ')}"` : '(no field selected)';
      }

      if (condition.operator === 'Is Empty' || condition.operator === 'Is Not Empty') {
        return `${fieldLabel} ${operatorLabel}`;
      }

      return `${fieldLabel} ${operatorLabel} ${compareLabel}`;
    });

    if (conditions.length === 1) {
      return `Stage will be executed when ${conditionStrings[0]}.`;
    }

    const connector = groupOperator === 'OR' ? ' OR ' : ' AND ';
    return `Stage will be executed when ${conditionStrings.join(connector)}.`;
  };

  if (!stage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {viewOnly ? 'View Stage Conditions' : 'Configure Stage Conditions'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Stage: {stage.stage_name} {viewOnly && '(Read-only)'}
          </p>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Panel - Condition Builder */}
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Label>Combine conditions with:</Label>
                <Select 
                  value={groupOperator} 
                  onValueChange={(val) => handleUpdateGroupOperator(val as '' | 'AND' | 'OR')}
                  disabled={viewOnly}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">(Single condition)</SelectItem>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!viewOnly && (
                <Button variant="outline" size="sm" onClick={handleAddCondition}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : conditions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No conditions defined for this stage
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-auto">
                {conditions.map((condition, index) => (
                  <div key={condition.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Select
                      value={condition.field_name}
                      onValueChange={(val) => handleUpdateCondition(index, { field_name: val })}
                      disabled={viewOnly}
                    >
                      <SelectTrigger className="w-40">
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
                      onValueChange={(val) => handleUpdateCondition(index, { operator: val })}
                      disabled={viewOnly}
                    >
                      <SelectTrigger className="w-36">
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
                      onValueChange={(val) => handleUpdateCondition(index, { compare_type: val })}
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
                        onChange={(e) => handleUpdateCondition(index, { compare_value: e.target.value })}
                        className="flex-1"
                        disabled={viewOnly}
                      />
                    ) : (
                      <Select
                        value={condition.compare_field || ''}
                        onValueChange={(val) => handleUpdateCondition(index, { compare_field: val })}
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
                        onClick={() => handleDeleteCondition(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Condition Summary */}
          <Card className="w-72 flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Condition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {generateConditionSummary()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {viewOnly ? 'Close' : 'Cancel'}
          </Button>
          {!viewOnly && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Conditions
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
