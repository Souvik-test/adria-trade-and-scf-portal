import { useState, useCallback, useEffect } from 'react';
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
} from '@/services/workflowTemplateService';
import { getPaneSectionConfig, getDefaultButtons } from '@/services/paneSectionService';
import { 
  fetchProductEventMappings, 
  getProductNameByCode, 
  getEventNameByCode,
  defaultProductNames,
  defaultEventNames 
} from '@/services/productEventMappingService';

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
  currentStage: WorkflowStageRuntime | null;
  panes: PaneConfig[];
  currentPaneIndex: number;
  completedPanes: Set<string>;
  formData: DynamicFormData;
  repeatableGroups: { [groupId: string]: RepeatableGroupInstance[] };
  stageFields: Map<string, WorkflowStageFieldRuntime[]>;
  
  // Product/Event display info from product_event_mapping
  productName: string;
  eventName: string;
  
  // Template found status
  hasWorkflowTemplate: boolean;
  
  // Actions
  navigateToPane: (direction: 'next' | 'previous' | 'pane', targetPaneId?: string) => void;
  handleFieldChange: (fieldCode: string, value: any) => void;
  handleRepeatableFieldChange: (groupId: string, instanceId: string, fieldCode: string, value: any) => void;
  handleAddRepeatableInstance: (groupId: string) => void;
  handleRemoveRepeatableInstance: (groupId: string, instanceId: string) => void;
  handleSave: (type: 'draft' | 'template') => Promise<void>;
  handleSubmit: () => Promise<void>;
  handleDiscard: () => void;
  handleClose: () => void;
  
  // Helpers
  getCurrentPane: () => PaneConfig | null;
  getPaneButtons: () => PaneConfig['buttons'];
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
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Workflow configuration
  const [template, setTemplate] = useState<WorkflowTemplateRuntime | null>(null);
  const [stages, setStages] = useState<WorkflowStageRuntime[]>([]);
  const [stageFields, setStageFields] = useState<Map<string, WorkflowStageFieldRuntime[]>>(new Map());
  const [panes, setPanes] = useState<PaneConfig[]>([]);

  // Navigation state
  const [currentPaneIndex, setCurrentPaneIndex] = useState(0);
  const [completedPanes, setCompletedPanes] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState<DynamicFormData>({});
  const [repeatableGroups, setRepeatableGroups] = useState<{ [groupId: string]: RepeatableGroupInstance[] }>({});

  // Product/Event display names from product_event_mapping
  const [productName, setProductName] = useState<string>(defaultProductNames[productCode] || productCode);
  const [eventName, setEventName] = useState<string>(defaultEventNames[productCode]?.[eventCode] || eventCode);

  // Fetch workflow configuration
  useEffect(() => {
    const fetchConfig = async () => {
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

        // Get pane names from workflow template stages
        let allowedPaneNames: string[] | undefined;
        
        if (foundTemplate) {
          // Fetch stages
          const templateStages = await getTemplateStages(foundTemplate.id);
          setStages(templateStages);

          // Fetch fields for all stages
          const fieldsMap = new Map<string, WorkflowStageFieldRuntime[]>();
          await Promise.all(
            templateStages.map(async (stage) => {
              const fields = await getStageFields(stage.id);
              fieldsMap.set(stage.id, fields);
            })
          );
          setStageFields(fieldsMap);

          // Extract unique pane names from stage fields for filtering
          allowedPaneNames = await getTemplatePaneNames(foundTemplate.id);
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
  }, [productCode, eventCode, triggerType, businessApp, customerSegment]);

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

      // TODO: Implement actual submit logic
      const formState: DynamicFormState = { formData, repeatableGroups };
      
      toast.success('Form submitted successfully');
      onSubmitSuccess?.(formState);
    } catch (err: any) {
      toast.error('Failed to submit form', { description: err.message });
    }
  }, [formData, repeatableGroups, panes, onSubmitSuccess]);

  const handleDiscard = useCallback(() => {
    setFormData({});
    setRepeatableGroups({});
    setCurrentPaneIndex(0);
    setCompletedPanes(new Set());
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
    currentStage: stages.length > 0 ? stages[0] : null,
    panes,
    currentPaneIndex,
    completedPanes,
    formData,
    repeatableGroups,
    stageFields,
    productName,
    eventName,
    hasWorkflowTemplate: !!template,
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
  };
};

export default useDynamicTransaction;
