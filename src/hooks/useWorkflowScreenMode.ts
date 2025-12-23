import { useState, useEffect } from 'react';
import { 
  findWorkflowTemplate, 
  getTemplateStages, 
  clearTemplateCache 
} from '@/services/workflowTemplateService';
import { 
  WorkflowTemplateRuntime, 
  WorkflowStageRuntime 
} from '@/types/dynamicForm';

export interface WorkflowScreenModeResult {
  loading: boolean;
  hasTemplate: boolean;
  template: WorkflowTemplateRuntime | null;
  stages: WorkflowStageRuntime[];
  uiRenderMode: 'static' | 'dynamic' | null;
  currentStage: WorkflowStageRuntime | null;
}

/**
 * Generic hook to determine workflow configuration and UI render mode.
 * Works for any product/event combination.
 * 
 * @param productCode - Product code (e.g., 'ILC', 'REM', 'OBG')
 * @param eventCode - Event code (e.g., 'ISS', 'AMD', 'CAN')
 * @param triggerType - Trigger type (e.g., 'ClientPortal', 'Manual')
 * @param targetStageName - Optional: specific stage to check (for existing transactions)
 */
export const useWorkflowScreenMode = (
  productCode: string,
  eventCode: string,
  triggerType: string,
  targetStageName?: string
): WorkflowScreenModeResult => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Omit<WorkflowScreenModeResult, 'loading'>>({
    hasTemplate: false,
    template: null,
    stages: [],
    uiRenderMode: null,
    currentStage: null,
  });

  useEffect(() => {
    const fetchWorkflowConfig = async () => {
      if (!productCode || !eventCode || !triggerType) {
        setLoading(false);
        return;
      }

      setLoading(true);
      clearTemplateCache();

      try {
        const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
        
        if (!template) {
          setResult({
            hasTemplate: false,
            template: null,
            stages: [],
            uiRenderMode: null,
            currentStage: null,
          });
          setLoading(false);
          return;
        }

        const stages = await getTemplateStages(template.id);
        
        // Determine which stage to check for ui_render_mode
        let stageToCheck: WorkflowStageRuntime | null = null;
        
        if (targetStageName) {
          // Find the specific target stage
          stageToCheck = stages.find(s => s.stage_name === targetStageName) || null;
        } else {
          // Use the first stage (for new transactions)
          stageToCheck = stages[0] || null;
        }

        setResult({
          hasTemplate: true,
          template,
          stages,
          uiRenderMode: stageToCheck?.ui_render_mode || 'static',
          currentStage: stageToCheck,
        });
      } catch (error) {
        console.error('Error fetching workflow configuration:', error);
        setResult({
          hasTemplate: false,
          template: null,
          stages: [],
          uiRenderMode: null,
          currentStage: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowConfig();
  }, [productCode, eventCode, triggerType, targetStageName]);

  return {
    loading,
    ...result,
  };
};

export default useWorkflowScreenMode;
