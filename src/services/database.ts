
// All database service methods now use Supabase Auth for user identification.
import { supabase } from '@/integrations/supabase/client';

// Get current Supabase Auth user (returns uuid and .user_metadata, not custom_users)
const getCurrentUser = () => {
  const user =
    supabase.auth.getUser &&
    typeof supabase.auth.getUser === 'function'
      ? (window as any).__supabaseUser ||
        (supabase.auth.getUser as any)() // fallback for SSR/compat, but not needed usually
      : null;

  // Modern method: sync via session
  // State management: since this is not a hook, always use .auth.getSession
  // NOTE: this is async, so wrap in async if needed
  if (user && user.id) return user;
  // fallback (async always use getSession in callsites if needed)
  return null;
};

// Updated async version to actually work correctly everywhere
const getCurrentUserAsync = async () => {
  // Strongly recommended: always fetch Supabase Auth session right before DB call
  const { data, error } = await supabase.auth.getSession();
  if (error || !data || !data.session || !data.session.user) return null;
  return data.session.user;
};

// -- Helper: get metadata depending on the product_type (should map to the form field keys now) --
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

const createTransactionRecord = async (productType: string, formData: any, actualTransactionNumber: string) => {
  const user = await getCurrentUserAsync();
  if (!user) {
    throw new Error('User not authenticated');
  }
  try {
    // Use the correct Supabase Auth UUID
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_ref: actualTransactionNumber,
        product_type: productType,
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

// Purchase Order functions
export const savePurchaseOrder = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .insert({
        user_id: user.id,
        po_number: formData.poNumber,
        po_date: formData.poDate,
        vendor_supplier: formData.vendorSupplier,
        expected_delivery_date: formData.expectedDeliveryDate,
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress,
        same_as_shipping: formData.sameAsShipping,
        payment_terms: formData.paymentTerms,
        currency: formData.currency,
        terms_of_sale: formData.termsOfSale,
        subtotal: formData.subtotal,
        total_tax: formData.totalTax,
        shipping_cost: formData.shippingCost,
        grand_total: formData.grandTotal,
        bank_details: formData.bankDetails,
        notes: formData.notes,
        status: 'submitted'
      })
      .select()
      .single();
    if (poError) throw poError;

    if (formData.items && formData.items.length > 0) {
      const lineItems = formData.items.map((item: any) => ({
        purchase_order_id: po.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount: item.discount,
        tax_rate: item.taxRate,
        line_total: item.lineTotal
      }));
      const { error: itemsError } = await supabase.from('popi_line_items').insert(lineItems);
      if (itemsError) throw itemsError;
    }
    await createTransactionRecord('PO', formData, formData.poNumber);
    return po;
  } catch (error) {
    throw error;
  }
};

export const saveProformaInvoice = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data: pi, error: piError } = await supabase
      .from('proforma_invoices')
      .insert({
        user_id: user.id,
        pi_number: formData.piNumber,
        pi_date: formData.piDate,
        valid_until_date: formData.validUntilDate,
        buyer_name: formData.buyerName,
        buyer_id: formData.buyerId,
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress,
        same_as_shipping: formData.sameAsShipping,
        payment_terms: formData.paymentTerms,
        currency: formData.currency,
        terms_of_sale: formData.termsOfSale,
        subtotal: formData.subtotal,
        total_tax: formData.totalTax,
        shipping_cost: formData.shippingCost,
        grand_total: formData.grandTotal,
        bank_details: formData.bankDetails,
        notes: formData.notes,
        status: 'submitted'
      })
      .select()
      .single();

    if (piError) throw piError;

    if (formData.items && formData.items.length > 0) {
      const lineItems = formData.items.map((item: any) => ({
        proforma_invoice_id: pi.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount: item.discount,
        tax_rate: item.taxRate,
        line_total: item.lineTotal
      }));

      const { error: itemsError } = await supabase.from('popi_line_items').insert(lineItems);
      if (itemsError) throw itemsError;
    }
    await createTransactionRecord('PI', formData, formData.piNumber);
    return pi;
  } catch (error) {
    throw error;
  }
};

export const saveInvoice = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_type: formData.invoiceType,
        invoice_number: formData.invoiceNumber,
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate,
        purchase_order_number: formData.purchaseOrderNumber,
        purchase_order_currency: formData.purchaseOrderCurrency,
        purchase_order_amount: formData.purchaseOrderAmount,
        purchase_order_date: formData.purchaseOrderDate,
        customer_name: formData.customerName,
        customer_address: formData.customerAddress,
        customer_contact: formData.customerContact,
        currency: formData.currency,
        subtotal: formData.subtotal,
        tax_amount: formData.taxAmount,
        discount_amount: formData.discountAmount,
        total_amount: formData.totalAmount,
        payment_terms: formData.paymentTerms,
        notes: formData.notes,
        status: 'submitted'
      })
      .select()
      .single();
    if (invoiceError) throw invoiceError;

    if (formData.lineItems && formData.lineItems.length > 0) {
      const lineItems = formData.lineItems.map((item: any) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        tax_rate: item.taxRate,
        line_total: item.lineTotal
      }));

      const { error: itemsError } = await supabase.from('invoice_line_items').insert(lineItems);
      if (itemsError) throw itemsError;
    }
    await createTransactionRecord('Invoice', formData, formData.invoiceNumber);
    return invoice;
  } catch (error) {
    throw error;
  }
};

// Search purchase order
export const searchPurchaseOrder = async (poNumber: string) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('po_number', poNumber)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch user notifications
export const fetchNotifications = async () => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

// Fetch user transactions
export const fetchTransactions = async () => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
