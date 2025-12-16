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
 * Stage-pane mapping info for navigation
 */
export interface StagePaneInfo {
  paneIndex: number;
  paneName: string;
  stageId: string;
  stageName: string;
  stageOrder: number;
  isFirstPaneOfStage: boolean;
  isLastPaneOfStage: boolean;
  isFinalStage: boolean;
  allowedSections: string[]; // Sections allowed for THIS specific stage-pane combination
}

/**
 * Get pane names from all stage fields for a template, preserving stage order
 * and allowing the same pane to appear in multiple stages.
 * If accessibleStageNames is provided (non-empty), only includes panes from those stages.
 */
export const getTemplatePaneNames = async (
  templateId: string,
  accessibleStageNames?: string[]
): Promise<string[]> => {
  const stages = await getTemplateStages(templateId); // Already sorted by stage_order
  const paneNames: string[] = [];

  // Filter stages if accessibleStageNames is provided and not empty
  const filteredStages = accessibleStageNames && accessibleStageNames.length > 0
    ? stages.filter(stage => 
        accessibleStageNames.includes(stage.stage_name) || 
        accessibleStageNames.includes('__ALL__')
      )
    : stages;

  // Process stages SEQUENTIALLY to preserve stage order
  for (const stage of filteredStages) {
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

/**
 * Get detailed stage-pane mapping for navigation and dynamic button logic.
 * If accessibleStageNames is provided (non-empty), only includes stages the user has access to.
 */
export const getStagePaneMapping = async (
  templateId: string,
  accessibleStageNames?: string[]
): Promise<StagePaneInfo[]> => {
  const stages = await getTemplateStages(templateId); // Already sorted by stage_order
  
  // Filter stages if accessibleStageNames is provided and not empty
  const filteredStages = accessibleStageNames && accessibleStageNames.length > 0
    ? stages.filter(stage => 
        accessibleStageNames.includes(stage.stage_name) || 
        accessibleStageNames.includes('__ALL__')
      )
    : stages;

  const mapping: StagePaneInfo[] = [];
  let paneIndex = 0;
  const totalStages = filteredStages.length;

  // Process stages SEQUENTIALLY to preserve order
  for (let stageIdx = 0; stageIdx < filteredStages.length; stageIdx++) {
    const stage = filteredStages[stageIdx];
    const fields = await getStageFields(stage.id);
    
    // Get stage-specific section mapping for this stage
    const stageSectionMap = await getStageSectionMapping(stage.id);
    
    // Get unique panes for THIS stage only
    const stagePanes: string[] = [];
    const seenPanes = new Set<string>();
    fields.forEach(field => {
      if (field.pane && !seenPanes.has(field.pane)) {
        seenPanes.add(field.pane);
        stagePanes.push(field.pane);
      }
    });
    
    const isFinalStage = stageIdx === totalStages - 1;
    
    // Add each pane with stage info and its allowed sections
    stagePanes.forEach((paneName, paneIdxInStage) => {
      const allowedSections = stageSectionMap.get(paneName) || [];
      mapping.push({
        paneIndex,
        paneName,
        stageId: stage.id,
        stageName: stage.stage_name,
        stageOrder: stage.stage_order,
        isFirstPaneOfStage: paneIdxInStage === 0,
        isLastPaneOfStage: paneIdxInStage === stagePanes.length - 1,
        isFinalStage,
        allowedSections,
      });
      paneIndex++;
    });
  }

  return mapping;
};

/**
 * Get pane-section mapping for a specific stage.
 * Returns a Map of pane names to their allowed section names based on workflow_stage_fields.
 */
export const getStageSectionMapping = async (
  stageId: string
): Promise<Map<string, string[]>> => {
  const fields = await getStageFields(stageId);
  
  // Group sections by pane
  const paneSectionMap = new Map<string, Set<string>>();
  fields.forEach(field => {
    if (field.pane && field.section) {
      if (!paneSectionMap.has(field.pane)) {
        paneSectionMap.set(field.pane, new Set());
      }
      paneSectionMap.get(field.pane)!.add(field.section);
    }
  });
  
  // Convert Sets to Arrays
  const result = new Map<string, string[]>();
  paneSectionMap.forEach((sections, pane) => {
    result.set(pane, Array.from(sections));
  });
  
  return result;
};

/**
 * Get combined pane-section mapping for multiple stages.
 * Used when a user has access to multiple stages - combines all their allowed sections.
 */
export const getMultiStageSectionMapping = async (
  stageIds: string[]
): Promise<Map<string, string[]>> => {
  const combinedMap = new Map<string, Set<string>>();
  
  // Fetch section mappings for all stages in parallel
  const stageMappings = await Promise.all(
    stageIds.map(stageId => getStageSectionMapping(stageId))
  );
  
  // Combine all mappings
  stageMappings.forEach(stageMap => {
    stageMap.forEach((sections, pane) => {
      if (!combinedMap.has(pane)) {
        combinedMap.set(pane, new Set());
      }
      sections.forEach(section => combinedMap.get(pane)!.add(section));
    });
  });
  
  // Convert Sets to Arrays
  const result = new Map<string, string[]>();
  combinedMap.forEach((sections, pane) => {
    result.set(pane, Array.from(sections));
  });
  
  return result;
};

export default {
  findWorkflowTemplate,
  getTemplateStages,
  getStageFields,
  getCompleteWorkflowConfig,
  clearTemplateCache,
  getTemplatePaneNames,
  getStagePaneMapping,
  getStageSectionMapping,
  getMultiStageSectionMapping,
};
