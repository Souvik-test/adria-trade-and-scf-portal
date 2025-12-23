import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import DynamicTransactionForm from '@/components/dynamic-form/DynamicTransactionForm';
import { Loader2 } from 'lucide-react';
import { findWorkflowTemplate, getTemplateStages } from '@/services/workflowTemplateService';
import { WorkflowStageRuntime, WorkflowTemplateRuntime } from '@/types/dynamicForm';

// Lazy load static form components
const ImportLCForm = lazy(() => import('./import-lc/ImportLCForm'));

interface Transaction {
  id: string;
  transaction_ref: string;
  product_type: string;
  process_type?: string;
  status: string;
  customer_name: string | null;
  amount: number | null;
  currency: string;
  created_date: string;
  created_by: string;
  initiating_channel: string;
  bank_ref: string | null;
  customer_ref: string | null;
  party_form: string | null;
  operations: string | null;
  business_application: string | null;
  form_data?: any;
}

interface TransactionWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onTransactionUpdated?: () => void;
}

// Map product_type to product code
const getProductCode = (productType: string): string => {
  const mapping: Record<string, string> = {
    'Import LC': 'ILC',
    'Export LC': 'ELC',
    'Bank Guarantee': 'IBG',
    'Documentary Collection': 'ODC',
    'BG': 'OBG',
  };
  return mapping[productType] || productType;
};

// Map process_type to event code
const getEventCode = (processType: string | undefined): string => {
  const mapping: Record<string, string> = {
    'Issuance': 'ISS',
    'Create': 'ISS',
    'Amendment': 'AMD',
    'Cancellation': 'CAN',
    'LC Transfer': 'TRF',
    'Assignment Request': 'ASG',
  };
  return mapping[processType || 'Issuance'] || 'ISS';
};

// Determine trigger type based on CURRENT business application (where user is logged in)
const getTriggerTypeFromContext = (initiatingChannel: string, status: string): string => {
  const currentBusinessApp = localStorage.getItem('businessCentre') || 'Adria TSCF Client';
  const normalizedApp = currentBusinessApp.toLowerCase();
  
  if (normalizedApp.includes('orchestrator') || normalizedApp.includes('bank')) {
    return 'Manual';
  }
  
  return 'ClientPortal';
};

// Map transaction status to the stage that was just completed
const getCompletedStageName = (status: string): string | null => {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'sent to bank') return 'Authorization';
  if (normalizedStatus === 'issued') return '__ALL_COMPLETE__';
  if (normalizedStatus === 'rejected' || normalizedStatus === 'draft') return null;
  
  const completedWithChannelMatch = status.match(/^(.+) Completed-(.+)$/i);
  if (completedWithChannelMatch) {
    return completedWithChannelMatch[1];
  }
  
  if (normalizedStatus.endsWith(' completed')) {
    return status.slice(0, -' Completed'.length);
  }
  
  const legacyMapping: Record<string, string> = {
    'submitted': 'Data Entry',
    'bank processing': 'Data Entry',
    'limit checked': 'Limit Check',
    'checker reviewed': 'Checker Review',
    'approved': 'Final Approval',
  };
  
  return legacyMapping[normalizedStatus] || null;
};

// Extended result type to include stage info and ui_render_mode
interface TargetStageResult {
  stageName: string | null;
  stage: WorkflowStageRuntime | null;
  template: WorkflowTemplateRuntime | null;
  uiRenderMode: 'static' | 'dynamic';
}

