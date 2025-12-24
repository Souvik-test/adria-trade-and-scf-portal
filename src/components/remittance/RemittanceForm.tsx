import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import TransferFormSection from './TransferFormSection';
import { useRemittanceWorkflow } from '@/hooks/useRemittanceWorkflow';

interface RemittanceFormProps {
  onBack: () => void;
  transactionRef?: string;
  transactionStatus?: string;
}

const RemittanceForm: React.FC<RemittanceFormProps> = ({ 
  onBack, 
  transactionRef,
  transactionStatus 
}) => {
  // Integrate with workflow template
  const {
    hasWorkflowTemplate,
    currentStage,
    allStages,
    isEditable,
    isApprovalStage,
    loading: workflowLoading,
    error: workflowError,
    completeCurrentStage,
    approveTransaction,
    rejectTransaction,
  } = useRemittanceWorkflow({
    transactionRef,
    transactionStatus,
    triggerType: 'Manual', // Bank-side workflow
  });

  // Handle stage completion
  const handleStageComplete = async () => {
    const newStatus = await completeCurrentStage();
    if (newStatus) {
      console.log('Stage completed, new status:', newStatus);
      // In a real implementation, this would update the transaction status
    }
  };

  // Handle approval
  const handleApprove = async () => {
    const success = await approveTransaction();
    if (success) {
      console.log('Transaction approved');
      onBack();
    }
  };

  // Handle rejection
  const handleReject = async (reason?: string) => {
    const success = await rejectTransaction(reason);
    if (success) {
      console.log('Transaction rejected');
      onBack();
    }
  };

  // Show loading state while fetching workflow
  if (workflowLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show error if workflow fetch failed
  if (workflowError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p>{workflowError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workflow Stage Indicator */}
      {hasWorkflowTemplate && currentStage && (
        <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Stage:</span>
            <Badge variant="secondary" className="font-medium">
              {currentStage.stage_name}
            </Badge>
          </div>
          <div className="h-4 border-l border-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <Badge 
              variant={isApprovalStage ? 'outline' : 'default'}
              className={isApprovalStage ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}
            >
              {isApprovalStage ? 'Review (Read-only)' : 'Data Entry'}
            </Badge>
          </div>
          <div className="h-4 border-l border-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">UI Mode:</span>
            <Badge variant="outline">
              {currentStage.ui_render_mode === 'dynamic' ? 'Dynamic' : 'Static'}
            </Badge>
          </div>
          {allStages.length > 1 && (
            <>
              <div className="h-4 border-l border-border" />
              <div className="flex items-center gap-1">
                {allStages.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        stage.id === currentStage.id
                          ? 'bg-primary'
                          : stage.stage_order < currentStage.stage_order
                          ? 'bg-green-500'
                          : 'bg-muted-foreground/30'
                      }`}
                      title={stage.stage_name}
                    />
                    {index < allStages.length - 1 && (
                      <div className="w-3 h-0.5 bg-muted-foreground/30" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Transfer Form - No tabs, direct display */}
      <TransferFormSection 
        readOnly={!isEditable}
        isApprovalStage={isApprovalStage}
        onStageComplete={handleStageComplete}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default RemittanceForm;
