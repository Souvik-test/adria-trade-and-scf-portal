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

// Determine trigger type based on transaction context (channel + status)
// This enables cross-workflow handoff: Portal workflow → Bank workflow
const getTriggerTypeFromContext = (initiatingChannel: string, status: string): string => {
  // If initiated from Bank, always use Manual (Bank workflow)
  if (initiatingChannel === 'Bank') {
    return 'Manual';
  }
  
  // If initiated from Portal: check status to determine workflow phase
  if (initiatingChannel === 'Portal') {
    // Statuses that indicate transaction has moved to Bank phase
    const bankPhaseStatuses = ['Sent to Bank', 'Bank Processing', 'Limit Checked', 'Checker Reviewed', 'Issued'];
    
    if (bankPhaseStatuses.includes(status)) {
      return 'Manual'; // Switch to Bank workflow
    }
    return 'ClientPortal'; // Still in Portal phase
  }
  
  // Default to Manual
  return 'Manual';
};

// Map transaction status to the stage that was just completed
const getCompletedStageName = (status: string): string | null => {
  const mapping: Record<string, string> = {
    'submitted': 'Data Entry',
    'sent to bank': 'Authorization',
    'bank processing': 'Data Entry',      // Bank Data Entry completed
    'limit checked': 'Limit Check',
    'checker reviewed': 'Checker Review',
    'issued': '__ALL_COMPLETE__',
  };
  return mapping[status.toLowerCase()] || null;
};

// Fetch the workflow template and determine the next stage based on current status
const getTargetStageFromWorkflow = async (
  status: string, 
  accessibleStages: string[],
  productCode: string,
  eventCode: string,
  triggerType: string
): Promise<string | null> => {
  const normalizedStatus = status.toLowerCase();
  
  // Handle rejected - always goes back to Data Entry
  if (normalizedStatus === 'rejected') {
    return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
  }
  
  // Handle draft - start from Data Entry
  if (normalizedStatus === 'draft') {
    return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
  }
  
  // Special case: "Sent to Bank" means Portal workflow ended, Bank workflow should START
  // This is a cross-workflow handoff - Bank Maker starts from Bank's Data Entry
  if (normalizedStatus === 'sent to bank') {
    console.log('Cross-workflow handoff: Sent to Bank - starting Bank workflow from Data Entry');
    return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
  }
  
  // Get which stage was just completed based on status
  const completedStageName = getCompletedStageName(status);
  
  if (!completedStageName) {
    // Unknown status, try Data Entry
    return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
  }
  
  if (completedStageName === '__ALL_COMPLETE__') {
    return null; // Transaction fully processed
  }
  
  // Fetch workflow template to get stage order
  const template = await findWorkflowTemplate(productCode, eventCode, triggerType);
  if (!template) {
    console.log('No workflow template found for:', productCode, eventCode, triggerType);
    return null;
  }
  
  const stages = await getTemplateStages(template.id);
  console.log('Workflow template stages:', stages.map(s => s.stage_name));
  console.log('Looking for completed stage:', completedStageName);
  
  // Find the completed stage index in the workflow template
  const completedIndex = stages.findIndex(
    s => s.stage_name.toLowerCase() === completedStageName.toLowerCase()
  );
  
  if (completedIndex === -1) {
    console.log('Completed stage not found in template, checking for Data Entry');
    // Stage not found in this template - might be cross-workflow
    // Find first stage after Data Entry
    const dataEntryIndex = stages.findIndex(
      s => s.stage_name.toLowerCase().includes('data entry')
    );
    if (dataEntryIndex >= 0 && dataEntryIndex < stages.length - 1) {
      const nextStage = stages[dataEntryIndex + 1];
      // Check if user has access via actor_type, not stage_name
      if (accessibleStages.includes(nextStage.actor_type) || accessibleStages.includes('__ALL__')) {
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
    if (accessibleStages.includes(nextStage.actor_type) || accessibleStages.includes('__ALL__')) {
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
        
        // Get user's accessible stages for this product-event
        const accessibleStages = isSuperUser() 
          ? ['Data Entry', 'Authorization', 'Limit Check', 'Checker Review', 'Approval', 'Final Approval']
          : getAccessibleStages(productCode, eventCode);
        
        console.log('Accessible stages for user:', accessibleStages);
        console.log('Transaction status:', transaction.status);
        console.log('Initiating channel:', transaction.initiating_channel);
        
        // Get trigger type for template lookup
        const triggerType = getTriggerTypeFromContext(transaction.initiating_channel, transaction.status);
        console.log('Trigger type:', triggerType);
        
        // Fetch workflow template and determine next stage
        const stage = await getTargetStageFromWorkflow(
          transaction.status,
          accessibleStages,
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
