import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import DynamicTransactionForm from '@/components/dynamic-form/DynamicTransactionForm';
import { Loader2 } from 'lucide-react';
import { findWorkflowTemplate, getTemplateStages } from '@/services/workflowTemplateService';
import { matchesAccessibleStage } from '@/utils/stageAliases';

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
// This uses the login context to determine which workflow template to fetch
const getTriggerTypeFromContext = (initiatingChannel: string, status: string): string => {
  // Use CURRENT business application from login context
  const currentBusinessApp = localStorage.getItem('businessCentre') || 'Adria TSCF Client';
  const normalizedApp = currentBusinessApp.toLowerCase();
  
  // If user is logged into Bank application, use Bank (Manual) workflow
  if (normalizedApp.includes('orchestrator') || normalizedApp.includes('bank')) {
    return 'Manual';
  }
  
  // If user is logged into Client Portal, use ClientPortal workflow
  return 'ClientPortal';
};

// Map transaction status to the stage that was just completed
// Supports dynamic "<Stage Name> Completed" format and legacy statuses
const getCompletedStageName = (status: string): string | null => {
  const normalizedStatus = status.toLowerCase();
  
  // Handle special statuses first
  if (normalizedStatus === 'sent to bank') return 'Authorization';
  if (normalizedStatus === 'issued') return '__ALL_COMPLETE__';
  if (normalizedStatus === 'rejected' || normalizedStatus === 'draft') return null;
  
  // Dynamic parsing: "<Stage Name> Completed" → "<Stage Name>"
  if (normalizedStatus.endsWith(' completed')) {
    // Return original case for matching with workflow template
    return status.slice(0, -' Completed'.length);
  }
  
  // Legacy status support (for existing transactions)
  const legacyMapping: Record<string, string> = {
    'submitted': 'Data Entry',
    'bank processing': 'Data Entry',
    'limit checked': 'Limit Check',
    'checker reviewed': 'Checker Review',
    'approved': 'Final Approval',
  };
  
  return legacyMapping[normalizedStatus] || null;
};

// Fetch the workflow template and determine the next stage based on current status
// NOTE: accessibleStages now contains actor_types like 'Maker', 'Checker' - NOT stage names
const getTargetStageFromWorkflow = async (
  status: string, 
  accessibleActorTypes: string[],  // These are actor types, not stage names
  productCode: string,
  eventCode: string,
  triggerType: string
): Promise<string | null> => {
  const normalizedStatus = status.toLowerCase();
  
  // Fetch workflow template first - we need it for all cases to check actor_type
  const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
  if (!template) {
    console.log('No workflow template found for:', productCode, eventCode, triggerType);
    return null;
  }
  
  const stages = await getTemplateStages(template.id);
  console.log('Workflow template stages:', stages.map(s => ({ name: s.stage_name, actor_type: s.actor_type })));
  console.log('User accessible actor types:', accessibleActorTypes);
  
  // Helper function to find first accessible stage matching criteria
  const findAccessibleStage = (matchFn: (stageName: string) => boolean): string | null => {
    const matchingStage = stages.find(s => 
      matchFn(s.stage_name.toLowerCase()) && 
      (accessibleActorTypes.includes(s.actor_type) || accessibleActorTypes.includes('__ALL__'))
    );
    return matchingStage?.stage_name || null;
  };
  
  // Helper to find first stage user has access to (by actor_type)
  const findFirstAccessibleStage = (): string | null => {
    const accessibleStage = stages.find(s => 
      accessibleActorTypes.includes(s.actor_type) || accessibleActorTypes.includes('__ALL__')
    );
    return accessibleStage?.stage_name || null;
  };
  
  // Handle rejected - find Data Entry stage that user has access to via actor_type
  if (normalizedStatus === 'rejected') {
    const stage = findAccessibleStage(name => name.includes('data entry'));
    console.log('Rejected status - found accessible data entry stage:', stage);
    return stage;
  }
  
  // Handle draft - start from Data Entry (if user has actor_type access)
  if (normalizedStatus === 'draft') {
    const stage = findAccessibleStage(name => name.includes('data entry'));
    console.log('Draft status - found accessible data entry stage:', stage);
    return stage;
  }
  
  // Special case: "Sent to Bank" means Portal workflow ended, Bank workflow should START
  // Bank Maker starts from first stage they have actor_type access to
  if (normalizedStatus === 'sent to bank') {
    console.log('Cross-workflow handoff: Sent to Bank - looking for first accessible stage by actor_type');
    const stage = findFirstAccessibleStage();
    console.log('Found first accessible stage for actor types', accessibleActorTypes, ':', stage);
    return stage;
  }
  
  // Get which stage was just completed based on status
  const completedStageName = getCompletedStageName(status);
  
  if (!completedStageName) {
    // Unknown status, try first accessible stage
    console.log('Unknown status, finding first accessible stage');
    return findFirstAccessibleStage();
  }
  
  if (completedStageName === '__ALL_COMPLETE__') {
    return null; // Transaction fully processed
  }
  
  console.log('Looking for completed stage:', completedStageName);
  
  // Find the completed stage index in the workflow template
  const completedIndex = stages.findIndex(
    s => s.stage_name.toLowerCase() === completedStageName.toLowerCase()
  );
  
  if (completedIndex === -1) {
    console.log('Completed stage not found in template, checking for Data Entry');
    // Stage not found in this template - might be cross-workflow
    // Find first stage after Data Entry that user has actor_type access to
    const dataEntryIndex = stages.findIndex(
      s => s.stage_name.toLowerCase().includes('data entry')
    );
    if (dataEntryIndex >= 0 && dataEntryIndex < stages.length - 1) {
      const nextStage = stages[dataEntryIndex + 1];
      // Check if user has access via actor_type
      if (accessibleActorTypes.includes(nextStage.actor_type) || accessibleActorTypes.includes('__ALL__')) {
        return nextStage.stage_name;
      }
    }
    return null;
  }
  
  // Get the NEXT stage after the completed one
  if (completedIndex < stages.length - 1) {
    const nextStage = stages[completedIndex + 1];
    console.log('Next stage from template:', nextStage.stage_name, 'actor_type:', nextStage.actor_type);
    
    // Check if user has access to this next stage via actor_type
    if (accessibleActorTypes.includes(nextStage.actor_type) || accessibleActorTypes.includes('__ALL__')) {
      return nextStage.stage_name;
    }
    console.log('User does not have access to next stage actor_type:', nextStage.actor_type);
  }
  
  return null;
};

