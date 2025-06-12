
import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

// Define the interface based on our form data structure
export interface ImportLCRequest {
  id?: string;
  user_id?: string;
  popi_number: string;
  popi_type: 'PO' | 'PI' | '';
  form_of_documentary_credit: string;
  corporate_reference: string;
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
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to convert database row to our interface
const convertDatabaseRowToImportLCRequest = (row: any): ImportLCRequest => {
  return {
    id: row.id,
    user_id: row.user_id,
    popi_number: row.popi_number || '',
    popi_type: row.popi_type || '',
    form_of_documentary_credit: row.form_of_documentary_credit || '',
    corporate_reference: row.corporate_reference || '',
    applicable_rules: row.applicable_rules || 'UCP Latest Version',
    lc_type: row.lc_type || '',
    issue_date: row.issue_date || '',
    expiry_date: row.expiry_date || '',
    place_of_expiry: row.place_of_expiry || '',
    applicant_name: row.applicant_name || '',
    applicant_address: row.applicant_address || '',
    applicant_account_number: row.applicant_account_number || '',
    beneficiary_name: row.beneficiary_name || '',
    beneficiary_address: row.beneficiary_address || '',
    beneficiary_bank_name: row.beneficiary_bank_name || '',
    beneficiary_bank_address: row.beneficiary_bank_address || '',
    beneficiary_bank_swift_code: row.beneficiary_bank_swift_code || '',
    advising_bank_swift_code: row.advising_bank_swift_code || '',
    lc_amount: row.lc_amount || 0,
    currency: row.currency || 'USD',
    tolerance: row.tolerance || '',
    additional_amount: row.additional_amount || 0,
    available_with: row.available_with || '',
    available_by: row.available_by || '',
    partial_shipments_allowed: row.partial_shipments_allowed || false,
    transshipment_allowed: row.transshipment_allowed || false,
    description_of_goods: row.description_of_goods || '',
    port_of_loading: row.port_of_loading || '',
    port_of_discharge: row.port_of_discharge || '',
    latest_shipment_date: row.latest_shipment_date || '',
    presentation_period: row.presentation_period || '',
    required_documents: row.required_documents || [],
    additional_conditions: row.additional_conditions || '',
    status: row.status || 'draft',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

// Helper function to convert form data to database insert/update format
const convertFormDataToDatabaseFormat = (formData: ImportLCFormData, userId: string) => {
  return {
    user_id: userId,
    popi_number: formData.popiNumber || null,
    popi_type: formData.popiType || null,
    form_of_documentary_credit: formData.formOfDocumentaryCredit,
    corporate_reference: formData.corporateReference,
    applicable_rules: formData.applicableRules,
    lc_type: formData.lcType || null,
    issue_date: formData.issueDate || null,
    expiry_date: formData.expiryDate || null,
    place_of_expiry: formData.placeOfExpiry || null,
    applicant_name: formData.applicantName || null,
    applicant_address: formData.applicantAddress || null,
    applicant_account_number: formData.applicantAccountNumber || null,
    beneficiary_name: formData.beneficiaryName || null,
    beneficiary_address: formData.beneficiaryAddress || null,
    beneficiary_bank_name: formData.beneficiaryBankName || null,
    beneficiary_bank_address: formData.beneficiaryBankAddress || null,
    beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode || null,
    advising_bank_swift_code: formData.advisingBankSwiftCode || null,
    lc_amount: formData.lcAmount,
    currency: formData.currency,
    tolerance: formData.tolerance || null,
    additional_amount: formData.additionalAmount,
    available_with: formData.availableWith || null,
    available_by: formData.availableBy || null,
    partial_shipments_allowed: formData.partialShipmentsAllowed,
    transshipment_allowed: formData.transshipmentAllowed,
    description_of_goods: formData.descriptionOfGoods || null,
    port_of_loading: formData.portOfLoading || null,
    port_of_discharge: formData.portOfDischarge || null,
    latest_shipment_date: formData.latestShipmentDate || null,
    presentation_period: formData.presentationPeriod || null,
    required_documents: formData.requiredDocuments,
    additional_conditions: formData.additionalConditions || null,
    status: 'draft'
  };
};

export const importLCService = {
  async createImportLCRequest(formData: ImportLCFormData, userId: string): Promise<ImportLCRequest> {
    const databaseData = convertFormDataToDatabaseFormat(formData, userId);
    
    const { data, error } = await supabase
      .from('import_lc_requests')
      .insert(databaseData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create import LC request: ${error.message}`);
    }

    return convertDatabaseRowToImportLCRequest(data);
  },

  async updateImportLCRequest(id: string, formData: ImportLCFormData, userId: string): Promise<ImportLCRequest> {
    const databaseData = convertFormDataToDatabaseFormat(formData, userId);
    
    const { data, error } = await supabase
      .from('import_lc_requests')
      .update(databaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update import LC request: ${error.message}`);
    }

    return convertDatabaseRowToImportLCRequest(data);
  },

  async getImportLCRequest(id: string): Promise<ImportLCRequest | null> {
    const { data, error } = await supabase
      .from('import_lc_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No data found
      }
      throw new Error(`Failed to fetch import LC request: ${error.message}`);
    }

    return convertDatabaseRowToImportLCRequest(data);
  },

  async getUserImportLCRequests(userId: string): Promise<ImportLCRequest[]> {
    const { data, error } = await supabase
      .from('import_lc_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch import LC requests: ${error.message}`);
    }

    return data?.map(convertDatabaseRowToImportLCRequest) || [];
  },

  async deleteImportLCRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('import_lc_requests')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete import LC request: ${error.message}`);
    }
  }
};
