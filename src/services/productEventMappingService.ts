import { supabase } from "@/integrations/supabase/client";

export interface ProductEventMapping {
  id: string;
  module_code: string;
  module_name: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
  target_audience: string[];
  business_application: string[];
}

// Cache for mappings to avoid repeated database calls
let mappingsCache: ProductEventMapping[] | null = null;
let cachedBusinessApplication: string | null = null;

export const fetchProductEventMappings = async (businessApplication: string): Promise<ProductEventMapping[]> => {
  // Return cached data if available for the same business application
  if (mappingsCache && cachedBusinessApplication === businessApplication) {
    return mappingsCache;
  }

  try {
    const { data, error } = await supabase
      .from('product_event_mapping')
      .select('*')
      .contains('business_application', [businessApplication]);

    if (error) {
      console.error('Error fetching product event mappings:', error);
      return [];
    }

    mappingsCache = data as ProductEventMapping[];
    cachedBusinessApplication = businessApplication;
    return mappingsCache;
  } catch (err) {
    console.error('Error fetching product event mappings:', err);
    return [];
  }
};

export const clearMappingsCache = () => {
  mappingsCache = null;
  cachedBusinessApplication = null;
};

export const getProductNameByCode = (mappings: ProductEventMapping[], productCode: string): string | null => {
  const mapping = mappings.find(m => m.product_code === productCode);
  return mapping?.product_name || null;
};

export const getEventNameByCode = (
  mappings: ProductEventMapping[], 
  productCode: string, 
  eventCode: string
): string | null => {
  const mapping = mappings.find(m => m.product_code === productCode && m.event_code === eventCode);
  return mapping?.event_name || null;
};

export const getEventsByProductCode = (
  mappings: ProductEventMapping[], 
  productCode: string
): ProductEventMapping[] => {
  return mappings.filter(m => m.product_code === productCode);
};

// Default fallback mappings when no database mappings are found
export const defaultProductNames: Record<string, string> = {
  ILC: 'Import Letter of Credit',
  ELC: 'Export Letter of Credit',
  OBG: 'Outward Bank Guarantee/SBLC',
  IBG: 'Inward Bank Guarantee/SBLC',
  ODC: 'Outward Documentary Collection',
  IDC: 'Inward Documentary Collection',
  SHG: 'Shipping Guarantee',
  TRL: 'Trade Loan',
  ILB: 'Import LC Bills',
  ELB: 'Export LC Bills',
  OSB: 'Outward Documentary Collection Bills',
  ISB: 'Inward Documentary Collection Bills'
};

export const defaultEventNames: Record<string, Record<string, string>> = {
  ILC: {
    ISS: 'Request Issuance',
    AMD: 'Request Amendment',
    CAN: 'Request Cancellation'
  },
  ELC: {
    REV: 'Review Pre-adviced LC',
    AMD: 'Record Amendment Consent',
    TRF: 'Request Transfer',
    ASG: 'Request Assignment'
  },
  OBG: {
    ISS: 'Request Issuance',
    AMD: 'Request Amendment',
    CAN: 'Request Cancellation'
  },
  IBG: {
    CON: 'Record Amendment Consent',
    DEM: 'Record Demand/Claim'
  },
  ODC: {
    SUB: 'Submit Bill',
    UPD: 'Update Bill',
    FIN: 'Request Discount/Finance'
  },
  IDC: {
    ACC: 'Accept/Refuse Bill',
    PAY: 'Record Payment',
    FIN: 'Request Finance'
  },
  SHG: {
    ISS: 'Create Shipping Guarantee',
    UPD: 'Update Shipping Guarantee',
    LNK: 'Link/Delink Shipping Guarantee'
  },
  ILB: {
    SUB: 'Submit Bill',
    UPD: 'Update Bill'
  },
  ELB: {
    SUB: 'Submit Bill',
    UPD: 'Update Bill'
  }
};