const TransactionWorkflowModal: React.FC<TransactionWorkflowModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated,
}) => {
  const { isSuperUser, getAccessibleStages, loading: permissionsLoading } = useUserPermissions();
  const [targetStage, setTargetStage] = useState<string | null>(null);
  const [canProcess, setCanProcess] = useState(false);
  const [loadingStage, setLoadingStage] = useState(true);

  const productCode = getProductCode(transaction.product_type);
  const eventCode = getEventCode(transaction.process_type);

  useEffect(() => {
    const determineTargetStage = async () => {
      if (!permissionsLoading && isOpen) {
        setLoadingStage(true);
        
        // Get user's accessible actor types for this product-event
        // Note: getAccessibleStages returns actor_types like 'Maker', 'Checker'
        const accessibleActorTypes = isSuperUser() 
          ? ['__ALL__']  // Super users have access to all actor types
          : getAccessibleStages(productCode, eventCode);
        
        console.log('Accessible actor types for user:', accessibleActorTypes);
        console.log('Transaction status:', transaction.status);
        console.log('Initiating channel:', transaction.initiating_channel);
        
        // Get trigger type for template lookup
        const triggerType = getTriggerTypeFromContext(transaction.initiating_channel, transaction.status);
        console.log('Trigger type:', triggerType);
        
        // Fetch workflow template and determine next stage
        const stage = await getTargetStageFromWorkflow(
          transaction.status,
          accessibleActorTypes,
          productCode,
          eventCode,
          triggerType
        );
        
        console.log('Target stage determined from workflow:', stage);
        
        setTargetStage(stage);
        setCanProcess(!!stage);
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

  // Parse form_data from transaction if available
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

  if (!canProcess || !targetStage) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">No Action Required</h3>
            <p className="text-muted-foreground">
              You don't have permission to process this transaction at its current stage, 
              or the transaction has already been fully processed.
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

  // Determine trigger type based on transaction context for cross-workflow handoff
  const triggerType = getTriggerTypeFromContext(transaction.initiating_channel, transaction.status);

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
          initialStage={targetStage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionWorkflowModal;
