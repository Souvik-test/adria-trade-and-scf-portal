
import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

export interface ImportLCRequest {
  id?: string;
  user_id: string;
  
  // Basic LC Information
  popi_number?: string;
  popi_type?: 'PO' | 'PI';
  form_of_documentary_credit: string;
  corporate_reference: string;
  applicable_rules: string;
  lc_type?: string;
  issue_date?: string;
  expiry_date?: string;
  place_of_expiry?: string;
  
  // Applicant Information
  applicant_name?: string;
  applicant_address?: string;
  applicant_account_number?: string;
  
  // Beneficiary Information
  beneficiary_name?: string;
  beneficiary_address?: string;
  beneficiary_bank_name?: string;
  beneficiary_bank_address?: string;
  beneficiary_bank_swift_code?: string;
  advising_bank_swift_code?: string;
  
  // LC Amount and Terms
  lc_amount?: number;
  currency?: string;
  tolerance?: string;
  additional_amount?: number;
  available_with?: string;
  available_by?: string;
  partial_shipments_allowed?: boolean;
  transshipment_allowed?: boolean;
  
  // Shipment Details
  description_of_goods?: string;
  port_of_loading?: string;
  port_of_discharge?: string;
  latest_shipment_date?: string;
  presentation_period?: string;
  
  // Document Requirements
  required_documents?: string[];
  additional_conditions?: string;
  
  // Status
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export const importLCService = {
  async createRequest(formData: ImportLCFormData, userId: string): Promise<ImportLCRequest> {
    const requestData: ImportLCRequest = {
      user_id: userId,
      popi_number: formData.popiNumber || undefined,
      popi_type: formData.popiType as 'PO' | 'PI' || undefined,
      form_of_documentary_credit: formData.formOfDocumentaryCredit,
      corporate_reference: formData.corporateReference,
      applicable_rules: formData.applicableRules,
      lc_type: formData.lcType || undefined,
      issue_date: formData.issueDate || undefined,
      expiry_date: formData.expiryDate || undefined,
      place_of_expiry: formData.placeOfExpiry || undefined,
      applicant_name: formData.applicantName || undefined,
      applicant_address: formData.applicantAddress || undefined,
      applicant_account_number: formData.applicantAccountNumber || undefined,
      beneficiary_name: formData.beneficiaryName || undefined,
      beneficiary_address: formData.beneficiaryAddress || undefined,
      beneficiary_bank_name: formData.beneficiaryBankName || undefined,
      beneficiary_bank_address: formData.beneficiaryBankAddress || undefined,
      beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode || undefined,
      advising_bank_swift_code: formData.advisingBankSwiftCode || undefined,
      lc_amount: formData.lcAmount || undefined,
      currency: formData.currency || undefined,
      tolerance: formData.tolerance || undefined,
      additional_amount: formData.additionalAmount || undefined,
      available_with: formData.availableWith || undefined,
      available_by: formData.availableBy || undefined,
      partial_shipments_allowed: formData.partialShipmentsAllowed,
      transshipment_allowed: formData.transshipmentAllowed,
      description_of_goods: formData.descriptionOfGoods || undefined,
      port_of_loading: formData.portOfLoading || undefined,
      port_of_discharge: formData.portOfDischarge || undefined,
      latest_shipment_date: formData.latestShipmentDate || undefined,
      presentation_period: formData.presentationPeriod || undefined,
      required_documents: formData.requiredDocuments.length > 0 ? formData.requiredDocuments : undefined,
      additional_conditions: formData.additionalConditions || undefined,
      status: 'draft'
    };

    const { data, error } = await supabase
      .from('import_lc_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      console.error('Error creating import LC request:', error);
      throw error;
    }

    return data;
  },

  async updateRequest(id: string, formData: Partial<ImportLCFormData>): Promise<ImportLCRequest> {
    const { data, error } = await supabase
      .from('import_lc_requests')
      .update(formData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating import LC request:', error);
      throw error;
    }

    return data;
  },

  async getRequestById(id: string): Promise<ImportLCRequest | null> {
    const { data, error } = await supabase
      .from('import_lc_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching import LC request:', error);
      return null;
    }

    return data;
  },

  async getUserRequests(userId: string): Promise<ImportLCRequest[]> {
    const { data, error } = await supabase
      .from('import_lc_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user import LC requests:', error);
      throw error;
    }

    return data || [];
  }
};
