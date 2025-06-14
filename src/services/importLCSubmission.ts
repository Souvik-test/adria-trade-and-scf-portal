
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { ImportLCFormData } from '@/types/importLC';
import { buildInsertData } from './importLCSubmissionHelpers';

// Submit Import LC Request
export const submitImportLCRequest = async (formData: ImportLCFormData) => {
  console.log('submitForm called with formData:', formData);

  const user = customAuth.getSession()?.user;
  if (!user) {
    console.error('No user session found');
    throw new Error('User not authenticated');
  }

  console.log('User found:', user);

  try {
    const insertData = buildInsertData(user, formData, 'submitted');
    // Ensure required_documents is string[]
    let requiredDocs: string[] = [];
    if (Array.isArray(insertData.required_documents)) {
      requiredDocs = [...(insertData.required_documents as string[])];
    }
    insertData.required_documents = requiredDocs;

    console.log('Attempting to insert data:', insertData);

    // Use RPC call to bypass RLS temporarily for submission
    const { data, error } = await supabase
      .rpc('insert_import_lc_request', {
        request_data: insertData
      });

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Import LC request submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error submitting Import LC request:', error);
    throw error;
  }
};

// Save Draft Import LC Request
export const saveDraftImportLCRequest = async (formData: ImportLCFormData) => {
  console.log('Starting draft save...');
  const user = customAuth.getSession()?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const insertData = buildInsertData(user, formData, 'draft');
  // Ensure required_documents is string[]
  let requiredDocs: string[] = [];
  if (Array.isArray(insertData.required_documents)) {
    requiredDocs = [...(insertData.required_documents as string[])];
  }
  insertData.required_documents = requiredDocs;

  const { error } = await supabase
    .rpc('insert_import_lc_request', {
      request_data: insertData
    });

  if (error) {
    console.error('Database error:', error);
    throw error;
  }

  console.log('Draft saved successfully');
};
