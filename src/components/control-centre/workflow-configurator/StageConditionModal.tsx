import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WorkflowStage, WorkflowCondition } from '../NextGenWorkflowConfigurator';

interface StageConditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: WorkflowStage | null;
  templateId: string;
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

export function StageConditionModal({ open, onOpenChange, stage, templateId }: StageConditionModalProps) {
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupOperator, setGroupOperator] = useState<'AND' | 'OR'>('AND');

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
        setGroupOperator(data[0].group_operator as 'AND' | 'OR');
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
          group_operator: groupOperator,
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

  const handleUpdateGroupOperator = async (operator: 'AND' | 'OR') => {
    setGroupOperator(operator);

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
  };

  const handleSave = () => {
    toast.success('Stage conditions saved');
    onOpenChange(false);
  };

  if (!stage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configure Stage Conditions</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Stage: {stage.stage_name}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label>Combine conditions with:</Label>
              <Select value={groupOperator} onValueChange={(val) => handleUpdateGroupOperator(val as 'AND' | 'OR')}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddCondition}>
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
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
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Select
                    value={condition.field_name}
                    onValueChange={(val) => handleUpdateCondition(index, { field_name: val })}
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
                    />
                  ) : (
                    <Select
                      value={condition.compare_field || ''}
                      onValueChange={(val) => handleUpdateCondition(index, { compare_field: val })}
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

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCondition(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Conditions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
