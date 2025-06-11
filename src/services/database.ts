
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';

// Get current user from custom auth
const getCurrentUser = () => {
  const session = customAuth.getSession();
  return session?.user || null;
};

// Purchase Order functions
export const savePurchaseOrder = async (formData: any) => {
  const user = getCurrentUser();
  if (!user) {
    console.error('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Saving PO with user ID:', user.id);
  console.log('PO Form data:', formData);

  try {
    // Insert purchase order using custom user's UUID id
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .insert({
        user_id: user.id, // Use the UUID id from custom_users table
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

    if (poError) {
      console.error('PO insertion error:', poError);
      throw poError;
    }

    console.log('PO inserted successfully:', po);

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

      console.log('Inserting line items:', lineItems);

      const { error: itemsError } = await supabase
        .from('popi_line_items')
        .insert(lineItems);

      if (itemsError) {
        console.error('Line items insertion error:', itemsError);
        throw itemsError;
      }

      console.log('Line items inserted successfully');
    }

    return po;
  } catch (error) {
    console.error('Error saving purchase order:', error);
    throw error;
  }
};

// Proforma Invoice functions
export const saveProformaInvoice = async (formData: any) => {
  const user = getCurrentUser();
  if (!user) {
    console.error('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Saving PI with user ID:', user.id);
  console.log('PI Form data:', formData);

  try {
    // Insert proforma invoice using custom user's UUID id
    const { data: pi, error: piError } = await supabase
      .from('proforma_invoices')
      .insert({
        user_id: user.id, // Use the UUID id from custom_users table
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

    if (piError) {
      console.error('PI insertion error:', piError);
      throw piError;
    }

    console.log('PI inserted successfully:', pi);

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

      console.log('Inserting PI line items:', lineItems);

      const { error: itemsError } = await supabase
        .from('popi_line_items')
        .insert(lineItems);

      if (itemsError) {
        console.error('PI line items insertion error:', itemsError);
        throw itemsError;
      }

      console.log('PI line items inserted successfully');
    }

    return pi;
  } catch (error) {
    console.error('Error saving proforma invoice:', error);
    throw error;
  }
};

// Invoice functions
export const saveInvoice = async (formData: any) => {
  const user = getCurrentUser();
  if (!user) {
    console.error('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Saving Invoice with user ID:', user.id);
  console.log('Invoice Form data:', formData);

  try {
    // Insert invoice using custom user's UUID id
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id, // Use the UUID id from custom_users table
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

    if (invoiceError) {
      console.error('Invoice insertion error:', invoiceError);
      throw invoiceError;
    }

    console.log('Invoice inserted successfully:', invoice);

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

      console.log('Inserting invoice line items:', lineItems);

      const { error: itemsError } = await supabase
        .from('invoice_line_items')
        .insert(lineItems);

      if (itemsError) {
        console.error('Invoice line items insertion error:', itemsError);
        throw itemsError;
      }

      console.log('Invoice line items inserted successfully');
    }

    return invoice;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

// Search purchase order
export const searchPurchaseOrder = async (poNumber: string) => {
  const user = getCurrentUser();
  if (!user) {
    console.error('No authenticated user found');
    throw new Error('User not authenticated');
  }

  console.log('Searching PO with user ID:', user.id, 'PO Number:', poNumber);

  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('user_id', user.id) // Use the UUID id from custom_users table
      .eq('po_number', poNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('PO search error:', error);
      throw error;
    }

    console.log('PO search result:', data);
    return data;
  } catch (error) {
    console.error('Error searching purchase order:', error);
    throw error;
  }
};
