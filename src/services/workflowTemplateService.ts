import { supabase } from '@/integrations/supabase/client';
import { 
  WorkflowTemplateRuntime, 
  WorkflowStageRuntime, 
  WorkflowStageFieldRuntime 
} from '@/types/dynamicForm';

// Cache for workflow templates
let templateCache: Map<string, WorkflowTemplateRuntime | null> = new Map();

/**
 * Find a matching workflow template for a product-event-trigger combination
 */
export const findWorkflowTemplate = async (
  productCode: string,
  eventCode: string,
  triggerType: string
): Promise<WorkflowTemplateRuntime | null> => {
  const cacheKey = `${productCode}-${eventCode}-${triggerType}`;
  
  if (templateCache.has(cacheKey)) {
    return templateCache.get(cacheKey) || null;
  }

  try {
    const { data, error } = await supabase
      .from('workflow_templates')
      .select('*')
      .eq('product_code', productCode)
      .eq('event_code', eventCode)
      .contains('trigger_types', [triggerType])
      .eq('status', 'Active')
      .maybeSingle();

    if (error) {
      console.error('Error finding workflow template:', error);
      return null;
    }

    const template = data as WorkflowTemplateRuntime | null;
    templateCache.set(cacheKey, template);
    return template;
  } catch (err) {
    console.error('Exception finding workflow template:', err);
    return null;
  }
};

/**
 * Get all stages for a workflow template, ordered by stage_order
 */
export const getTemplateStages = async (
  templateId: string
): Promise<WorkflowStageRuntime[]> => {
  try {
    const { data, error } = await supabase
      .from('workflow_stages')
      .select('*')
      .eq('template_id', templateId)
      .order('stage_order', { ascending: true });

    if (error) {
      console.error('Error fetching workflow stages:', error);
      return [];
    }

    return (data || []) as WorkflowStageRuntime[];
  } catch (err) {
    console.error('Exception fetching workflow stages:', err);
    return [];
  }
};

/**
 * Get all field mappings for a specific stage
 */
export const getStageFields = async (
  stageId: string
): Promise<WorkflowStageFieldRuntime[]> => {
  try {
    const { data, error } = await supabase
      .from('workflow_stage_fields')
      .select('*')
      .eq('stage_id', stageId)
      .order('field_order', { ascending: true });

    if (error) {
      console.error('Error fetching stage fields:', error);
      return [];
    }

    return (data || []) as WorkflowStageFieldRuntime[];
  } catch (err) {
    console.error('Exception fetching stage fields:', err);
    return [];
  }
};

/**
 * Get complete workflow configuration with all stages and fields
 */
export const getCompleteWorkflowConfig = async (
  productCode: string,
  eventCode: string,
  triggerType: string
): Promise<{
  template: WorkflowTemplateRuntime | null;
  stages: WorkflowStageRuntime[];
  stageFields: Map<string, WorkflowStageFieldRuntime[]>;
} | null> => {
  const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
  
  if (!template) {
    return null;
  }

  const stages = await getTemplateStages(template.id);
  const stageFields = new Map<string, WorkflowStageFieldRuntime[]>();

  // Fetch fields for all stages in parallel
  await Promise.all(
    stages.map(async (stage) => {
      const fields = await getStageFields(stage.id);
      stageFields.set(stage.id, fields);
    })
  );

  return { template, stages, stageFields };
};

/**
 * Clear the template cache
 */
export const clearTemplateCache = () => {
  templateCache.clear();
};

/**
 * Get pane names from all stage fields for a template, preserving stage order
 * and allowing the same pane to appear in multiple stages
 */
export const getTemplatePaneNames = async (
  templateId: string
): Promise<string[]> => {
  const stages = await getTemplateStages(templateId); // Already sorted by stage_order
  const paneNames: string[] = [];

  // Process stages SEQUENTIALLY to preserve stage order
  for (const stage of stages) {
    const fields = await getStageFields(stage.id);
    
    // Get unique panes for THIS stage only (avoid duplicates within same stage)
    const stagePanes = new Set<string>();
    fields.forEach(field => {
      if (field.pane) stagePanes.add(field.pane);
    });
    
    // Add all panes from this stage (allows same pane in different stages)
    stagePanes.forEach(pane => paneNames.push(pane));
  }

  return paneNames; // e.g., ["LC Key Info", "Limit Check", "LC Key Info"]
};

export default {
  findWorkflowTemplate,
  getTemplateStages,
  getStageFields,
  getCompleteWorkflowConfig,
  clearTemplateCache,
  getTemplatePaneNames,
};
