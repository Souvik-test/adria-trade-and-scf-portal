
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from './customAuth';

export interface TransferableLC {
  id: string;
  corporate_reference: string;
  issue_date: string | null;
  applicant_name: string | null;
  beneficiary_name: string | null;
  currency: string | null;
  lc_amount: number | null;
  expiry_date: string | null;
}

export const fetchTransferableLCs = async (searchTerm?: string): Promise<TransferableLC[]> => {
  const user = customAuth.getSession()?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Set the user context for RLS
  const { error: configError } = await supabase
    .from('custom_users')
    .select('id')
    .eq('user_id', user.user_id)
    .limit(1);

  if (configError) {
    console.error('User context error:', configError);
  }

  let query = supabase
    .from('import_lc_requests')
    .select('id, corporate_reference, issue_date, applicant_name, beneficiary_name, currency, lc_amount, expiry_date')
    .eq('is_transferable', true)
    .order('corporate_reference', { ascending: true });

  if (searchTerm) {
    query = query.ilike('corporate_reference', `%${searchTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
};
