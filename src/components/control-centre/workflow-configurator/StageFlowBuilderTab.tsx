import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Search, GripVertical, Settings, FileText, Trash2, Save, GitBranch, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WorkflowTemplate, WorkflowStage } from '../NextGenWorkflowConfigurator';
import { StageConditionModal } from './StageConditionModal';
import { MultiSelect } from '@/components/ui/multi-select';
import { useStaticUIPanes, PaneOption } from '@/hooks/useStaticUIPanes';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StageFlowBuilderTabProps {
  template: WorkflowTemplate | null;
  onBack: () => void;
  onStageSelect: (stage: WorkflowStage) => void;
  viewOnly?: boolean;
  onEnableEdit?: () => void;
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

// Sortable Stage Card Component
interface SortableStageCardProps {
  stage: WorkflowStage;
  index: number;
  stages: WorkflowStage[];
  availablePanes: PaneOption[];
  onUpdateStage: (stageId: string, updates: Partial<WorkflowStage>) => void;
  onDeleteStage: (stageId: string) => void;
  onOpenConditionModal: (stage: WorkflowStage) => void;
  onStageSelect: (stage: WorkflowStage) => void;
  viewOnly?: boolean;
}

function SortableStageCard({
  stage,
  index,
  stages,
  availablePanes,
  onUpdateStage,
  onDeleteStage,
  onOpenConditionModal,
  onStageSelect,
  viewOnly = false,
}: SortableStageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {!viewOnly && (
            <div
              className="cursor-grab mt-2 active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Stage {index + 1}
                </span>
                <Input
                  value={stage.stage_name}
                  onChange={(e) => onUpdateStage(stage.id, { stage_name: e.target.value })}
                  className="w-64"
                  disabled={viewOnly}
                />
                <Badge className={ACTOR_COLORS[stage.actor_type] || ACTOR_COLORS.Maker}>
                  {stage.actor_type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenConditionModal(stage)}
                  title={viewOnly ? "View Conditions" : "Configure Conditions"}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                {/* Only show Configure Fields button when ui_render_mode is 'dynamic' */}
                {(stage.ui_render_mode === 'dynamic') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onStageSelect(stage)}
                    title="Configure Fields"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                )}
                {!viewOnly && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteStage(stage.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Actor Type</Label>
                <Select
                  value={stage.actor_type}
                  onValueChange={(val) => onUpdateStage(stage.id, { actor_type: val })}
                  disabled={viewOnly}
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
                <Label className="text-xs">UI Render Mode</Label>
                <Select
                  value={stage.ui_render_mode || 'static'}
                  onValueChange={(val) => onUpdateStage(stage.id, { ui_render_mode: val as 'static' | 'dynamic' })}
                  disabled={viewOnly}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Use Static Screen</SelectItem>
                    <SelectItem value="dynamic">Apply Dynamic UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">SLA Hours</Label>
                <Input
                  type="number"
                  value={stage.sla_hours}
                  onChange={(e) => onUpdateStage(stage.id, { sla_hours: parseInt(e.target.value) || 24 })}
                  className="h-8"
                  disabled={viewOnly}
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <Switch
                  checked={stage.is_rejectable}
                  onCheckedChange={(checked) => onUpdateStage(stage.id, { is_rejectable: checked })}
                  disabled={viewOnly}
                />
                <Label className="text-xs">Rejectable</Label>
              </div>

              {stage.is_rejectable && (
                <div className="space-y-1">
                  <Label className="text-xs">Reject To</Label>
                  <Select
                    value={stage.reject_to_stage_id || ''}
                    onValueChange={(val) => onUpdateStage(stage.id, { reject_to_stage_id: val || null })}
                    disabled={viewOnly}
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

            {/* Static Panes Selector - Only shown when UI Render Mode is 'static' */}
            {(stage.ui_render_mode === 'static' || !stage.ui_render_mode) && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Static Panes</Label>
                </div>
                <MultiSelect
                  options={availablePanes}
                  selected={stage.static_panes || []}
                  onChange={(panes) => onUpdateStage(stage.id, { static_panes: panes })}
                  placeholder="Select panes to display..."
                  disabled={viewOnly}
                />
                {availablePanes.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No panes configured for this product. Add panes in the Static UI Registry.
                  </p>
                )}
                {(stage.static_panes?.length || 0) === 0 && availablePanes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    No panes selected. Select panes to display for this stage.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StageFlowBuilderTab({ template, onBack, onStageSelect, viewOnly = false, onEnableEdit }: StageFlowBuilderTabProps) {
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedStageForCondition, setSelectedStageForCondition] = useState<WorkflowStage | null>(null);
  const [flowchartModalOpen, setFlowchartModalOpen] = useState(false);

  // Fetch product-specific panes from database
  const { panes: availablePanes, loading: panesLoading } = useStaticUIPanes(
    template?.product_code || '',
    template?.event_code
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stages.findIndex(s => s.id === active.id);
      const newIndex = stages.findIndex(s => s.id === over.id);
      
      const newStages = arrayMove(stages, oldIndex, newIndex);
      setStages(newStages);

      // Update stage_order in database
      try {
        for (let i = 0; i < newStages.length; i++) {
          await supabase
            .from('workflow_stages')
            .update({ stage_order: i + 1 })
            .eq('id', newStages[i].id);
        }
        toast.success('Stage order updated');
      } catch (error) {
        console.error('Error updating stage order:', error);
        toast.error('Failed to update stage order');
        fetchStages(); // Revert to original order
      }
    }
  };

  const handleSaveWorkflow = async () => {
    toast.success('Workflow configuration saved');
    onBack(); // Navigate back to templates dashboard
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
        <div className="flex items-center gap-2">
          {viewOnly && onEnableEdit && (
            <Button variant="outline" onClick={onEnableEdit}>
              <Settings className="w-4 h-4 mr-2" />
              Enable Edit Mode
            </Button>
          )}
          <Button variant="outline" onClick={() => setFlowchartModalOpen(true)}>
            <GitBranch className="w-4 h-4 mr-2" />
            View Flowchart
          </Button>
          {!viewOnly && (
            <Button onClick={handleSaveWorkflow}>
              <Save className="w-4 h-4 mr-2" />
              Submit Template
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Available Stages (hidden in view-only mode) */}
        {!viewOnly && (
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
        )}

        {/* Right Panel - Workflow Canvas */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="text-sm text-muted-foreground">
            {viewOnly ? 'View-only mode - Click "Enable Edit Mode" to make changes' : 'Drag stages to reorder • Click configure to edit stage details'}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={stages.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {stages.map((stage, index) => (
                      <SortableStageCard
                        key={stage.id}
                        stage={stage}
                        index={index}
                        stages={stages}
                        availablePanes={availablePanes}
                        onUpdateStage={handleUpdateStage}
                        onDeleteStage={handleDeleteStage}
                        onOpenConditionModal={handleOpenConditionModal}
                        onStageSelect={onStageSelect}
                        viewOnly={viewOnly}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
        viewOnly={viewOnly}
      />

      {/* Flowchart Modal */}
      <Dialog open={flowchartModalOpen} onOpenChange={setFlowchartModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Workflow Flowchart
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {template.template_name} - {template.product_name} • {template.event_name}
            </p>
          </DialogHeader>

          <div className="py-6">
            {stages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No stages configured yet
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {/* Start Node */}
                <div className="w-24 h-10 rounded-full bg-green-100 dark:bg-green-900 border-2 border-green-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Start</span>
                </div>
                <ArrowDown className="w-5 h-5 text-muted-foreground" />

                {stages.map((stage, index) => {
                  const rejectToStage = stage.is_rejectable && stage.reject_to_stage_id 
                    ? stages.find(s => s.id === stage.reject_to_stage_id)
                    : null;
                  const rejectToIndex = rejectToStage ? stages.findIndex(s => s.id === rejectToStage.id) : -1;
                  
                  return (
                    <React.Fragment key={stage.id}>
                      <div className="relative w-72">
                        <div className={`p-4 rounded-lg border-2 ${ACTOR_COLORS[stage.actor_type] || 'bg-card border-border'}`}>
                          <div className="text-center">
                            <p className="font-medium text-sm">{stage.stage_name}</p>
                            <p className="text-xs opacity-75">{stage.actor_type}</p>
                            <p className="text-xs opacity-50">SLA: {stage.sla_hours}h</p>
                          </div>
                        </div>
                        {stage.is_rejectable && rejectToStage && (
                          <div className="absolute -right-32 top-1/2 flex items-center gap-1 text-xs text-destructive">
                            <span>Reject →</span>
                            <span className="font-medium">{rejectToStage.stage_name}</span>
                          </div>
                        )}
                      </div>
                      {index < stages.length - 1 && (
                        <ArrowDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  );
                })}

                <ArrowDown className="w-5 h-5 text-muted-foreground" />
                {/* End Node */}
                <div className="w-24 h-10 rounded-full bg-red-100 dark:bg-red-900 border-2 border-red-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">End</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
