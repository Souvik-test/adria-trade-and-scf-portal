
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync, getCustomerName, getAmount, createTransactionRecord } from './database';

// Helper to fetch the next unique transaction ref from Supabase
const getUniqueTransactionRef = async (productType: string) => {
  // Fix TS2345 error by casting params object to { product_type: string }
  const { data, error } = await supabase.rpc('generate_transaction_ref', { product_type: productType } as { product_type: string });
  if (error || !data) {
    throw new Error(`Failed to generate transaction ref for ${productType}: ${error?.message}`);
  }
  return data;
};

// Save Purchase Order
export const savePurchaseOrder = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    // Ensure unique PO number
    const uniquePONumber = await getUniqueTransactionRef('PO');
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .insert({
        user_id: user.id,
        po_number: uniquePONumber,
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
    await createTransactionRecord('PO', formData, uniquePONumber);
    return { ...po, po_number: uniquePONumber };
  } catch (error) {
    throw error;
  }
};

// Save Proforma Invoice
export const saveProformaInvoice = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    // Ensure unique PI number
    const uniquePINumber = await getUniqueTransactionRef('PI');
    const { data: pi, error: piError } = await supabase
      .from('proforma_invoices')
      .insert({
        user_id: user.id,
        pi_number: uniquePINumber,
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
    await createTransactionRecord('PI', formData, uniquePINumber);
    return { ...pi, pi_number: uniquePINumber };
  } catch (error) {
    throw error;
  }
};

// Save Invoice
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
