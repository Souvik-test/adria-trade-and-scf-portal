import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync, getCustomerName, getAmount, createTransactionRecord } from './database';

// Remove the getUniqueTransactionRef function since we no longer auto-generate refs.

// Save Purchase Order
export const savePurchaseOrder = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    // Use user-provided PO number
    const userPONumber = formData.poNumber;
    if (!userPONumber) throw new Error('Please provide a PO reference number.');

    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .insert({
        user_id: user.id,
        po_number: userPONumber,
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
    await createTransactionRecord('PO', formData, userPONumber);
    return { ...po, po_number: userPONumber };
  } catch (error) {
    throw error;
  }
};

// Save Proforma Invoice
export const saveProformaInvoice = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    // Use user-provided PI number
    const userPINumber = formData.piNumber;
    if (!userPINumber) throw new Error('Please provide a PI reference number.');

    const { data: pi, error: piError } = await supabase
      .from('proforma_invoices')
      .insert({
        user_id: user.id,
        pi_number: userPINumber,
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
    await createTransactionRecord('PI', formData, userPINumber);
    return { ...pi, pi_number: userPINumber };
  } catch (error) {
    throw error;
  }
};

// Save Invoice
export const saveInvoice = async (formData: any) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const invoiceNumber = formData.invoiceNumber;
    if (!invoiceNumber) throw new Error('Please provide an Invoice reference number.');

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_type: formData.invoiceType,
        invoice_number: invoiceNumber,
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
    await createTransactionRecord('Invoice', formData, invoiceNumber);
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

// Amendment Response Save
export const saveAmendmentResponse = async ({
  lcReference,
  amendmentNumber,
  action,
  comments,
  parties,
  lcAmount,
  shipment,
  documents,
  additionalConditions,
  specialInstructions,
}: {
  lcReference: string;
  amendmentNumber: string;
  action: 'accept' | 'refuse';
  comments: string;
  parties: any;
  lcAmount: any;
  shipment: any;
  documents: any;
  additionalConditions?: string;
  specialInstructions?: string;
}) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error("User not authenticated");

  // 1. Insert into export_lc_amendment_responses
  const { data: resp, error: respError } = await supabase
    .from('export_lc_amendment_responses')
    .insert({
      user_id: user.id,
      lc_reference: lcReference,
      amendment_number: amendmentNumber,
      action,
      comments,
      parties,
      lc_amount: lcAmount,
      shipment,
      documents,
      additional_conditions: additionalConditions,
      special_instructions: specialInstructions,
      status: "Submitted",
    })
    .select()
    .single();
  if (respError) throw respError;

  // 2. Insert into transactions as product_type "LC Amendment"
  const txnRef = `${lcReference}/AMD/${amendmentNumber}`;
  const { error: txnError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      transaction_ref: txnRef,
      product_type: "LC Amendment",
      status: "Submitted",
      customer_name: parties?.find((p: any) => p.role === "Applicant")?.name ?? null,
      amount: Number(lcAmount?.creditAmount?.replace(/[^0-9.-]/g, "")) || null,
      currency: lcAmount?.currency ?? "USD",
      created_by: user.full_name ?? "User",
      initiating_channel: 'Portal',
    });
  if (txnError) throw txnError;

  // 3. Insert notification
  const { error: notifError } = await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      transaction_ref: txnRef,
      transaction_type: "LC Amendment",
      message: `Amendment response (${action}) submitted for LC ${lcReference}, Amendment #${amendmentNumber}`,
    });
  if (notifError) throw notifError;

  return resp;
};
