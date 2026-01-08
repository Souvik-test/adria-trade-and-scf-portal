import { supabase } from '@/integrations/supabase/client';

export interface ProductDefinition {
  id: string;
  user_id: string;
  product_code: string;
  product_name: string;
  product_description?: string;
  anchor_role: string;
  counter_party_role: string;
  borrower_role?: string;
  underlying_instrument: string;
  effective_date: string;
  expiry_date?: string;
  is_active: boolean;
  authorization_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  productCode: string;
  productName: string;
  productDescription?: string;
  anchorRole: string;
  productCentric?: string;
  counterPartyRole: string;
  borrowerRole?: string;
  underlyingInstrument: string;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
  authorizationRequired: boolean;
  isConventional?: boolean;
}

// Map camelCase to snake_case for database
const toDbFormat = (formData: ProductFormData, userId: string) => ({
  user_id: userId,
  product_code: formData.productCode,
  product_name: formData.productName,
  product_description: formData.productDescription || null,
  anchor_role: formData.anchorRole,
  product_centric: formData.productCentric || null,
  counter_party_role: formData.counterPartyRole,
  borrower_role: formData.borrowerRole || null,
  underlying_instrument: formData.underlyingInstrument,
  effective_date: formData.effectiveDate,
  expiry_date: formData.expiryDate || null,
  is_active: formData.isActive,
  authorization_required: formData.authorizationRequired,
});

// Map snake_case to camelCase for UI
const toUiFormat = (dbProduct: any): ProductFormData & { id: string } => ({
  id: dbProduct.id,
  productCode: dbProduct.product_code,
  productName: dbProduct.product_name,
  productDescription: dbProduct.product_description,
  anchorRole: dbProduct.anchor_role,
  productCentric: dbProduct.product_centric,
  counterPartyRole: dbProduct.counter_party_role,
  borrowerRole: dbProduct.borrower_role,
  underlyingInstrument: dbProduct.underlying_instrument,
  effectiveDate: dbProduct.effective_date,
  expiryDate: dbProduct.expiry_date,
  isActive: dbProduct.is_active,
  authorizationRequired: dbProduct.authorization_required,
  isConventional: dbProduct.is_conventional ?? false,
});

export const fetchProducts = async (userId: string) => {
  // Fetch all products (conventional + user's custom products)
  const { data, error } = await supabase
    .from('scf_product_definitions')
    .select('*')
    .order('is_conventional', { ascending: false }) // Conventional products first
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  return data?.map(toUiFormat) || [];
};

export const createProduct = async (formData: ProductFormData, userId: string) => {
  const dbData = toDbFormat(formData, userId);

  const { data, error } = await supabase
    .from('scf_product_definitions')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }

  return toUiFormat(data);
};

export const updateProduct = async (id: string, formData: ProductFormData, userId: string) => {
  const dbData = toDbFormat(formData, userId);

  const { data, error } = await supabase
    .from('scf_product_definitions')
    .update(dbData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }

  return toUiFormat(data);
};

export const deleteProduct = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('scf_product_definitions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

export const toggleProductActive = async (id: string, isActive: boolean, userId: string) => {
  const { data, error } = await supabase
    .from('scf_product_definitions')
    .update({ is_active: !isActive })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling product active status:', error);
    throw new Error('Failed to toggle product status');
  }

  return toUiFormat(data);
};
