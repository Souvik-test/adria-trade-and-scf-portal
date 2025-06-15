// All database service methods now use Supabase Auth for user identification.
import { supabase } from '@/integrations/supabase/client';

// --- User/session and helper functions ---
const getCurrentUser = () => {
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
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_ref: actualTransactionNumber,
        product_type: productType,
        process_type: processType || "Create",
        status: 'Submitted',
        customer_name: getCustomerName(productType, formData),
        amount: getAmount(productType, formData),
        currency: formData.currency || 'USD',
        created_by: user.email || user.id,
        initiating_channel: 'Portal'
      })
      .select()
      .single();

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