// Fetch the workflow template and determine the next stage based on current status
// Returns the next pending stage regardless of user access, so we can show informative messages
const getTargetStageFromWorkflow = async (
  status: string, 
  accessibleActorTypes: string[],
  productCode: string,
  eventCode: string,
  triggerType: string
): Promise<TargetStageResult> => {
  const defaultResult: TargetStageResult = { stageName: null, stage: null, template: null, uiRenderMode: 'static' };
  const normalizedStatus = status.toLowerCase();
  
  const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
  if (!template) {
    console.log('No workflow template found for:', productCode, eventCode, triggerType);
    return defaultResult;
  }
  
  const stages = await getTemplateStages(template.id);
  console.log('Workflow template stages:', stages.map(s => ({ name: s.stage_name, actor_type: s.actor_type, stage_order: s.stage_order, ui_render_mode: s.ui_render_mode })));
  console.log('User accessible actor types:', accessibleActorTypes);
  
  const createResult = (stage: WorkflowStageRuntime | null, hasAccess: boolean): TargetStageResult => ({
    stageName: hasAccess ? stage?.stage_name || null : null, // Only set stageName if user has access
    stage, // Always include stage for display purposes
    template,
    uiRenderMode: stage?.ui_render_mode || 'static'
  });
  
  const hasAccessToStage = (stage: WorkflowStageRuntime): boolean => {
    return accessibleActorTypes.includes(stage.actor_type) || accessibleActorTypes.includes('__ALL__');
  };
  
  // Find stage by matching function and check access
  const findStageAndCheckAccess = (matchFn: (stageName: string) => boolean): { stage: WorkflowStageRuntime | null; hasAccess: boolean } => {
    const stage = stages.find(s => matchFn(s.stage_name.toLowerCase())) || null;
    return { stage, hasAccess: stage ? hasAccessToStage(stage) : false };
  };
  
  // Find first stage based on stage_order and check access
  const findFirstStageByOrder = (): { stage: WorkflowStageRuntime | null; hasAccess: boolean } => {
    const stage = stages.length > 0 ? stages[0] : null; // stages are already ordered by stage_order
    return { stage, hasAccess: stage ? hasAccessToStage(stage) : false };
  };
  
  if (normalizedStatus === 'rejected') {
    const result = findStageAndCheckAccess(name => name.includes('data entry'));
    console.log('Rejected status - data entry stage:', result.stage?.stage_name, 'hasAccess:', result.hasAccess);
    return createResult(result.stage, result.hasAccess);
  }
  
  if (normalizedStatus === 'draft') {
    const result = findStageAndCheckAccess(name => name.includes('data entry'));
    console.log('Draft status - data entry stage:', result.stage?.stage_name, 'hasAccess:', result.hasAccess);
    return createResult(result.stage, result.hasAccess);
  }
  
  if (normalizedStatus === 'sent to bank') {
    console.log('Cross-workflow handoff: Sent to Bank - looking for first stage by order');
    const result = findFirstStageByOrder();
    console.log('First stage by order:', result.stage?.stage_name, 'hasAccess:', result.hasAccess);
    return createResult(result.stage, result.hasAccess);
  }
  
  const completedStageName = getCompletedStageName(status);
  
  if (!completedStageName) {
    console.log('Unknown status, finding first stage by order');
    const result = findFirstStageByOrder();
    return createResult(result.stage, result.hasAccess);
  }
  
  if (completedStageName === '__ALL_COMPLETE__') {
    return defaultResult;
  }
  
  console.log('Looking for completed stage:', completedStageName);
  
  // Find completed stage by name to get its stage_order
  const completedStage = stages.find(
    s => s.stage_name.toLowerCase() === completedStageName.toLowerCase()
  );
  
  if (!completedStage) {
    console.log('Completed stage not found in template, checking for Data Entry');
    const dataEntryStage = stages.find(s => s.stage_name.toLowerCase().includes('data entry'));
    if (dataEntryStage) {
      // Find next stage by stage_order
      const nextStage = stages.find(s => s.stage_order === dataEntryStage.stage_order + 1);
      if (nextStage) {
        const hasAccess = hasAccessToStage(nextStage);
        return createResult(nextStage, hasAccess);
      }
    }
    return defaultResult;
  }
  
  // Find next stage by stage_order (completed stage order + 1)
  const nextStage = stages.find(s => s.stage_order === completedStage.stage_order + 1);
  
  if (nextStage) {
    const hasAccess = hasAccessToStage(nextStage);
    console.log('Next stage from template:', nextStage.stage_name, 'actor_type:', nextStage.actor_type, 'stage_order:', nextStage.stage_order, 'hasAccess:', hasAccess);
    return createResult(nextStage, hasAccess);
  }
  
  // No next stage - all stages complete
  return defaultResult;
};

