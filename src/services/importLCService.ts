
import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

export interface ImportLCRequest {
  id?: string;
  user_id: string;
  request_type: 'issuance' | 'amendment' | 'cancellation';
  corporate_reference: string;
  form_of_documentary_credit: string;
  applicable_rules: string;
  lc_type: string;
  issue_date: string;
  expiry_date: string;
  place_of_expiry: string;
  applicant_name: string;
  applicant_address: string;
  applicant_account_number: string;
  beneficiary_name: string;
  beneficiary_address: string;
  beneficiary_bank_name: string;
  beneficiary_bank_address: string;
  beneficiary_bank_swift_code: string;
  advising_bank_swift_code: string;
  lc_amount: number;
  currency: string;
  tolerance: string;
  additional_amount: number;
  available_with: string;
  available_by: string;
  partial_shipments_allowed: boolean;
  transshipment_allowed: boolean;
  description_of_goods: string;
  port_of_loading: string;
  port_of_discharge: string;
  latest_shipment_date: string;
  presentation_period: string;
  required_documents: string[];
  additional_conditions: string;
  supporting_documents: File[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const saveImportLCRequest = async (formData: ImportLCFormData): Promise<{ data: any; error: any }> => {
  try {
    // Use type assertion to bypass TypeScript checking for the table name
    const { data, error } = await (supabase as any)
      .from('import_lc_requests')
      .insert({
        user_id: 'current-user-id', // This should be replaced with actual user ID
        request_type: 'issuance',
        corporate_reference: formData.corporateReference,
        form_of_documentary_credit: formData.formOfDocumentaryCredit,
        applicable_rules: formData.applicableRules,
        lc_type: formData.lcType,
        issue_date: formData.issueDate,
        expiry_date: formData.expiryDate,
        place_of_expiry: formData.placeOfExpiry,
        applicant_name: formData.applicantName,
        applicant_address: formData.applicantAddress,
        applicant_account_number: formData.applicantAccountNumber,
        beneficiary_name: formData.beneficiaryName,
        beneficiary_address: formData.beneficiaryAddress,
        beneficiary_bank_name: formData.beneficiaryBankName,
        beneficiary_bank_address: formData.beneficiaryBankAddress,
        beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode,
        advising_bank_swift_code: formData.advisingBankSwiftCode,
        lc_amount: formData.lcAmount,
        currency: formData.currency,
        tolerance: formData.tolerance,
        additional_amount: formData.additionalAmount,
        available_with: formData.availableWith,
        available_by: formData.availableBy,
        partial_shipments_allowed: formData.partialShipmentsAllowed,
        transshipment_allowed: formData.transshipmentAllowed,
        description_of_goods: formData.descriptionOfGoods,
        port_of_loading: formData.portOfLoading,
        port_of_discharge: formData.portOfDischarge,
        latest_shipment_date: formData.latestShipmentDate,
        presentation_period: formData.presentationPeriod,
        required_documents: formData.requiredDocuments,
        additional_conditions: formData.additionalConditions,
        status: 'draft'
      });

    return { data, error };
  } catch (err) {
    console.error('Error saving Import LC request:', err);
    return { data: null, error: err };
  }
};

export const generateSwiftMT700 = (formData: ImportLCFormData): string => {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  return `{1:F01BANKSGSGAXXX0000000000}
{2:O7001200${currentDate}BANKSGSGAXXX00000000001200${currentDate}N}
{3:{108:MT700 COV}}
{4:
:20:${formData.corporateReference}
:31C:${formData.issueDate ? formData.issueDate.replace(/-/g, '') : ''}
:40A:${formData.formOfDocumentaryCredit || 'IRREVOCABLE'}
:20:${formData.corporateReference}
:31D:${formData.expiryDate ? formData.expiryDate.replace(/-/g, '') : ''}/${formData.placeOfExpiry || ''}
:50:${formData.applicantName}
${formData.applicantAddress}
:59:${formData.beneficiaryName}
${formData.beneficiaryAddress}
:32B:${formData.currency}${formData.lcAmount}
:39A:${formData.tolerance || '+/-0%'}
:41A:${formData.availableWith || ''}
:42C:${formData.availableBy || ''}
:43P:${formData.partialShipmentsAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:43T:${formData.transshipmentAllowed ? 'ALLOWED' : 'NOT ALLOWED'}
:44A:${formData.portOfLoading || ''}
:44E:${formData.portOfDischarge || ''}
:44C:${formData.latestShipmentDate ? formData.latestShipmentDate.replace(/-/g, '') : ''}
:45A:${formData.descriptionOfGoods || ''}
:46A:${formData.requiredDocuments.join('\n') || ''}
:47A:${formData.additionalConditions || ''}
:71B:${formData.presentationPeriod || ''}
:48:${formData.presentationPeriod || ''}
:49:${formData.additionalConditions || ''}
:57A:${formData.advisingBankSwiftCode || ''}
:78:${formData.applicableRules || 'UCP LATEST VERSION'}
-}`;
};

export const downloadSwiftMT700 = (formData: ImportLCFormData) => {
  const swiftMessage = generateSwiftMT700(formData);
  const blob = new Blob([swiftMessage], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MT700_${formData.corporateReference || 'draft'}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
