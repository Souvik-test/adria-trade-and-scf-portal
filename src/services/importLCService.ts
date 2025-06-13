
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from './customAuth';
import { ImportLCFormData } from '@/types/importLC';

export const fetchImportLCRequests = async () => {
  const user = customAuth.getSession()?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Set the user context for RLS using a direct query
  const { error: configError } = await supabase
    .from('custom_users')
    .select('id')
    .eq('user_id', user.user_id)
    .limit(1);

  if (configError) {
    console.error('User context error:', configError);
  }

  const { data, error } = await supabase
    .from('import_lc_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const fetchImportLCRequest = async (id: string) => {
  const user = customAuth.getSession()?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Set the user context for RLS using a direct query
  const { error: configError } = await supabase
    .from('custom_users')
    .select('id')
    .eq('user_id', user.user_id)
    .limit(1);

  if (configError) {
    console.error('User context error:', configError);
  }

  const { data, error } = await supabase
    .from('import_lc_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteImportLCRequest = async (id: string) => {
  const user = customAuth.getSession()?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Set the user context for RLS using a direct query
  const { error: configError } = await supabase
    .from('custom_users')
    .select('id')
    .eq('user_id', user.user_id)
    .limit(1);

  if (configError) {
    console.error('User context error:', configError);
  }

  const { error } = await supabase
    .from('import_lc_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};
