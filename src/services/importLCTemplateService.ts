import { supabase } from '@/integrations/supabase/client';
import { ImportLCFormData } from '@/types/importLC';

export interface ImportLCTemplate {
  id: string;
  user_id: string;
  template_id: string;
  template_name: string;
  product_name: string;
  template_description?: string;
  source_transaction_ref?: string;
  template_data: ImportLCFormData;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  tags?: string[];
}

export const saveAsTemplate = async (
  userId: string,
  templateId: string,
  templateName: string,
  templateDescription: string,
  formData: ImportLCFormData
): Promise<{ success: boolean; error?: string; data?: ImportLCTemplate }> => {
  try {
    const { data, error } = await supabase
      .from('import_lc_templates')
      .insert({
        user_id: userId,
        template_id: templateId,
        template_name: templateName,
        template_description: templateDescription,
        product_name: 'Import LC',
        template_data: formData as any,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as unknown as ImportLCTemplate };
  } catch (error: any) {
    console.error('Unexpected error saving template:', error);
    return { success: false, error: error.message || 'Failed to save template' };
  }
};

export const searchTemplates = async (
  userId: string,
  templateId?: string,
  templateName?: string
): Promise<{ success: boolean; error?: string; data?: ImportLCTemplate[] }> => {
  try {
    let query = supabase
      .from('import_lc_templates')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (templateId) {
      query = query.ilike('template_id', `%${templateId}%`);
    }

    if (templateName) {
      query = query.ilike('template_name', `%${templateName}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching templates:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as unknown as ImportLCTemplate[] };
  } catch (error: any) {
    console.error('Unexpected error searching templates:', error);
    return { success: false, error: error.message || 'Failed to search templates' };
  }
};

export const getTemplateById = async (
  userId: string,
  templateId: string
): Promise<{ success: boolean; error?: string; data?: ImportLCTemplate }> => {
  try {
    const { data, error } = await supabase
      .from('import_lc_templates')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as unknown as ImportLCTemplate };
  } catch (error: any) {
    console.error('Unexpected error fetching template:', error);
    return { success: false, error: error.message || 'Failed to fetch template' };
  }
};

export const deleteTemplate = async (
  userId: string,
  templateId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('import_lc_templates')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('template_id', templateId);

    if (error) {
      console.error('Error deleting template:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error deleting template:', error);
    return { success: false, error: error.message || 'Failed to delete template' };
  }
};

export const updateTemplate = async (
  userId: string,
  templateId: string,
  templateName: string,
  templateDescription: string,
  formData: ImportLCFormData
): Promise<{ success: boolean; error?: string; data?: ImportLCTemplate }> => {
  try {
    const { data, error } = await supabase
      .from('import_lc_templates')
      .update({
        template_name: templateName,
        template_description: templateDescription,
        template_data: formData as any,
      })
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as unknown as ImportLCTemplate };
  } catch (error: any) {
    console.error('Unexpected error updating template:', error);
    return { success: false, error: error.message || 'Failed to update template' };
  }
};

export const searchImportLCTransactions = async (
  userId: string,
  transactionId?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<{ success: boolean; error?: string; data?: any[] }> => {
  try {
    let query = supabase
      .from('import_lc_requests')
      .select('*')
      .eq('user_id', userId);

    if (transactionId) {
      query = query.ilike('corporate_reference', `%${transactionId}%`);
    }

    if (dateFrom) {
      query = query.gte('issue_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('issue_date', dateTo);
    }

    const { data, error } = await query.order('issue_date', { ascending: false });

    if (error) {
      console.error('Error searching transactions:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Unexpected error searching transactions:', error);
    return { success: false, error: error.message || 'Failed to search transactions' };
  }
};
