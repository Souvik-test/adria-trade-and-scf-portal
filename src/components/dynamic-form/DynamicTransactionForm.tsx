import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, XCircle, Trash2, Save, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDynamicTransaction } from '@/hooks/useDynamicTransaction';
import { DynamicFormState } from '@/types/dynamicForm';
import DynamicProgressIndicator from './DynamicProgressIndicator';
import DynamicButtonRenderer from './DynamicButtonRenderer';
import HybridFormContainer from './HybridFormContainer';
import DynamicMT700Sidebar from './DynamicMT700Sidebar';
import { useBusinessValidation } from '@/hooks/useBusinessValidation';
import InlineValidationMessages from './InlineValidationMessages';
import { normalizeFieldCode, ValidationResult, ValidationResultItem } from '@/services/businessValidationService';
import { supabase } from '@/integrations/supabase/client';
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
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  // State for static pane navigation (managed externally for DynamicButtonRenderer coordination)
  const [staticPaneIndex, setStaticPaneIndex] = useState(0);
  const [staticPaneTotal, setStaticPaneTotal] = useState(1);
  
  // State for rejection dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Business validation state
  const { validationResult, isValidating, runValidation, clearValidation } = useBusinessValidation();
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'dynamicNext' | 'staticNext' | 'stageSubmit' | 'finalSubmit';
  } | null>(null);
  const [acknowledgedRuleIds, setAcknowledgedRuleIds] = useState<Set<string>>(new Set());
  const [filteredValidationResult, setFilteredValidationResult] = useState<ValidationResult | null>(null);
  
  // Field to pane mapping for pane-aware validation
  const [fieldToPaneMap, setFieldToPaneMap] = useState<Map<string, string>>(new Map());
  const [paneOrderMap, setPaneOrderMap] = useState<Map<string, number>>(new Map());
  
  // Ref for form container to scroll to fields
  const formContainerRef = useRef<HTMLDivElement>(null);

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
    wasJustRejected,
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

  // Handler for static pane changes from StaticPaneRenderer
  const handleStaticPaneChange = useCallback((activeIndex: number, totalPanes: number) => {
    setStaticPaneIndex(activeIndex);
    setStaticPaneTotal(totalPanes);
  }, []);

  // Handler for static pane navigation from DynamicButtonRenderer
  const handleStaticPaneNavigate = useCallback((direction: 'next' | 'previous') => {
    if (direction === 'next' && staticPaneIndex < staticPaneTotal - 1) {
      setStaticPaneIndex(prev => prev + 1);
    } else if (direction === 'previous' && staticPaneIndex > 0) {
      setStaticPaneIndex(prev => prev - 1);
    }
  }, [staticPaneIndex, staticPaneTotal]);

  // Get current stage name dynamically
  const currentStageName = getCurrentStageName();

  // Handler for opening rejection dialog
  const openRejectDialog = useCallback(() => {
    setIsRejectDialogOpen(true);
  }, []);

  // Handler for confirming rejection
  const handleRejectConfirm = useCallback(async () => {
    if (!rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await handleReject(rejectReason);
      setIsRejectDialogOpen(false);
      setRejectReason('');
    } finally {
      setIsRejecting(false);
    }
  }, [rejectReason, handleReject]);

  // Fetch field-to-pane mapping for pane-aware validation
  useEffect(() => {
    const fetchFieldPaneMapping = async () => {
      if (!productCode || !eventCode) return;
      
      try {
        const { data, error } = await supabase.rpc('get_dynamic_form_fields', {
          p_product_code: productCode,
          p_event_type: eventCode,
        });
        
        if (!error && data) {
          const fieldMap = new Map<string, string>();
          (data as any[]).forEach((field: any) => {
            if (field.field_code && field.pane_code) {
              fieldMap.set(normalizeFieldCode(field.field_code), field.pane_code);
            }
          });
          setFieldToPaneMap(fieldMap);
        }
      } catch (err) {
        console.error('Error fetching field-pane mapping:', err);
      }
    };
    
    fetchFieldPaneMapping();
  }, [productCode, eventCode]);
  
  // Build pane order map when panes change
  useEffect(() => {
    const orderMap = new Map<string, number>();
    panes.forEach((pane, index) => {
      orderMap.set(pane.name, index);
    });
    setPaneOrderMap(orderMap);
  }, [panes]);

  // Filter validation results for current pane
  // Rules trigger based on the pane_codes stored in each condition
  const filterValidationForCurrentPane = useCallback(
    (result: ValidationResult, currentPaneName: string): ValidationResult => {
      const filterItems = (items: ValidationResultItem[]): ValidationResultItem[] => {
        return items.filter((item) => {
          // Skip already acknowledged rules
          if (acknowledgedRuleIds.has(item.rule_id)) {
            return false;
          }
          
          // Unconditional rules (no pane_codes): show on any pane (but only once)
          if (!item.pane_codes || item.pane_codes.length === 0) {
            return true;
          }
          
          // Get all unique panes from the rule conditions
          const rulePanes = item.pane_codes;
          
          // Get current pane index
          const currentPaneIndex = paneOrderMap.get(currentPaneName) ?? -1;
          
          // Single pane rule: show on "Next" of that specific pane
          if (rulePanes.length === 1) {
            const rulePaneIndex = paneOrderMap.get(rulePanes[0]) ?? -1;
            return rulePaneIndex === currentPaneIndex;
          }
          
          // Multi-pane rule: show on the last pane among the rule's panes
          // Find the max pane index among the rule's pane_codes
          let maxPaneIndex = -1;
          for (const paneCode of rulePanes) {
            const paneIndex = paneOrderMap.get(paneCode) ?? -1;
            if (paneIndex > maxPaneIndex) {
              maxPaneIndex = paneIndex;
            }
          }
          
          // Show the rule only on the last pane where it has conditions
          return maxPaneIndex === currentPaneIndex;
        });
      };

      return {
        errors: filterItems(result.errors),
        warnings: filterItems(result.warnings),
        information: filterItems(result.information),
        hasErrors: filterItems(result.errors).length > 0,
        hasWarnings: filterItems(result.warnings).length > 0,
        canProceed: filterItems(result.errors).length === 0,
      };
    },
    [acknowledgedRuleIds, paneOrderMap]
  );

  // Navigate to a field by scrolling and focusing
  const navigateToField = useCallback((fieldCode: string) => {
    const normalizedCode = normalizeFieldCode(fieldCode);
    
    // Try to find the field element by data-field-id attribute
    const formContainer = formContainerRef.current;
    if (!formContainer) return;
    
    // Try multiple field code variations
    const fieldVariations = [fieldCode, normalizedCode, fieldCode.replace(/\s+/g, '  ')];
    
    for (const code of fieldVariations) {
      const fieldElement = formContainer.querySelector(`[data-field-id="${code}"]`);
      if (fieldElement) {
        // Scroll to the field
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus on the input inside the field
        const input = fieldElement.querySelector('input, textarea, select, button');
        if (input) {
          setTimeout(() => (input as HTMLElement).focus(), 300);
        }
        
        // Add a brief highlight effect
        fieldElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          fieldElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
        
        return;
      }
    }
    
    console.warn(`Field not found: ${fieldCode}`);
  }, []);

  // Run validation and show inline messages if needed
  const executeValidation = useCallback(
    async (actionType: 'dynamicNext' | 'staticNext' | 'stageSubmit' | 'finalSubmit') => {
      // Clear previous validation state first
      setShowValidationMessages(false);
      setFilteredValidationResult(null);
      
      const result = await runValidation(productCode, eventCode, formData);
      
      // Get current pane name for filtering
      const currentPane = getCurrentPane();
      const currentPaneName = currentPane?.name || '';
      
      // Filter results for current pane
      const filtered = filterValidationForCurrentPane(result, currentPaneName);
      
      // Check if there are any messages to show
      const hasMessages =
        filtered.errors.length > 0 ||
        filtered.warnings.length > 0 ||
        filtered.information.length > 0;
      
      if (hasMessages) {
        setFilteredValidationResult(filtered);
        setPendingAction({ type: actionType });
        setShowValidationMessages(true);
        return false; // Action blocked
      }
      
      return true; // Action can proceed
    },
    [runValidation, productCode, eventCode, formData, getCurrentPane, filterValidationForCurrentPane]
  );

  // Validation-aware next for dynamic stages
  const handleDynamicNextWithValidation = useCallback(async () => {
    const canProceed = await executeValidation('dynamicNext');
    if (canProceed) {
      navigateToPane('next');
    }
  }, [executeValidation, navigateToPane]);

  // Validation-aware next for static stages
  const handleStaticNextWithValidation = useCallback(async () => {
    const canProceed = await executeValidation('staticNext');
    if (canProceed) {
      handleStaticPaneNavigate('next');
    }
  }, [executeValidation, handleStaticPaneNavigate]);

  // Validation-aware stage submit
  const handleStageSubmitWithValidation = useCallback(async () => {
    const canProceed = await executeValidation('stageSubmit');
    if (canProceed) {
      handleStageSubmit();
    }
  }, [executeValidation, handleStageSubmit]);

  // Validation-aware final submit
  const handleFinalSubmitWithValidation = useCallback(async () => {
    const canProceed = await executeValidation('finalSubmit');
    if (canProceed) {
      handleSubmit();
    }
  }, [executeValidation, handleSubmit]);

  // Handle validation proceed (for warnings/info)
  const handleValidationProceed = useCallback(() => {
    // Add warning/info rule IDs to acknowledged set
    if (filteredValidationResult) {
      const newAcknowledged = new Set(acknowledgedRuleIds);
      [...filteredValidationResult.warnings, ...filteredValidationResult.information].forEach(
        (item) => newAcknowledged.add(item.rule_id)
      );
      setAcknowledgedRuleIds(newAcknowledged);
    }
    
    // Execute pending action
    if (pendingAction) {
      switch (pendingAction.type) {
        case 'dynamicNext':
          navigateToPane('next');
          break;
        case 'staticNext':
          handleStaticPaneNavigate('next');
          break;
        case 'stageSubmit':
          handleStageSubmit();
          break;
        case 'finalSubmit':
          handleSubmit();
          break;
      }
    }
    
    setShowValidationMessages(false);
    setPendingAction(null);
    setFilteredValidationResult(null);
    clearValidation();
  }, [
    filteredValidationResult,
    acknowledgedRuleIds,
    pendingAction,
    navigateToPane,
    handleStaticPaneNavigate,
    handleStageSubmit,
    handleSubmit,
    clearValidation,
  ]);

  // Handle validation dismiss (go back)
  const handleValidationDismiss = useCallback(() => {
    setShowValidationMessages(false);
    setPendingAction(null);
    setFilteredValidationResult(null);
    clearValidation();
  }, [clearValidation]);

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
    // Check if this was a rejection using session-level flag (not formData)
    // This prevents stale rejection_reason from previous rejections affecting display
    const isRejection = wasJustRejected;
    
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
        // Check if this is a Bank workflow (Manual) or Portal workflow (ClientPortal)
        // Bank workflows: Authorization is the final stage → show "Issued"
        // Portal workflows: Authorization triggers cross-workflow handoff → show "Sent to Bank"
        const isBankWorkflow = triggerType === 'Manual';
        
        if (isBankWorkflow) {
          // Bank workflow - Authorization is the final stage
          return {
            title: 'Transaction Authorized',
            message: `Your ${productName} - ${eventName} has been successfully authorized.`,
            isError: false,
          };
        } else {
          // Portal workflow - Authorization sends to bank for processing
          return {
            title: 'Sent to Bank',
            message: `Your ${productName} - ${eventName} has been authorized and sent to the bank for processing.`,
            isError: false,
          };
        }
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

  // Determine if current stage is Approval/Authorization based on actor_type
  const currentActorType = stagePaneMapping[currentPaneIndex]?.actorType || '';
  const isApprovalStage = currentActorType === 'Checker' || currentActorType === 'Authorization';
  
  // Check if this is the last static pane (for Maker Submit button visibility)
  const isLastStaticPane = staticPaneIndex === staticPaneTotal - 1;
  
  // Get total static panes for current stage
  const configuredStaticPanes = stagePaneMapping[currentPaneIndex]?.configuredStaticPanes;
  const totalStaticPanesCount = configuredStaticPanes?.length || 1;
  const hasMultipleStaticPanes = isStaticStage && totalStaticPanesCount > 1;

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

      {/* Inline Validation Messages - shown at top */}
      {showValidationMessages && filteredValidationResult && (
        <InlineValidationMessages
          validationResult={filteredValidationResult}
          position="top"
          onDismiss={handleValidationDismiss}
          onProceed={filteredValidationResult.hasErrors ? undefined : handleValidationProceed}
          onFieldClick={navigateToField}
        />
      )}

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
          <div ref={formContainerRef}>
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
              configuredStaticPanes={configuredStaticPanes}
              hideStaticNavigationButtons={true}
              onStaticPaneChange={handleStaticPaneChange}
              staticActivePaneIndex={staticPaneIndex}
            />
          </div>

          {/* Static Stage Unified Action Bar - Navigation + Actions */}
          {isStaticStage && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                {/* Left side: Navigation (only if multiple panes) */}
                <div className="flex items-center gap-2">
                  {hasMultipleStaticPanes ? (
                    <>
                      <Button 
                        variant="outline" 
                        disabled={staticPaneIndex === 0}
                        onClick={() => handleStaticPaneNavigate('previous')}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-2">
                        {staticPaneIndex + 1} of {staticPaneTotal}
                      </span>
                      <Button 
                        variant="outline" 
                        disabled={staticPaneIndex === staticPaneTotal - 1 || isValidating}
                        onClick={handleStaticNextWithValidation}
                      >
                        {isValidating ? 'Validating...' : 'Next'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={handleDiscard}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Discard
                    </Button>
                  )}
                </div>
                {/* Right side: Actions */}
                <div className="flex items-center gap-2">
                  {hasMultipleStaticPanes && (
                    <Button variant="outline" onClick={handleDiscard}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Discard
                    </Button>
                  )}
                  
                  {/* Maker stages: Save Draft (always) + Submit (only at last pane) */}
                  {!isApprovalStage && (
                    <>
                      <Button variant="outline" onClick={() => handleSave('draft')}>
                        <Save className="w-4 h-4 mr-1" />
                        Save Draft
                      </Button>
                      {isLastStaticPane && (
                        <Button onClick={handleStageSubmitWithValidation} disabled={isValidating}>
                          <Send className="w-4 h-4 mr-1" />
                          {isValidating ? 'Validating...' : 'Submit'}
                        </Button>
                      )}
                    </>
                  )}
                  
                  {/* Checker/Authorization stages: Reject + Approve (no Submit, no Save Draft) */}
                  {isApprovalStage && (
                    <>
                      <Button 
                        variant="outline" 
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={openRejectDialog}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button onClick={handleStageSubmitWithValidation} disabled={isValidating}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {isValidating ? 'Validating...' : 'Approve'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rejection Dialog for Static UI */}
          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reject Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reject-reason">Rejection Reason</Label>
                  <Textarea
                    id="reject-reason"
                    placeholder="Please provide a reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectReason('');
                  }}
                  disabled={isRejecting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason.trim() || isRejecting}
                >
                  {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dynamic Buttons - only for dynamic stages */}
          {!isStaticStage && (
            <div className="pt-4 border-t border-border">
              <DynamicButtonRenderer
                buttons={currentButtons}
                currentPaneIndex={currentPaneIndex}
                totalPanes={panes.length}
                isLastPaneOfStage={isLastPane}
                isFinalStage={isFinal}
                stageName={currentStageName}
                isStaticStage={false}
                onNavigate={(direction) => {
                  if (direction === 'next') {
                    handleDynamicNextWithValidation();
                  } else {
                    navigateToPane(direction);
                  }
                }}
                onSave={handleSave}
                onStageSubmit={handleStageSubmitWithValidation}
                onSubmit={handleFinalSubmitWithValidation}
                onReject={handleReject}
                onDiscard={handleDiscard}
                onClose={handleClose}
                isLoading={isValidating}
              />
            </div>
          )}

        </>
      )}

      {/* Bottom padding for scroll */}
      <div className="h-6" />
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      <div className={`flex flex-1 min-h-0 overflow-hidden ${shouldShowMT700 ? 'gap-0' : ''}`}>
        {/* Scrollable form content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
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