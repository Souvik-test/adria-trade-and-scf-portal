
import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/types/importLC';
import { buildInsertData } from './importLCSubmissionHelpers';
import { customAuth } from './customAuth';

const getSupabaseFunctionUrl = () => {
  return 'https://txkejzwremnrpyksizso.functions.supabase.co/submit-import-lc';
};

const submitImportLCEdge = async (
  formData: ImportLCFormData,
  status: 'submitted' | 'draft'
) => {
  // Check custom auth first, then fall back to Supabase auth
  const customSession = customAuth.getSession();
  
  if (customSession?.access_token) {
    // Use custom authentication
    const insertData = buildInsertData(
      { id: customSession.user.id } as any, 
      formData, 
      status
    );
    
    const fnUrl = getSupabaseFunctionUrl();
    console.log("DEBUG: Sending edge function request (custom auth)", {
      fnUrl,
      insertData,
      session_user_id: customSession.user.id,
      status,
    });

    const resp = await fetch(fnUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customSession.access_token}`,
      },
      body: JSON.stringify({
        session: customSession,
        formData: insertData,
        status,
      }),
    });

    const bodyText = await resp.text();
    let result;
    try {
      result = JSON.parse(bodyText);
    } catch (err) {
      console.error("DEBUG: Expected JSON but got non-JSON response:", bodyText);
      throw new Error('Unexpected server response. Please check the function deployment and URL.');
    }

    console.log("DEBUG: Edge function response", { ok: resp.ok, status: resp.status, result });

    if (!resp.ok) {
      throw new Error(result?.error || 'Failed to submit LC');
    }
    return result.data;
  }
  
  // Fall back to Supabase auth
  const { data: { session }, error } = await supabase.auth.getSession();
  console.log("DEBUG: Supabase.getSession() result", { session, error });
  if (!session || !session.user || !session.access_token) {
    console.error("DEBUG: No session or access token!", { session, error });
    throw new Error('User not authenticated (no session or access token)');
  }

  const user = session.user;
  const insertData = buildInsertData(user, formData, status);

  // Pass access token for edge auth
  const fnUrl = getSupabaseFunctionUrl();

  // Log what is being sent in the request
  console.log("DEBUG: Sending edge function request", {
    fnUrl,
    insertData,
    session_user_id: session.user.id,
    session_token_short: session.access_token.slice(0, 10) + "...",
    status,
  });

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
    console.error("DEBUG: Expected JSON but got non-JSON response:", bodyText);
    throw new Error('Unexpected server response. Please check the function deployment and URL.');
  }

  // Log the full body response for debugging
  console.log("DEBUG: Edge function response", { ok: resp.ok, status: resp.status, result });

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
