
import { supabase } from '@/integrations/supabase/client';

// Get current user from auth
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

interface DocumentaryCollectionBill {
  bill_reference: string;
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
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .insert({
        user_id: userId,
        ...billData
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
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .update(billData)
      .eq('bill_reference', billReference)
      .eq('user_id', userId)
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
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documentary collection bills:', error);
    throw error;
  }
};

export const fetchDocumentaryCollectionBillByRef = async (billReference: string) => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('outward_documentary_collection_bills')
      .select('*')
      .eq('bill_reference', billReference)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching documentary collection bill:', error);
    throw error;
  }
};
