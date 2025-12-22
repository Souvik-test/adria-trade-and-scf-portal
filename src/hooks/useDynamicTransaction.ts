import { useState, useCallback, useEffect, useRef } from 'react';
import { matchesAccessibleStage } from '@/utils/stageAliases';
import { toast } from 'sonner';
import { 
  PaneConfig, 
  DynamicFormData, 
  RepeatableGroupInstance,
  DynamicFormState,
  WorkflowTemplateRuntime,
  WorkflowStageRuntime,
  WorkflowStageFieldRuntime,
} from '@/types/dynamicForm';
import { 
  findWorkflowTemplate, 
  getTemplateStages, 
  getStageFields,
  getTemplatePaneNames,
  getStagePaneMapping,
  StagePaneInfo,
} from '@/services/workflowTemplateService';
import { getPaneSectionConfig, getDefaultButtons } from '@/services/paneSectionService';
import { 
  fetchProductEventMappings, 
  getProductNameByCode, 
  getEventNameByCode,
  defaultProductNames,
  defaultEventNames 
} from '@/services/productEventMappingService';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { createTransactionRecord, getStatusFromStage } from '@/services/database';

interface UseDynamicTransactionProps {
  productCode: string;
  eventCode: string;
  triggerType: string;
  businessApp?: string;
  customerSegment?: string;
  onSubmitSuccess?: (data: DynamicFormState) => void;
  onClose?: () => void;
  // New props for continuing an existing transaction
  transactionRef?: string;
  initialFormData?: Record<string, any>;
  initialStage?: string;
}

interface UseDynamicTransactionReturn {
  // State
  loading: boolean;
  error: string | null;
  template: WorkflowTemplateRuntime | null;
  stages: WorkflowStageRuntime[];
  panes: PaneConfig[];
  currentPaneIndex: number;
  completedPanes: Set<string>;
  formData: DynamicFormData;
  repeatableGroups: { [groupId: string]: RepeatableGroupInstance[] };
  stageFields: Map<string, WorkflowStageFieldRuntime[]>;
  
  // Stage-pane mapping for navigation
  stagePaneMapping: StagePaneInfo[];
  
  // Product/Event display info from product_event_mapping
  productName: string;
  eventName: string;
  
  // Template found status
  hasWorkflowTemplate: boolean;
  
  // Transaction completion
  isTransactionComplete: boolean;
  completedStageName: string;
  
  // Allowed field names for current stage (for field filtering)
  currentStageAllowedFields: string[];
  // Field editability map for current stage (field_name -> isEditable)
  currentStageFieldEditability: Map<string, boolean>;

  // Actions
  navigateToPane: (direction: 'next' | 'previous' | 'pane', targetPaneId?: string) => void;
  handleFieldChange: (fieldCode: string, value: any) => void;
  handleRepeatableFieldChange: (groupId: string, instanceId: string, fieldCode: string, value: any) => void;
  handleAddRepeatableInstance: (groupId: string) => void;
  handleRemoveRepeatableInstance: (groupId: string, instanceId: string) => void;
  handleSave: (type: 'draft' | 'template') => Promise<void>;
  handleStageSubmit: () => void;
  handleSubmit: () => Promise<void>;
  handleReject: (reason: string) => Promise<void>;
  handleDiscard: () => void;
  handleClose: () => void;
  
  // Helpers
  getCurrentPane: () => PaneConfig | null;
  getPaneButtons: () => PaneConfig['buttons'];
  getCurrentStageName: () => string;
  isLastPaneOfCurrentStage: () => boolean;
  isFinalStage: () => boolean;
}

