import { useState, useCallback } from 'react';
import { validateTransaction, ValidationResult, ValidationPayload } from '@/services/businessValidationService';
import { customAuth } from '@/services/customAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UseBusinessValidationReturn {
  validationResult: ValidationResult | null;
  isValidating: boolean;
  runValidation: (productCode: string, eventCode: string, transactionData: Record<string, any>) => Promise<ValidationResult>;
  clearValidation: () => void;
}

/**
 * Hook for running business validation rules on form data
 */
export function useBusinessValidation(): UseBusinessValidationReturn {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const getEffectiveUserId = async (): Promise<string | null> => {
    // Check custom auth first
    const customSession = customAuth.getSession();
    if (customSession?.user?.id) {
      return customSession.user.id;
    }
    
    // Fall back to Supabase auth
    const { data } = await supabase.auth.getUser();
    if (data?.user?.id) {
      // Get the custom_users ID if available
      const { data: userData } = await supabase
        .from('custom_users')
        .select('id')
        .eq('user_id', data.user.id)
        .single();
      
      if (userData?.id) {
        return userData.id;
      }
      return data.user.id;
    }
    
    return null;
  };

  const runValidation = useCallback(async (
    productCode: string,
    eventCode: string,
    transactionData: Record<string, any>
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    
    const emptyResult: ValidationResult = {
      errors: [],
      warnings: [],
      information: [],
      hasErrors: false,
      hasWarnings: false,
      canProceed: true,
    };

    try {
      const userId = await getEffectiveUserId();
      console.log('[Validation] Effective user ID for validation:', userId);
      if (!userId) {
        console.warn('No user ID available for validation');
        setValidationResult(emptyResult);
        return emptyResult;
      }

      const payload: ValidationPayload = {
        product_code: productCode,
        event_code: eventCode,
        transactionData,
      };

      const result = await validateTransaction(userId, payload);
      setValidationResult(result);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult(emptyResult);
      return emptyResult;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validationResult,
    isValidating,
    runValidation,
    clearValidation,
  };
}

export default useBusinessValidation;