const TransactionWorkflowModal: React.FC<TransactionWorkflowModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated,
}) => {
  const { isSuperUser, getAccessibleStages, loading: permissionsLoading } = useUserPermissions();
  const [targetStageResult, setTargetStageResult] = useState<TargetStageResult>({ stageName: null, stage: null, template: null, uiRenderMode: 'static' });
  const [canProcess, setCanProcess] = useState(false);
  const [loadingStage, setLoadingStage] = useState(true);

  const productCode = getProductCode(transaction.product_type);
  const eventCode = getEventCode(transaction.process_type);

  useEffect(() => {
    const determineTargetStage = async () => {
      if (!permissionsLoading && isOpen) {
        setLoadingStage(true);
        
        const accessibleActorTypes = isSuperUser() 
          ? ['__ALL__']
          : getAccessibleStages(productCode, eventCode);
        
        console.log('Accessible actor types for user:', accessibleActorTypes);
        console.log('Transaction status:', transaction.status);
        console.log('Initiating channel:', transaction.initiating_channel);
        
        const triggerType = getTriggerTypeFromContext(transaction.initiating_channel, transaction.status);
        console.log('Trigger type:', triggerType);
        
        const result = await getTargetStageFromWorkflow(
          transaction.status,
          accessibleActorTypes,
          productCode,
          eventCode,
          triggerType
        );
        
        console.log('Target stage result:', result);
        
        setTargetStageResult(result);
        setCanProcess(!!result.stageName);
        setLoadingStage(false);
      }
    };
    
    determineTargetStage();
  }, [permissionsLoading, isOpen, transaction.status, transaction.initiating_channel, productCode, eventCode, isSuperUser, getAccessibleStages]);

  const handleClose = () => {
    if (onTransactionUpdated) {
      onTransactionUpdated();
    }
    onClose();
  };

  const initialFormData = React.useMemo(() => {
    if (transaction.form_data) {
      try {
        return typeof transaction.form_data === 'string' 
          ? JSON.parse(transaction.form_data) 
          : transaction.form_data;
      } catch {
        return {};
      }
    }
    return {};
  }, [transaction.form_data]);

  if (permissionsLoading || loadingStage) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Loading permissions...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!canProcess || !targetStageResult.stageName) {
    // Determine the actual pending stage for display
    const pendingActorType = targetStageResult.stage?.actor_type;
    
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">No Action Required</h3>
            <p className="text-muted-foreground">
              {pendingActorType 
                ? `This transaction is pending the "${pendingActorType}" stage. You don't have permission to process this stage.`
                : 'You don\'t have permission to process this transaction at its current stage, or the transaction has already been fully processed.'
              }
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Current Status: <span className="font-medium">{transaction.status}</span>
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const triggerType = getTriggerTypeFromContext(transaction.initiating_channel, transaction.status);

  // Check ui_render_mode to determine which form to render
  const useStaticMode = targetStageResult.uiRenderMode === 'static';

  // Render static form based on product code when ui_render_mode is 'static'
  const renderStaticForm = () => {
    switch (productCode) {
      case 'ILC':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }>
            <ImportLCForm
              onBack={handleClose}
              onClose={handleClose}
            />
          </Suspense>
        );
      // Add more product-specific static forms here as needed
      default:
        // Fallback to DynamicTransactionForm if no static form exists
        return (
          <DynamicTransactionForm
            productCode={productCode}
            eventCode={eventCode}
            triggerType={triggerType}
            businessApp={transaction.business_application || localStorage.getItem('businessCentre') || undefined}
            showMT700Sidebar={productCode === 'ILC' || productCode === 'ELC'}
            onClose={handleClose}
            transactionRef={transaction.transaction_ref}
            initialFormData={initialFormData}
            initialStage={targetStageResult.stageName}
          />
        );
    }
  };

  // For static mode, render in full screen
  if (useStaticMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-hidden">
        {renderStaticForm()}
      </div>
    );
  }

  // For dynamic mode, render DynamicTransactionForm in dialog
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <DynamicTransactionForm
          productCode={productCode}
          eventCode={eventCode}
          triggerType={triggerType}
          businessApp={transaction.business_application || localStorage.getItem('businessCentre') || undefined}
          showMT700Sidebar={productCode === 'ILC' || productCode === 'ELC'}
          onClose={handleClose}
          transactionRef={transaction.transaction_ref}
          initialFormData={initialFormData}
          initialStage={targetStageResult.stageName}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionWorkflowModal;
