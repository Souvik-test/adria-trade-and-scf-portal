import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDynamicTransaction } from '@/hooks/useDynamicTransaction';
import { DynamicFormState } from '@/types/dynamicForm';
import DynamicProgressIndicator from './DynamicProgressIndicator';
import DynamicButtonRenderer from './DynamicButtonRenderer';
import DynamicFormContainer from './DynamicFormContainer';
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
    isTransactionComplete,
    productName,
    eventName,
    navigateToPane,
    handleFieldChange,
    handleRepeatableFieldChange,
    handleAddRepeatableInstance,
    handleRemoveRepeatableInstance,
    handleSave,
    handleStageSubmit,
    handleSubmit,
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

  // Transaction completed state
  if (isTransactionComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Transaction has been approved</h2>
          <p className="text-muted-foreground">
            Your {productName} - {eventName} request has been successfully processed.
          </p>
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

  // Determine if MT700 sidebar should be shown (for ILC/ELC products)
  const shouldShowMT700 = showMT700Sidebar && ['ILC', 'ELC'].includes(productCode);

  const formContent = (
    <div className="space-y-6">
      {/* Header with Product • Event • Stage */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">
          {title || `${productName} • ${eventName}`}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {currentStageName}
          </span>
          {template && (
            <span className="text-xs">Template: {template.template_name}</span>
          )}
        </p>
      </div>

      {/* Progress Indicator */}
      {panes.length > 1 && (
        <DynamicProgressIndicator
          panes={panes}
          currentPaneIndex={currentPaneIndex}
          completedPanes={completedPanes}
          onPaneClick={(index) => navigateToPane('pane', panes[index]?.id)}
          allowNavigation={true}
        />
      )}

      {/* Current Pane Content */}
      {currentPane && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{currentPane.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dynamic Fields from Field Repository - filtered by current pane */}
            <DynamicFormContainer
              productCode={productCode}
              eventType={eventCode}
              currentPaneCode={currentPane.name}
              sectionConfigs={currentPane.sections?.map(s => ({
                name: s.name,
                rows: s.rows || 2,
                columns: s.columns || 2,
                isRepeatable: s.isRepeatable || false,
                groupId: s.groupId,
              }))}
              initialData={{ formData, repeatableGroups }}
              onFormChange={(state) => {
                // Sync with parent state
                Object.entries(state.formData).forEach(([key, value]) => {
                  if (formData[key] !== value) {
                    handleFieldChange(key, value);
                  }
                });
              }}
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
                onDiscard={handleDiscard}
                onClose={handleClose}
              />
            </div>
          </CardContent>
        </Card>
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