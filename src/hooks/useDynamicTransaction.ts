import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  // Actions
  navigateToPane: (direction: 'next' | 'previous' | 'pane', targetPaneId?: string) => void;
  handleFieldChange: (fieldCode: string, value: any) => void;
  handleRepeatableFieldChange: (groupId: string, instanceId: string, fieldCode: string, value: any) => void;
  handleAddRepeatableInstance: (groupId: string) => void;
  handleRemoveRepeatableInstance: (groupId: string, instanceId: string) => void;
  handleSave: (type: 'draft' | 'template') => Promise<void>;
  handleStageSubmit: () => void;
  handleSubmit: () => Promise<void>;
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

export const useDynamicTransaction = ({
  productCode,
  eventCode,
  triggerType,
  businessApp,
  customerSegment,
  onSubmitSuccess,
  onClose,
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

  // Form state
  const [formData, setFormData] = useState<DynamicFormData>({});
  const [repeatableGroups, setRepeatableGroups] = useState<{ [groupId: string]: RepeatableGroupInstance[] }>({});
  
  // Transaction reference for tracking across stages
  const transactionRefRef = useRef<string | null>(null);

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
        
        if (foundTemplate) {
          // Fetch all stages first
          const templateStages = await getTemplateStages(foundTemplate.id);
          
          // Filter stages based on user permissions (super users see all)
          const filteredStages = isSuper || accessibleStages.length === 0
            ? templateStages
            : templateStages.filter(stage => 
                accessibleStages.includes(stage.stage_name) || 
                accessibleStages.includes('__ALL__')
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
        }

        // Fetch pane/section configuration, filtered and ordered by workflow template panes
        const paneConfig = await getPaneSectionConfig(
          productCode,
          eventCode,
          businessApp,
          customerSegment,
          allowedPaneNames
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

  // Generate transaction reference
  const generateTransactionRef = useCallback(() => {
    const prefix = productCode.toUpperCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }, [productCode]);

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
      
      // Get appropriate status based on stage
      const status = getStatusFromStage(currentStageName, isFinalApproval);
      
      // Generate transaction reference if not already created
      if (!transactionRefRef.current) {
        transactionRefRef.current = generateTransactionRef();
      }
      
      // Create/update transaction record with stage-appropriate status
      await createTransactionRecord(
        productCode,
        formData,
        transactionRefRef.current,
        eventCode === 'ISS' ? 'Issuance' : eventCode,
        businessApp,
        status
      );
      
      if (isFinalApproval) {
        // Final stage - mark transaction as complete
        const allPaneIds = new Set(panes.map(p => p.id));
        setCompletedPanes(allPaneIds);
        setIsTransactionComplete(true);
        toast.success(`Transaction ${transactionRefRef.current} has been issued`);
      } else if (isLastPaneOfCurrentStage()) {
        // Last pane of stage but not final - navigate to next pane (next stage's first pane)
        if (currentPaneIndex < panes.length - 1) {
          setCurrentPaneIndex(prev => prev + 1);
          toast.success(`${currentStageName} stage completed - Status: ${status}`);
        }
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
      const finalStatus = getStatusFromStage(currentStageName, isFinalApproval);

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
  };
};

export default useDynamicTransaction;