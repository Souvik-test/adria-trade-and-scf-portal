
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from './customAuth';

export interface ImportLCRequest {
  id: string;
  corporate_reference: string;
  issue_date: string | null;
  expiry_date: string | null;
  applicant_name: string | null;
  beneficiary_name: string | null;
  currency: string | null;
  lc_amount: number | null;
  issuing_bank: string | null;
}

export const fetchSubmittedImportLCRequests = async (searchTerm?: string): Promise<ImportLCRequest[]> => {
  try {
    console.log('Fetching Import LC requests with search term:', searchTerm);
    
    // Ensure user is authenticated
    const user = customAuth.getSession()?.user;
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    // Build the query to fetch submitted LCs (now accessible due to updated RLS policy)
    let query = supabase
      .from('import_lc_requests')
      .select('id, corporate_reference, issue_date, expiry_date, applicant_name, beneficiary_name, currency, lc_amount, issuing_bank')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false });

    // Apply search filter if provided
    if (searchTerm && searchTerm.trim()) {
      query = query.ilike('corporate_reference', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching Import LC requests:', error);
      throw error;
    }

    console.log('Fetched Import LC requests:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch Import LC requests:', error);
    return [];
  }
};

export const fetchTransferableImportLCs = async (searchTerm?: string): Promise<ImportLCRequest[]> => {
  try {
    console.log('Fetching transferable Import LC requests with search term:', searchTerm);
    
    // Ensure user is authenticated
    const user = customAuth.getSession()?.user;
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    // Build the query to fetch only transferable LCs
    let query = supabase
      .from('import_lc_requests')
      .select('id, corporate_reference, issue_date, expiry_date, applicant_name, beneficiary_name, currency, lc_amount, issuing_bank')
      .eq('status', 'submitted')
      .eq('is_transferable', true)
      .order('created_at', { ascending: false });

    // Apply search filter if provided
    if (searchTerm && searchTerm.trim()) {
      query = query.ilike('corporate_reference', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transferable Import LC requests:', error);
      throw error;
    }

    console.log('Fetched transferable Import LC requests:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch transferable Import LC requests:', error);
    return [];
  }
};
