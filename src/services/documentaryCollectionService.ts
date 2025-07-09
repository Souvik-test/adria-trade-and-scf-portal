
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync } from './database';

interface DocumentaryCollectionBill {
  bill_reference?: string;
  drawer_name?: string;
  drawer_address?: string;
  drawee_payer_name?: string;
  drawee_payer_address?: string;
  collecting_bank?: string;
  collecting_bank_address?: string;
  collecting_bank_swift_code?: string;
  bill_currency?: string;
  bill_amount?: number;
  tenor_days?: number;
  presentation_instructions?: string;
  documents_against?: string;
  special_instructions?: string;
  protect_charges?: string;
  interest_charges?: string;
  supporting_documents?: any[];
  status?: string;
}

export const submitDocumentaryCollectionBill = async (billData: DocumentaryCollectionBill) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .insert({
        ...billData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting documentary collection bill:', error);
    throw error;
  }
};

export const updateDocumentaryCollectionBill = async (billReference: string, billData: DocumentaryCollectionBill) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .update(billData)
      .eq('bill_reference', billReference)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating documentary collection bill:', error);
    throw error;
  }
};

export const fetchDocumentaryCollectionBills = async () => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documentary collection bills:', error);
    throw error;
  }
};

export const fetchDocumentaryCollectionBillByRef = async (billReference: string) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('*')
      .eq('bill_reference', billReference)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching documentary collection bill:', error);
    throw error;
  }
};
