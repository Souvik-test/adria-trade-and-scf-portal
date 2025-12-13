import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    stages,
    panes,
    currentPaneIndex,
    completedPanes,
    formData,
    repeatableGroups,
    hasWorkflowTemplate,
    productName,
    eventName,
    navigateToPane,
    handleFieldChange,
    handleRepeatableFieldChange,
    handleAddRepeatableInstance,
    handleRemoveRepeatableInstance,
    handleSave,
    handleSubmit,
    handleDiscard,
    handleClose,
    getCurrentPane,
    getPaneButtons,
  } = useDynamicTransaction({
    productCode,
    eventCode,
    triggerType,
    businessApp,
    customerSegment,
    onSubmitSuccess,
    onClose,
  });

  // Get current stage name from workflow
  const currentStageName = stages.length > 0 ? stages[0]?.stage_name : 'Data Entry';

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

  const currentPane = getCurrentPane();
  const currentButtons = getPaneButtons();

  // Determine if MT700 sidebar should be shown (for ILC/ELC products)
  const shouldShowMT700 = showMT700Sidebar && ['ILC', 'ELC'].includes(productCode);

  const formContent = (
    <div className="flex-1 space-y-6">
      {/* Header with Product • Event • Stage */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">
          {title || `${productName} • ${eventName}`}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {currentStageName}
          </span>
          {template && (
            <span>Template: {template.template_name}</span>
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
            <DynamicButtonRenderer
              buttons={currentButtons}
              currentPaneIndex={currentPaneIndex}
              totalPanes={panes.length}
              onNavigate={navigateToPane}
              onSave={handleSave}
              onSubmit={handleSubmit}
              onDiscard={handleDiscard}
              onClose={handleClose}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className={`flex ${shouldShowMT700 ? 'gap-0' : ''}`}>
      {formContent}
      
      {/* MT 700 Sidebar */}
      {shouldShowMT700 && (
        <DynamicMT700Sidebar
          formData={formData}
          productCode={productCode}
          eventCode={eventCode}
        />
      )}
    </div>
  );
};

export default DynamicTransactionForm;
