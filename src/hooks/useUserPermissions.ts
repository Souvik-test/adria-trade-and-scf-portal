import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';

interface ProductPermission {
  product_code: string;
  event_code: string;
  stage_name: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_approve: boolean;
}

interface ScreenPermission {
  category: string;
  screen_name: string;
  can_access: boolean;
}

interface UserPermissions {
  is_super_user: boolean;
  product_permissions: ProductPermission[];
  screen_permissions: ScreenPermission[];
}

// Product code to product card mapping
const PRODUCT_CODE_TO_CARD: Record<string, string> = {
  'ILC': 'lc',
  'ELC': 'lc',
  'OBG': 'bank-guarantee',
  'IBG': 'bank-guarantee',
  'ILB': 'bills',
  'ELB': 'bills',
  'ODC': 'documentary-collection',
  'IDC': 'documentary-collection',
  'SHG': 'shipping-guarantee',
  'TRL': 'remittance',
  'REM': 'remittance',
  'OSB': 'bills',
  'ISB': 'bills',
};

// Product code to flip option mapping
const PRODUCT_CODE_TO_FLIP_OPTION: Record<string, string> = {
  'ILC': 'Import LC',
  'ELC': 'Export LC',
  'OBG': 'Outward BG',
  'IBG': 'Inward BG',
  'ILB': 'Import Bills',
  'ELB': 'Export Bills',
  'ODC': 'Outward DC',
  'IDC': 'Inward DC',
};

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const session = customAuth.getSession();
      
      if (!session?.user?.id) {
        setPermissions({
          is_super_user: false,
          product_permissions: [],
          screen_permissions: []
        });
        return;
      }

      const { data, error: rpcError } = await supabase.rpc('get_all_user_permissions', {
        p_user_id: session.user.id
      });

      if (rpcError) {
        console.error('Error loading permissions:', rpcError);
        setError(rpcError.message);
        return;
      }

      setPermissions(data as unknown as UserPermissions);
    } catch (err) {
      console.error('Error loading permissions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const isSuperUser = useCallback(() => {
    return permissions?.is_super_user ?? false;
  }, [permissions]);

  const hasProductAccess = useCallback((productCode: string, eventCode?: string) => {
    if (!permissions) return false;
    if (permissions.is_super_user) return true;

    return permissions.product_permissions.some(p => {
      const matchesProduct = p.product_code === productCode;
      const matchesEvent = eventCode ? p.event_code === eventCode : true;
      const hasAnyPermission = p.can_view || p.can_create || p.can_edit || p.can_approve;
      return matchesProduct && matchesEvent && hasAnyPermission;
    });
  }, [permissions]);

  const hasScreenAccess = useCallback((screenName: string) => {
    if (!permissions) return false;
    if (permissions.is_super_user) return true;

    const screenPermission = permissions.screen_permissions.find(
      p => p.screen_name === screenName
    );
    return screenPermission?.can_access ?? false;
  }, [permissions]);

  const hasCategoryAccess = useCallback((category: string) => {
    if (!permissions) return false;
    if (permissions.is_super_user) return true;

    return permissions.screen_permissions.some(
      p => p.category === category && p.can_access
    );
  }, [permissions]);

  const hasAnyProductCardAccess = useCallback((cardId: string) => {
    if (!permissions) return false;
    if (permissions.is_super_user) return true;

    // Find all product codes that map to this card
    const relevantProductCodes = Object.entries(PRODUCT_CODE_TO_CARD)
      .filter(([_, card]) => card === cardId)
      .map(([code]) => code);

    // Check if user has access to any of these products
    return relevantProductCodes.some(productCode => hasProductAccess(productCode));
  }, [permissions, hasProductAccess]);

  const getAccessibleFlipOptions = useCallback((cardId: string) => {
    if (!permissions) return [];
    if (permissions.is_super_user) return null; // null means all options

    // Find all product codes that map to this card
    const relevantProductCodes = Object.entries(PRODUCT_CODE_TO_CARD)
      .filter(([_, card]) => card === cardId)
      .map(([code]) => code);

    // Get accessible flip option labels
    return relevantProductCodes
      .filter(productCode => hasProductAccess(productCode))
      .map(productCode => PRODUCT_CODE_TO_FLIP_OPTION[productCode])
      .filter(Boolean);
  }, [permissions, hasProductAccess]);

  // Check if user has access to a specific stage for a product-event
  const hasStageAccess = useCallback((productCode: string, eventCode: string, stageName: string) => {
    if (!permissions) return false;
    if (permissions.is_super_user) return true;

    return permissions.product_permissions.some(p => {
      const matchesProduct = p.product_code === productCode;
      const matchesEvent = p.event_code === eventCode;
      const matchesStage = p.stage_name === stageName || p.stage_name === '__ALL__';
      const hasAnyPermission = p.can_view || p.can_create || p.can_edit || p.can_approve;
      return matchesProduct && matchesEvent && matchesStage && hasAnyPermission;
    });
  }, [permissions]);

  // Get list of accessible stage names for a product-event
  const getAccessibleStages = useCallback((productCode: string, eventCode: string): string[] => {
    if (!permissions) return [];
    if (permissions.is_super_user) return []; // Empty array signals "all stages" for super user

    const accessibleStages = new Set<string>();
    
    permissions.product_permissions.forEach(p => {
      const matchesProduct = p.product_code === productCode;
      const matchesEvent = p.event_code === eventCode;
      const hasAnyPermission = p.can_view || p.can_create || p.can_edit || p.can_approve;
      
      if (matchesProduct && matchesEvent && hasAnyPermission) {
        accessibleStages.add(p.stage_name);
      }
    });

    return Array.from(accessibleStages);
  }, [permissions]);

  return {
    permissions,
    loading,
    error,
    isSuperUser,
    hasProductAccess,
    hasScreenAccess,
    hasCategoryAccess,
    hasAnyProductCardAccess,
    getAccessibleFlipOptions,
    hasStageAccess,
    getAccessibleStages,
    refreshPermissions: loadPermissions,
  };
};
