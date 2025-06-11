
import { supabase } from '@/integrations/supabase/client';

// Purchase Order functions
export const savePurchaseOrder = async (formData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Insert purchase order
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

  // Insert line items
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

    const { error: itemsError } = await supabase
      .from('popi_line_items')
      .insert(lineItems);

    if (itemsError) throw itemsError;
  }

  return po;
};

// Proforma Invoice functions
export const saveProformaInvoice = async (formData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Insert proforma invoice
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

  // Insert line items
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

    const { error: itemsError } = await supabase
      .from('popi_line_items')
      .insert(lineItems);

    if (itemsError) throw itemsError;
  }

  return pi;
};

// Invoice functions
export const saveInvoice = async (formData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Insert invoice
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

  // Insert line items
  if (formData.lineItems && formData.lineItems.length > 0) {
    const lineItems = formData.lineItems.map((item: any) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_rate: item.taxRate,
      line_total: item.lineTotal
    }));

    const { error: itemsError } = await supabase
      .from('invoice_line_items')
      .insert(lineItems);

    if (itemsError) throw itemsError;
  }

  return invoice;
};

// Search purchase order
export const searchPurchaseOrder = async (poNumber: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('user_id', user.id)
    .eq('po_number', poNumber)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
