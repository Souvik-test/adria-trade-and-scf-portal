
import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/types/importLC';
import { buildInsertData } from './importLCSubmissionHelpers';

const getSupabaseFunctionUrl = () => {
  return 'https://txkejzwremnrpyksizso.functions.supabase.co/submit-import-lc';
};

const submitImportLCEdge = async (
  formData: ImportLCFormData,
  status: 'submitted' | 'draft'
) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }

  const user = session.user;
  const insertData = buildInsertData(user, formData, status);

  // Pass access token for edge auth
  const fnUrl = getSupabaseFunctionUrl();
  const resp = await fetch(fnUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      session,
      formData: insertData,
      status,
    }),
  });

  const bodyText = await resp.text();
  let result;
  try {
    result = JSON.parse(bodyText);
  } catch (err) {
    console.error("Expected JSON but got non-JSON response:", bodyText);
    throw new Error('Unexpected server response. Please check the function deployment and URL.');
  }

  if (!resp.ok) {
    throw new Error(result?.error || 'Failed to submit LC');
  }
  return result.data;
};

export const submitImportLCRequest = async (formData: ImportLCFormData) => {
  return await submitImportLCEdge(formData, 'submitted');
};

export const saveDraftImportLCRequest = async (formData: ImportLCFormData) => {
  return await submitImportLCEdge(formData, 'draft');
};
