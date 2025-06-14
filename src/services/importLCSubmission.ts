import { customAuth } from '@/services/customAuth';
// import { supabase } from '@/integrations/supabase/client';  // NOT NEEDED ANYMORE
import { ImportLCFormData } from '@/types/importLC';
import { buildInsertData } from './importLCSubmissionHelpers';

const getSupabaseFunctionUrl = () => {
  // Try VITE_SUPABASE_FUNCTION_URL if set (allows for custom configuration)
  const envFnUrl = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
  if (envFnUrl) return `${envFnUrl.replace(/\/$/, '')}/submit-import-lc`;

  // Try to extract project ref from anon key env variable
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const match = anonKey.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6In([a-z0-9]{20,})/);
  const ref = match && match[1] ? match[1] : null;

  if (ref) {
    return `https://${ref}.functions.supabase.co/submit-import-lc`;
  }

  // Fallback: try window.location.origin (older logic, local dev only)
  if (typeof window !== 'undefined') {
    console.warn("Falling back to window.location.origin; Supabase project ref could not be found. This may cause DOCTYPE HTML errors if not running locally!");
    return `${window.location.origin}/functions/v1/submit-import-lc`;
  }

  throw new Error("Unable to determine Supabase Function URL.");
};

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

  // Use standardized Supabase Edge Function URL
  const fnUrl = getSupabaseFunctionUrl();
  const resp = await fetch(
    fnUrl,
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

  // Read the response as text once, then try to parse as JSON
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

// Submit Import LC Request
export const submitImportLCRequest = async (formData: ImportLCFormData) => {
  return await submitImportLCEdge(formData, 'submitted');
};

// Save Draft Import LC Request
export const saveDraftImportLCRequest = async (formData: ImportLCFormData) => {
  return await submitImportLCEdge(formData, 'draft');
};
