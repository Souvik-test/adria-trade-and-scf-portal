import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface DocumentRecord {
  id: string;
  documentName: string;
  documentType: 'Export LC' | 'Bank Guarantee' | 'Documentary Collection' | 'Invoice Template' | 'Other';
  direction: 'Uploaded' | 'Received';
  date: string;
  userId: string;
  filePath?: string;
  fileSize?: number;
  sourceTable: string;
  sourceId: string;
}

export interface DocumentFilters {
  documentType?: string;
  direction?: string;
  dateFrom?: string;
  dateTo?: string;
  documentName?: string;
  userId?: string;
}

export const fetchDocuments = async (filters: DocumentFilters): Promise<DocumentRecord[]> => {
  const documents: DocumentRecord[] = [];
  
  // Query export_lc_bill_documents
  const { data: lcDocs } = await supabase
    .from('export_lc_bill_documents')
    .select('*, export_lc_bills(user_id)')
    .order('uploaded_at', { ascending: false });
  
  if (lcDocs) {
    documents.push(...lcDocs.map(doc => ({
      id: doc.id,
      documentName: doc.document_name,
      documentType: 'Export LC' as const,
      direction: 'Uploaded' as const,
      date: doc.uploaded_at,
      userId: doc.export_lc_bills?.user_id || '',
      filePath: doc.file_path,
      fileSize: doc.file_size,
      sourceTable: 'export_lc_bill_documents',
      sourceId: doc.id,
    })));
  }
  
  // Query outward_bg_supporting_documents
  const { data: bgDocs } = await supabase
    .from('outward_bg_supporting_documents')
    .select('*, outward_bg_requests(user_id)')
    .order('uploaded_at', { ascending: false });
  
  if (bgDocs) {
    documents.push(...bgDocs.map(doc => ({
      id: doc.id,
      documentName: doc.file_name,
      documentType: 'Bank Guarantee' as const,
      direction: 'Uploaded' as const,
      date: doc.uploaded_at,
      userId: doc.outward_bg_requests?.user_id || '',
      filePath: doc.file_path,
      fileSize: doc.file_size,
      sourceTable: 'outward_bg_supporting_documents',
      sourceId: doc.id,
    })));
  }
  
  // Query inward_dc_bill_payment_documents
  const { data: dcDocs } = await supabase
    .from('inward_dc_bill_payment_documents')
    .select('*, inward_documentary_collection_bill_payments(user_id)')
    .order('uploaded_at', { ascending: false });
  
  if (dcDocs) {
    documents.push(...dcDocs.map(doc => ({
      id: doc.id,
      documentName: doc.file_name,
      documentType: 'Documentary Collection' as const,
      direction: 'Received' as const,
      date: doc.uploaded_at,
      userId: doc.inward_documentary_collection_bill_payments?.user_id || '',
      filePath: doc.file_path,
      fileSize: doc.file_size,
      sourceTable: 'inward_dc_bill_payment_documents',
      sourceId: doc.id,
    })));
  }
  
  // Apply filters
  let filtered = documents;
  
  if (filters.documentType && filters.documentType !== 'All') {
    filtered = filtered.filter(doc => doc.documentType === filters.documentType);
  }
  
  if (filters.direction && filters.direction !== 'All') {
    filtered = filtered.filter(doc => doc.direction === filters.direction);
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(doc => doc.date >= filters.dateFrom!);
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(doc => doc.date <= filters.dateTo!);
  }
  
  if (filters.documentName) {
    const searchTerm = filters.documentName.toLowerCase();
    filtered = filtered.filter(doc => 
      doc.documentName.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.userId) {
    filtered = filtered.filter(doc => doc.userId.includes(filters.userId!));
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const downloadDocument = async (document: DocumentRecord) => {
  if (!document.filePath) {
    throw new Error('No file path available');
  }
  
  const { data, error } = await supabase.storage
    .from('documents')
    .download(document.filePath);
  
  if (error) throw error;
  
  saveAs(data, document.documentName);
};

export const exportToExcel = (documents: DocumentRecord[]) => {
  const data = documents.map(doc => ({
    'Document Name': doc.documentName,
    'Document Type': doc.documentType,
    'Direction': doc.direction,
    'Date': new Date(doc.date).toLocaleDateString(),
    'User ID': doc.userId,
    'File Size (KB)': doc.fileSize ? (doc.fileSize / 1024).toFixed(2) : '-',
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Documents');
  XLSX.writeFile(wb, `document-inquiry-${new Date().toISOString().split('T')[0]}.xlsx`);
};
