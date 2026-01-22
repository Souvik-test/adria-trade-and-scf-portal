import { supabase } from '@/integrations/supabase/client';

export interface ValidationPayload {
  product_code: string;
  event_code: string;
  transactionData: Record<string, any>;
}

export interface ValidationResultItem {
  rule_id: string;
  message: string;
  field_codes: string[];
  pane_codes: string[];
  priority: number;
}

export interface ValidationResult {
  errors: ValidationResultItem[];
  warnings: ValidationResultItem[];
  information: ValidationResultItem[];
  hasErrors: boolean;
  hasWarnings: boolean;
  canProceed: boolean;
}

interface ValidationCondition {
  pane_code?: string;
  field_code: string;
  operator: string;
  compare_value: string;
  compare_source: 'CONSTANT' | 'FIELD';
  join_type: 'AND' | 'OR' | null;
  sequence: number;
}

interface ValidationRule {
  id: string;
  rule_id: string;
  validation_type: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  priority: number;
  conditions: ValidationCondition[];
}

/**
 * Normalizes a field code for consistent matching
 * Handles variations like "LC  Number" vs "LC Number"
 */
export function normalizeFieldCode(code: string): string {
  return (code || '')
    .trim()
    .replace(/\s+/g, ' '); // Collapse multiple spaces to single space
}

/**
 * Gets a value from transactionData, trying both exact match and normalized match
 */
function getFieldValue(fieldCode: string, transactionData: Record<string, any>): any {
  // Try exact match first
  if (fieldCode in transactionData) {
    return transactionData[fieldCode];
  }
  
  // Try normalized match
  const normalizedTarget = normalizeFieldCode(fieldCode).toLowerCase();
  for (const key of Object.keys(transactionData)) {
    if (normalizeFieldCode(key).toLowerCase() === normalizedTarget) {
      return transactionData[key];
    }
  }
  
  return undefined;
}

/**
 * Evaluates a single condition against transaction data
 */
function evaluateCondition(
  condition: ValidationCondition,
  transactionData: Record<string, any>
): boolean {
  const fieldValue = getFieldValue(condition.field_code, transactionData);
  
  let compareValue: any;
  if (condition.compare_source === 'FIELD') {
    // Get value from another field for comparison
    compareValue = getFieldValue(condition.compare_value, transactionData);
  } else {
    compareValue = condition.compare_value;
  }
  
  // Convert to strings for comparison, handle null/undefined
  const strFieldValue = String(fieldValue ?? '').trim();
  const strCompareValue = String(compareValue ?? '').trim();
  
  // Type coercion for numeric comparison
  const numFieldValue = parseFloat(strFieldValue);
  const numCompareValue = parseFloat(strCompareValue);
  const useNumericComparison = !isNaN(numFieldValue) && !isNaN(numCompareValue) && 
                                strFieldValue !== '' && strCompareValue !== '';
  
  console.log(`[Validation] Field: ${condition.field_code} = "${strFieldValue}", Operator: ${condition.operator}, Compare: "${strCompareValue}" (source: ${condition.compare_source})`);
  
  switch (condition.operator) {
    case '=':
      return useNumericComparison 
        ? numFieldValue === numCompareValue 
        : strFieldValue.toLowerCase() === strCompareValue.toLowerCase();
    
    case '<>':
      return useNumericComparison 
        ? numFieldValue !== numCompareValue 
        : strFieldValue.toLowerCase() !== strCompareValue.toLowerCase();
    
    case '<':
      if (useNumericComparison) return numFieldValue < numCompareValue;
      return strFieldValue.toLowerCase() < strCompareValue.toLowerCase();
    
    case '>':
      if (useNumericComparison) return numFieldValue > numCompareValue;
      return strFieldValue.toLowerCase() > strCompareValue.toLowerCase();
    
    case '<=':
      if (useNumericComparison) return numFieldValue <= numCompareValue;
      return strFieldValue.toLowerCase() <= strCompareValue.toLowerCase();
    
    case '>=':
      if (useNumericComparison) return numFieldValue >= numCompareValue;
      return strFieldValue.toLowerCase() >= strCompareValue.toLowerCase();
    
    case 'IN': {
      const values = strCompareValue.split(',').map(v => v.trim().toLowerCase());
      return values.includes(strFieldValue.toLowerCase());
    }
    
    case 'NOT IN': {
      const values = strCompareValue.split(',').map(v => v.trim().toLowerCase());
      return !values.includes(strFieldValue.toLowerCase());
    }
    
    case 'CONTAINS':
      // Check if field value contains the compare value (case-insensitive)
      return strFieldValue.toLowerCase().includes(strCompareValue.toLowerCase());
    
    case 'NOT CONTAINS':
      // Check if field value does NOT contain the compare value (case-insensitive)
      return !strFieldValue.toLowerCase().includes(strCompareValue.toLowerCase());
    
    case 'IS NULL':
      return fieldValue === null || fieldValue === undefined || strFieldValue === '';
    
    case 'IS NOT NULL':
      return fieldValue !== null && fieldValue !== undefined && strFieldValue !== '';
    
    default:
      console.warn(`Unknown operator: ${condition.operator}`);
      return false;
  }
}

/**
 * Evaluates all conditions for a rule using AND/OR logic
 * Rules without conditions always trigger (unconditional rules)
 */
function evaluateRule(
  rule: ValidationRule,
  transactionData: Record<string, any>
): boolean {
  // Rules without conditions always trigger (unconditional messages)
  if (!rule.conditions || rule.conditions.length === 0) {
    return true;
  }
  
  // Sort conditions by sequence
  const sortedConditions = [...rule.conditions].sort((a, b) => a.sequence - b.sequence);
  
  let result = evaluateCondition(sortedConditions[0], transactionData);
  
  for (let i = 1; i < sortedConditions.length; i++) {
    const condition = sortedConditions[i];
    const conditionResult = evaluateCondition(condition, transactionData);
    
    if (condition.join_type === 'AND') {
      result = result && conditionResult;
    } else if (condition.join_type === 'OR') {
      result = result || conditionResult;
    }
  }
  
  return result;
}

/**
 * Validates transaction data against all active rules for the given product/event
 */
export async function validateTransaction(
  userId: string,
  payload: ValidationPayload
): Promise<ValidationResult> {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    information: [],
    hasErrors: false,
    hasWarnings: false,
    canProceed: true,
  };
  
  try {
    // Fetch active rules for this product/event
    const { data: rulesData, error } = await supabase.rpc('get_validation_rules_with_conditions', {
      p_user_id: userId,
    });
    
    if (error) {
      console.error('Error fetching validation rules:', error);
      return result;
    }
    
    // Filter rules for this product/event and active ones
    const applicableRules = ((rulesData || []) as unknown as ValidationRule[]).filter(
      (rule: any) =>
        rule.product_code === payload.product_code &&
        rule.event_code === payload.event_code &&
        rule.active_flag === true
    );
    
    // Sort by priority
    applicableRules.sort((a: any, b: any) => a.priority - b.priority);
    
    // Evaluate each rule
    for (const rule of applicableRules) {
      const triggered = evaluateRule(rule, payload.transactionData);
      
      if (triggered) {
        // Extract field codes and pane codes from conditions
        const fieldCodes = (rule.conditions || []).map((c: ValidationCondition) => c.field_code).filter(Boolean);
        const paneCodes = [...new Set((rule.conditions || []).map((c: ValidationCondition) => c.pane_code).filter(Boolean))];
        
        const resultItem: ValidationResultItem = {
          rule_id: rule.rule_id,
          message: rule.message,
          field_codes: fieldCodes,
          pane_codes: paneCodes as string[],
          priority: rule.priority,
        };
        
        switch (rule.validation_type) {
          case 'ERROR':
            result.errors.push(resultItem);
            result.hasErrors = true;
            result.canProceed = false;
            break;
          case 'WARNING':
            result.warnings.push(resultItem);
            result.hasWarnings = true;
            break;
          case 'INFO':
            result.information.push(resultItem);
            break;
        }
      }
    }
  } catch (err) {
    console.error('Error during validation:', err);
  }
  
  return result;
}

/**
 * Logs validation execution for audit purposes
 */
export async function logValidationExecution(
  userId: string,
  txnId: string,
  ruleId: string,
  validationType: string,
  message: string,
  overridden: boolean = false,
  overriddenBy?: string
): Promise<void> {
  try {
    const logId = `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await supabase.from('validation_execution_log').insert({
      log_id: logId,
      txn_id: txnId,
      rule_id: ruleId,
      validation_type: validationType,
      message: message,
      overridden_flag: overridden,
      overridden_by: overriddenBy || null,
      overridden_at: overridden ? new Date().toISOString() : null,
    });
  } catch (err) {
    console.error('Error logging validation execution:', err);
  }
}
