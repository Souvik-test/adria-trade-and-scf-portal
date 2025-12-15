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

const createTransactionRecord = async (
  productType: string,
  formData: any,
  actualTransactionNumber: string,
  processType?: string
) => {
  const user = await getCurrentUserAsync();
  if (!user) {
    throw new Error('User not authenticated');
  }
  try {
    // Use RPC function to insert transaction (bypasses RLS for custom auth)
    const { data: transaction, error: transactionError } = await supabase.rpc('insert_transaction', {
      p_user_id: user.id,
      p_transaction_ref: actualTransactionNumber,
      p_product_type: productType,
      p_process_type: processType || "Create",
      p_status: 'Submitted',
      p_customer_name: getCustomerName(productType, formData),
      p_amount: getAmount(productType, formData),
      p_currency: formData.currency || 'USD',
      p_created_by: user.email || user.id,
      p_initiating_channel: 'Portal'
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
};
