// Static UI Registry Service - Database operations for static pane registry
import { supabase } from '@/integrations/supabase/client';

export interface StaticUIRegistryEntry {
  id: string;
  module_code: string;
  module_name: string;
  product_code: string;
  product_name: string;
  event_code: string | null;
  event_name: string | null;
  pane_code: string;
  pane_name: string;
  component_path: string;
  pane_order: number;
  is_active: boolean;
  applicable_stages: string[];
  applicable_actor_types: string[];
  read_only_for_stages: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all registry entries for a specific product and optional event
 */
export const fetchStaticUIRegistry = async (
  productCode: string,
  eventCode?: string
): Promise<{ success: boolean; data?: StaticUIRegistryEntry[]; error?: string }> => {
  try {
    let query = supabase
      .from('static_ui_registry')
      .select('*')
      .eq('product_code', productCode)
      .eq('is_active', true)
      .order('pane_order', { ascending: true });

    if (eventCode) {
      query = query.eq('event_code', eventCode);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { 
      success: true, 
      data: data as unknown as StaticUIRegistryEntry[] 
    };
  } catch (error: any) {
    console.error('Error fetching static UI registry:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get available panes for a specific product, optionally filtered by stage and actor type
 */
export const getAvailablePanesForProduct = async (
  productCode: string,
  stageName?: string,
  actorType?: string
): Promise<{ success: boolean; data?: StaticUIRegistryEntry[]; error?: string }> => {
  try {
    let query = supabase
      .from('static_ui_registry')
      .select('*')
      .eq('product_code', productCode)
      .eq('is_active', true)
      .order('pane_order', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    let filteredData = data as unknown as StaticUIRegistryEntry[];

    // Filter by applicable stage if provided
    if (stageName) {
      filteredData = filteredData.filter(entry => 
        entry.applicable_stages?.includes(stageName)
      );
    }

    // Filter by actor type if provided
    if (actorType) {
      filteredData = filteredData.filter(entry => 
        entry.applicable_actor_types?.includes(actorType)
      );
    }

    return { success: true, data: filteredData };
  } catch (error: any) {
    console.error('Error fetching available panes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all modules from the registry
 */
export const getAvailableModules = async (): Promise<{ 
  success: boolean; 
  data?: { module_code: string; module_name: string }[]; 
  error?: string 
}> => {
  try {
    const { data, error } = await supabase
      .from('static_ui_registry')
      .select('module_code, module_name')
      .eq('is_active', true);

    if (error) throw error;

    // Get unique modules
    const uniqueModules = Array.from(
      new Map(data?.map(item => [item.module_code, item]) || []).values()
    );

    return { success: true, data: uniqueModules };
  } catch (error: any) {
    console.error('Error fetching modules:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all products for a module
 */
export const getProductsForModule = async (moduleCode: string): Promise<{ 
  success: boolean; 
  data?: { product_code: string; product_name: string }[]; 
  error?: string 
}> => {
  try {
    const { data, error } = await supabase
      .from('static_ui_registry')
      .select('product_code, product_name')
      .eq('module_code', moduleCode)
      .eq('is_active', true);

    if (error) throw error;

    // Get unique products
    const uniqueProducts = Array.from(
      new Map(data?.map(item => [item.product_code, item]) || []).values()
    );

    return { success: true, data: uniqueProducts };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all events for a product
 */
export const getEventsForProduct = async (productCode: string): Promise<{ 
  success: boolean; 
  data?: { event_code: string; event_name: string }[]; 
  error?: string 
}> => {
  try {
    const { data, error } = await supabase
      .from('static_ui_registry')
      .select('event_code, event_name')
      .eq('product_code', productCode)
      .eq('is_active', true)
      .not('event_code', 'is', null);

    if (error) throw error;

    // Get unique events
    const uniqueEvents = Array.from(
      new Map(
        (data?.filter(item => item.event_code) || [])
          .map(item => [item.event_code, item])
      ).values()
    ) as { event_code: string; event_name: string }[];

    return { success: true, data: uniqueEvents };
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if pane should be read-only for a given stage
 */
export const isPaneReadOnlyForStage = (
  entry: StaticUIRegistryEntry,
  stageName: string
): boolean => {
  return entry.read_only_for_stages?.includes(stageName) || false;
};

/**
 * Add a new pane to the registry
 */
export const addStaticUIRegistryEntry = async (
  entry: Omit<StaticUIRegistryEntry, 'id' | 'created_at' | 'updated_at'> & { user_id: string }
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('static_ui_registry')
      .insert([entry])
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Error adding registry entry:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing pane in the registry
 */
export const updateStaticUIRegistryEntry = async (
  id: string,
  updates: Partial<StaticUIRegistryEntry>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('static_ui_registry')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating registry entry:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Deactivate a pane in the registry (soft delete)
 */
export const deactivateStaticUIRegistryEntry = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('static_ui_registry')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deactivating registry entry:', error);
    return { success: false, error: error.message };
  }
};
