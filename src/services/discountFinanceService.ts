
import { supabase } from '@/integrations/supabase/client';

// Hardcoded user ID for souvikgenius@gmail.com
const HARDCODED_USER_ID = '8cceba0f-c1a9-4074-8dbc-be256e0cc448';

interface DiscountFinanceRequest {
  bill_reference: string;
  request_type: 'discount' | 'finance';
  
  // Bill basic details
  bill_currency?: string;
  bill_amount?: number;
  submission_date?: string;
  due_date?: string;
  importer_name?: string;
  importer_address?: string;
  exporter_name?: string;
  exporter_address?: string;
  
  // Discount fields
  discount_percentage?: number;
  proceed_amount?: number;
  credit_account_number?: string;
  
  // Finance fields
  finance_currency?: string;
  finance_amount?: number;
  finance_tenor_days?: number;
  finance_percentage?: number;
  principal_amount?: number;
  interest_amount?: number;
  total_repayment_amount?: number;
  repayment_account_number?: string;
  
  status?: 'draft' | 'submitted';
}

export const submitDiscountFinanceRequest = async (requestData: DiscountFinanceRequest) => {
  try {
    console.log('Submitting discount/finance request:', requestData);
    // For now, just log the request - you can create a separate table later if needed
    console.log('Request would be submitted:', {
      user_id: HARDCODED_USER_ID,
      ...requestData,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    });
    
    // Return mock success response
    return { 
      id: Date.now().toString(), 
      ...requestData, 
      status: 'submitted',
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error submitting discount/finance request:', error);
    throw error;
  }
};

export const saveDiscountFinanceRequestAsDraft = async (requestData: DiscountFinanceRequest) => {
  try {
    console.log('Saving discount/finance request as draft:', requestData);
    // For now, just log the request - you can create a separate table later if needed
    console.log('Draft would be saved:', {
      user_id: HARDCODED_USER_ID,
      ...requestData,
      status: 'draft',
      saved_at: new Date().toISOString()
    });
    
    // Return mock success response
    return { 
      id: Date.now().toString(), 
      ...requestData, 
      status: 'draft',
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving discount/finance request as draft:', error);
    throw error;
  }
};

export const fetchAvailableBills = async () => {
  try {
    console.log('Fetching available bills for user:', HARDCODED_USER_ID);
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('bill_reference, bill_amount, bill_currency, drawee_payer_name, created_at')
      .eq('user_id', HARDCODED_USER_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
    
    console.log('Successfully fetched bills:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching available bills:', error);
    throw error;
  }
};

export const searchBillByReference = async (billReference: string) => {
  try {
    console.log('Searching for bill reference:', billReference);
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('*')
      .eq('bill_reference', billReference)
      .eq('user_id', HARDCODED_USER_ID)
      .maybeSingle();

    if (error) {
      console.error('Error searching bill:', error);
      throw error;
    }
    
    console.log('Search result:', data);
    return data;
  } catch (error) {
    console.error('Error searching bill by reference:', error);
    throw error;
  }
};

// Test function to verify table exists
export const testTableConnection = async () => {
  try {
    console.log('Testing connection to outward_documentary_collection_bills table...');
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Table connection test failed:', error);
      return false;
    }
    
    console.log('Table connection test successful:', data);
    return true;
  } catch (error) {
    console.error('Table connection test error:', error);
    return false;
  }
};
