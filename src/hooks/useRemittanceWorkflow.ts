import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WorkflowStage {
  id: string;
  template_id: string;
  stage_name: string;
  stage_order: number;
  actor_type: string;
  sla_hours: number;
  is_rejectable: boolean;
  reject_to_stage_id: string | null;
  stage_type: string;
  ui_render_mode: 'static' | 'dynamic';
}

interface WorkflowTemplate {
  id: string;
  template_name: string;
  product_code: string;
  event_code: string;
  trigger_types: string[];
  status: string;
}

export interface RemittanceWorkflowState {
  hasWorkflowTemplate: boolean;
  template: WorkflowTemplate | null;
  currentStage: WorkflowStage | null;
  allStages: WorkflowStage[];
  isEditable: boolean;
  isApprovalStage: boolean;
  loading: boolean;
  error: string | null;
  // Methods for stage progression
  completeCurrentStage: () => Promise<string | null>;
  approveTransaction: () => Promise<boolean>;
  rejectTransaction: (reason?: string) => Promise<boolean>;
}

interface UseRemittanceWorkflowOptions {
  transactionRef?: string;
  transactionStatus?: string;
  triggerType?: 'Manual' | 'ClientPortal';
}

/**
 * Hook to manage workflow template integration for Remittance screens
 * Determines current stage, UI render mode, and editability based on workflow configuration
 */
export function useRemittanceWorkflow(options: UseRemittanceWorkflowOptions = {}): RemittanceWorkflowState {
  const { transactionRef, transactionStatus, triggerType = 'Manual' } = options;
  
  const [template, setTemplate] = useState<WorkflowTemplate | null>(null);
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workflow template and stages for Remittance product
  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query for REM product with PIO (Process Inward/Outward) event and matching trigger type
        const { data: templateData, error: templateError } = await supabase
          .from('workflow_templates')
          .select('*')
          .eq('product_code', 'REM')
          .eq('event_code', 'PIO')
          .contains('trigger_types', [triggerType])
          .eq('status', 'Active')
          .maybeSingle();

        if (templateError) {
          console.error('Error fetching workflow template:', templateError);
          setError('Failed to fetch workflow template');
          return;
        }

        if (!templateData) {
          // No workflow template configured - this is valid, screens will work without workflow
          console.log('No workflow template found for REM/PIO/', triggerType);
          setTemplate(null);
          setStages([]);
          return;
        }

        setTemplate(templateData as WorkflowTemplate);

        // Fetch stages for this template
        const { data: stagesData, error: stagesError } = await supabase
          .from('workflow_stages')
          .select('*')
          .eq('template_id', templateData.id)
          .order('stage_order', { ascending: true });

        if (stagesError) {
          console.error('Error fetching workflow stages:', stagesError);
          setError('Failed to fetch workflow stages');
          return;
        }

        // Type assertion with default ui_render_mode for backward compatibility
        const typedStages = (stagesData || []).map(stage => ({
          ...stage,
          ui_render_mode: (stage.ui_render_mode || 'static') as 'static' | 'dynamic'
        })) as WorkflowStage[];

        setStages(typedStages);
      } catch (err) {
        console.error('Error in fetchWorkflowData:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, [triggerType]);

  // Determine current stage based on transaction status
  const currentStage = useMemo((): WorkflowStage | null => {
    if (stages.length === 0) return null;

    // If no transaction status or new transaction, start at first stage
    if (!transactionStatus) {
      return stages[0];
    }

    // Parse status to find matching stage
    // Status format: "Stage Name Completed-Channel" or "Stage Name Pending-Channel"
    const statusLower = transactionStatus.toLowerCase();
    
    // Check if any stage name is "completed" in the status
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const stageName = stage.stage_name.toLowerCase();
      
      // If this stage is marked as completed, move to next stage
      if (statusLower.includes(`${stageName} completed`)) {
        // Return next stage if exists, otherwise current (final) stage
        return stages[i + 1] || stage;
      }
      
      // If this stage is pending or in progress
      if (statusLower.includes(stageName) && !statusLower.includes('completed')) {
        return stage;
      }
    }

    // Default to first stage if no match
    return stages[0];
  }, [stages, transactionStatus]);

  // Determine if current stage is editable (Maker stages are editable, Checker stages are readonly for review)
  const isEditable = useMemo(() => {
    if (!currentStage) return true; // Default to editable if no workflow

    // Maker and Input stages are editable
    const editableActors = ['Maker'];
    const editableTypes = ['Input', 'Preinput'];

    return editableActors.includes(currentStage.actor_type) && editableTypes.includes(currentStage.stage_type);
  }, [currentStage]);

  // Check if current stage is an approval stage (Checker)
  const isApprovalStage = useMemo(() => {
    if (!currentStage) return false;

    const approvalActors = ['Checker', 'Authorization'];
    return approvalActors.includes(currentStage.actor_type);
  }, [currentStage]);

  // Helper to determine channel from business application
  const getChannelFromBusinessApp = (): string => {
    const businessApp = localStorage.getItem('businessCentre') || 'Adria TSCF Client';
    const normalizedApp = businessApp.toLowerCase().trim();
    
    if (normalizedApp.includes('orchestrator') || normalizedApp.includes('tscf bank')) {
      return 'Bank';
    }
    
    return 'Portal';
  };

  // Stage progression methods
  const completeCurrentStage = async (): Promise<string | null> => {
    if (!currentStage || !template) return null;

    // Find next stage
    const currentIndex = stages.findIndex(s => s.id === currentStage.id);
    const nextStage = stages[currentIndex + 1];

    // Determine channel dynamically based on business application
    const channel = getChannelFromBusinessApp();

    // Build new status
    const newStatus = nextStage 
      ? `${currentStage.stage_name} Completed-${channel}`
      : `Approved-${channel}`;

    return newStatus;
  };

  const approveTransaction = async (): Promise<boolean> => {
    // Implementation would update transaction status to approved
    // This is a placeholder - actual implementation depends on transaction storage
    console.log('Approving transaction');
    return true;
  };

  const rejectTransaction = async (reason?: string): Promise<boolean> => {
    // Implementation would update transaction status to rejected
    // This is a placeholder - actual implementation depends on transaction storage
    console.log('Rejecting transaction:', reason);
    return true;
  };

  return {
    hasWorkflowTemplate: !!template,
    template,
    currentStage,
    allStages: stages,
    isEditable,
    isApprovalStage,
    loading,
    error,
    completeCurrentStage,
    approveTransaction,
    rejectTransaction,
  };
}
