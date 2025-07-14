
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
    const { data, error } = await (supabase as any)
      .from('outward_dc_discount_finance_requests')
      .insert({
        user_id: HARDCODED_USER_ID,
        ...requestData,
        status: 'submitted'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
    
    console.log('Successfully submitted request:', data);
    return data;
  } catch (error) {
    console.error('Error submitting discount/finance request:', error);
    throw error;
  }
};

export const saveDiscountFinanceRequestAsDraft = async (requestData: DiscountFinanceRequest) => {
  try {
    console.log('Saving discount/finance request as draft:', requestData);
    const { data, error } = await (supabase as any)
      .from('outward_dc_discount_finance_requests')
      .insert({
        user_id: HARDCODED_USER_ID,
        ...requestData,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
    
    console.log('Successfully saved draft:', data);
    return data;
  } catch (error) {
    console.error('Error saving discount/finance request as draft:', error);
    throw error;
  }
};

export const fetchDiscountFinanceRequests = async () => {
  try {
    console.log('Fetching discount/finance requests for user:', HARDCODED_USER_ID);
    const { data, error } = await (supabase as any)
      .from('outward_dc_discount_finance_requests')
      .select('*')
      .eq('user_id', HARDCODED_USER_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
    
    console.log('Successfully fetched requests:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching discount/finance requests:', error);
    throw error;
  }
};

// Test function to verify table exists
export const testTableConnection = async () => {
  try {
    console.log('Testing connection to outward_dc_discount_finance_requests table...');
    const { data, error } = await (supabase as any)
      .from('outward_dc_discount_finance_requests')
      .select('count(*)')
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
