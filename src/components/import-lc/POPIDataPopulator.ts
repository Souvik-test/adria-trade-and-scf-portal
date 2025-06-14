
import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/types/importLC';

export const populatePOPIData = async (
  popiType: 'PO' | 'PI',
  popiNumber: string,
  updateField: (field: keyof ImportLCFormData, value: any) => void
) => {
  try {
    if (popiType === 'PO') {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .eq('po_number', popiNumber)
        .single();

      if (error) throw error;

      if (data) {
        // Populate form with PO data
        updateField('lcAmount', data.grand_total || 0);
        updateField('currency', data.currency || 'USD');
        updateField('descriptionOfGoods', data.notes || '');
        updateField('beneficiaryName', data.vendor_supplier || '');
        updateField('beneficiaryAddress', data.billing_address || '');
        updateField('latestShipmentDate', data.expected_delivery_date || '');
        
        // Update party details
        updateField('parties', [
          {
            role: 'applicant',
            name: '',
            address: data.shipping_address || '',
            accountNumber: '',
            swiftCode: ''
          },
          {
            role: 'beneficiary',
            name: data.vendor_supplier || '',
            address: data.billing_address || '',
            accountNumber: '',
            swiftCode: ''
          },
          {
            role: 'advising_bank',
            name: '',
            address: '',
            accountNumber: '',
            swiftCode: ''
          }
        ]);

        return { success: true, message: 'PO data populated successfully' };
      }
    } else if (popiType === 'PI') {
      const { data, error } = await supabase
        .from('proforma_invoices')
        .select('*')
        .eq('pi_number', popiNumber)
        .single();

      if (error) throw error;

      if (data) {
        // Populate form with PI data
        updateField('lcAmount', data.grand_total || 0);
        updateField('currency', data.currency || 'USD');
        updateField('descriptionOfGoods', data.notes || '');
        updateField('beneficiaryName', data.buyer_name || '');
        updateField('beneficiaryAddress', data.billing_address || '');
        
        // Update party details
        updateField('parties', [
          {
            role: 'applicant',
            name: data.buyer_name || '',
            address: data.shipping_address || '',
            accountNumber: '',
            swiftCode: ''
          },
          {
            role: 'beneficiary',
            name: '',
            address: data.billing_address || '',
            accountNumber: '',
            swiftCode: ''
          },
          {
            role: 'advising_bank',
            name: '',
            address: '',
            accountNumber: '',
            swiftCode: ''
          }
        ]);

        return { success: true, message: 'PI data populated successfully' };
      }
    }

    return { success: false, message: `${popiType} not found` };
  } catch (error) {
    console.error('Error populating POPI data:', error);
    return { success: false, message: `Error populating ${popiType} data` };
  }
};
