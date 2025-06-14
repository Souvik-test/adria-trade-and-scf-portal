
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
    // Force type: ensure required_documents is string[]
    insertData.required_documents = Array.isArray(insertData.required_documents)
      ? insertData.required_documents.filter((d): d is string => typeof d === 'string')
      : [];

    console.log('Attempting to insert data:', insertData);

    const { data, error } = await supabase
      .from('import_lc_requests')
      .insert([insertData]);

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
  insertData.required_documents = Array.isArray(insertData.required_documents)
    ? insertData.required_documents.filter((d): d is string => typeof d === 'string')
    : [];

  const { error } = await supabase
    .from('import_lc_requests')
    .insert([insertData]);

  if (error) {
    console.error('Database error:', error);
    throw error;
  }

  console.log('Draft saved successfully');
};
