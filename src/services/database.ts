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
    default:
      return null;
  }
};

// Map stage name to transaction status
const getStatusFromStage = (stageName: string, isFinalApproval: boolean): string => {
  // Only return 'Issued' for final approval stage completion
  if (isFinalApproval) return 'Issued';
  
  const normalizedStage = stageName.toLowerCase().trim();
  
  // Data Entry stage -> Submitted
  if (normalizedStage.includes('data entry') || normalizedStage === 'data entry') {
    return 'Submitted';
  }
  // Limit Check stage -> Limit Checked
  else if (normalizedStage.includes('limit') || normalizedStage === 'limit check') {
    return 'Limit Checked';
  }
  // Approval stage (not final) -> Approved
  else if (normalizedStage.includes('approval')) {
    return 'Approved';
  }
  
  return 'Submitted';
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
      p_business_application: resolvedBusinessApplication
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