const generateInstanceId = () => `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Field mappings for cross-stage data continuity
const FIELD_MAPPINGS: Record<string, string[]> = {
  'Transaction Amount': ['LC Amount', 'LC  Amount', 'lc_amount', 'lcAmount'],
  'Transaction Currency': ['LC Currency', 'LC  Currency', 'lc_currency', 'lcCurrency'],
  'Transaction  Amount': ['LC Amount', 'LC  Amount', 'lc_amount', 'lcAmount'],
  'Transaction  Currency': ['LC Currency', 'LC  Currency', 'lc_currency', 'lcCurrency'],
};

// Apply field mappings to map values from previous stage fields to current stage fields
const applyFieldMappings = (data: Record<string, any>): Record<string, any> => {
  const mappedData = { ...data };
  
  Object.entries(FIELD_MAPPINGS).forEach(([targetField, sourceFields]) => {
    if (!mappedData[targetField] || mappedData[targetField] === '') {
      for (const sourceField of sourceFields) {
        if (mappedData[sourceField] !== undefined && mappedData[sourceField] !== '') {
          mappedData[targetField] = mappedData[sourceField];
          break;
        }
      }
    }
  });
  
  return mappedData;
};

export const useDynamicTransaction = ({
  productCode,
  eventCode,
  triggerType,
  businessApp,
  customerSegment,
  onSubmitSuccess,
  onClose,
  transactionRef: existingTransactionRef,
  initialFormData,
  initialStage,
}: UseDynamicTransactionProps): UseDynamicTransactionReturn => {
  // User permissions for stage filtering
  const { isSuperUser, getAccessibleStages, loading: permissionsLoading } = useUserPermissions();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Workflow configuration
  const [template, setTemplate] = useState<WorkflowTemplateRuntime | null>(null);
  const [stages, setStages] = useState<WorkflowStageRuntime[]>([]);
  const [stageFields, setStageFields] = useState<Map<string, WorkflowStageFieldRuntime[]>>(new Map());
  const [panes, setPanes] = useState<PaneConfig[]>([]);
  const [stagePaneMapping, setStagePaneMapping] = useState<StagePaneInfo[]>([]);

  // Navigation state
  const [currentPaneIndex, setCurrentPaneIndex] = useState(0);
  const [completedPanes, setCompletedPanes] = useState<Set<string>>(new Set());
  
  // Transaction completion state
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);
  const [completedStageName, setCompletedStageName] = useState<string>('');

  // Form state - initialize with mapped initialFormData if continuing an existing transaction
  // Extract repeatableGroups from initialFormData if present (stored alongside formData in database)
  const extractedRepeatableGroups = initialFormData?.repeatableGroups || {};
  const extractedFormData = initialFormData?.repeatableGroups 
    ? { ...initialFormData, repeatableGroups: undefined } 
    : initialFormData || {};
  
  const [formData, setFormData] = useState<DynamicFormData>(
    initialFormData ? applyFieldMappings(extractedFormData) : {}
  );
  const [repeatableGroups, setRepeatableGroups] = useState<{ [groupId: string]: RepeatableGroupInstance[] }>(
    extractedRepeatableGroups
  );
  
  // Transaction reference for tracking across stages
  const transactionRefRef = useRef<string | null>(existingTransactionRef || null);

  // Reset transaction reference when hook re-initializes (only if no existing ref provided)
  useEffect(() => {
    if (!existingTransactionRef) {
      transactionRefRef.current = null;
    } else {
      transactionRefRef.current = existingTransactionRef;
    }
  }, [productCode, eventCode, triggerType, existingTransactionRef]);

  // Product/Event display names from product_event_mapping
  const [productName, setProductName] = useState<string>(defaultProductNames[productCode] || productCode);
  const [eventName, setEventName] = useState<string>(defaultEventNames[productCode]?.[eventCode] || eventCode);

  // Fetch workflow configuration
  useEffect(() => {
    const fetchConfig = async () => {
      // Wait for permissions to load before proceeding
      if (permissionsLoading) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch product/event names from product_event_mapping based on business app
        if (businessApp) {
          const mappings = await fetchProductEventMappings(businessApp);
          const fetchedProductName = getProductNameByCode(mappings, productCode);
          const fetchedEventName = getEventNameByCode(mappings, productCode, eventCode);
          
          if (fetchedProductName) setProductName(fetchedProductName);
          if (fetchedEventName) setEventName(fetchedEventName);
        }

        // Find matching workflow template
        const foundTemplate = await findWorkflowTemplate(productCode, eventCode, triggerType);
        setTemplate(foundTemplate);

        // Get user's accessible stages for this product-event
        // Empty array from getAccessibleStages means super user (has access to all)
        const accessibleStages = getAccessibleStages(productCode, eventCode);
        const isSuper = isSuperUser();

        // Get pane names from workflow template stages
        let allowedPaneNames: string[] | undefined;
        let allowedSections: Map<string, string[]> | undefined;
        
        if (foundTemplate) {
          // Fetch all stages first
          const templateStages = await getTemplateStages(foundTemplate.id);
          
          // Filter stages based on user permissions (super users see all)
          // accessibleStages contains actor_types like 'Maker', 'Checker' - not stage_names
          const filteredStages = isSuper || accessibleStages.length === 0
            ? templateStages
            : templateStages.filter(stage => 
                accessibleStages.includes(stage.actor_type) || accessibleStages.includes('__ALL__')
              );
          
          setStages(filteredStages);

          // Fetch fields only for accessible stages
          const fieldsMap = new Map<string, WorkflowStageFieldRuntime[]>();
          await Promise.all(
            filteredStages.map(async (stage) => {
              const fields = await getStageFields(stage.id);
              fieldsMap.set(stage.id, fields);
            })
          );
          setStageFields(fieldsMap);

          // Extract pane names and stage-pane mapping (filtered by accessible stages)
          const stageNamesFilter = isSuper ? undefined : accessibleStages;
          allowedPaneNames = await getTemplatePaneNames(foundTemplate.id, stageNamesFilter);
          const mapping = await getStagePaneMapping(foundTemplate.id, stageNamesFilter);
          setStagePaneMapping(mapping);
          
          // Build per-pane-index section mapping from stagePaneMapping (stage-specific sections)
          allowedSections = new Map<string, string[]>();
          mapping.forEach((paneInfo, index) => {
            // Use index as key to ensure each pane occurrence gets its own section filter
            allowedSections!.set(`${index}`, paneInfo.allowedSections);
          });
        }

        // Fetch pane/section configuration, filtered and ordered by workflow template panes and sections
        const paneConfig = await getPaneSectionConfig(
          productCode,
          eventCode,
          businessApp,
          customerSegment,
          allowedPaneNames,
          allowedSections
        );

        // Add default buttons to panes if not configured
        const panesWithButtons = paneConfig.map((pane, index) => ({
          ...pane,
          buttons: pane.buttons?.length > 0 
            ? pane.buttons 
            : getDefaultButtons(index === 0, index === paneConfig.length - 1),
        }));

        setPanes(panesWithButtons);
      } catch (err: any) {
        setError(err.message || 'Failed to load form configuration');
        console.error('Error loading dynamic form config:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productCode && eventCode && triggerType) {
      fetchConfig();
    }
  }, [productCode, eventCode, triggerType, businessApp, customerSegment, permissionsLoading, isSuperUser, getAccessibleStages]);

  // Navigate to initial stage when provided (for continuing existing transactions)
  useEffect(() => {
    if (!loading && initialStage && stagePaneMapping.length > 0) {
      // Find the first pane of the initial stage
      const targetPaneIndex = stagePaneMapping.findIndex(
        mapping => mapping.stageName.toLowerCase() === initialStage.toLowerCase()
      );
      if (targetPaneIndex >= 0 && targetPaneIndex !== currentPaneIndex) {
        console.log(`Navigating to initial stage: ${initialStage}, pane index: ${targetPaneIndex}`);
        setCurrentPaneIndex(targetPaneIndex);
        // Mark all previous panes as completed
        const completedPaneIds = new Set<string>();
        for (let i = 0; i < targetPaneIndex; i++) {
          if (panes[i]) {
            completedPaneIds.add(panes[i].id);
          }
        }
        setCompletedPanes(completedPaneIds);
      }
    }
  }, [loading, initialStage, stagePaneMapping, panes]);

  // Get current stage name based on current pane index
  const getCurrentStageName = useCallback((): string => {
    if (stagePaneMapping.length === 0) return 'Data Entry';
    const currentMapping = stagePaneMapping[currentPaneIndex];
    return currentMapping?.stageName || 'Data Entry';
  }, [stagePaneMapping, currentPaneIndex]);

  // Check if current pane is the last pane of its stage
  const isLastPaneOfCurrentStage = useCallback((): boolean => {
    if (stagePaneMapping.length === 0) return currentPaneIndex === panes.length - 1;
    const currentMapping = stagePaneMapping[currentPaneIndex];
    return currentMapping?.isLastPaneOfStage || false;
  }, [stagePaneMapping, currentPaneIndex, panes.length]);

  // Check if current stage is the final stage
  const isFinalStage = useCallback((): boolean => {
    if (stagePaneMapping.length === 0) return currentPaneIndex === panes.length - 1;
    const currentMapping = stagePaneMapping[currentPaneIndex];
    return currentMapping?.isFinalStage || false;
  }, [stagePaneMapping, currentPaneIndex, panes.length]);

  // Navigation
  const navigateToPane = useCallback((direction: 'next' | 'previous' | 'pane', targetPaneId?: string) => {
    if (direction === 'next' && currentPaneIndex < panes.length - 1) {
      // Mark current pane as completed
      const currentPane = panes[currentPaneIndex];
      if (currentPane) {
        setCompletedPanes(prev => new Set([...prev, currentPane.id]));
      }
      setCurrentPaneIndex(prev => prev + 1);
    } else if (direction === 'previous' && currentPaneIndex > 0) {
      setCurrentPaneIndex(prev => prev - 1);
    } else if (direction === 'pane' && targetPaneId) {
      const targetIndex = panes.findIndex(p => p.id === targetPaneId);
      if (targetIndex >= 0) {
        setCurrentPaneIndex(targetIndex);
      }
    }
  }, [currentPaneIndex, panes]);

  // Generate transaction reference: ProductCode-EventCode-LCNumber
  const generateTransactionRef = useCallback(() => {
    const prefix = productCode.toUpperCase();
    const event = eventCode.toUpperCase();
    
    // Get LC number from form data - check both with spaces (from field_repository) and without
    const lcNumber = formData['LC Number'] || formData['LC  Number'] || 
                     formData.lc_number || formData.lcNumber || 
                     formData['LC Reference'] || formData.lc_reference || formData.lcReference ||
                     formData['Corporate Reference'] || formData['Corporate  Reference'] ||
                     formData.corporate_reference || formData.corporateReference ||
                     formData.lc_no || formData.lcNo || '';
    
    const lcRef = typeof lcNumber === 'string' && lcNumber.trim() ? lcNumber.trim() : `${Date.now()}`;
    
    return `${prefix}-${event}-${lcRef}`;
  }, [productCode, eventCode, formData]);

  // Handle stage submit - navigates to next stage or completes transaction
  const handleStageSubmit = useCallback(async () => {
    try {
      // Mark current pane as completed
      const currentPane = panes[currentPaneIndex];
      if (currentPane) {
        setCompletedPanes(prev => new Set([...prev, currentPane.id]));
      }
      
      const currentStageName = getCurrentStageName();
      const isApprovalStage = currentStageName.toLowerCase().includes('approval');
      const isFinalApproval = isApprovalStage && isFinalStage() && isLastPaneOfCurrentStage();
      const hasMorePanes = currentPaneIndex < panes.length - 1;
      
      // Determine channel name for status embedding
      // Use triggerType (workflow template) to determine the channel - NOT business app
      // This ensures Bank-side workflows (Manual) always get "Product Processor"
      // and Portal-side workflows (ClientPortal) always get "Portal"
      let channelName: string;
      if (triggerType === 'Manual') {
        // Bank-side workflow - stages are processed by Product Processor
        channelName = 'Product Processor';
      } else if (triggerType === 'ClientPortal') {
        // Portal workflow - stages are processed by Portal
        channelName = 'Portal';
      } else {
        // Fallback for other trigger types
        channelName = 'Portal';
      }
      
      // Get appropriate status based on stage - now includes channel
      const status = getStatusFromStage(currentStageName, isFinalApproval, channelName);
      
      // Generate transaction reference if not already created
      if (!transactionRefRef.current) {
        transactionRefRef.current = generateTransactionRef();
      }
      
      // Create/update transaction record with stage-appropriate status
      // Merge initialFormData with current formData to preserve all stage data
      // Include repeatableGroups in form_data for cross-stage persistence
      const mergedFormData = initialFormData 
        ? { ...initialFormData, ...formData, repeatableGroups }
        : { ...formData, repeatableGroups };
      
      await createTransactionRecord(
        productCode,
        mergedFormData,
        transactionRefRef.current,
        eventCode === 'ISS' ? 'Issuance' : eventCode,
        businessApp,
        status
      );
      
      if (isFinalApproval) {
        // Final stage - mark transaction as complete
        const allPaneIds = new Set(panes.map(p => p.id));
        setCompletedPanes(allPaneIds);
        setCompletedStageName('Approval');
        setIsTransactionComplete(true);
        toast.success(`Transaction ${transactionRefRef.current} has been issued`);
      } else if (hasMorePanes) {
        // More panes to go - navigate to next pane
        setCurrentPaneIndex(prev => prev + 1);
        if (isLastPaneOfCurrentStage()) {
          toast.success(`${currentStageName} stage completed - Status: ${status}`);
        }
      } else {
        // No more panes but not final approval - stage submitted, waiting for next stage
        setCompletedStageName(currentStageName);
        setIsTransactionComplete(true);
        toast.success(`${currentStageName} submitted - Status: ${status}. Awaiting next stage processing.`);
      }
    } catch (err: any) {
      console.error('Error submitting stage:', err);
      toast.error('Failed to submit stage', { description: err.message });
    }
  }, [currentPaneIndex, panes, isFinalStage, isLastPaneOfCurrentStage, getCurrentStageName, productCode, eventCode, formData, businessApp, generateTransactionRef]);

  // Field changes
  const handleFieldChange = useCallback((fieldCode: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldCode]: value }));
  }, []);

  const handleRepeatableFieldChange = useCallback((
    groupId: string,
    instanceId: string,
    fieldCode: string,
    value: any
  ) => {
    setRepeatableGroups(prev => {
      const newGroups = { ...prev };
      const groupInstances = [...(newGroups[groupId] || [])];
      const instanceIndex = groupInstances.findIndex(i => i.instanceId === instanceId);

      if (instanceIndex >= 0) {
        groupInstances[instanceIndex] = {
          ...groupInstances[instanceIndex],
          data: {
            ...groupInstances[instanceIndex].data,
            [fieldCode]: value,
          },
        };
        newGroups[groupId] = groupInstances;
      }

      return newGroups;
    });
  }, []);

  const handleAddRepeatableInstance = useCallback((groupId: string) => {
    setRepeatableGroups(prev => {
      const newGroups = { ...prev };
      const groupInstances = [...(newGroups[groupId] || [])];
      groupInstances.push({
        instanceId: generateInstanceId(),
        data: {},
      });
      newGroups[groupId] = groupInstances;
      return newGroups;
    });
  }, []);

  const handleRemoveRepeatableInstance = useCallback((groupId: string, instanceId: string) => {
    setRepeatableGroups(prev => {
      const newGroups = { ...prev };
      newGroups[groupId] = (newGroups[groupId] || []).filter(i => i.instanceId !== instanceId);
      return newGroups;
    });
  }, []);

  // Save handlers
  const handleSave = useCallback(async (type: 'draft' | 'template') => {
    try {
      // TODO: Implement actual save logic
      toast.success(type === 'draft' ? 'Draft saved successfully' : 'Template saved successfully');
    } catch (err: any) {
      toast.error(`Failed to save ${type}`, { description: err.message });
    }
  }, [formData, repeatableGroups]);

  const handleSubmit = useCallback(async () => {
    try {
      // Mark all panes as completed
      const allPaneIds = new Set(panes.map(p => p.id));
      setCompletedPanes(allPaneIds);

      // Generate transaction reference if not already created
      if (!transactionRefRef.current) {
        transactionRefRef.current = generateTransactionRef();
      }

      const currentStageName = getCurrentStageName();
      const isApprovalStage = currentStageName.toLowerCase().includes('approval');
      const isFinalApproval = isApprovalStage && isFinalStage() && isLastPaneOfCurrentStage();
      
      // Determine channel name for status embedding (same logic as handleStageSubmit)
      // Use triggerType (workflow template) to determine the channel
      let channelNameForReject: string;
      if (triggerType === 'Manual') {
        channelNameForReject = 'Product Processor';
      } else if (triggerType === 'ClientPortal') {
        channelNameForReject = 'Portal';
      } else {
        channelNameForReject = 'Portal';
      }
      
      const finalStatus = getStatusFromStage(currentStageName, isFinalApproval, channelNameForReject);

      // Create transaction with correct status for current stage
      await createTransactionRecord(
        productCode,
        formData,
        transactionRefRef.current,
        eventCode === 'ISS' ? 'Issuance' : eventCode,
        businessApp,
        finalStatus
      );
      
      const formState: DynamicFormState = { formData, repeatableGroups };
      
      toast.success(`Transaction ${transactionRefRef.current} submitted successfully`);
      onSubmitSuccess?.(formState);
    } catch (err: any) {
      toast.error('Failed to submit form', { description: err.message });
    }
  }, [formData, repeatableGroups, panes, onSubmitSuccess, productCode, eventCode, businessApp, generateTransactionRef]);

  const handleDiscard = useCallback(() => {
    setFormData({});
    setRepeatableGroups({});
    setCurrentPaneIndex(0);
    setCompletedPanes(new Set());
    setIsTransactionComplete(false);
    transactionRefRef.current = null; // Reset transaction reference
    toast.info('Changes discarded');
  }, []);

  // Handle rejection - update transaction status to Rejected and close
  const handleReject = useCallback(async (reason: string) => {
    try {
      // Generate transaction reference if not already created
      if (!transactionRefRef.current) {
        transactionRefRef.current = generateTransactionRef();
      }

      // Merge form data with rejection reason
      const rejectionData = {
        ...initialFormData,
        ...formData,
        repeatableGroups,
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
      };

      // Create/update transaction with Rejected status
      await createTransactionRecord(
        productCode,
        rejectionData,
        transactionRefRef.current,
        eventCode === 'ISS' ? 'Issuance' : eventCode,
        businessApp,
        'Rejected'
      );

      // Update formData state with rejection_reason so completion screen shows correct message
      setFormData(prev => ({
        ...prev,
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
      }));

      toast.success(`Transaction ${transactionRefRef.current} has been rejected`);
      setCompletedStageName('Approval');
      setIsTransactionComplete(true);
    } catch (err: any) {
      console.error('Error rejecting transaction:', err);
      toast.error('Failed to reject transaction', { description: err.message });
    }
  }, [formData, repeatableGroups, initialFormData, productCode, eventCode, businessApp, generateTransactionRef]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Helpers
  const getCurrentPane = useCallback(() => {
    return panes[currentPaneIndex] || null;
  }, [panes, currentPaneIndex]);

  const getPaneButtons = useCallback(() => {
    const currentPane = getCurrentPane();
    if (!currentPane?.buttons?.length) {
      return getDefaultButtons(currentPaneIndex === 0, currentPaneIndex === panes.length - 1);
    }
    return currentPane.buttons;
  }, [getCurrentPane, currentPaneIndex, panes.length]);

  // Get allowed field names and editability for current stage from workflow_stage_fields
  const { currentStageAllowedFields, currentStageFieldEditability } = (() => {
    if (stagePaneMapping.length === 0) return { currentStageAllowedFields: [], currentStageFieldEditability: new Map<string, boolean>() };
    const currentMapping = stagePaneMapping[currentPaneIndex];
    if (!currentMapping) return { currentStageAllowedFields: [], currentStageFieldEditability: new Map<string, boolean>() };
    
    const stageId = currentMapping.stageId;
    const stageFieldsList = stageFields.get(stageId) || [];
    
    // Build field names array and editability map
    const fieldNames = stageFieldsList.map(f => f.field_name);
    const editabilityMap = new Map<string, boolean>();
    stageFieldsList.forEach(f => {
      editabilityMap.set(f.field_name, f.is_editable !== false); // Default to true if undefined
    });
    
    return { currentStageAllowedFields: fieldNames, currentStageFieldEditability: editabilityMap };
  })();

  return {
    loading,
    error,
    template,
    stages,
    panes,
    currentPaneIndex,
    completedPanes,
    formData,
    repeatableGroups,
    stageFields,
    stagePaneMapping,
    productName,
    eventName,
    hasWorkflowTemplate: !!template,
    isTransactionComplete,
    completedStageName,
    currentStageAllowedFields,
    currentStageFieldEditability,
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
  };
};

export default useDynamicTransaction;