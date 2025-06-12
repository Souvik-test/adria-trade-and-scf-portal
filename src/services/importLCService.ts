
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

// Get current user from custom auth
const getCurrentUser = () => {
  const session = customAuth.getSession();
  return session?.user || null;
};

// Save Import LC Request
export const saveImportLCRequest = async (formData: ImportLCFormData, status: 'draft' | 'submitted' = 'draft') => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('import_lc_requests')
      .insert({
        user_id: user.id,
        request_type: 'issuance',
        
        // Basic LC Information
        lc_number: formData.corporateReference,
        issue_date: formData.issueDate || null,
        expiry_date: formData.expiryDate || null,
        place_of_expiry: formData.placeOfExpiry || null,
        
        // Applicant Information
        applicant_name: formData.applicantName || null,
        applicant_address: formData.applicantAddress || null,
        applicant_account_number: formData.applicantAccountNumber || null,
        
        // Beneficiary Information
        beneficiary_name: formData.beneficiaryName || null,
        beneficiary_address: formData.beneficiaryAddress || null,
        beneficiary_bank_name: formData.beneficiaryBankName || null,
        beneficiary_bank_address: formData.beneficiaryBankAddress || null,
        beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode || null,
        
        // LC Amount and Terms
        lc_amount: formData.lcAmount || null,
        currency: formData.currency || 'USD',
        available_with: formData.availableWith || null,
        available_by: formData.availableBy || null,
        partial_shipments_allowed: formData.partialShipmentsAllowed,
        transshipment_allowed: formData.transshipmentAllowed,
        
        // Shipment Details
        description_of_goods: formData.descriptionOfGoods || null,
        port_of_loading: formData.portOfLoading || null,
        port_of_discharge: formData.portOfDischarge || null,
        latest_shipment_date: formData.latestShipmentDate || null,
        presentation_period: formData.presentationPeriod || null,
        
        // Document Requirements
        required_documents: formData.requiredDocuments.length > 0 ? formData.requiredDocuments : null,
        additional_conditions: formData.additionalConditions || null,
        
        // Swift MT700 Fields (store complete form data)
        swift_mt700_data: {
          formOfDocumentaryCredit: formData.formOfDocumentaryCredit,
          applicableRules: formData.applicableRules,
          popiNumber: formData.popiNumber,
          popiType: formData.popiType,
          tolerance: formData.tolerance,
          additionalAmount: formData.additionalAmount,
          advisingBankSwiftCode: formData.advisingBankSwiftCode
        },
        
        status: status,
        submitted_at: status === 'submitted' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving Import LC request:', error);
      throw error;
    }

    // Create transaction record if submitted
    if (status === 'submitted' && formData.corporateReference) {
      await createTransactionRecord(formData);
    }

    return data;
  } catch (error) {
    console.error('Error saving Import LC request:', error);
    throw error;
  }
};

// Create transaction record for Import LC
const createTransactionRecord = async (formData: ImportLCFormData) => {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_ref: formData.corporateReference,
        product_type: 'Import LC',
        status: 'Submitted',
        customer_name: formData.beneficiaryName || null,
        amount: formData.lcAmount || null,
        currency: formData.currency || 'USD',
        created_by: user.user_id,
        initiating_channel: 'Portal'
      });

    if (error) {
      console.error('Error creating transaction record:', error);
    }
  } catch (error) {
    console.error('Error creating transaction record:', error);
  }
};

// Generate SWIFT MT 700 message
export const generateMT700Draft = (formData: ImportLCFormData): string => {
  const mt700 = `
SWIFT MT 700 - DOCUMENTARY CREDIT ISSUE
=================================================

:20: ${formData.corporateReference}
:23: ${formData.formOfDocumentaryCredit || 'IRREVOCABLE'}
:31C: ${formData.issueDate}
:31D: ${formData.expiryDate} ${formData.placeOfExpiry}
:32B: ${formData.currency}${formData.lcAmount}
:39A: ${formData.tolerance || 'NOT APPLICABLE'}
:41A: ${formData.availableWith}
:42C: ${formData.availableBy}
:43P: ${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:43T: ${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:44E: ${formData.portOfLoading}
:44F: ${formData.portOfDischarge}
:44C: ${formData.latestShipmentDate}
:45A: ${formData.descriptionOfGoods}
:46A: ${formData.requiredDocuments.join('\n')}
:47A: ${formData.additionalConditions || 'NONE'}
:48: ${formData.presentationPeriod || '21 DAYS AFTER SHIPMENT DATE'}
:49: ${formData.applicableRules}
:50: ${formData.applicantName}
      ${formData.applicantAddress}
:59: ${formData.beneficiaryName}
      ${formData.beneficiaryAddress}
:78: ${formData.additionalConditions || 'STANDARD LC CONDITIONS APPLY'}

Generated on: ${new Date().toISOString()}
=================================================
  `.trim();

  return mt700;
};

// Export MT 700 draft
export const exportMT700 = (formData: ImportLCFormData, format: 'download' | 'email' = 'download') => {
  const mt700Text = generateMT700Draft(formData);
  
  if (format === 'download') {
    const blob = new Blob([mt700Text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MT700_${formData.corporateReference || 'Draft'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  return mt700Text;
};
