import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, GripVertical, Settings, FileText, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WorkflowTemplate, WorkflowStage } from '../NextGenWorkflowConfigurator';
import { StageConditionModal } from './StageConditionModal';

interface StageFlowBuilderTabProps {
  template: WorkflowTemplate | null;
  onBack: () => void;
  onStageSelect: (stage: WorkflowStage) => void;
}

const PREDEFINED_STAGES = [
  { name: 'Data Entry', type: 'Input', actor: 'Maker' },
  { name: 'Pre-Input Validation', type: 'Preinput', actor: 'System' },
  { name: 'Compliance Check', type: 'Compliance', actor: 'System' },
  { name: 'Limit Check', type: 'LimitCheck', actor: 'System' },
  { name: 'Checker Review', type: 'Input', actor: 'Checker' },
  { name: 'Authorization', type: 'Authorization', actor: 'Authorization' },
  { name: 'Exception Handling', type: 'Input', actor: 'Exception Handler' },
  { name: 'System Processing', type: 'System', actor: 'System' },
];

const ACTOR_TYPES = ['Maker', 'Checker', 'System', 'Authorization', 'Exception Handler'];
const STAGE_TYPES = ['Input', 'Preinput', 'Compliance', 'LimitCheck', 'Authorization', 'System'];

const ACTOR_COLORS: Record<string, string> = {
  Maker: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Checker: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  System: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  Authorization: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Exception Handler': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function StageFlowBuilderTab({ template, onBack, onStageSelect }: StageFlowBuilderTabProps) {
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedStageForCondition, setSelectedStageForCondition] = useState<WorkflowStage | null>(null);

  useEffect(() => {
    if (template) {
      fetchStages();
    }
  }, [template]);

  const fetchStages = async () => {
    if (!template) return;
    
    try {
      const { data, error } = await supabase
        .from('workflow_stages')
        .select('*')
        .eq('template_id', template.id)
        .order('stage_order', { ascending: true });

      if (error) throw error;
      setStages((data || []) as WorkflowStage[]);
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast.error('Failed to fetch stages');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async (predefinedStage: typeof PREDEFINED_STAGES[0]) => {
    if (!template) return;

    const newOrder = stages.length + 1;

    try {
      const { data, error } = await supabase
        .from('workflow_stages')
        .insert({
          template_id: template.id,
          stage_name: predefinedStage.name,
          stage_order: newOrder,
          actor_type: predefinedStage.actor,
          stage_type: predefinedStage.type,
          sla_hours: 24,
          is_rejectable: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Stage added successfully');
      setStages(prev => [...prev, data as WorkflowStage]);
    } catch (error) {
      console.error('Error adding stage:', error);
      toast.error('Failed to add stage');
    }
  };

  const handleUpdateStage = async (stageId: string, updates: Partial<WorkflowStage>) => {
    try {
      const { error } = await supabase
        .from('workflow_stages')
        .update(updates)
        .eq('id', stageId);

      if (error) throw error;

      setStages(prev => prev.map(s => s.id === stageId ? { ...s, ...updates } : s));
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error('Failed to update stage');
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      const { error } = await supabase
        .from('workflow_stages')
        .delete()
        .eq('id', stageId);

      if (error) throw error;

      toast.success('Stage deleted');
      setStages(prev => prev.filter(s => s.id !== stageId));
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error('Failed to delete stage');
    }
  };

  const handleSaveWorkflow = async () => {
    toast.success('Workflow configuration saved');
  };

  const handleOpenConditionModal = (stage: WorkflowStage) => {
    setSelectedStageForCondition(stage);
    setConditionModalOpen(true);
  };

  const filteredPredefinedStages = PREDEFINED_STAGES.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Back to Templates
          </Button>
          <div className="border-l border-border h-6" />
          <div>
            <h2 className="font-semibold text-foreground">{template.template_name}</h2>
            <p className="text-sm text-muted-foreground">
              {template.product_name} • {template.event_name}
            </p>
          </div>
        </div>
        <Button onClick={handleSaveWorkflow}>
          <Save className="w-4 h-4 mr-2" />
          Save Workflow Configuration
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Available Stages */}
        <Card className="w-80 flex-shrink-0 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Available Stages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-2">
            {filteredPredefinedStages.map((stage, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{stage.name}</p>
                  <p className="text-xs text-muted-foreground">{stage.actor}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleAddStage(stage)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Panel - Workflow Canvas */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="text-sm text-muted-foreground">
            Drag stages to reorder • Click configure to edit stage details
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : stages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
              Add stages from the left panel to build your workflow
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <Card key={stage.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="cursor-grab mt-2">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-muted-foreground">
                                Stage {index + 1}
                              </span>
                              <Input
                                value={stage.stage_name}
                                onChange={(e) => handleUpdateStage(stage.id, { stage_name: e.target.value })}
                                className="w-64"
                              />
                              <Badge className={ACTOR_COLORS[stage.actor_type] || ACTOR_COLORS.Maker}>
                                {stage.actor_type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenConditionModal(stage)}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onStageSelect(stage)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteStage(stage.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Actor Type</Label>
                              <Select
                                value={stage.actor_type}
                                onValueChange={(val) => handleUpdateStage(stage.id, { actor_type: val })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ACTOR_TYPES.map(actor => (
                                    <SelectItem key={actor} value={actor}>{actor}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs">SLA Hours</Label>
                              <Input
                                type="number"
                                value={stage.sla_hours}
                                onChange={(e) => handleUpdateStage(stage.id, { sla_hours: parseInt(e.target.value) || 24 })}
                                className="h-8"
                              />
                            </div>

                            <div className="flex items-center gap-2 pt-5">
                              <Switch
                                checked={stage.is_rejectable}
                                onCheckedChange={(checked) => handleUpdateStage(stage.id, { is_rejectable: checked })}
                              />
                              <Label className="text-xs">Rejectable</Label>
                            </div>

                            {stage.is_rejectable && (
                              <div className="space-y-1">
                                <Label className="text-xs">Reject To</Label>
                                <Select
                                  value={stage.reject_to_stage_id || ''}
                                  onValueChange={(val) => handleUpdateStage(stage.id, { reject_to_stage_id: val || null })}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select stage" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {stages.filter(s => s.id !== stage.id && s.stage_order < stage.stage_order).map(s => (
                                      <SelectItem key={s.id} value={s.id}>{s.stage_name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stage Condition Modal */}
      <StageConditionModal
        open={conditionModalOpen}
        onOpenChange={setConditionModalOpen}
        stage={selectedStageForCondition}
        templateId={template.id}
      />
    </div>
  );
}
