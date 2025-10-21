export interface InvoiceUploadData {
  'Invoice No.': string;
  'Invoice Type': string;
  'Currency': string;
  'Amount': number;
  'Invoice Date': string;
  'Due Date': string;
  'Program ID': string;
  'Program Name': string;
  'Buyer ID': string;
  'Buyer Name': string;
  'Seller ID': string;
  'Seller Name': string;
}

export interface ParsedInvoiceData {
  invoice_number: string;
  invoice_type: string;
  currency: string;
  total_amount: number;
  invoice_date: Date;
  due_date: Date;
  program_id: string;
  program_name: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
}

export interface UploadBatch {
  id: string;
  user_id: string;
  upload_type: 'bulk';
  total_rows: number;
  successful_rows: number;
  rejected_rows: number;
  status: 'processing' | 'completed' | 'failed';
  uploaded_at: string;
}

export interface RejectedRow {
  id: string;
  batch_id: string;
  row_number: number;
  invoice_number: string;
  rejection_reason: string;
  raw_data: any;
}

export interface ScannedDocument {
  id: string;
  scf_invoice_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export interface Disbursement {
  id: string;
  scf_invoice_id: string;
  program_id: string;
  loan_reference: string;
  disbursed_amount: number;
  finance_percentage: number;
  disbursement_status: 'pending' | 'completed' | 'failed';
  accounting_entry_ref?: string;
  disbursed_at?: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  program_id?: string;
  finance_percentage?: number;
}

export interface UploadResult {
  batch: UploadBatch;
  invoices: any[];
  rejections: RejectedRow[];
  disbursements: Disbursement[];
}
