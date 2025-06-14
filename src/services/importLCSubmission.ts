
import { customAuth } from '@/services/customAuth';
// import { supabase } from '@/integrations/supabase/client';  // NOT NEEDED ANYMORE
import { ImportLCFormData } from '@/types/importLC';
import { buildInsertData } from './importLCSubmissionHelpers';

const submitImportLCEdge = async (
  formData: ImportLCFormData,
  status: 'submitted' | 'draft'
) => {
  const session = customAuth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  // Build clean insert data like before
  const user = session.user;
  const insertData = buildInsertData(user, formData, status);

  // Call edge function
  const resp = await fetch(
    `${window.location.origin}/functions/v1/submit-import-lc`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session,
        formData: insertData,
        status,
      }),
    }
  );
  const result = await resp.json();
  if (!resp.ok) {
    throw new Error(result?.error || 'Failed to submit LC');
  }
  return result.data;
};

// Submit Import LC Request
export const submitImportLCRequest = async (formData: ImportLCFormData) => {
  return await submitImportLCEdge(formData, 'submitted');
};

// Save Draft Import LC Request
export const saveDraftImportLCRequest = async (formData: ImportLCFormData) => {
  return await submitImportLCEdge(formData, 'draft');
};
