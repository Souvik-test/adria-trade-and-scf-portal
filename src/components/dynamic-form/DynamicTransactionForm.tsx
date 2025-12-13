import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDynamicTransaction } from '@/hooks/useDynamicTransaction';
import { DynamicFormState } from '@/types/dynamicForm';
import DynamicProgressIndicator from './DynamicProgressIndicator';
import DynamicButtonRenderer from './DynamicButtonRenderer';
import DynamicFormContainer from './DynamicFormContainer';

interface DynamicTransactionFormProps {
  productCode: string;
  eventCode: string;
  triggerType: string;
  businessApp?: string;
  customerSegment?: string;
  title?: string;
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

  return (
    <div className="space-y-6">
      {/* Title */}
      {(title || template?.template_name) && (
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {title || template?.template_name}
          </h2>
          {template && (
            <p className="text-sm text-muted-foreground mt-1">
              {template.product_code} • {template.event_code}
            </p>
          )}
        </div>
      )}

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
            {/* Dynamic Fields from Field Repository */}
            <DynamicFormContainer
              productCode={productCode}
              eventType={eventCode}
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
};

export default DynamicTransactionForm;
