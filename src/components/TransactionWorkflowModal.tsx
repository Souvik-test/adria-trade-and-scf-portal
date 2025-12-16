import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import DynamicTransactionForm from '@/components/dynamic-form/DynamicTransactionForm';
import { Loader2 } from 'lucide-react';

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

// Determine which stage the user should see based on transaction status and permissions
// Returns null if the transaction's current stage has already been completed
const getTargetStage = (status: string, accessibleStages: string[], initiatingChannel: string): string | null => {
  const normalizedStatus = status.toLowerCase();
  
  // "Sent to Bank" status - transaction is ready for Bank workflow processing
  // Bank users should start from Data Entry in their workflow
  if (normalizedStatus === 'sent to bank') {
    // Transaction arrived from Portal - Bank users start from Data Entry in Bank workflow
    if (accessibleStages.some(s => s.toLowerCase().includes('data entry'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
    }
    return null;
  }
  
  // "Bank Processing" status - Bank Data Entry is done, next is Limit Check
  if (normalizedStatus === 'bank processing') {
    if (accessibleStages.some(s => s.toLowerCase().includes('limit'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('limit')) || null;
    }
    if (accessibleStages.some(s => s.toLowerCase().includes('checker'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('checker')) || null;
    }
    return null;
  }
  
  // Check each accessible stage and ensure user can only open at appropriate next stage
  // Prevent reopening a transaction at a stage that's already completed
  
  if (normalizedStatus === 'submitted') {
    // Portal Data Entry is done - user cannot reopen at Data Entry
    // Next stage is Authorization (Portal) or Limit Check (if any)
    if (accessibleStages.some(s => s.toLowerCase().includes('authorization'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('authorization')) || null;
    }
    if (accessibleStages.some(s => s.toLowerCase().includes('limit'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('limit')) || null;
    }
    if (accessibleStages.some(s => s.toLowerCase().includes('approval'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('approval')) || null;
    }
    // User only has Data Entry access but transaction is already submitted - no access
    return null;
  }
  
  if (normalizedStatus === 'limit checked') {
    // Data Entry AND Limit Check are done - user cannot reopen at those stages
    // Next stage is Checker Review or Approval
    if (accessibleStages.some(s => s.toLowerCase().includes('checker'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('checker')) || null;
    }
    if (accessibleStages.some(s => s.toLowerCase().includes('approval'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('approval')) || null;
    }
    // User doesn't have appropriate access - no access
    return null;
  }
  
  if (normalizedStatus === 'checker reviewed') {
    // Up through Checker Review is done - next is Final Approval
    if (accessibleStages.some(s => s.toLowerCase().includes('approval'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('approval')) || null;
    }
    return null;
  }
  
  if (normalizedStatus === 'rejected') {
    // Rejected transactions go back to Data Entry
    if (accessibleStages.some(s => s.toLowerCase().includes('data entry'))) {
      return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
    }
    return null;
  }
  
  // For draft or other status, check if user has Data Entry access
  if (accessibleStages.some(s => s.toLowerCase().includes('data entry'))) {
    return accessibleStages.find(s => s.toLowerCase().includes('data entry')) || null;
  }
  
  // Return null if no appropriate stage found
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

  const productCode = getProductCode(transaction.product_type);
  const eventCode = getEventCode(transaction.process_type);

  useEffect(() => {
    if (!permissionsLoading && isOpen) {
      // Get user's accessible stages for this product-event
      const accessibleStages = isSuperUser() 
        ? ['Data Entry', 'Authorization', 'Limit Check', 'Checker Review', 'Approval'] // Super user has all stages
        : getAccessibleStages(productCode, eventCode);
      
      console.log('Accessible stages for user:', accessibleStages);
      console.log('Transaction status:', transaction.status);
      console.log('Initiating channel:', transaction.initiating_channel);
      
      const stage = getTargetStage(transaction.status, accessibleStages, transaction.initiating_channel);
      console.log('Target stage:', stage);
      
      setTargetStage(stage);
      setCanProcess(!!stage);
    }
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

  if (permissionsLoading) {
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
