import { supabase } from '@/integrations/supabase/client';
import { PaneConfig, PaneButtonConfig, SectionConfig } from '@/types/dynamicForm';

interface PaneSectionMappingResponse {
  id: string;
  product_code: string;
  event_code: string;
  business_application: string[];
  customer_segment: string[];
  panes: any;
  is_active: boolean;
}

/**
 * Get pane/section/button configuration for a product-event combination
 */
export const getPaneSectionConfig = async (
  productCode: string,
  eventCode: string,
  businessApp?: string,
  customerSegment?: string,
  allowedPanes?: string[]
): Promise<PaneConfig[]> => {
  try {
    let query = supabase
      .from('pane_section_mappings')
      .select('*')
      .eq('product_code', productCode)
      .eq('event_code', eventCode)
      .eq('is_active', true);

    if (businessApp) {
      query = query.contains('business_application', [businessApp]);
    }

    if (customerSegment) {
      query = query.contains('customer_segment', [customerSegment]);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching pane/section config:', error);
      return [];
    }

    if (!data || !data.panes) {
      return [];
    }

    const mapping = data as PaneSectionMappingResponse;
    const panesConfig = parsePanesConfig(mapping.panes);

    // Build pane list based on allowedPanes order, allowing duplicates
    if (allowedPanes && allowedPanes.length > 0) {
      const result: PaneConfig[] = [];
      allowedPanes.forEach((paneName, index) => {
        const pane = panesConfig.find(p => p.name === paneName);
        if (pane) {
          // Clone pane with unique id for each occurrence
          result.push({ 
            ...pane, 
            id: `${pane.id}-${index}`,
            sections: pane.sections.map(s => ({ ...s, id: `${s.id}-${index}` })),
            buttons: pane.buttons?.map(b => ({ ...b, id: `${b.id}-${index}` })) || []
          });
        }
      });
      return result;
    }

    return panesConfig;
  } catch (err) {
    console.error('Exception fetching pane/section config:', err);
    return [];
  }
};

/**
 * Parse panes configuration from database format
 */
const parsePanesConfig = (panesData: any): PaneConfig[] => {
  if (!Array.isArray(panesData)) {
    return [];
  }

  return panesData.map((pane: any) => ({
    id: pane.id || `pane-${Date.now()}`,
    name: pane.name || '',
    sequence: pane.sequence || 1,
    sections: parseSectionsConfig(pane.sections),
    buttons: parseButtonsConfig(pane.buttons),
  }));
};

/**
 * Parse sections configuration
 */
const parseSectionsConfig = (sectionsData: any): SectionConfig[] => {
  if (!Array.isArray(sectionsData)) {
    return [];
  }

  return sectionsData.map((section: any) => ({
    id: section.id || `section-${Date.now()}`,
    name: section.name || '',
    sequence: section.sequence || 1,
    rows: section.rows || 1,
    columns: section.columns || 2,
  }));
};

/**
 * Parse buttons configuration
 */
const parseButtonsConfig = (buttonsData: any): PaneButtonConfig[] => {
  if (!Array.isArray(buttonsData)) {
    // Return default buttons if none configured
    return getDefaultButtons();
  }

  return buttonsData.map((button: any) => ({
    id: button.id || `btn-${Date.now()}`,
    label: button.label || 'Button',
    position: button.position || 'right',
    variant: button.variant || 'default',
    action: button.action || 'next_pane',
    targetPaneId: button.targetPaneId || null,
    isVisible: button.isVisible !== false,
    order: button.order || 1,
  }));
};

/**
 * Get default button configuration for a pane
 */
export const getDefaultButtons = (isFirstPane = false, isLastPane = false): PaneButtonConfig[] => {
  const buttons: PaneButtonConfig[] = [];

  if (!isFirstPane) {
    buttons.push({
      id: `btn-back-${Date.now()}`,
      label: 'Back',
      position: 'left',
      variant: 'outline',
      action: 'previous_pane',
      targetPaneId: null,
      isVisible: true,
      order: 1,
    });
  }

  buttons.push({
    id: `btn-discard-${Date.now()}`,
    label: 'Discard',
    position: 'left',
    variant: 'ghost',
    action: 'discard',
    targetPaneId: null,
    isVisible: true,
    order: 2,
  });

  buttons.push({
    id: `btn-save-${Date.now()}`,
    label: 'Save Draft',
    position: 'right',
    variant: 'secondary',
    action: 'save_draft',
    targetPaneId: null,
    isVisible: true,
    order: 1,
  });

  if (isLastPane) {
    buttons.push({
      id: `btn-submit-${Date.now()}`,
      label: 'Submit',
      position: 'right',
      variant: 'default',
      action: 'submit',
      targetPaneId: null,
      isVisible: true,
      order: 2,
    });
  } else {
    buttons.push({
      id: `btn-next-${Date.now()}`,
      label: 'Next',
      position: 'right',
      variant: 'default',
      action: 'next_pane',
      targetPaneId: null,
      isVisible: true,
      order: 2,
    });
  }

  return buttons;
};

/**
 * Create a new button configuration
 */
export const createButton = (
  label: string = 'New Button',
  position: 'left' | 'right' = 'right',
  action: PaneButtonConfig['action'] = 'custom'
): PaneButtonConfig => ({
  id: `btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  label,
  position,
  variant: 'outline',
  action,
  targetPaneId: null,
  isVisible: true,
  order: 1,
});

export default {
  getPaneSectionConfig,
  getDefaultButtons,
  createButton,
};
