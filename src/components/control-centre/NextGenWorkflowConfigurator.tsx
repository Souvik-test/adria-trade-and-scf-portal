import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkflowTemplatesTab } from './workflow-configurator/WorkflowTemplatesTab';
import { StageFlowBuilderTab } from './workflow-configurator/StageFlowBuilderTab';
import { StageLevelFieldTab } from './workflow-configurator/StageLevelFieldTab';
import { TemplateLevelConditionsTab } from './workflow-configurator/TemplateLevelConditionsTab';

export interface WorkflowTemplate {
  id: string;
  user_id: string;
  template_name: string;
  module_code: string;
  module_name: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
  trigger_types: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStage {
  id: string;
  template_id: string;
  stage_name: string;
  stage_order: number;
  actor_type: string;
  sla_hours: number;
  is_rejectable: boolean;
  reject_to_stage_id: string | null;
  stage_type: string;
}

export interface WorkflowStageField {
  id: string;
  stage_id: string;
  field_id: string;
  pane: string;
  section: string;
  field_name: string;
  ui_label: string;
  ui_display_type: string;
  is_visible: boolean;
  is_editable: boolean;
  is_mandatory: boolean;
  field_order: number;
}

export interface WorkflowCondition {
  id: string;
  template_id: string;
  stage_id: string | null;
  group_name: string;
  group_operator: string;
  condition_order: number;
  field_name: string;
  operator: string;
  compare_type: string;
  compare_value: string | null;
  compare_field: string | null;
}

export function NextGenWorkflowConfigurator() {
  const [activeTab, setActiveTab] = useState('workflow-templates');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('stage-flow-builder');
  };

  const handleStageSelect = (stage: WorkflowStage) => {
    setSelectedStage(stage);
    setActiveTab('stage-level-field');
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setSelectedStage(null);
    setActiveTab('workflow-templates');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">NextGen Workflow Configurator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure workflow templates, stages, fields, and conditions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border px-6">
          <TabsList className="h-12 bg-transparent gap-4">
            <TabsTrigger 
              value="workflow-templates" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4"
            >
              Workflow Templates
            </TabsTrigger>
            <TabsTrigger 
              value="stage-flow-builder" 
              disabled={!selectedTemplate}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4"
            >
              Stage Flow Builder
            </TabsTrigger>
            <TabsTrigger 
              value="stage-level-field" 
              disabled={!selectedStage}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4"
            >
              Stage Level Field
            </TabsTrigger>
            <TabsTrigger 
              value="template-level-conditions" 
              disabled={!selectedTemplate}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4"
            >
              Template Level Conditions
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="workflow-templates" className="h-full m-0">
            <WorkflowTemplatesTab onTemplateSelect={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="stage-flow-builder" className="h-full m-0">
            <StageFlowBuilderTab 
              template={selectedTemplate}
              onBack={handleBackToTemplates}
              onStageSelect={handleStageSelect}
            />
          </TabsContent>

          <TabsContent value="stage-level-field" className="h-full m-0">
            <StageLevelFieldTab 
              stage={selectedStage}
              template={selectedTemplate}
              onBack={() => setActiveTab('stage-flow-builder')}
            />
          </TabsContent>

          <TabsContent value="template-level-conditions" className="h-full m-0">
            <TemplateLevelConditionsTab 
              template={selectedTemplate}
              onBack={() => setActiveTab('stage-flow-builder')}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
