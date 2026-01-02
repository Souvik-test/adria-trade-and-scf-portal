import React from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDynamicTransaction } from '@/hooks/useDynamicTransaction';
import { DynamicFormState } from '@/types/dynamicForm';
import DynamicProgressIndicator from './DynamicProgressIndicator';
import DynamicButtonRenderer from './DynamicButtonRenderer';
import HybridFormContainer from './HybridFormContainer';
import DynamicMT700Sidebar from './DynamicMT700Sidebar';

interface DynamicTransactionFormProps {
  productCode: string;
  eventCode: string;
  triggerType: string;
  businessApp?: string;
  customerSegment?: string;
  title?: string;
  showMT700Sidebar?: boolean;
  onSubmitSuccess?: (data: DynamicFormState) => void;
  onClose?: () => void;
  // New props for continuing an existing transaction
  transactionRef?: string;
  initialFormData?: Record<string, any>;
  initialStage?: string;
}

const DynamicTransactionForm: React.FC<DynamicTransactionFormProps> = ({
  productCode,
  eventCode,
  triggerType,
  businessApp,
  customerSegment,
  title,
  showMT700Sidebar = true,
  onSubmitSuccess,
  onClose,
  transactionRef,
  initialFormData,
  initialStage,
}) => {
  const {
    loading,
    error,
    template,
    panes,
    currentPaneIndex,
    completedPanes,
    formData,
    repeatableGroups,
    hasWorkflowTemplate,
    currentStageFieldEditability,
    isTransactionComplete,
    completedStageName,
    productName,
    eventName,
    currentStageAllowedFields,
    stagePaneMapping,
    isStaticStage,
    navigateToPane,
    handleFieldChange,
    handleRepeatableFieldChange,
    handleAddRepeatableInstance,
    handleRemoveRepeatableInstance,
    handleSave,
    handleStageSubmit,
    handleSubmit,
    handleReject,
    handleDiscard,
    handleClose,
    getCurrentPane,
    getPaneButtons,
    getCurrentStageName,
    isLastPaneOfCurrentStage,
    isFinalStage,
  } = useDynamicTransaction({
    productCode,
    eventCode,
    triggerType,
    businessApp,
    customerSegment,
    onSubmitSuccess,
    onClose,
    transactionRef,
    initialFormData,
    initialStage,
  });

  // Get current stage name dynamically
  const currentStageName = getCurrentStageName();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading form configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-destructive font-medium mb-2">Failed to load form</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasWorkflowTemplate || panes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p className="font-medium mb-2">No workflow configuration found</p>
            <p className="text-sm">
              Please configure a workflow template and pane/section mapping for {productCode} - {eventCode} with trigger type "{triggerType}" in Control Centre.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transaction completed state - stage-specific messages
  if (isTransactionComplete) {
    // Check if this was a rejection (check formData for rejection_reason)
    const isRejection = formData.rejection_reason || formData['rejection_reason'];
    
    // Determine title and message based on completed stage
    const getCompletionContent = () => {
      const stageLower = completedStageName.toLowerCase();
      
      if (isRejection) {
        return {
          title: 'Transaction Rejected',
          message: `The ${productName} - ${eventName} request has been rejected and sent back to Data Entry.`,
          isError: true,
        };
      } else if (stageLower.includes('approval')) {
        return {
          title: 'Transaction has been approved',
          message: `Your ${productName} - ${eventName} request has been successfully processed.`,
          isError: false,
        };
      } else if (stageLower.includes('authorization')) {
        // Portal Authorization completed - transaction sent to Bank
        return {
          title: 'Sent to Bank',
          message: `Your ${productName} - ${eventName} has been authorized and sent to the bank for processing.`,
          isError: false,
        };
      } else if (stageLower.includes('checker')) {
        return {
          title: 'Checker Review Completed',
          message: `Your ${productName} - ${eventName} has passed checker review and is pending final approval.`,
          isError: false,
        };
      } else if (stageLower.includes('limit')) {
        return {
          title: 'Limit Check Completed',
          message: `Your ${productName} - ${eventName} has passed limit verification and is pending approval.`,
          isError: false,
        };
      } else {
        // Data Entry or any other stage
        return {
          title: 'Transaction Submitted',
          message: `Your ${productName} - ${eventName} has been submitted for processing.`,
          isError: false,
        };
      }
    };
    
    const { title: completionTitle, message: completionMessage, isError } = getCompletionContent();
    
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
          isError 
            ? 'bg-red-100 dark:bg-red-900/30' 
            : 'bg-green-100 dark:bg-green-900/30'
        }`}>
          {isError ? (
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          ) : (
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          )}
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">{completionTitle}</h2>
          <p className="text-muted-foreground">{completionMessage}</p>
        </div>
        <Button onClick={handleClose} variant="outline" className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  const currentPane = getCurrentPane();
  const currentButtons = getPaneButtons();
  const isLastPane = isLastPaneOfCurrentStage();
  const isFinal = isFinalStage();

  // Determine if current stage is Approval - fields should be read-only
  const isApprovalStage = currentStageName.toLowerCase().includes('approval');

  // Determine if MT700 sidebar should be shown
  // - Only for ILC/ELC products
  // - Only if workflow template exists
  // - Only if current pane's showSwiftPreview is true (from pane_section_mappings)
  const currentPaneShowSwiftPreview = currentPane?.showSwiftPreview !== false;
  const shouldShowMT700 = showMT700Sidebar && 
                          ['ILC', 'ELC'].includes(productCode) && 
                          hasWorkflowTemplate && 
                          currentPaneShowSwiftPreview;

  // Extract LC Reference Number from form data for header display
  const lcReferenceNumber = formData['LC Number'] || formData['LC  Number'] || 
                            formData.lc_number || formData.lcNumber || 
                            formData['LC Reference'] || formData['Corporate Reference'] ||
                            formData['Corporate  Reference'] || '';

  const formContent = (
    <div className="space-y-6">
      {/* Header with Product • Event • Stage • LC Reference */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {title || `${productName} • ${eventName}`}
          </h2>
          {lcReferenceNumber && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground border border-border">
              LC Ref: {lcReferenceNumber}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {currentStageName}
          </span>
          {template && (
            <span className="text-xs">Template: {template.template_name}</span>
          )}
        </p>
      </div>

      {/* Progress Indicator - hidden for static stages */}
      {!isStaticStage && panes.length > 1 && (
        <DynamicProgressIndicator
          panes={panes}
          currentPaneIndex={currentPaneIndex}
          completedPanes={completedPanes}
          onPaneClick={(index) => navigateToPane('pane', panes[index]?.id)}
          allowNavigation={true}
        />
      )}

      {/* Current Pane Content - uses HybridFormContainer for static/dynamic switching */}
      {currentPane && (
        <>
          <HybridFormContainer
            productCode={productCode}
            eventCode={eventCode}
            currentPane={currentPane}
            currentPaneIndex={currentPaneIndex}
            stagePaneMapping={stagePaneMapping}
            formData={formData}
            repeatableGroups={repeatableGroups}
            currentStageAllowedFields={currentStageAllowedFields}
            currentStageFieldEditability={currentStageFieldEditability}
            isApprovalStage={isApprovalStage}
            onFieldChange={handleFieldChange}
            configuredStaticPanes={stagePaneMapping[currentPaneIndex]?.configuredStaticPanes}
          />

          {/* Dynamic Buttons */}
          <div className="pt-4 border-t border-border">
            <DynamicButtonRenderer
              buttons={currentButtons}
              currentPaneIndex={currentPaneIndex}
              totalPanes={panes.length}
              isLastPaneOfStage={isLastPane}
              isFinalStage={isFinal}
              stageName={currentStageName}
              onNavigate={navigateToPane}
              onSave={handleSave}
              onStageSubmit={handleStageSubmit}
              onSubmit={handleSubmit}
              onReject={handleReject}
              onDiscard={handleDiscard}
              onClose={handleClose}
            />
          </div>
        </>
      )}

      {/* Bottom padding for scroll */}
      <div className="h-6" />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className={`flex flex-1 overflow-hidden ${shouldShowMT700 ? 'gap-0' : ''}`}>
        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto p-6">
          {formContent}
        </div>
        
        {/* MT 700 Sidebar */}
        {shouldShowMT700 && (
          <DynamicMT700Sidebar
            formData={formData}
            productCode={productCode}
            eventCode={eventCode}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicTransactionForm;