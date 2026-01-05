// All database service methods now use Supabase Auth for user identification.
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from './customAuth';

// --- User/session and helper functions ---
const getCurrentUser = () => {
  // Try custom auth first
  const customSession = customAuth.getSession();
  if (customSession && customSession.user) {
    return { id: customSession.user.id, email: customSession.user.user_id };
  }

  // Fall back to Supabase Auth
  const user =
    supabase.auth.getUser &&
    typeof supabase.auth.getUser === 'function'
      ? (window as any).__supabaseUser ||
        (supabase.auth.getUser as any)()
      : null;

  if (user && user.id) return user;
  return null;
};

const getCurrentUserAsync = async () => {
  // Try custom auth first
  const customSession = customAuth.getSession();
  if (customSession && customSession.user) {
    return { id: customSession.user.id, email: customSession.user.user_id };
  }

  // Fall back to Supabase Auth
  const { data, error } = await supabase.auth.getSession();
  if (error || !data || !data.session || !data.session.user) return null;
  return data.session.user;
};

const getCustomerName = (productType: string, formData: any) => {
  switch (productType) {
    case 'PO':
      return formData.vendorSupplier;
    case 'PI':
      return formData.buyerName;
    case 'Invoice':
      return formData.customerName;
    default:
      return null;
  }
};

const getAmount = (productType: string, formData: any) => {
  switch (productType) {
    case 'PO':
    case 'PI':
      return formData.grandTotal;
    case 'Invoice':
      return formData.totalAmount;
    case 'ILC':
    case 'ELC':
    case 'Import LC':
    case 'Export LC':
      // Try various field names for LC amount (with and without double spaces from field_repository)
      return formData['LC Amount'] || formData['LC  Amount'] || 
             formData.lc_amount || formData.lcAmount ||
             formData['Transaction Amount'] || formData['Transaction  Amount'] ||
             formData.amount || null;
    default:
      // Generic fallback for amount field
      return formData.amount || formData['LC Amount'] || formData['LC  Amount'] || 
             formData['Transaction Amount'] || null;
  }
};

// Map stage name to transaction status
// Returns dynamic "<Stage Name> Completed-<Channel>" format for accurate next-stage lookup
// Channel is embedded in status to unambiguously identify which workflow the stage belongs to
// isFinalStage: indicates if this is the last stage in the workflow (should return 'Issued')
const getStatusFromStage = (
  stageName: string, 
  isFinalApproval: boolean, 
  channel: string,
  isFinalStage: boolean = false
): string => {
  // Final approval OR final stage completed always returns 'Issued'
  if (isFinalApproval || isFinalStage) return 'Issued';
  
  const normalizedStage = stageName.toLowerCase().trim();
  
  // Authorization stage - only return "Sent to Bank" for PORTAL workflows (cross-workflow handoff)
  // Bank workflows (Product Processor) should NOT say "Sent to Bank" - it's already at the bank
  if (normalizedStage.includes('authorization') || normalizedStage === 'authorization') {
    // Portal channel means cross-workflow handoff to bank
    if (channel === 'Portal') {
      return 'Sent to Bank';
    }
    // Bank channel (Product Processor) - this is within bank workflow, not a handoff
    // Return completed status instead of "Sent to Bank"
    return `${stageName} Completed-${channel}`;
  }
  
  // Dynamic status: "<Stage Name> Completed-<Channel>"
  // Format embeds the channel to make workflow routing unambiguous
  // e.g., "Data Entry Completed-Portal" or "Data Entry Completed-Product Processor"
  return `${stageName} Completed-${channel}`;
};

// Get channel based on business application
const getChannelFromBusinessApp = (businessApplication: string): string => {
  const normalizedApp = businessApplication.toLowerCase().trim();
  
  // For Process Orchestrator or TSCF Bank, channel is "Bank"
  if (normalizedApp.includes('orchestrator') || normalizedApp.includes('tscf bank')) {
    return 'Bank';
  }
  // For TSCF Client, channel is "Portal"
  return 'Portal';
};

const createTransactionRecord = async (
  productType: string,
  formData: any,
  actualTransactionNumber: string,
  processType?: string,
  businessApplication?: string,
  status?: string
) => {
  const user = await getCurrentUserAsync();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get business application from localStorage if not provided
  const resolvedBusinessApplication = businessApplication || 
    localStorage.getItem('businessCentre') || 
    'Adria TSCF Client';
  
  // Use provided status or default to 'Submitted'
  const resolvedStatus = status || 'Submitted';
  
  // Determine channel based on business application
  const channel = getChannelFromBusinessApp(resolvedBusinessApplication);
  
  try {
    // Use RPC function to upsert transaction (handles duplicates gracefully)
    // Include form_data to persist data across workflow stages
    const { data: transaction, error: transactionError } = await supabase.rpc('upsert_transaction', {
      p_user_id: user.id,
      p_transaction_ref: actualTransactionNumber,
      p_product_type: productType,
      p_process_type: processType || "Create",
      p_status: resolvedStatus,
      p_customer_name: getCustomerName(productType, formData),
      p_amount: getAmount(productType, formData),
      p_currency: formData.currency || 'USD',
      p_created_by: user.email || user.id,
      p_initiating_channel: channel,
      p_business_application: resolvedBusinessApplication,
      p_form_data: JSON.stringify(formData)
    });

    if (transactionError) throw transactionError;
    return transaction;
  } catch (error) {
    throw error;
  }
};

// Export helpers required by other services
export {
  getCurrentUser,
  getCurrentUserAsync,
  getCustomerName,
  getAmount,
  createTransactionRecord,
  getStatusFromStage,
};
